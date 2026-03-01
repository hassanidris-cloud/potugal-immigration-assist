import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase can return tokens in hash (#) or query (?)
        const hashParams = new URLSearchParams(
          typeof window !== 'undefined' ? window.location.hash.substring(1) : ''
        )
        const queryParams = new URLSearchParams(
          typeof window !== 'undefined' ? window.location.search : ''
        )
        const access_token = hashParams.get('access_token') || queryParams.get('access_token')
        const refresh_token = hashParams.get('refresh_token') || queryParams.get('refresh_token')
        const type = hashParams.get('type') || queryParams.get('type')
        const errorParam = hashParams.get('error_description') || queryParams.get('error_description') || hashParams.get('error') || queryParams.get('error')

        if (errorParam) {
          setError(errorParam)
          setStatus('error')
          return
        }

        if (access_token) {
          // Set the session so the client has the user
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token || '',
          })
          if (sessionError) {
            setError(sessionError.message || 'Invalid confirmation link')
            setStatus('error')
            return
          }

          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            // Create user profile if it doesn't exist
            const { data: existingProfile } = await supabase
              .from('users')
              .select('id')
              .eq('id', user.id)
              .single()

            if (!existingProfile) {
              const res = await fetch('/api/auth/complete-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user.id,
                  email: user.email,
                  fullName: user.user_metadata?.full_name || '',
                  phone: user.user_metadata?.phone || null,
                }),
              })
              if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                setError(data.error || 'Failed to create profile')
                setStatus('error')
                return
              }
            }

            setStatus('success')
            router.push('/auth/login?verified=1')
            return
          }
        }

        // No tokens or not signup – send to login
        router.push('/auth/login')
      } catch (err: any) {
        console.error('Callback error:', err)
        setError(err?.message || 'Error confirming email')
        setStatus('error')
      }
    }

    handleCallback()
  }, [router])

  if (status === 'error') {
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
          maxWidth: '420px',
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          padding: '2.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#1e293b' }}>
            Error confirming email
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            {error}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/auth/resend-verification" style={{
              display: 'block',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #0066cc, #00c896)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Resend verification email
            </Link>
            <Link href="/auth/login" style={{
              display: 'block',
              padding: '0.75rem 1.5rem',
              color: '#0066cc',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Go to login
            </Link>
          </div>
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
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>✨</div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#1e293b' }}>
          Verifying your email...
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
          Please wait while we set up your account
        </p>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
