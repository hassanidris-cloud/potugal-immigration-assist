import { getVisaPersonalization } from '../lib/visaPersonalization'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [cases, setCases] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      if (profileData?.role !== 'admin' && !profileData?.paid_at) {
        router.replace('/account-pending')
        return
      }

      const { data: casesData } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setCases(casesData ? casesData.slice(0, 1) : [])

      if (profileData?.role !== 'admin') {
        const { data: invData } = await supabase
          .from('user_invoices')
          .select('*')
          .eq('user_id', user.id)
          .order('uploaded_at', { ascending: false })
        setInvoices(invData || [])
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'pending'
      case 'in_progress': return 'in_progress'
      case 'approved': return 'approved'
      case 'rejected': return 'rejected'
      default: return 'pending'
    }
  }

  const formatStatus = (status: string) => status.replace('_', ' ')

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-inner">
          <div className="dashboard-loading-spinner" aria-hidden />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard — WinIT Portugal Immigration</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <Link href="/dashboard" className="dashboard-brand" style={{ textDecoration: 'none' }}>
            Portugal Journey
          </Link>
          <nav className="dashboard-nav">
            <Link href="/" className="dashboard-btn dashboard-btn-ghost">
              Back to homepage
            </Link>
            <Link href="/settings" className="dashboard-btn dashboard-btn-ghost">
              Settings
            </Link>
            <button type="button" onClick={handleLogout} className="dashboard-btn dashboard-btn-danger">
              Log out
            </button>
          </nav>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">
          {profile && (
            <>
              <section className="dashboard-hero">
                <h2>Welcome back, {profile.full_name || profile.email}</h2>
                <p>Here’s an overview of your application and next steps.</p>
              </section>

              {/* Visa tips (client with case) */}
              {profile?.role !== 'admin' && cases.length > 0 && cases[0].visa_type && (() => {
                const visaInfo = getVisaPersonalization(cases[0].visa_type)
                return (
                  <section className="dashboard-visa-tips">
                    <h3>Your {visaInfo.visaType} journey</h3>
                    <div className="dashboard-visa-tips-grid">
                      <div className="dashboard-visa-tip-item">
                        <strong>Processing time</strong>
                        <br />
                        <span>{visaInfo.processingTime}</span>
                      </div>
                      <div className="dashboard-visa-tip-item">
                        <strong>Success rate</strong>
                        <br />
                        <span>{visaInfo.successRate}</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: 'var(--text)', fontSize: '0.9rem' }}>What you need next</strong>
                      <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                        {visaInfo.nextSteps.slice(0, 3).map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ padding: '1rem', background: '#fefce8', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--warning)' }}>
                      <strong style={{ color: '#854d0e', fontSize: '0.9rem' }}>Tips for your visa</strong>
                      <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.25rem', color: '#713f12', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        {visaInfo.tips.slice(0, 3).map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                )
              })()}

              {/* Quick stats (client with cases) */}
              {cases.length > 0 && (
                <div className="dashboard-stats">
                  <div className="dashboard-stat">
                    <div className="dashboard-stat-label">Total cases</div>
                    <div className="dashboard-stat-value">{cases.length}</div>
                  </div>
                  <div className="dashboard-stat">
                    <div className="dashboard-stat-label">In progress</div>
                    <div className="dashboard-stat-value warning">
                      {cases.filter((c) => c.status === 'in_progress').length}
                    </div>
                  </div>
                  <div className="dashboard-stat">
                    <div className="dashboard-stat-label">Completed</div>
                    <div className="dashboard-stat-value success">
                      {cases.filter((c) => c.status === 'approved').length}
                    </div>
                  </div>
                </div>
              )}

              {/* Case section (client only) */}
              {profile?.role !== 'admin' && (
                <section className="dashboard-section">
                  <h2 className="dashboard-section-title">Your case</h2>
                  <p className="dashboard-section-subtitle">Manage your application and documents in one place.</p>

                  {cases.length === 0 ? (
                    <div className="dashboard-card dashboard-empty">
                      <div className="dashboard-empty-icon" aria-hidden>📋</div>
                      <h3>No case yet</h3>
                      <p>Start your Portugal immigration journey by creating your first case.</p>
                      <Link href="/onboarding" className="dashboard-btn dashboard-btn-primary">
                        Create your first case
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {cases.map((c) => (
                        <div
                          key={c.id}
                          role="button"
                          tabIndex={0}
                          className="dashboard-case-card"
                          onClick={() => router.push(`/case/${c.id}/checklist`)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              router.push(`/case/${c.id}/checklist`)
                            }
                          }}
                        >
                          <div className="dashboard-case-card-header">
                            <h3 className="dashboard-case-card-title">{c.case_type}</h3>
                            <span className={`dashboard-status ${getStatusClass(c.status)}`}>
                              {formatStatus(c.status)}
                            </span>
                          </div>
                          <div className="dashboard-case-meta">
                            <p><span>Visa type </span><strong>{c.visa_type}</strong></p>
                            <p><span>From </span><strong>{c.country_of_origin}</strong></p>
                          </div>
                          <div className="dashboard-case-actions" onClick={(e) => e.stopPropagation()}>
                            <Link href={`/case/${c.id}/checklist`} className="dashboard-btn dashboard-btn-ghost">
                              Checklist
                            </Link>
                            <Link href={`/case/${c.id}/documents`} className="dashboard-btn dashboard-btn-ghost">
                              Documents
                            </Link>
                            <Link href={`/case/${c.id}/edit`} className="dashboard-btn dashboard-btn-ghost">
                              Edit case
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Invoices (client only) */}
              {profile?.role !== 'admin' && (
                <section className="dashboard-section">
                  <h2 className="dashboard-section-title">Invoices</h2>
                  <p className="dashboard-section-subtitle">View and download invoices from your specialist.</p>
                  {invoices.length === 0 ? (
                    <div className="dashboard-card dashboard-empty">
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                        No invoices yet. Your specialist will add them when available.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {invoices.map((inv) => (
                        <div key={inv.id} className="dashboard-invoice-row">
                          <span>{inv.file_name}</span>
                          <span>{inv.uploaded_at ? new Date(inv.uploaded_at).toLocaleDateString() : ''}</span>
                          <button
                            type="button"
                            className="dashboard-btn dashboard-btn-primary"
                            onClick={async () => {
                              try {
                                const { data: { session } } = await supabase.auth.getSession()
                                const token = session?.access_token
                                if (!token) return
                                const res = await fetch(`/api/invoices/download?id=${inv.id}`, {
                                  headers: { Authorization: `Bearer ${token}` },
                                })
                                const data = await res.json()
                                if (!res.ok) throw new Error(data.error || 'Download failed')
                                window.open(data.url, '_blank')
                              } catch (err: any) {
                                alert(err.message || 'Download failed')
                              }
                            }}
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Admin workspace */}
              {profile?.role === 'admin' && (
                <section className="dashboard-section">
                  <h2 className="dashboard-section-title">Workspace</h2>
                  <p className="dashboard-section-subtitle">Manage client cases, contacts, and invoices.</p>
                  <div className="dashboard-workspace">
                    <Link href="/admin/cases" className="workspace-cases">
                      Client cases
                    </Link>
                    <Link href="/admin/users" className="workspace-users">
                      Clients & contacts
                    </Link>
                    <Link href="/admin/invoices" className="workspace-invoices">
                      Invoices
                    </Link>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
    </>
  )
}
