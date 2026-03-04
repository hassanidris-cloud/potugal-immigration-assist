import type { NextApiRequest, NextApiResponse } from 'next'

// Who receives assessment/contact form submissions. Without a verified domain, Resend only allows sending to the account email (e.g. hassan_idris@icloud.com). After verifying winit.biz at resend.com/domains, you can use idris@winit.biz.
const DEFAULT_CONTACT_EMAIL = 'idris@winit.biz'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, message } = req.body || {}

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' })
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' })
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('Contact form: RESEND_API_KEY is not set. Add it in Vercel → Project → Settings → Environment Variables.')
    return res.status(500).json({
      error: 'Sorry, the contact form is temporarily unavailable. Please email us directly at idris@winit.biz.',
    })
  }

  const toEmail = (process.env.CONTACT_TO_EMAIL || DEFAULT_CONTACT_EMAIL).trim()
  if (!toEmail) {
    console.error('Contact form: CONTACT_TO_EMAIL is empty')
    return res.status(500).json({
      error: 'Sorry, the contact form is temporarily unavailable. Please email us directly.',
    })
  }

  const from = process.env.RESEND_FROM_EMAIL || 'WinIT Contact <onboarding@resend.dev>'
  const subject = `WinIT inquiry from ${name.trim()}`
  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
    <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
    <p><strong>Phone:</strong> ${escapeHtml((phone && String(phone).trim()) ? String(phone).trim() : '—')}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message.trim()).replace(/\n/g, '<br>')}</p>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [toEmail],
        reply_to: email.trim(),
        subject,
        html,
      }),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      console.error('Resend API error', response.status, data)
      return res.status(500).json({
        error: data.message || 'Failed to send email. Please try again or email us directly.',
      })
    }
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Contact send error', err)
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' })
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
