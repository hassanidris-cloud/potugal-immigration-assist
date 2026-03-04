import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'
import { countries } from '../lib/countries'

export default function Onboarding() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [caseType, setCaseType] = useState('Immigration Application')
  const [visaType, setVisaType] = useState('D7 Visa')
  const [countryOfOrigin, setCountryOfOrigin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [accessBlocked, setAccessBlocked] = useState(false)
  const [blockMessage, setBlockMessage] = useState('')

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
      setBlockMessage('Your account is pending payment confirmation. The specialist will enable your access after payment, and we will email you once your account is approved.')
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
      router.replace('/dashboard')
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
        router.push('/dashboard')
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
          status: 'pending',
        })
        .select()
        .single()

      if (caseError) throw caseError

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

      router.push('/dashboard')
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
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
          padding: '2rem',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div
            className="card animate-fade-in"
            style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <h1 className="text-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Create your case
            </h1>
            <p className="text-text-muted" style={{ marginBottom: '2rem' }}>
              Tell us your country, visa type, and case type. We&apos;ll generate your checklist automatically and take you to the dashboard.
            </p>

            {accessBlocked && (
              <div
                style={{
                  background: '#fff7ed',
                  border: '1px solid #fdba74',
                  color: '#9a3412',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                }}
              >
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
                      cursor: 'pointer',
                    }}
                  >
                    Back to home
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                opacity: accessBlocked ? 0.6 : 1,
                pointerEvents: accessBlocked ? 'none' : 'auto',
              }}
            >
              {error && (
                <div
                  className="text-error"
                  style={{
                    padding: '1rem',
                    background: '#fee2e2',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--error)',
                  }}
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="caseType"
                  className="text-text font-semibold"
                  style={{ display: 'block', marginBottom: '0.5rem' }}
                >
                  Case Type
                </label>
                <select
                  id="caseType"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                  }}
                >
                  <option>Immigration Application</option>
                  <option>Residency Renewal</option>
                  <option>Citizenship Application</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="visaType"
                  className="text-text font-semibold"
                  style={{ display: 'block', marginBottom: '0.5rem' }}
                >
                  Visa Type
                </label>
                <select
                  id="visaType"
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    background: 'white',
                  }}
                >
                  <optgroup label="Residency visa programs">
                    <option value="D2 Visa">D2 Visa - Entrepreneurs, freelancers, independent service providers</option>
                    <option value="D7 Visa">D7 Visa - Passive income (retirees, pensioners, rental/dividend income)</option>
                    <option value="D7 Digital Nomad">D8 Visa (Digital Nomad) - Remote workers</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label
                  htmlFor="countryOfOrigin"
                  className="text-text font-semibold"
                  style={{ display: 'block', marginBottom: '0.5rem' }}
                >
                  Country of Origin
                </label>
                <select
                  id="countryOfOrigin"
                  value={countryOfOrigin}
                  onChange={(e) => setCountryOfOrigin(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    background: 'white',
                  }}
                  required
                >
                  <option value="">Select your country...</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || accessBlocked}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background:
                    loading || accessBlocked
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #0066cc, #00c896)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: loading || accessBlocked ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Creating case...' : 'Create case'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
