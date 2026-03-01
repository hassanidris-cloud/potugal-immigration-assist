import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      const { data: profile } = await supabase
        .from('users')
        .select('role, paid_at')
        .eq('id', user!.id)
        .single()

      // Admins must use the admin login page
      if (profile?.role === 'admin') {
        await supabase.auth.signOut()
        router.push('/admin/login?message=admin')
        return
      }

      if (profile?.paid_at) {
        router.push('/dashboard')
      } else {
        router.push('/account-pending')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
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
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        padding: '3rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #0066cc 0%, #00c896 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            WINIT
          </h1>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#1e293b' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Sign in to your account to continue
          </p>
        </div>

        {router.query.verified === '1' && (
          <div style={{ 
            color: '#059669', 
            padding: '0.875rem', 
            background: '#d1fae5', 
            borderRadius: '8px',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            border: '1px solid #a7f3d0'
          }}>
            Email confirmed! You can now sign in.
          </div>
        )}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#475569',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              🔒 Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? '⏳ Signing In...' : '🔓 Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>
            <Link href="/auth/reset-password" style={{ 
              color: '#0066cc', 
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Forgot Password?
            </Link>
          </p>
          <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" style={{ 
              color: '#0066cc', 
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Sign Up
            </Link>
          </p>
          <Link href="/" style={{ 
            color: '#94a3b8', 
            textDecoration: 'none',
            fontSize: '0.85rem'
          }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}