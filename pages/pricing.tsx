import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Pricing() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [startingTrial, setStartingTrial] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/signup')
      return
    }

    setUser(user)
    setLoading(false)
  }

  const handleStartTrial = async () => {
    setStartingTrial(true)

    try {
      const response = await fetch('/api/auth/start-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Error starting trial')
        setStartingTrial(false)
        return
      }

      // Trial created, redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Trial error:', error)
      alert('Error starting trial. Please try again.')
      setStartingTrial(false)
    }
  }

  const handleSelectPlan = async (plan: string, price: number) => {
    setSelectedPlan(plan)
    
    try {
      // Create checkout session
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          price,
          userId: user?.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Checkout error:', data)
        alert(data.error || 'Error creating checkout session. Please try again.')
        setSelectedPlan('')
        return
      }

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        console.error('No URL in response:', data)
        alert('Error creating checkout session. Please try again.')
        setSelectedPlan('')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error processing payment. Please try again.')
      setSelectedPlan('')
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', 
      padding: '3rem 1rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1e293b' }}>
            Choose Your Plan
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
            Select the service level that best fits your Portugal immigration journey with WINIT
          </p>
          <button
            onClick={handleStartTrial}
            disabled={startingTrial}
            style={{
              padding: '0.75rem 1.5rem',
              background: startingTrial ? '#94a3b8' : 'linear-gradient(135deg, #0066cc, #00c896)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: startingTrial ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              marginTop: '1rem',
              boxShadow: startingTrial ? 'none' : '0 4px 12px rgba(0, 102, 204, 0.3)'
            }}
          >
            {startingTrial ? '⏳ Starting Trial...' : '🎉 Start 14-Day Free Trial'}
          </button>
        </div>

        {/* Pricing Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Essential Plan */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid #e2e8f0',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => handleSelectPlan('Essential', 299)}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>Essential</h3>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: '700', color: '#0066cc' }}>€299</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Perfect for straightforward visa applications</p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Document checklist & guidance',
                'Case management dashboard',
                'Document upload & storage',
                'Basic progress tracking',
                'Email support',
                'Standard processing'
              ].map((feature, idx) => (
                <li key={idx} style={{ 
                  padding: '0.75rem 0', 
                  borderBottom: '1px solid #f1f5f9',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: '#10b981' }}>✓</span> {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan('Essential', 299)}
              disabled={selectedPlan === 'Essential'}
              style={{
                width: '100%',
                marginTop: '2rem',
                padding: '1rem',
                background: selectedPlan === 'Essential' ? '#94a3b8' : '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: selectedPlan === 'Essential' ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {selectedPlan === 'Essential' ? 'Processing...' : 'Select Essential'}
            </button>
          </div>

          {/* Premium Plan - Most Popular */}
          <div style={{ 
            background: 'linear-gradient(135deg, #0066cc, #00c896)', 
            padding: '2rem', 
            borderRadius: '16px', 
            boxShadow: '0 8px 30px rgba(0, 102, 204, 0.3)',
            border: '2px solid #0066cc',
            position: 'relative',
            transform: 'scale(1.05)',
            cursor: 'pointer'
          }}
          onClick={() => handleSelectPlan('Premium', 599)}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              right: '20px',
              background: '#fbbf24',
              color: '#78350f',
              padding: '0.25rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}>
              MOST POPULAR
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Premium</h3>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: '700', color: 'white' }}>€599</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>Comprehensive support for complex cases</p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Everything in Essential, plus:',
                'Priority processing',
                'Document review by experts',
                'Video consultation (1 hour)',
                'Direct admin communication',
                'Application submission help',
                'Follow-up support'
              ].map((feature, idx) => (
                <li key={idx} style={{ 
                  padding: '0.75rem 0', 
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: '#fbbf24' }}>✓</span> {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan('Premium', 599)}
              disabled={selectedPlan === 'Premium'}
              style={{
                width: '100%',
                marginTop: '2rem',
                padding: '1rem',
                background: selectedPlan === 'Premium' ? 'rgba(255,255,255,0.3)' : 'white',
                color: selectedPlan === 'Premium' ? 'white' : '#0066cc',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: selectedPlan === 'Premium' ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {selectedPlan === 'Premium' ? 'Processing...' : 'Select Premium'}
            </button>
          </div>

          {/* Concierge Plan */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid #e2e8f0',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => handleSelectPlan('Concierge', 999)}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>Concierge</h3>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: '700', color: '#0066cc' }}>€999</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>White-glove service from start to finish</p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Everything in Premium, plus:',
                'Dedicated case manager',
                'Unlimited consultations',
                'End-to-end application handling',
                'Document preparation service',
                'Appointment scheduling',
                'Translation services',
                'Post-approval support (30 days)'
              ].map((feature, idx) => (
                <li key={idx} style={{ 
                  padding: '0.75rem 0', 
                  borderBottom: '1px solid #f1f5f9',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: '#8b5cf6' }}>✓</span> {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan('Concierge', 999)}
              disabled={selectedPlan === 'Concierge'}
              style={{
                width: '100%',
                marginTop: '2rem',
                padding: '1rem',
                background: selectedPlan === 'Concierge' ? '#94a3b8' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: selectedPlan === 'Concierge' ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {selectedPlan === 'Concierge' ? 'Processing...' : 'Select Concierge'}
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', marginTop: '2rem' }}>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>
            🔒 Secure payment powered by Stripe • 💯 Money-back guarantee • 🇵🇹 Portugal immigration specialists
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Need help choosing? <a href="mailto:support@winit.com" style={{ color: '#0066cc', textDecoration: 'none' }}>Contact us</a>
          </p>
        </div>
      </div>
    </div>
  )
}
