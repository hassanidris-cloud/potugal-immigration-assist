import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export default function VisaD8() {
  const [navOpen, setNavOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  return (
    <>
      <Head>
        <title>D8 Digital Nomad Visa Portugal — WINIT</title>
        <meta name="description" content="Portugal D8 Visa for remote workers and freelancers: income requirements, documents, and how we help. End-to-end support to residency." />
        <meta property="og:title" content="D8 Digital Nomad Visa Portugal — WINIT" />
        <meta property="og:description" content="D8 visa for remote workers and freelancers with clients outside Portugal." />
        <meta property="og:type" content="website" />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/visa-d8`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer visa-d2-page" style={{ minHeight: '100vh' }}>
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
                <button type="button" onClick={() => setServicesOpen((o) => !o)} className="no-underline font-medium" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Services ▾</button>
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
              <Link href="/contact" onClick={() => setNavOpen(false)} className="no-underline font-medium">Contact</Link>
              <Link href="/auth/signup" onClick={() => setNavOpen(false)} className="home-nav-signup no-underline">Sign Up</Link>
            </div>
          </div>
        </nav>

        <main>
          <section className="d2-overview-section" style={{ padding: '4rem 0' }}>
            <div className="home-container fade-in-on-scroll" data-fade-in style={{ maxWidth: '720px', margin: '0 auto' }}>
              <span className="d2-section-label">D8 Visa</span>
              <h1 className="d2-heading" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>D8 Digital Nomad Visa</h1>
              <p className="d2-body">
                The Portugal D8 Visa is for remote workers or freelancers with clients outside Portugal.
              </p>
            </div>
          </section>

          <section style={{ padding: '2rem 0', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
            <div className="home-container fade-in-on-scroll" data-fade-in style={{ maxWidth: '720px', margin: '0 auto' }}>
              <h2 className="d2-heading" style={{ marginBottom: '1rem' }}>Core Requirements (2026)</h2>
              <ul className="d2-body" style={{ paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                <li>Income: €3,680 per month (4× minimum wage)</li>
                <li>Spouse/partner: +50% (~€460/month)</li>
                <li>Each child: +30% (~€276/month)</li>
                <li>Proof of remote work (contract or employer statement)</li>
                <li>Freelancers: service contracts and recent invoices</li>
                <li>Means of subsistence: 12 months of funds (~€11,040)</li>
                <li>Long-term accommodation (12-month lease or property deed)</li>
                <li>Clean criminal record (apostilled and translated)</li>
                <li>Portuguese Tax ID (NIF)</li>
              </ul>
            </div>
          </section>

          <section style={{ padding: '2rem 0', background: '#f8fafc' }}>
            <div className="home-container fade-in-on-scroll" data-fade-in style={{ maxWidth: '720px', margin: '0 auto' }}>
              <h2 className="d2-heading" style={{ marginBottom: '1rem' }}>Key Benefits</h2>
              <ul className="d2-body" style={{ paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                <li>Initial residence permit: 2 years, then 3-year renewal</li>
                <li>Citizenship eligibility after 5 years</li>
                <li>Work rights after residence permit issued</li>
                <li>Access to public healthcare and education</li>
              </ul>
              <p className="d2-body" style={{ marginTop: '1rem' }}>
                <strong>Processing time:</strong> typically 60–90 days for consulate decision.
              </p>
            </div>
          </section>

          <section style={{ padding: '2rem 0', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
            <div className="home-container fade-in-on-scroll" data-fade-in style={{ maxWidth: '720px', margin: '0 auto' }}>
              <h2 className="d2-heading" style={{ marginBottom: '1rem' }}>How We Can Help</h2>
              <ul className="d2-body" style={{ paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                <li>Tax ID (NIF) issuance</li>
                <li>Bank account opening (in person or remote)</li>
                <li>Long-term lease or property deed support</li>
                <li>Driver&apos;s license exchange assistance</li>
                <li>Portuguese health number assistance</li>
              </ul>
            </div>
          </section>

          <section style={{ padding: '3rem 0', background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)', textAlign: 'center' }}>
            <div className="home-container fade-in-on-scroll" data-fade-in>
              <p style={{ marginBottom: '1rem' }}>
                <Link href="/contact" className="d2-cta-primary">Get started with D8</Link>
                <span style={{ margin: '0 0.5rem' }} />
                <Link href="/contact" className="d2-cta-secondary">Contact Us</Link>
              </p>
              <Link href="/services" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>← All services</Link>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
