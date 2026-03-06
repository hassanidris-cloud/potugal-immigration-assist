import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import { phoneCountries, getFlagUrl } from '../../lib/phoneCountries'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [visaType, setVisaType] = useState('')
  const [phoneCountry, setPhoneCountry] = useState('+351') // Default to Portugal
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [emailSendFailed, setEmailSendFailed] = useState(false)

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            phone: phone ? `${phoneCountry} ${phone}` : null,
            date_of_birth: dateOfBirth,
            visa_type: visaType,
          },
        }
      })

      const authMsg = (authError?.message || '').toLowerCase()
      const isEmailSendError = authMsg.includes('sending') && (authMsg.includes('confirmation') || authMsg.includes('email'))

      // If we have a user (even with an error), email confirmation may have been sent or attempted
      if (authData?.user) {
        const needsConfirmation = (authData.user.identities && authData.user.identities.length === 0) ||
          authData.user.email_confirmed_at === null
        if (needsConfirmation || authMsg.includes('confirm') || isEmailSendError) {
          setEmailSendFailed(!!isEmailSendError)
          setVerificationSent(true)
          setLoading(false)
          return
        }

        // No confirmation needed – create profile (API or client fallback)
        const response = await fetch('/api/auth/complete-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: authData.user.id,
            email,
            fullName,
            phone: phone ? `${phoneCountry} ${phone}` : null,
            dateOfBirth,
            visaType,
          }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          // Fallback: create profile from client (RLS allows "insert own profile")
          const { error: insertError } = await supabase.from('users').insert({
            id: authData.user.id,
            email,
            full_name: fullName || null,
            phone: phone ? `${phoneCountry} ${phone}` : null,
            role: 'client',
          })
          if (insertError) throw new Error(data.error || insertError.message || 'Failed to create profile')
        }

        setVerificationSent(true)
        setLoading(false)
        return
      }

      if (authError) {
        const msg = authError.message || ''

        // If Supabase says the confirmation email failed to send, we still
        // treat signup as successful and show the verification screen,
        // guiding the user to the "Resend verification" flow.
        if (isEmailSendError || msg.toLowerCase().includes('confirmation') || msg.toLowerCase().includes('confirm')) {
          setEmailSendFailed(true)
          setVerificationSent(true)
          setLoading(false)
          return
        }

        if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered') || msg.toLowerCase().includes('exists')) {
          setError('This email is already registered. Check your inbox for a verification link, or try signing in.')
          setLoading(false)
          return
        }

        throw authError
      }
    } catch (err: any) {
      setError(err?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  // Show verification success message
  if (verificationSent) {
    return (
      <div className="auth-page-wrap" style={{ background: '#f5f5f5' }}>
        <div className="auth-card auth-card-wide auth-inner" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#1e293b', fontWeight: '600' }}>Check Your Email</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: emailSendFailed ? '1rem' : '1.5rem' }}>
            We've sent a verification link to <strong>{email}</strong>. Check your inbox and click the link to verify your account.
          </p>
          {emailSendFailed && (
            <div style={{ color: '#92400e', fontSize: '0.9rem', marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fcd34d' }}>
              <p style={{ margin: '0 0 0.5rem 0' }}>The verification email could not be sent.</p>
              <Link href="/auth/resend-verification" style={{ color: '#92400e', fontWeight: '600', textDecoration: 'underline' }}>
                Request a new verification email
              </Link>
            </div>
          )}
          <div style={{
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            textAlign: 'left',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#475569', fontSize: '0.875rem', fontWeight: '600' }}>Next steps</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#64748b', fontSize: '0.875rem' }}>
              <li>Check your inbox and spam folder</li>
              <li>Click the verification link</li>
              <li>Sign in to continue</li>
            </ul>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontSize: '0.875rem', textDecoration: 'none' }}>Gmail</a>
            <a href="https://outlook.live.com/mail" target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontSize: '0.875rem', textDecoration: 'none' }}>Outlook</a>
            <a href="https://www.icloud.com/mail" target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontSize: '0.875rem', textDecoration: 'none' }}>iCloud Mail</a>
          </div>

          <Link href="/auth/login" style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: '#1e293b',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '0.9375rem'
          }}>
            Go to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page-wrap" style={{ background: '#f5f5f5' }}>
      <div className="signup-card">
        {/* Left Side - Branding */}
        <div className="signup-card-branding">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem 0', fontWeight: '600', letterSpacing: '0.02em' }}>WINIT</h1>
            <p style={{ fontSize: '0.95rem', margin: 0, opacity: 0.9 }}>
              Portugal immigration assistance
            </p>
          </div>

          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>—</span>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>Step-by-step visa guidance</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', opacity: 0.85 }}>Requirements and checklist for your visa type</p>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>—</span>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>Document management</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', opacity: 0.85 }}>Secure uploads and specialist review</p>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>—</span>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>Expert support</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', opacity: 0.85 }}>Portugal immigration specialists</p>
              </div>
            </li>
          </ul>

          <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.75 }}>
            Trusted by applicants worldwide
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="signup-card-form">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', margin: '0 0 0.25rem 0', color: '#1e293b', fontWeight: '600' }}>Create account</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
              Enter your details to get started
            </p>
          </div>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{
                color: '#b91c1c',
                padding: '0.75rem',
                background: '#fef2f2',
                borderRadius: '6px',
                fontSize: '0.875rem',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" style={{ display: 'block', marginBottom: '0.375rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Full name</label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#374151' }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" style={{ display: 'block', marginBottom: '0.375rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Date of birth</label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#374151' }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
              />
            </div>

            <div>
              <label htmlFor="visaType" style={{ display: 'block', marginBottom: '0.375rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Visa type</label>
              <select
                id="visaType"
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box', background: 'white' }}
                onFocus={(e) => { e.target.style.borderColor = '#374151' }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
              >
                <option value="" disabled>Select visa type</option>
                <option value="D2">D2 Visa (Entrepreneur)</option>
                <option value="D7">D7 Visa (Passive Income)</option>
                <option value="D8">D8 Visa (Digital Nomad)</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.375rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Email address</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#374151' }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
              />
            </div>

            <div>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.375rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Phone number</label>
              <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
                {/* Country Code Selector */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    style={{
                      padding: '0.75rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      minWidth: '130px',
                      justifyContent: 'space-between',
                      outline: 'none'
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#374151' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db' }}
                  >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img 
                    src={getFlagUrl(phoneCountries.find(c => c.dial === phoneCountry)?.code || 'PT')} 
                    alt="flag"
                    style={{ width: '20px', height: '15px', objectFit: 'cover' }}
                  />
                  {phoneCountry}
                </span>
                <span style={{ fontSize: '0.7rem' }}>▼</span>
                  </button>
              
                  {/* Dropdown */}
                  {showCountryDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '0.25rem',
                      background: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      maxHeight: '250px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      width: '280px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                  {phoneCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        setPhoneCountry(country.dial)
                        setShowCountryDropdown(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: 'none',
                        background: phoneCountry === country.dial ? '#f3f4f6' : 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = phoneCountry === country.dial ? '#f3f4f6' : 'white' }}
                    >
                      <img 
                        src={getFlagUrl(country.code)} 
                        alt={country.name}
                        style={{ width: '20px', height: '15px', objectFit: 'cover' }}
                      />
                      <span style={{ flex: 1 }}>{country.name}</span>
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{country.dial}</span>
                    </button>
                  ))}
                    </div>
                  )}
                </div>

                {/* Phone Number Input */}
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="912 345 678"
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9375rem', outline: 'none' }}
                  onFocus={(e) => { e.target.style.borderColor = '#374151' }}
                  onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.375rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Password</label>
              <input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#374151' }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: loading ? '#9ca3af' : '#1e293b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9375rem',
                fontWeight: '500',
                marginTop: '0.25rem'
              }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: '#1e293b', textDecoration: 'none', fontWeight: '500' }}>
                Sign in
              </Link>
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>
              <Link href="/auth/resend-verification" style={{ color: '#6b7280', textDecoration: 'none' }}>Resend verification</Link>
              {' · '}
              <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Back to home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
