import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
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
  const [regenerateChecklist, setRegenerateChecklist] = useState(true)
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

      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setError('Case not found')
        return
      }

      if (data.user_id !== user.id) {
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
    setError('')
    setSaving(true)

    try {
      const { error: updateError } = await supabase
        .from('cases')
        .update({
          case_type: caseType,
          visa_type: visaType,
          country_of_origin: countryOfOrigin,
          target_visa_date: targetVisaDate || null,
        })
        .eq('id', id)

      if (updateError) throw updateError

      const visaChanged = initialVisaType && initialVisaType !== visaType

      if (visaChanged && regenerateChecklist) {
        await supabase
          .from('case_checklist')
          .delete()
          .eq('case_id', id)

        const { data: templates } = await supabase
          .from('checklist_templates')
          .select('*')
          .eq('visa_type', visaType)
          .order('order_index')

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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', padding: '2rem', fontFamily: 'sans-serif' }}>
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
              <select
                id="visaType"
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'white' }}
              >
                <optgroup label="Short Stay (Up to 90 days)">
                  <option value="Schengen Visa">Schengen Visa - Tourism, business, family visits</option>
                </optgroup>
                <optgroup label="Temporary Stay (Up to 1 year)">
                  <option value="Temporary Stay Visa">Temporary Stay Visa - Medical, research, seasonal work</option>
                </optgroup>
                <optgroup label="National Residence Visas (Type D - Over 1 year)">
                  <option value="D1 Visa">D1 Visa - Employed workers with contract</option>
                  <option value="D2 Visa">D2 Visa - Entrepreneurs, freelancers, independent service providers</option>
                  <option value="D3 Visa">D3 Visa - Highly qualified activity (self-employed or subordinate)</option>
                  <option value="D7 Visa">D7 Visa - Passive income (retirees, pensioners, rental/dividend income)</option>
                  <option value="D7 Digital Nomad">D7 Digital Nomad Visa - Remote workers (min €3,040/month income)</option>
                  <option value="D4 Student Visa">D4 Student Visa - University and education</option>
                  <option value="D6 Family Reunification">D6 Family Reunification - Join family in Portugal</option>
                </optgroup>
                <optgroup label="Investment">
                  <option value="Golden Visa">Golden Visa (ARI) - Investment starting from €250,000</option>
                </optgroup>
              </select>
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

            {initialVisaType && initialVisaType !== visaType && (
              <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <p style={{ margin: 0, color: '#92400e', fontSize: '0.95rem' }}>
                  You changed the visa type. We can regenerate your checklist to match the new visa requirements.
                </p>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: '#92400e' }}>
                  <input
                    type="checkbox"
                    checked={regenerateChecklist}
                    onChange={(e) => setRegenerateChecklist(e.target.checked)}
                  />
                  Regenerate checklist for the new visa type
                </label>
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
  )
}
