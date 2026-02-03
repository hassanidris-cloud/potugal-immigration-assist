import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function ResetPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'password' | 'success'>('email')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      })

      if (error) throw error

      setStep('otp')
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      })

      if (error) throw error

      setStep('password')
    } catch (err: any) {
      setError(err.message || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
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
        maxWidth: '450px',
        width: '100%',
        background: 'white',
        borderRadius: 'email' && 'Reset Password'}
            {step === 'otp' && 'Enter Verification Code'}
            {step === 'password' && 'Set New Password'}
            {step === 'success' && 'Password Updated'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            {step === 'email' && 'Enter your email to receive a verification code'}
            {step === 'otp' && `We sent a 6-digit code to ${email}`}
            {step === 'password' && 'Choose a strong password for your account'}
            {step === 'success' && 'Your password has been successfully updated'}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleSendOTP
          </h1>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#1e293b' }}>
            {step === 'request' && 'Reset Password'}
            {step === 'reset' && 'Set New Password'}
            {step === 'success' && 'Check Your Email'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            {step === 'request' && 'Enter your email to receive a password reset link'}
            {step === 'reset' && 'Choose a strong password for your account'}
            {step === 'success' && 'We sent a password reset link to your email'}
          </p>
        </div>

        {step === 'request' && (
          <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                ✉️ Email Address
              </label>
              <input
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
              }}� Send Verification Code'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                🔢 6-Digit Code
              </label>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                style={{ 
                  width: '100%', 
                  padding: '0.875rem', 
                  borderRadius: '10px', 
                  border: '2px solid #e2e8f0',
                  fontSize: '1.5rem',
                  textAlign: 'center',
                  letterSpacing: '0.5rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  fontWeight: '600'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              style={{ 
                width: '100%',
                padding: '1rem', 
                background: (loading || otp.length !== 6) ? '#94a3b8' : 'linear-gradient(135deg, #0066cc, #00c896)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                fontSize: '1.05rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                boxShadow: (loading || otp.length !== 6) ? 'none' : '0 4px 12px rgba(0, 102, 204, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading && otp.length === 6) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 102, 204, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = (loading || otp.length !== 6) ? 'none' : '0 4px 12px rgba(0, 102, 204, 0.3)';
              }}
            >
              {loading ? '⏳ Verifying...' : '✅ Verify Code'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email')
                setOtp('')
                setError('')
              }}
              style={{
                padding: '0.75rem',
                background: 'white',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              ← Use Different Email
            </button>
          </form>
        )}

        {step === 'password

        {step === 'reset' && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ 
                color: '#dc2626', 
                padding: '0.875rem', 
                background: '#fee2e2', 
                borderRadius: '8px',
        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          {step === 'emailr="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.5rem 0 0 0' }}>
                At least 6 characters
              </p>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                🔒 Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? '⏳ Resetting...' : '✅ Reset Password'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '1rem',
              animation: 'bounce 1s ease-in-out'
            }}>
              📧
            </div>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Check your inbox for <strong>{email}</strong> and click the reset link to set a new password.
            </p>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              The link will expire in 1 hour.
            </p>
          </div>
        )}

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          {step !== 'reset' && (
            <>
              <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                Remember your password?{' '}
                <Link href="/auth/login" style={{ 
                  color: '#0066cc', 
                  textDecoration: 'none',
                  fontWeight: '600'
                }}>
                  Login
                </Link>
              </p>
              <Link href="/" style={{ 
                color: '#94a3b8', 
                textDecoration: 'none',
                fontSize: '0.85rem'
              }}>
                ← Back to home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
