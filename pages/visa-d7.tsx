import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import EditPageFloatingButton from '../components/EditPageFloatingButton'
import AuthNavLinks from '../components/AuthNavLinks'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// D7 page: each section has its own image (retirement, passive income, Portugal lifestyle)
const D7_HERO_IMAGE = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=90'
const D7_PAGE_IMAGES = [
  D7_HERO_IMAGE,
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=90', // 1 Overview – Portugal lifestyle
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=90',   // 2 Income requirements
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=90', // 3 Benefits – family/lifestyle
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=90', // 4 Comparison
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=90', // 5 Requirements
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=90',   // 6 Process
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=90',   // 7 Why us
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1920&q=90', // 8 Who qualifies
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=90', // 9 FAQs
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=90',   // 10 CTA
]

export default function VisaD7() {
  const [navOpen, setNavOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [debugText, setDebugText] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    setDebugText(new URLSearchParams(window.location.search).get('debug') === 'text')
  }, [])

  return (
    <>
      <Head>
        <title>D7 Passive Income Visa Portugal 2026 – Retirement &amp; Residency | WINIT</title>
        <meta name="description" content="Live in Portugal with the D7 Passive Income Visa. For retirees and anyone with stable income from pension, investments, or rentals. Requirements, support, and application." />
        <meta property="og:title" content="D7 Passive Income Visa Portugal 2026 – Retirement &amp; Residency | WINIT" />
        <meta property="og:description" content="D7 visa for stable recurring income from outside Portugal. Pension, investments, rentals." />
        <meta property="og:type" content="website" />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/visa-d7`} />}
        {BASE_URL && <meta property="og:url" content={`${BASE_URL}/visa-d7`} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className={`home-nav-spacer visa-d2-page visa-d7-page${debugText ? ' visa-debug-text' : ''}`} style={{ minHeight: '100vh' }}>
        {debugText && <div className="visa-debug-banner" aria-hidden>DEBUG: Text &amp; style — outlines show text boundaries; remove ?debug=text from URL to exit</div>}
        <EditPageFloatingButton relativePath="pages/visa-d7.tsx" />
        <nav className={`home-nav defesa-nav ${navOpen ? 'nav-open' : ''}`}>
          <div className="home-nav-inner">
            <Link href="/" className="home-nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <img src="/logo.png" alt="" width={70} height={41} style={{ display: 'block', height: 36, width: 'auto' }} />
              <span className="home-nav-logo-text">WINIT</span>
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
          {/* 1. Hero */}
          <section className="section-with-bg" style={{ padding: '5.5rem 0', backgroundImage: `url(${D7_HERO_IMAGE})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <span className="d2-section-label d2-section-label-light">D7 Passive Income Visa</span>
              <h1 className="d2-hero-title">
                D7 Passive Income Visa Portugal 2026 – Residency for Retirees &amp; Passive Income
              </h1>
              <p className="d2-hero-sub" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                For non-EU citizens with stable recurring income from outside Portugal—pension, investments, rentals, or royalties. Live in Portugal with full residency rights, access to healthcare, and a path to citizenship.
              </p>
            </div>
          </section>

          {/* 2. Overview */}
          <section className="d2-overview-section section-with-bg visa-section-center-header" id="overview" style={{ backgroundImage: `url(${D7_PAGE_IMAGES[1]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Overview</span>
              <h2 className="d2-heading d2-heading-light">What is the D7 Passive Income Visa?</h2>
              <p className="d2-body d2-body-light" style={{ marginBottom: '1rem' }}>
                The <strong style={{ color: 'rgba(255,255,255,0.98)' }}>D7 visa</strong> (Passive Income / Retirement Visa) allows non-EU citizens to obtain Portuguese residency by proving stable, regular income from outside Portugal. You do not need to work or run a business in Portugal—your income can come from pension, dividends, interest, rental income, royalties, or other passive sources.
              </p>
              <p className="d2-body d2-body-light" style={{ marginBottom: 0 }}>
                <strong style={{ color: 'rgba(255,255,255,0.98)' }}>Ideal for:</strong> Retirees with a pension, investors with dividends or interest, landlords with rental income, and anyone with royalty or intellectual property income who wants to live in Portugal.
              </p>
            </div>
          </section>

          {/* 3. Income Requirements */}
          <section id="income" className="section-with-bg d2-investment-section visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D7_PAGE_IMAGES[2]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Income</span>
              <h2 className="d2-heading d2-heading-light">D7 Visa Income &amp; Financial Requirements</h2>
              <div className="d2-key-advantage">
                <strong className="d2-key-advantage-label">Key point</strong>
                <p className="d2-body" style={{ margin: 0 }}>
                  You must prove stable, regular income that meets the Portuguese minimum. Authorities recommend having 12 months of funds available in a Portuguese bank account.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div className="d2-investment-item">
                  <span className="d2-investment-icon" aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8M8 14h8"/></svg>
                  </span>
                  <div>
                    <h3>Main Applicant</h3>
                    <p className="d2-body" style={{ margin: 0 }}>€11,040 per year (€920 per month). Proof of pension, investments, rentals, or other passive income.</p>
                  </div>
                </div>
                <div className="d2-investment-item">
                  <span className="d2-investment-icon" aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </span>
                  <div>
                    <h3>Spouse or Parent</h3>
                    <p className="d2-body" style={{ margin: 0 }}>+50% of the minimum (€460 per month) for each dependent spouse or parent included in the application.</p>
                  </div>
                </div>
                <div className="d2-investment-item">
                  <span className="d2-investment-icon" aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                  </span>
                  <div>
                    <h3>Dependent Child</h3>
                    <p className="d2-body" style={{ margin: 0 }}>+30% per child (€276 per month). Proof of income must cover all family members included in the application.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Benefits */}
          <section id="benefits" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D7_PAGE_IMAGES[3]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Why D7</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1.25rem' }}>Main Benefits of the D7 Passive Income Visa</h2>
              <ul className="d2-body-light" style={{ lineHeight: 2, paddingLeft: '1.35rem', maxWidth: '640px', fontSize: '1.05rem' }}>
                <li><strong style={{ color: '#fff' }}>No Active Work Required</strong> – Live on your pension, investments, or rental income without running a business.</li>
                <li><strong style={{ color: '#fff' }}>Initial 2-Year Permit</strong> – Then renew for 3 years. Path to permanent residence and citizenship after 5 years.</li>
                <li><strong style={{ color: '#fff' }}>Work Rights</strong> – After your residence permit is issued, you may work in Portugal if you wish.</li>
                <li><strong style={{ color: '#fff' }}>Family Inclusion</strong> – Include spouse, dependent children, and dependent parents in your application.</li>
                <li><strong style={{ color: '#fff' }}>Schengen Mobility</strong> – Travel freely across the Schengen area.</li>
                <li><strong style={{ color: '#fff' }}>Healthcare &amp; Education</strong> – Access to public healthcare and education for you and your family.</li>
              </ul>
            </div>
          </section>

          {/* 5. D7 vs D8 */}
          <section id="comparison" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D7_PAGE_IMAGES[4]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Comparison</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1.25rem' }}>D7 Passive Income vs D8 Digital Nomad</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="d2-card">
                  <h3>D7 Passive Income</h3>
                  <ul className="d2-body" style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.9 }}>
                    <li>✓ Lower income threshold (~€920/month)</li>
                    <li>✓ Pension, investments, rentals, royalties</li>
                    <li>✓ No need to work or run a business</li>
                    <li>✓ Ideal for retirees and passive investors</li>
                    <li>✓ Path to citizenship after 5 years</li>
                  </ul>
                </div>
                <div className="d2-card" style={{ borderLeftColor: 'var(--text-muted)' }}>
                  <h3 style={{ color: 'var(--text)' }}>D8 Digital Nomad</h3>
                  <ul className="d2-body" style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.9 }}>
                    <li>! Higher income (~€3,680/month)</li>
                    <li>! Must prove remote work for foreign employer/clients</li>
                    <li>✓ Work remotely while living in Portugal</li>
                    <li>✓ Ideal for remote employees and freelancers</li>
                    <li>✓ Path to citizenship after 5 years</li>
                  </ul>
                </div>
              </div>
              <p className="d2-body d2-body-light" style={{ margin: 0 }}>
                <strong style={{ color: '#fff' }}>Bottom line:</strong> Choose D7 if your income is passive (pension, investments, rentals). Choose D8 if you work remotely for a foreign employer or clients.
              </p>
            </div>
          </section>

          {/* 6. Eligibility */}
          <section id="eligibility" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D7_PAGE_IMAGES[5]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Requirements</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1rem' }}>D7 Visa Eligibility &amp; Documentation</h2>
              <p className="d2-body-light" style={{ marginBottom: '1.5rem', maxWidth: '640px', fontSize: '1.05rem' }}>
                In addition to meeting the income threshold, you must provide the following to support your D7 application.
              </p>
              <ul className="d2-body-light" style={{ lineHeight: 2, paddingLeft: '1.35rem', fontSize: '1.05rem' }}>
                <li><strong style={{ color: '#fff' }}>Proof of Passive Income</strong> – Pension statements, investment returns, rental contracts, or other evidence of stable recurring income.</li>
                <li><strong style={{ color: '#fff' }}>Long-Term Accommodation</strong> – 12-month lease or property deed in Portugal.</li>
                <li><strong style={{ color: '#fff' }}>Portuguese Tax ID (NIF)</strong> – Obtained before or during the application process.</li>
                <li><strong style={{ color: '#fff' }}>Clean Criminal Record</strong> – Certificate from your country of residence (apostilled and translated if required).</li>
                <li><strong style={{ color: '#fff' }}>Health Insurance</strong> – Valid coverage for Portugal for the initial period.</li>
              </ul>
            </div>
          </section>

          {/* 7. Process */}
          <section id="process" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D7_PAGE_IMAGES[6]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">How it works</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1.25rem' }}>Step-by-Step D7 Visa Process</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { step: 1, title: 'Eligibility Assessment', text: 'We review your income sources, family size, and documents to confirm you meet the D7 requirements and identify any gaps.' },
                  { step: 2, title: 'NIF &amp; Bank Account', text: 'We assist with obtaining your Portuguese tax ID (NIF) and opening a Portuguese bank account. Authorities recommend 12 months of funds in Portugal.' },
                  { step: 3, title: 'Accommodation', text: 'We support you in securing long-term accommodation (lease or property) that meets consular requirements.' },
                  { step: 4, title: 'Visa Application', text: 'We prepare and organise all documentation and guide you through the consular application in your country of residence.' },
                  { step: 5, title: 'Approval &amp; Residence Permit', text: 'After visa approval, you enter Portugal and apply for your residence permit. We assist with AIMA appointments and settling in.' },
                ].map(({ step, title, text }) => (
                  <div key={step} className="d2-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <span className="d2-step-num">{step}</span>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--text)' }}>{title}</h3>
                      <p className="d2-body" style={{ margin: 0 }}>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 8. Why Us */}
          <section id="why-us" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D7_PAGE_IMAGES[7]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Our support</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1rem' }}>How We Help D7 Applicants</h2>
              <p className="d2-body-light" style={{ marginBottom: '1.5rem', maxWidth: '640px', fontSize: '1.05rem' }}>
                We provide end-to-end support for passive income and retirement applicants moving to Portugal.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {['NIF Issuance – We guide you through obtaining your Portuguese tax ID quickly and correctly.', 'Bank Account Opening – Support for opening a Portuguese bank account in person or remotely.', 'Lease or Property Support – Help finding and securing long-term accommodation that meets visa requirements.', 'Full Application Support – We prepare your D7 application, coordinate documents, and support you through the consulate and AIMA.'].map((item, i) => (
                  <div key={i} className="d2-why-card">
                    <p className="d2-body" style={{ margin: 0, color: 'var(--text)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 9. Who Qualifies */}
          <section id="who" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D7_PAGE_IMAGES[8]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Who can apply</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '0.5rem' }}>Who Can Apply for the D7 Visa?</h2>
              <p className="d2-body d2-body-light" style={{ marginBottom: '1.5rem' }}>The D7 is designed for anyone with stable income from outside Portugal. Common profiles:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                <div className="d2-card">
                  <h3>Retirees</h3>
                  <p className="d2-body" style={{ margin: 0 }}>Pension income from your home country. One of the most common D7 profiles.</p>
                </div>
                <div className="d2-card">
                  <h3>Investors</h3>
                  <p className="d2-body" style={{ margin: 0 }}>Dividends, interest, or investment returns that meet the minimum threshold.</p>
                </div>
                <div className="d2-card">
                  <h3>Landlords</h3>
                  <p className="d2-body" style={{ margin: 0 }}>Rental income from properties abroad. Proof of consistent rental income is required.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 10. FAQs */}
          <section id="faqs" className="section-with-bg" style={{ padding: '4.5rem 0', backgroundImage: `url(${D7_PAGE_IMAGES[9]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <div className="visa-faq-section">
                <div className="visa-faq-header">
                  <span className="d2-section-label d2-section-label-light">Common questions</span>
                  <h2 className="d2-heading d2-heading-light" style={{ marginBottom: 0 }}>D7 Passive Income Visa FAQs (2026)</h2>
                </div>
                <div className="visa-faq-list">
                  {[
                    { q: 'What income counts for the D7 visa?', a: 'Pension, dividends, interest, rental income, royalties, and other regular passive income from outside Portugal. The income must be stable and provable through official documents.' },
                    { q: 'Do I need to have a job in Portugal?', a: 'No. The D7 is for passive income. You do not need to work or run a business in Portugal. After you receive your residence permit, you may work if you wish.' },
                    { q: 'How much do I need in the bank?', a: 'Authorities recommend having 12 months of funds (at the required income level) in a Portuguese bank account. We help you open the account and plan the transfer.' },
                    { q: 'Can I include my family?', a: 'Yes. You can include your spouse, dependent children (generally under 18, or up to 26 if students), and dependent parents. Each has an income add-on (50% for spouse/parent, 30% per child).' },
                    { q: 'How long does D7 processing take?', a: 'Visa processing typically takes 60–90 days after submission. Allow additional time for NIF, bank account, and document preparation—often 4–6 months in total.' },
                    { q: 'Can I get citizenship through the D7 visa?', a: 'Yes. After 5 years of legal residence in Portugal, you can apply for Portuguese citizenship. You must meet language and ties requirements (e.g. A2 Portuguese).' },
                  ].map((faq, i) => (
                    <div key={i} className="visa-faq-item">
                      <button
                        type="button"
                        className="visa-faq-question"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        <span>{faq.q}</span>
                        <span className="visa-faq-icon" aria-hidden>{openFaq === i ? '−' : '+'}</span>
                      </button>
                      {openFaq === i && (
                        <div className="visa-faq-answer">{faq.a}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 11. CTA */}
          <section id="cta" className="section-with-bg d2-cta-section" style={{ padding: '5.5rem 0', backgroundImage: `url(${D7_PAGE_IMAGES[10]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in style={{ textAlign: 'center' }}>
              <span className="d2-section-label d2-section-label-light">Get started</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1rem' }}>Ready to Apply for the D7 Visa?</h2>
              <p className="d2-body-light" style={{ marginBottom: '1.75rem', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
                Contact us for a free D7 eligibility assessment. We&apos;ll review your income, explain the requirements, and create a roadmap to Portuguese residency.
              </p>
              <p style={{ margin: 0 }}>
                <Link href="/contact" className="d2-cta-primary" style={{ marginRight: '0.75rem' }}>Free D7 Assessment</Link>
                <Link href="/contact" className="d2-cta-secondary">Contact Us</Link>
              </p>
              <p style={{ marginTop: '1.75rem' }}>
                <Link href="/services" style={{ color: 'rgba(255,255,255,0.95)', textDecoration: 'underline', fontWeight: 600 }}>← All services</Link>
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
