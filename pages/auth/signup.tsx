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

        // No confirmation needed – create profile
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

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to create profile')

        setVerificationSent(true)
        setLoading(false)
        return
      }

      if (authError) {
        const msg = authError.message || ''
        if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered') || msg.toLowerCase().includes('exists')) {
          setError('This email is already registered. Check your inbox for a verification link, or try signing in.')
          setLoading(false)
          return
        }
        if (isEmailSendError) {
          setError('Your account was created but we couldn\'t send the verification email right now. Use "Resend verification email" below to get a new link.')
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
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ 
          maxWidth: '500px',
          width: '100%',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📧</div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: '#1e293b' }}>Check Your Email</h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: emailSendFailed ? '1rem' : '2rem' }}>
            We've sent a verification link to <strong>{email}</strong>.
            Please check your inbox and click the link to verify your account.
          </p>
          {emailSendFailed && (
            <div style={{ color: '#b45309', fontSize: '0.95rem', marginBottom: '2rem', padding: '1rem', background: '#fffbeb', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 0.75rem 0' }}>The verification email could not be sent right now.</p>
              <Link href="/auth/resend-verification" style={{ color: '#b45309', fontWeight: '600', textDecoration: 'underline' }}>
                Request a new verification email →
              </Link>
            </div>
          )}
          <div style={{ 
            padding: '1rem',
            background: '#f0f9ff',
            borderRadius: '10px',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#0369a1', fontSize: '0.9rem', fontWeight: '600' }}>
              Next Steps:
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link</li>
              <li>You'll be redirected to login</li>
              <li>Start your 14-day free trial!</li>
            </ul>
          </div>
          <Link href="/auth/login" style={{ 
            display: 'inline-block',
            padding: '0.875rem 2rem',
            background: 'linear-gradient(135deg, #0066cc, #00c896)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)'
          }}>
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '1100px',
        width: '100%',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        overflow: 'hidden'
      }}>
        {/* Left Side - Branding */}
        <div style={{
          background: 'linear-gradient(135deg, #0066cc, #00c896)',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'white'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', fontWeight: '700' }}>WINIT</h1>
            <p style={{ fontSize: '1.2rem', margin: '0 0 2rem 0', opacity: 0.95 }}>
              Your Portugal Immigration Partner
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%', 
                padding: '0.75rem',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}>✓</div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Comprehensive Guidance</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                  Step-by-step support through every visa requirement
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%', 
                padding: '0.75rem',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}>✓</div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Document Management</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                  Secure platform for all your immigration documents
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%', 
                padding: '0.75rem',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}>✓</div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Expert Support</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                  Professional assistance from Portugal immigration specialists
                </p>
              </div>
            </div>
          </div>

          <div style={{ 
            marginTop: 'auto',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
              🇵🇹 Trusted by hundreds of successful applicants
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{ padding: '3rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: '#1e293b' }}>Create Account</h2>
            <p style={{ margin: '0', color: '#64748b', fontSize: '0.95rem' }}>
              Start your Portugal immigration journey today
            </p>
          </div>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ 
                color: '#dc2626', 
                padding: '0.875rem', 
                background: '#fee2e2', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}
        
            <div>
              <label htmlFor="fullName" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                👤 Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.875rem', 
                  borderRadius: '10px', 
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                🎂 Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.875rem', 
                  borderRadius: '10px', 
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label htmlFor="visaType" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                🛂 Visa Type
              </label>
              <select
                id="visaType"
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.875rem', 
                  borderRadius: '10px', 
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="" disabled>Select visa type</option>
                <option value="D2">D2 Visa (Entrepreneur)</option>
                <option value="D7">D7 Visa (Passive Income)</option>
                <option value="D8">D8 Visa (Digital Nomad)</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                ✉️ Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.875rem', 
                  borderRadius: '10px', 
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label htmlFor="phone" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                📱 Phone Number
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
                {/* Country Code Selector */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    style={{
                      padding: '0.875rem 0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      background: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      minWidth: '130px',
                      justifyContent: 'space-between',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                      marginTop: '0.5rem',
                      background: 'white',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      maxHeight: '250px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      width: '280px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
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
                        background: phoneCountry === country.dial ? '#f0f9ff' : 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9ff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = phoneCountry === country.dial ? '#f0f9ff' : 'white'}
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
                  style={{ 
                    flex: 1, 
                    padding: '0.875rem', 
                    borderRadius: '10px', 
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                🔒 Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ 
                  width: '100%', 
                  padding: '0.875rem', 
                  borderRadius: '10px', 
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '1rem', 
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0066cc, #00c896)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.05rem',
                fontWeight: '600',
                marginTop: '0.5rem',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(0, 102, 204, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 102, 204, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 12px rgba(0, 102, 204, 0.3)';
              }}
            >
              {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ 
                color: '#0066cc', 
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Sign In
              </Link>
            </p>
            <Link href="/auth/resend-verification" style={{ 
              color: '#94a3b8', 
              textDecoration: 'none',
              fontSize: '0.85rem'
            }}>
              Resend verification email
            </Link>
            {' • '}
            <Link href="/" style={{ 
              color: '#94a3b8', 
              textDecoration: 'none',
              fontSize: '0.85rem'
            }}>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
