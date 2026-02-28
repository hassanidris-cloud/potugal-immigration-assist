import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export default function VisaPrograms() {
  const [navOpen, setNavOpen] = useState(false)
  return (
    <>
      <Head>
        <title>Visa Programs — WINIT Portugal Immigration</title>
        <meta name="description" content="D2 Entrepreneur, D7 Passive Income, and D8 Digital Nomad visas. End-to-end support from documentation to AIMA appointment." />
        <meta property="og:title" content="Visa Programs — WINIT Portugal Immigration" />
        <meta property="og:description" content="D2 Entrepreneur, D7 Passive Income, and D8 Digital Nomad visas. End-to-end support from documentation to AIMA appointment." />
        <meta property="og:type" content="website" />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/visa-programs`} />}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <div className="home-nav-spacer" style={{ minHeight: '100vh', fontFamily: 'var(--font-sans, sans-serif)' }}>
        <nav className={`home-nav ${navOpen ? 'nav-open' : ''}`}>
          <div className="home-nav-inner" style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <Link href="/" className="home-nav-logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', flexShrink: 0 }}>WINIT</Link>
            <button type="button" className="home-nav-hamburger" onClick={() => setNavOpen((o) => !o)} aria-expanded={navOpen} aria-label={navOpen ? 'Close menu' : 'Open menu'}>
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
            <div className="home-nav-links">
              <Link href="/why-portugal" onClick={() => setNavOpen(false)} className="text-white/90 no-underline font-medium">Why Portugal</Link>
              <Link href="/visa-programs" onClick={() => setNavOpen(false)} className="text-white/90 no-underline font-medium">Visa Programs</Link>
              <Link href="/#faq" onClick={() => setNavOpen(false)} className="text-white/90 no-underline font-medium">FAQ</Link>
              <Link href="/contact" onClick={() => setNavOpen(false)} className="text-white/90 no-underline font-medium">Contact</Link>
              <Link href="/auth/login" onClick={() => setNavOpen(false)} className="no-underline font-semibold">Login</Link>
              <Link href="/auth/signup" className="home-nav-signup no-underline" onClick={() => setNavOpen(false)}>Sign Up</Link>
            </div>
          </div>
        </nav>

        <main>
          <section className="home-section-padding" style={{ padding: '5rem 0', background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)' }}>
            <div className="home-container">
              <h1 id="residency-programs" className="section-heading" style={{ textAlign: 'center', fontSize: 'clamp(1.9rem, 4vw, 2.5rem)', marginBottom: '1rem', scrollMarginTop: '90px' }}>
                Types of Residency Programs
              </h1>
              <p className="text-text-muted text-center" style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
                End-to-end support from documentation preparation to AIMA appointment after arrival in Portugal.
              </p>

              <div className="home-residency-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                <div id="visa-d2" className="visa-card" style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0', scrollMarginTop: '90px' }}>
                  <h2 className="text-primary" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>D2 Visa Program (Entrepreneur Visa)</h2>
                  <p className="text-text-muted" style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
                    Portugal D2 Visa is for non-EU/EEA/Swiss citizens who want to start a business, invest in an existing one, or work as independent professionals in Portugal.
                  </p>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Who Is Eligible?</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                    <li>Entrepreneurs opening a new company or branch</li>
                    <li>Investors buying shares in a Portuguese business</li>
                    <li>Freelancers with service contracts or proposals from Portuguese clients</li>
                  </ul>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Core Requirements</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                    <li>Company registration in Portugal</li>
                    <li>Detailed business plan showing economic/social/cultural value</li>
                    <li>Portuguese bank account</li>
                    <li>Financial means: about €11,040 for main applicant (plus family)</li>
                    <li>Additional funds based on startup capital in the plan</li>
                    <li>Portuguese Tax ID (NIF)</li>
                    <li>Proof of accommodation (12-month lease or property deed)</li>
                    <li>Clean criminal record certificate</li>
                  </ul>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Timeline & Validity</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                    <li>Initial entry visa: 4 months (120 days)</li>
                    <li>Residence permit: 2 years, renewable for 3-year periods</li>
                    <li>Citizenship eligibility after 5 years (language/background requirements)</li>
                  </ul>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Key Benefits</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                    <li>Visa-free travel within Schengen Area</li>
                    <li>Family reunification</li>
                    <li>Access to public healthcare</li>
                    <li>Free public education up to grade 12</li>
                  </ul>
                  <p className="text-text-muted" style={{ marginBottom: '1rem' }}>
                    <strong>Processing time:</strong> typically 60–90 days for consulate decision.
                  </p>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>How We Can Help</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                    <li>Tax ID (NIF) issuance</li>
                    <li>Company registration</li>
                    <li>Bank account opening (in person or remote)</li>
                    <li>Business plan prepared by certified CPA</li>
                    <li>Long-term lease or property deed support</li>
                    <li>Driver’s license exchange assistance</li>
                  </ul>
                </div>

                <div id="visa-d7" className="visa-card" style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0', scrollMarginTop: '90px' }}>
                  <h2 className="text-primary" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>D7 Visa Program (Passive Income)</h2>
                  <p className="text-text-muted" style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
                    The Portugal D7 Visa is for non-EU/EEA/Swiss citizens with stable recurring income from outside Portugal.
                  </p>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Who Can Apply?</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                    <li>Retirees with a pension</li>
                    <li>Investors earning dividends or interest</li>
                    <li>Landlords with rental income</li>
                    <li>Royalty or IP income holders</li>
                  </ul>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Core Financial Requirements (2026)</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                    <li>Main applicant: €11,040 annually (€920/month)</li>
                    <li>Spouse/parent: +50% (€460/month)</li>
                    <li>Dependent child: +30% (€276/month)</li>
                    <li>Recommended: 12 months of funds in a Portuguese bank</li>
                  </ul>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Other Requirements</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                    <li>Long-term accommodation (12-month lease or property deed)</li>
                    <li>Portuguese Tax ID (NIF)</li>
                    <li>Clean criminal record certificate</li>
                  </ul>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Key Benefits</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                    <li>Initial residence permit: 2 years, then 3-year renewal</li>
                    <li>Citizenship eligibility after 5 years</li>
                    <li>Work rights after residence permit issued</li>
                    <li>Access to public healthcare and education</li>
                  </ul>
                  <p className="text-text-muted" style={{ marginBottom: '1rem' }}>
                    <strong>Processing time:</strong> typically 60–90 days for consulate decision.
                  </p>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>How We Can Help</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                    <li>Tax ID (NIF) issuance</li>
                    <li>Bank account opening (in person or remote)</li>
                    <li>Long-term lease or property deed support</li>
                    <li>Driver’s license exchange assistance</li>
                    <li>Portuguese health number assistance</li>
                  </ul>
                </div>

                <div id="visa-d8" className="visa-card" style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0', scrollMarginTop: '90px' }}>
                  <h2 className="text-primary" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>D8 Visa Program (Digital Nomad)</h2>
                  <p className="text-text-muted" style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
                    The Portugal D8 Visa is for remote workers or freelancers with clients outside Portugal.
                  </p>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Core Requirements (2026)</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
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
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Key Benefits</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                    <li>Initial residence permit: 2 years, then 3-year renewal</li>
                    <li>Citizenship eligibility after 5 years</li>
                    <li>Work rights after residence permit issued</li>
                    <li>Access to public healthcare and education</li>
                  </ul>
                  <p className="text-text-muted" style={{ marginBottom: '1rem' }}>
                    <strong>Processing time:</strong> typically 60–90 days for consulate decision.
                  </p>
                  <h3 className="text-text" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>How We Can Help</h3>
                  <ul className="text-text-muted" style={{ lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                    <li>Tax ID (NIF) issuance</li>
                    <li>Bank account opening (in person or remote)</li>
                    <li>Long-term lease or property deed support</li>
                    <li>Driver’s license exchange assistance</li>
                    <li>Portuguese health number assistance</li>
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '3rem', background: '#e0f2fe', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid #0066cc' }}>
                <h4 className="text-primary" style={{ marginBottom: '0.5rem' }}>Stay Requirements</h4>
                <p className="text-text-muted" style={{ lineHeight: '1.7', margin: 0 }}>
                  To keep the residency permit valid and lead to citizenship, you generally cannot be absent from Portugal for more than 6 consecutive months or 8 non-consecutive months within the permit&apos;s validity period.
                </p>
              </div>

              <p style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <Link href="/#check-eligibility" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '600' }}>
                  Check your eligibility →
                </Link>
                <span style={{ margin: '0 1rem' }} />
                <Link href="/" className="text-primary font-semibold">← Back to home</Link>
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
