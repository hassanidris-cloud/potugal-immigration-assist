import Link from 'next/link'
import Head from 'next/head'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — WINIT Portugal Immigration</title>
        <meta name="description" content="Privacy policy for WINIT Portugal Immigration. How we collect, use, and protect your data." />
      </Head>
      <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <nav style={{ background: '#1e293b', padding: '1rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>WINIT</Link>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Back to home</Link>
          </div>
        </nav>
        <main style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1e293b' }}>Privacy Policy</h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Last updated: 2026</p>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>1. Information we collect</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>We collect information you provide when you sign up, complete your profile, upload documents, or contact us. This may include name, email, address, nationality, and documents required for your visa application.</p>
          </section>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>2. How we use it</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>We use your information to provide immigration support, communicate with you, process payments, and comply with legal obligations. We do not sell your data to third parties.</p>
          </section>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>3. Data security</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>We use industry-standard measures to protect your data, including encryption and secure storage. Access is limited to authorised personnel and service providers necessary for your case.</p>
          </section>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>4. Your rights</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>You may request access, correction, or deletion of your personal data. Contact us using the details on our Contact page. If you are in the EU/EEA, you have additional rights under GDPR.</p>
          </section>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>5. Cookies</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>We use essential cookies to run the site and optional cookies if you accept our cookie banner. See our <Link href="/cookies" style={{ color: '#0066cc' }}>Cookie Policy</Link> for details.</p>
          </section>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '2rem' }}>Replace this with your full legal privacy policy. This is placeholder text.</p>
          <p style={{ marginTop: '2rem' }}>
            <Link href="/" style={{ color: '#0066cc', fontWeight: '600' }}>← Back to home</Link>
          </p>
        </main>
      </div>
    </>
  )
}
