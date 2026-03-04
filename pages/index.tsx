import Link from 'next/link'
import Head from 'next/head'
import type { CSSProperties } from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import AuthNavLinks from '../components/AuthNavLinks'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// Hero slideshow: 2 local from public/images + 4 Portugal nature (Unsplash, no empty slots)
const PORTUGAL_IMAGES = [
  '/images/rui-sousa-dHyZit2MPAs-unsplash.jpg',
  '/images/daniel-sessler-g3O3xWspoN4-unsplash.jpg',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1920&q=80', // Porto / Northern Portugal
  'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1920&q=80', // Douro Valley nature
  'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1920&q=80', // Algarve coast
  'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1920&q=80',   // Portugal coast / cliffs
]
// Section backgrounds: each section has its own unique image (local or new Unsplash)
const SECTION_BG_IMAGES = {
  whyPortugalTeaser: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1920&q=80',
  stats: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
  services: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1920&q=80',
  whoWeHelp: 'https://images.unsplash.com/photo-1523531294919-4fcdb0648f1e?w=1920&q=80',
  howWeWork: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80',
  whyChoose: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80',
  licensed: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80',
  finalCta: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80',
}

const WHO_CARD_STYLE: CSSProperties = { background: 'rgba(255,255,255,0.95)', borderColor: 'rgba(255,255,255,0.3)' }

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false)
  const [backToTopVisible, setBackToTopVisible] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [sectionRevealed, setSectionRevealed] = useState<Record<string, boolean>>({})
  const [servicesOpen, setServicesOpen] = useState(false)

  const goTo = useCallback((index: number) => {
    setSlideIndex((index + PORTUGAL_IMAGES.length) % PORTUGAL_IMAGES.length)
  }, [])

  const next = useCallback(() => goTo(slideIndex + 1), [slideIndex, goTo])
  const prev = useCallback(() => goTo(slideIndex - 1), [slideIndex, goTo])

  useEffect(() => {
    const isPhone = typeof window !== 'undefined' && (window.innerWidth <= 639 || !window.matchMedia('(pointer: fine)').matches)
    const intervalMs = isPhone ? 6000 : 5000
    const t = setInterval(() => setSlideIndex((i) => (i + 1) % PORTUGAL_IMAGES.length), intervalMs)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => {
      const y = window.scrollY
      setStickyCtaVisible(y > 400)
      setBackToTopVisible(y > 300)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!navOpen) return
    const onResize = () => { if (window.innerWidth > 767) setNavOpen(false) }
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false) }
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [navOpen])

  useEffect(() => {
    const refs: { ref: React.RefObject<HTMLDivElement | null>; id: string }[] = []
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).getAttribute('data-reveal-id')
          if (id && entry.isIntersecting) {
            setSectionRevealed((prev) => ({ ...prev, [id]: true }))
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -80px 0px' }
    )
    const timer = setTimeout(() => {
      refs.forEach(({ ref: r }) => { if (r.current) obs.observe(r.current) })
    }, 100)
    return () => { clearTimeout(timer); obs.disconnect() }
  }, [])

  // Reveal on scroll: any element with data-reveal-on-scroll gets .reveal-visible when in view
  useEffect(() => {
    if (typeof window === 'undefined') return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const timer = setTimeout(() => {
      document.querySelectorAll('[data-reveal-on-scroll]').forEach((el) => obs.observe(el))
    }, 200)
    return () => { clearTimeout(timer); obs.disconnect() }
  }, [])

  return (
    <>
      <Head>
        <title>WinIT — Move to Portugal with Confidence</title>
        <meta name="description" content="Portugal immigration support: D2, D7, and D8 visa applications. Document checklist, expert help, and tracking. Start your application today." />
        {BASE_URL && <link rel="canonical" href={BASE_URL} />}
        <meta property="og:title" content="WinIT — Move to Portugal with Confidence" />
        <meta property="og:description" content="Portugal immigration support: D2, D7, and D8 visa applications. Document checklist, expert help, and tracking." />
        <meta property="og:type" content="website" />
        {BASE_URL && <meta property="og:url" content={BASE_URL} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <meta property="og:site_name" content="WinIT Portugal Immigration" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="WinIT — Move to Portugal with Confidence" />
        <meta name="twitter:description" content="Portugal immigration support: D2, D7, and D8 visa applications. Document checklist, expert help, and tracking." />
        {BASE_URL && <meta name="twitter:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'WinIT Portugal Immigration',
              description: 'Portugal immigration support: D2, D7, and D8 visa applications with document checklist, expert help, and progress tracking.',
              ...(BASE_URL && { url: BASE_URL }),
              ...(BASE_URL && {
                potentialAction: {
                  '@type': 'SearchAction',
                  target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/services?q={search_term_string}` },
                  'query-input': 'required name=search_term_string',
                },
              }),
            }),
          }}
        />
      </Head>
      <div className="home-nav-spacer min-h-screen overflow-x-hidden font-sans" style={{ background: '#FFFFFF' }}>
        <div className="home-content-layer">
        {/* Defesa Legal–style nav: Services dropdown, About, How We Work, FAQ, Contact */}
        <nav className={`home-nav defesa-nav ${navOpen ? 'nav-open' : ''}`}>
          <div className="home-nav-inner">
            <Link href="/" className="home-nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <img src="/logo.png" alt="" width={70} height={41} style={{ display: 'block', height: 36, width: 'auto' }} />
              <span className="home-nav-logo-text">WinIT</span>
            </Link>
            <button
              type="button"
              className="home-nav-hamburger"
              onClick={() => setNavOpen((o) => !o)}
              aria-expanded={navOpen}
              aria-label={navOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
            <div className="home-nav-links">
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setServicesOpen((o) => !o)}
                  className="home-nav-link-btn no-underline font-medium"
                >
                  Services ▾
                </button>
                {(servicesOpen || navOpen) && (
                  <div
                    style={{
                      position: navOpen ? 'static' : 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '0.25rem',
                      background: 'rgba(30,41,59,0.98)',
                      borderRadius: '8px',
                      padding: '0.5rem 0',
                      minWidth: '180px',
                      boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Link href="/visa-d2" onClick={() => { setServicesOpen(false); setNavOpen(false); }} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff' }}>D2 Entrepreneur</Link>
                    <Link href="/visa-d7" onClick={() => { setServicesOpen(false); setNavOpen(false); }} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff' }}>D7 Passive Income</Link>
                    <Link href="/visa-d8" onClick={() => { setServicesOpen(false); setNavOpen(false); }} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff' }}>D8 Digital Nomad</Link>
                    <Link href="/services" onClick={() => { setServicesOpen(false); setNavOpen(false); }} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.1)' }}>All Services</Link>
                  </div>
                )}
              </div>
              <Link href="/why-portugal" onClick={() => setNavOpen(false)} className="no-underline font-medium">Why Portugal</Link>
              <Link href="/how-we-work" onClick={() => setNavOpen(false)} className="no-underline font-medium">How We Work</Link>
              <Link href="/faq" onClick={() => setNavOpen(false)} className="no-underline font-medium">FAQ</Link>
              <Link href="/contact" onClick={() => setNavOpen(false)} className="no-underline font-medium">Contact Us</Link>
              <AuthNavLinks onNavigate={() => { setServicesOpen(false); setNavOpen(false); }} linkClass="no-underline font-medium" signupClass="home-nav-signup no-underline" />
            </div>
          </div>
        </nav>

        {/* Hero: image slideshow with light overlay, dark text, blue button */}
        <header className="home-hero-wrap home-hero-slideshow">
          <div className="hero-slideshow">
            {PORTUGAL_IMAGES.map((src, i) => (
              <div
                key={src}
                className={`hero-slide ${i === slideIndex ? 'active' : ''}`}
                style={{ backgroundImage: `url(${src})` }}
                aria-hidden={i !== slideIndex}
              />
            ))}
          </div>
          <div className="hero-slideshow-overlay" aria-hidden />
          <div className="hero-slideshow-dots">
            {PORTUGAL_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === slideIndex ? 'active' : ''}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="home-container home-hero-inner home-hero-clean-inner fade-in-on-scroll" data-fade-in>
            <p className="home-hero-eyebrow" style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem' }}>WinIT Immigration</p>
            <h1 className="defesa-hero-title">Portugal Immigration &amp; Residency</h1>
            <p className="defesa-hero-sub">Expert guidance on D2, D7, and D8 visas. We handle the legal complexities so you can focus on your new life in Portugal.</p>
            <div className="hero-cta-group">
              <Link href="/contact" className="hero-cta hero-cta-primary">Free Eligibility Assessment</Link>
              <Link href="/services" className="hero-cta hero-cta-secondary">View All Services</Link>
            </div>
          </div>
        </header>

        {/* Why Portugal — teaser strip */}
        <section className="section-with-bg home-section-padding why-portugal-teaser" style={{ padding: '3.5rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.whyPortugalTeaser})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <p className="why-portugal-teaser-text">
              Sun, safety, and a gateway to Europe. See why thousands choose Portugal for residency.
            </p>
            <Link href="/why-portugal" className="why-portugal-teaser-link">Why Portugal →</Link>
          </div>
        </section>

        {/* Stats bar — background image + text reveals on scroll */}
        <section className="section-with-bg" style={{ padding: '4rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.stats})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <div className="defesa-stats reveal-on-scroll" data-reveal-on-scroll style={{ color: '#fff' }}>
              <div className="reveal-stagger-item"><span className="defesa-stat-num" style={{ color: '#fff' }}>10+</span><span className="defesa-stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>Years of Experience</span></div>
              <div className="reveal-stagger-item"><span className="defesa-stat-num" style={{ color: '#fff' }}>500+</span><span className="defesa-stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>Successful Cases</span></div>
              <div className="reveal-stagger-item"><span className="defesa-stat-num" style={{ color: '#fff' }}>30+</span><span className="defesa-stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>Countries Represented</span></div>
              <div className="reveal-stagger-item"><span className="defesa-stat-num" style={{ color: '#fff' }}>98%</span><span className="defesa-stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>Client Satisfaction</span></div>
            </div>
          </div>
        </section>

        {/* Our Core Services — background image + content reveals on scroll */}
        <section className="section-with-bg" style={{ padding: '4rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.services})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <div className="reveal-on-scroll" data-reveal-on-scroll>
              <h2 className="defesa-section-title">Our Core Immigration Services</h2>
              <p className="defesa-section-sub">Comprehensive support for international clients seeking residency in Portugal.</p>
              <div className="defesa-services-grid">
                <div className="defesa-service-card reveal-stagger-item"><h3>D2 Entrepreneur Visa</h3><p>Register a branch or new company in Portugal. Ideal for entrepreneurs and business owners.</p><Link href="/visa-d2">Learn more →</Link></div>
                <div className="defesa-service-card reveal-stagger-item"><h3>D7 Passive Income Visa</h3><p>Ideal for retirees and anyone with stable passive income (pension, rentals, investments). Live in Portugal without active employment.</p><Link href="/visa-d7">Learn more →</Link></div>
                <div className="defesa-service-card reveal-stagger-item"><h3>D8 Digital Nomad Visa</h3><p>Work remotely for a company or clients abroad. For freelancers and remote employees.</p><Link href="/visa-d8">Learn more →</Link></div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Help — background image + content reveals on scroll */}
        <div role="region" aria-label="Who We Help" className="section-with-bg" style={{ padding: '4rem 0', backgroundImage: 'url(' + SECTION_BG_IMAGES.whoWeHelp + ')' }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <div className="reveal-on-scroll" data-reveal-on-scroll>
              <h2 className="defesa-section-title" style={{ color: '#fff' }}>Who We Help</h2>
              <p className="defesa-section-sub" style={{ color: 'rgba(255,255,255,0.9)' }}>From initial consultation to final approval, we provide personalized guidance for your situation.</p>
              <div className="defesa-who-grid">
                <div className="defesa-who-card reveal-stagger-item" style={WHO_CARD_STYLE}><h3>Investors &amp; Entrepreneurs</h3><p>Business owners and entrepreneurs looking to establish in Portugal with the D2 visa.</p></div>
                <div className="defesa-who-card reveal-stagger-item" style={WHO_CARD_STYLE}><h3>Remote Workers &amp; Digital Nomads</h3><p>Freelancers and employees of foreign companies wanting to live and work legally from Portugal with the D8 visa.</p></div>
                <div className="defesa-who-card reveal-stagger-item" style={WHO_CARD_STYLE}><h3>Retirees &amp; Families</h3><p>Pensioners with passive income seeking the D7 visa, and families relocating to Portugal.</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us — background image + content reveals on scroll */}
        <section className="section-with-bg" style={{ padding: '4rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.whyChoose})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <div className="reveal-on-scroll" data-reveal-on-scroll>
              <h2 className="defesa-section-title">Why Work With Us?</h2>
              <p className="defesa-section-sub">We provide distinct advantages for your Portugal residency application.</p>
              <div className="defesa-why-grid">
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>Direct support</strong><span>We represent you directly—no middlemen. One point of contact from start to approval.</span></div></div>
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>Expert guidance</strong><span>Deep knowledge of Portuguese immigration requirements and real-time updates.</span></div></div>
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>Clear communication</strong><span>Fluent in English and Portuguese. Clear communication with you and accurate submissions.</span></div></div>
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>End-to-end accountability</strong><span>From consultation through approval and renewals—no handoffs.</span></div></div>
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>Confidentiality</strong><span>Your data is secure and confidential. Bank-level encryption for documents.</span></div></div>
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>One dashboard</strong><span>Track your checklist, upload documents, and stay in touch with your specialist.</span></div></div>
              </div>
            </div>
          </div>
        </section>

        {/* Licensed & trusted + What Clients Say — Defesa-style, same as Who We Help / Why Choose Us */}
        <section className="section-with-bg home-section-padding home-trusted-section" style={{ padding: '4rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.licensed})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <h2 className="defesa-section-title" style={{ color: '#fff' }}>Licensed &amp; trusted</h2>
            <p className="defesa-section-sub" style={{ color: 'rgba(255,255,255,0.9)' }}>We work with licensed immigration specialists. Your data is secure and confidential.</p>
            <div className="home-trusted-list">
              <div className="home-trusted-item">
                <span className="home-trusted-icon" aria-hidden>✓</span>
                <span>Licensed immigration support</span>
              </div>
              <div className="home-trusted-item">
                <span className="home-trusted-icon" aria-hidden>✓</span>
                <span>Secure &amp; confidential</span>
              </div>
              <div className="home-trusted-item">
                <span className="home-trusted-icon" aria-hidden>✓</span>
                <span>Bank-level encryption for documents</span>
              </div>
            </div>

            <h2 className="defesa-section-title home-trusted-reviews-title" style={{ color: '#fff' }}>What Clients Say</h2>
            <p className="defesa-section-sub" style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 0 }}>We&apos;re building our success stories. Get in touch to start yours.</p>
          </div>
        </section>

        {/* Final CTA — Ready to Start Your Portugal Journey */}
        <section className="section-with-bg home-section-padding final-cta-section" style={{ padding: '5rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.finalCta})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <div className="final-cta-card">
              <h2 className="final-cta-title">Ready to Start Your Portugal Journey?</h2>
              <p className="final-cta-lead">Request a free eligibility assessment. We&apos;ll evaluate your situation and advise if we can prepare a formal proposal for your case.</p>
              <div className="hero-cta-group">
                <Link href="/contact" className="hero-cta hero-cta-primary">Free Eligibility Assessment</Link>
                <Link href="/contact" className="hero-cta hero-cta-secondary hero-cta-secondary-dark">Contact Us</Link>
              </div>
              <p className="final-cta-trust">🔒 Secure &amp; confidential</p>
            </div>
          </div>
        </section>

      {/* Sticky "Check Your Eligibility" bar (follows on scroll) */}
      <div className={`sticky-cta-bar ${stickyCtaVisible ? 'visible' : ''}`}>
        <span style={{ fontSize: '0.95rem' }}>Explore services</span>
        <a href="/services">View services →</a>
      </div>

      {/* Back to top (side button, appears after scroll) */}
      <button
        type="button"
        className={`back-to-top ${backToTopVisible ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

        {/* Footer — Defesa-style two columns */}
        <footer className="home-footer">
          <div className="home-container">
            <div className="defesa-footer-inner">
              <div>
                <div className="mb-4" style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/logo.png" alt="" width={70} height={41} style={{ height: 40, width: 'auto' }} />
                  <span className="home-nav-logo-text" style={{ color: 'rgba(255,255,255,0.95)', marginLeft: '0.5rem' }}>WinIT</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                  Portugal immigration support. D2, D7, and D8 visa applications with document checklist, expert help, and progress tracking.
                </p>
                <p style={{ margin: 0 }}>
                  <Link href="/contact" style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>Contact Us</Link>
                </p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600, margin: '0 0 0.75rem 0' }}>Services &amp; Company</p>
                <ul className="defesa-footer-links">
                  <li style={{ marginBottom: '0.35rem' }}><Link href="/services">Services</Link></li>
                  <li style={{ marginBottom: '0.35rem' }}><Link href="/why-portugal">Why Portugal</Link></li>
                  <li style={{ marginBottom: '0.35rem' }}><Link href="/faq">FAQ</Link></li>
                  <li style={{ marginBottom: '0.35rem' }}><Link href="/contact">Contact</Link></li>
                  <li style={{ marginBottom: '0.35rem' }}><Link href="/privacy">Privacy</Link></li>
                  <li style={{ marginBottom: '0.35rem' }}><Link href="/terms">Terms</Link></li>
                  <li style={{ marginBottom: '0.35rem' }}><Link href="/cookies">Cookies</Link></li>
                </ul>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              Terms of Service · Privacy Policy · © {new Date().getFullYear()} WinIT. All rights reserved.
            </p>
          </div>
        </footer>
        </div>
      </div>
    </>
  )
}
