import { getVisaPersonalization } from '../lib/visaPersonalization'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [cases, setCases] = useState<any[]>([])
  const [subscription, setSubscription] = useState<any>(null)
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

      // Fetch profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      // Check if user has active subscription or trial - redirect to signup if not
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (profileData?.role !== 'admin') {
        // Check if subscription is expired
        if (subscriptionData && subscriptionData.expires_at) {
          const expiresAt = new Date(subscriptionData.expires_at)
          const now = new Date()
          if (expiresAt < now) {
            // Subscription expired, redirect to signup
            router.push('/auth/signup')
            return
          }
        }

        if (!subscriptionData) {
          router.push('/auth/signup')
          return
        }
      }

      setSubscription(subscriptionData)

      // Fetch cases
      const { data: casesData } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setCases(casesData ? casesData.slice(0, 1) : [])
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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading your dashboard...</p>
      </div>
    </div>
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b'
      case 'in_progress':
        return '#3b82f6'
      case 'approved':
        return '#10b981'
      case 'rejected':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'in_progress':
        return '⚙️'
      case 'approved':
        return '✅'
      case 'rejected':
        return '❌'
      default:
        return '📋'
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', padding: '2rem', fontFamily: 'sans-serif' }}>
      {/* Header with Logout */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0, background: 'linear-gradient(135deg, #0066cc 0%, #00c896 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Portugal Journey
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link
            href="/settings"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: '#0066cc',
              border: '2px solid #0066cc',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              display: 'inline-block',
              transition: 'all 0.2s',
            }}
          >
            ⚙️ Settings
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Free Trial Banner */}
      {profile?.role !== 'admin' && subscription && subscription.amount === 0 && subscription.expires_at && (
        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>
              🎉 Free 14-Day Trial Active
            </h3>
            <p style={{ margin: 0, opacity: 0.95 }}>
              Your trial ends on {new Date(subscription.expires_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              {' '}({Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days remaining)
            </p>
          </div>
          <Link
            href="/auth/signup"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: '#f59e0b',
              border: 'none',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              whiteSpace: 'nowrap'
            }}
          >
            Upgrade Now
          </Link>
        </div>
      )}

      {/* Welcome Section */}
      {profile && (
        <>
          <section
            style={{
              marginBottom: '2rem',
              padding: '2.5rem',
              background: 'linear-gradient(135deg, #0066cc 0%, #00c896 100%)',
              borderRadius: '16px',
              color: 'white',
              boxShadow: '0 8px 32px rgba(0, 102, 204, 0.2)',
            }}
          >
            <h2 style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>
              👋 Welcome back, {profile.full_name || profile.email}!
            </h2>
            <p style={{ opacity: 0.95, fontSize: '1.1rem', margin: 0 }}>
              You're one step closer to your Portuguese adventure. Our specialist is here to help you every step of the way.
            </p>
          </section>

          {/* Personalized Visa Tips */}
          {profile?.role !== 'admin' && cases.length > 0 && cases[0].visa_type && (
            (() => {
              const visaInfo = getVisaPersonalization(cases[0].visa_type);
              return (
                <section style={{
                  marginBottom: '3rem',
                  padding: '2rem',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '2px solid #e0f2fe'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '1.5rem' }}>🎯</div>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>
                      Your {visaInfo.visaType} Journey
                    </h3>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '600' }}>Processing Time</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0066cc' }}>⏱️ {visaInfo.processingTime}</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '600' }}>Success Rate</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#10b981' }}>✓ {visaInfo.successRate}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📌</span> What You Need Next
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
                      {visaInfo.nextSteps.slice(0, 3).map((step, idx) => (
                        <li key={idx} style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>💡</span> Pro Tips for Your Visa
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#78350f', fontSize: '0.9rem' }}>
                      {visaInfo.tips.slice(0, 3).map((tip, idx) => (
                        <li key={idx} style={{ marginBottom: '0.35rem' }}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              );
            })()
          )}
        </>
      )}

      {/* Quick Stats */}
      {cases.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '2px solid #e0f2fe' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
            <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>Total Cases</p>
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#0066cc' }}>{cases.length}</h3>
          </div>
          <div
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '2px solid #fef3c7',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏳</div>
            <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>In Progress</p>
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#f59e0b' }}>
              {cases.filter((c) => c.status === 'in_progress').length}
            </h3>
          </div>
          <div
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '2px solid #dcfce7',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
            <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>Completed</p>
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#10b981' }}>
              {cases.filter((c) => c.status === 'approved').length}
            </h3>
          </div>
        </div>
      )}

      {/* Case Section */}
      {profile?.role !== 'admin' ? (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#1e293b' }}>📁 Your Case</h2>
              <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.95rem' }}>You focus on one application at a time.</p>
            </div>
          </div>

          {cases.length === 0 ? (
            <div
              style={{
                padding: '3rem 2rem',
                background: 'white',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '2px dashed #cbd5e1',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>No cases yet</h3>
              <p style={{ margin: '0 0 1.5rem 0', color: '#64748b' }}>Start your Portugal immigration journey by creating your first case.</p>
              <Link
                href="/onboarding"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #0066cc 0%, #00c896 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                }}
              >
                Create Your First Case
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {cases.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>📋 {c.case_type}</h3>
                    <span
                      style={{
                        background: getStatusColor(c.status),
                        color: 'white',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                      }}
                    >
                      {getStatusEmoji(c.status)} {c.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>🛂 Visa Type:</span>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#0066cc', fontWeight: '600' }}>{c.visa_type}</p>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>🌍 From:</span>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b', fontWeight: '600' }}>{c.country_of_origin}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                    <Link
                      href={`/case/${c.id}/checklist`}
                      style={{
                        padding: '0.75rem',
                        background: '#f0f9ff',
                        color: '#0066cc',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        border: '2px solid #bfdbfe',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#0066cc'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#f0f9ff'
                        e.currentTarget.style.color = '#0066cc'
                      }}
                    >
                      ✅ Checklist
                    </Link>
                    <Link
                      href={`/case/${c.id}/documents`}
                      style={{
                        padding: '0.75rem',
                        background: '#ecfdf5',
                        color: '#00c896',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        border: '2px solid #a7f3d0',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#00c896'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#ecfdf5'
                        e.currentTarget.style.color = '#00c896'
                      }}
                    >
                      📄 Documents
                    </Link>
                    <Link
                      href={`/case/${c.id}/edit`}
                      style={{
                        padding: '0.75rem',
                        background: '#f8fafc',
                        color: '#475569',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        border: '2px solid #e2e8f0',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#475569'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#f8fafc'
                        e.currentTarget.style.color = '#475569'
                      }}
                    >
                      ✏️ Edit Case
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{
            padding: '2rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '2px solid #e2e8f0'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#1e293b' }}>👑 Owner Dashboard</h2>
            <p style={{ margin: '0.5rem 0 1rem 0', color: '#64748b' }}>Manage clients and view activity without creating a case.</p>
            <Link
              href="/admin/users"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600'
              }}
            >
              View All Clients
            </Link>
          </div>
        </section>
      )}

      {/* Admin Section */}
      {profile?.role === 'admin' && (
        <section>
          <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '1.5rem' }}>⚙️ Admin Controls</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Link
              href="/admin/cases"
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              📊 All Cases
            </Link>
            <Link
              href="/admin/users"
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              👥 All Users
            </Link>
            <Link
              href="/admin/test-mode"
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              🧪 Test Mode
            </Link>
            <Link
              href="/admin/invoices"
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              💳 Invoices
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
