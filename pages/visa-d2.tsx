import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// D2 page: each section has its own unique image; investment uses public/images
const D2_HERO_IMAGE = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=90'
const D2_PAGE_IMAGES = [
  D2_HERO_IMAGE,                                                               // 0
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=90', // 1 Overview
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=90', // 2 (unused; investment uses local)
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=90', // 3 Benefits
  'https://images.unsplash.com/photo-1504314285-879b4d3f0f7a?w=1920&q=90',   // 4 Comparison
  'https://images.unsplash.com/photo-1565138652-5c2c64dd2b0a?w=1920&q=90',   // 5 Eligibility
  'https://images.unsplash.com/photo-1570654921-5a8b639f4b2c?w=1920&q=90',   // 6 Process
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=90',   // 7 Why us
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=90', // 8 Business types
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=90', // 9 FAQs
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=90',   // 10 CTA
]

export default function VisaD2() {
  const [navOpen, setNavOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <Head>
        <title>D2 Entrepreneur Visa Portugal 2026 – Business Residency | WINIT</title>
        <meta name="description" content="Launch your business in Portugal and secure residency with the D2 Entrepreneur Visa. No minimum investment. Business plan, company registration, full support." />
        <meta property="og:title" content="D2 Entrepreneur Visa Portugal 2026 – Business Residency | WINIT" />
        <meta property="og:description" content="D2 visa for entrepreneurs: establish a company in Portugal and obtain residency for you and your family." />
        <meta property="og:type" content="website" />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/visa-d2`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="home-nav-spacer visa-d2-page" style={{ minHeight: '100vh' }}>
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
                <button type="button" onClick={() => setServicesOpen((o) => !o)} className="no-underline font-medium" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Services ▾</button>
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
              <Link href="/auth/signup" onClick={() => setNavOpen(false)} className="home-nav-signup no-underline">Sign Up</Link>
            </div>
          </div>
        </nav>

        <main>
          {/* 1. Hero – Braga / Northern Portugal */}
          <section className="section-with-bg" style={{ padding: '5.5rem 0', backgroundImage: `url(${D2_HERO_IMAGE})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <span className="d2-section-label d2-section-label-light">D2 Entrepreneur Visa</span>
              <h1 className="d2-hero-title">
                D2 Entrepreneur Visa Portugal 2026 – Business Residency for Founders
              </h1>
              <p className="d2-hero-sub" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                Launch your business in Portugal and secure residency for yourself and your family. The D2 visa is designed for entrepreneurs, business founders, and investors who want to establish a company in one of Europe&apos;s most business-friendly environments.
              </p>
            </div>
          </section>

          {/* 2. Overview – background image + same overlay as other sections */}
          <section className="d2-overview-section section-with-bg" id="overview" style={{ backgroundImage: `url(${D2_PAGE_IMAGES[1]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Overview</span>
              <h2 className="d2-heading d2-heading-light">What is the D2 Entrepreneur Visa?</h2>
              <p className="d2-body d2-body-light" style={{ marginBottom: '1rem' }}>
                The <strong style={{ color: 'rgba(255,255,255,0.98)' }}>D2 visa</strong> (Entrepreneur Visa or Business Visa) allows non-EU citizens to obtain Portuguese residency by establishing and operating a business in Portugal. Unlike the Golden Visa, it does not require a minimum investment amount—instead, you must demonstrate a viable business plan and sufficient capital to execute it.
              </p>
              <p className="d2-body d2-body-light" style={{ marginBottom: 0 }}>
                <strong style={{ color: 'rgba(255,255,255,0.98)' }}>Ideal for:</strong> Startup founders, small business owners, consultants opening a Portuguese branch, investors in Portuguese companies, and anyone who wants to run an active business while living in Portugal.
              </p>
            </div>
          </section>

          {/* 3. Capital Requirements / Investment – background image, same overlay */}
          <section className="section-with-bg d2-investment-section" style={{ padding: '4.5rem 0', backgroundImage: 'url(/images/investment-braga.png.jpg)' }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Investment</span>
              <h2 className="d2-heading d2-heading-light">D2 Visa Investment &amp; Capital Requirements</h2>
              <div className="d2-key-advantage">
                <strong className="d2-key-advantage-label">Key advantage</strong>
                <p className="d2-body" style={{ margin: 0 }}>
                  The D2 visa is accessible to entrepreneurs at various stages—from bootstrapped startups to established business owners expanding to Europe. The focus is on your business concept and execution ability, not on hitting a specific investment threshold.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div className="d2-investment-item">
                  <span className="d2-investment-icon" aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8M8 14h8"/></svg>
                  </span>
                  <div>
                    <h3>No Fixed Minimum Investment</h3>
                    <p className="d2-body" style={{ margin: 0 }}>Unlike the Golden Visa, there&apos;s no set amount. You need sufficient capital to establish and operate your specific business—typically €5,000–€50,000+.</p>
                  </div>
                </div>
                <div className="d2-investment-item">
                  <span className="d2-investment-icon" aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M12 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
                  </span>
                  <div>
                    <h3>Proof of Personal Funds</h3>
                    <p className="d2-body" style={{ margin: 0 }}>Evidence you can support yourself and family in Portugal while your business becomes profitable (bank statements, savings).</p>
                  </div>
                </div>
                <div className="d2-investment-item">
                  <span className="d2-investment-icon" aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                  </span>
                  <div>
                    <h3>Business Plan Required</h3>
                    <p className="d2-body" style={{ margin: 0 }}>A detailed business plan in Portuguese showing viability, market analysis, financial projections, and economic contribution.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Benefits */}
          <section className="section-with-bg" style={{ padding: '4.5rem 0', backgroundImage: `url(${D2_PAGE_IMAGES[3]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Why D2</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1.25rem' }}>Main Benefits of the D2 Entrepreneur Visa</h2>
              <ul className="d2-body-light" style={{ lineHeight: 2, paddingLeft: '1.35rem', maxWidth: '640px', fontSize: '1.05rem' }}>
                <li><strong style={{ color: '#fff' }}>No Minimum Investment</strong> – Start with the capital your business actually needs.</li>
                <li><strong style={{ color: '#fff' }}>Full Residency Rights</strong> – Live, work, and run your business in Portugal with the same rights as any legal resident.</li>
                <li><strong style={{ color: '#fff' }}>EU Market Access</strong> – Use Portugal as your base to access EU markets and business opportunities across Europe.</li>
                <li><strong style={{ color: '#fff' }}>Family Inclusion</strong> – Include spouse, dependent children, and dependent parents in your application.</li>
                <li><strong style={{ color: '#fff' }}>Schengen Mobility</strong> – Travel freely throughout the 27 Schengen countries for business and personal reasons.</li>
                <li><strong style={{ color: '#fff' }}>Path to Citizenship</strong> – Apply for Portuguese citizenship after 5 years of legal residence (A2 Portuguese required).</li>
              </ul>
            </div>
          </section>

          {/* 5. D2 vs Golden Visa */}
          <section className="section-with-bg" style={{ padding: '4.5rem 0', backgroundImage: `url(${D2_PAGE_IMAGES[4]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Comparison</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1.25rem' }}>D2 Entrepreneur Visa vs Golden Visa</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="d2-card">
                  <h3>D2 Entrepreneur Visa</h3>
                  <ul className="d2-body" style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.9 }}>
                    <li>✓ No minimum investment amount</li>
                    <li>✓ Start any type of legitimate business</li>
                    <li>! Must live primarily in Portugal</li>
                    <li>✓ Active involvement in your business</li>
                    <li>✓ Path to citizenship after 5 years</li>
                  </ul>
                </div>
                <div className="d2-card" style={{ borderLeftColor: 'var(--text-muted)' }}>
                  <h3 style={{ color: 'var(--text)' }}>Golden Visa</h3>
                  <ul className="d2-body" style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.9 }}>
                    <li>! Requires €200K–€500K investment</li>
                    <li>! Limited to funds or cultural donations</li>
                    <li>✓ Only 7 days/year in Portugal</li>
                    <li>✓ Passive investment, no active management</li>
                    <li>✓ Path to citizenship after 5 years</li>
                  </ul>
                </div>
              </div>
              <p className="d2-body d2-body-light" style={{ margin: 0 }}>
                <strong style={{ color: '#fff' }}>Bottom line:</strong> Choose D2 if you want to build and run a business in Portugal. Choose Golden Visa if you want residency with minimal presence and passive investment.
              </p>
            </div>
          </section>

          {/* 6. Eligibility */}
          <section className="section-with-bg" style={{ padding: '4.5rem 0', backgroundImage: `url(${D2_PAGE_IMAGES[5]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Requirements</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1rem' }}>D2 Visa Eligibility Requirements</h2>
              <p className="d2-body-light" style={{ marginBottom: '1.5rem', maxWidth: '640px', fontSize: '1.05rem' }}>
                We evaluate your business concept, experience, and financial situation during the initial consultation to determine D2 eligibility and identify the strongest application strategy.
              </p>
              <ul className="d2-body-light" style={{ lineHeight: 2, paddingLeft: '1.35rem', fontSize: '1.05rem' }}>
                <li><strong style={{ color: '#fff' }}>Viable Business Plan</strong> – A detailed Portuguese-language business plan demonstrating market opportunity, financial viability, and economic contribution.</li>
                <li><strong style={{ color: '#fff' }}>Sufficient Capital</strong> – Proof of funds to establish and operate your business, plus personal living expenses during the startup phase.</li>
                <li><strong style={{ color: '#fff' }}>Relevant Experience</strong> – Background, qualifications, or experience relevant to your proposed business sector.</li>
                <li><strong style={{ color: '#fff' }}>Clean Criminal Record</strong> – No serious criminal offences in Portugal or your country of residence.</li>
                <li><strong style={{ color: '#fff' }}>Health Insurance</strong> – Valid health insurance covering Portugal for at least the initial period.</li>
              </ul>
            </div>
          </section>

          {/* 7. Our Process */}
          <section className="section-with-bg" style={{ padding: '4.5rem 0', backgroundImage: `url(${D2_PAGE_IMAGES[6]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">How it works</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1.25rem' }}>Step-by-Step D2 Visa Process</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { step: 1, title: 'Business Concept Assessment', text: 'We evaluate your business idea, market opportunity, and D2 eligibility. We identify the strongest positioning for your application.' },
                  { step: 2, title: 'Company Registration', text: 'We help establish your Portuguese company (Unipessoal, Lda, or SA), obtain NIF, open a bank account, and complete legal formalities.' },
                  { step: 3, title: 'Business Plan Development', text: 'We prepare or review your Portuguese-language business plan to meet consular expectations and demonstrate viability.' },
                  { step: 4, title: 'Visa Application', text: 'We prepare all documentation and support you through the consular application process in your country of residence.' },
                  { step: 5, title: 'Approval and Residence Permit', text: 'After visa approval, you enter Portugal and apply for your residence permit. We assist with AIMA appointments and business launch.' },
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

          {/* 8. Why Choose Us */}
          <section className="section-with-bg" style={{ padding: '4.5rem 0', backgroundImage: `url(${D2_PAGE_IMAGES[7]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Our support</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1rem' }}>How Our Law Firm Helps Entrepreneurs</h2>
              <p className="d2-body-light" style={{ marginBottom: '1.5rem', maxWidth: '640px', fontSize: '1.05rem' }}>
                We provide comprehensive legal support for entrepreneurs navigating Portuguese business registration and immigration.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {['Company Formation – We handle Portuguese company registration, articles of association, tax registration, and all corporate formalities.', 'Business Plan Review – We review and refine your business plan to ensure it meets consular requirements and presents your concept effectively.', 'Full Immigration Support – We prepare your D2 visa application, coordinate documentation, and support you through the entire process.', 'Ongoing Compliance – After approval, we assist with residence permit renewals, corporate compliance, and eventual citizenship applications.'].map((item, i) => (
                  <div key={i} className="d2-why-card">
                    <p className="d2-body" style={{ margin: 0, color: 'var(--text)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 9. Business Types */}
          <section className="section-with-bg" style={{ padding: '4.5rem 0', backgroundImage: `url(${D2_PAGE_IMAGES[8]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Sectors</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '0.5rem' }}>What Types of Businesses Qualify?</h2>
              <p className="d2-body d2-body-light" style={{ marginBottom: '1.5rem' }}>Most legitimate business activities qualify for the D2 visa. Here are common examples:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                <div className="d2-card">
                  <h3>Technology &amp; Startups</h3>
                  <ul className="d2-body" style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                    <li>Software development</li>
                    <li>SaaS companies</li>
                    <li>E-commerce platforms</li>
                    <li>Tech consulting</li>
                  </ul>
                </div>
                <div className="d2-card">
                  <h3>Professional Services</h3>
                  <ul className="d2-body" style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                    <li>Consulting firms</li>
                    <li>Marketing agencies</li>
                    <li>Design studios</li>
                    <li>Training/coaching</li>
                  </ul>
                </div>
                <div className="d2-card">
                  <h3>Trade &amp; Hospitality</h3>
                  <ul className="d2-body" style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                    <li>Import/export</li>
                    <li>Retail businesses</li>
                    <li>Restaurants/cafés</li>
                    <li>Tourism services</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 10. FAQs */}
          <section className="section-with-bg" style={{ padding: '4.5rem 0', backgroundImage: `url(${D2_PAGE_IMAGES[9]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Common questions</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1.25rem' }}>D2 Entrepreneur Visa FAQs (2026)</h2>
              <div style={{ maxWidth: '720px' }}>
                {[
                  { q: 'What is the minimum investment for the D2 Entrepreneur Visa?', a: 'There is no fixed minimum investment. You must demonstrate sufficient capital to establish and operate your business—typically €5,000–€50,000+ depending on your business type, plus funds to support yourself.' },
                  { q: 'Do I need to create jobs to get the D2 visa?', a: 'Not necessarily. While job creation strengthens your application, it is not a strict requirement. The focus is on demonstrating a viable business that contributes to the Portuguese economy.' },
                  { q: 'What types of businesses qualify for the D2 visa?', a: 'Most legitimate business activities qualify—technology companies, consulting firms, e-commerce, hospitality, import/export, professional services, and more. Regulated sectors may have additional requirements.' },
                  { q: 'Do I need a business plan in Portuguese?', a: 'Yes. Consulates require a detailed business plan in Portuguese demonstrating your concept, market analysis, financial projections, and economic contribution.' },
                  { q: 'Can I include my family in the D2 application?', a: 'Yes. You can include your spouse, dependent children (generally under 18, or up to 26 if students), and dependent parents through family reunification.' },
                  { q: 'How long does D2 visa processing take?', a: 'Visa processing typically takes 60-90 days after submission. Allow additional time for company registration and document preparation—the full process usually takes 4-6 months.' },
                  { q: 'Can I get Portuguese citizenship through the D2 visa?', a: 'Yes. After 5 years of legal residence in Portugal, you can apply for Portuguese citizenship. You must pass a basic Portuguese language test (A2 level).' },
                  { q: 'What happens if my business fails?', a: 'Your residency is not automatically revoked if your business struggles. You may restructure, pivot to a new business, or transition to another visa type. Consult with us to explore options.' },
                ].map((faq, i) => (
                  <div key={i} style={{ marginBottom: '0.75rem', background: 'rgba(255,255,255,0.97)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                    <button
                      type="button"
                      className="d2-faq-btn"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: '100%', textAlign: 'left', padding: '1rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      {faq.q} {openFaq === i ? '−' : '+'}
                    </button>
                    {openFaq === i && (
                      <div className="d2-body" style={{ padding: '0 1.25rem 1rem' }}>{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 11. CTA */}
          <section className="section-with-bg d2-cta-section" style={{ padding: '5.5rem 0', backgroundImage: `url(${D2_PAGE_IMAGES[10]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in style={{ textAlign: 'center' }}>
              <span className="d2-section-label d2-section-label-light">Get started</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1rem' }}>Ready to Launch Your Business in Portugal?</h2>
              <p className="d2-body-light" style={{ marginBottom: '1.75rem', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
                Contact us for a free D2 visa consultation. We&apos;ll evaluate your business concept, explain the requirements, and create a roadmap to Portuguese business residency.
              </p>
              <p style={{ margin: 0 }}>
                <Link href="/contact" className="d2-cta-primary" style={{ marginRight: '0.75rem' }}>Schedule D2 Consultation</Link>
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
