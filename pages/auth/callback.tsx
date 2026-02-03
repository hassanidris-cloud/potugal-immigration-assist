import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash from URL (Supabase uses hash for auth tokens)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const access_token = hashParams.get('access_token')
        const refresh_token = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (type === 'signup' && access_token) {
          // Email verified successfully
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            // Create user profile if it doesn't exist
            const { data: existingProfile } = await supabase
              .from('users')
              .select('id')
              .eq('id', user.id)
              .single()

            if (!existingProfile) {
              // Profile doesn't exist, create it via API
              await fetch('/api/auth/complete-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user.id,
                  email: user.email,
                  fullName: user.user_metadata?.full_name || '',
                  phone: user.user_metadata?.phone || null,
                }),
              })
            }

            // Check if user has a subscription (trial should be created)
            const { data: subscription } = await supabase
              .from('subscriptions')
              .select('id')
              .eq('user_id', user.id)
              .single()

            // If subscription exists, go straight to dashboard, otherwise to pricing to start trial
            if (subscription) {
              router.push('/dashboard')
            } else {
              router.push('/pricing')
            }
          }
        } else {
          // Other auth types or errors
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Callback error:', error)
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>✨</div>
        <h1 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '0.5rem' }}>
          Verifying your email...
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
          Please wait while we set up your account
        </p>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
