import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect, useCallback, useRef } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

const PORTUGAL_IMAGES = [
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1920&q=80', // Lisbon
  'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1920&q=80', // Algarve coast
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1920&q=80', // Porto
  'https://images.unsplash.com/photo-1567270671170-fdc10a5bf831?w=1920&q=80', // Lisbon streets
  'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1920&q=80',   // Portugal coast
  'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1920&q=80', // Douro Valley nature
]

/* Gradient colors per slide: light (from image) → grey → dark. Grows with scroll. */
const SLIDE_GRADIENTS: { from: string; mid: string; to: string }[] = [
  { from: '#F5F1E8', mid: '#9CA3AF', to: '#1F2937' },   // Lisbon – warm white → grey → dark
  { from: '#E8F0F5', mid: '#7B9AA8', to: '#1E3A4A' },   // Algarve – light blue/sand → grey → dark blue
  { from: '#E5E2DB', mid: '#8B9089', to: '#374151' },   // Porto – warm grey → grey → dark
  { from: '#F0EDE5', mid: '#8A8A82', to: '#2D2D2A' },  // Lisbon streets – cream → grey → dark
  { from: '#E2EDF2', mid: '#7A8A92', to: '#2C3E50' },   // Portugal coast – sky/sand → grey → dark
  { from: '#E8EDE5', mid: '#6B7B6B', to: '#2D3B2D' },   // Douro Valley – soft green/grey → grey → dark
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
  const [scrollY, setScrollY] = useState(0)
  const [gradientHeightPx, setGradientHeightPx] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  const [featuresInView, setFeaturesInView] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [visaQuizCursor, setVisaQuizCursor] = useState({ x: 0, y: 0 })
  const [whatWeDoCursor, setWhatWeDoCursor] = useState({ x: 0, y: 0 })
  const [howStepsVisible, setHowStepsVisible] = useState(false)
  const [sectionRevealed, setSectionRevealed] = useState<Record<string, boolean>>({})
  const featuresSectionRef = useRef<HTMLElement>(null)
  const featuresRafRef = useRef<number | null>(null)
  const visaQuizRef = useRef<HTMLElement>(null)
  const whatWeDoRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const visaRevealRef = useRef<HTMLDivElement>(null)
  const whatWeDoRevealRef = useRef<HTMLDivElement>(null)
  const trustedRevealRef = useRef<HTMLDivElement>(null)
  const faqRevealRef = useRef<HTMLDivElement>(null)
  const ctaRevealRef = useRef<HTMLDivElement>(null)

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
      setScrollY(y)
      setGradientHeightPx(window.innerHeight + y)
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
    const el = featuresSectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setFeaturesInView(e.isIntersecting),
      { threshold: 0, rootMargin: '80px 0px 80px 0px' }
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

  useEffect(() => {
    const refs: { ref: React.RefObject<HTMLDivElement | null>; id: string }[] = [
      { ref: visaRevealRef, id: 'visa' },
      { ref: whatWeDoRevealRef, id: 'whatWeDo' },
      { ref: trustedRevealRef, id: 'trusted' },
      { ref: faqRevealRef, id: 'faq' },
      { ref: ctaRevealRef, id: 'cta' },
    ]
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

  return (
    <>
      <Head>
        <title>WINIT — Move to Portugal with Confidence</title>
        <meta name="description" content="Portugal immigration support: D2, D7, and D8 visa applications. Document checklist, expert help, and tracking. Start your application today." />
        {BASE_URL && <link rel="canonical" href={BASE_URL} />}
        <meta property="og:title" content="WINIT — Move to Portugal with Confidence" />
        <meta property="og:description" content="Portugal immigration support: D2, D7, and D8 visa applications. Document checklist, expert help, and tracking." />
        <meta property="og:type" content="website" />
        {BASE_URL && <meta property="og:url" content={BASE_URL} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <meta property="og:site_name" content="WINIT Portugal Immigration" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="WINIT — Move to Portugal with Confidence" />
        <meta name="twitter:description" content="Portugal immigration support: D2, D7, and D8 visa applications. Document checklist, expert help, and tracking." />
        {BASE_URL && <meta name="twitter:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'WINIT Portugal Immigration',
              description: 'Portugal immigration support: D2, D7, and D8 visa applications with document checklist, expert help, and progress tracking.',
              ...(BASE_URL && { url: BASE_URL }),
              ...(BASE_URL && {
                potentialAction: {
                  '@type': 'SearchAction',
                  target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/visa-programs?q={search_term_string}` },
                  'query-input': 'required name=search_term_string',
                },
              }),
            }),
          }}
        />
      </Head>
      <div className="home-nav-spacer min-h-screen overflow-x-hidden font-sans home-page-with-scroll-gradient" style={{ position: 'relative', backgroundColor: SLIDE_GRADIENTS[slideIndex].to }}>
        {/* Fixed gradient layer: scroll-linked so we move through light → mid → dark */}
        <div
          aria-hidden
          className="home-scroll-gradient-layer"
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            background: (() => {
              const g = SLIDE_GRADIENTS[slideIndex]
              return `linear-gradient(180deg, ${g.from} 0%, ${g.mid} 40%, ${g.to} 100%)`
            })(),
            backgroundSize: `100% ${Math.max(2800, gradientHeightPx || 2800)}px`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `0 ${-scrollY}px`,
          }}
        />
        <div className="home-content-layer">
        {/* Top Bar with WINIT Branding + hamburger on mobile — fixed so it stays visible when scrolling */}
        <nav className={`home-nav ${navOpen ? 'nav-open' : ''}`}>
          <div className="home-nav-inner">
            <Link href="/" className="home-nav-logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', flexShrink: 0 }}>WINIT</Link>
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
              <Link href="/why-portugal" onClick={() => setNavOpen(false)} className="no-underline font-medium">Why Portugal</Link>
              <Link href="/visa-programs" onClick={() => setNavOpen(false)} className="no-underline font-medium">Visa Programs</Link>
              <a href="#faq" onClick={() => setNavOpen(false)} className="no-underline font-medium">FAQ</a>
              <Link href="/contact" onClick={() => setNavOpen(false)} className="no-underline font-medium">Contact</Link>
              <Link href="/auth/login" onClick={() => setNavOpen(false)} className="no-underline font-semibold">Login</Link>
              <Link href="/auth/signup" className="home-nav-signup no-underline" onClick={() => setNavOpen(false)}>Sign Up</Link>
            </div>
          </div>
        </nav>

        {/* Hero: image slideshow with light overlay, dark text, blue button */}
        <header
          className="home-hero-wrap home-hero-slideshow"
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
          <div className="hero-slideshow-overlay" aria-hidden />
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
          <div className="home-container home-hero-inner home-hero-clean-inner">
            <p className="home-hero-eyebrow">Portugal immigration · WINIT</p>
            <h1 className="home-hero-title">Move to Portugal with Confidence</h1>
            <p className="home-hero-subtitle">We handle the paperwork—you focus on your new life.</p>
            <Link href="/auth/signup" className="hero-cta hero-cta-primary">Start your application</Link>
          </div>
        </header>

        {/* Interactive: Which visa is for you? — 3D cards + tilt, scroll reveal */}
        <section
          id="check-eligibility"
          ref={visaQuizRef}
          className="visa-quiz-section home-section home-section-padding section-bg-gradient"
          style={{ padding: '4rem 0', scrollMarginTop: '5rem', position: 'relative' }}
        >
          <div className="home-container" style={{ position: 'relative', zIndex: 1 }}>
            <div
              ref={visaRevealRef}
              data-reveal-id="visa"
              className={`scroll-reveal-box home-section-center ${sectionRevealed.visa ? 'visible' : ''}`}
            >
              <h2 className="section-heading section-heading-no-underline section-heading-center reveal-stagger" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', marginBottom: '0.5rem' }}>Which visa is for you?</h2>
              <p className="section-heading-sub reveal-stagger text-center" style={{ marginBottom: '2.5rem' }}>Choose the option that best describes you — we'll recommend the right program</p>
              <div className="visa-quiz-grid reveal-stagger">
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
                <p className="text-text mb-3 font-semibold">
                    {visaChoice === 'd2' && 'D2 (Entrepreneur) visa is likely the best fit.'}
                    {visaChoice === 'd7' && 'D7 (Passive Income) visa is likely the best fit.'}
                    {visaChoice === 'd8' && 'D8 (Digital Nomad) visa is likely the best fit.'}
                  </p>
                  <p className="text-text-muted mb-4 text-sm md:text-base">
                    See full details below, or{' '}
                    <Link href="/auth/signup" className="text-primary font-semibold">start your application</Link> and we’ll guide you.
                  </p>
                  <Link href={`/visa-programs#visa-${visaChoice}`} className="visa-result-btn">
                  View visa details →
                </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* What We Do — section 2: white for breathing space */}
        <section className="what-we-do-section what-we-do-pro home-section-padding bg-white">
          <div className="home-container what-we-do-pro-inner">
            <div
              ref={whatWeDoRevealRef}
              data-reveal-id="whatWeDo"
              className={`scroll-reveal-box ${sectionRevealed.whatWeDo ? 'visible' : ''}`}
            >
              <header className="what-we-do-pro-header reveal-stagger">
                <h2 className="section-heading section-heading-no-underline what-we-do-pro-title">What We Do</h2>
                <p className="what-we-do-pro-sub">End-to-end support for your Portugal residency journey</p>
                <p className="what-we-do-pro-lead">
                  We simplify the process: upload documents, track progress in one place, and get expert help when you need it.
                </p>
              </header>

              <div className="what-we-do-feature-map reveal-stagger" aria-label="Our services">
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

              <div className="what-we-do-why-strip reveal-stagger">
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
          </div>
        </section>

        {/* How It Works — timeline + scroll-in, centered, no underline */}
        <section ref={howItWorksRef} className="how-it-works-section home-section-padding section-bg-gradient" style={{ padding: '4rem 0', position: 'relative' }}>
          <div className="home-container home-section-center" style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="section-heading section-heading-no-underline section-heading-center" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '3rem' }}>How It Works</h2>
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
                  <h3>Get Approved</h3>
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
          className="what-you-get-section home-section-padding bg-white"
          style={{
            padding: '5rem 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="what-you-get-glow" aria-hidden />
          <div className="home-container" style={{ position: 'relative', zIndex: 1 }}>
            <p className="what-you-get-tagline text-center text-sm font-semibold tracking-widest uppercase mb-3" style={{ letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
              Your journey, simplified
            </p>
            <h2 className="what-you-get-title text-center font-bold" style={{ fontSize: '2.75rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
              What You Get
            </h2>
            <p className="text-text-muted text-center max-w-[520px] mx-auto" style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
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
                      : 'perspective(900px) rotateX(0) rotateY(0) translateY(24px)',
                    transition: 'transform 0.2s ease-out, opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease',
                    transitionDelay: featuresInView ? `${i * 80}ms` : '0ms',
                    opacity: 1,
                  }}
                >
                  <div className="what-you-get-card-inner">
                    <span className="what-you-get-icon" aria-hidden>{WHAT_YOU_GET_ICONS[item.iconKey]}</span>
                    <h3 className="mb-2 text-xl font-semibold" style={{ color: 'var(--text)' }}>{item.title}</h3>
                    <p className="text-text-muted leading-relaxed m-0 text-sm md:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Licensed & trusted + Reviews (light section) — scroll reveal */}
        <section className="home-section-padding section-bg-gradient" style={{ padding: '4rem 0' }}>
          <div className="home-container">
            <div
              ref={trustedRevealRef}
              data-reveal-id="trusted"
              className={`scroll-reveal-box floating-box home-section-center ${sectionRevealed.trusted ? 'visible' : ''}`}
            >
            {/* Licensed & trusted */}
            <div className="home-trusted-block text-center">
              <h2 className="section-heading section-heading-center" style={{ fontSize: 'clamp(1.5rem, 3vw, 1.75rem)', marginBottom: '1.25rem' }}>Licensed & trusted</h2>
              <p className="text-text-muted max-w-[560px] mx-auto" style={{ marginBottom: '1.5rem' }}>
                We work with licensed immigration specialists. Your data is secure and confidential.
              </p>
              <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 list-none p-0 m-0">
                <li className="text-text-muted flex items-center justify-center gap-2 text-base">✓ Licensed immigration support</li>
                <li className="text-text-muted flex items-center justify-center gap-2 text-base">✓ Secure & confidential</li>
                <li className="text-text-muted flex items-center justify-center gap-2 text-base">✓ Bank-level encryption for documents</li>
              </ul>
            </div>

            {/* Reviews */}
            <h2 className="section-heading section-heading-center" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2rem)', marginBottom: '2rem' }}>Reviews</h2>
            <p className="text-text-muted text-base m-0">No reviews yet.</p>
            </div>

            {/* FAQ — scroll reveal */}
            <div
              id="faq"
              ref={faqRevealRef}
              data-reveal-id="faq"
              className={`scroll-reveal-box floating-box home-section-center ${sectionRevealed.faq ? 'visible' : ''}`}
              style={{ scrollMarginTop: '5rem', marginTop: '3rem', padding: '2.5rem' }}
            >
              <h2 className="section-heading section-heading-center" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2rem)', marginBottom: '1.5rem' }}>Frequently asked questions</h2>
              <div className="faq-list faq-list-center">
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

            {/* CTA Section – welcoming close, scroll reveal */}
            <div
              ref={ctaRevealRef}
              data-reveal-id="cta"
              className={`scroll-reveal-box ${sectionRevealed.cta ? 'visible' : ''}`}
              style={{ marginTop: '3rem' }}
            >
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
            <div className="font-bold text-primary mb-4 text-2xl">WINIT</div>
            <p className="text-text-muted mb-2">Licensed immigration support · Your data is secure and confidential</p>
            <p className="text-text-muted mb-2">
              For official requirements, see <a href="https://www.aima.gov.pt" target="_blank" rel="noopener noreferrer" className="text-accent underline">AIMA</a> and your consulate.
            </p>
            <p className="mb-2">
              <Link href="/privacy" className="mr-4">Privacy</Link>
              <Link href="/terms" className="mr-4">Terms</Link>
              <Link href="/contact" className="mr-4">Contact</Link>
              <Link href="/cookies">Cookies</Link>
            </p>
            <p className="text-text-muted">© 2026 WINIT Portugal Immigration Platform. All rights reserved.</p>
            <p className="text-text-muted text-sm mt-2">Empowering your immigration journey</p>
          </div>
        </footer>
        </div>
      </div>
    </>
  )
}
