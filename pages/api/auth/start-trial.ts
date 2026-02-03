import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' })
  }

  try {
    // Check if user already has a subscription
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existingSub) {
      // Already has subscription, just return
      return res.status(200).json({ success: true, existing: true })
    }

    // Create 14-day free trial
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan: 'Premium',
        amount: 0,
        currency: 'EUR',
        status: 'active',
        paid_at: new Date().toISOString(),
        expires_at: trialEndsAt.toISOString(),
      })

    if (error) throw error

    res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('Start trial error:', error)
    res.status(500).json({ error: error.message })
  }
}
