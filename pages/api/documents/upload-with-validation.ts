import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@supabase/ssr'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { createWorker } from 'tesseract.js'
import pdfParse from 'pdf-parse'
import { getServiceSupabase } from '../../../lib/supabaseClient'
import { validateDocumentText } from '../../../lib/documentValidation'

export const config = {
  api: { bodyParser: false },
}

interface ParsedFile {
  filepath: string
  originalFilename?: string
  newFilename?: string
  mimetype?: string | null
  size: number
}

async function parseForm(req: NextApiRequest): Promise<{ fields: Record<string, string>; file: ParsedFile }> {
  const uploadDir = path.join(process.cwd(), 'tmp', 'uploads')
  if (!fs.existsSync(path.dirname(uploadDir))) {
    fs.mkdirSync(path.dirname(uploadDir), { recursive: true })
  }
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 25 * 1024 * 1024, // 25 MB
  })
  const [fields, files] = await form.parse(req)
  const fileList = files?.file
  const file = Array.isArray(fileList) ? fileList[0] : fileList
  if (!file?.filepath) throw new Error('No file uploaded')
  const fieldMap: Record<string, string> = {}
  for (const [k, v] of Object.entries(fields || {})) {
    fieldMap[k] = Array.isArray(v) ? v[0] : v || ''
  }
  return { fields: fieldMap, file: file as ParsedFile }
}

async function extractTextFromFile(filePath: string, mimeType?: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase()
  const isPdf = ext === '.pdf' || mimeType === 'application/pdf'
  if (isPdf) {
    try {
      const buffer = fs.readFileSync(filePath)
      const data = await pdfParse(buffer)
      const text = (data?.text || '').trim()
      if (text.length > 50) return text
    } catch {
      // PDF might be image-only; fall through to OCR
    }
  }
  let worker: Awaited<ReturnType<typeof createWorker>> | null = null
  try {
    worker = await createWorker('eng', 1, { logger: () => {} })
    const { data } = await worker.recognize(filePath)
    return (data?.text || '').trim()
  } finally {
    if (worker) await worker.terminate().catch(() => {})
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let tmpFilePath: string | null = null
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !anonKey || !serviceKey) {
      return res.status(500).json({ error: 'Server configuration error' })
    }

    const supabaseServer = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        getAll() {
          return Object.entries(req.cookies || {}).map(([name, value]) => ({
            name,
            value: value || '',
            options: {},
          }))
        },
        setAll() {},
      },
    })
    const { data: { user } } = await supabaseServer.auth.getUser()
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { fields, file } = await parseForm(req)
    tmpFilePath = file.filepath
    const caseId = (fields.case_id || fields.caseId || '').trim()
    const caseChecklistId = (fields.case_checklist_id || '').trim() || null
    const title = (fields.title || '').trim()
    const description = (fields.description || '').trim()
    if (!caseId || !title) {
      return res.status(400).json({ error: 'Missing case_id or title' })
    }

    let checklistItemTitle = title
    if (caseChecklistId) {
      const supabase = getServiceSupabase()
      const { data: row } = await supabase
        .from('case_checklist')
        .select('title')
        .eq('id', caseChecklistId)
        .eq('case_id', caseId)
        .single()
      if (row?.title) checklistItemTitle = row.title
    }

    const ocrText = await extractTextFromFile(file.filepath, file.mimetype || undefined)
    const validation = validateDocumentText(ocrText, checklistItemTitle)
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Document validation failed',
        reason: validation.reason,
      })
    }

    const supabase = getServiceSupabase()
    const fileExt = path.extname(file.originalFilename || file.newFilename || '') || '.bin'
    const storageFileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${fileExt}`
    const storagePath = `${caseId}/${storageFileName}`
    const fileBuffer = fs.readFileSync(file.filepath)

    const { error: storageError } = await supabase.storage
      .from('documents')
      .upload(storagePath, fileBuffer, {
        contentType: file.mimetype || 'application/octet-stream',
        upsert: false,
      })
    if (storageError) {
      const reason = storageError.message || 'Storage upload failed'
      return res.status(500).json({ error: 'Storage upload failed', reason })
    }

    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        case_id: caseId,
        case_checklist_id: caseChecklistId || null,
        title,
        description: description || null,
        file_path: storagePath,
        file_name: file.originalFilename || file.newFilename || 'document',
        file_size: file.size,
        mime_type: file.mimetype || null,
        uploaded_by: user.id,
        status: 'pending',
      })
      .select()
      .single()
    if (docError) {
      const reason = docError.message || 'Failed to save document record'
      return res.status(500).json({ error: 'Failed to create document record', reason })
    }
    return res.status(200).json({ success: true, document: docData })
  } catch (err: any) {
    console.error('Upload with validation error:', err)
    const reason = err.message || 'Upload failed'
    const isSize = /size|large|limit|25\s*MB/i.test(reason)
    const message = isSize ? `File too large. Maximum size is 25 MB. (${reason})` : reason
    return res.status(500).json({ error: 'Upload failed', reason: message })
  } finally {
    if (tmpFilePath && fs.existsSync(tmpFilePath)) {
      try { fs.unlinkSync(tmpFilePath) } catch {}
    }
  }
}
