import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Top Bar with WINIT Branding */}
      <div style={{ background: '#1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>WINIT</div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/auth/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
          <Link href="/auth/signup" style={{ color: '#00c896', textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link>
        </div>
      </div>
      
      {/* Hero Section */}
      <header style={{
        background: 'linear-gradient(135deg, #0066cc 0%, #00c896 100%)',
        color: 'white',
        padding: '5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', letterSpacing: '2px', opacity: 0.9, marginBottom: '1rem' }}>POWERED BY WINIT</div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            Move to Portugal with Confidence
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '3rem', opacity: 0.95 }}>
            We handle your immigration paperwork so you can focus on your new life
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }} />
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      </header>

      {/* About Section */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem', color: '#1e293b' }}>What We Do</h2>
          <div style={{ fontSize: '1.3rem', lineHeight: '1.8', color: '#475569', marginBottom: '3rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Moving to Portugal means lots of paperwork for preparing visa applications, meeting deadlines, and follow-up once the visa is issued.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              <strong style={{ color: '#0066cc', fontSize: '1.4rem' }}>We make it simple.</strong> Upload your documents, track your progress, and get expert help when you need it.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <button
              type="button"
              onClick={() => document.getElementById('residency-programs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              style={{
                textAlign: 'center',
                padding: '2rem',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '2px solid #e2e8f0',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛂</div>
              <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Residency Visa Programs</h3>
              <p style={{ color: '#64748b', fontSize: '1rem' }}>D2 Entrepreneur, D7 Passive Income, and D8 Digital Nomad</p>
              <span style={{ display: 'inline-block', marginTop: '0.75rem', color: '#0066cc', fontWeight: '600' }}>
                View details ↓
              </span>
            </button>

            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👨‍💼</div>
              <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Get Expert Help</h3>
              <p style={{ color: '#64748b', fontSize: '1rem' }}>Work with a licensed immigration specialist who knows the process</p>
            </div>

            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Track Your Progress</h3>
              <p style={{ color: '#64748b', fontSize: '1rem' }}>See exactly where you are in the process at any time</p>
            </div>
          </div>

          <div style={{ background: '#e0f2fe', padding: '2.5rem', borderRadius: '12px', borderLeft: '4px solid #0066cc' }}>
            <h3 style={{ color: '#0066cc', fontSize: '1.5rem', marginBottom: '1rem' }}>Why People Choose Us</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '0.75rem 0', color: '#334155', fontSize: '1.1rem' }}>✅ <strong>Faster:</strong> Get your visa approved quicker with expert guidance</li>
              <li style={{ padding: '0.75rem 0', color: '#334155', fontSize: '1.1rem' }}>✅ <strong>Less Stressful:</strong> We handle the complicated stuff</li>
              <li style={{ padding: '0.75rem 0', color: '#334155', fontSize: '1.1rem' }}>✅ <strong>Higher Success Rate:</strong> 98% of our applications get approved</li>
              <li style={{ padding: '0.75rem 0', color: '#334155', fontSize: '1.1rem' }}>✅ <strong>Always Updated:</strong> Know your application status in real-time</li>
              <li style={{ padding: '0.75rem 0', color: '#334155', fontSize: '1.1rem' }}>✅ <strong>Personal Support:</strong> Direct access to your immigration specialist</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '4rem 2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: '#1e293b' }}>How It Works</h2>
          <div style={{ display: 'grid', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ background: '#0066cc', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>1</div>
              <div>
                <Link href="/auth/signup" style={{
                  display: 'inline-block',
                  color: 'white',
                  background: 'linear-gradient(135deg, #0066cc, #00c896)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  marginBottom: '0.75rem',
                  boxShadow: '0 6px 16px rgba(0, 102, 204, 0.35)'
                }}>
                  Sign Up & Choose Your Plan →
                </Link>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>Pick the package that fits your needs. Takes 2 minutes.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ background: '#0066cc', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>2</div>
              <div>
                <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Upload Your Documents</h3>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>Follow our simple checklist and upload your papers securely.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ background: '#0066cc', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>3</div>
              <div>
                <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>We Review Everything</h3>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>Our expert checks your documents and tells you if anything is missing.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ background: '#00c896', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>✓</div>
              <div>
                <h3 style={{ color: '#00c896', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Get Approved</h3>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>We guide you through submission and help until you get your visa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Residency Programs */}
      <section id="residency-programs" style={{ padding: '5rem 2rem', background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)', scrollMarginTop: '90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 id="assistance-residency-programs" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', color: '#1e293b', scrollMarginTop: '90px' }}>
            Types of Residency Programs
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#64748b', marginBottom: '3rem' }}>
            End-to-end support from documentation preparation to AIMA appointment after arrival in Portugal.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* D2 Visa */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0' }}>
              <h3 style={{ color: '#0066cc', fontSize: '1.6rem', marginBottom: '0.5rem' }}>D2 Visa Program (Entrepreneur Visa)</h3>
              <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Portugal D2 Visa is for non-EU/EEA/Swiss citizens who want to start a business, invest in an existing one, or work as independent professionals in Portugal.
              </p>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Who Is Eligible?</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                <li>Entrepreneurs opening a new company or branch</li>
                <li>Investors buying shares in a Portuguese business</li>
                <li>Freelancers with service contracts or proposals from Portuguese clients</li>
              </ul>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Core Requirements</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                <li>Company registration in Portugal</li>
                <li>Detailed business plan showing economic/social/cultural value</li>
                <li>Portuguese bank account</li>
                <li>Financial means: about €11,040 for main applicant (plus family)</li>
                <li>Additional funds based on startup capital in the plan</li>
                <li>Portuguese Tax ID (NIF)</li>
                <li>Proof of accommodation (12-month lease or property deed)</li>
                <li>Clean criminal record certificate</li>
              </ul>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Timeline & Validity</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                <li>Initial entry visa: 4 months (120 days)</li>
                <li>Residence permit: 2 years, renewable for 3-year periods</li>
                <li>Citizenship eligibility after 5 years (language/background requirements)</li>
              </ul>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Key Benefits</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                <li>Visa-free travel within Schengen Area</li>
                <li>Family reunification</li>
                <li>Access to public healthcare</li>
                <li>Free public education up to grade 12</li>
              </ul>

              <p style={{ color: '#475569', marginBottom: '1rem' }}>
                <strong>Processing time:</strong> typically 60–90 days for consulate decision.
              </p>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>How We Can Help</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                <li>Tax ID (NIF) issuance</li>
                <li>Company registration</li>
                <li>Bank account opening (in person or remote)</li>
                <li>Business plan prepared by certified CPA</li>
                <li>Long-term lease or property deed support</li>
                <li>Driver’s license exchange assistance</li>
              </ul>
            </div>

            {/* D7 Visa */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0' }}>
              <h3 style={{ color: '#0066cc', fontSize: '1.6rem', marginBottom: '0.5rem' }}>D7 Visa Program (Passive Income)</h3>
              <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                The Portugal D7 Visa is for non-EU/EEA/Swiss citizens with stable recurring income from outside Portugal.
              </p>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Who Can Apply?</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                <li>Retirees with a pension</li>
                <li>Investors earning dividends or interest</li>
                <li>Landlords with rental income</li>
                <li>Royalty or IP income holders</li>
              </ul>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Core Financial Requirements (2026)</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                <li>Main applicant: €11,040 annually (€920/month)</li>
                <li>Spouse/parent: +50% (€460/month)</li>
                <li>Dependent child: +30% (€276/month)</li>
                <li>Recommended: 12 months of funds in a Portuguese bank</li>
              </ul>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Other Requirements</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                <li>Long-term accommodation (12-month lease or property deed)</li>
                <li>Portuguese Tax ID (NIF)</li>
                <li>Clean criminal record certificate</li>
              </ul>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Key Benefits</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                <li>Initial residence permit: 2 years, then 3-year renewal</li>
                <li>Citizenship eligibility after 5 years</li>
                <li>Work rights after residence permit issued</li>
                <li>Access to public healthcare and education</li>
              </ul>

              <p style={{ color: '#475569', marginBottom: '1rem' }}>
                <strong>Processing time:</strong> typically 60–90 days for consulate decision.
              </p>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>How We Can Help</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                <li>Tax ID (NIF) issuance</li>
                <li>Bank account opening (in person or remote)</li>
                <li>Long-term lease or property deed support</li>
                <li>Driver’s license exchange assistance</li>
                <li>Portuguese health number assistance</li>
              </ul>
            </div>

            {/* D8 Visa */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0' }}>
              <h3 style={{ color: '#0066cc', fontSize: '1.6rem', marginBottom: '0.5rem' }}>D8 Visa Program (Digital Nomad)</h3>
              <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                The Portugal D8 Visa is for remote workers or freelancers with clients outside Portugal.
              </p>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Core Requirements (2026)</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
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

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Key Benefits</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                <li>Initial residence permit: 2 years, then 3-year renewal</li>
                <li>Citizenship eligibility after 5 years</li>
                <li>Work rights after residence permit issued</li>
                <li>Access to public healthcare and education</li>
              </ul>

              <p style={{ color: '#475569', marginBottom: '1rem' }}>
                <strong>Processing time:</strong> typically 60–90 days for consulate decision.
              </p>

              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>How We Can Help</h4>
              <ul style={{ color: '#64748b', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                <li>Tax ID (NIF) issuance</li>
                <li>Bank account opening (in person or remote)</li>
                <li>Long-term lease or property deed support</li>
                <li>Driver’s license exchange assistance</li>
                <li>Portuguese health number assistance</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '3rem', background: '#e0f2fe', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid #0066cc' }}>
            <h4 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>Stay Requirements</h4>
            <p style={{ color: '#475569', lineHeight: '1.7', margin: 0 }}>
              To keep the residency permit valid and lead to citizenship, you generally cannot be absent from Portugal for more than 6 consecutive months or 8 non-consecutive months within the permit's validity period.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: '#1e293b' }}>What You Get</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ color: '#0066cc', marginBottom: '0.75rem', fontSize: '1.2rem' }}>Document Checklist</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>Know exactly what papers you need for your visa type</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{ color: '#0066cc', marginBottom: '0.75rem', fontSize: '1.2rem' }}>Secure Storage</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>Your documents are encrypted and protected</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ color: '#0066cc', marginBottom: '0.75rem', fontSize: '1.2rem' }}>Live Updates</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>Get notified when your specialist reviews documents</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ color: '#0066cc', marginBottom: '0.75rem', fontSize: '1.2rem' }}>Progress Tracking</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>See where you are in the process at any time</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ color: '#0066cc', marginBottom: '0.75rem', fontSize: '1.2rem' }}>Direct Communication</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>Message your specialist with questions anytime</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
            <h3 style={{ color: '#0066cc', marginBottom: '0.75rem', fontSize: '1.2rem' }}>Easy Payment</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>Secure online payment with credit card</p>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0066cc 0%, #00c896 100%)',
          borderRadius: '16px',
          padding: '3rem',
          textAlign: 'center',
          color: 'white',
          marginTop: '4rem'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to start your Portugal journey?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>Join hundreds of successful immigration cases with expert support</p>
          <Link href="/auth/signup" style={{
            background: 'white',
            color: '#0066cc',
            padding: '1rem 3rem',
            fontSize: '1.2rem',
            borderRadius: '12px',
            fontWeight: 'bold',
            display: 'inline-block',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
            Get Started Today →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e293b', color: 'white', padding: '2rem', textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>WINIT</div>
        <p style={{ opacity: 0.8 }}>© 2026 WINIT Portugal Immigration Platform. All rights reserved.</p>
        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '0.5rem' }}>Empowering your immigration journey</p>
      </footer>
    </div>
  )
}
