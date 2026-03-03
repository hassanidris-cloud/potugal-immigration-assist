import Head from 'next/head'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found — WINIT Portugal Immigration</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'sans-serif',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>
        Page not found
      </h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        This page could not be found.
      </p>
      <a href="/" style={{ color: '#0066cc', fontWeight: '600' }}>Go back home</a>
    </div>
    </>
  )
}
