import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing invoice id' })
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
  const { data: invoice, error: invError } = await supabase
    .from('user_invoices')
    .select('id, user_id, file_path, file_name')
    .eq('id', id)
    .single()

  if (invError || !invoice) {
    return res.status(404).json({ error: 'Invoice not found' })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'
  if (invoice.user_id !== user.id && !isAdmin) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const { data: signed, error: signError } = await supabase.storage
    .from('invoices')
    .createSignedUrl(invoice.file_path, 60)

  if (signError || !signed?.signedUrl) {
    console.error('Signed URL error:', signError)
    return res.status(500).json({ error: 'Could not generate download link' })
  }

  return res.status(200).json({ url: signed.signedUrl, file_name: invoice.file_name })
}
