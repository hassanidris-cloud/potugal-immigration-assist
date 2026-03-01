import { NextApiRequest, NextApiResponse } from 'next'

// Subscriptions removed; payment is arranged via contact after signup.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  res.status(200).json({ success: true, message: 'Trial/subscription no longer used' })
}
