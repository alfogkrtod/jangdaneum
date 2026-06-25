import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth.js'
import { supabaseAdmin } from '../supabase.js'

const router = Router()

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', req.user!.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ success: false, error: error.message })
  }

  if (!data) {
    const { data: { user } } = await supabaseAdmin.auth.getUser(
      req.headers.authorization!.replace('Bearer ', '')
    )

    return res.json({
      success: true,
      data: {
        id: req.user!.id,
        email: req.user!.email,
        profile: null,
        created_at: user?.created_at,
      }
    })
  }

  res.json({
    success: true,
    data: {
      id: req.user!.id,
      email: req.user!.email,
      profile: data,
    }
  })
})

export default router
