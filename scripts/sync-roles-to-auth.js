/**
 * Sync role from public.users to Supabase Auth (app_metadata).
 * Run after setting role in public.users (e.g. set-admin.sql) so role appears
 * in Authentication → Users in the Supabase dashboard.
 *
 * Usage: node scripts/sync-roles-to-auth.js
 * Requires: .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

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

async function main() {
  const { data: users, error } = await supabase.from('users').select('id, email, role')
  if (error) {
    console.error('❌ Failed to read public.users:', error.message)
    process.exit(1)
  }
  if (!users?.length) {
    console.log('No users in public.users')
    return
  }
  let ok = 0
  for (const u of users) {
    const { data: authUser } = await supabase.auth.admin.getUserById(u.id)
    const existing = (authUser?.user?.app_metadata && typeof authUser.user.app_metadata === 'object') ? { ...authUser.user.app_metadata } : {}
    const { error: updateErr } = await supabase.auth.admin.updateUserById(u.id, {
      app_metadata: { ...existing, role: u.role || 'client' },
    })
    if (updateErr) {
      console.warn(`⚠️ ${u.email}: ${updateErr.message}`)
    } else {
      ok++
      console.log(`✓ ${u.email} → role: ${u.role || 'client'}`)
    }
  }
  console.log(`\nDone. Synced ${ok}/${users.length} users to Auth app_metadata.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
