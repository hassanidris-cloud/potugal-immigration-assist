// Create test subscription for bypassing payment during development
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

// Read environment variables
const envPath = path.join(__dirname, '..', '.env.local')
const envFile = fs.readFileSync(envPath, 'utf8')
const envVars = {}
envFile.split('\n').forEach(line => {
  line = line.trim()
  if (line && !line.startsWith('#')) {
    const parts = line.split('=')
    if (parts.length >= 2) {
      const key = parts[0].trim()
      const value = parts.slice(1).join('=').trim()
      envVars[key] = value
    }
  }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('\n📋 TEST MODE SUBSCRIPTION SETUP')
console.log('================================\n')
console.log('This will create an active subscription so you can test')
console.log('the app without going through Stripe payment.\n')

rl.question('Enter your email address: ', async (email) => {
  try {
    // Find user by email
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers()
    
    let userId = null
    if (authUser && authUser.users) {
      const user = authUser.users.find(u => u.email === email.trim())
      if (user) {
        userId = user.id
      }
    }

    if (!userId) {
      console.error('\n❌ User not found with email:', email)
      console.log('Make sure you have signed up first!\n')
      rl.close()
      return
    }

    console.log('✓ Found user:', userId)

    // Check for existing active subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (existingSub) {
      console.log('\n✓ You already have an active subscription!')
      console.log('   Plan:', existingSub.plan)
      console.log('   Amount: €' + existingSub.amount)
      console.log('   Status:', existingSub.status)
      console.log('\n✓ You can access the app - go to /onboarding\n')
      rl.close()
      return
    }

    // Create test subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan: 'Premium',
        amount: 599.00,
        currency: 'EUR',
        status: 'active',
        stripe_session_id: 'test_session_' + Date.now(),
        stripe_payment_intent_id: 'pi_test_' + Date.now(),
        paid_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (subError) {
      console.error('\n❌ Error creating subscription:', subError)
      rl.close()
      return
    }

    console.log('\n✅ SUCCESS! Test subscription created')
    console.log('================================')
    console.log('Plan: Premium (TEST MODE)')
    console.log('Amount: €599.00')
    console.log('Status: active')
    console.log('Expires: 1 year from now')
    console.log('\n🎉 You can now access the full app!')
    console.log('👉 Go to: http://localhost:3001/onboarding\n')

    rl.close()
  } catch (error) {
    console.error('\n❌ Error:', error)
    rl.close()
  }
})
