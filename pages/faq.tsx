import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'
import AuthNavLinks from '../components/AuthNavLinks'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const FAQ_BG_IMAGE = 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1920&q=80'
const FAQ_ITEMS = [
  { q: 'Is this service legitimate and secure?', a: 'Yes. We work with licensed immigration lawyers, CPA accountants, and qualified realtors. We work under a formal contract with clearly defined terms and payment conditions. We use bank-level encryption for your documents, and your data is never shared with third parties except as required for your application.' },
  { q: 'How long does the visa process take?', a: 'Typically 60–90 days from document submission to consulate decision. We help you prepare everything correctly the first time to avoid delays.' },
  { q: 'What if I\'m not sure which visa I need?', a: 'Use our "Which visa is for you?" tool on the homepage, or sign up and our team will recommend the best option based on your situation.' },
  { q: 'Can I bring my family?', a: 'Yes. D2, D7, and D8 programs support family reunification. We guide you through requirements for spouses and dependents.' },
  { q: 'When do I pay?', a: 'After you sign up and log in, you’ll be directed to our contact page (or WhatsApp). The owner will discuss your situation and agree on a package and payment with you there. No payment is required to create an account.' },
]

export default function FAQ() {
  const [navOpen, setNavOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <>
      <Head>
        <title>FAQ — WinIT Portugal Immigration</title>
        <meta name="description" content="Frequently asked questions about WinIT Portugal immigration support, D2, D7, and D8 visas." />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/faq`} />}
        <meta property="og:title" content="FAQ — WinIT Portugal Immigration" />
        <meta property="og:description" content="Frequently asked questions about WinIT Portugal immigration support, D2, D7, and D8 visas." />
        <meta property="og:type" content="website" />
        {BASE_URL && <meta property="og:url" content={`${BASE_URL}/faq`} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <meta name="twitter:title" content="FAQ — WinIT Portugal Immigration" />
        <meta name="twitter:description" content="Frequently asked questions about WinIT Portugal immigration support, D2, D7, and D8 visas." />
        {BASE_URL && <meta name="twitter:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
        <nav className={`home-nav ${navOpen ? 'nav-open' : ''}`}>
          <div className="home-nav-inner" style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <Link href="/" className="home-nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <img src="/logo.png" alt="" width={70} height={41} style={{ display: 'block', height: 36, width: 'auto' }} />
              <span className="home-nav-logo-text">WinIT</span>
            </Link>
            <button type="button" className="home-nav-hamburger" onClick={() => setNavOpen((o) => !o)} aria-expanded={navOpen} aria-label={navOpen ? 'Close menu' : 'Open menu'}>
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
            <div className="home-nav-links">
              <Link href="/why-portugal" onClick={() => setNavOpen(false)} className="no-underline font-medium">Why Portugal</Link>
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={() => setServicesOpen((o) => !o)} className="home-nav-link-btn no-underline font-medium">Services ▾</button>
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
              <AuthNavLinks onNavigate={() => { setServicesOpen(false); setNavOpen(false); }} linkClass="no-underline font-medium" signupClass="home-nav-signup no-underline" />
            </div>
          </div>
        </nav>

        <main>
          <section className="section-with-bg home-section-padding" style={{ padding: '4rem 0', backgroundImage: `url(${FAQ_BG_IMAGE})` }}>
            <div className="section-with-bg-inner home-container home-section-center fade-in-on-scroll" data-fade-in style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div className="faq-content-box">
              <h1 className="section-heading section-heading-no-underline section-heading-center" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2rem)', marginBottom: '1.5rem' }}>
                Frequently asked questions
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
