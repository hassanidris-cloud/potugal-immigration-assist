import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { useAcceptedUser } from '../hooks/useAcceptedUser'

type Props = {
  onNavigate?: () => void
  /** Optional class for the container (e.g. for dropdown styling). */
  className?: string
  /** Link class names for nav styling. */
  linkClass?: string
  signupClass?: string
}

/**
 * Renders either "Login" + "Sign Up" or "Dashboard" + "Log out"
 * depending on whether the user is logged in and accepted by admin.
 * Use in main site nav (homepage, visa pages, etc.).
 */
export default function AuthNavLinks({ onNavigate, className, linkClass = 'no-underline font-medium', signupClass = 'home-nav-signup no-underline' }: Props) {
  const router = useRouter()
  const { isAccepted, loading } = useAcceptedUser()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onNavigate?.()
    router.push('/')
  }

  if (loading) {
    return (
      <span className={linkClass} style={{ opacity: 0.7 }}>
        …
      </span>
    )
  }

  if (isAccepted) {
    return (
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link href="/dashboard" onClick={onNavigate} className={linkClass}>
          Dashboard
        </Link>
        <button
          type="button"
          onClick={() => { onNavigate?.(); handleLogout() }}
          className={linkClass}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            font: 'inherit',
            color: '#fff',
            padding: 0,
          }}
        >
          Log out
        </button>
      </span>
    )
  }

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <Link href="/auth/login" onClick={onNavigate} className={linkClass}>
        Login
      </Link>
      <Link href="/auth/signup" onClick={onNavigate} className={signupClass}>
        Sign Up
      </Link>
    </span>
  )
}
