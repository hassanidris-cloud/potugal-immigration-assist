import { NextApiRequest, NextApiResponse } from 'next'
import { authenticateRequest } from '../../../lib/serverAuth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await authenticateRequest(req)
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error })
  }

  try {
    const supabaseAdmin = auth.supabaseAdmin

    // Delete from auth.users (this will cascade delete public.users due to foreign key)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(auth.user.id)

    if (authError) throw authError

    res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('Delete account error:', error)
    res.status(500).json({ error: error.message })
  }
}
