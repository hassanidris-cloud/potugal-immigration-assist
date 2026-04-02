import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import AuthNavLinks from './AuthNavLinks'
import { getSiteCopy } from '../lib/getSiteCopy'

const nav = getSiteCopy().nav

const dropdownStyle = {
  position: 'absolute' as const,
  top: '100%',
  left: 0,
  marginTop: '0.25rem',
  background: 'rgba(30,41,59,0.98)',
  borderRadius: '8px',
  padding: '0.5rem 0',
  minWidth: '180px',
  boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
}

export default function SiteNav() {
  const router = useRouter()
  const [navOpen, setNavOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  useEffect(() => {
    const onRouteChange = () => {
      setNavOpen(false)
      setServicesOpen(false)
    }
    router.events?.on?.('routeChangeComplete', onRouteChange)
    return () => router.events?.off?.('routeChangeComplete', onRouteChange)
  }, [router.events])

  useEffect(() => {
    if (!navOpen) return
    const onResize = () => { if (typeof window !== 'undefined' && window.innerWidth > 767) setNavOpen(false) }
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false) }
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [navOpen])

  const closeBoth = () => {
    setServicesOpen(false)
    setNavOpen(false)
  }

  return (
    <nav className={`home-nav defesa-nav ${navOpen ? 'nav-open' : ''}`}>
      <div className="home-nav-inner">
        <Link href="/" className="home-nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <Image src="/logo.png" alt={nav.brand} width={70} height={41} style={{ display: 'block', height: 36, width: 'auto' }} priority />
          <span className="home-nav-logo-text">{nav.brand}</span>
        </Link>
        <button
          type="button"
          className="home-nav-hamburger"
          onClick={() => setNavOpen((o) => !o)}
          aria-expanded={navOpen}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
        <div className="home-nav-links">
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setServicesOpen((o) => !o)}
              className="home-nav-link-btn no-underline font-medium"
            >
              {nav.services_dropdown} ▾
            </button>
            {(servicesOpen || navOpen) && (
              <div style={{ ...dropdownStyle, position: navOpen ? 'static' : 'absolute' }}>
                <Link href="/visa-d2" onClick={closeBoth} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff' }}>{nav.d2}</Link>
                <Link href="/visa-d7" onClick={closeBoth} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff' }}>{nav.d7}</Link>
                <Link href="/visa-d8" onClick={closeBoth} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff' }}>{nav.d8}</Link>
                <Link href="/services" onClick={closeBoth} style={{ display: 'block', padding: '0.5rem 1rem', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.1)' }}>{nav.all_services}</Link>
              </div>
            )}
          </div>
          <Link href="/why-portugal" onClick={closeBoth} className="no-underline font-medium">{nav.why_portugal}</Link>
          <Link href="/how-we-work" onClick={closeBoth} className="no-underline font-medium">{nav.how_we_work}</Link>
          <Link href="/faq" onClick={closeBoth} className="no-underline font-medium">{nav.faq}</Link>
          <Link href="/contact" onClick={closeBoth} className="no-underline font-medium">{nav.contact}</Link>
          <AuthNavLinks onNavigate={closeBoth} linkClass="no-underline font-medium" signupClass="home-nav-signup no-underline" />
        </div>
      </div>
    </nav>
  )
}
