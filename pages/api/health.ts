import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const contactFormConfigured = Boolean(process.env.RESEND_API_KEY)
    res.status(200).json({
      status: 'ok',
      message: 'API is running',
      contactFormConfigured,
    })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
