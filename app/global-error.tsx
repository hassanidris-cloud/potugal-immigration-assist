'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
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
            Something went wrong
          </h1>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            An error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1rem',
              background: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              marginRight: '0.5rem',
            }}
          >
            Try again
          </button>
          <a href="/" style={{ color: '#0066cc', fontWeight: 600 }}>Go back home</a>
        </div>
      </body>
    </html>
  )
}
