import type { NextApiRequest, NextApiResponse } from 'next'

const BASE = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'https://winit.com'

const PUBLIC_PATHS = [
  '',
  '/why-portugal',
  '/visa-programs',
  '/contact',
  '/auth/login',
  '/auth/signup',
  '/privacy',
  '/terms',
  '/cookies',
]

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const urls = PUBLIC_PATHS.map(
    (path) => `  <url><loc>${BASE}${path}</loc><changefreq>weekly</changefreq><priority>${path === '' ? '1.0' : '0.8'}</priority></url>`
  ).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.status(200).send(xml)
}
