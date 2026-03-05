import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@supabase/ssr'
import { getServiceSupabase } from '../../../lib/supabaseClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const { caseId, userId, title, description, fileName, fileSize, mimeType } = req.body

    if (!supabaseUrl || !anonKey) {
      return res.status(500).json({ error: 'Missing Supabase credentials' })
    }

    if (!caseId || !userId || !title) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const server = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        getAll() {
          return Object.entries(req.cookies || {}).map(([name, value]) => ({ name, value: value || '', options: {} }))
        },
        setAll() {},
      },
    })
    const { data: { user } } = await server.auth.getUser()
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const supabaseAdmin = getServiceSupabase()
    const { data: profile } = await supabaseAdmin.from('users').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'
    if (user.id !== userId && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const supabase = getServiceSupabase()

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
