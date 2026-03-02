import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

const HOW_WE_WORK_BG = 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80'

const STEPS = [
  {
    num: 1,
    title: 'Sign Up',
    titleLink: '/auth/signup',
    desc: 'Pick your visa path (D2, D7, or D8). Clear requirements and dedicated support. After you sign up, we\'ll arrange your package and payment together.',
    pillText: 'View services',
    pillHref: '/services',
  },
  {
    num: 2,
    title: 'Upload Your Documents',
    desc: 'Follow your checklist and upload everything in one place. See your progress at any time.',
    pillText: 'Get started',
    pillHref: '/auth/signup',
  },
  {
    num: 3,
    title: 'We Review Everything',
    desc: 'A licensed specialist checks your documents and tells you what\'s missing. We keep you on track.',
    pillText: 'FAQ & contact',
    pillHref: '/faq',
  },
  {
    num: 4,
    done: true,
    title: 'Get Approved',
    desc: 'We guide you through submission and stay with you until you have your visa.',
  },
]

const BENEFITS = [
  { icon: 'shield', label: 'Less stressful', text: 'We handle the complicated stuff' },
  { icon: 'clock', label: 'Always updated', text: 'Real-time application status' },
  { icon: 'user', label: 'Personal support', text: 'Direct access to your specialist' },
]

export default function HowWeWork() {
  const [navOpen, setNavOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <>
      <Head>
        <title>How We Work — WINIT Portugal Immigration</title>
        <meta name="description" content="See how WINIT supports you from sign-up to visa approval: choose your program, upload documents, get expert review, and reach approval with one dashboard." />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer how-we-work-page" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
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
              <Link href="/contact" onClick={() => setNavOpen(false)} className="no-underline font-medium">Contact Us</Link>
              <Link href="/auth/login" onClick={() => setNavOpen(false)} className="no-underline font-semibold">Login</Link>
              <Link href="/auth/signup" className="home-nav-signup no-underline" onClick={() => setNavOpen(false)}>Sign Up</Link>
            </div>
          </div>
        </nav>

        <main>
          {/* Hero */}
          <section className="how-hero section-with-bg" style={{ padding: '4.5rem 0', backgroundImage: `url(${HOW_WE_WORK_BG})` }}>
            <div className="section-with-bg-inner home-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
              <p className="how-hero-eyebrow">Your journey</p>
              <h1 className="how-hero-title">How We Work With You</h1>
              <p className="how-hero-sub">End-to-end support: choose your program, upload documents, get expert review, and reach approval—with one dashboard and a dedicated specialist.</p>
            </div>
          </section>

          {/* Steps — timeline with connector */}
          <section className="how-steps-section" style={{ padding: '3rem 0', background: 'linear-gradient(180deg, #f8fafc 0%, #fff 100%)' }}>
            <div className="home-container" style={{ maxWidth: '780px', margin: '0 auto', padding: '0 2rem' }}>
              <h2 className="how-steps-heading">Four simple steps</h2>
              <div className="how-timeline">
                {STEPS.map((step, i) => (
                  <div key={step.num} className="how-timeline-step">
                    <div className="how-timeline-marker">
                      <span className={`how-timeline-num ${step.done ? 'how-timeline-num-done' : ''}`}>
                        {step.done ? '✓' : step.num}
                      </span>
                      {i < STEPS.length - 1 && <span className="how-timeline-line" aria-hidden />}
                    </div>
                    <div className="how-timeline-card">
                      <h3 className="how-timeline-title">
                        {step.titleLink ? (
                          <Link href={step.titleLink} className="how-timeline-title-link">{step.title} →</Link>
                        ) : (
                          step.title
                        )}
                      </h3>
                      <p className="how-timeline-desc">{step.desc}</p>
                      {step.pillHref && (
                        <Link href={step.pillHref} className="how-timeline-pill">{step.pillText}</Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits strip */}
          <section className="how-benefits-section" style={{ padding: '3rem 0', background: '#fff' }}>
            <div className="home-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
              <h2 className="how-benefits-heading">Why it works</h2>
              <div className="how-benefits-grid">
                {BENEFITS.map((b) => (
                  <div key={b.label} className="how-benefits-card">
                    <span className="how-benefits-icon" aria-hidden>
                      {b.icon === 'shield' && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      )}
                      {b.icon === 'clock' && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      )}
                      {b.icon === 'user' && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      )}
                    </span>
                    <strong className="how-benefits-label">{b.label}</strong>
                    <span className="how-benefits-text">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="how-cta-section" style={{ padding: '3.5rem 0', background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
            <div className="home-container" style={{ maxWidth: '520px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
              <h2 className="how-cta-title">Ready to get started?</h2>
              <p className="how-cta-lead">Sign up for a free eligibility assessment or contact us to discuss your case.</p>
              <div className="how-cta-buttons">
                <Link href="/contact" onClick={() => setNavOpen(false)} className="hero-cta hero-cta-primary">Free assessment</Link>
                <Link href="/auth/signup" onClick={() => setNavOpen(false)} className="hero-cta hero-cta-secondary hero-cta-secondary-dark">Sign up</Link>
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
