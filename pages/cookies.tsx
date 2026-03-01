import Link from 'next/link'
import Head from 'next/head'

export default function Cookies() {
  return (
    <>
      <Head>
        <title>Cookie Policy — WINIT Portugal Immigration</title>
        <meta name="description" content="How WINIT uses cookies on its website." />
      </Head>
      <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <nav style={{ background: '#1e293b', padding: '1rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <img src="/logo.png" alt="WINIT" width={70} height={41} style={{ display: 'block', height: 36, width: 'auto' }} />
            </Link>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Back to home</Link>
          </div>
        </nav>
        <main style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1e293b' }}>Cookie Policy</h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Last updated: 2026</p>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>What are cookies?</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>Cookies are small text files stored on your device when you visit a website. They help the site work properly and can be used for analytics or preferences.</p>
          </section>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>How we use cookies</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>We use essential cookies to run the site (e.g. keeping you logged in). If you accept our cookie banner, we may also use optional cookies for analytics to improve the site. We do not use cookies for advertising.</p>
          </section>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>Managing cookies</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>You can change your choice using the cookie banner or your browser settings. Blocking essential cookies may affect how the site works.</p>
          </section>
          <p style={{ marginTop: '2rem' }}>
            <Link href="/" style={{ color: '#0066cc', fontWeight: '600' }}>← Back to home</Link>
          </p>
        </main>
      </div>
    </>
  )
}
