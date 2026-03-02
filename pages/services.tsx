import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const SERVICES_HERO_BG = 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1920&q=80'
const SERVICES_SECTION_BG = 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1920&q=80'

const IMMIGRATION_SERVICES = [
  {
    slug: 'd2',
    href: '/visa-d2',
    label: 'D2 Visa',
    title: 'D2 Entrepreneur Visa',
    description: 'Launch and grow your business in Portugal. For entrepreneurs establishing or transferring their business operations to Portugal. Register a branch or new company—ideal for founders and business owners.',
    popular: false,
  },
  {
    slug: 'd7',
    href: '/visa-d7',
    label: 'D7 Visa',
    title: 'D7 Visa (Passive Income / Retirement)',
    description: 'Retire or live in Portugal with passive income. Perfect for retirees and anyone with stable recurring income (pension, rentals, investments) seeking Portuguese residency without active business requirements.',
    popular: true,
  },
  {
    slug: 'd8',
    href: '/visa-d8',
    label: 'D8 Visa',
    title: 'D8 Digital Nomad Visa',
    description: 'Work remotely from Portugal. Designed for digital professionals and remote workers wanting to live in Portugal while working for foreign companies or freelancing for clients abroad.',
    popular: true,
  },
]

export default function Services() {
  const [navOpen, setNavOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <>
      <Head>
        <title>Our Services — WINIT Portugal Immigration</title>
        <meta name="description" content="Comprehensive immigration support: D2 Entrepreneur, D7 Passive Income, and D8 Digital Nomad visas. Expert guidance from documentation to approval." />
        <meta property="og:title" content="Our Services — WINIT Portugal Immigration" />
        <meta property="og:description" content="D2, D7, and D8 visa applications with document checklist, expert help, and progress tracking." />
        <meta property="og:type" content="website" />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/services`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
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
              <Link href="/auth/signup" className="home-nav-signup no-underline" onClick={() => setNavOpen(false)}>Sign Up</Link>
            </div>
          </div>
        </nav>

        <main>
          {/* Hero – Defesa-style "Our Services" */}
          <section className="section-with-bg services-hero" style={{ padding: '5rem 0', backgroundImage: `url(${SERVICES_HERO_BG})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
              <h1 className="section-heading section-heading-no-underline" style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 2.75rem)', marginBottom: '1rem' }}>
                Our Services
              </h1>
              <p className="defesa-section-sub" style={{ color: 'rgba(255,255,255,0.92)', fontSize: '1.15rem', lineHeight: 1.6, margin: 0 }}>
                Comprehensive immigration solutions for international clients relocating to Portugal. From D2, D7, and D8 visa applications to document support and progress tracking, we provide expert guidance every step of the way.
              </p>
            </div>
          </section>

          {/* Immigration – single section with our three services */}
          <section className="section-with-bg home-section-padding services-section" style={{ padding: '4rem 0', backgroundImage: `url(${SERVICES_SECTION_BG})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <h2 className="defesa-section-title" style={{ marginBottom: '0.5rem' }}>Immigration</h2>
              <p className="defesa-section-sub" style={{ marginBottom: '2.5rem' }}>
                Choose your visa path. Each option has a dedicated page with full requirements and how we help.
              </p>

              <div className="services-grid">
                {IMMIGRATION_SERVICES.map((s) => (
                  <div key={s.slug} className="service-card">
                    {s.popular && <span className="service-card-badge">Most Popular</span>}
                    <h3 className="service-card-title">{s.title}</h3>
                    <p className="service-card-desc">{s.description}</p>
                    <Link href={s.href} onClick={() => setNavOpen(false)} className="service-card-link">
                      Learn more
                    </Link>
                  </div>
                ))}
              </div>

              <p className="services-helper">
                Not sure which service fits you? <Link href="/contact" className="services-helper-link">Contact us</Link> for a free eligibility assessment.
              </p>
            </div>
          </section>

          {/* Need help choosing – CTA */}
          <section className="section-with-bg home-section-padding" style={{ padding: '4rem 0', backgroundImage: `url(${SERVICES_HERO_BG})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
              <h2 className="section-heading section-heading-no-underline section-heading-center" style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3.5vw, 1.85rem)', marginBottom: '1rem' }}>
                Need Help Choosing the Right Service?
              </h2>
              <p className="defesa-section-sub" style={{ color: 'rgba(255,255,255,0.92)', marginBottom: '1.5rem' }}>
                Request a free eligibility assessment. We&apos;ll evaluate your situation and advise if we can prepare a formal proposal for your case.
              </p>
              <div className="services-cta-group">
                <Link href="/contact" className="hero-cta hero-cta-primary" onClick={() => setNavOpen(false)}>Free Eligibility Assessment</Link>
                <Link href="/faq" className="hero-cta hero-cta-secondary hero-cta-secondary-dark" onClick={() => setNavOpen(false)}>View FAQ</Link>
              </div>
            </div>
          </section>

          <p style={{ textAlign: 'center', padding: '2rem 0', margin: 0 }}>
            <Link href="/" className="text-primary font-semibold">← Back to home</Link>
          </p>
        </main>
      </div>
    </>
  )
}
