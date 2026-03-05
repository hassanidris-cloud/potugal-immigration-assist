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
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email')
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
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '420px', width: '100%', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '2.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem 0', color: '#1e293b', fontWeight: '600' }}>WINIT</h1>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#1e293b' }}>
            {step === 'email' && 'Reset Password'}
            {step === 'otp' && 'Enter Code'}
            {step === 'password' && 'New Password'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            {step === 'email' && 'Enter your email to receive a code'}
            {step === 'otp' && `Code sent to ${email}`}
            {step === 'password' && 'Set a new password'}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ color: '#dc2626', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', background: loading ? '#9ca3af' : '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500' }}
            >
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ color: '#dc2626', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
                6-Digit Code
              </label>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                style={{ width: '100%', padding: '0.75rem', fontSize: '1.25rem', textAlign: 'center', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              style={{ width: '100%', padding: '0.75rem', background: (loading || otp.length !== 6) ? '#9ca3af' : '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer', fontWeight: '500' }}
            >
              {loading ? 'Verifying…' : 'Verify'}
            </button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ color: '#dc2626', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', background: loading ? '#9ca3af' : '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500' }}
            >
              {loading ? 'Resetting…' : 'Reset password'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/auth/login" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>Back to sign in</Link>
        </div>
      </div>
    </div>
  )
}
