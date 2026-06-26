import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth.js'
import { supabaseAdmin } from '../supabase.js'

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

  res.status(201).json({ success: true, data })
})

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id
  const { id } = req.params

  const { data: existing } = await supabaseAdmin
    .from('events')
    .select('id')
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

  res.json({ success: true, data })
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id
  const { id } = req.params

  const { data: existing } = await supabaseAdmin
    .from('events')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!existing) {
    return res.status(404).json({ success: false, error: 'Event not found' })
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
