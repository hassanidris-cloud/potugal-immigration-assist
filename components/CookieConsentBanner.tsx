import { useEffect, useState } from 'react'
import {
  COOKIE_CONSENT_KEY,
  COOKIE_LAST_EMAIL_KEY,
  deleteCookie,
  getCookie,
  setCookie,
} from '../lib/browserCookies'

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = getCookie(COOKIE_CONSENT_KEY)
    if (!saved) {
      setVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    setCookie(COOKIE_CONSENT_KEY, 'accepted', 180)
    setVisible(false)
  }

  const rejectCookies = () => {
    setCookie(COOKIE_CONSENT_KEY, 'rejected', 180)
    deleteCookie(COOKIE_LAST_EMAIL_KEY)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        right: '1rem',
        zIndex: 10000,
        background: '#0f172a',
        color: '#fff',
        borderRadius: '12px',
        padding: '1rem',
        boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
        maxWidth: '760px',
        margin: '0 auto',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
        We use cookies to keep you signed in and remember your email for faster login.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={acceptCookies}
          style={{
            background: '#22c55e',
            color: '#052e16',
            border: 'none',
            borderRadius: '8px',
            padding: '0.55rem 1rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Accept cookies
        </button>
        <button
          type="button"
          onClick={rejectCookies}
          style={{
            background: '#e2e8f0',
            color: '#0f172a',
            border: 'none',
            borderRadius: '8px',
            padding: '0.55rem 1rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reject
        </button>
      </div>
    </div>
  )
}
