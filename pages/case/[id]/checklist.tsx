import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../../lib/supabaseClient'
import Link from 'next/link'
import { getVisaPersonalization } from '../../../lib/visaPersonalization'

export default function CaseChecklist() {
  const router = useRouter()
  const { id } = router.query
  const [caseData, setCaseData] = useState<any>(null)
  const [checklist, setChecklist] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    if (id) {
      loadChecklist()
    }
  }, [id])

  // Collapse upload panel if the expanded item now has an approved document
  useEffect(() => {
    if (!expandedItemId) return
    const item = checklist.find((i) => i.id === expandedItemId)
    if (!item) return
    const itemDocs = documents.filter(doc => {
      const titleLower = item.title.toLowerCase().replace(/\s*\([^)]*\)/g, '').trim()
      const firstWords = titleLower.split(/\s+/).slice(0, 3).join(' ')
      const d = doc.title.toLowerCase()
      return d.includes(firstWords)
    })
    if (itemDocs.some((d: { status?: string }) => d.status === 'approved')) {
      setExpandedItemId(null)
    }
  }, [checklist, documents, expandedItemId])

  const loadChecklist = async () => {
    try {
      // Fetch case
      const { data: caseData } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single()

      setCaseData(caseData)

      // Fetch checklist
      const { data: checklistData } = await supabase
        .from('case_checklist')
        .select('*')
        .eq('case_id', id)
        .order('order_index')

      const items = checklistData || []

      // Fetch documents
      const { data: documentsData } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', id)

      const docs = documentsData || []
      setDocuments(docs)

      // Sync: mark item completed in DB when a matching document was uploaded (progress from uploads)
      for (const item of items) {
        if (item.completed) continue
        if (!itemHasMatchingDocument(item, docs)) continue
        await supabase
          .from('case_checklist')
          .update({ completed: true, completed_at: new Date().toISOString() })
          .eq('id', item.id)
      }

      // Re-fetch checklist after sync so UI shows updated completed state
      const { data: refreshed } = await supabase
        .from('case_checklist')
        .select('*')
        .eq('case_id', id)
        .order('order_index')
      setChecklist(refreshed || items)
    } catch (error) {
      console.error('Error loading checklist:', error)
    } finally {
      setLoading(false)
    }
  }

  /** True if at least one uploaded document matches this checklist item. Prefers explicit link (no bypass); falls back to title match for legacy docs. */
  function itemHasMatchingDocument(item: { id?: string; title: string }, docs: { case_checklist_id?: string | null; title: string }[]): boolean {
    const hasExplicit = item.id != null && docs.some(doc => doc.case_checklist_id === item.id)
    if (hasExplicit) return true
    return docs.some(doc => legacyTitleMatch(item.title, doc.title))
  }

  function legacyTitleMatch(itemTitle: string, docTitle: string): boolean {
    const titleLower = itemTitle.toLowerCase().replace(/\s*\([^)]*\)/g, '').trim()
    const firstWord = titleLower.split(/\s+/)[0] || ''
    const firstWords = titleLower.split(/\s+/).slice(0, 3).join(' ')
    const d = docTitle.toLowerCase()
    return d.includes(firstWords) || (firstWord.length >= 2 && d.includes(firstWord))
  }

  const toggleChecklistItem = async (itemId: string, itemTitle: string, currentlyCompleted: boolean, item?: { title: string }) => {
    try {
      if (!currentlyCompleted) {
        const hasDocument = item
          ? itemHasMatchingDocument(item, documents)
          : documents.some(doc =>
              doc.title.toLowerCase().includes(itemTitle.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase())
            )
        if (!hasDocument) {
          alert(`⚠️ Please upload the "${itemTitle}" document before marking it as complete.\n\nGo to Upload Documents section to add this file.`)
          return
        }
      }

      const { error } = await supabase
        .from('case_checklist')
        .update({
          completed: !currentlyCompleted,
          completed_at: !currentlyCompleted ? new Date().toISOString() : null,
        })
        .eq('id', itemId)

      if (error) throw error
      loadChecklist()
    } catch (error) {
      console.error('Error updating checklist:', error)
    }
  }

  const handleUploadForItem = async (e: FormEvent<HTMLFormElement>, item: { id: string; title: string }) => {
    e.preventDefault()
    const caseId = Array.isArray(id) ? id?.[0] : id
    if (!caseId || typeof caseId !== 'string') {
      setUploadError('Case not loaded. Please refresh the page and try again.')
      return
    }
    const form = e.currentTarget
    const formData = new FormData(form)
    const file = formData.get('file') as File
    const description = (formData.get('description') as string) || ''
    if (!file || !file.size) {
      setUploadError('Please select a file first.')
      return
    }
    setUploadError('')
    setUploadingItemId(item.id)
    try {
      const apiFormData = new FormData()
      apiFormData.append('file', file)
      apiFormData.append('case_id', caseId)
      apiFormData.append('case_checklist_id', item.id)
      apiFormData.append('title', item.title)
      apiFormData.append('description', description.trim())
      const res = await fetch('/api/documents/upload-with-validation', {
        method: 'POST',
        body: apiFormData,
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const message = data.reason || data.detail || data.error || 'Upload failed'
        throw new Error(message)
      }
      form.reset()
      setExpandedItemId(null)
      await loadChecklist()
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed. Please try again or use a different file.')
    } finally {
      setUploadingItemId(null)
    }
  }

  const regenerateChecklist = async () => {
    if (!caseData || !id) return
    
    setRegenerating(true)
    try {
      // Delete existing checklist items
      await supabase
        .from('case_checklist')
        .delete()
        .eq('case_id', id)

      // Get templates for this visa type
      const { data: templates } = await supabase
        .from('checklist_templates')
        .select('*')
        .eq('visa_type', caseData.visa_type)
        .order('order_index')

      if (templates && templates.length > 0) {
        const checklistItems = templates.map((template: any) => ({
          case_id: id,
          template_id: template.id,
          title: template.title,
          description: template.description,
          required: template.required,
          order_index: template.order_index,
          completed: false,
          ...(template.phase != null && { phase: template.phase }),
        }))

        await supabase.from('case_checklist').insert(checklistItems)
      }

      // Reload checklist
      loadChecklist()
    } catch (error) {
      console.error('Error regenerating checklist:', error)
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (!caseData) return <div style={{ padding: '2rem' }}>Case not found</div>

  const totalCount = checklist.length
  const effectiveCompleted = (item: typeof checklist[0]) =>
    item.completed || itemHasMatchingDocument(item, documents)
  const completedCount = checklist.filter(effectiveCompleted).length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const visaInfo = getVisaPersonalization(caseData?.visa_type || '')
  const requiredItems = checklist.filter(item => item.required !== false)
  const optionalItems = checklist.filter(item => item.required === false)
  const requiredCompleted = requiredItems.filter(effectiveCompleted).length

  const hasPhases = checklist.some(item => item.phase)
  const byPhase = hasPhases
    ? checklist.reduce<Record<string, typeof checklist>>((acc, item) => {
        const phase = item.phase || 'Other'
        if (!acc[phase]) acc[phase] = []
        acc[phase].push(item)
        return acc
      }, {})
    : null

  function docsForItem(item: { id: string; title: string }) {
    return documents.filter((doc: { case_checklist_id?: string | null; title: string }) =>
      doc.case_checklist_id === item.id || legacyTitleMatch(item.title, doc.title)
    )
  }

  function renderChecklistItem(item: typeof checklist[0], isCompleted: boolean, isRequired: boolean) {
    const hasDocument = itemHasMatchingDocument(item, documents)
    const itemDocs = docsForItem(item)
    const hasApprovedDoc = itemDocs.some((d: { status?: string }) => d.status === 'approved')
    const isExpanded = expandedItemId === item.id
    const isUploading = uploadingItemId === item.id
    const canAddAnother = !hasApprovedDoc
    return (
      <div
        key={item.id}
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          border: isCompleted ? '2px solid #10b981' : isExpanded ? '2px solid #374151' : '2px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          transition: 'all 0.3s',
          opacity: isRequired ? 1 : 0.95,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => toggleChecklistItem(item.id, item.title, isCompleted, item)}
            style={{
              width: '24px',
              height: '24px',
              marginTop: '0.25rem',
              cursor: 'pointer',
              accentColor: isRequired ? '#10b981' : '#3b82f6',
            }}
          />
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.1rem',
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? '#94a3b8' : '#1e293b',
              }}
            >
              {item.title}
              {!isRequired && <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '0.35rem' }}>(Optional)</span>}
            </h3>
            {item.description && (
              <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {item.description}
              </p>
            )}
            <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              {hasApprovedDoc ? (
                <span style={{ fontSize: '0.8rem', color: '#059669', background: '#d1fae5', padding: '0.25rem 0.75rem', borderRadius: '12px', fontWeight: '600' }}>
                  ✓ Accepted by admin — no further uploads
                </span>
              ) : hasDocument ? (
                <span style={{ fontSize: '0.8rem', color: '#059669', background: '#d1fae5', padding: '0.25rem 0.75rem', borderRadius: '12px', fontWeight: '600' }}>
                  📎 {itemDocs.length} document{itemDocs.length !== 1 ? 's' : ''} uploaded
                </span>
              ) : (
                <span style={{ fontSize: '0.8rem', color: isRequired ? '#dc2626' : '#f59e0b', background: isRequired ? '#fee2e2' : '#fef3c7', padding: '0.25rem 0.75rem', borderRadius: '12px', fontWeight: '600' }}>
                  📤 {isRequired ? 'Upload required' : 'Not yet uploaded'}
                </span>
              )}
              {canAddAnother && (
                <button
                  type="button"
                  onClick={() => { setExpandedItemId(isExpanded ? null : item.id); setUploadError('') }}
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.35rem 0.75rem',
                    background: isExpanded ? '#e2e8f0' : '#1e293b',
                    color: isExpanded ? '#475569' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {isExpanded ? 'Cancel' : hasDocument ? 'Add another' : 'Upload here'}
                </button>
              )}
            </div>
            {item.completed_at && isCompleted && (
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#10b981', background: '#dcfce7', padding: '0.25rem 0.75rem', borderRadius: '12px', fontWeight: '600' }}>
                  ✓ Completed {new Date(item.completed_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {isExpanded && canAddAnother && (
          <div style={{ marginLeft: '2.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <form onSubmit={(e) => handleUploadForItem(e, item)} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {uploadError && expandedItemId === item.id && (
                <div style={{ color: '#dc2626', fontSize: '0.875rem', padding: '0.5rem', background: '#fee2e2', borderRadius: '6px' }}>{uploadError}</div>
              )}
              <div>
                <label htmlFor={`file-${item.id}`} style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>File</label>
                <input
                  id={`file-${item.id}`}
                  name="file"
                  type="file"
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label htmlFor={`desc-${item.id}`} style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Note (optional)</label>
                <input
                  id={`desc-${item.id}`}
                  name="description"
                  type="text"
                  placeholder="e.g. Front page, certified copy"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>
              <button
                type="submit"
                disabled={isUploading}
                style={{
                  padding: '0.6rem 1.25rem',
                  background: isUploading ? '#9ca3af' : '#1e293b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  opacity: 1,
                  alignSelf: 'flex-start',
                }}
              >
                {isUploading ? 'Uploading…' : 'Upload'}
              </button>
            </form>
          </div>
        )}

        {itemDocs.length > 0 && (
          <div style={{ marginLeft: '2.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            {itemDocs.map((doc) => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span>📄 {doc.title}</span>
                <span>— {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                {doc.status && <span style={{ color: doc.status === 'approved' ? '#059669' : doc.status === 'rejected' ? '#dc2626' : '#f59e0b' }}>({doc.status})</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Checklist — WINIT Portugal Immigration</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    <div className="case-page-wrap" style={{ background: '#f5f5f5', fontFamily: 'var(--font-sans, sans-serif)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <Link href="/dashboard" style={{ color: '#1e293b', fontSize: '0.95rem', textDecoration: 'none' }}>← Back to Dashboard</Link>
        </header>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b', fontWeight: '600' }}>Document checklist</h1>
          </div>
          
          {caseData && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <span style={{ 
                padding: '0.4rem 0.875rem', 
                background: '#1e293b', 
                color: 'white', 
                borderRadius: '6px', 
                fontSize: '0.875rem', 
                fontWeight: '500' 
              }}>
                {caseData.visa_type}
              </span>
              <span style={{ 
                padding: '0.4rem 0.875rem', 
                background: '#f1f5f9', 
                color: '#475569', 
                borderRadius: '6px', 
                fontSize: '0.875rem', 
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {caseData.status.replace('_', ' ')}
              </span>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>Overall progress</span>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: '#1e293b', 
                transition: 'width 0.5s ease',
                borderRadius: '6px'
              }} />
            </div>
            <p style={{ margin: '0.5rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              {completedCount} of {totalCount} items completed (uploads count automatically) • {requiredCompleted} of {requiredItems.length} required ✓
            </p>
          </div>

          {/* Warning if not all required items complete */}
          {requiredCompleted < requiredItems.length && (
            <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b', marginTop: '1rem' }}>
              <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>
                ⚠️ <strong>{requiredItems.length - requiredCompleted} required documents</strong> still needed. Complete these before submitting your application.
              </p>
            </div>
          )}
        </div>

        {/* Checklist Items */}
        <div style={{ marginBottom: '2rem' }}>
          {checklist.length === 0 ? (
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <p style={{ fontSize: '1rem', color: '#64748b', margin: '0 0 1.25rem 0' }}>
                No checklist items found for your {caseData?.visa_type}.
              </p>
              <button
                onClick={regenerateChecklist}
                disabled={regenerating}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: regenerating ? '#9ca3af' : '#1e293b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: regenerating ? 'not-allowed' : 'pointer'
                }}
              >
                {regenerating ? 'Generating…' : 'Generate checklist'}
              </button>
            </div>
          ) : (
            <>
              {hasPhases && byPhase ? (
                Object.entries(byPhase).map(([phaseName, phaseItems]) => (
                  <div key={phaseName} style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.35rem', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {phaseName}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {phaseItems.map((item) => renderChecklistItem(item, effectiveCompleted(item), item.required !== false))}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {requiredItems.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⭐</span> Required Documents
                      </h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {requiredItems.map((item) => renderChecklistItem(item, effectiveCompleted(item), true))}
                      </div>
                    </div>
                  )}
                  {optionalItems.length > 0 && (
                    <div>
                      <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>💼</span> Optional Documents (Recommended)
                      </h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {optionalItems.map((item) => renderChecklistItem(item, effectiveCompleted(item), false))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link 
            href={`/case/${id}/documents`} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: '#1e293b', 
              color: 'white', 
              borderRadius: '6px', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '0.9375rem'
            }}
          >
            Upload documents
          </Link>
          <Link 
            href={`/case/${id}/edit`} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'white', 
              color: '#374151', 
              border: '1px solid #d1d5db',
              borderRadius: '6px', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '0.9375rem'
            }}
          >
            Edit case
          </Link>
          <Link 
            href="/dashboard" 
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'white', 
              color: '#1e293b', 
              border: '1px solid #1e293b',
              borderRadius: '6px', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '0.9375rem'
            }}
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}
