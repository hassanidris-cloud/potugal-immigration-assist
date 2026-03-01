import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function AdminUsers() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/auth/login')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.replace('/dashboard')
        return
      }

      await loadUsers()
    } catch (error) {
      console.error('Error checking admin:', error)
      router.replace('/dashboard')
    }
  }

  const loadUsers = async () => {
    try {
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      setUsers(usersData || [])
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
        <h1 style={{ marginTop: '1rem' }}>Clients & contacts</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>All clients who have signed up. Total: {users.length}</p>
      </header>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Email</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Phone</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Role</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{u.full_name || '—'}</td>
                  <td style={{ padding: '0.75rem' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{u.role || 'client'}</td>
                  <td style={{ padding: '0.75rem' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
