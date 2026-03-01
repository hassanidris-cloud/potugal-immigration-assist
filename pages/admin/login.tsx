import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const redirected = router.query.message === 'admin'

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
        .select('role')
        .eq('id', user!.id)
        .single()

      if (profile?.role === 'admin') {
        router.push('/dashboard') // Admin panel (workspace)
      } else {
        setError('This login is for administrators only.')
        await supabase.auth.signOut()
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
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'sans-serif',
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '2.5rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h1 style={{
            fontSize: '1.75rem',
            margin: '0 0 0.25rem 0',
            color: '#1e293b',
          }}>
            Admin sign in
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Use your admin account to access the specialist panel
          </p>
        </div>

        {redirected && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '8px',
            color: '#92400e',
            fontSize: '0.875rem',
          }}>
            Please sign in here with your admin credentials to access the panel.
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{
              color: '#dc2626',
              padding: '0.75rem',
              background: '#fee2e2',
              borderRadius: '8px',
              fontSize: '0.875rem',
              border: '1px solid #fecaca',
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.4rem',
              color: '#475569',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.4rem',
              color: '#475569',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: loading ? '#94a3b8' : '#1e293b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/auth/login" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>
            ← Client login
          </Link>
          <span style={{ color: '#cbd5e1', margin: '0 0.5rem' }}>·</span>
          <Link href="/" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
