import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export type AcceptedUser = {
  user: { id: string; email?: string } | null
  profile: { role?: string; paid_at?: string | null } | null
  isAccepted: boolean
  loading: boolean
}

/**
 * Returns the current user and profile. isAccepted is true only when
 * the user has an account and is accepted by admin (paid_at set or role is admin).
 * Use this to show "Dashboard" / "Back to dashboard" only for accepted users.
 */
export function useAcceptedUser(): AcceptedUser {
  const [user, setUser] = useState<AcceptedUser['user']>(null)
  const [profile, setProfile] = useState<AcceptedUser['profile']>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function run() {
      try {
        const { data: { user: u } } = await supabase.auth.getUser()
        if (!mounted) return
        setUser(u ?? null)
        if (!u) {
          setProfile(null)
          setLoading(false)
          return
        }
        const { data: p } = await supabase
          .from('users')
          .select('role, paid_at')
          .eq('id', u.id)
          .single()
        if (!mounted) return
        setProfile(p ?? null)
      } catch {
        if (mounted) setProfile(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    run()
    return () => { mounted = false }
  }, [])

  const isAccepted = Boolean(
    user && profile && (profile.paid_at != null || profile.role === 'admin')
  )

  return { user, profile, isAccepted, loading }
}
