// Extended API tests
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

async function extendedTests() {
  console.log('🧪 Running extended API tests...')
  
  try {
    // Test health
    console.log('Testing /api/health...')
    const res = await fetch(`${BASE_URL}/api/health`)
    if (!res.ok) throw new Error('Health endpoint failed')
    console.log('✅ Health endpoint OK')

    // Add more API tests here
    console.log('✅ All extended tests passed!')
  } catch (error) {
    console.error('❌ Extended tests failed:', error)
    process.exit(1)
  }
}

extendedTests()
