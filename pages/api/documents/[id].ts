import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticateRequest } from '../../../lib/serverAuth'

const ALLOWED_DOCUMENT_STATUSES = new Set([
  'pending',
  'approved',
  'rejected',
  'needs_revision',
])

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = typeof req.query.id === 'string' ? req.query.id : undefined
  if (!id) {
    return res.status(400).json({ error: 'Missing document id' })
  }

  if (req.method !== 'GET' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await authenticateRequest(req)
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error })
  }

  const supabase = auth.supabaseAdmin

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*, cases:case_id(user_id)')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) {
        return res.status(404).json({ error: 'Document not found' })
      }

      const caseOwnerId = (data as { cases?: { user_id?: string } | null }).cases?.user_id
      if (!auth.isAdmin && caseOwnerId !== auth.user.id) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      const document = { ...(data as Record<string, unknown>) }
      delete (document as { cases?: unknown }).cases

      res.status(200).json({ document })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PATCH') {
    try {
      if (!auth.isAdmin) {
        return res.status(403).json({ error: 'Admin only' })
      }

      const { status, admin_notes } = req.body

      const updateData: any = {}
      if (status) {
        if (typeof status !== 'string' || !ALLOWED_DOCUMENT_STATUSES.has(status)) {
          return res.status(400).json({ error: 'Invalid document status' })
        }
        updateData.status = status
      }
      if (admin_notes !== undefined) updateData.admin_notes = admin_notes
      if (status || admin_notes !== undefined) {
        updateData.reviewed_by = auth.user.id
        updateData.reviewed_at = new Date().toISOString()
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' })
      }

      const { data, error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Document not found' })
        }
        throw error
      }

      res.status(200).json({ document: data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
