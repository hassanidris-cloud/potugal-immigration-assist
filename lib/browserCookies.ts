export const COOKIE_CONSENT_KEY = 'winit_cookie_consent'
export const COOKIE_LAST_EMAIL_KEY = 'winit_last_email'

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
}

export function hasCookieConsent(): boolean {
  return getCookie(COOKIE_CONSENT_KEY) === 'accepted'
}
