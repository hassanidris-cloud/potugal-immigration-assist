import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { approveUserAndNotify } from '../../../lib/accountApprovalNotification'

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

  try {
    const approvalResult = await approveUserAndNotify(supabase, userId)

    if (approvalResult.status === 'not_found') {
      return res.status(404).json({ error: 'User not found' })
    }

    if (approvalResult.status === 'admin_skipped') {
      return res.status(400).json({ error: 'Cannot mark admin accounts as paid' })
    }

    if (approvalResult.emailIssue) {
      console.warn('Mark paid email issue:', approvalResult.emailIssue)
    }

    return res.status(200).json({
      success: true,
      status: approvalResult.status,
      emailSent: approvalResult.emailSent,
      ...(approvalResult.emailIssue ? { emailIssue: approvalResult.emailIssue } : {}),
    })
  } catch (error: any) {
    console.error('Mark paid error:', error)
    return res.status(500).json({ error: error.message || 'Update failed' })
  }
}
