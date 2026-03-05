import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import { getServiceSupabase } from './supabaseClient'

/**
 * Result when admin is required. Use getServiceSupabase() for DB writes.
 */
export type AdminApiContext = { user: User }

/**
 * Verifies the request is from an authenticated user with role === 'admin'.
 * Uses Authorization: Bearer <access_token> or session cookies.
 * Returns { user } if valid; otherwise sends 401/403 and returns null.
 * Admin routes must use getServiceSupabase() for DB operations (never expose service role to client).
 */
export async function requireAdminApi(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AdminApiContext | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !anonKey || !serviceKey) {
    res.status(500).json({ error: 'Server configuration error' })
    return null
  }

  let user: User | null = null

  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const authClient = createClient(supabaseUrl, anonKey)
    const { data: { user: u }, error } = await authClient.auth.getUser(token)
    if (!error && u) user = u
  }

  if (!user) {
    const supabaseServer = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        getAll() {
          return Object.entries(req.cookies || {}).map(([name, value]) => ({
            name,
            value: value || '',
            options: {},
          }))
        },
        setAll() {},
      },
    })
    const { data: { user: u } } = await supabaseServer.auth.getUser()
    if (u) user = u
  }

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }

  const supabase = getServiceSupabase()
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    res.status(403).json({ error: 'Admin only' })
    return null
  }

  return { user }
}
