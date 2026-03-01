/**
 * Add a user manually: create in Supabase Auth + insert into public.users.
 * Run: node scripts/add-user-manually.js
 * Requires .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const envPath = path.join(__dirname, '..', '.env.local')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local not found')
  process.exit(1)
}

const env = fs.readFileSync(envPath, 'utf8')
const envVars = {}
env.split('\n').forEach((line) => {
  line = line.trim()
  if (line && !line.startsWith('#')) {
    const idx = line.indexOf('=')
    if (idx > 0) envVars[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const serviceKey = envVars['SUPABASE_SERVICE_ROLE_KEY']
if (!supabaseUrl || !serviceKey) {
  console.error('❌ Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const ask = (q) => new Promise((resolve) => rl.question(q, resolve))

async function main() {
  console.log('Add a user manually (Auth + public.users)\n')
  const email = (await ask('Email: ')).trim()
  const password = (await ask('Password (min 6 chars): ')).trim()
  const fullName = (await ask('Full name (optional): ')).trim()
  const role = (await ask('Role (client / admin) [client]: ')).trim() || 'client'

  if (!email || !password) {
    console.error('❌ Email and password required')
    rl.close()
    process.exit(1)
  }
  if (!['client', 'admin'].includes(role)) {
    console.error('❌ Role must be client or admin')
    rl.close()
    process.exit(1)
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || null },
    app_metadata: { role },
  })

  if (authError) {
    console.error('❌ Auth create failed:', authError.message)
    rl.close()
    process.exit(1)
  }

  const userId = authData.user.id
  const { error: insertError } = await supabase.from('users').insert({
    id: userId,
    email,
    full_name: fullName || null,
    role,
  })

  if (insertError) {
    console.error('❌ public.users insert failed:', insertError.message)
    console.log('Auth user was created (id:', userId, '). Add a row in Table Editor → public → users with this id and email.')
    rl.close()
    process.exit(1)
  }

  console.log('\n✓ User added.')
  console.log('  Id:', userId)
  console.log('  Email:', email)
  console.log('  Role:', role)
  console.log('They can log in at your app login page.')
  rl.close()
}

main().catch((e) => {
  console.error(e)
  rl.close()
  process.exit(1)
})
