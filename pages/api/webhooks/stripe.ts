import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { buffer } from 'micro'
import { getServiceSupabase } from '../../../lib/supabaseClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const invoice_id = session.metadata?.invoice_id

      const supabase = getServiceSupabase()

      // Update invoice if this is a case-specific invoice payment
      if (invoice_id) {
        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices')
          .select('id, amount, currency, status')
          .eq('id', invoice_id)
          .single()

        if (invoiceError || !invoice) {
          console.error('Invoice lookup failed for webhook:', invoice_id, invoiceError)
          return res.status(200).json({ received: true })
        }

        const expectedAmountCents = Math.round(Number(invoice.amount) * 100)
        const chargedAmountCents = session.amount_total ?? 0
        const expectedCurrency = (invoice.currency || 'eur').toLowerCase()
        const chargedCurrency = (session.currency || '').toLowerCase()
        const metadataAmount = Number(session.metadata?.expected_amount_cents)
        const metadataCurrency = (session.metadata?.expected_currency || '').toLowerCase()

        const amountMismatch =
          !Number.isFinite(expectedAmountCents) || chargedAmountCents !== expectedAmountCents
        const currencyMismatch = chargedCurrency !== expectedCurrency
        const metadataMismatch =
          (Number.isFinite(metadataAmount) && metadataAmount !== expectedAmountCents) ||
          (metadataCurrency && metadataCurrency !== expectedCurrency)

        if (session.payment_status !== 'paid' || amountMismatch || currencyMismatch || metadataMismatch) {
          console.error('Invoice payment verification failed', {
            invoice_id,
            chargedAmountCents,
            expectedAmountCents,
            chargedCurrency,
            expectedCurrency,
            paymentStatus: session.payment_status,
          })
          return res.status(200).json({ received: true })
        }

        await supabase
          .from('invoices')
          .update({
            status: 'paid',
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
          })
          .eq('id', invoice_id)
      }
    }

    res.status(200).json({ received: true })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
