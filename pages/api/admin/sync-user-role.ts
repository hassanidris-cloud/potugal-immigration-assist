import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticateRequest } from '../../../lib/serverAuth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await authenticateRequest(req)
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error })
  }
  if (!auth.isAdmin) {
    return res.status(403).json({ error: 'Admin required' })
  }

  const { userId, role } = req.body as {
    userId: string
    role: 'client' | 'admin'
  }

  if (!userId || !role || !['client', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Missing or invalid userId / role (use client or admin)' })
  }

  const supabase = auth.supabaseAdmin

  try {
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (userUpdateError) {
      throw userUpdateError
    }

    const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(userId)
    if (authUserError || !authUser.user) {
      throw authUserError || new Error('User not found in auth system')
    }

    const existing = (authUser?.user?.app_metadata as Record<string, unknown>) || {}
    const { error: metadataError } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { ...existing, role },
    })
    if (metadataError) {
      throw metadataError
    }

    return res.status(200).json({ success: true, message: 'Role updated in public.users and Auth app_metadata' })
  } catch (e: any) {
    console.error('sync-user-role error:', e)
    return res.status(500).json({ error: e?.message || 'Failed to sync role' })
  }
}
