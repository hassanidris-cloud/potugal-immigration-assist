// Test script to create a paid invoice for testing
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

async function createTestInvoice() {
  rl.question('Enter your user email: ', async (email) => {
    try {
      // Find user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.trim())
        .single()

      if (userError || !userData) {
        console.error('❌ User not found with email:', email)
        rl.close()
        return
      }

      console.log('✓ Found user:', userData.id)

      // Check for existing paid invoice
      const { data: existingInvoice } = await supabase
        .from('invoices')
        .select('*')
        .eq('status', 'paid')
        .limit(1)
        .single()

      if (existingInvoice) {
        console.log('✓ User already has a paid invoice')
        console.log('   Invoice ID:', existingInvoice.id)
        console.log('   Amount: €' + existingInvoice.amount)
        console.log('   Plan:', existingInvoice.description)
        rl.close()
        return
      }

      // Create a test paid invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          case_id: null,
          amount: 599.00,
          currency: 'EUR',
          description: 'WINIT Premium Plan - Portugal Immigration Service (TEST)',
          status: 'paid',
          stripe_session_id: 'test_' + Date.now(),
          stripe_payment_intent_id: 'pi_test_' + Date.now(),
          paid_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (invoiceError) {
        console.error('❌ Error creating invoice:', invoiceError)
        rl.close()
        return
      }

      console.log('\n✅ Successfully created test paid invoice!')
      console.log('   Invoice ID:', invoice.id)
      console.log('   Amount: €599.00')
      console.log('   Status: paid')
      console.log('   Plan: Premium (TEST MODE)')
      console.log('\n✓ You can now access the app without payment!')
      console.log('✓ Refresh your browser and go to /onboarding\n')

      rl.close()
    } catch (error) {
      console.error('❌ Error:', error)
      rl.close()
    }
  })
}

createTestInvoice()
