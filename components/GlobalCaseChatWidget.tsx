import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import CaseChatWidget from './CaseChatWidget'

/**
 * Renders the "Message your specialist" widget whenever the user is logged in and has a case.
 * On /case/[id]/... uses that case; otherwise uses the user's most recent case.
 */
export default function GlobalCaseChatWidget() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [caseId, setCaseId] = useState<string | null>(null)
  const [caseUserId, setCaseUserId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!mounted || !user) {
        if (mounted) setUserId(null)
        return
      }
      setUserId(user.id)

      const pathId = router.query.id as string | undefined
      if (pathId && router.pathname.startsWith('/case/[id]')) {
        const { data: caseRow } = await supabase
          .from('cases')
          .select('id, user_id')
          .eq('id', pathId)
          .single()
        if (mounted && caseRow && caseRow.user_id === user.id) {
          setCaseId(caseRow.id)
          setCaseUserId(caseRow.user_id)
          return
        }
      }

      const { data: cases } = await supabase
        .from('cases')
        .select('id, user_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
      if (mounted && cases && cases.length > 0) {
        setCaseId(cases[0].id)
        setCaseUserId(cases[0].user_id)
      } else if (mounted) {
        setCaseId(null)
        setCaseUserId(null)
      }
    }

    init()
    return () => { mounted = false }
  }, [router.pathname, router.query.id])

  if (!userId || !caseId || !caseUserId) return null

  return (
    <CaseChatWidget
      caseId={caseId}
      caseUserId={caseUserId}
      title="Message your specialist"
    />
  )
}
