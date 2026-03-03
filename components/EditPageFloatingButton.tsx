'use client'

import { useState, useCallback } from 'react'

const EDITOR_ROOT = process.env.NEXT_PUBLIC_EDITOR_ROOT || ''
const IS_DEV = process.env.NODE_ENV === 'development'

export interface EditPageFloatingButtonProps {
  /** Relative path to the page file, e.g. "pages/visa-d2.tsx" */
  relativePath: string
}

export default function EditPageFloatingButton({ relativePath }: EditPageFloatingButtonProps) {
  const [copied, setCopied] = useState(false)

  const editorUri = EDITOR_ROOT
    ? `vscode://file/${EDITOR_ROOT.replace(/\\/g, '/').replace(/\/$/, '')}/${relativePath.replace(/^\//, '')}`
    : ''

  const copyPath = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(relativePath)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: show in prompt
      window.prompt('Copy this path:', relativePath)
    }
  }, [relativePath])

  if (!IS_DEV) return null

  return (
    <div className="edit-page-floating" role="group" aria-label="Edit this page in your editor">
      <span className="edit-page-floating-label">Edit this page</span>
      <span className="edit-page-floating-path" title={relativePath}>{relativePath}</span>
      <div className="edit-page-floating-actions">
        {editorUri ? (
          <a href={editorUri} className="edit-page-floating-btn" target="_blank" rel="noopener noreferrer">
            Open in editor
          </a>
        ) : null}
        <button type="button" className="edit-page-floating-btn" onClick={copyPath}>
          {copied ? 'Copied!' : 'Copy path'}
        </button>
      </div>
      <p className="edit-page-floating-hint">
        {EDITOR_ROOT
          ? 'Click "Open in editor" to edit text in Cursor/VS Code.'
          : 'Add NEXT_PUBLIC_EDITOR_ROOT to .env.local (your project folder path) to open the file from here, or use "Copy path" and Ctrl+P in the editor.'}
      </p>
    </div>
  )
}
