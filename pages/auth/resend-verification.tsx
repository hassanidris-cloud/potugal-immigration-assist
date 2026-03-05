import { useState, FormEvent } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function ResendVerification() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResend = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) throw error

      setMessage('Verification email sent! Please check your inbox.')
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '420px', width: '100%', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '2.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.35rem', margin: '0 0 0.25rem 0', color: '#1e293b', fontWeight: '600' }}>Resend verification email</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
            Enter your email to receive a new verification link.
          </p>
        </div>

        <form onSubmit={handleResend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{ color: '#b91c1c', padding: '0.75rem', background: '#fef2f2', borderRadius: '6px', fontSize: '0.875rem', border: '1px solid #fecaca' }}>{error}</div>
          )}
          {message && (
            <div style={{ color: '#166534', padding: '0.75rem', background: '#dcfce7', borderRadius: '6px', fontSize: '0.875rem', border: '1px solid #bbf7d0' }}>{message}</div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Email address</label>
            <input
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
              fontWeight: '500'
            }}
          >
            {loading ? 'Sending…' : 'Resend verification email'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
            Already verified?{' '}
            <Link href="/auth/login" style={{ color: '#1e293b', textDecoration: 'none', fontWeight: '500' }}>
              Login
            </Link>
          </p>
          <Link href="/auth/signup" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.8rem' }}>Back to sign up</Link>
        </div>
      </div>
    </div>
  )
}
