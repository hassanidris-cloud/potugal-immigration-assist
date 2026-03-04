import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticateRequest } from '../../../lib/serverAuth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const auth = await authenticateRequest(req)
    if (!auth.ok) {
      return res.status(auth.status).json({ error: auth.error })
    }

    const { caseId, title, description, fileName, fileSize, mimeType } = req.body

    if (!caseId || typeof caseId !== 'string' || !title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const supabase = auth.supabaseAdmin

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

    // Create file path
    const fileExt = fileName?.split('.').pop() || 'bin'
    const storagePath = `${caseId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Create document record (using service role to bypass RLS)
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        case_id: caseId,
        title: title || fileName,
        description: description || '',
        file_path: storagePath,
        file_name: fileName || 'document',
        file_size: fileSize || 0,
        mime_type: mimeType || 'application/octet-stream',
        uploaded_by: auth.user.id,
        status: 'pending',
      })
      .select()
      .single()

    if (docError) {
      console.error('Document insert error:', docError)
      throw docError
    }

    res.status(200).json({
      success: true,
      document: docData,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    res.status(500).json({ error: error.message || 'Upload failed' })
  }
}
