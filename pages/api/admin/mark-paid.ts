import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const authHeader = req.headers.authorization
  if (!supabaseUrl || !serviceRoleKey || !authHeader?.startsWith('Bearer ')) {
    return res.status(500).json({ error: 'Server or auth error' })
  }

  const token = authHeader.replace('Bearer ', '')
  const supabaseAuth = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' })
  }

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
