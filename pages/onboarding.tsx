import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'
import { countries } from '../lib/countries'
import { getVisaPersonalization } from '../lib/visaPersonalization'
import { uploadDocumentForCase } from '../lib/uploadDocument'

export default function Onboarding() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [caseType, setCaseType] = useState('Immigration Application')
  const [visaType, setVisaType] = useState('D7 Visa')
  const [countryOfOrigin, setCountryOfOrigin] = useState('')
  const [targetVisaDate, setTargetVisaDate] = useState('')
  const [caseId, setCaseId] = useState('')
  const [documents, setDocuments] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVisaInfo, setShowVisaInfo] = useState(false)
  const [accessBlocked, setAccessBlocked] = useState(false)
  const [blockMessage, setBlockMessage] = useState('')
  const visaInfo = getVisaPersonalization(visaType)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user)

    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // Admin owners should not create cases
    if (user && profileData?.role === 'admin') {
      setAccessBlocked(true)
      setBlockMessage('Owner accounts do not create cases. Use the Admin area to manage clients.')
      return
    }

    // Client must be marked paid by admin before they can create a case
    if (profileData && !profileData.paid_at) {
      setAccessBlocked(true)
      setBlockMessage('Your account is pending payment confirmation. The specialist will enable your access after payment—you can log in and check back soon.')
      return
    }

    // Paid user: check for existing case
    const { data: existingCases } = await supabase
      .from('cases')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (existingCases && existingCases.length > 0) {
      router.push(`/case/${existingCases[0].id}/checklist`)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (accessBlocked) {
      return
    }
    setError('')
    setLoading(true)

    try {
      const { data: existingCases } = await supabase
        .from('cases')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (existingCases && existingCases.length > 0) {
        setCaseId(existingCases[0].id)
        router.push(`/case/${existingCases[0].id}/checklist`)
        return
      }

      // Create case
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
          case_type: caseType,
          visa_type: visaType,
          country_of_origin: countryOfOrigin,
          target_visa_date: targetVisaDate || null,
          status: 'pending',
        })
        .select()
        .single()

      if (caseError) throw caseError

      setCaseId(caseData.id)

      // Generate checklist from templates
      const { data: templates } = await supabase
        .from('checklist_templates')
        .select('*')
        .eq('visa_type', visaType)
        .order('order_index')

      if (templates && templates.length > 0) {
        const checklistItems = templates.map((template: any) => ({
          case_id: caseData.id,
          template_id: template.id,
          title: template.title,
          description: template.description,
          required: template.required !== false,
          order_index: template.order_index,
          completed: false,
          ...(template.phase != null && { phase: template.phase }),
        }))

        await supabase.from('case_checklist').insert(checklistItems)
      }

      // Move to document upload step
      setStep(2)
    } catch (err: any) {
      setError(err.message || 'Failed to create case')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setError('')
    setLoading(true)

    const formData = new FormData(form)
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file) {
      setError('Please select a file')
      setLoading(false)
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File must be under 50MB')
      setLoading(false)
      return
    }

    try {
      if (!caseId) {
        throw new Error('Case not found. Please refresh and try again.')
      }

      const document = await uploadDocumentForCase({
        caseId,
        file,
        title: title || file.name,
        description: description || '',
      })

      setDocuments([...documents, document])

      // Reset form
      if (form) form.reset()
    } catch (error: any) {
      console.error('Upload error:', error)
      setError(error.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const completeOnboarding = () => {
    router.push(`/case/${caseId}/checklist`)
  }

  const formFieldClass = 'w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-3 text-base'
  const labelClass = 'mb-2 block font-semibold text-text'
  const cardClass = 'card animate-fade-in rounded-2xl bg-white p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)]'
  const primaryButtonClass = 'w-full rounded-lg px-4 py-4 text-[1.1rem] font-bold text-white transition'

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <>
      <Head>
        <title>Create case — WINIT Portugal Immigration</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 p-8 font-sans">
      <div className="mx-auto max-w-[800px]">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-4 flex justify-between">
            <span className={step >= 1 ? 'text-primary font-bold' : 'text-text-muted font-bold'}>1. Case Details</span>
            <span className={step >= 2 ? 'text-primary font-bold' : 'text-text-muted font-bold'}>2. Upload Documents</span>
            <span className={step >= 3 ? 'text-primary font-bold' : 'text-text-muted font-bold'}>3. Complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-[#0066cc] to-[#00c896] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Case Details */}
        {step === 1 && (
          <div className={cardClass}>
            <h1 className="mb-4 text-3xl text-text">🚀 Let&apos;s Create Your Case</h1>
            <p className="mb-8 text-text-muted">Tell us about your immigration plans to Portugal</p>

            {accessBlocked && (
              <div className="mb-6 rounded-lg border border-orange-300 bg-orange-50 p-4 text-orange-800">
                <strong>Access Locked:</strong> {blockMessage}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Back to home
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className={`flex flex-col gap-6 ${accessBlocked ? 'pointer-events-none opacity-60' : ''}`}
            >
              {error && <div className="rounded-lg border-l-4 border-error bg-red-100 p-4 text-error">{error}</div>}

              <div>
                <label htmlFor="caseType" className={labelClass}>Case Type</label>
                <select
                  id="caseType"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className={formFieldClass}
                >
                  <option>Immigration Application</option>
                  <option>Residency Renewal</option>
                  <option>Citizenship Application</option>
                </select>
              </div>

              <div>
                <label htmlFor="visaType" className={labelClass}>Which Visa Type Do You Need? 🇵🇹</label>
                <button
                  type="button"
                  onClick={() => setShowVisaInfo(!showVisaInfo)}
                  className="mb-2 border-none bg-transparent p-0 text-sm text-primary underline transition hover:text-primary/80"
                >
                  {showVisaInfo ? '▼ Hide visa details' : '▶ Show details about selected visa'}
                </button>
                <select
                  id="visaType"
                  value={visaType}
                  onChange={(e) => { setVisaType(e.target.value); setShowVisaInfo(true); }}
                  className={formFieldClass}
                >
                  <optgroup label="Residency visa programs">
                    <option value="D2 Visa">D2 Visa - Entrepreneurs, freelancers, independent service providers</option>
                    <option value="D7 Visa">D7 Visa - Passive income (retirees, pensioners, rental/dividend income)</option>
                    <option value="D7 Digital Nomad">D8 Visa (Digital Nomad) - Remote workers (min €3,040/month income)</option>
                  </optgroup>
                </select>
                {showVisaInfo && (
                  <div className="mt-4 animate-fade-in rounded-xl border-l-4 border-primary bg-slate-100 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="rounded-full bg-gradient-to-br from-[#0066cc] to-[#00c896] px-4 py-2 text-sm font-semibold text-white">
                        {visaInfo.visaType}
                      </span>
                    </div>
                    <p className="mb-4 text-[0.95rem] leading-relaxed text-text-muted">
                      {visaInfo.welcomeMessage}
                    </p>
                    <p className="mb-6 text-[0.9rem] leading-relaxed text-text-muted">
                      {visaInfo.description}
                    </p>
                    <div className="mb-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg bg-white p-3">
                        <div className="mb-1 text-xs text-text-muted">Processing Time</div>
                        <div className="text-text font-semibold">⏱️ {visaInfo.processingTime}</div>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <div className="mb-1 text-xs text-text-muted">Success Rate</div>
                        <div className="font-semibold text-emerald-600">✓ {visaInfo.successRate}</div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-semibold text-text">📋 Key Requirements:</h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-text-muted">
                        {visaInfo.keyRequirements.slice(0, 3).map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-text">💡 Pro Tips:</h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-text-muted">
                        {visaInfo.tips.slice(0, 2).map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <p className="mt-2 text-sm text-text-muted">
                  💡 Most visas are processed through VFS Global
                </p>
              </div>

              <div>
                <label htmlFor="countryOfOrigin" className={labelClass}>Country of Origin 🌍</label>
                <select
                  id="countryOfOrigin"
                  value={countryOfOrigin}
                  onChange={(e) => setCountryOfOrigin(e.target.value)}
                  className={formFieldClass}
                  required
                >
                  <option value="">Select your country...</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="targetVisaDate" className={labelClass}>Target Application Date (Optional)</label>
                <input
                  id="targetVisaDate"
                  type="date"
                  value={targetVisaDate}
                  onChange={(e) => setTargetVisaDate(e.target.value)}
                  className={formFieldClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading || accessBlocked}
                className={`${primaryButtonClass} ${
                  loading || accessBlocked
                    ? 'cursor-not-allowed bg-slate-400'
                    : 'bg-gradient-to-br from-[#0066cc] to-[#00c896] hover:opacity-90'
                }`}
              >
                {loading ? 'Creating...' : 'Next: Upload Documents →'}
              </button>
            </form>
          </div>
        )}
        {/* Step 2: Document Upload */}
        {step === 2 && (
          <div className={cardClass}>
            <h1 className="mb-4 text-3xl text-text">📄 Upload Your Documents</h1>
            <p className="mb-8 text-text-muted">Start by uploading at least one document. You can add more anytime.</p>

            {error && <div className="rounded-lg bg-red-100 p-4 text-red-500">{error}</div>}

            <form onSubmit={handleFileUpload} className="mb-8 flex flex-col gap-4">
              <div>
                <label htmlFor="title" className={labelClass}>Document Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g., Passport Copy"
                  className={formFieldClass}
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  placeholder="Add any notes about this document"
                  className={formFieldClass}
                />
              </div>

              <div>
                <label htmlFor="file" className={labelClass}>File *</label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  required
                  className={formFieldClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-emerald-500 px-3 py-3 font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Uploading...' : '+ Add Document'}
              </button>
            </form>

            {documents.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-text">✅ Uploaded Documents ({documents.length})</h3>
                <ul className="list-none p-0">
                  {documents.map((doc) => (
                    <li key={doc.id} className="mb-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <strong>{doc.title}</strong> - {(doc.file_size / 1024).toFixed(1)} KB
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg bg-slate-100 px-4 py-4 font-bold text-slate-700 transition hover:bg-slate-200"
              >
                ← Back
              </button>
              <button
                onClick={completeOnboarding}
                disabled={documents.length === 0}
                className={`flex-[2] rounded-lg px-4 py-4 font-bold text-white transition ${
                  documents.length > 0
                    ? 'bg-gradient-to-br from-[#0066cc] to-[#00c896] hover:opacity-90'
                    : 'cursor-not-allowed bg-slate-300'
                }`}
              >
                Complete Setup →
              </button>
            </div>
            {documents.length === 0 && (
              <p className="mt-4 text-center text-sm text-text-muted">Upload at least one document to continue</p>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  )
}
