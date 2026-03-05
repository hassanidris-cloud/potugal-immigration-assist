import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../../../lib/supabaseClient'
import { countries } from '../../../lib/countries'

export default function EditCase() {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState<any>(null)
  const [caseData, setCaseData] = useState<any>(null)
  const [caseType, setCaseType] = useState('Immigration Application')
  const [visaType, setVisaType] = useState('D7 Visa')
  const [countryOfOrigin, setCountryOfOrigin] = useState('')
  const [targetVisaDate, setTargetVisaDate] = useState('')
  const [initialVisaType, setInitialVisaType] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadCase()
    }
  }, [id])

  const loadCase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      const admin = profile?.role === 'admin'
      setIsAdmin(!!admin)

      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setError('Case not found')
        return
      }

      if (!admin && data.user_id !== user.id) {
        setError('You do not have access to this case')
        return
      }

      setCaseData(data)
      setCaseType(data.case_type || 'Immigration Application')
      setVisaType(data.visa_type || 'D7 Visa')
      setInitialVisaType(data.visa_type || 'D7 Visa')
      setCountryOfOrigin(data.country_of_origin || '')
      setTargetVisaDate(data.target_visa_date ? String(data.target_visa_date).split('T')[0] : '')
    } catch (err: any) {
      setError(err.message || 'Failed to load case')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!id || typeof id !== 'string') {
      setError('Case not loaded. Please wait and try again.')
      return
    }
    setError('')
    setSaving(true)

    try {
      const updatePayload: Record<string, unknown> = {
        case_type: caseType,
        country_of_origin: countryOfOrigin,
        target_visa_date: targetVisaDate || null,
      }
      if (isAdmin) {
        updatePayload.visa_type = visaType
      }

      const { error: updateError } = await supabase
        .from('cases')
        .update(updatePayload)
        .eq('id', id)

      if (updateError) throw updateError

      const visaChanged = isAdmin && initialVisaType && initialVisaType !== visaType

      if (visaChanged) {
        await supabase
          .from('case_checklist')
          .delete()
          .eq('case_id', id)

        let { data: templates } = await supabase
          .from('checklist_templates')
          .select('*')
          .eq('visa_type', visaType)
          .order('order_index')

        // DB may have D8 checklist under "D7 Digital Nomad"; use as fallback for D8 Visa
        if ((!templates || templates.length === 0) && visaType === 'D8 Visa') {
          const { data: fallback } = await supabase
            .from('checklist_templates')
            .select('*')
            .eq('visa_type', 'D7 Digital Nomad')
            .order('order_index')
          templates = fallback
        }

        if (templates && templates.length > 0) {
          const checklistItems = templates.map((template: any) => ({
            case_id: id,
            template_id: template.id,
            title: template.title,
            description: template.description,
            order_index: template.order_index,
            completed: false,
          }))

          await supabase.from('case_checklist').insert(checklistItems)
        }

        if (caseData?.user_id) {
          await supabase.from('users').update({ visa_type: visaType }).eq('id', caseData.user_id)
        }
      }

      router.push(`/case/${id}/checklist`)
    } catch (err: any) {
      setError(err.message || 'Failed to update case')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <>
      <Head>
        <title>Edit case — WINIT Portugal Immigration</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    <div className="case-page-wrap" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', fontFamily: 'var(--font-sans, sans-serif)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <Link href={`/case/${id}/checklist`} style={{ color: '#0066cc', textDecoration: 'none' }}>← Back to Checklist</Link>
          <h1 style={{ marginTop: '1rem', fontSize: '2rem', color: '#1e293b' }}>Edit Case Details</h1>
          <p style={{ color: '#64748b' }}>Update your visa type or personal details at any time.</p>
        </header>

        {error && (
          <div style={{ color: '#ef4444', padding: '1rem', background: '#fee2e2', borderRadius: '8px', borderLeft: '4px solid #ef4444', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSave} style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="caseType" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>Case Type</label>
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
              <label htmlFor="visaType" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>Visa Type</label>
              {isAdmin ? (
                <select
                  id="visaType"
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'white' }}
                >
                  <optgroup label="Residency visa programs">
                    <option value="D2 Visa">D2 Visa - Entrepreneurs, freelancers, independent service providers</option>
                    <option value="D7 Visa">D7 Visa - Passive income (retirees, pensioners, rental/dividend income)</option>
                    <option value="D8 Visa">D8 Visa (Digital Nomad) - Remote workers (min €3,040/month income)</option>
                  </optgroup>
                </select>
              ) : (
                <>
                  <div style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem' }}>
                    {visaType}
                  </div>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                    To change visa type, contact your specialist.
                  </p>
                </>
              )}
            </div>

            <div>
              <label htmlFor="countryOfOrigin" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>Country of Origin</label>
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
              <label htmlFor="targetVisaDate" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>Target Application Date (optional)</label>
              <input
                id="targetVisaDate"
                type="date"
                value={targetVisaDate}
                onChange={(e) => setTargetVisaDate(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem' }}
              />
            </div>

            {isAdmin && initialVisaType && initialVisaType !== visaType && (
              <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <p style={{ margin: 0, color: '#92400e', fontSize: '0.95rem' }}>
                  Your checklist will be automatically refreshed to match the new visa requirements when you save.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '0.9rem 2rem',
                  background: 'linear-gradient(135deg, #0066cc, #00c896)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href={`/case/${id}/checklist`}
                style={{
                  padding: '0.9rem 2rem',
                  background: 'white',
                  color: '#0066cc',
                  border: '2px solid #0066cc',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
