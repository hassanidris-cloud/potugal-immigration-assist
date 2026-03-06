import { supabase } from './supabaseClient'

type UploadDocumentInput = {
  caseId: string
  file: File
  title?: string
  description?: string
}

export async function uploadDocumentForCase({
  caseId,
  file,
  title,
  description,
}: UploadDocumentInput) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const fileExt = file.name.split('.').pop() || 'bin'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const filePath = `${caseId}/${fileName}`

  const { error: storageError } = await supabase.storage
    .from('documents')
    .upload(filePath, file)

  if (storageError) {
    throw storageError
  }

  const { data: document, error: docError } = await supabase
    .from('documents')
    .insert({
      case_id: caseId,
      title: title || file.name,
      description: description || '',
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      uploaded_by: user.id,
      status: 'pending',
    })
    .select()
    .single()

  if (docError) {
    // Best-effort cleanup if DB insert fails after upload.
    await supabase.storage.from('documents').remove([filePath])
    throw docError
  }

  return document
}
