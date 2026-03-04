import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticateRequest } from '../../../lib/serverAuth'

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

  const auth = await authenticateRequest(req)
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error })
  }

  const supabase = auth.supabaseAdmin
  const { data: invoice, error: invError } = await supabase
    .from('user_invoices')
    .select('id, user_id, file_path, file_name')
    .eq('id', id)
    .single()

  if (invError || !invoice) {
    return res.status(404).json({ error: 'Invoice not found' })
  }

  if (invoice.user_id !== auth.user.id && !auth.isAdmin) {
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
