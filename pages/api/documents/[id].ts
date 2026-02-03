import type { NextApiRequest, NextApiResponse } from 'next'
import { getServiceSupabase } from '../../../lib/supabaseClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const supabase = getServiceSupabase()

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      res.status(200).json({ document: data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PATCH') {
    try {
      const { status, admin_notes, reviewed_by } = req.body

      const updateData: any = {}
      if (status) updateData.status = status
      if (admin_notes !== undefined) updateData.admin_notes = admin_notes
      if (reviewed_by) {
        updateData.reviewed_by = reviewed_by
        updateData.reviewed_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      res.status(200).json({ document: data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
