import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { authenticateRequest } from '../../../lib/serverAuth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const auth = await authenticateRequest(req)
      if (!auth.ok) {
        return res.status(auth.status).json({ error: auth.error })
      }

      const { invoice_id } = req.body as { invoice_id?: string }
      if (!invoice_id || typeof invoice_id !== 'string') {
        return res.status(400).json({ error: 'Missing invoice_id' })
      }

      const { data: invoice, error: invoiceError } = await auth.supabaseAdmin
        .from('invoices')
        .select('id, amount, currency, description, status, cases:case_id(user_id)')
        .eq('id', invoice_id)
        .single()

      if (invoiceError || !invoice) {
        return res.status(404).json({ error: 'Invoice not found' })
      }

      const caseOwner =
        Array.isArray(invoice.cases) ? invoice.cases[0] : invoice.cases
      const invoiceOwnerId = caseOwner?.user_id
      if (!auth.isAdmin && invoiceOwnerId !== auth.user.id) {
        return res.status(403).json({ error: 'Forbidden' })
      }
      if (invoice.status === 'paid') {
        return res.status(400).json({ error: 'Invoice is already paid' })
      }

      const amountCents = Math.round(Number(invoice.amount) * 100)
      if (!Number.isFinite(amountCents) || amountCents <= 0) {
        return res.status(400).json({ error: 'Invalid invoice amount' })
      }

      const currency =
        typeof invoice.currency === 'string' && invoice.currency.trim()
          ? invoice.currency.toLowerCase()
          : 'eur'
      const description =
        typeof invoice.description === 'string' && invoice.description.trim()
          ? invoice.description
          : 'Invoice payment'
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: description,
                description: 'Portugal Immigration – Invoice',
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pay/cancel`,
        metadata: {
          invoice_id,
          expected_amount_cents: String(amountCents),
          expected_currency: currency,
        },
      })

      return res.status(200).json({ sessionId: session.id, url: session.url })
    } catch (error: any) {
      console.error('Checkout session error:', error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
