import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function AdminTestMode() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [testData, setTestData] = useState<any>(null)
  const primaryButtonClass = 'rounded-lg bg-[#0066cc] px-3 py-3 text-white transition disabled:cursor-not-allowed disabled:opacity-70'

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.replace('/auth/login')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.replace('/dashboard')
        return
      }

      setUser(user)
    } catch (error) {
      console.error('Error checking admin:', error)
      router.replace('/dashboard')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 p-8 font-sans">
      <div className="mx-auto max-w-[600px]">
        <div className="rounded-xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
          <h1 className="mb-2 text-3xl text-slate-800">🧪 Admin Test Mode</h1>
          <p className="mb-8 text-slate-500">Quickly generate test data to explore all features</p>

          {message && (
            <div
              className={`mb-6 rounded-lg border-l-4 p-4 ${
                message.includes('❌')
                  ? 'border-red-500 bg-red-100 text-red-800'
                  : 'border-green-500 bg-green-100 text-green-800'
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              onClick={createFullTestEnvironment}
              disabled={loading}
              className="rounded-lg bg-gradient-to-br from-[#0066cc] to-[#00c896] px-4 py-4 text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              ⚡ Create Full Test Environment
            </button>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4">
              <p className="mb-2 text-[0.9rem] text-slate-600">Or build step by step:</p>
              <button
                onClick={createTestCase}
                disabled={loading}
                className={primaryButtonClass}
              >
                1️⃣ Create Test Case
              </button>

              <button
                onClick={createTestDocuments}
                disabled={loading || !testData?.case?.id}
                className={
                  !testData?.case?.id
                    ? 'rounded-lg bg-slate-300 px-3 py-3 text-white transition disabled:cursor-not-allowed disabled:opacity-70'
                    : primaryButtonClass
                }
              >
                2️⃣ Add Test Documents
              </button>

              <button
                onClick={createTestInvoice}
                disabled={loading || !testData?.case?.id}
                className={
                  !testData?.case?.id
                    ? 'rounded-lg bg-slate-300 px-3 py-3 text-white transition disabled:cursor-not-allowed disabled:opacity-70'
                    : primaryButtonClass
                }
              >
                3️⃣ Add Test Invoice
              </button>
            </div>

            {testData?.case?.id && (
              <button
                onClick={goToTestCase}
                disabled={loading}
                className="mt-4 rounded-lg bg-emerald-500 px-4 py-4 text-base font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                👉 Go to Test Case
              </button>
            )}

            <button
              onClick={() => router.push('/admin/cases')}
              className="mt-4 rounded-md border border-slate-300 bg-slate-100 px-3 py-3 text-slate-600 transition hover:bg-slate-200"
            >
              ← Back to Cases
            </button>
          </div>

          <div className="mt-8 rounded-lg border-l-4 border-blue-500 bg-slate-50 p-4">
            <p className="m-0 text-[0.9rem] text-slate-600">
              💡 <strong>Tip:</strong> Use "Create Full Test Environment" to get everything set up at once, then explore the dashboard, document review, invoicing, and other admin features!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
