import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'
import SiteNav from '../components/SiteNav'
import { getSiteCopy } from '../lib/getSiteCopy'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const FAQ_BG_IMAGE = 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1920&q=80'
const copy = getSiteCopy()
const faqCopy = copy.faq
const FAQ_ITEMS = [
  { q: faqCopy.q1, a: faqCopy.a1 },
  { q: faqCopy.q2, a: faqCopy.a2 },
  { q: faqCopy.q3, a: faqCopy.a3 },
  { q: faqCopy.q4, a: faqCopy.a4 },
  { q: faqCopy.q5, a: faqCopy.a5 },
]

export default function FAQ() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <>
      <Head>
        <title>{faqCopy.meta_title}</title>
        <meta name="description" content={faqCopy.meta_title} />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/faq`} />}
        <meta property="og:title" content={faqCopy.meta_title} />
        <meta property="og:description" content={faqCopy.meta_title} />
        <meta property="og:type" content="website" />
        {BASE_URL && <meta property="og:url" content={`${BASE_URL}/faq`} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <meta name="twitter:title" content={faqCopy.meta_title} />
        <meta name="twitter:description" content={faqCopy.meta_title} />
        {BASE_URL && <meta name="twitter:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
        <SiteNav />

        <main>
          <section className="section-with-bg home-section-padding" style={{ padding: '4rem 0', backgroundImage: `url(${FAQ_BG_IMAGE})` }}>
            <div className="section-with-bg-inner home-container home-section-center fade-in-on-scroll" data-fade-in style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div className="faq-content-box">
              <h1 className="section-heading section-heading-no-underline section-heading-center" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2rem)', marginBottom: '1.5rem' }}>
                {faqCopy.heading}
              </h1>
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
              <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link href="/" className="text-primary font-semibold">{faqCopy.back_link}</Link>
              </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
