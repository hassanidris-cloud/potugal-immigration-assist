import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

export default function AccountPending() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/auth/login')
        return
      }
      const { data: profile } = await supabase
        .from('users')
        .select('role, paid_at')
        .eq('id', user.id)
        .single()
      if (profile?.role === 'admin' || profile?.paid_at) {
        router.replace('/dashboard')
        return
      }
      setIsLoggedIn(true)
      setLoading(false)
    }
    check()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="auth-page-wrap" style={{ background: '#f5f5f5' }}>
        <p style={{ fontSize: '1rem', color: '#64748b' }}>Loading…</p>
      </div>
    )
  }

  return (
    <div className="auth-page-wrap" style={{ background: '#f5f5f5' }}>
      <div className="auth-card auth-card-wide auth-inner" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.35rem', margin: '0 0 0.5rem 0', color: '#1e293b', fontWeight: '600' }}>
          Account pending
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          You’re signed in. Your specialist will activate your account and confirm payment. Once that’s done, you’ll have full access to your dashboard, case, and documents.
        </p>
        <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '2rem' }}>
          If you’ve already paid or have questions, get in touch with us and we’ll sort it out.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link
            href="/contact"
            style={{
              display: 'block',
              padding: '1rem 1.5rem',
              background: '#1e293b',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              fontSize: '0.9375rem',
            }}
          >
            Contact us
          </Link>
          <Link
            href="/"
            style={{
              display: 'block',
              padding: '0.75rem',
              color: '#1e293b',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.9rem',
            }}
          >
            Back to home
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '0.75rem',
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
