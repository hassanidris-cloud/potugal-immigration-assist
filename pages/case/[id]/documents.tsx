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
  const [checklistDocumentTypes, setChecklistDocumentTypes] = useState<string[]>([])
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
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

      // Fetch checklist titles so client selects an exact document type
      const { data: checklistData } = await supabase
        .from('case_checklist')
        .select('title, order_index')
        .eq('case_id', id)
        .order('order_index')

      const types = Array.from(
        new Set(
          (checklistData || [])
            .map((item: any) => String(item.title || '').trim())
            .filter(Boolean)
        )
      )
      setChecklistDocumentTypes(types)
      setSelectedDocumentType((prev) => (prev && types.includes(prev) ? prev : (types[0] || '')))

      // Fetch documents
      const { data: docsData } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', id)
        .order('uploaded_at', { ascending: false })

      setDocuments(docsData || [])
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
    const documentType = String(formData.get('documentType') || '').trim()
    const description = formData.get('description') as string

    if (!file) {
      setUploadError('Please select a file')
      setUploading(false)
      return
    }
    if (!documentType) {
      setUploadError('Please choose a document type from your checklist')
      setUploading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upload file to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${id}/${fileName}`

      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (storageError) throw storageError

      // Create document record
      const { error: docError } = await supabase
        .from('documents')
        .insert({
          case_id: id,
          title: documentType,
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
      setUploadError(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <>
      <Head>
        <title>Documents — WinIT Portugal Immigration</title>
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
          
          <div>
            <label htmlFor="documentType" style={{ display: 'block', marginBottom: '0.5rem' }}>Document Type</label>
            <select
              id="documentType"
              name="documentType"
              value={selectedDocumentType}
              onChange={(e) => setSelectedDocumentType(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', background: 'white' }}
            >
              <option value="" disabled>Select document type from checklist</option>
              {checklistDocumentTypes.map((docType) => (
                <option key={docType} value={docType}>{docType}</option>
              ))}
            </select>
            {checklistDocumentTypes.length === 0 && (
              <p style={{ marginTop: '0.5rem', color: '#b45309', fontSize: '0.9rem' }}>
                No checklist document types found yet. Please regenerate checklist first.
              </p>
            )}
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
            disabled={uploading || checklistDocumentTypes.length === 0}
            style={{ padding: '0.75rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: (uploading || checklistDocumentTypes.length === 0) ? 'not-allowed' : 'pointer' }}
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
