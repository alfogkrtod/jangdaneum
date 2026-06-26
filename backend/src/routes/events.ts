import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth.js'
import { supabaseAdmin } from '../supabase.js'
import { getGoogleCalendarForUser, toGoogleEvent } from './calendar.js'

const router = Router()

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id
  const { date } = req.query

  let query = supabaseAdmin
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  if (date) {
    query = query.eq('date', date as string)
  }

  const { data, error } = await query

  if (error) {
    return res.status(500).json({ success: false, error: error.message })
  }

  res.json({ success: true, data })
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id
  const { title, type, date, time, duration, description, category } = req.body

  if (!title || !type || !date || !time || !duration) {
    return res.status(400).json({ success: false, error: 'Missing required fields' })
  }

  const { data, error } = await supabaseAdmin
    .from('events')
    .insert({
      user_id: userId,
      title,
      type,
      date,
      time,
      duration,
      description: description || null,
      category: category || null,
    })
    .select()
    .single()

  if (error) {
    return res.status(500).json({ success: false, error: error.message })
  }

  // Write-through to Google Calendar
  const calendar = await getGoogleCalendarForUser(userId)
  if (calendar) {
    try {
      const gEvent = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: toGoogleEvent({ title, date, time, duration, description }),
      })
      const gEventId = gEvent.data.id

      await supabaseAdmin
        .from('events')
        .update({ google_event_id: gEventId, updated_at: new Date().toISOString() })
        .eq('id', data.id)

      data.google_event_id = gEventId
    } catch {
      // Google write failed — event still saved locally
    }
  }

  res.status(201).json({ success: true, data })
})

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id
  const { id } = req.params

  const { data: existing } = await supabaseAdmin
    .from('events')
    .select('id, google_event_id, title, date, time, duration, description')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!existing) {
    return res.status(404).json({ success: false, error: 'Event not found' })
  }

  const allowedFields = ['title', 'type', 'date', 'time', 'duration', 'description', 'category']
  const updates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field]
    }
  }
  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabaseAdmin
    .from('events')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    return res.status(500).json({ success: false, error: error.message })
  }

  // Write-through to Google Calendar
  const calendar = await getGoogleCalendarForUser(userId)
  if (calendar) {
    try {
      const gPayload = toGoogleEvent({
        title: (updates.title as string) || existing.title,
        date: (updates.date as string) || existing.date,
        time: (updates.time as string) || existing.time,
        duration: (updates.duration as number) || existing.duration,
        description: (updates.description as string) || existing.description || undefined,
      })

      if (existing.google_event_id) {
        await calendar.events.update({
          calendarId: 'primary',
          eventId: existing.google_event_id,
          requestBody: gPayload,
        })
      } else {
        const gEvent = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: gPayload,
        })
        if (gEvent.data.id) {
          await supabaseAdmin
            .from('events')
            .update({ google_event_id: gEvent.data.id, updated_at: new Date().toISOString() })
            .eq('id', id)
          data.google_event_id = gEvent.data.id
        }
      }
    } catch {
      // Google write failed — event still updated locally
    }
  }

  res.json({ success: true, data })
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id
  const { id } = req.params

  const { data: existing } = await supabaseAdmin
    .from('events')
    .select('id, google_event_id')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!existing) {
    return res.status(404).json({ success: false, error: 'Event not found' })
  }

  // Write-through to Google Calendar
  if (existing.google_event_id) {
    const calendar = await getGoogleCalendarForUser(userId)
    if (calendar) {
      try {
        await calendar.events.delete({
          calendarId: 'primary',
          eventId: existing.google_event_id,
        })
      } catch {
        // Google delete failed — event still deleted locally
      }
    }
  }

  const { error } = await supabaseAdmin
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    return res.status(500).json({ success: false, error: error.message })
  }

  res.json({ success: true, data: null })
})

export default router
