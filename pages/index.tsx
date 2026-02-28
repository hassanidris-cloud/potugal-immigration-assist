import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect, useCallback, useRef } from 'react'

const PORTUGAL_IMAGES = [
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1920&q=80', // Lisbon
  'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1920&q=80', // Algarve coast
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1920&q=80', // Porto
  'https://images.unsplash.com/photo-1567270671170-fdc10a5bf831?w=1920&q=80', // Lisbon streets
  'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1920&q=80',   // Portugal coast
  'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1920&q=80', // Douro Valley nature
]

/* Professional SVG icons for What You Get (stroke-based, inherit color) */
const WHAT_YOU_GET_ICONS: Record<string, JSX.Element> = {
  checklist: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  secure: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  updates: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  progress: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  communication: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  payment: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
}

/* Icons for Which Visa quiz cards */
const VISA_QUIZ_OPTIONS = [
  { id: 'd2' as const, label: 'I am an entrepreneur and want to register a branch or a new company in Portugal', icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></svg>
  ) },
  { id: 'd7' as const, label: 'I have passive income (pension, rentals, investments)', icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
  ) },
  { id: 'd8' as const, label: 'I work remotely for a company or clients abroad', icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
  ) },
]

const FAQ_ITEMS = [
  { q: 'Is this service legitimate and secure?', a: 'Yes. We work with licensed immigration lawyers, CPA accountants, and qualified realtors. We work under a formal contract with clearly defined terms and payment conditions. We use bank-level encryption for your documents, and your data is never shared with third parties except as required for your application.' },
  { q: 'How long does the visa process take?', a: 'Typically 60–90 days from document submission to consulate decision. We help you prepare everything correctly the first time to avoid delays.' },
  { q: 'What if I\'m not sure which visa I need?', a: 'Use our "Which visa is for you?" tool above, or sign up and our team will recommend the best option based on your situation.' },
  { q: 'Can I bring my family?', a: 'Yes. D2, D7, and D8 programs support family reunification. We guide you through requirements for spouses and dependents.' },
  { q: 'When do I pay?', a: 'You choose a plan at sign-up. Payment is secure (Stripe). No hidden fees—you see the total before you commit.' },
]

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [visaChoice, setVisaChoice] = useState<'d2' | 'd7' | 'd8' | null>(null)
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false)
  const [backToTopVisible, setBackToTopVisible] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [featuresInView, setFeaturesInView] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [visaQuizCursor, setVisaQuizCursor] = useState({ x: 0, y: 0 })
  const [whatWeDoCursor, setWhatWeDoCursor] = useState({ x: 0, y: 0 })
  const [howStepsVisible, setHowStepsVisible] = useState(false)
  const featuresSectionRef = useRef<HTMLElement>(null)
  const featuresRafRef = useRef<number | null>(null)
  const visaQuizRef = useRef<HTMLElement>(null)
  const whatWeDoRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)

  const goTo = useCallback((index: number) => {
    setSlideIndex((index + PORTUGAL_IMAGES.length) % PORTUGAL_IMAGES.length)
  }, [])

  const next = useCallback(() => goTo(slideIndex + 1), [slideIndex, goTo])
  const prev = useCallback(() => goTo(slideIndex - 1), [slideIndex, goTo])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setSlideIndex((i) => (i + 1) % PORTUGAL_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [paused])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => {
      const y = window.scrollY
      setStickyCtaVisible(y > 400)
      setBackToTopVisible(y > 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
    const el = featuresSectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setFeaturesInView(e.isIntersecting),
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = featuresSectionRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      if (featuresRafRef.current != null) cancelAnimationFrame(featuresRafRef.current)
      featuresRafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setCursorPos({ x: x * 2, y: y * 2 })
      })
    }
    const onLeave = () => setCursorPos({ x: 0, y: 0 })
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (featuresRafRef.current != null) cancelAnimationFrame(featuresRafRef.current)
    }
  }, [])

  useEffect(() => {
    const el = visaQuizRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setVisaQuizCursor({ x: x * 2, y: y * 2 })
    }
    const onLeave = () => setVisaQuizCursor({ x: 0, y: 0 })
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    const el = whatWeDoRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setWhatWeDoCursor({ x: x * 2, y: y * 2 })
    }
    const onLeave = () => setWhatWeDoCursor({ x: 0, y: 0 })
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    const el = howItWorksRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setHowStepsVisible(e.isIntersecting),
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Head>
        <title>WINIT — Move to Portugal with Confidence</title>
        <meta name="description" content="Portugal immigration support: D2, D7, and D8 visa applications. Document checklist, expert help, and tracking. Start your application today." />
        <meta property="og:title" content="WINIT — Move to Portugal with Confidence" />
        <meta property="og:description" content="Portugal immigration support: D2, D7, and D8 visa applications. Document checklist, expert help, and tracking." />
        <meta property="og:type" content="website" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <div className="home-nav-spacer" style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
        {/* Top Bar with WINIT Branding + hamburger on mobile — fixed so it stays visible when scrolling */}
        <nav className={`home-nav ${navOpen ? 'nav-open' : ''}`} style={{ background: '#1e293b' }}>
          <div className="home-nav-inner" style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <Link href="/" className="home-nav-logo" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', flexShrink: 0 }}>WINIT</Link>
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
              <Link href="/why-portugal" onClick={() => setNavOpen(false)} style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>Why Portugal</Link>
              <Link href="/visa-programs" onClick={() => setNavOpen(false)} style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>Visa Programs</Link>
              <a href="#faq" onClick={() => setNavOpen(false)} style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>FAQ</a>
              <Link href="/contact" onClick={() => setNavOpen(false)} style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>Contact</Link>
              <Link href="/auth/login" onClick={() => setNavOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
              <Link href="/auth/signup" className="home-nav-signup" onClick={() => setNavOpen(false)} style={{ color: '#00c896', textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link>
            </div>
          </div>
        </nav>

        {/* Hero Section with Portugal slideshow background */}
        <header
          className="home-hero-wrap"
          style={{
            color: 'white',
            padding: '5rem 0',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '75vh',
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
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
          <div className="hero-slideshow-overlay" />
          <div className="hero-mesh" aria-hidden />
          <div className="hero-slideshow-arrows">
            <button type="button" onClick={prev} aria-label="Previous image">‹</button>
            <button type="button" onClick={next} aria-label="Next image">›</button>
          </div>
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
          <div className="home-container home-hero-inner" style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '75vh',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', opacity: 0.9, marginBottom: '1rem', textTransform: 'uppercase' }}>Portugal immigration · WINIT</div>
            <h1 className="home-hero-title hero-gradient-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1.25rem' }}>
              Move to Portugal with Confidence
            </h1>
            <p className="home-hero-subtitle" style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.95, maxWidth: '32rem', fontWeight: 500 }}>
              We handle the paperwork—you focus on your new life.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" className="hero-cta hero-cta-primary">Start your application</Link>
            </div>
          </div>
        </header>

        {/* Interactive: Which visa is for you? — 3D cards + tilt */}
        <section
          id="check-eligibility"
          ref={visaQuizRef}
          className="visa-quiz-section home-section home-section-padding"
          style={{ padding: '4rem 0', scrollMarginTop: '5rem', position: 'relative', background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)' }}
        >
          <div className="home-container" style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="section-heading" style={{ textAlign: 'center', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', marginBottom: '0.5rem' }}>Which visa is for you?</h2>
            <p className="section-heading-sub" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Choose the option that best describes you — we'll recommend the right program</p>
            <div className="visa-quiz-grid">
              {VISA_QUIZ_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`visa-quiz-card ${visaChoice === opt.id ? 'visa-quiz-card-active' : ''}`}
                  onClick={() => setVisaChoice(visaChoice === opt.id ? null : opt.id)}
                  style={{
                    transform: `perspective(1200px) rotateX(${visaQuizCursor.y * 3}deg) rotateY(${visaQuizCursor.x * 3}deg)`,
                    transition: 'transform 0.2s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
                  }}
                >
                  <div className="visa-quiz-card-inner">
                    <span className="visa-quiz-icon" aria-hidden>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
              {visaChoice && (
                <div className="visa-result-glass">
                <p style={{ marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text)' }}>
                    {visaChoice === 'd2' && 'D2 (Entrepreneur) visa is likely the best fit.'}
                    {visaChoice === 'd7' && 'D7 (Passive Income) visa is likely the best fit.'}
                    {visaChoice === 'd8' && 'D8 (Digital Nomad) visa is likely the best fit.'}
                  </p>
                  <p style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.95rem' }}>
                    See full details below, or{' '}
                    <Link href="/auth/signup" style={{ color: '#0066cc', fontWeight: '600' }}>start your application</Link> and we’ll guide you.
                  </p>
                  <Link href={`/visa-programs#visa-${visaChoice}`} className="visa-result-btn">
                  View visa details →
                </Link>
                </div>
              )}
          </div>
        </section>

        {/* What We Do — professional feature map */}
        <section className="what-we-do-section what-we-do-pro home-section-padding">
          <div className="home-container what-we-do-pro-inner">
            <header className="what-we-do-pro-header">
              <h2 className="section-heading what-we-do-pro-title">What We Do</h2>
              <p className="what-we-do-pro-sub">End-to-end support for your Portugal residency journey</p>
              <p className="what-we-do-pro-lead">
                We simplify the process: upload documents, track progress in one place, and get expert help when you need it.
              </p>
            </header>

            <div className="what-we-do-feature-map" aria-label="Our services">
              <Link href="/visa-programs" className="what-we-do-feature-card">
                <span className="what-we-do-feature-icon" aria-hidden>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></svg>
                </span>
                <h3 className="what-we-do-feature-title">Residency Visa Programs</h3>
                <p className="what-we-do-feature-desc">D2 Entrepreneur, D7 Passive Income, and D8 Digital Nomad—with clear requirements and dedicated support.</p>
                <span className="what-we-do-feature-link">View programs</span>
              </Link>
              <button type="button" className="what-we-do-feature-card" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>
                <span className="what-we-do-feature-icon" aria-hidden>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                </span>
                <h3 className="what-we-do-feature-title">Expert Guidance</h3>
                <p className="what-we-do-feature-desc">Work with a licensed immigration specialist who knows the process and keeps you on track.</p>
                <span className="what-we-do-feature-link">FAQ & contact</span>
              </button>
              <Link href="/auth/signup" className="what-we-do-feature-card">
                <span className="what-we-do-feature-icon" aria-hidden>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
                </span>
                <h3 className="what-we-do-feature-title">Progress Tracking</h3>
                <p className="what-we-do-feature-desc">See exactly where you are in the process at any time, with a clear checklist and updates.</p>
                <span className="what-we-do-feature-link">Get started</span>
              </Link>
            </div>

            <div className="what-we-do-why-strip">
              <div className="what-we-do-why-item">
                <span className="what-we-do-why-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </span>
                <span className="what-we-do-why-text"><strong>Less stressful</strong> — We handle the complicated stuff</span>
              </div>
              <div className="what-we-do-why-item">
                <span className="what-we-do-why-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </span>
                <span className="what-we-do-why-text"><strong>Always updated</strong> — Real-time application status</span>
              </div>
              <div className="what-we-do-why-item">
                <span className="what-we-do-why-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
                </span>
                <span className="what-we-do-why-text"><strong>Personal support</strong> — Direct access to your specialist</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works — timeline + scroll-in */}
        <section ref={howItWorksRef} className="how-it-works-section home-section-padding" style={{ padding: '4rem 0', position: 'relative' }}>
          <div className="home-container" style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="section-heading" style={{ textAlign: 'center', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '3rem' }}>How It Works</h2>
            <div className="how-it-works-timeline">
              <div className={`how-step-card ${howStepsVisible ? 'how-step-visible' : ''}`} >
                <div style={{ position: 'relative' }}>
                  <div className="how-step-num">1</div>
                  <div className="how-step-connector" aria-hidden />
                </div>
                <div className="how-step-content">
                  <h3><Link href="/auth/signup" className="how-step-cta-link">Sign Up & Choose Your Plan →</Link></h3>
                  <p>Pick the package that fits your needs. Takes 2 minutes.</p>
                </div>
              </div>
              <div className={`how-step-card ${howStepsVisible ? 'how-step-visible' : ''}`} >
                <div style={{ position: 'relative' }}>
                  <div className="how-step-num">2</div>
                  <div className="how-step-connector" aria-hidden />
                </div>
                <div className="how-step-content">
                  <h3>Upload Your Documents</h3>
                  <p>Follow our simple checklist and upload your papers securely.</p>
                </div>
              </div>
              <div className={`how-step-card ${howStepsVisible ? 'how-step-visible' : ''}`} >
                <div style={{ position: 'relative' }}>
                  <div className="how-step-num">3</div>
                  <div className="how-step-connector" aria-hidden />
                </div>
                <div className="how-step-content">
                  <h3>We Review Everything</h3>
                  <p>Our expert checks your documents and tells you if anything is missing.</p>
                </div>
              </div>
              <div className={`how-step-card ${howStepsVisible ? 'how-step-visible' : ''}`} >
                <div style={{ position: 'relative' }}>
                  <div className="how-step-num">✓</div>
                </div>
                <div className="how-step-content">
                  <h3 style={{ color: 'var(--secondary)' }}>Get Approved</h3>
                  <p>We guide you through submission and help until you get your visa.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section — scroll reveal + cursor tilt */}
        <section
          id="what-you-get"
          ref={featuresSectionRef}
          className="what-you-get-section home-section-padding"
          style={{
            padding: '5rem 0',
            background: 'linear-gradient(165deg, #0f172a 0%, #1e293b 35%, #334155 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="what-you-get-glow" aria-hidden />
          <div className="home-container" style={{ position: 'relative', zIndex: 1 }}>
            <p className="what-you-get-tagline" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Your journey, simplified
            </p>
            <h2 className="what-you-get-title" style={{ textAlign: 'center', fontSize: '2.75rem', marginBottom: '0.5rem', color: 'white', fontWeight: '700' }}>
              What You Get
            </h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
              Scroll to discover — move your cursor over the cards to bring them to life.
            </p>

            <div className="home-features-grid what-you-get-grid">
              {[
                { iconKey: 'checklist', title: 'Document Checklist', desc: 'Know exactly what papers you need for your visa type' },
                { iconKey: 'secure', title: 'Secure Storage', desc: 'Your documents are encrypted and protected' },
                { iconKey: 'updates', title: 'Live Updates', desc: 'Get notified when your specialist reviews documents' },
                { iconKey: 'progress', title: 'Progress Tracking', desc: 'See where you are in the process at any time' },
                { iconKey: 'communication', title: 'Direct Communication', desc: 'Message your specialist with questions anytime' },
                { iconKey: 'payment', title: 'Easy Payment', desc: 'Secure online payment with credit card' },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className={`what-you-get-card ${featuresInView ? 'visible' : ''}`}
                  style={{
                    transform: featuresInView
                      ? `perspective(900px) rotateX(${cursorPos.y * 4}deg) rotateY(${cursorPos.x * 4}deg) translateY(0)`
                      : 'perspective(900px) rotateX(0) rotateY(0) translateY(32px)',
                    transition: 'transform 0.2s ease-out, opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease',
                    transitionDelay: featuresInView ? `${i * 80}ms` : '0ms',
                    opacity: featuresInView ? 1 : 0,
                  }}
                >
                  <div className="what-you-get-card-inner">
                    <span className="what-you-get-icon" aria-hidden>{WHAT_YOU_GET_ICONS[item.iconKey]}</span>
                    <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>{item.title}</h3>
                    <p style={{ color: '#94a3b8', lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Licensed & trusted + Reviews (light section) */}
        <section className="home-section-padding" style={{ padding: '4rem 0', background: '#f8fafc' }}>
          <div className="home-container">
            {/* Licensed & trusted */}
            <div className="home-trusted-block">
              <h2 className="section-heading" style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 1.75rem)', marginBottom: '1.25rem' }}>Licensed & trusted</h2>
              <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '1.5rem', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
                We work with licensed immigration specialists. Your data is secure and confidential.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem 2rem' }}>
                <li style={{ color: '#475569', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Licensed immigration support</li>
                <li style={{ color: '#475569', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Secure & confidential</li>
                <li style={{ color: '#475569', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Bank-level encryption for documents</li>
              </ul>
            </div>

            {/* Reviews */}
            <h2 className="section-heading" style={{ textAlign: 'center', fontSize: 'clamp(1.75rem, 3.5vw, 2rem)', marginBottom: '2rem' }}>Reviews</h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1rem', margin: 0 }}>No reviews yet.</p>

            {/* FAQ */}
            <div id="faq" style={{ scrollMarginTop: '5rem' }}>
              <h2 className="section-heading" style={{ textAlign: 'center', fontSize: 'clamp(1.75rem, 3.5vw, 2rem)', marginBottom: '1.5rem' }}>Frequently asked questions</h2>
              <div className="faq-list">
                {FAQ_ITEMS.map((item, i) => (
                  <div key={i} className="faq-item">
                    <button
                      type="button"
                      className="faq-question"
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      aria-expanded={faqOpen === i}
                    >
                      {item.q}
                      <span className="faq-icon">{faqOpen === i ? '−' : '+'}</span>
                    </button>
                    {faqOpen === i && <div className="faq-answer">{item.a}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section – welcoming close */}
            <div className="home-cta-block">
              <p className="home-cta-eyebrow">Your new chapter awaits</p>
              <h2 className="home-cta-title">We’d love to help you get there.</h2>
              <p className="home-cta-lead">
                Join hundreds of families and professionals who chose Portugal. From your first checklist to your consulate appointment, we’re with you—every step of the way.
              </p>
              <ul className="home-cta-benefits" aria-hidden>
                <li>Personal checklist for your visa type</li>
                <li>Dedicated specialist contact</li>
                <li>Secure, simple process</li>
              </ul>
              <Link href="/auth/signup" className="home-cta-button">
                Start my application — it’s free to begin
              </Link>
              <p className="home-cta-trust">🔒 Secure & confidential · No commitment until you choose a plan</p>
            </div>
          </div>
        </section>

      {/* Sticky "Check Your Eligibility" bar (follows on scroll) */}
      <div className={`sticky-cta-bar ${stickyCtaVisible ? 'visible' : ''}`}>
        <span style={{ fontSize: '0.95rem' }}>Check your eligibility</span>
        <a href="#check-eligibility">Check Your Eligibility →</a>
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

        {/* Footer */}
        <footer className="home-footer">
          <div className="home-container">
            <div style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>WINIT</div>
            <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Licensed immigration support · Your data is secure and confidential</p>
            <p style={{ opacity: 0.85, marginBottom: '0.5rem' }}>
              For official requirements, see <a href="https://www.aima.gov.pt" target="_blank" rel="noopener noreferrer" style={{ color: '#00c896', textDecoration: 'underline' }}>AIMA</a> and your consulate.
            </p>
            <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>
              <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.9)', marginRight: '1rem' }}>Privacy</Link>
              <Link href="/terms" style={{ color: 'rgba(255,255,255,0.9)', marginRight: '1rem' }}>Terms</Link>
              <Link href="/contact" style={{ color: 'rgba(255,255,255,0.9)', marginRight: '1rem' }}>Contact</Link>
              <Link href="/cookies" style={{ color: 'rgba(255,255,255,0.9)' }}>Cookies</Link>
            </p>
            <p style={{ opacity: 0.8 }}>© 2026 WINIT Portugal Immigration Platform. All rights reserved.</p>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '0.5rem' }}>Empowering your immigration journey</p>
          </div>
        </footer>
      </div>
    </>
  )
}
