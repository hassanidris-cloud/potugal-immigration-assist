import Link from 'next/link'
import Head from 'next/head'
import SiteNav from '../components/SiteNav'
import { getSiteCopy } from '../lib/getSiteCopy'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const SERVICES_HERO_BG = 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1920&q=80'
const SERVICES_SECTION_BG = 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1920&q=80'

const copy = getSiteCopy()
const s = copy.services

const IMMIGRATION_SERVICES = [
  { slug: 'd2', href: '/visa-d2', title: s.d2_title, description: s.d2_desc, popular: false },
  { slug: 'd7', href: '/visa-d7', title: s.d7_title, description: s.d7_desc, popular: true },
  { slug: 'd8', href: '/visa-d8', title: s.d8_title, description: s.d8_desc, popular: true },
]

export default function Services() {
  return (
    <>
      <Head>
        <title>{s.meta_title}</title>
        <meta name="description" content={s.hero_subtitle} />
        <meta property="og:title" content={s.meta_title} />
        <meta property="og:description" content={s.hero_subtitle} />
        <meta property="og:type" content="website" />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/services`} />}
        {BASE_URL && <meta property="og:url" content={`${BASE_URL}/services`} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <meta name="twitter:title" content={s.meta_title} />
        <meta name="twitter:description" content={s.hero_subtitle} />
        {BASE_URL && <meta name="twitter:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
        <SiteNav />

        <main>
          <section className="section-with-bg services-hero" style={{ padding: '5rem 0', backgroundImage: `url(${SERVICES_HERO_BG})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
              <h1 className="section-heading section-heading-no-underline" style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 2.75rem)', marginBottom: '1rem' }}>
                {s.hero_heading}
              </h1>
              <p className="defesa-section-sub" style={{ color: 'rgba(255,255,255,0.92)', fontSize: '1.15rem', lineHeight: 1.6, margin: 0 }}>
                {s.hero_subtitle}
              </p>
            </div>
          </section>

          <section className="section-with-bg home-section-padding services-section" style={{ padding: '4rem 0', backgroundImage: `url(${SERVICES_SECTION_BG})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <h2 className="defesa-section-title" style={{ marginBottom: '0.5rem' }}>{s.section_heading}</h2>
              <p className="defesa-section-sub" style={{ marginBottom: '2.5rem' }}>
                {s.section_subtitle}
              </p>

              <div className="services-grid">
                {IMMIGRATION_SERVICES.map((svc) => (
                  <div key={svc.slug} className="service-card">
                    {svc.popular && <span className="service-card-badge">{s.badge_popular}</span>}
                    <h3 className="service-card-title">{svc.title}</h3>
                    <p className="service-card-desc">{svc.description}</p>
                    <Link href={svc.href} className="service-card-link">
                      {s.link_learn_more}
                    </Link>
                  </div>
                ))}
              </div>

              <p className="services-helper">
                {s.helper_text} <Link href="/contact" className="services-helper-link">{s.helper_link}</Link> {s.helper_suffix}
              </p>
            </div>
          </section>

          <section className="section-with-bg home-section-padding" style={{ padding: '4rem 0', backgroundImage: `url(${SERVICES_HERO_BG})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
              <h2 className="section-heading section-heading-no-underline section-heading-center" style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3.5vw, 1.85rem)', marginBottom: '1rem' }}>
                {s.cta_heading}
              </h2>
              <p className="defesa-section-sub" style={{ color: 'rgba(255,255,255,0.92)', marginBottom: '1.5rem' }}>
                {s.cta_subtitle}
              </p>
              <div className="services-cta-group">
                <Link href="/contact" className="hero-cta hero-cta-primary">{s.cta_primary}</Link>
                <Link href="/faq" className="hero-cta hero-cta-secondary hero-cta-secondary-dark">{s.cta_secondary}</Link>
              </div>
            </div>
          </section>

          <p style={{ textAlign: 'center', padding: '2rem 0', margin: 0 }}>
            <Link href="/" className="text-primary font-semibold">{s.back_link}</Link>
          </p>
        </main>
      </div>
    </>
  )
}
