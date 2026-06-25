import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth.js'
import { supabaseAdmin } from '../supabase.js'

const router = Router()

router.get('/:id', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return res.status(404).json({ success: false, error: 'Profile not found' })
  }

  res.json({ success: true, data })
})

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  if (req.user!.id !== req.params.id) {
    return res.status(403).json({ success: false, error: 'Forbidden' })
  }

  const allowedFields = [
    'name', 'motto', 'avatar_url', 'streak', 'avg_flow_time',
    'is_premium', 'google_synced', 'apple_synced', 'language', 'theme'
  ]

  const updates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field]
    }
  }

  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) {
    return res.status(500).json({ success: false, error: error.message })
  }

  res.json({ success: true, data })
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', req.user!.id)
    .single()

  if (existing) {
    return res.status(409).json({ success: false, error: 'Profile already exists' })
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: req.user!.id,
      name: req.body.name || 'User',
      motto: req.body.motto || '',
      avatar_url: req.body.avatar_url || '',
      language: req.body.language || 'ko',
      theme: req.body.theme || 'organic',
    })
    .select()
    .single()

  if (error) {
    return res.status(500).json({ success: false, error: error.message })
  }

  res.status(201).json({ success: true, data })
})

export default router
