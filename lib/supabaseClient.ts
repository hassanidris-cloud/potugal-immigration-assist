import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import { createClient as createBrowserClient } from './supabase/browser'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

/** Browser client: uses cookies for session persistence (stay logged in). Use in pages/components. */
export const supabase = createBrowserClient()

/** Server-side only (e.g. API routes). Do not use in pages/components. */
export function getServiceSupabase(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createSupabaseClient(supabaseUrl, serviceRoleKey)
}
