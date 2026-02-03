import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, email, fullName, phone } = req.body

  if (!userId || !email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Check if user profile already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (existingUser) {
      // Profile already exists, just return success
      return res.status(200).json({ success: true })
    }

    // Insert user profile using service role (bypasses RLS)
    const { error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email,
        full_name: fullName,
        phone,
        role: 'client',
      })

    if (error) throw error

    // Create a 14-day free trial subscription
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14) // 14 days free trial

    // Use INSERT with ON CONFLICT to handle if subscription already exists
    const { error: trialError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan: 'Premium', // Give them Premium trial
        amount: 0,
        currency: 'EUR',
        status: 'active', // Make it active immediately
        paid_at: new Date().toISOString(),
        expires_at: trialEndsAt.toISOString(),
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })

    if (trialError) {
      console.error('Trial creation error:', trialError)
      // Don't fail the whole signup if trial creation fails
    }

    res.status(200).json({ success: true, hasTrial: !trialError })
  } catch (error: any) {
    console.error('Complete signup error:', error)
    res.status(500).json({ error: error.message })
  }
}
