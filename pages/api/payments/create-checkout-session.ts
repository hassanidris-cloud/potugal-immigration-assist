import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { invoice_id, amount, currency, description } = req.body
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'

      // Invoice payment (for admin-created invoices)
      if (invoice_id && amount != null) {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: (currency || 'eur').toLowerCase(),
                product_data: {
                  name: description || 'Invoice payment',
                  description: 'Portugal Immigration – Invoice',
                },
                unit_amount: Math.round(Number(amount) * 100),
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${baseUrl}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/pay/cancel`,
          metadata: { invoice_id },
        })
        return res.status(200).json({ sessionId: session.id, url: session.url })
      }

      return res.status(400).json({ error: 'Plan checkout is no longer available. Payment is arranged via contact. For invoice payment use invoice_id and amount.' })
    } catch (error: any) {
      console.error('Checkout session error:', error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
