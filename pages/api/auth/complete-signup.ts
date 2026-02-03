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
    console.log('Step 1: Verifying auth user exists for:', userId)

    // First verify the user exists in auth.users (because public.users has FK to auth.users)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (authError || !authUser) {
      console.error('Auth user not found:', authError, userId)
      return res.status(400).json({ error: 'User not found in authentication system' })
    }

    console.log('Step 2: Checking if user profile already exists')

    // Check if user profile already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (existingUser) {
      console.log('User profile already exists, skipping creation')
      // User already exists, just ensure subscription exists
      const { data: existingSub } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .single()
      
      if (existingSub) {
        return res.status(200).json({ success: true, message: 'User and subscription already exist' })
      }
      // Continue to create subscription below
    } else if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is expected for new users
      throw checkError
    } else {
      // New user, create profile
      console.log('Step 3: Creating user profile')
      
      const { data: newUser, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email,
          full_name: fullName || email.split('@')[0],
          phone: phone || null,
          role: 'client',
        })
        .select()

      if (userError) {
        console.error('User insert error:', userError)
        throw userError
      }
      console.log('User profile created:', newUser)
    }

    // Create a 14-day free trial subscription
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    console.log('Step 4: Creating subscription for user:', userId)

    const { data: subInserted, error: trialError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan: 'Premium',
        amount: 0,
        status: 'active',
        expires_at: trialEndsAt.toISOString(),
      })
      .select()

    if (trialError) {
      console.error('Subscription creation error:', trialError)
      // If it's a duplicate, that's OK
      if (!trialError.message.includes('duplicate') && !trialError.message.includes('violates unique constraint')) {
        throw trialError
      }
      console.log('Subscription already exists or duplicate, continuing')
    } else {
      console.log('Subscription created successfully:', subInserted)
    }

    res.status(200).json({ success: true, message: 'Profile and subscription created' })
  } catch (error: any) {
    console.error('Complete signup error:', error)
    res.status(500).json({ error: error.message || 'Signup failed' })
  }
}
