import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdminApi } from '../../../lib/apiAuth'
import { getServiceSupabase } from '../../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const admin = await requireAdminApi(req, res)
  if (!admin) return

  const { userId } = req.body as { userId?: string }
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing userId' })
  }

  const supabase = getServiceSupabase()
  const { error } = await supabase
    .from('users')
    .update({ paid_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) {
    console.error('Mark paid error:', error)
    return res.status(500).json({ error: error.message || 'Update failed' })
  }

  return res.status(200).json({ success: true })
}
