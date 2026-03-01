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
      return res.status(200).json({ success: true, message: 'User already exists' })
    }
    if (checkError && checkError.code !== 'PGRST116') {
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
      // Mirror role into Auth app_metadata so it shows in Supabase Authentication → Users
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        app_metadata: { role: 'client' },
      })
    }

    res.status(200).json({ success: true, message: 'Profile created' })
  } catch (error: any) {
    console.error('Complete signup error:', error)
    res.status(500).json({ error: error.message || 'Signup failed' })
  }
}
