import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdminApi } from '../../../lib/apiAuth'
import { getServiceSupabase } from '../../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const admin = await requireAdminApi(req, res)
  if (!admin) return

  const { userId, role } = req.body as { userId: string; role: 'client' | 'admin'; adminUserId?: string }

  if (!userId || !role || !['client', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Missing or invalid userId / role (use client or admin)' })
  }

  const supabase = getServiceSupabase()

  try {
    await supabase.from('users').update({ role, updated_at: new Date().toISOString() }).eq('id', userId)

    const { data: authUser } = await supabase.auth.admin.getUserById(userId)
    const existing = (authUser?.user?.app_metadata as Record<string, unknown>) || {}
    await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { ...existing, role },
    })

    return res.status(200).json({ success: true, message: 'Role updated in public.users and Auth app_metadata' })
  } catch (e: any) {
    console.error('sync-user-role error:', e)
    return res.status(500).json({ error: e?.message || 'Failed to sync role' })
  }
}
