import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../../lib/supabaseClient'
import Link from 'next/link'
import CaseChat from '../../../components/CaseChat'

export default function AdminCaseReview() {
  const router = useRouter()
  const { id } = router.query
  const [caseData, setCaseData] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [accessOk, setAccessOk] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  useEffect(() => {
    if (accessOk && id) {
      loadCaseData()
    }
  }, [accessOk, id])

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/auth/login')
        return
      }
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role !== 'admin') {
        router.replace('/dashboard')
        return
      }
      setAccessOk(true)
    } catch {
      router.replace('/dashboard')
    }
  }

  const loadCaseData = async () => {
    try {
      const { data: caseData } = await supabase
        .from('cases')
        .select(`
          *,
          users:user_id (full_name, email, phone)
        `)
        .eq('id', id)
        .single()

      setCaseData(caseData)

      const { data: docsData } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', id)
        .order('uploaded_at', { ascending: false })

      setDocuments(docsData || [])
    } catch (error) {
      console.error('Error loading case:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateDocumentStatus = async (docId: string, status: string, notes: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      await supabase
        .from('documents')
        .update({
          status,
          admin_notes: notes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', docId)

      loadCaseData()
    } catch (error) {
      console.error('Error updating document:', error)
    }
  }

  if (!accessOk || loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/admin/cases" style={{ color: '#0070f3' }}>← Back to client cases</Link>
        <h1 style={{ marginTop: '1rem' }}>Case details</h1>
      </header>

      {caseData && (
        <section style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Client & application</h2>
          <p><strong>Client:</strong> {caseData.users?.full_name} ({caseData.users?.email})</p>
          <p><strong>Phone:</strong> {caseData.users?.phone}</p>
          <p><strong>Case Type:</strong> {caseData.case_type}</p>
          <p><strong>Visa Type:</strong> {caseData.visa_type}</p>
          <p><strong>Country of Origin:</strong> {caseData.country_of_origin}</p>
          <p><strong>Status:</strong> {caseData.status}</p>
          <p><strong>Created:</strong> {new Date(caseData.created_at).toLocaleString()}</p>
        </section>
      )}

      <section>
        <h2>Documents ({documents.length})</h2>
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {documents.map((doc) => (
              <div key={doc.id} style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>{doc.title}</h3>
                {doc.description && <p style={{ color: '#666' }}>{doc.description}</p>}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', color: '#999' }}>
                  <span>Status: <strong>{doc.status}</strong></span>
                  <span>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                  <span>Size: {(doc.file_size / 1024).toFixed(1)} KB</span>
                </div>
                
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => updateDocumentStatus(doc.id, 'approved', 'Document approved')}
                    style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const notes = prompt('Enter notes for revision:')
                      if (notes) updateDocumentStatus(doc.id, 'needs_revision', notes)
                    }}
                    style={{ padding: '0.5rem 1rem', background: '#ffc107', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={() => {
                      const notes = prompt('Enter rejection reason:')
                      if (notes) updateDocumentStatus(doc.id, 'rejected', notes)
                    }}
                    style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                </div>

                {doc.admin_notes && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff3cd', borderRadius: '5px' }}>
                    <strong>Admin Notes:</strong> {doc.admin_notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {caseData && (
        <section style={{ marginTop: '2rem' }}>
          <CaseChat
            caseId={caseData.id}
            caseUserId={caseData.user_id}
            isSpecialist={true}
            title="Chat with client"
          />
        </section>
      )}
    </div>
  )
}
