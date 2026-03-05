import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@supabase/ssr'
import { getServiceSupabase } from '../../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  if (req.method === 'GET') {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('reviews')
      .select('id, content, rating, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    const withNames = await Promise.all(
      (data || []).map(async (r) => {
        const { data: user } = await supabase.from('users').select('full_name').eq('id', r.user_id).single()
        return {
          id: r.id,
          content: r.content,
          rating: r.rating,
          created_at: r.created_at,
          author_name: user?.full_name || 'Client',
        }
      })
    )
    return res.status(200).json({ reviews: withNames })
  }

  if (req.method === 'POST') {
    const server = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        getAll() {
          return Object.entries(req.cookies || {}).map(([name, value]) => ({
            name,
            value: value || '',
            options: {},
          }))
        },
        setAll() {},
      },
    })
    const { data: { user } } = await server.auth.getUser()
    if (!user) {
      return res.status(401).json({ error: 'You must be signed in to write a review' })
    }
    const body = req.body as { content?: string; rating?: number }
    const content = typeof body.content === 'string' ? body.content.trim() : ''
    if (!content || content.length < 10) {
      return res.status(400).json({ error: 'Review must be at least 10 characters' })
    }
    const rating =
      typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5
        ? body.rating
        : null
    const supabase = getServiceSupabase()
    const { data: inserted, error } = await supabase
      .from('reviews')
      .insert({ user_id: user.id, content, rating })
      .select('id, content, rating, created_at')
      .single()
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    return res.status(201).json({ review: inserted })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
