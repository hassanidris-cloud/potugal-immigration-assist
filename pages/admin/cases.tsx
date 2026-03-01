import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function AdminCases() {
  const router = useRouter()
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

      loadCases()
    } catch (error) {
      console.error('Error checking admin:', error)
      router.replace('/dashboard')
    }
  }

  const loadCases = async () => {
    try {
      const { data } = await supabase
        .from('cases')
        .select(`
          *,
          users:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false })

      setCases(data || [])
    } catch (error) {
      console.error('Error loading cases:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
        <h1 style={{ marginTop: '1rem' }}>Client cases</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Review applications and chat with clients.</p>
      </header>

      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>All cases ({cases.length})</h2>
        {cases.length === 0 ? (
          <p>No cases found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Client</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Case Type</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Visa Type</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Created</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{c.users?.full_name || c.users?.email}</td>
                  <td style={{ padding: '0.75rem' }}>{c.case_type}</td>
                  <td style={{ padding: '0.75rem' }}>{c.visa_type}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '3px',
                      fontSize: '0.875rem',
                      background: c.status === 'approved' ? '#d4edda' : c.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                      color: c.status === 'approved' ? '#155724' : c.status === 'rejected' ? '#721c24' : '#856404'
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <Link href={`/admin/case/${c.id}`} style={{ color: '#0070f3' }}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
