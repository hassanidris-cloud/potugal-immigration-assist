import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function AdminTestMode() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [testData, setTestData] = useState<any>(null)

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setUser(user)
    } catch (error) {
      console.error('Error checking admin:', error)
      router.push('/dashboard')
    }
  }

  const createTestCase = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/generate-test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'case', userId: user.id }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setTestData({ ...testData, case: { id: data.caseId } })
      setMessage(`✅ Test case created! Case ID: ${data.caseId}`)
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createTestDocuments = async () => {
    if (!testData?.case?.id) {
      setMessage('❌ Create a test case first!')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/generate-test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'documents',
          userId: user.id,
          caseId: testData.case.id,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setMessage(`✅ ${data.message}`)
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createTestInvoice = async () => {
    if (!testData?.case?.id) {
      setMessage('❌ Create a test case first!')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/generate-test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'invoice',
          userId: user.id,
          caseId: testData.case.id,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setMessage(`✅ ${data.message}`)
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createFullTestEnvironment = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/generate-test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'full', userId: user.id }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setTestData({ case: { id: data.caseId } })
      setMessage(`✅ ${data.message}! Case ID: ${data.caseId}`)
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const goToTestCase = () => {
    if (testData?.case?.id) {
      router.push(`/admin/case/${testData.case.id}`)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>🧪 Admin Test Mode</h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Quickly generate test data to explore all features</p>

          {message && (
            <div
              style={{
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                background: message.includes('❌') ? '#fee2e2' : '#dcfce7',
                color: message.includes('❌') ? '#991b1b' : '#166534',
                borderLeft: `4px solid ${message.includes('❌') ? '#ef4444' : '#22c55e'}`,
              }}
            >
              {message}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={createFullTestEnvironment}
              disabled={loading}
              style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, #0066cc 0%, #00c896 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              ⚡ Create Full Test Environment
            </button>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Or build step by step:</p>
              <button
                onClick={createTestCase}
                disabled={loading}
                style={{
                  padding: '0.75rem',
                  background: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                1️⃣ Create Test Case
              </button>

              <button
                onClick={createTestDocuments}
                disabled={loading || !testData?.case?.id}
                style={{
                  padding: '0.75rem',
                  background: testData?.case?.id ? '#0066cc' : '#cbd5e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading || !testData?.case?.id ? 'not-allowed' : 'pointer',
                  opacity: loading || !testData?.case?.id ? 0.7 : 1,
                }}
              >
                2️⃣ Add Test Documents
              </button>

              <button
                onClick={createTestInvoice}
                disabled={loading || !testData?.case?.id}
                style={{
                  padding: '0.75rem',
                  background: testData?.case?.id ? '#0066cc' : '#cbd5e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading || !testData?.case?.id ? 'not-allowed' : 'pointer',
                  opacity: loading || !testData?.case?.id ? 0.7 : 1,
                }}
              >
                3️⃣ Add Test Invoice
              </button>
            </div>

            {testData?.case?.id && (
              <button
                onClick={goToTestCase}
                disabled={loading}
                style={{
                  padding: '1rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '1rem',
                }}
              >
                👉 Go to Test Case
              </button>
            )}

            <button
              onClick={() => router.push('/admin/cases')}
              style={{
                padding: '0.75rem',
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '1rem',
              }}
            >
              ← Back to Cases
            </button>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0 }}>
              💡 <strong>Tip:</strong> Use "Create Full Test Environment" to get everything set up at once, then explore the dashboard, document review, invoicing, and other admin features!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
