import type { NextApiRequest, NextApiResponse } from 'next'
import { getServiceSupabase } from '../../lib/supabaseClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = getServiceSupabase()

  if (req.method === 'GET') {
    try {
      const { case_id } = req.query

      const query = supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (case_id) {
        query.eq('case_id', case_id)
      }

      const { data, error } = await query

      if (error) throw error

      res.status(200).json({ documents: data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { case_id, title, description, file_path, file_name, file_size, mime_type, uploaded_by } = req.body

      const { data, error } = await supabase
        .from('documents')
        .insert({
          case_id,
          title,
          description,
          file_path,
          file_name,
          file_size,
          mime_type,
          uploaded_by,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      res.status(201).json({ document: data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
