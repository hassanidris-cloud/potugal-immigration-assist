import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticateRequest } from '../../lib/serverAuth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await authenticateRequest(req)
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error })
  }

  const supabase = auth.supabaseAdmin

  if (req.method === 'GET') {
    try {
      const caseId = typeof req.query.case_id === 'string' ? req.query.case_id : undefined

      const query = supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (caseId) {
        const { data: caseData, error: caseError } = await supabase
          .from('cases')
          .select('id, user_id')
          .eq('id', caseId)
          .single()

        if (caseError || !caseData) {
          return res.status(404).json({ error: 'Case not found' })
        }

        if (!auth.isAdmin && caseData.user_id !== auth.user.id) {
          return res.status(403).json({ error: 'Forbidden' })
        }

        query.eq('case_id', caseId)
      } else if (!auth.isAdmin) {
        const { data: userCases, error: userCasesError } = await supabase
          .from('cases')
          .select('id')
          .eq('user_id', auth.user.id)

        if (userCasesError) {
          throw userCasesError
        }

        const caseIds = (userCases || []).map((c) => c.id)
        if (caseIds.length === 0) {
          return res.status(200).json({ documents: [] })
        }

        query.in('case_id', caseIds)
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

      if (!case_id || typeof case_id !== 'string' || !title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('id, user_id')
        .eq('id', case_id)
        .single()

      if (caseError || !caseData) {
        return res.status(404).json({ error: 'Case not found' })
      }

      if (!auth.isAdmin && caseData.user_id !== auth.user.id) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      const uploadedBy =
        auth.isAdmin && typeof uploaded_by === 'string' ? uploaded_by : auth.user.id

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
          uploaded_by: uploadedBy,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      res.status(201).json({ document: data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
