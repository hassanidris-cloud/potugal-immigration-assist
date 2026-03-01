import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function AdminInvoices() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<any[]>([])
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
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role !== 'admin') {
        router.replace('/dashboard')
        return
      }
      await loadInvoices()
    } catch {
      router.replace('/dashboard')
    }
  }

  const loadInvoices = async () => {
    try {
      const { data } = await supabase
        .from('invoices')
        .select(`
          *,
          cases:case_id (case_type, visa_type, users:user_id (full_name, email))
        `)
        .order('created_at', { ascending: false })

      setInvoices(data || [])
    } catch (error) {
      console.error('Error loading invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (invoice: any) => {
    try {
      const res = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice_id: invoice.id,
          amount: invoice.amount,
          currency: invoice.currency,
          description: invoice.description,
        }),
      })

      const data = await res.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
        <h1 style={{ marginTop: '1rem' }}>Invoices</h1>
      </header>

      <section>
        <h2>All Invoices ({invoices.length})</h2>
        {invoices.length === 0 ? (
          <p>No invoices found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Client</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Description</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Amount</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Created</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>
                    {inv.cases?.users?.full_name || inv.cases?.users?.email}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{inv.description}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {inv.currency.toUpperCase()} {inv.amount}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '3px',
                      fontSize: '0.875rem',
                      background: inv.status === 'paid' ? '#d4edda' : '#fff3cd',
                      color: inv.status === 'paid' ? '#155724' : '#856404'
                    }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {inv.status === 'pending' && (
                      <button
                        onClick={() => handlePayment(inv)}
                        style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      >
                        Pay Now
                      </button>
                    )}
                    {inv.status === 'paid' && (
                      <span style={{ color: '#28a745' }}>✓ Paid</span>
                    )}
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
