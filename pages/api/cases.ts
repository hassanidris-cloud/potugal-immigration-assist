import type { NextApiRequest, NextApiResponse } from 'next'
import { getServiceSupabase } from '../../lib/supabaseClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = getServiceSupabase()

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      res.status(200).json({ cases: data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { user_id, case_type, visa_type, country_of_origin, target_visa_date } = req.body

      const { data, error } = await supabase
        .from('cases')
        .insert({
          user_id,
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
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
