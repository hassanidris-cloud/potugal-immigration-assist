import { useEffect, useState, useRef, FormEvent } from 'react'
import { supabase } from '../lib/supabaseClient'

type Message = {
  id: string
  case_id: string
  sender_id: string
  content: string
  created_at: string
  sender?: { full_name?: string; role?: string }
}

type CaseChatProps = {
  caseId: string
  caseUserId: string
  isSpecialist: boolean
  title?: string
  style?: React.CSSProperties
}

export default function CaseChat({ caseId, caseUserId, isSpecialist, title, style }: CaseChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setCurrentUserId(user?.id ?? null))
  }, [])

  const loadMessages = async () => {
    const { data } = await supabase
      .from('case_messages')
      .select(`
        id,
        case_id,
        sender_id,
        content,
        created_at,
        sender:users!sender_id(full_name, role)
      `)
      .eq('case_id', caseId)
      .order('created_at', { ascending: true })
    setMessages((data as Message[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!caseId || !currentUserId) return
    loadMessages()
    const channel = supabase
      .channel(`case_messages:${caseId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'case_messages', filter: `case_id=eq.${caseId}` },
        () => loadMessages()
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [caseId, currentUserId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending || !currentUserId) return
    setSending(true)
    setInput('')
    try {
      await supabase.from('case_messages').insert({
        case_id: caseId,
        sender_id: currentUserId!,
        content: text,
      })
      loadMessages()
    } catch (err) {
      console.error('Send message error:', err)
    } finally {
      setSending(false)
    }
  }

  const label = (m: Message) => {
    if (m.sender_id === currentUserId) return 'You'
    if (m.sender?.role === 'admin') return 'Specialist'
    return m.sender?.full_name || 'Client'
  }

  const isOwn = (m: Message) => m.sender_id === currentUserId

  if (!currentUserId || loading) {
    return (
      <div style={{ padding: '1rem', color: '#64748b', ...style }}>
        {title && <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem' }}>{title}</h3>}
        {!currentUserId ? 'Sign in to use chat.' : 'Loading chat...'}
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 280,
        maxHeight: 420,
        ...style,
      }}
    >
      <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>
          {title || (isSpecialist ? 'Chat with client' : 'Message your specialist')}
        </h3>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
          Stay connected. Replies may take a short time.
        </p>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {messages.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>No messages yet. Say hello!</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: isOwn(m) ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '0.6rem 0.9rem',
                borderRadius: '12px',
                background: isOwn(m) ? 'linear-gradient(135deg, #0066cc, #00c896)' : '#f1f5f9',
                color: isOwn(m) ? '#fff' : '#1e293b',
              }}
            >
              <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.25rem' }}>{label(m)}</div>
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.95rem' }}>{m.content}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '0.25rem' }}>
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={sendMessage}
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          style={{
            flex: 1,
            padding: '0.6rem 0.75rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          style={{
            padding: '0.6rem 1rem',
            background: input.trim() && !sending ? 'linear-gradient(135deg, #0066cc, #00c896)' : '#cbd5e1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
            fontSize: '0.9rem',
          }}
        >
          {sending ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
