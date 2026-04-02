import Link from 'next/link'
import Head from 'next/head'
import type { CSSProperties } from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import SiteNav from '../components/SiteNav'
import ReviewsSection from '../components/ReviewsSection'
import { getSiteCopy, replaceYear } from '../lib/getSiteCopy'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const copy = getSiteCopy()
const nav = copy.nav
const home = copy.home

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
  const [sectionRevealed, setSectionRevealed] = useState<Record<string, boolean>>({})

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
        <title>{home.meta_title}</title>
        <meta name="description" content={home.meta_description} />
        {BASE_URL && <link rel="canonical" href={BASE_URL} />}
        <meta property="og:title" content={home.meta_title} />
        <meta property="og:description" content={home.meta_description} />
        <meta property="og:type" content="website" />
        {BASE_URL && <meta property="og:url" content={BASE_URL} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <meta property="og:site_name" content={nav.brand + ' Portugal Immigration'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={home.meta_title} />
        <meta name="twitter:description" content={home.meta_description} />
        {BASE_URL && <meta name="twitter:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: nav.brand + ' Portugal Immigration',
              description: home.footer_tagline,
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
        <SiteNav />

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
            <p className="home-hero-eyebrow" style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem' }}>{home.hero_eyebrow}</p>
            <h1 className="defesa-hero-title">{home.hero_title}</h1>
            <p className="defesa-hero-sub">{home.hero_subtitle}</p>
            <div className="hero-cta-group">
              <Link href="/contact" className="hero-cta hero-cta-primary">{home.hero_cta_primary}</Link>
              <Link href="/services" className="hero-cta hero-cta-secondary">{home.hero_cta_secondary}</Link>
            </div>
          </div>
        </header>

        {/* Why Portugal — teaser strip */}
        <section className="section-with-bg home-section-padding why-portugal-teaser" style={{ padding: '3.5rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.whyPortugalTeaser})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <p className="why-portugal-teaser-text">
              {home.why_teaser_text}
            </p>
            <Link href="/why-portugal" className="why-portugal-teaser-link">{home.why_teaser_link}</Link>
          </div>
        </section>

        {/* Stats bar — background image + text reveals on scroll */}
        <section className="section-with-bg" style={{ padding: '4rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.stats})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <div className="defesa-stats reveal-on-scroll" data-reveal-on-scroll style={{ color: '#fff' }}>
              <div className="reveal-stagger-item"><span className="defesa-stat-num" style={{ color: '#fff' }}>{home.stat_years}</span><span className="defesa-stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>{home.stat_years_label}</span></div>
              <div className="reveal-stagger-item"><span className="defesa-stat-num" style={{ color: '#fff' }}>{home.stat_countries}</span><span className="defesa-stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>{home.stat_countries_label}</span></div>
              <div className="reveal-stagger-item"><span className="defesa-stat-num" style={{ color: '#fff' }}>{home.stat_satisfaction}</span><span className="defesa-stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>{home.stat_satisfaction_label}</span></div>
            </div>
          </div>
        </section>

        {/* Our Core Services — background image + content reveals on scroll */}
        <section className="section-with-bg" style={{ padding: '4rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.services})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <div className="reveal-on-scroll" data-reveal-on-scroll>
              <h2 className="defesa-section-title">{home.services_heading}</h2>
              <p className="defesa-section-sub">{home.services_subtitle}</p>
              <div className="defesa-services-grid">
                <div className="defesa-service-card reveal-stagger-item"><h3>{home.service_d2_title}</h3><p>{home.service_d2_desc}</p><Link href="/visa-d2">{home.service_d2_link}</Link></div>
                <div className="defesa-service-card reveal-stagger-item"><h3>{home.service_d7_title}</h3><p>{home.service_d7_desc}</p><Link href="/visa-d7">{home.service_d7_link}</Link></div>
                <div className="defesa-service-card reveal-stagger-item"><h3>{home.service_d8_title}</h3><p>{home.service_d8_desc}</p><Link href="/visa-d8">{home.service_d8_link}</Link></div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Help — background image + content reveals on scroll */}
        <div role="region" aria-label={home.who_heading} className="section-with-bg" style={{ padding: '4rem 0', backgroundImage: 'url(' + SECTION_BG_IMAGES.whoWeHelp + ')' }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <div className="reveal-on-scroll" data-reveal-on-scroll>
              <h2 className="defesa-section-title" style={{ color: '#fff' }}>{home.who_heading}</h2>
              <p className="defesa-section-sub" style={{ color: 'rgba(255,255,255,0.9)' }}>{home.who_subtitle}</p>
              <div className="defesa-who-grid">
                <div className="defesa-who-card reveal-stagger-item" style={WHO_CARD_STYLE}><h3>{home.who_investors_title}</h3><p>{home.who_investors_desc}</p></div>
                <div className="defesa-who-card reveal-stagger-item" style={WHO_CARD_STYLE}><h3>{home.who_nomads_title}</h3><p>{home.who_nomads_desc}</p></div>
                <div className="defesa-who-card reveal-stagger-item" style={WHO_CARD_STYLE}><h3>{home.who_retirees_title}</h3><p>{home.who_retirees_desc}</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us — background image + content reveals on scroll */}
        <section className="section-with-bg" style={{ padding: '4rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.whyChoose})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <div className="reveal-on-scroll" data-reveal-on-scroll>
              <h2 className="defesa-section-title">{home.why_us_heading}</h2>
              <p className="defesa-section-sub">{home.why_us_subtitle}</p>
              <div className="defesa-why-grid">
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>{home.why_us_direct}</strong><span>{home.why_us_direct_desc}</span></div></div>
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>{home.why_us_expert}</strong><span>{home.why_us_expert_desc}</span></div></div>
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>{home.why_us_communication}</strong><span>{home.why_us_communication_desc}</span></div></div>
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>{home.why_us_accountability}</strong><span>{home.why_us_accountability_desc}</span></div></div>
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>{home.why_us_confidentiality}</strong><span>{home.why_us_confidentiality_desc}</span></div></div>
                <div className="defesa-why-item reveal-stagger-item"><span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>✓</span><div><strong>{home.why_us_dashboard}</strong><span>{home.why_us_dashboard_desc}</span></div></div>
              </div>
            </div>
          </div>
        </section>

        {/* Licensed & trusted + What Clients Say — Defesa-style, same as Who We Help / Why Choose Us */}
        <section className="section-with-bg home-section-padding home-trusted-section" style={{ padding: '4rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.licensed})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <h2 className="defesa-section-title" style={{ color: '#fff' }}>{home.licensed_heading}</h2>
            <p className="defesa-section-sub" style={{ color: 'rgba(255,255,255,0.9)' }}>{home.licensed_subtitle}</p>
            <div className="home-trusted-list">
              <div className="home-trusted-item">
                <span className="home-trusted-icon" aria-hidden>✓</span>
                <span>{home.licensed_item1}</span>
              </div>
              <div className="home-trusted-item">
                <span className="home-trusted-icon" aria-hidden>✓</span>
                <span>{home.licensed_item2}</span>
              </div>
              <div className="home-trusted-item">
                <span className="home-trusted-icon" aria-hidden>✓</span>
                <span>{home.licensed_item3}</span>
              </div>
            </div>

            <ReviewsSection />
          </div>
        </section>

        {/* Final CTA — Ready to Start Your Portugal Journey */}
        <section className="section-with-bg home-section-padding final-cta-section" style={{ padding: '5rem 0', backgroundImage: `url(${SECTION_BG_IMAGES.finalCta})` }}>
          <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
            <div className="final-cta-card">
              <h2 className="final-cta-title">{home.final_cta_title}</h2>
              <p className="final-cta-lead">{home.final_cta_lead}</p>
              <div className="hero-cta-group">
                <Link href="/contact" className="hero-cta hero-cta-primary">{home.final_cta_primary}</Link>
                <Link href="/contact" className="hero-cta hero-cta-secondary hero-cta-secondary-dark">{home.final_cta_secondary}</Link>
              </div>
              <p className="final-cta-trust">{home.final_cta_trust}</p>
            </div>
          </div>
        </section>

      {/* Sticky "Check Your Eligibility" bar (follows on scroll) */}
      <div className={`sticky-cta-bar ${stickyCtaVisible ? 'visible' : ''}`}>
        <span style={{ fontSize: '0.95rem' }}>{home.sticky_bar_text}</span>
        <a href="/services">{home.sticky_bar_link}</a>
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
                  <img src="/logo.png" alt={nav.brand} width={70} height={41} style={{ height: 40, width: 'auto' }} />
                  <span className="home-nav-logo-text" style={{ color: 'rgba(255,255,255,0.95)', marginLeft: '0.5rem' }}>{nav.brand}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                  {home.footer_tagline}
                </p>
                <p style={{ margin: 0 }}>
                  <Link href="/contact" style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>{home.footer_contact}</Link>
                </p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600, margin: '0 0 0.75rem 0' }}>{home.footer_services_company}</p>
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
              {replaceYear(home.footer_legal)}
            </p>
          </div>
        </footer>
        </div>
      </div>
    </>
  )
}
