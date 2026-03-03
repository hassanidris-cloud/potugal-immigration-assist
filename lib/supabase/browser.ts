import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Supabase client for browser (pages/components).
 * Uses cookies for session persistence so users stay logged in when they
 * visit the website again. Middleware refreshes the session on each request
 * and keeps cookies in sync.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
