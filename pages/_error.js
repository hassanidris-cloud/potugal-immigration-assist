function Error({ statusCode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>
        {statusCode ? `Error ${statusCode}` : 'Something went wrong'}
      </h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        {statusCode === 404 ? 'This page could not be found.' : 'An error occurred. Please try again.'}
      </p>
      <a href="/" style={{ color: '#0066cc', fontWeight: '600' }}>Go back home</a>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
