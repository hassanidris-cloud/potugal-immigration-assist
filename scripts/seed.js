// Seed script for demo data
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

async function seed() {
  console.log('🌱 Seeding demo data...')
  
  try {
    // Create a test case (would need to be authenticated)
    console.log('✅ Seed script placeholder - implement based on your auth flow')
    console.log('Tip: Use Supabase service role key to insert demo users, cases, and templates')
  } catch (error) {
    console.error('❌ Seed failed:', error)
  }
}

seed()
