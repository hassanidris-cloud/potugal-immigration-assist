import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'
import AuthNavLinks from '../components/AuthNavLinks'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const CONTACT_BG = 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1920&q=80'
const CONTACT_EMAIL = 'idris@winit.biz'
const CONTACT_WHATSAPP = '351924169322' /* Portugal + 924 169 322 for wa.me link */

export default function Contact() {
  const [navOpen, setNavOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
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
        <title>Contact Us — WINIT Portugal Immigration</title>
        <meta name="description" content="Schedule a consultation or request a free eligibility assessment. Contact WINIT for D2, D7, and D8 visa support." />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/contact`} />}
        <meta property="og:title" content="Contact Us — WINIT Portugal Immigration" />
        <meta property="og:description" content="Schedule a consultation or request a free eligibility assessment. Contact WINIT for D2, D7, and D8 visa support." />
        <meta property="og:type" content="website" />
        {BASE_URL && <meta property="og:url" content={`${BASE_URL}/contact`} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <meta name="twitter:title" content="Contact Us — WINIT Portugal Immigration" />
        <meta name="twitter:description" content="Schedule a consultation or request a free eligibility assessment. Contact WINIT for D2, D7, and D8 visa support." />
        {BASE_URL && <meta name="twitter:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer contact-page" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
        <nav className={`home-nav defesa-nav ${navOpen ? 'nav-open' : ''}`}>
          <div className="home-nav-inner">
            <Link href="/" className="home-nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <img src="/logo.png" alt="" width={70} height={41} style={{ display: 'block', height: 36, width: 'auto' }} />
              <span className="home-nav-logo-text">WINIT</span>
            </Link>
            <button type="button" className="home-nav-hamburger" onClick={() => setNavOpen((o) => !o)} aria-expanded={navOpen} aria-label={navOpen ? 'Close menu' : 'Open menu'}>
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
            <div className="home-nav-links">
              <Link href="/why-portugal" onClick={() => setNavOpen(false)} className="no-underline font-medium">Why Portugal</Link>
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={() => setServicesOpen((o) => !o)} className="home-nav-link-btn no-underline font-medium">Services ▾</button>
                {(servicesOpen || navOpen) && (
                  <div style={{ position: navOpen ? 'static' : 'absolute', top: '100%', left: 0, marginTop: '0.25rem', background: 'rgba(30,41,59,0.98)', borderRadius: '8px', padding: '0.5rem 0', minWidth: '180px', boxShadow: '0 10px 24px rgba(0,0,0,0.2)' }}>
                    <Link href="/visa-d2" onClick={() => { setServicesOpen(false); setNavOpen(false); }} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff' }}>D2 Entrepreneur</Link>
                    <Link href="/visa-d7" onClick={() => { setServicesOpen(false); setNavOpen(false); }} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff' }}>D7 Passive Income</Link>
                    <Link href="/visa-d8" onClick={() => { setServicesOpen(false); setNavOpen(false); }} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff' }}>D8 Digital Nomad</Link>
                    <Link href="/services" onClick={() => { setServicesOpen(false); setNavOpen(false); }} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.1)' }}>All Services</Link>
                  </div>
                )}
              </div>
              <Link href="/how-we-work" onClick={() => setNavOpen(false)} className="no-underline font-medium">How We Work</Link>
              <Link href="/faq" onClick={() => setNavOpen(false)} className="no-underline font-medium">FAQ</Link>
              <Link href="/contact" onClick={() => setNavOpen(false)} className="no-underline font-medium">Contact Us</Link>
              <AuthNavLinks onNavigate={() => { setServicesOpen(false); setNavOpen(false); }} linkClass="no-underline font-medium" signupClass="home-nav-signup no-underline" />
            </div>
          </div>
        </nav>

        <main>
          {/* Hero */}
          <section className="contact-hero section-with-bg" style={{ backgroundImage: `url(${CONTACT_BG})` }}>
            <div className="contact-hero-inner">
              <p className="contact-hero-eyebrow">Get in touch</p>
              <h1 className="contact-hero-title">Let&apos;s start your Portugal journey</h1>
              <p className="contact-hero-sub">
                Request a free eligibility assessment or schedule a consultation. We&apos;re here to guide you through every step.
              </p>
            </div>
          </section>

          {/* Main content: contact info + form side by side (stacked on mobile) */}
          <section className="contact-main">
            <div className="contact-main-inner">
              {/* Left: contact details + eligibility */}
              <div className="contact-info-block fade-in-on-scroll" data-fade-in>
                <h2 className="contact-info-title">Reach our team</h2>
                <p className="contact-info-lead">Multiple ways to get in touch. We typically respond within 24 hours.</p>

                <div className="contact-info-list">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="contact-info-item">
                    <span className="contact-info-icon" aria-hidden>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </span>
                    <div>
                      <span className="contact-info-label">Email</span>
                      <span className="contact-info-value">{CONTACT_EMAIL}</span>
                    </div>
                  </a>
                  <a href={`https://wa.me/${CONTACT_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="contact-info-item">
                    <span className="contact-info-icon" aria-hidden>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </span>
                    <div>
                      <span className="contact-info-label">WhatsApp</span>
                      <span className="contact-info-value">+351 924 169 322</span>
                    </div>
                  </a>
                  <div className="contact-info-item">
                    <span className="contact-info-icon" aria-hidden>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </span>
                    <div>
                      <span className="contact-info-label">Office hours</span>
                      <span className="contact-info-value">Mon – Fri, 9:00 – 18:00 (Portugal time)</span>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <span className="contact-info-icon" aria-hidden>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    </span>
                    <div>
                      <span className="contact-info-label">Languages</span>
                      <span className="contact-info-value">English</span>
                    </div>
                  </div>
                </div>

                <div className="contact-eligibility-card">
                  <span className="contact-eligibility-badge">Free</span>
                  <h3 className="contact-eligibility-title">Eligibility assessment</h3>
                  <p className="contact-eligibility-text">
                    We&apos;ll evaluate whether you meet the requirements for your desired visa (D2, D7, or D8) and if we can prepare a work proposal for your case.
                  </p>
                </div>
              </div>

              {/* Right: form card */}
              <div className="contact-form-block fade-in-on-scroll" data-fade-in>
                <div className="contact-form-card">
                  <h2 className="contact-form-title">Request your assessment</h2>
                  <p className="contact-form-lead">Fill in the form and we&apos;ll get back to you within 24 hours.</p>

                  {submitted ? (
                    <div className="contact-success-card">
                      <span className="contact-success-icon" aria-hidden>✓</span>
                      <h3 className="contact-success-title">Message sent</h3>
                      <p className="contact-success-text">We&apos;ll reply to your email shortly and confirm next steps for your case.</p>
                    </div>
                  ) : (
                    <>
                      {error && <div className="contact-error-card">{error}</div>}
                      <form onSubmit={handleSubmit} className="contact-form">
                        <label className="contact-field">
                          <span className="contact-field-label">Name</span>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                            className="contact-field-input"
                            placeholder="Your name"
                          />
                        </label>
                        <label className="contact-field">
                          <span className="contact-field-label">Email</span>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                            className="contact-field-input"
                            placeholder="you@example.com"
                          />
                        </label>
                        <label className="contact-field">
                          <span className="contact-field-label">Phone <span className="contact-field-optional">(optional)</span></span>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                            className="contact-field-input"
                            placeholder="+351 ..."
                          />
                        </label>
                        <label className="contact-field">
                          <span className="contact-field-label">How can we help?</span>
                          <textarea
                            required
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                            className="contact-field-input contact-field-textarea"
                            placeholder="e.g. I'm interested in the D7 visa and would like a free eligibility assessment."
                          />
                        </label>
                        <button type="submit" disabled={sending} className="contact-form-btn">
                          {sending ? 'Sending…' : 'Send request'}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Direct contact + explore */}
          <section className="contact-cta-strip">
            <div className="contact-cta-inner">
              <div className="contact-cta-item">
                <p className="contact-cta-heading">Prefer email?</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="contact-cta-link">Email us directly</a>
              </div>
              <div className="contact-cta-divider" aria-hidden />
              <div className="contact-cta-item">
                <p className="contact-cta-heading">Explore first</p>
                <div className="contact-cta-links">
                  <Link href="/services" onClick={() => setNavOpen(false)} className="contact-cta-link">Services</Link>
                  <span className="contact-cta-sep">·</span>
                  <Link href="/faq" onClick={() => setNavOpen(false)} className="contact-cta-link">FAQ</Link>
                </div>
              </div>
            </div>
          </section>

          <p className="contact-back">
            <Link href="/" className="text-primary font-semibold">← Back to home</Link>
          </p>
        </main>
      </div>
    </>
  )
}
