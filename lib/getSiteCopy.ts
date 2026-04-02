import siteCopy from '../content/site-copy.json'

export type SiteCopy = typeof siteCopy

/** Returns the full site copy. Use copy.nav, copy.home, copy.contact, etc. */
export function getSiteCopy(): SiteCopy {
  return siteCopy
}

/** Replaces {year} in a string with the current year. */
export function replaceYear(text: string): string {
  return text.replace(/\{year\}/g, String(new Date().getFullYear()))
}
