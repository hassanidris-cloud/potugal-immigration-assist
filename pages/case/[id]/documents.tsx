import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../../lib/supabaseClient'
import Link from 'next/link'

const STOP_WORDS = new Set(['and', 'the', 'for', 'with', 'from', 'into', 'copy', 'document', 'form', 'visa'])

type OcrResult = {
  status: 'matched' | 'mismatch' | 'unavailable' | 'error'
  confidence: number | null
  excerpt: string
}

export default function CaseDocuments() {
  const router = useRouter()
  const { id } = router.query
  const [caseData, setCaseData] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [checklistItems, setChecklistItems] = useState<any[]>([])
  const [documentLinks, setDocumentLinks] = useState<Record<string, any>>({})
  const [selectedChecklistItemId, setSelectedChecklistItemId] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadNotice, setUploadNotice] = useState('')

  useEffect(() => {
    if (id) {
      loadDocuments()
    }
  }, [id])

  const loadDocuments = async () => {
    try {
      // Fetch case
      const { data: caseData } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single()

      setCaseData(caseData)

      // Fetch documents
      const { data: docsData } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', id)
        .order('uploaded_at', { ascending: false })

      setDocuments(docsData || [])

      // Fetch checklist items for explicit linking
      const { data: checklistData } = await supabase
        .from('case_checklist')
        .select('id, title, required, completed, order_index')
        .eq('case_id', id)
        .order('order_index')

      const checklist = checklistData || []
      setChecklistItems(checklist)
      if (!selectedChecklistItemId && checklist.length > 0) {
        setSelectedChecklistItemId(checklist[0].id)
      }

      // Fetch existing links so users can see OCR/link status
      const { data: linksData } = await supabase
        .from('case_checklist_documents')
        .select(`
          document_id,
          checklist_item_id,
          ocr_status,
          ocr_confidence,
          checklist_item:case_checklist ( title )
        `)
        .eq('case_id', id)

      const linkByDocumentId: Record<string, any> = {}
      for (const link of linksData || []) {
        const checklistItem = Array.isArray(link.checklist_item) ? link.checklist_item[0] : link.checklist_item
        linkByDocumentId[link.document_id] = { ...link, checklist_item: checklistItem }
      }
      setDocumentLinks(linkByDocumentId)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  function normalize(input: string): string {
    return input
      .toLowerCase()
      .replace(/\s*\([^)]*\)/g, ' ')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function getChecklistKeywords(title: string): string[] {
    return Array.from(
      new Set(
        normalize(title)
          .split(' ')
          .filter(token => token.length >= 3 && !STOP_WORDS.has(token))
      )
    )
  }

  function isOcrMatch(checklistTitle: string, extractedText: string): boolean {
    const keywords = getChecklistKeywords(checklistTitle)
    if (keywords.length === 0) return false

    const normalizedText = normalize(extractedText)
    const hits = keywords.filter(keyword => normalizedText.includes(keyword)).length
    const ratio = hits / keywords.length

    return ratio >= 0.6 || hits >= Math.min(2, keywords.length)
  }

  async function runTesseractOcr(file: File, checklistTitle: string): Promise<OcrResult> {
    if (!file.type.startsWith('image/')) {
      return { status: 'unavailable', confidence: null, excerpt: '' }
    }

    try {
      const Tesseract = await import('tesseract.js')
      const recognize = (Tesseract as any).recognize || (Tesseract as any).default?.recognize
      if (!recognize) {
        throw new Error('Tesseract recognize() not available')
      }

      const result = await recognize(file, 'eng')
      const extractedText = (result?.data?.text || '').trim()
      const confidence = typeof result?.data?.confidence === 'number'
        ? Number(result.data.confidence.toFixed(2))
        : null

      if (!extractedText) {
        return { status: 'mismatch', confidence, excerpt: '' }
      }

      return {
        status: isOcrMatch(checklistTitle, extractedText) ? 'matched' : 'mismatch',
        confidence,
        excerpt: extractedText.slice(0, 1500),
      }
    } catch (error) {
      console.error('OCR failed:', error)
      return { status: 'error', confidence: null, excerpt: '' }
    }
  }

  const handleFileUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setUploadError('')
    setUploadNotice('')
    setUploading(true)

    const formData = new FormData(form)
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file) {
      setUploadError('Please select a file')
      setUploading(false)
      return
    }
    if (!selectedChecklistItemId) {
      setUploadError('Please choose which checklist item this document satisfies')
      setUploading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const selectedChecklistItem = checklistItems.find(item => item.id === selectedChecklistItemId)
      if (!selectedChecklistItem) throw new Error('Selected checklist item not found')

      // Upload file to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${id}/${fileName}`

      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (storageError) throw storageError

      // Create document record
      const { data: documentRow, error: docError } = await supabase
        .from('documents')
        .insert({
          case_id: id,
          title: title || file.name,
          description,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
          status: 'pending',
        })
        .select('id')
        .single()

      if (docError) throw docError
      if (!documentRow?.id) throw new Error('Document record not created')

      // OCR verification (tesseract.js) to reduce mislabeled uploads
      const ocr = await runTesseractOcr(file, selectedChecklistItem.title)

      const { error: linkError } = await supabase
        .from('case_checklist_documents')
        .insert({
          case_id: id,
          checklist_item_id: selectedChecklistItemId,
          document_id: documentRow.id,
          ocr_status: ocr.status,
          ocr_confidence: ocr.confidence,
          ocr_excerpt: ocr.excerpt || null,
        })

      if (linkError) {
        // Best-effort cleanup to avoid orphaned records when linking fails.
        await supabase.from('documents').delete().eq('id', documentRow.id)
        await supabase.storage.from('documents').remove([filePath])
        throw linkError
      }

      if (ocr.status === 'matched') {
        setUploadNotice('✅ Uploaded, linked, and OCR-matched to the selected checklist item.')
      } else if (ocr.status === 'unavailable') {
        setUploadNotice('ℹ️ Uploaded and linked. OCR runs only on image files; this upload needs admin approval before checklist completion.')
      } else if (ocr.status === 'mismatch') {
        setUploadNotice('⚠️ Uploaded and linked, but OCR text did not match the selected checklist item.')
      } else {
        setUploadNotice('⚠️ Uploaded and linked, but OCR failed. An admin can still review this document.')
      }

      // Reload documents
      loadDocuments()
      
      // Reset form
      if (form) form.reset()
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <>
      <Head>
        <title>Documents — WINIT Portugal Immigration</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    <div className="case-page-wrap" style={{ fontFamily: 'var(--font-sans, sans-serif)' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
        <h1 style={{ marginTop: '1rem' }}>Case Documents</h1>
        {caseData && (
          <div>
            <p><strong>Case Type:</strong> {caseData.case_type}</p>
            <p><strong>Visa Type:</strong> {caseData.visa_type}</p>
          </div>
        )}
      </header>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '5px' }}>
        <h2>Upload Document</h2>
        <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {uploadError && <div style={{ color: 'red', padding: '0.5rem', background: '#fee', borderRadius: '5px' }}>{uploadError}</div>}
          {uploadNotice && <div style={{ color: '#065f46', padding: '0.5rem', background: '#d1fae5', borderRadius: '5px' }}>{uploadNotice}</div>}

          <div>
            <label htmlFor="checklist_item" style={{ display: 'block', marginBottom: '0.5rem' }}>Checklist Item This Document Satisfies</label>
            <select
              id="checklist_item"
              name="checklist_item"
              value={selectedChecklistItemId}
              onChange={(event) => setSelectedChecklistItemId(event.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Select checklist item...</option>
              {checklistItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}{item.required === false ? ' (Optional)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>Document Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label htmlFor="file" style={{ display: 'block', marginBottom: '0.5rem' }}>File</label>
            <input
              id="file"
              name="file"
              type="file"
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{ padding: '0.75rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </section>

      <section>
        <h2>Documents</h2>
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {documents.map((doc) => (
              <li key={doc.id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '1rem' }}>
                <h3>{doc.title}</h3>
                {doc.description && <p style={{ color: '#666' }}>{doc.description}</p>}
                {documentLinks[doc.id] && (
                  <p style={{ color: '#334155', margin: '0.5rem 0' }}>
                    Linked to: <strong>{documentLinks[doc.id]?.checklist_item?.title || 'Checklist item'}</strong> ({documentLinks[doc.id]?.ocr_status})
                  </p>
                )}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', color: '#999' }}>
                  <span>Status: <strong>{doc.status}</strong></span>
                  <span>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                  <span>Size: {(doc.file_size / 1024).toFixed(1)} KB</span>
                </div>
                {doc.admin_notes && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#fff3cd', borderRadius: '3px' }}>
                    <strong>Admin Notes:</strong> {doc.admin_notes}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <Link href={`/case/${id}/checklist`} style={{ color: '#0070f3' }}>View Checklist</Link>
      </section>
    </div>
    </>
  )
}
