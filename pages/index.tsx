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

const FAQ_ITEMS = [
  { q: 'Is this service legitimate and secure?', a: 'Yes. We work with licensed immigration specialists and use bank-level encryption for your documents. Your data is never shared with third parties except as required for your application.' },
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
  const [featuresInView, setFeaturesInView] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const featuresSectionRef = useRef<HTMLElement>(null)
  const featuresRafRef = useRef<number | null>(null)

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
    const onScroll = () => setStickyCtaVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  return (
    <>
      <Head>
        <title>WINIT — Move to Portugal with Confidence</title>
        <meta name="description" content="Portugal immigration support: D2, D7, and D8 visa applications. Document checklist, expert help, and tracking. Start your application today." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
        {/* Top Bar with WINIT Branding */}
        <nav style={{ background: '#1e293b', position: 'relative', zIndex: 10 }}>
          <div className="home-nav-inner" style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/" className="home-nav-logo" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', flexShrink: 0 }}>WINIT</Link>
            <div className="home-nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end', marginLeft: 'auto' }}>
              <a href="#why-portugal" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>Why Portugal</a>
              <a href="#residency-programs" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>Visa Programs</a>
              <a href="#faq" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>FAQ</a>
              <Link href="/contact" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>Contact</Link>
              <Link href="/auth/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
              <Link href="/auth/signup" className="home-nav-signup" style={{ color: '#00c896', textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link>
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
            <div style={{ fontSize: '0.9rem', fontWeight: '600', letterSpacing: '2px', opacity: 0.95, marginBottom: '1rem' }}>POWERED BY WINIT</div>
            <h1 className="home-hero-title" style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Move to Portugal with Confidence
            </h1>
            <p className="home-hero-subtitle" style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.95, maxWidth: '32rem' }}>
              We handle the paperwork—you focus on your new life.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" className="hero-cta hero-cta-primary">Start your application</Link>
            </div>
          </div>
        </header>

      {/* Why Portugal – four themes */}
      <section id="why-portugal" className="home-section why-portugal home-section-padding" style={{ scrollMarginTop: '5rem' }}>
        <div className="home-container">
          <h2 style={{ textAlign: 'center', fontSize: '2.25rem', marginBottom: '1rem', color: '#1e293b' }}>Why Portugal?</h2>
          <p style={{ textAlign: 'center', fontSize: '1.15rem', color: '#64748b', marginBottom: '2.5rem' }}>
            One of the world’s most welcoming countries for new residents
          </p>

          <div className="why-portugal-blocks">
            <div className="why-portugal-block">
              <div className="why-portugal-block-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80)' }} />
              <div className="why-portugal-block-content">
                <span className="why-portugal-block-label">The Lifestyle</span>
                <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '0.75rem' }}>300 Days of Possibility</h3>
                <p style={{ color: '#475569', lineHeight: 1.7, margin: 0 }}>
                  Why settle for a vacation when you can have a life? With over 300 days of sunshine a year, Portugal isn’t just a destination—it’s an invitation to slow down. From the Atlantic breeze to the cobblestone charm of our historic cities, discover a world where &quot;work-life balance&quot; is a daily reality, not just a buzzword.
                </p>
              </div>
            </div>

            <div className="why-portugal-block why-portugal-block-reverse">
              <div className="why-portugal-block-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80&v=1)' }} />
              <div className="why-portugal-block-content">
                <span className="why-portugal-block-label">The Safety</span>
                <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Europe’s Quiet Sanctuary</h3>
                <p style={{ color: '#475569', lineHeight: 1.7, margin: 0 }}>
                  Find peace in one of the world&apos;s safest countries. Whether you’re raising a family or enjoying retirement, Portugal offers a secure, stable environment where community comes first. Walk the streets with confidence and sleep soundly knowing you’ve chosen a top-tier global haven for safety and social stability.
                </p>
              </div>
            </div>

            <div className="why-portugal-block">
              <div className="why-portugal-block-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80&v=2)' }} />
              <div className="why-portugal-block-content">
                <span className="why-portugal-block-label">The Digital Hub</span>
                <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Where Tradition Meets Tech</h3>
                <p style={{ color: '#475569', lineHeight: 1.7, margin: 0 }}>
                  Join a thriving ecosystem of innovators and creators. As a premier hub for digital nomads and tech entrepreneurs, Portugal provides world-class fiber-optic connectivity wrapped in Old World charm. Scale your business from a seaside café and tap into a multilingual, highly skilled talent pool that’s ready for the future.
                </p>
              </div>
            </div>

            <div className="why-portugal-block why-portugal-block-reverse">
              <div className="why-portugal-block-image">
                <img
                  src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80"
                  alt="Luxury hotel in Portugal"
                />
              </div>
              <div className="why-portugal-block-content">
                <span className="why-portugal-block-label">The Value</span>
                <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Affordable Luxury, Unmatched Quality</h3>
                <p style={{ color: '#475569', lineHeight: 1.7, margin: 0 }}>
                  Your wealth goes further here. Enjoy a standard of living that rivals Europe’s most expensive capitals at a fraction of the cost. From iconic stays like Lisbon’s Pestana Palace Hotel—a national monument—to Michelin-starred dining, premium private healthcare, and historic real estate, Portugal offers the luxury you’ve earned with the financial freedom you deserve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Interactive: Which visa is for you? */}
        <section id="check-eligibility" className="home-section home-section-padding" style={{ background: '#f0f9ff', padding: '3rem 0', scrollMarginTop: '5rem' }}>
          <div className="home-container">
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>Which visa is for you?</h2>
              <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>Answer one question to see the best fit</p>
              <div className="visa-selector">
                <button
                  type="button"
                  className={`visa-option ${visaChoice === 'd2' ? 'visa-option-active' : ''}`}
                  onClick={() => setVisaChoice(visaChoice === 'd2' ? null : 'd2')}
                >
                  I want to start or run a business in Portugal
                </button>
                <button
                  type="button"
                  className={`visa-option ${visaChoice === 'd7' ? 'visa-option-active' : ''}`}
                  onClick={() => setVisaChoice(visaChoice === 'd7' ? null : 'd7')}
                >
                  I have passive income (pension, rentals, investments)
                </button>
                <button
                  type="button"
                  className={`visa-option ${visaChoice === 'd8' ? 'visa-option-active' : ''}`}
                  onClick={() => setVisaChoice(visaChoice === 'd8' ? null : 'd8')}
                >
                  I work remotely for a company or clients abroad
                </button>
              </div>
              {visaChoice && (
                <div className="visa-result">
                  <p style={{ marginBottom: '0.75rem', fontWeight: '600', color: '#1e293b' }}>
                    {visaChoice === 'd2' && 'D2 (Entrepreneur) visa is likely the best fit.'}
                    {visaChoice === 'd7' && 'D7 (Passive Income) visa is likely the best fit.'}
                    {visaChoice === 'd8' && 'D8 (Digital Nomad) visa is likely the best fit.'}
                  </p>
                  <p style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.95rem' }}>
                    Scroll down to see full details, or{' '}
                    <Link href="/auth/signup" style={{ color: '#0066cc', fontWeight: '600' }}>start your application</Link> and we’ll guide you.
                  </p>
                  <button
                    type="button"
                    className="visa-result-btn"
                    onClick={() => document.getElementById('residency-programs')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View visa details ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="home-section-padding" style={{ padding: '5rem 0', background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)' }}>
          <div className="home-container">
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>What We Do</h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>We’re here to help you every step of the way</p>
            <div style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#475569', marginBottom: '3rem', textAlign: 'center' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Moving to Portugal involves a lot of paperwork—visa applications, deadlines, and follow-up. It can feel overwhelming.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: '#0066cc', fontSize: '1.3rem' }}>We make it simple.</strong> Upload your documents, track your progress in one place, and get expert help whenever you need it.
              </p>
            </div>

            <div className="home-about-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <button
                type="button"
                onClick={() => document.getElementById('residency-programs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '2px solid #e2e8f0',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛂</div>
                <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Residency Visa Programs</h3>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>D2 Entrepreneur, D7 Passive Income, and D8 Digital Nomad</p>
                <span style={{ display: 'inline-block', marginTop: '0.75rem', color: '#0066cc', fontWeight: '600' }}>
                  View details ↓
                </span>
              </button>

              <button
                type="button"
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0', cursor: 'pointer', width: '100%' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👨‍💼</div>
                <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Get Expert Help</h3>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>Work with a licensed immigration specialist who knows the process</p>
                <span style={{ display: 'inline-block', marginTop: '0.75rem', color: '#0066cc', fontWeight: '600' }}>FAQ →</span>
              </button>

              <Link href="/auth/signup" style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0', cursor: 'pointer', width: '100%', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Track Your Progress</h3>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>See exactly where you are in the process at any time</p>
                <span style={{ display: 'inline-block', marginTop: '0.75rem', color: '#0066cc', fontWeight: '600' }}>Get started →</span>
              </Link>
            </div>

            <div style={{ background: '#e0f2fe', padding: '2.5rem', borderRadius: '12px', borderLeft: '4px solid #0066cc' }}>
              <h3 style={{ color: '#0066cc', fontSize: '1.5rem', marginBottom: '1rem' }}>Why People Choose Us</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ padding: '0.75rem 0', color: '#334155', fontSize: '1.1rem' }}>✅ <strong>Less Stressful:</strong> We handle the complicated stuff</li>
                <li style={{ padding: '0.75rem 0', color: '#334155', fontSize: '1.1rem' }}>✅ <strong>Always Updated:</strong> Know your application status in real-time</li>
                <li style={{ padding: '0.75rem 0', color: '#334155', fontSize: '1.1rem' }}>✅ <strong>Personal Support:</strong> Direct access to your immigration specialist</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="home-section-padding" style={{ padding: '4rem 0', background: '#f8fafc' }}>
          <div className="home-container">
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: '#1e293b' }}>How It Works</h2>
            <div className="home-steps" style={{ display: 'grid', gap: '2rem' }}>
              <div className="home-step-row" style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
                <div style={{ background: '#0066cc', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                <div>
                  <Link href="/auth/signup" style={{
                    display: 'inline-block',
                    color: 'white',
                    background: 'linear-gradient(135deg, #0066cc, #00c896)',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '10px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    marginBottom: '0.75rem',
                    boxShadow: '0 6px 16px rgba(0, 102, 204, 0.35)'
                  }}>
                    Sign Up & Choose Your Plan →
                  </Link>
                  <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>Pick the package that fits your needs. Takes 2 minutes.</p>
                </div>
              </div>
              <div className="home-step-row" style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
                <div style={{ background: '#0066cc', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                <div>
                  <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Upload Your Documents</h3>
                  <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>Follow our simple checklist and upload your papers securely.</p>
                </div>
              </div>
              <div className="home-step-row" style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
                <div style={{ background: '#0066cc', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>3</div>
                <div>
                  <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>We Review Everything</h3>
                  <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>Our expert checks your documents and tells you if anything is missing.</p>
                </div>
              </div>
              <div className="home-step-row" style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
                <div style={{ background: '#00c896', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>✓</div>
                <div>
                  <h3 style={{ color: '#00c896', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Get Approved</h3>
                  <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>We guide you through submission and help until you get your visa.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Residency Programs */}
        <section id="residency-programs" className="home-section-padding" style={{ padding: '5rem 0', background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)', scrollMarginTop: '90px' }}>
          <div className="home-container">
            <h2 id="assistance-residency-programs" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', color: '#1e293b', scrollMarginTop: '90px' }}>
              Types of Residency Programs
            </h2>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#64748b', marginBottom: '3rem' }}>
              End-to-end support from documentation preparation to AIMA appointment after arrival in Portugal.
            </p>

            <div className="home-residency-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {/* D2 Visa */}
              <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0' }}>
                <h3 style={{ color: '#0066cc', fontSize: '1.6rem', marginBottom: '0.5rem' }}>D2 Visa Program (Entrepreneur Visa)</h3>
                <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  Portugal D2 Visa is for non-EU/EEA/Swiss citizens who want to start a business, invest in an existing one, or work as independent professionals in Portugal.
                </p>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Who Is Eligible?</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                  <li>Entrepreneurs opening a new company or branch</li>
                  <li>Investors buying shares in a Portuguese business</li>
                  <li>Freelancers with service contracts or proposals from Portuguese clients</li>
                </ul>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Core Requirements</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                  <li>Company registration in Portugal</li>
                  <li>Detailed business plan showing economic/social/cultural value</li>
                  <li>Portuguese bank account</li>
                  <li>Financial means: about €11,040 for main applicant (plus family)</li>
                  <li>Additional funds based on startup capital in the plan</li>
                  <li>Portuguese Tax ID (NIF)</li>
                  <li>Proof of accommodation (12-month lease or property deed)</li>
                  <li>Clean criminal record certificate</li>
                </ul>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Timeline & Validity</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                  <li>Initial entry visa: 4 months (120 days)</li>
                  <li>Residence permit: 2 years, renewable for 3-year periods</li>
                  <li>Citizenship eligibility after 5 years (language/background requirements)</li>
                </ul>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Key Benefits</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                  <li>Visa-free travel within Schengen Area</li>
                  <li>Family reunification</li>
                  <li>Access to public healthcare</li>
                  <li>Free public education up to grade 12</li>
                </ul>

                <p style={{ color: '#475569', marginBottom: '1rem' }}>
                  <strong>Processing time:</strong> typically 60–90 days for consulate decision.
                </p>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>How We Can Help</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                  <li>Tax ID (NIF) issuance</li>
                  <li>Company registration</li>
                  <li>Bank account opening (in person or remote)</li>
                  <li>Business plan prepared by certified CPA</li>
                  <li>Long-term lease or property deed support</li>
                  <li>Driver’s license exchange assistance</li>
                </ul>
              </div>

              {/* D7 Visa */}
              <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0' }}>
                <h3 style={{ color: '#0066cc', fontSize: '1.6rem', marginBottom: '0.5rem' }}>D7 Visa Program (Passive Income)</h3>
                <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  The Portugal D7 Visa is for non-EU/EEA/Swiss citizens with stable recurring income from outside Portugal.
                </p>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Who Can Apply?</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                  <li>Retirees with a pension</li>
                  <li>Investors earning dividends or interest</li>
                  <li>Landlords with rental income</li>
                  <li>Royalty or IP income holders</li>
                </ul>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Core Financial Requirements (2026)</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                  <li>Main applicant: €11,040 annually (€920/month)</li>
                  <li>Spouse/parent: +50% (€460/month)</li>
                  <li>Dependent child: +30% (€276/month)</li>
                  <li>Recommended: 12 months of funds in a Portuguese bank</li>
                </ul>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Other Requirements</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                  <li>Long-term accommodation (12-month lease or property deed)</li>
                  <li>Portuguese Tax ID (NIF)</li>
                  <li>Clean criminal record certificate</li>
                </ul>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Key Benefits</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                  <li>Initial residence permit: 2 years, then 3-year renewal</li>
                  <li>Citizenship eligibility after 5 years</li>
                  <li>Work rights after residence permit issued</li>
                  <li>Access to public healthcare and education</li>
                </ul>

                <p style={{ color: '#475569', marginBottom: '1rem' }}>
                  <strong>Processing time:</strong> typically 60–90 days for consulate decision.
                </p>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>How We Can Help</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                  <li>Tax ID (NIF) issuance</li>
                  <li>Bank account opening (in person or remote)</li>
                  <li>Long-term lease or property deed support</li>
                  <li>Driver’s license exchange assistance</li>
                  <li>Portuguese health number assistance</li>
                </ul>
              </div>

              {/* D8 Visa */}
              <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0' }}>
                <h3 style={{ color: '#0066cc', fontSize: '1.6rem', marginBottom: '0.5rem' }}>D8 Visa Program (Digital Nomad)</h3>
                <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  The Portugal D8 Visa is for remote workers or freelancers with clients outside Portugal.
                </p>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Core Requirements (2026)</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
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

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Key Benefits</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                  <li>Initial residence permit: 2 years, then 3-year renewal</li>
                  <li>Citizenship eligibility after 5 years</li>
                  <li>Work rights after residence permit issued</li>
                  <li>Access to public healthcare and education</li>
                </ul>

                <p style={{ color: '#475569', marginBottom: '1rem' }}>
                  <strong>Processing time:</strong> typically 60–90 days for consulate decision.
                </p>

                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>How We Can Help</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                  <li>Tax ID (NIF) issuance</li>
                  <li>Bank account opening (in person or remote)</li>
                  <li>Long-term lease or property deed support</li>
                  <li>Driver’s license exchange assistance</li>
                  <li>Portuguese health number assistance</li>
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '3rem', background: '#e0f2fe', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid #0066cc' }}>
              <h4 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>Stay Requirements</h4>
              <p style={{ color: '#475569', lineHeight: '1.7', margin: 0 }}>
                To keep the residency permit valid and lead to citizenship, you generally cannot be absent from Portugal for more than 6 consecutive months or 8 non-consecutive months within the permit's validity period.
              </p>
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
              <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '1.25rem', color: '#1e293b' }}>Licensed & trusted</h2>
              <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '1.5rem', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
                We work with licensed immigration specialists. Your data is secure and confidential.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem 2rem' }}>
                <li style={{ color: '#475569', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Licensed immigration support</li>
                <li style={{ color: '#475569', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Secure & confidential</li>
                <li style={{ color: '#475569', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Bank-level encryption for documents</li>
              </ul>
            </div>

            {/* Reviews – replace the placeholder text below with your real client reviews */}
            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', color: '#1e293b' }}>Reviews</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <p className="testimonial-text">Add your first client review or quote here.</p>
                <p className="testimonial-author">— Client name, location</p>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-text">Add your second client review or quote here.</p>
                <p className="testimonial-author">— Client name, location</p>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-text">Add your third client review or quote here.</p>
                <p className="testimonial-author">— Client name, location</p>
              </div>
            </div>

            {/* FAQ */}
            <div id="faq" style={{ scrollMarginTop: '5rem' }}>
              <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1.5rem', color: '#1e293b' }}>Frequently asked questions</h2>
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

            {/* CTA Section */}
            <div className="home-cta-block">
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to start your Portugal journey?</h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '0.75rem', opacity: 0.9 }}>Get expert support for your application.</p>
              <p style={{ fontSize: '0.95rem', marginBottom: '2rem', opacity: 0.9 }}>You’ll get a checklist and a specialist contact so you know what happens next.</p>
              <Link href="/auth/signup" className="home-cta-button">
                Get Started Today →
              </Link>
              <p style={{ fontSize: '0.9rem', marginTop: '1.5rem', opacity: 0.85 }}>🔒 Secure application · No commitment until you choose a plan</p>
            </div>
          </div>
        </section>

      {/* Sticky "Check Your Eligibility" bar (follows on scroll) */}
      <div className={`sticky-cta-bar ${stickyCtaVisible ? 'visible' : ''}`}>
        <span style={{ fontSize: '0.95rem' }}>Check your eligibility</span>
        <a href="#check-eligibility">Check Your Eligibility →</a>
      </div>

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
