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
      const { plan, price, userId } = req.body

      if (!userId) {
        return res.status(400).json({ error: 'User ID required' })
      }

      // Check if user already has a subscription (like trial)
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      let subscriptionId: string

      if (existingSubscription && (existingSubscription.status === 'trial' || existingSubscription.status === 'expired')) {
        // Update existing trial/expired subscription to pending
        const { data: updatedSub, error: updateError } = await supabase
          .from('subscriptions')
          .update({
            plan: plan,
            amount: price,
            status: 'pending',
          })
          .eq('id', existingSubscription.id)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating subscription:', updateError)
          return res.status(500).json({ error: 'Failed to update subscription' })
        }
        subscriptionId = updatedSub.id
      } else {
        // Create new subscription record
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan: plan,
            amount: price,
            currency: 'EUR',
            status: 'pending',
          })
          .select()
          .single()

        if (subscriptionError) {
          console.error('Error creating subscription:', subscriptionError)
          return res.status(500).json({ error: 'Failed to create subscription' })
        }
        subscriptionId = subscriptionData.id
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `WINIT ${plan} Plan`,
                description: 'Portugal Immigration Service Package',
              },
              unit_amount: Math.round(price * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/pay/cancel`,
        metadata: {
          subscription_id: subscriptionId,
          user_id: userId,
          plan: plan,
        },
        client_reference_id: userId,
      })

      // Update subscription with session ID
      await supabase
        .from('subscriptions')
        .update({ stripe_session_id: session.id })
        .eq('id', subscriptionId)

      res.status(200).json({ sessionId: session.id, url: session.url })
    } catch (error: any) {
      console.error('Checkout session error:', error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
