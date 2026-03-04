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
    return res.status(403).json({ error: 'Admin only' })
  }

  const supabase = auth.supabaseAdmin

  const { userId } = req.body as { userId?: string }
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing userId' })
  }

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
