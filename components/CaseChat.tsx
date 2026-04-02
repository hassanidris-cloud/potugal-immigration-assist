import { useEffect, useState, useRef, FormEvent, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

type Message = {
  id: string
  case_id: string
  sender_id: string
  content: string
  created_at: string
  sender?: { full_name?: string; email?: string; role?: string }
}

type CaseChatProps = {
  caseId: string
  caseUserId: string
  isSpecialist: boolean
  title?: string
  style?: React.CSSProperties
  hideHeader?: boolean
  /** Called when a new message from the other party arrives (e.g. to show notification). */
  onNewMessage?: (message: Message) => void
}

const TYPING_DEBOUNCE_MS = 400
const TYPING_STOP_MS = 2000
const TYPING_DISPLAY_MS = 3500
const POLL_INTERVAL_MS = 15000

export default function CaseChat(props: CaseChatProps) {
  const { caseId, isSpecialist, title, style, hideHeader, onNewMessage } = props
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserName, setCurrentUserName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [input, setInput] = useState('')
  const [typingFrom, setTypingFrom] = useState<{ name: string } | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingBroadcastRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSeenMessageIdRef = useRef<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id ?? null)
      if (user?.id) {
        supabase.from('users').select('full_name, email').eq('id', user.id).single().then(({ data }) => {
          const name = data?.full_name || data?.email || 'You'
          setCurrentUserName(name)
        })
      }
    })
  }, [])

  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from('case_messages')
      .select(`
        id,
        case_id,
        sender_id,
        content,
        created_at,
        sender:users!sender_id(full_name, email, role)
      `)
      .eq('case_id', caseId)
      .order('created_at', { ascending: true })
    const list = (data as Message[]) || []
    setMessages(list)
    setLoading(false)
    return list
  }, [caseId])

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
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload?.user_id === currentUserId) return
        setTypingFrom({ name: payload?.user_name || 'Someone' })
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => setTypingFrom(null), TYPING_DISPLAY_MS)
      })
      .on('broadcast', { event: 'typing_stop' }, ({ payload }) => {
        if (payload?.user_id === currentUserId) return
        setTypingFrom(null)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
          typingTimeoutRef.current = null
        }
      })
      .subscribe()
    channelRef.current = channel

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      if (typingBroadcastRef.current) clearTimeout(typingBroadcastRef.current)
      supabase.removeChannel(channel)
    }
  }, [caseId, currentUserId, loadMessages])

  useEffect(() => {
    if (!caseId || !currentUserId) return
    const interval = setInterval(loadMessages, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [caseId, currentUserId, loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingFrom])

  useEffect(() => {
    if (messages.length === 0 || !currentUserId) return
    const last = messages[messages.length - 1]
    if (lastSeenMessageIdRef.current === null) {
      lastSeenMessageIdRef.current = last.id
      return
    }
    if (lastSeenMessageIdRef.current === last.id) return
    lastSeenMessageIdRef.current = last.id
    if (last.sender_id !== currentUserId && onNewMessage) onNewMessage(last)
  }, [messages, currentUserId, onNewMessage])

  const broadcastTyping = useCallback(() => {
    const ch = channelRef.current
    if (!ch) return
    ch.send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: currentUserId, user_name: currentUserName },
    })
    if (typingBroadcastRef.current) clearTimeout(typingBroadcastRef.current)
    typingBroadcastRef.current = setTimeout(() => {
      ch.send({
        type: 'broadcast',
        event: 'typing_stop',
        payload: { user_id: currentUserId },
      })
      typingBroadcastRef.current = null
    }, TYPING_STOP_MS)
  }, [currentUserId, currentUserName])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    if (typingBroadcastRef.current) clearTimeout(typingBroadcastRef.current)
    typingBroadcastRef.current = setTimeout(broadcastTyping, TYPING_DEBOUNCE_MS)
  }

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending || !currentUserId) return
    setSending(true)
    setInput('')
    if (typingBroadcastRef.current) {
      clearTimeout(typingBroadcastRef.current)
      typingBroadcastRef.current = null
    }
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing_stop',
      payload: { user_id: currentUserId },
    })
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
    return m.sender?.full_name || m.sender?.email || 'Client'
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
      {!hideHeader && (
        <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>
            {title || (isSpecialist ? 'Chat with client' : 'Message your specialist')}
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            Stay connected. Replies may take a short time.
          </p>
        </div>
      )}
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
        {typingFrom && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '0.5rem 0.9rem',
              borderRadius: '12px',
              background: '#f1f5f9',
              color: '#64748b',
              fontSize: '0.9rem',
            }}
          >
            <span className="case-chat-typing-dots">
              <span /><span /><span />
            </span>
            {typingFrom.name} is typing...
          </div>
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
          onChange={handleInputChange}
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
