import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch {
      setError('Could not send message. Please try again or email us directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Head>
        <title>Contact — WINIT Portugal Immigration</title>
        <meta name="description" content="Contact WINIT for Portugal immigration support and questions." />
      </Head>
      <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <nav style={{ background: '#1e293b', padding: '1rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>WINIT</Link>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Back to home</Link>
          </div>
        </nav>
        <main style={{ maxWidth: '560px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>Contact us</h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Have a question? Send us a message and we’ll get back to you.</p>
          {submitted ? (
            <div style={{ background: '#ecfdf5', padding: '1.5rem', borderRadius: '12px', color: '#065f46', marginBottom: '2rem' }}>
              Thanks for your message. We’ll reply to your email as soon as we can.
            </div>
          ) : null}
          {error ? (
            <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', color: '#991b1b', marginBottom: '1.5rem' }}>
              {error}
            </div>
          ) : null}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#374151', fontWeight: '500' }}>
              Name
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#374151', fontWeight: '500' }}>
              Email
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#374151', fontWeight: '500' }}>
              Phone
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                placeholder="Optional"
                style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#374151', fontWeight: '500' }}>
              Message
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
              />
            </label>
            <button
              type="submit"
              disabled={sending}
              style={{
                padding: '0.75rem 1.5rem',
                background: sending ? '#94a3b8' : '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: sending ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
              }}
            >
              {sending ? 'Sending…' : 'Send message'}
            </button>
          </form>
          <p style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.95rem' }}>
            You can also email us directly at <a href="mailto:idris@winit.biz" style={{ color: '#0066cc' }}>idris@winit.biz</a>.
          </p>
          <p style={{ marginTop: '2rem' }}>
            <Link href="/" style={{ color: '#0066cc', fontWeight: '600' }}>← Back to home</Link>
          </p>
        </main>
      </div>
    </>
  )
}
