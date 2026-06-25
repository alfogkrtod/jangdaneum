export interface Profile {
  id: string
  name: string
  motto: string | null
  avatar_url: string | null
  streak: number
  avg_flow_time: number
  is_premium: boolean
  google_synced: boolean
  apple_synced: boolean
  language: string
  theme: string
  created_at: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
