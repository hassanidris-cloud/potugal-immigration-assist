import { useState, useRef, useEffect, type ReactNode } from 'react'
import Link from 'next/link'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const WELCOME_MESSAGE = "Hi! I'm here to help with questions about moving to Portugal. WINIT supports three visa programs: **D2** (entrepreneur), **D7** (passive income), and **D8** (digital nomad). Ask me whether one might fit your situation, what's required, or anything else—and if your situation doesn't match these programs, I'll tell you and suggest next steps."

function formatMessage(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [open, messages, loading])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setError(null)
    const userMessage: ChatMessage = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get a response')
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Something went wrong. Please try again.'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const showWelcome = open && messages.length === 0 && !loading

  return (
    <>
      <div className="ai-chat-widget">
        {open && (
          <div className="ai-chat-panel" role="dialog" aria-label="Ask about Portugal visas">
            <div className="ai-chat-header">
              <span className="ai-chat-title">Ask about Portugal visas</span>
              <button
                type="button"
                className="ai-chat-close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
            <div className="ai-chat-messages" ref={listRef}>
              {showWelcome && (
                <div className="ai-chat-bubble ai-chat-bubble-assistant">
                  <div className="ai-chat-bubble-inner">{formatMessage(WELCOME_MESSAGE)}</div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`ai-chat-bubble ai-chat-bubble-${m.role}`}>
                  <div className="ai-chat-bubble-inner">{formatMessage(m.content)}</div>
                </div>
              ))}
              {loading && (
                <div className="ai-chat-bubble ai-chat-bubble-assistant">
                  <div className="ai-chat-bubble-inner ai-chat-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              {error && (
                <div className="ai-chat-error">
                  {error}
                  <button type="button" onClick={() => setError(null)}>Dismiss</button>
                </div>
              )}
            </div>
            <div className="ai-chat-footer">
              <textarea
                ref={inputRef}
                className="ai-chat-input"
                placeholder="Ask anything about D2, D7, D8 visas or moving to Portugal..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                disabled={loading}
                aria-label="Your message"
                inputMode="text"
                enterKeyHint="send"
                autoComplete="off"
              />
              <button
                type="button"
                className="ai-chat-send"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send"
              >
                Send
              </button>
            </div>
            <p className="ai-chat-disclaimer">
              For official requirements, see <a href="https://www.aima.gov.pt" target="_blank" rel="noopener noreferrer">AIMA</a> and your consulate. Need a plan? <Link href="/auth/signup">Sign up</Link> or <Link href="/contact">contact us</Link>.
            </p>
          </div>
        )}
        <button
          type="button"
          className="ai-chat-fab"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close chat' : 'Open visa assistant'}
          aria-expanded={open}
        >
          <span className="ai-chat-fab-icon" aria-hidden>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </span>
          <span className="ai-chat-fab-label">Ask AI</span>
        </button>
      </div>
    </>
  )
}
