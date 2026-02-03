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
        padding: '3rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#1e293b' }}>
            Resend Verification Email
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Didn't receive the email? Enter your email address to get a new one.
          </p>
        </div>

        <form onSubmit={handleResend} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

          {message && (
            <div style={{ 
              color: '#059669', 
              padding: '0.875rem', 
              background: '#d1fae5', 
              borderRadius: '8px',
              fontSize: '0.9rem',
              border: '1px solid #6ee7b7'
            }}>
              {message}
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
            }}
          >
            {loading ? '⏳ Sending...' : '📨 Resend Verification Email'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>
            Already verified?{' '}
            <Link href="/auth/login" style={{ 
              color: '#0066cc', 
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Login
            </Link>
          </p>
          <Link href="/auth/signup" style={{ 
            color: '#94a3b8', 
            textDecoration: 'none',
            fontSize: '0.85rem'
          }}>
            ← Back to signup
          </Link>
        </div>
      </div>
    </div>
  )
}
