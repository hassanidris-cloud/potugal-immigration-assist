// Create subscriptions table using Supabase client
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

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

async function createSubscriptionsTable() {
  try {
    console.log('🔄 Creating subscriptions table...')
    
    const sql = `
      CREATE TABLE IF NOT EXISTS public.subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        plan TEXT NOT NULL CHECK (plan IN ('Essential', 'Premium', 'Concierge')),
        amount DECIMAL(10, 2) NOT NULL,
        currency TEXT NOT NULL DEFAULT 'EUR',
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired')),
        stripe_session_id TEXT,
        stripe_payment_intent_id TEXT,
        stripe_subscription_id TEXT,
        paid_at TIMESTAMP WITH TIME ZONE,
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
    `

    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      console.error('❌ Error creating table:', error)
      console.log('\n📝 Please run this SQL manually in Supabase SQL Editor:')
      console.log(sql)
      process.exit(1)
    }

    console.log('✅ Subscriptions table created successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    console.log('\n📝 Please create the table manually using the SQL in db/subscriptions.sql')
  }
}

createSubscriptionsTable()
