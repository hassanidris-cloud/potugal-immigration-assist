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
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: '2.5rem'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem 0', color: '#1e293b', fontWeight: '600' }}>WINIT</h1>
          <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#1e293b', fontWeight: '500' }}>Sign in</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Sign in to your account to continue
          </p>
        </div>

        {router.query.verified === '1' && (
          <div style={{
            color: '#166534',
            padding: '0.75rem',
            background: '#dcfce7',
            borderRadius: '6px',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            border: '1px solid #bbf7d0'
          }}>
            Email confirmed. You can now sign in.
          </div>
        )}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <label style={{ display: 'block', marginBottom: '0.375rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Email address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.9375rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#374151' }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.9375rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
            <Link href="/auth/reset-password" style={{ color: '#1e293b', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</Link>
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
            Don&apos;t have an account? <Link href="/auth/signup" style={{ color: '#1e293b', textDecoration: 'none', fontWeight: '500' }}>Sign up</Link>
          </p>
          <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>
            <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
