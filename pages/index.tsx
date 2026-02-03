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
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="#pricing" className="btn btn-primary" style={{
              background: 'white',
              color: '#0066cc',
              padding: '1rem 2.5rem',
              fontSize: '1.2rem',
              borderRadius: '12px',
              fontWeight: 'bold',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              display: 'inline-block'
            }}>
              💼 View Plans & Pricing
            </Link>
            <Link href="/auth/login" style={{
              padding: '1rem 2.5rem',
              fontSize: '1.2rem',
              borderRadius: '12px',
              fontWeight: 'bold',
              border: '2px solid white',
              color: 'white',
              display: 'inline-block',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              Login →
            </Link>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      </header>

      {/* About Section */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem', color: '#1e293b' }}>What We Do</h2>
          <div style={{ fontSize: '1.3rem', lineHeight: '1.8', color: '#475569', marginBottom: '3rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Moving to Portugal means dealing with lots of paperwork, visa requirements, and bureaucracy.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              <strong style={{ color: '#0066cc', fontSize: '1.4rem' }}>We make it simple.</strong> Upload your documents, track your progress, and get expert help when you need it.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</div>
              <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Store Your Documents</h3>
              <p style={{ color: '#64748b', fontSize: '1rem' }}>Keep all your immigration papers in one safe place, accessible anytime</p>
            </div>

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
                <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Sign Up & Choose Your Plan</h3>
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

        {/* Pricing Section */}
        <div id="pricing" style={{ marginTop: '5rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', color: '#1e293b' }}>Choose Your Plan</h2>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#64748b', marginBottom: '3rem' }}>One-time payment. No subscriptions or hidden fees.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Essential Plan */}
            <div style={{
              background: 'white',
              border: '2px solid #e0f2fe',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s'
            }}>
              <h3 style={{ fontSize: '1.5rem', color: '#0066cc', marginBottom: '0.5rem' }}>Essential</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>€299</div>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>For straightforward applications</p>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                <li style={{ padding: '0.5rem 0', color: '#334155' }}>✅ Document checklist for your visa</li>
                <li style={{ padding: '0.5rem 0', color: '#334155' }}>✅ Secure online storage</li>
                <li style={{ padding: '0.5rem 0', color: '#334155' }}>✅ Track your progress</li>
                <li style={{ padding: '0.5rem 0', color: '#334155' }}>✅ Email support</li>
              </ul>
              <Link href="/auth/signup" style={{
                display: 'block',
                background: '#0066cc',
                color: 'white',
                padding: '0.875rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}>
                Choose Essential
              </Link>
            </div>

            {/* Professional Plan */}
            <div style={{
              background: 'linear-gradient(135deg, #0066cc 0%, #00c896 100%)',
              border: '3px solid #0066cc',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,102,204,0.3)',
              transform: 'scale(1.05)',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#f59e0b', color: 'white', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                MOST POPULAR
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>Professional</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>€599</div>
              <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>Most popular - Full support</p>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                <li style={{ padding: '0.5rem 0', color: 'white' }}>✅ Everything in Essential</li>
                <li style={{ padding: '0.5rem 0', color: 'white' }}>✅ Your documents reviewed first</li>
                <li style={{ padding: '0.5rem 0', color: 'white' }}>✅ Two 30-minute video calls</li>
                <li style={{ padding: '0.5rem 0', color: 'white' }}>✅ Help with translations</li>
                <li style={{ padding: '0.5rem 0', color: 'white' }}>✅ Application submission guide</li>
                <li style={{ padding: '0.5rem 0', color: 'white' }}>✅ 24/7 chat support</li>
              </ul>
              <Link href="/auth/signup" style={{
                display: 'block',
                background: 'white',
                color: '#0066cc',
                padding: '0.875rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}>
                Choose Professional
              </Link>
            </div>

            {/* Premium Plan */}
            <div style={{
              background: 'white',
              border: '2px solid #e0f2fe',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ fontSize: '1.5rem', color: '#0066cc', marginBottom: '0.5rem' }}>Premium</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>€999</div>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>We do everything for you</p>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                <li style={{ padding: '0.5rem 0', color: '#334155' }}>✅ Everything in Professional</li>
                <li style={{ padding: '0.5rem 0', color: '#334155' }}>✅ Personal case manager</li>
                <li style={{ padding: '0.5rem 0', color: '#334155' }}>✅ Unlimited calls & meetings</li>
                <li style={{ padding: '0.5rem 0', color: '#334155' }}>✅ We prepare all documents</li>
                <li style={{ padding: '0.5rem 0', color: '#334155' }}>✅ We schedule appointments</li>
                <li style={{ padding: '0.5rem 0', color: '#334155' }}>✅ We submit your application</li>
              </ul>
              <Link href="/auth/signup" style={{
                display: 'block',
                background: '#0066cc',
                color: 'white',
                padding: '0.875rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}>
                Choose Premium
              </Link>
            </div>
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
