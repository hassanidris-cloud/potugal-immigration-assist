// Smoke test - basic health checks
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

async function smokeTest() {
  console.log('🔥 Running smoke tests...')
  
  try {
    // Test health endpoint
    const healthRes = await fetch(`${BASE_URL}/api/health`)
    const healthData = await healthRes.json()
    
    if (healthRes.ok && healthData.status === 'ok') {
      console.log('✅ Health check passed')
    } else {
      throw new Error('Health check failed')
    }

    console.log('✅ All smoke tests passed!')
  } catch (error) {
    console.error('❌ Smoke test failed:', error)
    process.exit(1)
  }
}

smokeTest()
