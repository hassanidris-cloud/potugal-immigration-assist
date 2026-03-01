import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { countries } from '../lib/countries'
import { getVisaPersonalization, getVisaTypeColor } from '../lib/visaPersonalization'

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

    // Package and payment are arranged with the owner via contact/WhatsApp after signup
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
          order_index: template.order_index,
          completed: false,
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
      // Send document metadata to API (service role will handle DB insert)
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          userId: user.id,
          title: title || file.name,
          description: description || '',
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setDocuments([...documents, data.document])
      
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

  if (!user) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className={step >= 1 ? 'text-primary font-bold' : 'text-text-muted font-bold'}>1. Case Details</span>
            <span className={step >= 2 ? 'text-primary font-bold' : 'text-text-muted font-bold'}>2. Upload Documents</span>
            <span className={step >= 3 ? 'text-primary font-bold' : 'text-text-muted font-bold'}>3. Complete</span>
          </div>
          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${(step / 3) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #0066cc, #00c896)', transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Step 1: Case Details */}
        {step === 1 && (
          <div className="card animate-fade-in" style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h1 className="text-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀 Let&apos;s Create Your Case</h1>
            <p className="text-text-muted" style={{ marginBottom: '2rem' }}>Tell us about your immigration plans to Portugal</p>

            {accessBlocked && (
              <div style={{
                background: '#fff7ed',
                border: '1px solid #fdba74',
                color: '#9a3412',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <strong>Access Locked:</strong> {blockMessage}
                <div style={{ marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '0.6rem 1rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: accessBlocked ? 0.6 : 1, pointerEvents: accessBlocked ? 'none' : 'auto' }}>
              {error && <div className="text-error" style={{ padding: '1rem', background: '#fee2e2', borderRadius: '8px', borderLeft: '4px solid var(--error)' }}>{error}</div>}

              <div>
                <label htmlFor="caseType" className="text-text font-semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>Case Type</label>
                <select
                  id="caseType"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem' }}
                >
                  <option>Immigration Application</option>
                  <option>Residency Renewal</option>
                  <option>Citizenship Application</option>
                </select>
              </div>

              <div>
                <label htmlFor="visaType" className="text-text font-semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>Which Visa Type Do You Need? 🇵🇹</label>
                                <button
                                  type="button"
                                  onClick={() => setShowVisaInfo(!showVisaInfo)}
                                  style={{ 
                                    fontSize: '0.875rem', 
                                    color: 'var(--primary)', 
                                    textDecoration: 'underline', 
                                    cursor: 'pointer', 
                                    border: 'none', 
                                    background: 'none', 
                                    padding: 0,
                                    marginBottom: '0.5rem'
                                  }}
                                >
                                  {showVisaInfo ? '▼ Hide visa details' : '▶ Show details about selected visa'}
                                </button>
                <select
                  id="visaType"
                  value={visaType}
                  onChange={(e) => { setVisaType(e.target.value); setShowVisaInfo(true); }}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'white' }}
                >
                  <optgroup label="Residency visa programs">
                    <option value="D2 Visa">D2 Visa - Entrepreneurs, freelancers, independent service providers</option>
                    <option value="D7 Visa">D7 Visa - Passive income (retirees, pensioners, rental/dividend income)</option>
                    <option value="D7 Digital Nomad">D8 Visa (Digital Nomad) - Remote workers (min €3,040/month income)</option>
                  </optgroup>
                </select>
                {showVisaInfo && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1.5rem',
                    background: '#f1f5f9',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${getVisaTypeColor(visaType).replace('bg-', '#')}`,
                    animation: 'fadeIn 0.3s ease-in'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <span style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #0066cc, #00c896)',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {visaInfo.visaType}
                      </span>
                    </div>
                    <p className="text-text-muted" style={{ fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                      {visaInfo.welcomeMessage}
                    </p>
                    <p className="text-text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                      {visaInfo.description}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
                        <div className="text-text-muted text-xs" style={{ marginBottom: '0.25rem' }}>Processing Time</div>
                        <div className="text-text font-semibold">⏱️ {visaInfo.processingTime}</div>
                      </div>
                      <div style={{ padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
                        <div className="text-text-muted text-xs" style={{ marginBottom: '0.25rem' }}>Success Rate</div>
                        <div className="font-semibold text-[var(--success)]">✓ {visaInfo.successRate}</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 className="text-text font-semibold text-sm" style={{ marginBottom: '0.5rem' }}>📋 Key Requirements:</h4>
                      <ul className="text-text-muted text-sm" style={{ paddingLeft: '1.25rem', margin: 0 }}>
                        {visaInfo.keyRequirements.slice(0, 3).map((req, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem' }}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-text font-semibold text-sm" style={{ marginBottom: '0.5rem' }}>💡 Pro Tips:</h4>
                      <ul className="text-text-muted text-sm" style={{ paddingLeft: '1.25rem', margin: 0 }}>
                        {visaInfo.tips.slice(0, 2).map((tip, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem' }}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <p className="text-text-muted text-sm" style={{ marginTop: '0.5rem' }}>
                  💡 Most visas are processed through VFS Global
                </p>
              </div>

              <div>
                <label htmlFor="countryOfOrigin" className="text-text font-semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>Country of Origin 🌍</label>
                <select
                  id="countryOfOrigin"
                  value={countryOfOrigin}
                  onChange={(e) => setCountryOfOrigin(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'white' }}
                  required
                >
                  <option value="">Select your country...</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="targetVisaDate" className="text-text font-semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>Target Application Date (Optional)</label>
                <input
                  id="targetVisaDate"
                  type="date"
                  value={targetVisaDate}
                  onChange={(e) => setTargetVisaDate(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || accessBlocked}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: (loading || accessBlocked) ? '#94a3b8' : 'linear-gradient(135deg, #0066cc, #00c896)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: (loading || accessBlocked) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Creating...' : 'Next: Upload Documents →'}
              </button>
            </form>
          </div>
        )}
        {/* Step 2: Document Upload */}
        {step === 2 && (
          <div className="card animate-fade-in" style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h1 className="text-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄 Upload Your Documents</h1>
            <p className="text-text-muted" style={{ marginBottom: '2rem' }}>Start by uploading at least one document. You can add more anytime.</p>

            {error && <div style={{ color: '#ef4444', padding: '1rem', background: '#fee2e2', borderRadius: '8px' }}>{error}</div>}

            <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Document Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g., Passport Copy"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  placeholder="Add any notes about this document"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label htmlFor="file" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>File *</label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'white' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {loading ? 'Uploading...' : '+ Add Document'}
              </button>
            </form>

            {documents.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-text" style={{ marginBottom: '1rem' }}>✅ Uploaded Documents ({documents.length})</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {documents.map((doc) => (
                    <li key={doc.id} style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid #bbf7d0' }}>
                      <strong>{doc.title}</strong> - {(doc.file_size / 1024).toFixed(1)} KB
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: '1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ← Back
              </button>
              <button
                onClick={completeOnboarding}
                disabled={documents.length === 0}
                style={{ flex: 2, padding: '1rem', background: documents.length > 0 ? 'linear-gradient(135deg, #0066cc, #00c896)' : '#cbd5e1', color: 'white', border: 'none', borderRadius: '8px', cursor: documents.length > 0 ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
              >
                Complete Setup →
              </button>
            </div>
            {documents.length === 0 && (
              <p className="text-text-muted text-center text-sm" style={{ marginTop: '1rem' }}>Upload at least one document to continue</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
