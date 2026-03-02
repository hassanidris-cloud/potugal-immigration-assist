import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export default function WhyPortugal() {
  const [navOpen, setNavOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  return (
    <>
      <Head>
        <title>Why Portugal? — WINIT Portugal Immigration</title>
        <meta name="description" content="Discover why Portugal is one of the world’s most welcoming countries: lifestyle, safety, digital hub, and unmatched value." />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
        <nav className={`home-nav ${navOpen ? 'nav-open' : ''}`}>
          <div className="home-nav-inner" style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
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
              <Link href="/auth/login" onClick={() => setNavOpen(false)} className="no-underline font-semibold">Login</Link>
              <Link href="/auth/signup" className="home-nav-signup no-underline" onClick={() => setNavOpen(false)}>Sign Up</Link>
            </div>
          </div>
        </nav>

        <main>
          <section className="home-section why-portugal home-section-padding" style={{ padding: '4rem 0' }}>
            <div className="home-container fade-in-on-scroll" data-fade-in>
              <h1 className="section-heading" style={{ textAlign: 'center', fontSize: 'clamp(1.9rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>Why Portugal?</h1>
              <p className="section-heading-sub" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                One of the world’s most welcoming countries for new residents
              </p>

              <div className="why-portugal-blocks">
                <div className="why-portugal-block">
                  <div className="why-portugal-block-image" style={{ backgroundImage: 'url(/images/nick-karvounis-7xiADv3VZ0k-unsplash.jpg)' }} />
                  <div className="why-portugal-block-content">
                    <span className="why-portugal-block-label">The Lifestyle</span>
                    <h2 className="text-text" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>300 Days of Possibility</h2>
                    <p className="text-text-muted" style={{ lineHeight: 1.7, margin: 0 }}>
                      Why settle for a vacation when you can have a life? With over 300 days of sunshine a year, Portugal isn’t just a destination—it’s an invitation to slow down. From the Atlantic breeze to the cobblestone charm of our historic cities, discover a world where &quot;work-life balance&quot; is a daily reality, not just a buzzword.
                    </p>
                  </div>
                </div>

                <div className="why-portugal-block why-portugal-block-reverse">
                  <div className="why-portugal-block-image" style={{ backgroundImage: 'url(/images/nick-karvounis-Prb-sjOUBFs-unsplash.jpg)' }} />
                  <div className="why-portugal-block-content">
                    <span className="why-portugal-block-label">The Safety</span>
                    <h2 className="text-text" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Europe’s Quiet Sanctuary</h2>
                    <p className="text-text-muted" style={{ lineHeight: 1.7, margin: 0 }}>
                      Find peace in one of the world&apos;s safest countries. Whether you’re raising a family or enjoying retirement, Portugal offers a secure, stable environment where community comes first. Walk the streets with confidence and sleep soundly knowing you’ve chosen a top-tier global haven for safety and social stability.
                    </p>
                  </div>
                </div>

                <div className="why-portugal-block">
                  <div className="why-portugal-block-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80)' }} />
                  <div className="why-portugal-block-content">
                    <span className="why-portugal-block-label">The Digital Hub</span>
                    <h2 className="text-text" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Where Tradition Meets Tech</h2>
                    <p className="text-text-muted" style={{ lineHeight: 1.7, margin: 0 }}>
                      Join a thriving ecosystem of innovators and creators. As a premier hub for digital nomads and tech entrepreneurs, Portugal provides world-class fiber-optic connectivity wrapped in Old World charm. Scale your business from a seaside café and tap into a multilingual, highly skilled talent pool that’s ready for the future.
                    </p>
                  </div>
                </div>

                <div className="why-portugal-block why-portugal-block-reverse">
                  <div className="why-portugal-block-image">
                    <img
                      src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
                      alt="Luxury hotel in Portugal"
                    />
                  </div>
                  <div className="why-portugal-block-content">
                    <span className="why-portugal-block-label">The Value</span>
                    <h2 className="text-text" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Affordable Luxury, Unmatched Quality</h2>
                    <p className="text-text-muted" style={{ lineHeight: 1.7, margin: 0 }}>
                      Your wealth goes further here. Enjoy a standard of living that rivals Europe’s most expensive capitals at a fraction of the cost. From iconic stays like Lisbon’s Pestana Palace Hotel—a national monument—to Michelin-starred dining, premium private healthcare, and historic real estate, Portugal offers the luxury you’ve earned with the financial freedom you deserve.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link
                  href="/#check-eligibility"
                  style={{
                    display: 'inline-block',
                    padding: '0.875rem 2rem',
                    background: 'linear-gradient(135deg, #0066cc, #00c896)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    boxShadow: '0 4px 16px rgba(0, 102, 204, 0.3)',
                  }}
                >
                  Check your eligibility →
                </Link>
                <p style={{ marginTop: '1.5rem' }}>
                  <Link href="/" className="text-primary font-semibold">← Back to home</Link>
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
