import Link from 'next/link'
import Head from 'next/head'
import SiteNav from '../components/SiteNav'
import { getSiteCopy } from '../lib/getSiteCopy'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const HOW_WE_WORK_BG = 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80'

const copy = getSiteCopy()
const h = copy.how_we_work

const STEPS = [
  { num: 1, title: h.step1_title, titleLink: '/services', desc: h.step1_desc, pillText: h.step1_link, pillHref: '/services' },
  { num: 2, title: h.step2_title, titleLink: '/auth/signup', desc: h.step2_desc, pillText: h.step2_link, pillHref: '/auth/signup' },
  { num: 3, title: h.step3_title, titleLink: '/faq', desc: h.step3_desc, pillText: h.step3_link, pillHref: '/faq' },
  { num: 4, done: true, title: h.step4_title, desc: h.step4_desc },
]

const BENEFITS = [
  { icon: 'shield' as const, label: h.benefit1_label, text: h.benefit1_text },
  { icon: 'clock' as const, label: h.benefit2_label, text: h.benefit2_text },
  { icon: 'user' as const, label: h.benefit3_label, text: h.benefit3_text },
]

export default function HowWeWork() {
  return (
    <>
      <Head>
        <title>{h.meta_title}</title>
        <meta name="description" content={h.hero_subtitle} />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/how-we-work`} />}
        <meta property="og:title" content={h.meta_title} />
        <meta property="og:description" content={h.hero_subtitle} />
        <meta property="og:type" content="website" />
        {BASE_URL && <meta property="og:url" content={`${BASE_URL}/how-we-work`} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer how-we-work-page" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
        <SiteNav />

        <main>
          <section className="how-hero section-with-bg how-hero-bg" style={{ backgroundImage: `url(${HOW_WE_WORK_BG})` }}>
            <div className="section-with-bg-inner home-container how-hero-inner" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
              <p className="how-hero-eyebrow">{h.hero_eyebrow}</p>
              <h1 className="how-hero-title">{h.hero_title}</h1>
              <p className="how-hero-sub">{h.hero_subtitle}</p>
              <p className="how-hero-tagline">{h.hero_tagline}</p>
              <div className="how-hero-dots" aria-hidden />
            </div>
          </section>

          <section className="how-bridge">
            <div className="how-bridge-inner">
              <span className="how-bridge-icon" aria-hidden>✓</span>
              <p className="how-bridge-text">{h.bridge_text}</p>
            </div>
          </section>

          <section className="how-steps-section how-steps-section-bg">
            <div className="home-container" style={{ maxWidth: '780px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
              <h2 className="how-steps-heading">{h.steps_heading}</h2>
              <p className="how-steps-sub">{h.steps_subtitle}</p>
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

          <section className="how-benefits-section">
            <div className="home-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
              <h2 className="how-benefits-heading">{h.benefits_heading}</h2>
              <p className="how-benefits-intro">{h.benefits_intro}</p>
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

          <section className="how-cta-section">
            <div className="home-container" style={{ maxWidth: '520px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
              <h2 className="how-cta-title">{h.cta_heading}</h2>
              <p className="how-cta-lead">{h.cta_lead}</p>
              <div className="how-cta-buttons">
                <Link href="/contact" className="hero-cta hero-cta-primary">{h.cta_primary}</Link>
                <Link href="/auth/signup" className="hero-cta hero-cta-secondary hero-cta-secondary-dark">{h.cta_secondary}</Link>
              </div>
            </div>
          </section>

          <footer className="how-we-work-footer">
            <Link href="/" className="how-we-work-back">{h.back_link}</Link>
          </footer>
        </main>
      </div>
    </>
  )
}
