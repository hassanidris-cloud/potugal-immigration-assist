import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

const FAQ_ITEMS = [
  { q: 'Is this service legitimate and secure?', a: 'Yes. We work with licensed immigration lawyers, CPA accountants, and qualified realtors. We work under a formal contract with clearly defined terms and payment conditions. We use bank-level encryption for your documents, and your data is never shared with third parties except as required for your application.' },
  { q: 'How long does the visa process take?', a: 'Typically 60–90 days from document submission to consulate decision. We help you prepare everything correctly the first time to avoid delays.' },
  { q: 'What if I\'m not sure which visa I need?', a: 'Use our "Which visa is for you?" tool on the homepage, or sign up and our team will recommend the best option based on your situation.' },
  { q: 'Can I bring my family?', a: 'Yes. D2, D7, and D8 programs support family reunification. We guide you through requirements for spouses and dependents.' },
  { q: 'When do I pay?', a: 'After you sign up and log in, you’ll be directed to our contact page (or WhatsApp). The owner will discuss your situation and agree on a package and payment with you there. No payment is required to create an account.' },
]

export default function FAQ() {
  const [navOpen, setNavOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <>
      <Head>
        <title>FAQ — WINIT Portugal Immigration</title>
        <meta name="description" content="Frequently asked questions about WINIT Portugal immigration support, D2, D7, and D8 visas." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <div className="home-nav-spacer" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
        <nav className={`home-nav ${navOpen ? 'nav-open' : ''}`}>
          <div className="home-nav-inner" style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <Link href="/" className="home-nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <img src="/logo.png" alt="WINIT" width={70} height={41} style={{ display: 'block', height: 36, width: 'auto' }} />
            </Link>
            <button type="button" className="home-nav-hamburger" onClick={() => setNavOpen((o) => !o)} aria-expanded={navOpen} aria-label={navOpen ? 'Close menu' : 'Open menu'}>
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
            <div className="home-nav-links">
              <Link href="/why-portugal" onClick={() => setNavOpen(false)} className="no-underline font-medium">Why Portugal</Link>
              <Link href="/visa-programs" onClick={() => setNavOpen(false)} className="no-underline font-medium">Visa Programs</Link>
              <Link href="/faq" onClick={() => setNavOpen(false)} className="no-underline font-medium">FAQ</Link>
              <Link href="/contact" onClick={() => setNavOpen(false)} className="no-underline font-medium">Contact</Link>
              <Link href="/auth/login" onClick={() => setNavOpen(false)} className="no-underline font-semibold">Login</Link>
              <Link href="/auth/signup" className="home-nav-signup no-underline" onClick={() => setNavOpen(false)}>Sign Up</Link>
            </div>
          </div>
        </nav>

        <main>
          <section className="home-section-padding section-bg-gradient" style={{ padding: '4rem 0' }}>
            <div className="home-container home-section-center" style={{ maxWidth: '720px', margin: '0 auto' }}>
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
          </section>
        </main>
      </div>
    </>
  )
}
