import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'
import { countries } from '../lib/countries'
import { getVisaPersonalization, getVisaTypeColor } from '../lib/visaPersonalization'

export default function Onboarding() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [caseType, setCaseType] = useState('Immigration Application')
  const [visaType, setVisaType] = useState('D7 Visa')
  const [countryOfOrigin, setCountryOfOrigin] = useState('')
  const [targetVisaDate, setTargetVisaDate] = useState('')
  const [caseId, setCaseId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVisaInfo, setShowVisaInfo] = useState(false)
  const [accessBlocked, setAccessBlocked] = useState(false)
  const [blockMessage, setBlockMessage] = useState('')
  const [visaLockedFromSignup, setVisaLockedFromSignup] = useState(false)
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

    if (profileData?.visa_type) {
      setVisaType(profileData.visa_type)
      setVisaLockedFromSignup(true)
    }

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

      // Go straight to checklist so user sees what to upload (no vague upload step)
      router.push(`/case/${caseData.id}/checklist`)
      return
    } catch (err: any) {
      setError(err.message || 'Failed to create case')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <>
      <Head>
        <title>Create case — WINIT Portugal Immigration</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Progress */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="text-primary font-bold">1. Case details</span>
            <span className="text-text-muted font-bold">2. View checklist & upload</span>
          </div>
          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '50%', height: '100%', background: '#1e293b', transition: 'width 0.3s' }} />
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>After you create your case, you&apos;ll see your personalized checklist with each document type—upload from there.</p>
        </div>

        {/* Case Details */}
        <div className="card animate-fade-in" style={{ background: 'white', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
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
                    onClick={() => router.push('/')}
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
                    Back to home
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
                {visaLockedFromSignup ? (
                  <>
                    <div style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem' }}>
                      {visaType}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowVisaInfo(!showVisaInfo)}
                      style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', border: 'none', background: 'none', padding: 0, marginTop: '0.5rem' }}
                    >
                      {showVisaInfo ? '▼ Hide visa details' : '▶ Show details about this visa'}
                    </button>
                    <p className="text-text-muted text-sm" style={{ marginTop: '0.5rem' }}>
                      Set at signup. To change visa type, contact your specialist.
                    </p>
                  </>
                ) : (
                  <>
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
                        <option value="D8 Visa">D8 Visa (Digital Nomad) - Remote workers (min €3,040/month income)</option>
                      </optgroup>
                    </select>
                  </>
                )}
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
                        background: '#1e293b',
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
                  background: (loading || accessBlocked) ? '#9ca3af' : '#1e293b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: (loading || accessBlocked) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Creating...' : 'Create my case & view checklist'}
              </button>
            </form>
          </div>
      </div>
    </div>
    </>
  )
}
