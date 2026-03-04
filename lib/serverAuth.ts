import type { NextApiRequest } from 'next'
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

type AuthFailure = {
  ok: false
  status: number
  error: string
}

type AuthSuccess = {
  ok: true
  user: User
  token: string
  isAdmin: boolean
  supabaseAdmin: SupabaseClient
  supabaseUser: SupabaseClient
}

export type AuthResult = AuthFailure | AuthSuccess

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return null
  }

  return { supabaseUrl, supabaseAnonKey, serviceRoleKey }
}

function getBearerToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice('Bearer '.length).trim()
  return token || null
}

export async function authenticateRequest(req: NextApiRequest): Promise<AuthResult> {
  const config = getSupabaseConfig()
  if (!config) {
    return {
      ok: false,
      status: 500,
      error: 'Server configuration error',
    }
  }

  const token = getBearerToken(req)
  if (!token) {
    return {
      ok: false,
      status: 401,
      error: 'Missing or invalid authorization header',
    }
  }

  const { supabaseUrl, supabaseAnonKey, serviceRoleKey } = config
  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey)
  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser(token)

  if (authError || !user) {
    return {
      ok: false,
      status: 401,
      error: 'Unauthorized',
    }
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    return {
      ok: false,
      status: 500,
      error: profileError.message || 'Failed to load user profile',
    }
  }

  const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  return {
    ok: true,
    user,
    token,
    isAdmin: profile?.role === 'admin',
    supabaseAdmin,
    supabaseUser,
  }
}
