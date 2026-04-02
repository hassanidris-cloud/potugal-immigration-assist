import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'
import SiteNav from '../components/SiteNav'
import { getSiteCopy } from '../lib/getSiteCopy'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const CONTACT_BG = 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1920&q=80'
const CONTACT_EMAIL = 'idris@winit.biz'
const CONTACT_WHATSAPP = '351924169322' /* Portugal + 924 169 322 for wa.me link */
const copy = getSiteCopy()
const contactCopy = copy.contact

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
        <title>{contactCopy.meta_title}</title>
        <meta name="description" content={contactCopy.hero_subtitle} />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/contact`} />}
        <meta property="og:title" content={contactCopy.meta_title} />
        <meta property="og:description" content={contactCopy.hero_subtitle} />
        <meta property="og:type" content="website" />
        {BASE_URL && <meta property="og:url" content={`${BASE_URL}/contact`} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <meta name="twitter:title" content={contactCopy.meta_title} />
        <meta name="twitter:description" content={contactCopy.hero_subtitle} />
        {BASE_URL && <meta name="twitter:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer contact-page" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
        <SiteNav />

        <main>
          {/* Hero */}
          <section className="contact-hero section-with-bg" style={{ backgroundImage: `url(${CONTACT_BG})` }}>
            <div className="contact-hero-inner">
              <p className="contact-hero-eyebrow">{contactCopy.hero_eyebrow}</p>
              <h1 className="contact-hero-title">{contactCopy.hero_title}</h1>
              <p className="contact-hero-sub">{contactCopy.hero_subtitle}</p>
            </div>
          </section>

          {/* Main content: contact info + form side by side (stacked on mobile) */}
          <section className="contact-main">
            <div className="contact-main-inner">
              {/* Left: contact details + eligibility */}
              <div className="contact-info-block fade-in-on-scroll" data-fade-in>
                <h2 className="contact-info-title">{contactCopy.info_heading}</h2>
                <p className="contact-info-lead">{contactCopy.info_lead}</p>

                <div className="contact-info-list">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="contact-info-item">
                    <span className="contact-info-icon" aria-hidden>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </span>
                    <div>
                      <span className="contact-info-label">{contactCopy.info_email_label}</span>
                      <span className="contact-info-value">{CONTACT_EMAIL}</span>
                    </div>
                  </a>
                  <a href={`https://wa.me/${CONTACT_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="contact-info-item">
                    <span className="contact-info-icon" aria-hidden>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </span>
                    <div>
                      <span className="contact-info-label">{contactCopy.info_whatsapp_label}</span>
                      <span className="contact-info-value">+351 924 169 322</span>
                    </div>
                  </a>
                  <div className="contact-info-item">
                    <span className="contact-info-icon" aria-hidden>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </span>
                    <div>
                      <span className="contact-info-label">{contactCopy.info_hours_label}</span>
                      <span className="contact-info-value">{contactCopy.info_hours_value}</span>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <span className="contact-info-icon" aria-hidden>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    </span>
                    <div>
                      <span className="contact-info-label">{contactCopy.info_languages_label}</span>
                      <span className="contact-info-value">{contactCopy.info_languages_value}</span>
                    </div>
                  </div>
                </div>

                <div className="contact-eligibility-card">
                  <span className="contact-eligibility-badge">{contactCopy.eligibility_badge}</span>
                  <h3 className="contact-eligibility-title">{contactCopy.eligibility_title}</h3>
                  <p className="contact-eligibility-text">{contactCopy.eligibility_text}</p>
                </div>
              </div>

              {/* Right: form card */}
              <div className="contact-form-block fade-in-on-scroll" data-fade-in>
                <div className="contact-form-card">
                  <h2 className="contact-form-title">{contactCopy.form_heading}</h2>
                  <p className="contact-form-lead">{contactCopy.form_lead}</p>

                  {submitted ? (
                    <div className="contact-success-card">
                      <span className="contact-success-icon" aria-hidden>✓</span>
                      <h3 className="contact-success-title">{contactCopy.success_title}</h3>
                      <p className="contact-success-text">{contactCopy.success_text}</p>
                    </div>
                  ) : (
                    <>
                      {error && <div className="contact-error-card">{error}</div>}
                      <form onSubmit={handleSubmit} className="contact-form">
                        <label className="contact-field">
                          <span className="contact-field-label">{contactCopy.label_name}</span>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                            className="contact-field-input"
                            placeholder={contactCopy.placeholder_name}
                          />
                        </label>
                        <label className="contact-field">
                          <span className="contact-field-label">{contactCopy.label_email}</span>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                            className="contact-field-input"
                            placeholder={contactCopy.placeholder_email}
                          />
                        </label>
                        <label className="contact-field">
                          <span className="contact-field-label">{contactCopy.label_phone} <span className="contact-field-optional">{contactCopy.label_phone_optional}</span></span>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                            className="contact-field-input"
                            placeholder={contactCopy.placeholder_phone}
                          />
                        </label>
                        <label className="contact-field">
                          <span className="contact-field-label">{contactCopy.label_message}</span>
                          <textarea
                            required
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                            className="contact-field-input contact-field-textarea"
                            placeholder={contactCopy.placeholder_message}
                          />
                        </label>
                        <button type="submit" disabled={sending} className="contact-form-btn">
                          {sending ? contactCopy.button_sending : contactCopy.button_send}
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
                <p className="contact-cta-heading">{contactCopy.cta_prefer_email}</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="contact-cta-link">{contactCopy.cta_email_link}</a>
              </div>
              <div className="contact-cta-divider" aria-hidden />
              <div className="contact-cta-item">
                <p className="contact-cta-heading">{contactCopy.cta_explore}</p>
                <div className="contact-cta-links">
                  <Link href="/services" className="contact-cta-link">Services</Link>
                  <span className="contact-cta-sep">·</span>
                  <Link href="/faq" className="contact-cta-link">FAQ</Link>
                </div>
              </div>
            </div>
          </section>

          <p className="contact-back">
            <Link href="/" className="text-primary font-semibold">{contactCopy.back_link}</Link>
          </p>
        </main>
      </div>
    </>
  )
}
