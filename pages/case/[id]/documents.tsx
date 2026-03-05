import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../../lib/supabaseClient'
import Link from 'next/link'

export default function CaseDocuments() {
  const router = useRouter()
  const { id } = router.query
  const [caseData, setCaseData] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [checklistItems, setChecklistItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

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

      // Fetch checklist items for this case (visa-specific requirements)
      const { data: checklistData } = await supabase
        .from('case_checklist')
        .select('*')
        .eq('case_id', id)
        .order('order_index')

      setChecklistItems(checklistData || [])
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setUploadError('')
    setUploading(true)

    const formData = new FormData(form)
    const file = formData.get('file') as File
    const title = (formData.get('title') as string) || ''
    const description = (formData.get('description') as string) || ''
    const checklistItemId = (formData.get('checklistItemId') as string) || ''

    const selectedChecklistItem = checklistItems.find((item) => item.id === checklistItemId)
    const isChecklistItemId = selectedChecklistItem != null

    if (!file) {
      setUploadError('Please select a file')
      setUploading(false)
      return
    }

    const genericLabels: Record<string, string> = {
      passport: 'Passport',
      'passport-copies': 'Passport copies',
      photos: 'Passport-size photos',
      nif: 'NIF (Tax number)',
      'criminal-record': 'Criminal record certificate',
      'proof-of-income': 'Proof of income / bank statements',
      'proof-of-accommodation': 'Proof of accommodation',
      'travel-insurance': 'Travel insurance',
      'application-form': 'Visa application form',
      other: 'Other',
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const documentTitle =
        title.trim() ||
        (selectedChecklistItem?.title as string | undefined) ||
        (checklistItemId && genericLabels[checklistItemId]) ||
        file.name

      // Upload file to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${id}/${fileName}`

      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (storageError) throw storageError

      // Create document record (explicit link when uploading for a checklist requirement)
      const { error: docError } = await supabase
        .from('documents')
        .insert({
          case_id: id,
          case_checklist_id: isChecklistItemId ? checklistItemId : null,
          title: documentTitle,
          description,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
          status: 'pending',
        })

      if (docError) throw docError

      // Reload documents
      loadDocuments()
      
      // Reset form
      if (form) form.reset()
    } catch (error: any) {
      const msg = error?.message || ''
      let reason = msg
      if (/payload too large|file size|size limit|413/i.test(msg)) {
        reason = 'File is too large. Please use a file under 50 MB.'
      } else if (/duplicate|already exists|unique/i.test(msg)) {
        reason = 'A file with this name already exists. Try renaming or choose another file.'
      } else if (/not authenticated|unauthorized|401|403/i.test(msg)) {
        reason = 'Session may have expired. Please refresh the page and try again.'
      } else if (!msg) {
        reason = 'Upload failed. Please check your connection and try again.'
      }
      setUploadError(reason)
    } finally {
      setUploading(false)
    }
  }

  const submittedTitles = new Set(documents.map((d) => (d.title || '').trim()).filter(Boolean))
  const hasDocumentForItem = (item: { id: string; title: string }) =>
    documents.some((d: { case_checklist_id?: string | null; title: string }) =>
      d.case_checklist_id === item.id || (d.title || '').trim() === (item.title || '').trim()
    )

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <>
      <Head>
        <title>Documents — WINIT Portugal Immigration</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    <div className="case-page-wrap" style={{ fontFamily: 'var(--font-sans, sans-serif)', background: '#f5f5f5', minHeight: '100vh', padding: '2rem 0' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#1e293b', textDecoration: 'none' }}>← Back to Dashboard</Link>
        <h1 style={{ marginTop: '1rem' }}>Case Documents</h1>
        {caseData && (
          <div>
            <p><strong>Case Type:</strong> {caseData.case_type}</p>
            <p><strong>Visa Type:</strong> {caseData.visa_type}</p>
          </div>
        )}
      </header>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Upload document</h2>
        <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {uploadError && <div style={{ color: 'red', padding: '0.5rem', background: '#fee', borderRadius: '5px' }}>{uploadError}</div>}
          
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
            <label htmlFor="checklistItemId" style={{ display: 'block', marginBottom: '0.5rem' }}>
              {checklistItems.length > 0 ? 'Checklist Item / Document Type' : 'Document Type'}
            </label>
            {checklistItems.length > 0 ? (
              <select
                id="checklistItemId"
                name="checklistItemId"
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="">Select the document this upload is for</option>
                {checklistItems.map((item) => {
                  const submitted = hasDocumentForItem(item)
                  return (
                    <option key={item.id} value={item.id}>
                      {item.required !== false ? '⭐ ' : ''}{item.title}
                      {item.phase ? ` — ${item.phase}` : ''}
                      {submitted ? ' ✓ Uploaded' : ''}
                    </option>
                  )
                })}
              </select>
            ) : (
              (() => {
                const genericLabels: Record<string, string> = {
                  passport: 'Passport',
                  'passport-copies': 'Passport copies',
                  photos: 'Passport-size photos',
                  nif: 'NIF (Tax number)',
                  'criminal-record': 'Criminal record certificate',
                  'proof-of-income': 'Proof of income / bank statements',
                  'proof-of-accommodation': 'Proof of accommodation',
                  'travel-insurance': 'Travel insurance',
                  'application-form': 'Visa application form',
                  other: 'Other',
                }
                return (
                  <select
                    id="checklistItemId"
                    name="checklistItemId"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                  >
                    <option value="">Select document type (optional)</option>
                    {Object.entries(genericLabels).map(([value, label]) => {
                      const submitted = submittedTitles.has(label)
                      return (
                        <option key={value} value={value}>
                          {label}{submitted ? ' ✓ Uploaded' : ''}
                        </option>
                      )
                    })}
                  </select>
                )
              })()
            )}
            {checklistItems.length === 0 && (
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                For visa-specific requirements, generate your checklist on the{' '}
                <Link href={`/case/${id}/checklist`} style={{ color: '#2563eb', textDecoration: 'underline' }}>Checklist page</Link>.
              </p>
            )}
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
            style={{ padding: '0.75rem 1rem', background: uploading ? '#9ca3af' : '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: '500' }}
          >
            {uploading ? 'Uploading…' : 'Upload document'}
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
        <Link href={`/case/${id}/checklist`} style={{ color: '#1e293b', textDecoration: 'none', fontWeight: '500' }}>View checklist</Link>
      </section>
    </div>
    </>
  )
}
