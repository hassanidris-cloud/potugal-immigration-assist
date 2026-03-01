import Link from 'next/link'
import Head from 'next/head'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Use — WINIT Portugal Immigration</title>
        <meta name="description" content="Terms of use for WINIT Portugal Immigration platform." />
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
          <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1e293b' }}>Terms of Use</h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Last updated: 2026</p>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>1. Acceptance</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>By using WINIT Portugal Immigration (“the Service”), you agree to these terms. If you do not agree, do not use the Service.</p>
          </section>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>2. Service description</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>We provide immigration support and document preparation assistance for Portugal residency applications. We do not guarantee visa approval; outcomes depend on consulate and authority decisions.</p>
          </section>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>3. Your obligations</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>You must provide accurate information and documents. You are responsible for ensuring your application and supporting materials are complete and truthful.</p>
          </section>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>4. Fees and refunds</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>Fees are as stated at sign-up. Refund policy will be communicated at purchase. Government and third-party fees are separate.</p>
          </section>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>5. Limitation of liability</h2>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>To the extent permitted by law, our liability is limited to the fees you paid for the Service. We are not liable for decisions by authorities or delays outside our control.</p>
          </section>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '2rem' }}>Replace this with your full legal terms. This is placeholder text.</p>
          <p style={{ marginTop: '2rem' }}>
            <Link href="/" style={{ color: '#0066cc', fontWeight: '600' }}>← Back to home</Link>
          </p>
        </main>
      </div>
    </>
  )
}
