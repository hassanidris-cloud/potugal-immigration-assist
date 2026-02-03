import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const { caseId, userId, title, description, fileName, fileSize, mimeType } = req.body

    if (!supabaseUrl || !serviceRoleKey) {
      return res.status(500).json({ error: 'Missing Supabase credentials' })
    }

    if (!caseId || !userId || !title) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

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
        uploaded_by: userId,
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
