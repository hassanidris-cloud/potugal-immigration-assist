import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function AdminUsers() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [markingId, setMarkingId] = useState<string | null>(null)

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

  const markPaid = async (userId: string) => {
    setMarkingId(userId)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) {
        alert('Session expired. Please sign in again.')
        return
      }
      const res = await fetch('/api/admin/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to mark as paid')
        return
      }
      await loadUsers()
    } catch (e) {
      console.error('Mark paid error:', e)
      alert('Something went wrong. Please try again.')
    } finally {
      setMarkingId(null)
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
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Paid</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Joined</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Invoice</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{u.full_name || '—'}</td>
                  <td style={{ padding: '0.75rem' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{u.role || 'client'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {u.paid_at ? (
                      <span style={{ color: '#059669', fontWeight: '600' }}>✓ Yes</span>
                    ) : (
                      <span style={{ color: '#64748b' }}>No</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {u.role !== 'admin' && (
                      <Link
                        href={`/admin/client/${u.id}`}
                        style={{
                          padding: '0.4rem 0.75rem',
                          background: '#0066cc',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          display: 'inline-block',
                        }}
                      >
                        Invoice
                      </Link>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {u.role !== 'admin' && !u.paid_at && (
                      <button
                        type="button"
                        disabled={markingId === u.id}
                        onClick={() => markPaid(u.id)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          background: markingId === u.id ? '#94a3b8' : '#059669',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: markingId === u.id ? 'not-allowed' : 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        {markingId === u.id ? 'Updating…' : 'Mark as paid'}
                      </button>
                    )}
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
