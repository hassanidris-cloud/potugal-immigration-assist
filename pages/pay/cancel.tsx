import Link from 'next/link'

export default function PaymentCancel() {
  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
      <h1>Payment Cancelled</h1>
      <p>Your payment was cancelled. No charges have been made to your account.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <Link href="/dashboard" style={{ padding: '0.75rem 1.5rem', background: '#0070f3', color: 'white', borderRadius: '5px', textDecoration: 'none', display: 'inline-block', marginRight: '1rem' }}>
          Return to Dashboard
        </Link>
        <Link href="/admin/invoices" style={{ padding: '0.75rem 1.5rem', border: '1px solid #0070f3', color: '#0070f3', borderRadius: '5px', textDecoration: 'none', display: 'inline-block' }}>
          View Invoices
        </Link>
      </div>
    </div>
  )
}
