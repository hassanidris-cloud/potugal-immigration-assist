import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function AdminUsers() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [subscriptionsByUser, setSubscriptionsByUser] = useState<Record<string, any>>({})

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      await loadUsers()
    } catch (error) {
      console.error('Error checking admin:', error)
      router.push('/dashboard')
    }
  }

  const loadUsers = async () => {
    try {
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: subsData } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false })

      const latestSubs: Record<string, any> = {}
      if (subsData) {
        for (const sub of subsData) {
          if (!latestSubs[sub.user_id]) {
            latestSubs[sub.user_id] = sub
          }
        }
      }

      setUsers(usersData || [])
      setSubscriptionsByUser(latestSubs)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
        <h1 style={{ marginTop: '1rem' }}>Admin: All Users</h1>
        <p style={{ color: '#64748b' }}>Total users: {users.length}</p>
      </header>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Email</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Phone</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Role</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Subscription</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Status</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Trial Ends</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const sub = subscriptionsByUser[u.id]
              const isTrial = sub?.amount === 0
              const trialEnds = sub?.expires_at ? new Date(sub.expires_at) : null
              const trialLabel = trialEnds ? trialEnds.toLocaleDateString() : '-'

              return (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{u.full_name || '—'}</td>
                  <td style={{ padding: '0.75rem' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{u.role || 'client'}</td>
                  <td style={{ padding: '0.75rem' }}>{sub ? (isTrial ? 'Trial' : (sub.plan || 'Paid')) : 'None'}</td>
                  <td style={{ padding: '0.75rem' }}>{sub?.status || '—'}</td>
                  <td style={{ padding: '0.75rem' }}>{trialLabel}</td>
                  <td style={{ padding: '0.75rem' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
