import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../supabase.js'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email?: string
  }
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.user = { id: user.id, email: user.email }
  next()
}
