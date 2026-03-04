import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticateRequest } from '../../lib/serverAuth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await authenticateRequest(req)
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error })
  }

  const supabase = auth.supabaseAdmin

  if (req.method === 'GET') {
    try {
      const requestedUserId = typeof req.query.user_id === 'string' ? req.query.user_id : undefined
      if (requestedUserId && !auth.isAdmin && requestedUserId !== auth.user.id) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      const targetUserId = auth.isAdmin ? requestedUserId : auth.user.id
      const query = supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

      if (targetUserId) {
        query.eq('user_id', targetUserId)
      }

      const { data, error } = await query

      if (error) throw error

      res.status(200).json({ cases: data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { user_id, case_type, visa_type, country_of_origin, target_visa_date } = req.body
      const requestedUserId = typeof user_id === 'string' ? user_id : undefined

      if (!auth.isAdmin && requestedUserId && requestedUserId !== auth.user.id) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      const ownerUserId = auth.isAdmin && requestedUserId ? requestedUserId : auth.user.id

      const { data, error } = await supabase
        .from('cases')
        .insert({
          user_id: ownerUserId,
          case_type,
          visa_type,
          country_of_origin,
          target_visa_date,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      res.status(201).json({ case: data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
