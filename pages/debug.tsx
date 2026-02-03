import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Debug() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        setProfile(profileData)
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Debug Info</h1>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Auth User:</h2>
        {user ? (
          <pre>{JSON.stringify(user, null, 2)}</pre>
        ) : (
          <p style={{ color: '#d32f2f' }}>❌ NOT LOGGED IN - <a href="/auth/login">Go to login</a></p>
        )}
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>User Profile:</h2>
        {profile ? (
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        ) : (
          <p style={{ color: '#d32f2f' }}>❌ No profile found</p>
        )}
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#fee', color: '#d32f2f', borderRadius: '8px' }}>
          <h2>Error:</h2>
          {error}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Quick Links:</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/admin/cases">Admin Cases</a></li>
          <li><a href="/admin/test-mode">Test Mode</a></li>
          <li><a href="/auth/signup">Sign Up</a></li>
          <li><a href="/auth/login">Login</a></li>
        </ul>
      </div>
    </div>
  )
}
