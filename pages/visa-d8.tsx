import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import EditPageFloatingButton from '../components/EditPageFloatingButton'
import SiteNav from '../components/SiteNav'
import { getSiteCopy } from '../lib/getSiteCopy'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const d8 = getSiteCopy().visa_d8

// D8 page: each section has its own image (remote work, digital nomad, laptop, tech)
const D8_HERO_IMAGE = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=90'
const D8_PAGE_IMAGES = [
  D8_HERO_IMAGE,
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=90',  // 1 Overview – remote work
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=90',  // 2 Income / requirements
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=90', // 3 Benefits – travel
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=90', // 4 Comparison
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&q=90', // 5 Requirements
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=90',   // 6 Process
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=90',   // 7 Why us
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=90', // 8 Who qualifies
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=90', // 9 FAQs
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=90',   // 10 CTA
]

export default function VisaD8() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [debugText, setDebugText] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    setDebugText(new URLSearchParams(window.location.search).get('debug') === 'text')
  }, [])

  return (
    <>
      <Head>
        <title>{d8.meta_title}</title>
        <meta name="description" content={d8.meta_description} />
        <meta property="og:title" content={d8.meta_title} />
        <meta property="og:description" content={d8.meta_description} />
        <meta property="og:type" content="website" />
        {BASE_URL && <link rel="canonical" href={`${BASE_URL}/visa-d8`} />}
        {BASE_URL && <meta property="og:url" content={`${BASE_URL}/visa-d8`} />}
        {BASE_URL && <meta property="og:image" content={`${BASE_URL}/og.png`} />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className={`home-nav-spacer visa-d2-page visa-d8-page${debugText ? ' visa-debug-text' : ''}`} style={{ minHeight: '100vh' }}>
        {debugText && <div className="visa-debug-banner" aria-hidden>DEBUG: Text &amp; style — outlines show text boundaries; remove ?debug=text from URL to exit</div>}
        <EditPageFloatingButton relativePath="pages/visa-d8.tsx" />
        <SiteNav />

        <main>
          <section className="section-with-bg" style={{ padding: '5.5rem 0', backgroundImage: `url(${D8_HERO_IMAGE})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <span className="d2-section-label d2-section-label-light">{d8.hero_label}</span>
              <h1 className="d2-hero-title">{d8.hero_title}</h1>
              <p className="d2-hero-sub" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{d8.hero_subtitle}</p>
            </div>
          </section>

          {/* 2. Overview */}
          <section className="d2-overview-section section-with-bg visa-section-center-header" id="overview" style={{ backgroundImage: `url(${D8_PAGE_IMAGES[1]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Overview</span>
              <h2 className="d2-heading d2-heading-light">What is the D8 Digital Nomad Visa?</h2>
              <p className="d2-body d2-body-light" style={{ marginBottom: '1rem' }}>
                The <strong style={{ color: 'rgba(255,255,255,0.98)' }}>D8 visa</strong> (Digital Nomad / Remote Work Visa) allows non-EU citizens to obtain Portuguese residency by proving they work remotely for employers or clients outside Portugal. You must meet a higher income threshold than the D7, and demonstrate that your work is performed remotely (e.g. employment contract, freelancer agreements, invoices).
              </p>
              <p className="d2-body d2-body-light" style={{ marginBottom: 0 }}>
                <strong style={{ color: 'rgba(255,255,255,0.98)' }}>Ideal for:</strong> Remote employees, freelancers, consultants, and digital professionals who want to base themselves in Portugal without changing employer or client base.
              </p>
            </div>
          </section>

          {/* 3. Income & Requirements */}
          <section id="income" className="section-with-bg d2-investment-section visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D8_PAGE_IMAGES[2]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Income</span>
              <h2 className="d2-heading d2-heading-light">D8 Visa Income &amp; Documentation</h2>
              <div className="d2-key-advantage">
                <strong className="d2-key-advantage-label">Key point</strong>
                <p className="d2-body" style={{ margin: 0 }}>
                  You must prove income of at least 4× the Portuguese minimum wage (currently ~€3,680/month for the main applicant), plus 12 months of means of subsistence. Remote work must be clearly documented.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: '1.25rem' }}>
                <div className="d2-investment-item">
                  <span className="d2-investment-icon" aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8M8 14h8"/></svg>
                  </span>
                  <div>
                    <h3>Main Applicant</h3>
                    <p className="d2-body" style={{ margin: 0 }}>~€3,680/month (4× minimum wage). Spouse: +50%. Each child: +30%. Plus 12 months of means of subsistence in a Portuguese bank.</p>
                  </div>
                </div>
                <div className="d2-investment-item">
                  <span className="d2-investment-icon" aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
                  </span>
                  <div>
                    <h3>Proof of Remote Work</h3>
                    <p className="d2-body" style={{ margin: 0 }}>Employment contract or employer letter; freelancers: service contracts and recent invoices. Evidence that work is for entities outside Portugal.</p>
                  </div>
                </div>
                <div className="d2-investment-item">
                  <span className="d2-investment-icon" aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                  </span>
                  <div>
                    <h3>Other Requirements</h3>
                    <p className="d2-body" style={{ margin: 0 }}>Long-term accommodation (12-month lease or deed), NIF, clean criminal record (apostilled and translated), and health insurance for Portugal.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Benefits */}
          <section id="benefits" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D8_PAGE_IMAGES[3]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Why D8</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1.25rem' }}>Main Benefits of the D8 Digital Nomad Visa</h2>
              <ul className="d2-body-light" style={{ lineHeight: 2, paddingLeft: '1.35rem', maxWidth: '640px', fontSize: '1.05rem' }}>
                <li><strong style={{ color: '#fff' }}>Work Remotely from Portugal</strong> – Keep your job or clients abroad while living in Portugal with full residency rights.</li>
                <li><strong style={{ color: '#fff' }}>Initial 2-Year Permit</strong> – Then renew for 3 years. Path to permanent residence and citizenship after 5 years.</li>
                <li><strong style={{ color: '#fff' }}>Schengen Mobility</strong> – Travel freely across the Schengen area for work and leisure.</li>
                <li><strong style={{ color: '#fff' }}>Family Inclusion</strong> – Include spouse and dependent children (with income add-ons).</li>
                <li><strong style={{ color: '#fff' }}>Healthcare &amp; Education</strong> – Access to public healthcare and education for you and your family.</li>
                <li><strong style={{ color: '#fff' }}>No Local Employment Required</strong> – Your income comes from outside Portugal; no need to find a Portuguese employer.</li>
              </ul>
            </div>
          </section>

          {/* 5. D8 vs D7 */}
          <section id="comparison" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D8_PAGE_IMAGES[4]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Comparison</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1.25rem' }}>D8 Digital Nomad vs D7 Passive Income</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="d2-card">
                  <h3>D8 Digital Nomad</h3>
                  <ul className="d2-body" style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.9 }}>
                    <li>✓ Higher income (~€3,680/month)</li>
                    <li>✓ Remote work for foreign employer/clients</li>
                    <li>✓ Keep your job or freelance base abroad</li>
                    <li>✓ Ideal for remote employees and freelancers</li>
                    <li>✓ Path to citizenship after 5 years</li>
                  </ul>
                </div>
                <div className="d2-card" style={{ borderLeftColor: 'var(--text-muted)' }}>
                  <h3 style={{ color: 'var(--text)' }}>D7 Passive Income</h3>
                  <ul className="d2-body" style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.9 }}>
                    <li>! Lower income (~€920/month)</li>
                    <li>! Pension, investments, rentals—no active work</li>
                    <li>✓ No need to work or run a business</li>
                    <li>✓ Ideal for retirees and passive investors</li>
                    <li>✓ Path to citizenship after 5 years</li>
                  </ul>
                </div>
              </div>
              <p className="d2-body d2-body-light" style={{ margin: 0 }}>
                <strong style={{ color: '#fff' }}>Bottom line:</strong> Choose D8 if you work remotely for a foreign employer or clients. Choose D7 if your income is passive (pension, investments, rentals).
              </p>
            </div>
          </section>

          {/* 6. Eligibility */}
          <section id="eligibility" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D8_PAGE_IMAGES[5]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Requirements</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1rem' }}>D8 Visa Eligibility &amp; Documentation</h2>
              <p className="d2-body-light" style={{ marginBottom: '1.5rem', maxWidth: '640px', fontSize: '1.05rem' }}>
                Your application must clearly show that you work remotely and that your income meets the threshold. We help you gather and present the right evidence.
              </p>
              <ul className="d2-body-light" style={{ lineHeight: 2, paddingLeft: '1.35rem', fontSize: '1.05rem' }}>
                <li><strong style={{ color: '#fff' }}>Proof of Remote Work</strong> – Employment contract, employer letter, or freelancer contracts and invoices showing work for entities outside Portugal.</li>
                <li><strong style={{ color: '#fff' }}>Income Evidence</strong> – Payslips, bank statements, or tax returns proving income of at least 4× minimum wage (and add-ons for family).</li>
                <li><strong style={{ color: '#fff' }}>Means of Subsistence</strong> – 12 months of funds in a Portuguese bank (we assist with account opening).</li>
                <li><strong style={{ color: '#fff' }}>Long-Term Accommodation</strong> – 12-month lease or property deed in Portugal.</li>
                <li><strong style={{ color: '#fff' }}>NIF, Criminal Record, Health Insurance</strong> – Portuguese tax ID; clean criminal record (apostilled/translated); valid health coverage for Portugal.</li>
              </ul>
            </div>
          </section>

          {/* 7. Process */}
          <section id="process" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D8_PAGE_IMAGES[6]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">How it works</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1.25rem' }}>Step-by-Step D8 Visa Process</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { step: 1, title: 'Eligibility &amp; Remote Work Evidence', text: 'We review your employment or freelancer setup and income to confirm you meet the D8 threshold and can document remote work.' },
                  { step: 2, title: 'NIF &amp; Bank Account', text: 'We assist with NIF and opening a Portuguese bank account. You will need to transfer 12 months of means of subsistence.' },
                  { step: 3, title: 'Accommodation', text: 'We support you in securing long-term accommodation (lease or property) that meets consular requirements.' },
                  { step: 4, title: 'Visa Application', text: 'We prepare and organise all documentation—remote work proof, income, accommodation—and guide you through the consular application.' },
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
          <section id="why-us" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D8_PAGE_IMAGES[7]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">How we can help you</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1rem' }}>How We Help D8 Applicants</h2>
              <p className="d2-body-light" style={{ marginBottom: '1.5rem', maxWidth: '640px', fontSize: '1.05rem' }}>
                We specialise in remote workers and digital nomads relocating to Portugal.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {['NIF Issuance – Quick, correct setup of your Portuguese tax ID.', 'Bank Account Opening – Support for opening a Portuguese bank account in person or remotely.', 'Lease or Property Support – Help finding long-term accommodation that meets visa requirements.', 'Full Application Support – We prepare your D8 application, coordinate remote work and income evidence, and support you through the consulate and AIMA.'].map((item, i) => (
                  <div key={i} className="d2-why-card">
                    <p className="d2-body" style={{ margin: 0, color: 'var(--text)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 9. Who Qualifies */}
          <section id="who" className="section-with-bg visa-section-center-header" style={{ padding: '4.5rem 0', backgroundImage: `url(${D8_PAGE_IMAGES[8]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <span className="d2-section-label d2-section-label-light">Who can apply</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '0.5rem' }}>Who Can Apply for the D8 Visa?</h2>
              <p className="d2-body d2-body-light" style={{ marginBottom: '1.5rem' }}>The D8 is for anyone who works remotely for employers or clients outside Portugal. Common profiles:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                <div className="d2-card">
                  <h3>Remote Employees</h3>
                  <p className="d2-body" style={{ margin: 0 }}>You work for a company abroad and can perform your job remotely from Portugal.</p>
                </div>
                <div className="d2-card">
                  <h3>Freelancers</h3>
                  <p className="d2-body" style={{ margin: 0 }}>You provide services to clients outside Portugal and can prove income with contracts and invoices.</p>
                </div>
                <div className="d2-card">
                  <h3>Digital Professionals</h3>
                  <p className="d2-body" style={{ margin: 0 }}>Developers, designers, marketers, consultants, and other knowledge workers with a remote client base.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 10. FAQs */}
          <section id="faqs" className="section-with-bg" style={{ padding: '4.5rem 0', backgroundImage: `url(${D8_PAGE_IMAGES[9]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in>
              <div className="visa-faq-section">
                <div className="visa-faq-header">
                  <span className="d2-section-label d2-section-label-light">Common questions</span>
                  <h2 className="d2-heading d2-heading-light" style={{ marginBottom: 0 }}>D8 Digital Nomad Visa FAQs (2026)</h2>
                </div>
                <div className="visa-faq-list">
                  {[
                    { q: 'What income is required for the D8 visa?', a: 'At least 4× the Portuguese minimum wage (currently ~€3,680/month for the main applicant). Spouse: +50%. Each child: +30%. You also need 12 months of means of subsistence in a Portuguese bank.' },
                    { q: 'Do I need to work for a Portuguese company?', a: 'No. You must work for employers or clients outside Portugal. The D8 is designed for remote work; you cannot be employed by a Portuguese company on this visa.' },
                    { q: 'What proof of remote work do I need?', a: 'Employees: employment contract and employer letter stating you work remotely. Freelancers: service contracts and recent invoices showing work for clients outside Portugal.' },
                    { q: 'Can I include my family?', a: 'Yes. You can include your spouse and dependent children. Each has an income add-on (50% for spouse, 30% per child). All must meet the financial and documentation requirements.' },
                    { q: 'How long does D8 processing take?', a: 'Visa processing typically takes 60–90 days after submission. Allow additional time for NIF, bank account, accommodation, and document preparation—often 4–6 months in total.' },
                    { q: 'Can I get citizenship through the D8 visa?', a: 'Yes. After 5 years of legal residence in Portugal, you can apply for Portuguese citizenship, subject to language and ties requirements (e.g. A2 Portuguese).' },
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
          <section id="cta" className="section-with-bg d2-cta-section" style={{ padding: '5.5rem 0', backgroundImage: `url(${D8_PAGE_IMAGES[10]})` }}>
            <div className="section-with-bg-inner home-container fade-in-on-scroll" data-fade-in style={{ textAlign: 'center' }}>
              <span className="d2-section-label d2-section-label-light">Get started</span>
              <h2 className="d2-heading d2-heading-light" style={{ marginBottom: '1rem' }}>Ready to Apply for the D8 Visa?</h2>
              <p className="d2-body-light" style={{ marginBottom: '1.75rem', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
                Contact us for a free D8 eligibility assessment. We&apos;ll review your remote work setup, explain the requirements, and create a roadmap to Portuguese residency.
              </p>
              <p style={{ margin: 0 }}>
                <Link href="/contact" className="d2-cta-primary" style={{ marginRight: '0.75rem' }}>Free D8 Assessment</Link>
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
