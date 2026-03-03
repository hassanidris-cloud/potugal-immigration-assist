import { useState, useCallback } from 'react'
import CaseChat from './CaseChat'

type CaseChatWidgetProps = {
  caseId: string
  caseUserId: string
  isSpecialist?: boolean
  title?: string
}

export default function CaseChatWidget({ caseId, caseUserId, isSpecialist = false, title = 'Message your specialist' }: CaseChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [newMessageCount, setNewMessageCount] = useState(0)

  const handleNewMessage = useCallback(() => {
    setNewMessageCount((c) => c + 1)
  }, [])

  const handleFabClick = () => {
    if (open) {
      setOpen(false)
    } else {
      setOpen(true)
      setNewMessageCount(0)
    }
  }

  return (
    <div className="case-chat-widget">
      {open && (
        <div className="ai-chat-panel case-chat-panel" role="dialog" aria-label={title}>
          <div className="ai-chat-header">
            <span className="ai-chat-title">{title}</span>
            <button
              type="button"
              className="ai-chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div className="case-chat-panel-body">
            <CaseChat
              caseId={caseId}
              caseUserId={caseUserId}
              isSpecialist={isSpecialist}
              title=""
              hideHeader
              onNewMessage={handleNewMessage}
              style={{ border: 'none', borderRadius: 0, minHeight: 260, maxHeight: 340, boxShadow: 'none' }}
            />
          </div>
        </div>
      )}
      <button
        type="button"
        className={`ai-chat-fab ${!open && newMessageCount > 0 ? 'case-chat-fab-has-new' : ''}`}
        onClick={handleFabClick}
        aria-label={open ? 'Close chat' : title}
        aria-expanded={open}
      >
        {!open && newMessageCount > 0 && (
          <span className="case-chat-fab-badge" aria-live="polite">
            {newMessageCount > 99 ? '99+' : newMessageCount}
          </span>
        )}
        <span className="ai-chat-fab-icon" aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </span>
        <span className="ai-chat-fab-label">Message specialist</span>
      </button>
    </div>
  )
}
