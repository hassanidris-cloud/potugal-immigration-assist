import Link from 'next/link'
import { useState, useEffect } from 'react'

const COOKIE_CONSENT_KEY = 'winit-cookie-consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const accepted = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!accepted) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="cookie-banner-inner">
        <p className="cookie-banner-text">
          We use essential cookies to run the site and optional cookies to improve it. By continuing you accept our use of cookies.{' '}
          <Link href="/cookies" className="cookie-banner-link">Cookie Policy</Link>.
        </p>
        <div className="cookie-banner-actions">
          <button type="button" onClick={accept} className="cookie-banner-btn">
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
