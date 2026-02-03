// Comprehensive checklist template population script
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local')
const envFile = fs.readFileSync(envPath, 'utf8')
const envVars = {}
envFile.split('\n').forEach(line => {
  line = line.trim()
  if (line && !line.startsWith('#')) {
    const parts = line.split('=')
    if (parts.length >= 2) {
      const key = parts[0].trim()
      const value = parts.slice(1).join('=').trim()
      envVars[key] = value
    }
  }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Comprehensive document templates based on Portugal's actual requirements
const templates = [
  // ========== SCHENGEN VISA (Short-Stay) ==========
  {
    visa_type: 'Schengen',
    title: 'Completed Visa Application Form',
    description: 'National visa application form filled completely and signed by applicant. For minors and incapacitated persons, forms must be signed by legal guardian.',
    required: true,
    order_index: 1
  },
  {
    visa_type: 'Schengen',
    
    title: '2 Passport Photos',
    description: 'Two recent, passport-type color photographs in good condition to identify the applicant clearly. Photos must meet ICAO standards.',
    required: true,
    order_index: 2
  },
  {
    visa_type: 'Schengen',
    
    title: 'Valid Passport',
    description: 'Passport or travel document valid for at least 3 months after estimated return date, with minimum 2 blank pages. Include photocopy of biographical data page.',
    required: true,
    order_index: 3
  },
  {
    visa_type: 'Schengen',
    
    title: 'Travel Insurance',
    description: 'Valid travel insurance covering medical expenses (minimum €30,000), including urgent medical assistance and possible repatriation for the entire duration of stay.',
    required: true,
    order_index: 4
  },
  {
    visa_type: 'Schengen',
    
    title: 'Proof of Accommodation',
    description: 'Hotel booking confirmation, rental agreement, or invitation letter from host in Portugal showing where you will stay.',
    required: true,
    order_index: 5
  },
  {
    visa_type: 'Schengen',
    
    title: 'Proof of Financial Means',
    description: 'Bank statements from last 3 months, proof of income, or sponsorship letter demonstrating sufficient funds for your stay in Portugal.',
    required: true,
    order_index: 6
  },
  {
    visa_type: 'Schengen',
    
    title: 'Flight Reservation',
    description: 'Round-trip flight booking or reservation showing entry and exit dates from Schengen area. Do not purchase tickets until visa is approved.',
    required: true,
    order_index: 7
  },
  {
    visa_type: 'Schengen',
    
    title: 'Criminal Record Certificate',
    description: 'Certificate from competent authority of your country of nationality or country where you have resided for over a year, with Hague Apostille or legalization.',
    required: true,
    order_index: 8
  },
  {
    visa_type: 'Schengen',
    
    title: 'Purpose of Visit Documentation',
    description: 'Additional documents depending on visit purpose: business invitation letter, conference registration, tourism itinerary, or family relationship proof.',
    required: false,
    order_index: 9
  },
  {
    visa_type: 'Schengen',
    
    title: 'Employment Letter',
    description: 'Letter from employer confirming employment, salary, and approved leave for the travel dates.',
    required: false,
    order_index: 10
  },

  // ========== TEMPORARY STAY VISA ==========
  {
    visa_type: 'Temporary Stay',
    
    title: 'Completed National Visa Application',
    description: 'National visa application form filled completely and signed. For minors and incapacitated persons, forms must be signed by legal guardian.',
    required: true,
    order_index: 1
  },
  {
    visa_type: 'Temporary Stay',
    
    title: '2 Passport Photos',
    description: 'Two recent, passport-type color photographs meeting ICAO standards for visa identification.',
    required: true,
    order_index: 2
  },
  {
    visa_type: 'Temporary Stay',
    
    title: 'Valid Passport',
    description: 'Passport valid for at least 3 months beyond planned stay, with 2 blank pages. Include photocopy of biographical page.',
    required: true,
    order_index: 3
  },
  {
    visa_type: 'Temporary Stay',
    
    title: 'Travel Insurance',
    description: 'Medical insurance covering minimum €30,000 for medical expenses, urgent assistance, and repatriation during your temporary stay.',
    required: true,
    order_index: 4
  },
  {
    visa_type: 'Temporary Stay',
    
    title: 'Proof of Accommodation',
    description: 'Rental agreement, hotel booking, or invitation letter showing registered accommodation in Portugal for duration of stay.',
    required: true,
    order_index: 5
  },
  {
    visa_type: 'Temporary Stay',
    
    title: 'Proof of Financial Means',
    description: 'Bank statements, employment contract, or proof of income demonstrating sufficient funds for temporary stay (up to 1 year).',
    required: true,
    order_index: 6
  },
  {
    visa_type: 'Temporary Stay',
    
    title: 'Criminal Record Certificate',
    description: 'Certificate issued by competent authority of your nationality or residence country (if resided over 1 year), with Hague Apostille or legalization.',
    required: true,
    order_index: 7
  },
  {
    visa_type: 'Temporary Stay',
    
    title: 'Work Authorization or Contract',
    description: 'For seasonal or independent work: employment contract, work authorization, or proof of freelance contracts/business registration.',
    required: false,
    order_index: 8
  },
  {
    visa_type: 'Temporary Stay',
    
    title: 'Research or Study Documentation',
    description: 'For research/study purposes: acceptance letter from institution, proof of registration, or research agreement.',
    required: false,
    order_index: 9
  },

  // ========== D7 VISA (Passive Income/Retirement) ==========
  {
    visa_type: 'D7',
    
    title: 'Completed National Visa Application',
    description: 'National visa application form (D7) filled completely and signed by applicant.',
    required: true,
    order_index: 1
  },
  {
    visa_type: 'D7',
    
    title: '2 Passport Photos',
    description: 'Two recent, passport-type color photographs meeting ICAO standards.',
    required: true,
    order_index: 2
  },
  {
    visa_type: 'D7',
    
    title: 'Valid Passport',
    description: 'Passport valid for minimum 3 months beyond planned stay, with at least 2 blank pages. Include photocopy of biographical data page.',
    required: true,
    order_index: 3
  },
  {
    visa_type: 'D7',
    
    title: 'Travel Insurance',
    description: 'Medical insurance policy covering minimum €30,000 for medical expenses, emergency assistance, and repatriation.',
    required: true,
    order_index: 4
  },
  {
    visa_type: 'D7',
    
    title: 'Proof of Accommodation in Portugal',
    description: 'Rental contract, property deed, or long-term accommodation reservation showing where you will reside in Portugal.',
    required: true,
    order_index: 5
  },
  {
    visa_type: 'D7',
    
    title: 'Proof of Passive Income',
    description: 'Documentation of regular, stable passive income: pension statements, investment income, rental property income, social security benefits, or annuity statements. Must meet minimum income requirements.',
    required: true,
    order_index: 6
  },
  {
    visa_type: 'D7',
    
    title: 'Bank Statements (Last 6 Months)',
    description: 'Bank statements from last 6 months demonstrating stable financial situation and sufficient funds. Statements should show regular income deposits.',
    required: true,
    order_index: 7
  },
  {
    visa_type: 'D7',
    
    title: 'Criminal Record Certificate',
    description: 'Certificate from competent authority of your nationality country or residence country (if over 1 year), with Hague Apostille or consular legalization.',
    required: true,
    order_index: 8
  },
  {
    visa_type: 'D7',
    
    title: 'Portuguese Tax Number (NIF)',
    description: 'Proof of Portuguese tax number (NIF) obtained from Portuguese tax authority or authorized representative.',
    required: true,
    order_index: 9
  },
  {
    visa_type: 'D7',
    
    title: 'Proof of Income Source',
    description: 'Documentation proving source of passive income: pension award letter, investment portfolio statements, property rental agreements, or royalty contracts.',
    required: false,
    order_index: 10
  },

  // ========== D1 VISA (Employed Work) ==========
  {
    visa_type: 'D1',
    
    title: 'Completed National Visa Application',
    description: 'National visa application form for subordinate work activity (D1) filled and signed by applicant.',
    required: true,
    order_index: 1
  },
  {
    visa_type: 'D1',
    
    title: '2 Passport Photos',
    description: 'Two recent, passport-type color photographs meeting ICAO standards.',
    required: true,
    order_index: 2
  },
  {
    visa_type: 'D1',
    
    title: 'Valid Passport',
    description: 'Passport valid for minimum 3 months beyond stay, with 2 blank pages. Include photocopy of biographical page.',
    required: true,
    order_index: 3
  },
  {
    visa_type: 'D1',
    
    title: 'Travel Insurance',
    description: 'Medical insurance covering minimum €30,000 for medical expenses and repatriation.',
    required: true,
    order_index: 4
  },
  {
    visa_type: 'D1',
    
    title: 'Proof of Accommodation',
    description: 'Rental agreement, property documentation, or hotel reservation showing accommodation in Portugal.',
    required: true,
    order_index: 5
  },
  {
    visa_type: 'D1',
    
    title: 'Employment Contract or Job Offer',
    description: 'Signed employment contract, work promise, or formal job offer letter from Portuguese employer demonstrating subordinate work activity.',
    required: true,
    order_index: 6
  },
  {
    visa_type: 'D1',
    
    title: 'IEFP Work Authorization',
    description: 'Pre-approval or authorization from Institute for Employment and Vocational Training (IEFP) for your employment in Portugal.',
    required: true,
    order_index: 7
  },
  {
    visa_type: 'D1',
    
    title: 'Criminal Record Certificate',
    description: 'Certificate from competent authority of nationality or residence country, with Hague Apostille or legalization.',
    required: true,
    order_index: 8
  },
  {
    visa_type: 'D1',
    
    title: 'Professional Qualifications',
    description: 'Academic diplomas, professional certificates, or proof of qualifications. If profession is regulated in Portugal, provide professional certificate from Portuguese authority.',
    required: true,
    order_index: 9
  },
  {
    visa_type: 'D1',
    
    title: 'Proof of Financial Means',
    description: 'Bank statements or term of responsibility from employer with recognized signature, demonstrating sufficient funds for initial settlement.',
    required: false,
    order_index: 10
  },

  // ========== D2 VISA (Entrepreneur/Business) ==========
  {
    visa_type: 'D2',
    
    title: 'Completed National Visa Application',
    description: 'National visa application form for independent work activity/entrepreneur (D2) filled and signed.',
    required: true,
    order_index: 1
  },
  {
    visa_type: 'D2',
    
    title: '2 Passport Photos',
    description: 'Two recent, passport-type color photographs meeting ICAO standards.',
    required: true,
    order_index: 2
  },
  {
    visa_type: 'D2',
    
    title: 'Valid Passport',
    description: 'Passport valid for at least 3 months beyond planned stay, with minimum 2 blank pages plus biographical page photocopy.',
    required: true,
    order_index: 3
  },
  {
    visa_type: 'D2',
    
    title: 'Travel Insurance',
    description: 'Medical insurance covering minimum €30,000 for medical expenses, urgent assistance, and repatriation.',
    required: true,
    order_index: 4
  },
  {
    visa_type: 'D2',
    
    title: 'Proof of Accommodation',
    description: 'Rental contract, property ownership deed, or accommodation reservation in Portugal.',
    required: true,
    order_index: 5
  },
  {
    visa_type: 'D2',
    
    title: 'Detailed Business Plan',
    description: 'Comprehensive business plan including: executive summary, market analysis, financial projections (3-5 years), business model, target market, competitive analysis, and job creation potential.',
    required: true,
    order_index: 6
  },
  {
    visa_type: 'D2',
    
    title: 'Proof of Investment Capital',
    description: 'Bank statements showing available investment capital, proof of funds transfer, or letter from financial institution confirming investment capability.',
    required: true,
    order_index: 7
  },
  {
    visa_type: 'D2',
    
    title: 'Company Registration Documents',
    description: 'Portuguese company incorporation documents, business registration certificate, or proof of company formation in Portugal.',
    required: true,
    order_index: 8
  },
  {
    visa_type: 'D2',
    
    title: 'Criminal Record Certificate',
    description: 'Certificate from authority of nationality or residence country, with Hague Apostille or consular legalization.',
    required: true,
    order_index: 9
  },
  {
    visa_type: 'D2',
    
    title: 'Portuguese Tax Number (NIF)',
    description: 'Proof of Portuguese fiscal number (NIF) for business operations.',
    required: true,
    order_index: 10
  },
  {
    visa_type: 'D2',
    
    title: 'Professional Experience Documentation',
    description: 'CV/resume, references, professional certificates, or proof of relevant business experience and expertise.',
    required: false,
    order_index: 11
  },

  // ========== D3 VISA (Highly Qualified Activity) ==========
  {
    visa_type: 'D3',
    
    title: 'Completed National Visa Application',
    description: 'National visa application for highly qualified activity (D3) filled completely and signed.',
    required: true,
    order_index: 1
  },
  {
    visa_type: 'D3',
    
    title: '2 Passport Photos',
    description: 'Two recent, passport-type color photographs meeting ICAO standards.',
    required: true,
    order_index: 2
  },
  {
    visa_type: 'D3',
    
    title: 'Valid Passport',
    description: 'Passport valid for minimum 3 months beyond stay, with 2 blank pages and biographical page copy.',
    required: true,
    order_index: 3
  },
  {
    visa_type: 'D3',
    
    title: 'Travel Insurance',
    description: 'Medical insurance covering minimum €30,000 for medical expenses and repatriation.',
    required: true,
    order_index: 4
  },
  {
    visa_type: 'D3',
    
    title: 'Proof of Accommodation',
    description: 'Rental agreement, property documents, or accommodation reservation in Portugal.',
    required: true,
    order_index: 5
  },
  {
    visa_type: 'D3',
    
    title: 'Employment Contract for Highly Qualified Work',
    description: 'Signed employment contract or work agreement for highly qualified position in Portugal (teaching, research, cultural, or highly skilled subordinate activity).',
    required: true,
    order_index: 6
  },
  {
    visa_type: 'D3',
    
    title: 'Academic and Professional Qualifications',
    description: 'University degrees, professional certifications, diplomas, and credentials proving highly qualified status. Include official translations if not in Portuguese/English.',
    required: true,
    order_index: 7
  },
  {
    visa_type: 'D3',
    
    title: 'Professional Recognition Certificate',
    description: 'If required for your profession, certificate from Portuguese professional order/regulatory body recognizing your qualifications.',
    required: true,
    order_index: 8
  },
  {
    visa_type: 'D3',
    
    title: 'Criminal Record Certificate',
    description: 'Certificate from competent authority with Hague Apostille or legalization.',
    required: true,
    order_index: 9
  },
  {
    visa_type: 'D3',
    
    title: 'Proof of Salary and Financial Means',
    description: 'Employment contract showing salary meeting minimum requirements for highly qualified workers, or bank statements proving financial stability.',
    required: false,
    order_index: 10
  },

  // ========== D4 VISA (Student) ==========
  {
    visa_type: 'D4',
    
    title: 'Completed National Visa Application',
    description: 'National visa application for study purposes (D4) filled completely and signed by applicant or legal guardian.',
    required: true,
    order_index: 1
  },
  {
    visa_type: 'D4',
    
    title: '2 Passport Photos',
    description: 'Two recent, passport-type color photographs meeting ICAO standards.',
    required: true,
    order_index: 2
  },
  {
    visa_type: 'D4',
    
    title: 'Valid Passport',
    description: 'Passport valid for at least 3 months beyond course duration, with 2 blank pages and biographical page copy.',
    required: true,
    order_index: 3
  },
  {
    visa_type: 'D4',
    
    title: 'Travel Insurance',
    description: 'Medical insurance covering minimum €30,000 for medical expenses, emergency assistance, and repatriation for study duration.',
    required: true,
    order_index: 4
  },
  {
    visa_type: 'D4',
    
    title: 'Proof of Accommodation in Portugal',
    description: 'Student residence contract, university dormitory confirmation, rental agreement, or host family letter.',
    required: true,
    order_index: 5
  },
  {
    visa_type: 'D4',
    
    title: 'University Acceptance Letter',
    description: 'Official acceptance letter from Portuguese higher education institution confirming enrollment in recognized study program.',
    required: true,
    order_index: 6
  },
  {
    visa_type: 'D4',
    
    title: 'Proof of Tuition Payment',
    description: 'Receipt or confirmation of tuition fee payment, or scholarship award letter covering tuition costs.',
    required: true,
    order_index: 7
  },
  {
    visa_type: 'D4',
    
    title: 'Proof of Financial Means',
    description: 'Bank statements, scholarship documentation, or parental financial guarantee showing sufficient funds for tuition and living expenses during studies.',
    required: true,
    order_index: 8
  },
  {
    visa_type: 'D4',
    
    title: 'Criminal Record Certificate',
    description: 'Certificate from competent authority (except applicants under 16), with Hague Apostille or legalization.',
    required: true,
    order_index: 9
  },
  {
    visa_type: 'D4',
    
    title: 'Academic Records and Diplomas',
    description: 'Previous academic transcripts, diplomas, and certificates proving educational qualifications for enrollment.',
    required: true,
    order_index: 10
  },
  {
    visa_type: 'D4',
    
    title: 'Parental Authorization (if Minor)',
    description: 'For minors: travel authorization from parent(s) or legal guardian, copy of parents\' ID, and proof of guardianship.',
    required: false,
    order_index: 11
  },

  // ========== D6 VISA (Family Reunification) ==========
  {
    visa_type: 'D6',
    
    title: 'Completed National Visa Application',
    description: 'National visa application for family reunification (D6) filled and signed by applicant or legal guardian.',
    required: true,
    order_index: 1
  },
  {
    visa_type: 'D6',
    
    title: '2 Passport Photos',
    description: 'Two recent, passport-type color photographs meeting ICAO standards.',
    required: true,
    order_index: 2
  },
  {
    visa_type: 'D6',
    
    title: 'Valid Passport',
    description: 'Passport valid for at least 3 months beyond planned stay, with minimum 2 blank pages and biographical page copy.',
    required: true,
    order_index: 3
  },
  {
    visa_type: 'D6',
    
    title: 'Travel Insurance',
    description: 'Medical insurance covering minimum €30,000 for medical expenses, emergency care, and repatriation.',
    required: true,
    order_index: 4
  },
  {
    visa_type: 'D6',
    
    title: 'Proof of Family Relationship',
    description: 'Marriage certificate, birth certificate, partnership registration, or other official documents proving family relationship with sponsor in Portugal.',
    required: true,
    order_index: 5
  },
  {
    visa_type: 'D6',
    
    title: 'Sponsor\'s Residence Permit',
    description: 'Copy of family member\'s (sponsor) valid Portuguese residence permit or citizenship documentation.',
    required: true,
    order_index: 6
  },
  {
    visa_type: 'D6',
    
    title: 'Proof of Accommodation',
    description: 'Sponsor\'s property deed, rental contract, or housing authorization letter showing adequate accommodation for family in Portugal.',
    required: true,
    order_index: 7
  },
  {
    visa_type: 'D6',
    
    title: 'Sponsor\'s Proof of Income',
    description: 'Sponsor\'s employment contract, salary statements, or proof of sufficient income to support family member(s) in Portugal.',
    required: true,
    order_index: 8
  },
  {
    visa_type: 'D6',
    
    title: 'Criminal Record Certificate',
    description: 'Certificate from competent authority of nationality or residence country, with Hague Apostille or legalization.',
    required: true,
    order_index: 9
  },
  {
    visa_type: 'D6',
    
    title: 'Family Reunification Declaration',
    description: 'Formal declaration from sponsor in Portugal requesting family reunification and accepting responsibility for applicant.',
    required: false,
    order_index: 10
  },

  // ========== D7 DIGITAL NOMAD ==========
  {
    visa_type: 'D7 Digital Nomad',
    
    title: 'Completed National Visa Application',
    description: 'National visa application for remote work/digital nomad (D7) filled and signed.',
    required: true,
    order_index: 1
  },
  {
    visa_type: 'D7 Digital Nomad',
    
    title: '2 Passport Photos',
    description: 'Two recent, passport-type color photographs meeting ICAO standards.',
    required: true,
    order_index: 2
  },
  {
    visa_type: 'D7 Digital Nomad',
    
    title: 'Valid Passport',
    description: 'Passport valid for minimum 3 months beyond stay, with 2 blank pages and biographical page copy.',
    required: true,
    order_index: 3
  },
  {
    visa_type: 'D7 Digital Nomad',
    
    title: 'Travel Insurance',
    description: 'Medical insurance covering minimum €30,000 for medical expenses and repatriation during remote work period.',
    required: true,
    order_index: 4
  },
  {
    visa_type: 'D7 Digital Nomad',
    
    title: 'Proof of Accommodation',
    description: 'Rental agreement, property reservation, or accommodation confirmation in Portugal for duration of remote work.',
    required: true,
    order_index: 5
  },
  {
    visa_type: 'D7 Digital Nomad',
    
    title: 'Employment Contract or Service Provider Agreement',
    description: 'Remote work employment contract with foreign employer or service provider/freelance contracts demonstrating remote work capability.',
    required: true,
    order_index: 6
  },
  {
    visa_type: 'D7 Digital Nomad',
    
    title: 'Proof of Income (Last 3 Months)',
    description: 'Bank statements and payment receipts from last 3 months showing stable income meeting minimum requirements (typically 4x Portuguese minimum wage).',
    required: true,
    order_index: 7
  },
  {
    visa_type: 'D7 Digital Nomad',
    
    title: 'Criminal Record Certificate',
    description: 'Certificate from competent authority with Hague Apostille or legalization.',
    required: true,
    order_index: 8
  },
  {
    visa_type: 'D7 Digital Nomad',
    
    title: 'Proof of Remote Work Activity',
    description: 'Portfolio, client testimonials, company registration as freelancer, or documentation proving ability to work remotely for foreign clients/employers.',
    required: true,
    order_index: 9
  },
  {
    visa_type: 'D7 Digital Nomad',
    
    title: 'Tax Number (NIF)',
    description: 'Portuguese tax identification number (NIF) for tax purposes.',
    required: false,
    order_index: 10
  },

  // ========== GOLDEN VISA ==========
  {
    visa_type: 'Golden Visa',
    
    title: 'Completed National Visa Application',
    description: 'National visa application for investment (Golden Visa) filled and signed.',
    required: true,
    order_index: 1
  },
  {
    visa_type: 'Golden Visa',
    
    title: '2 Passport Photos',
    description: 'Two recent, passport-type color photographs meeting ICAO standards.',
    required: true,
    order_index: 2
  },
  {
    visa_type: 'Golden Visa',
    
    title: 'Valid Passport',
    description: 'Passport valid for at least 3 months beyond stay, with 2 blank pages and biographical page photocopy.',
    required: true,
    order_index: 3
  },
  {
    visa_type: 'Golden Visa',
    
    title: 'Travel Insurance',
    description: 'Medical insurance covering minimum €30,000 for medical expenses and repatriation.',
    required: true,
    order_index: 4
  },
  {
    visa_type: 'Golden Visa',
    
    title: 'Proof of Accommodation',
    description: 'Property ownership documents, rental agreement, or hotel reservation in Portugal.',
    required: true,
    order_index: 5
  },
  {
    visa_type: 'Golden Visa',
    
    title: 'Proof of Investment',
    description: 'Documentation of qualifying investment: property purchase deed, capital transfer certificate, business investment agreement, or research/cultural donation receipt.',
    required: true,
    order_index: 6
  },
  {
    visa_type: 'Golden Visa',
    
    title: 'Source of Funds Declaration',
    description: 'Detailed declaration and proof of legal source of investment funds: employment income, business profits, inheritance, property sales, or investment returns.',
    required: true,
    order_index: 7
  },
  {
    visa_type: 'Golden Visa',
    
    title: 'Bank Statements',
    description: 'Bank statements from last 6 months showing financial capacity and investment fund transfers.',
    required: true,
    order_index: 8
  },
  {
    visa_type: 'Golden Visa',
    
    title: 'Criminal Record Certificate',
    description: 'Certificate from competent authority with Hague Apostille or legalization.',
    required: true,
    order_index: 9
  },
  {
    visa_type: 'Golden Visa',
    
    title: 'Portuguese Tax Number (NIF)',
    description: 'Proof of Portuguese tax identification number (NIF).',
    required: true,
    order_index: 10
  },
  {
    visa_type: 'Golden Visa',
    
    title: 'Investment Documentation',
    description: 'Depending on investment route: property valuation, business plan, fund investment certificate, or job creation proof.',
    required: false,
    order_index: 11
  },

  // ========== JOB SEEKER VISA ==========
  {
    visa_type: 'Job Seeker',
    
    title: 'Completed National Visa Application',
    description: 'National visa application for job seeking purposes filled and signed.',
    required: true,
    order_index: 1
  },
  {
    visa_type: 'Job Seeker',
    
    title: '2 Passport Photos',
    description: 'Two recent, passport-type color photographs meeting ICAO standards.',
    required: true,
    order_index: 2
  },
  {
    visa_type: 'Job Seeker',
    
    title: 'Valid Passport',
    description: 'Passport valid for minimum 3 months beyond planned search period, with 2 blank pages and copy of biographical page.',
    required: true,
    order_index: 3
  },
  {
    visa_type: 'Job Seeker',
    
    title: 'Travel Insurance',
    description: 'Medical insurance covering minimum €30,000 for medical expenses and repatriation during job search period.',
    required: true,
    order_index: 4
  },
  {
    visa_type: 'Job Seeker',
    
    title: 'Proof of Accommodation',
    description: 'Rental agreement, hotel reservation, or accommodation proof in Portugal for job search period.',
    required: true,
    order_index: 5
  },
  {
    visa_type: 'Job Seeker',
    
    title: 'IEFP Registration Proof',
    description: 'Confirmation of registration with Institute for Employment and Vocational Training (IEFP) website as job seeker.',
    required: true,
    order_index: 6
  },
  {
    visa_type: 'Job Seeker',
    
    title: 'Proof of Financial Means',
    description: 'Bank statements showing sufficient funds to support yourself during job search period without working (typically 3-6 months of living expenses).',
    required: true,
    order_index: 7
  },
  {
    visa_type: 'Job Seeker',
    
    title: 'Academic and Professional Qualifications',
    description: 'University degrees, professional certificates, diplomas proving qualifications relevant to Portuguese job market.',
    required: true,
    order_index: 8
  },
  {
    visa_type: 'Job Seeker',
    
    title: 'Criminal Record Certificate',
    description: 'Certificate from competent authority with Hague Apostille or legalization.',
    required: true,
    order_index: 9
  },
  {
    visa_type: 'Job Seeker',
    
    title: 'CV and Motivation Letter',
    description: 'Updated CV/resume and motivation letter explaining job search plan and target positions in Portugal.',
    required: false,
    order_index: 10
  }
]

async function populateTemplates() {
  try {
    console.log('🔄 Starting comprehensive checklist template population...')
    
    // Clear existing templates
    await supabase.from('checklist_templates').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('✓ Cleared existing templates')

    // Insert all templates
    const { data, error } = await supabase
      .from('checklist_templates')
      .insert(templates)

    if (error) {
      console.error('❌ Error inserting templates:', error)
      process.exit(1)
    }

    console.log(`✅ Successfully populated ${templates.length} comprehensive checklist templates!`)
    console.log('\n📊 Summary by visa type:')
    
    const visaTypes = [...new Set(templates.map(t => t.visa_type))]
    visaTypes.forEach(type => {
      const count = templates.filter(t => t.visa_type === type).length
      console.log(`   ${type}: ${count} items`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

populateTemplates()
