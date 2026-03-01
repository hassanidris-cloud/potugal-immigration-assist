import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Settings() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
    setLoading(false)
  }

  async function handleDeleteAccount() {
    if (confirmText !== 'DELETE') {
      alert('Please type DELETE to confirm')
      return
    }

    setDeleting(true)

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      // Sign out and redirect
      await supabase.auth.signOut()
      router.push('/')
    } catch (error: any) {
      alert('Error deleting account: ' + error.message)
      setDeleting(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '15px', 
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <Link href="/dashboard" style={{ 
              color: '#0066cc', 
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}>
              ← Back to Dashboard
            </Link>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e293b' }}>Account Settings</h1>
          
          <div style={{ 
            padding: '1.5rem',
            background: '#f8fafc',
            borderRadius: '10px',
            marginBottom: '2rem'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>Account Email</h3>
            <p style={{ margin: 0, color: '#64748b' }}>{user?.email}</p>
          </div>

          <div style={{ 
            padding: '2rem',
            background: '#fef2f2',
            borderRadius: '10px',
            border: '2px solid #fecaca'
          }}>
            <h2 style={{ color: '#dc2626', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>
              ⚠️ Danger Zone
            </h2>
            
            {!showConfirm ? (
              <div>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                  Delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={() => setShowConfirm(true)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    color: '#dc2626',
                    border: '2px solid #dc2626',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}
                >
                  Delete Account
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: '#dc2626', marginBottom: '1rem', fontWeight: '500' }}>
                  This will permanently delete:
                </p>
                <ul style={{ color: '#64748b', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                  <li>Your account and profile</li>
                  <li>All your cases and documents</li>
                  <li>All invoices</li>
                  <li>All comments and appointments</li>
                </ul>
                
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                  Type <strong>DELETE</strong> to confirm:
                </p>
                
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting || confirmText !== 'DELETE'}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: confirmText === 'DELETE' ? '#dc2626' : '#94a3b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: confirmText === 'DELETE' && !deleting ? 'pointer' : 'not-allowed',
                      fontWeight: '600',
                      fontSize: '0.95rem'
                    }}
                  >
                    {deleting ? '⏳ Deleting...' : '🗑️ Confirm Delete'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowConfirm(false)
                      setConfirmText('')
                    }}
                    disabled={deleting}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'white',
                      color: '#64748b',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.95rem'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
