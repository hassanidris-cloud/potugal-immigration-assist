import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, role } = req.body as { userId?: string; role?: 'client' | 'admin' }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const authHeader = req.headers.authorization

  if (!userId || typeof userId !== 'string' || !role || !['client', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Missing or invalid userId / role (use client or admin)' })
  }

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const token = authHeader.replace('Bearer ', '')
  const supabaseAuth = createClient(supabaseUrl, anonKey)
  const { data: { user: requester }, error: authError } = await supabaseAuth.auth.getUser(token)
  if (authError || !requester) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  try {
    const { data: requesterProfile, error: requesterError } = await supabase
      .from('users')
      .select('role')
      .eq('id', requester.id)
      .single()
    if (requesterError || requesterProfile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin required' })
    }

    const { error: roleSyncError } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
    if (roleSyncError) {
      throw roleSyncError
    }

    const { data: authUser } = await supabase.auth.admin.getUserById(userId)
    const existing = (authUser?.user?.app_metadata as Record<string, unknown>) || {}
    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { ...existing, role },
    })
    if (authUpdateError) {
      throw authUpdateError
    }

    return res.status(200).json({ success: true, message: 'Role updated in public.users and Auth app_metadata' })
  } catch (e: any) {
    console.error('sync-user-role error:', e)
    return res.status(500).json({ error: e?.message || 'Failed to sync role' })
  }
}
