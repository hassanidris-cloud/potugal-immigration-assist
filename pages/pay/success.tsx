import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function PaymentSuccess() {
  const router = useRouter()
  const { session_id } = router.query
  const [loading, setLoading] = useState(true)
  const [invoice, setInvoice] = useState<any>(null)

  useEffect(() => {
    if (session_id) {
      fetchInvoice()
    }
  }, [session_id])

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/payments/session?session_id=${session_id}`)
      const data = await res.json()
      setInvoice(data.invoice)
    } catch (error) {
      console.error('Error fetching invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment. Your transaction has been completed successfully.</p>
      
      {invoice && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '5px', textAlign: 'left' }}>
          <h2>Invoice Details</h2>
          <p><strong>Amount:</strong> €{invoice.amount}</p>
          <p><strong>Description:</strong> {invoice.description}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
          <p><strong>Paid At:</strong> {new Date(invoice.paid_at).toLocaleString()}</p>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link href="/onboarding" style={{ padding: '0.75rem 1.5rem', background: '#0070f3', color: 'white', borderRadius: '5px', textDecoration: 'none', display: 'inline-block' }}>
          Start Your Application →
        </Link>
      </div>
    </div>
  )
}
