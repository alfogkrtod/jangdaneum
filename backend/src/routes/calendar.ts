import { Router } from 'express'
import { google } from 'googleapis'
import { requireAuth, AuthRequest } from '../middleware/auth.js'
import { supabaseAdmin } from '../supabase.js'

const router = Router()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CALENDAR_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CALENDAR_CLIENT_SECRET || ''
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_CALENDAR_REDIRECT_URI || 'http://localhost:4000/api/calendar/callback'

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
)

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

router.get('/auth-url', requireAuth, async (req: AuthRequest, res) => {
  const state = Buffer.from(JSON.stringify({ userId: req.user!.id, ts: Date.now() })).toString('base64')

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state,
  })

  res.json({ success: true, data: { url } })
})

router.get('/callback', async (req, res) => {
  const { code, state } = req.query

  if (!code || !state) {
    return res.redirect(`/api/calendar/close?status=error`)
  }

  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(state as string, 'base64').toString())
    userId = decoded.userId
    if (!userId || Date.now() - decoded.ts > 600000) {
      throw new Error('Invalid or expired state')
    }
  } catch {
    return res.redirect(`/api/calendar/close?status=error`)
  }

  try {
    const { tokens } = await oauth2Client.getToken(code as string)

    if (!tokens.refresh_token) {
      return res.redirect(`/api/calendar/close?status=error`)
    }

    const { error: upsertError } = await supabaseAdmin
      .from('calendar_tokens')
      .upsert({
        user_id: userId,
        refresh_token: tokens.refresh_token,
        token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      }, { onConflict: 'user_id' })

    if (upsertError) {
      return res.redirect(`/api/calendar/close?status=error`)
    }

    await supabaseAdmin
      .from('profiles')
      .update({ google_synced: true, updated_at: new Date().toISOString() })
      .eq('id', userId)

    res.redirect(`/api/calendar/close?status=connected`)
  } catch {
    res.redirect(`/api/calendar/close?status=error`)
  }
})

router.get('/close', (_req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`
    <script>
      window.opener.postMessage({ type: 'calendar_connected' }, '*');
      window.close();
    </script>
  `)
})

router.post('/sync', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id

  const { data: tokenData, error: tokenError } = await supabaseAdmin
    .from('calendar_tokens')
    .select('refresh_token')
    .eq('user_id', userId)
    .single()

  if (tokenError || !tokenData) {
    return res.status(400).json({ success: false, error: 'No Google Calendar token found. Connect first.' })
  }

  oauth2Client.setCredentials({ refresh_token: tokenData.refresh_token })

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const now = new Date()
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: weekLater.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const gEvents = response.data.items || []
    let imported = 0

    for (const gEvent of gEvents) {
      const title = gEvent.summary || '(No Title)'
      const start = gEvent.start?.dateTime || gEvent.start?.date
      if (!start) continue

      const startDate = new Date(start)
      const dateStr = startDate.toISOString().split('T')[0]
      const timeStr = startDate.toTimeString().slice(0, 5)
      const end = gEvent.end?.dateTime || gEvent.end?.date
      const durationMin = end
        ? Math.round((new Date(end).getTime() - startDate.getTime()) / 60000)
        : 60

      const { data: existing } = await supabaseAdmin
        .from('events')
        .select('id')
        .eq('google_event_id', gEvent.id)
        .eq('user_id', userId)
        .maybeSingle()

      if (existing) continue

      const { error: insertError } = await supabaseAdmin
        .from('events')
        .insert({
          user_id: userId,
          title,
          type: 'flexible',
          date: dateStr,
          time: timeStr,
          duration: Math.max(durationMin, 15),
          description: gEvent.description || null,
          category: null,
          google_event_id: gEvent.id,
        })

      if (!insertError) imported++
    }

    res.json({ success: true, data: { imported } })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to sync Google Calendar' })
  }
})

export default router
