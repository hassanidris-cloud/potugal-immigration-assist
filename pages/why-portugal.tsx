import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import SiteNav from '../components/SiteNav'
import { getSiteCopy } from '../lib/getSiteCopy'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const copy = getSiteCopy()
const wp = copy.why_portugal

export default function WhyPortugal() {
  return (
    <>
      <Head>
        <title>{wp.meta_title}</title>
        <meta name="description" content={wp.subtitle} />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/why-portugal`} />}
        <meta property="og:title" content={wp.meta_title} />
        <meta property="og:description" content={wp.subtitle} />
        <meta property="og:type" content="website" />
        {BASE_URL && <meta property="og:url" content={`${BASE_URL}/why-portugal`} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
        <SiteNav />

        <main>
          <section className="home-section why-portugal home-section-padding" style={{ padding: '4rem 0' }}>
            <div className="home-container fade-in-on-scroll" data-fade-in>
              <h1 className="section-heading" style={{ textAlign: 'center', fontSize: 'clamp(1.9rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>{wp.heading}</h1>
              <p className="section-heading-sub" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                {wp.subtitle}
              </p>

              <div className="why-portugal-blocks">
                <div className="why-portugal-block">
                  <div className="why-portugal-block-image" style={{ backgroundImage: 'url(/images/nick-karvounis-7xiADv3VZ0k-unsplash.jpg)' }} />
                  <div className="why-portugal-block-content">
                    <span className="why-portugal-block-label">{wp.lifestyle_label}</span>
                    <h2 className="text-text" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{wp.lifestyle_title}</h2>
                    <p className="text-text-muted" style={{ lineHeight: 1.7, margin: 0 }}>{wp.lifestyle_body}</p>
                  </div>
                </div>

                <div className="why-portugal-block why-portugal-block-reverse">
                  <div className="why-portugal-block-image" style={{ backgroundImage: 'url(/images/nick-karvounis-Prb-sjOUBFs-unsplash.jpg)' }} />
                  <div className="why-portugal-block-content">
                    <span className="why-portugal-block-label">{wp.safety_label}</span>
                    <h2 className="text-text" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{wp.safety_title}</h2>
                    <p className="text-text-muted" style={{ lineHeight: 1.7, margin: 0 }}>{wp.safety_body}</p>
                  </div>
                </div>

                <div className="why-portugal-block">
                  <div className="why-portugal-block-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80)' }} />
                  <div className="why-portugal-block-content">
                    <span className="why-portugal-block-label">{wp.digital_label}</span>
                    <h2 className="text-text" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{wp.digital_title}</h2>
                    <p className="text-text-muted" style={{ lineHeight: 1.7, margin: 0 }}>{wp.digital_body}</p>
                  </div>
                </div>

                <div className="why-portugal-block why-portugal-block-reverse">
                  <div className="why-portugal-block-image">
                    <Image
                      src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
                      alt="Portugal lifestyle"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="why-portugal-block-content">
                    <span className="why-portugal-block-label">{wp.value_label}</span>
                    <h2 className="text-text" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{wp.value_title}</h2>
                    <p className="text-text-muted" style={{ lineHeight: 1.7, margin: 0 }}>{wp.value_body}</p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link
                  href="/contact"
                  style={{
                    display: 'inline-block',
                    padding: '0.875rem 2rem',
                    background: '#1e293b',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '0.9375rem',
                  }}
                >
                  {wp.cta_button}
                </Link>
                <p style={{ marginTop: '1.5rem' }}>
                  <Link href="/" className="text-primary font-semibold">{wp.back_link}</Link>
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
