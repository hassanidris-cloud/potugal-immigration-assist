// Visa-specific personalization data for tailored user experience

export interface VisaPersonalization {
  visaType: string;
  welcomeMessage: string;
  description: string;
  processingTime: string;
  successRate: string;
  keyRequirements: string[];
  commonChallenges: string[];
  tips: string[];
  nextSteps: string[];
}

export const visaPersonalizations: Record<string, VisaPersonalization> = {
  "D7 Visa": {
    visaType: "D7 Visa (Passive Income / Retirement)",
    welcomeMessage: "Welcome! You are applying for Portugal's popular D7 visa for retirees and those with passive income.",
    description: "The D7 visa is perfect for retirees, remote workers, and individuals with passive income who want to live in Portugal long-term.",
    processingTime: "60-90 days",
    successRate: "85%",
    keyRequirements: [
      "Passive income of at least €760/month (single) or €1,140/month (couple)",
      "Proof of accommodation in Portugal",
      "Clean criminal record",
      "Valid health insurance"
    ],
    commonChallenges: [
      "Proving stable passive income for 12+ months",
      "Getting criminal record apostilled correctly",
      "Finding accommodation before arrival"
    ],
    tips: [
      "Start gathering bank statements early - you need 12 months",
      "Get your criminal record apostilled in your home country",
      "Consider using a property agent to secure accommodation remotely",
      "Budget €500-800 for the full application process"
    ],
    nextSteps: [
      "Gather all required documents from the checklist",
      "Get your NIF (Portuguese tax number)",
      "Secure accommodation in Portugal",
      "Book appointment at Portuguese consulate"
    ]
  },

  "D1 Visa": {
    visaType: "D1 Visa (Work Visa for Employed Workers)",
    welcomeMessage: "Welcome! You are applying for a D1 work visa to work for a Portuguese employer.",
    description: "The D1 visa allows you to work as an employed professional for a Portuguese company.",
    processingTime: "60-90 days",
    successRate: "80%",
    keyRequirements: [
      "Valid employment contract with Portuguese employer",
      "IEFP work authorization from your employer",
      "Proof of professional qualifications",
      "Clean criminal record"
    ],
    commonChallenges: [
      "Employer must obtain IEFP authorization first",
      "Matching qualifications to job requirements",
      "Timing the visa application with job start date"
    ],
    tips: [
      "Your employer should start the IEFP process first",
      "Get all diplomas and certificates translated and apostilled",
      "Coordinate closely with your employer's HR department",
      "Apply 2-3 months before your planned start date"
    ],
    nextSteps: [
      "Confirm your employer has IEFP authorization",
      "Gather professional qualification documents",
      "Obtain criminal record certificate",
      "Schedule consulate appointment"
    ]
  },

  "D2 Visa": {
    visaType: "D2 Visa (Entrepreneur / Self-Employment)",
    welcomeMessage: "Welcome! You are applying for a D2 entrepreneur visa to start or run a business in Portugal.",
    description: "The D2 visa is for entrepreneurs, freelancers, and business owners who want to establish their business in Portugal.",
    processingTime: "60-120 days",
    successRate: "75%",
    keyRequirements: [
      "Detailed business plan",
      "Proof of sufficient funds to support yourself and business",
      "Company registration in Portugal",
      "Relevant business experience or qualifications"
    ],
    commonChallenges: [
      "Creating a compelling business plan",
      "Demonstrating sufficient capital",
      "Registering company before visa approval"
    ],
    tips: [
      "Hire a Portuguese accountant to help with company setup",
      "Your business plan should be 15-20 pages with financial projections",
      "Show at least €10,000-€15,000 in available capital",
      "Consider consulting with StartUp Portugal or IAPMEI"
    ],
    nextSteps: [
      "Develop comprehensive business plan",
      "Register your company in Portugal (can be done remotely)",
      "Gather proof of funds and business experience",
      "Get NIF and open Portuguese bank account"
    ]
  },

  "D3 Visa": {
    visaType: "D3 Visa (Highly Qualified Activity / Tech Visa)",
    welcomeMessage: "Welcome! You are applying for a D3 Tech Visa for highly qualified professionals.",
    description: "The D3 visa is Portugal's fast-track program for tech professionals and highly qualified workers.",
    processingTime: "30-60 days (expedited)",
    successRate: "90%",
    keyRequirements: [
      "Employment with Tech Visa certified company",
      "University degree (Bachelor's or higher)",
      "At least 3 years relevant experience",
      "IAPMEI certification from employer"
    ],
    commonChallenges: [
      "Finding a Tech Visa certified employer",
      "Meeting the salary requirements",
      "Getting degree equivalency recognized"
    ],
    tips: [
      "Check if your employer is Tech Visa certified (they must apply)",
      "This is the fastest work visa option - apply quickly",
      "Salary must be above Portuguese average for the role",
      "Tech sector includes IT, engineering, biotech, and more"
    ],
    nextSteps: [
      "Confirm employer has Tech Visa certification",
      "Gather academic credentials and work experience proof",
      "Obtain criminal record",
      "Application is expedited - can be done in 30 days"
    ]
  },

  "D7 Digital Nomad": {
    visaType: "D7 Digital Nomad Visa",
    welcomeMessage: "Welcome! You are applying for Portugal's Digital Nomad visa to work remotely from Portugal.",
    description: "The Digital Nomad visa allows remote workers and freelancers to live in Portugal while working for non-Portuguese clients or employers.",
    processingTime: "60-90 days",
    successRate: "80%",
    keyRequirements: [
      "Proof of remote work capability",
      "Minimum income of €3,040/month (4x Portuguese minimum wage)",
      "Last 3 months tax returns or income proof",
      "Accommodation in Portugal"
    ],
    commonChallenges: [
      "Proving consistent monthly income",
      "Demonstrating remote work arrangement",
      "Higher income requirement than standard D7"
    ],
    tips: [
      "You need 4x the Portuguese minimum wage (currently €760)",
      "Employment contracts should specify remote work is permitted",
      "Freelancers need client contracts and invoices",
      "Tax residency implications - consult with tax advisor"
    ],
    nextSteps: [
      "Gather 3-6 months of income proof",
      "Get employer letter confirming remote work agreement",
      "Secure accommodation in Portugal",
      "Prepare to show how you'll pay Portuguese taxes"
    ]
  },

  "Golden Visa": {
    visaType: "Golden Visa (Residency by Investment)",
    welcomeMessage: "Welcome! You are applying for Portugal's Golden Visa through qualified investment.",
    description: "The Golden Visa grants residency through investment in Portugal - property, capital transfer, job creation, or investment funds.",
    processingTime: "6-12 months",
    successRate: "95%",
    keyRequirements: [
      "Qualifying investment (€500k+ property, €500k investment fund, €500k capital transfer, or 10+ jobs)",
      "Proof of legal source of funds",
      "Clean criminal record from all countries of residence",
      "Health insurance"
    ],
    commonChallenges: [
      "Sourcing and documenting investment funds legally",
      "Finding qualifying investment opportunities",
      "Long processing times",
      "High cost (investment + legal fees)"
    ],
    tips: [
      "Use a specialized Golden Visa lawyer (budget €5,000-€10,000)",
      "Investment funds are now the most popular option",
      "You only need to spend 7 days/year in Portugal to maintain",
      "Leads to permanent residency after 5 years"
    ],
    nextSteps: [
      "Choose your investment vehicle (property, fund, etc.)",
      "Hire Golden Visa specialized lawyer",
      "Prepare source of funds documentation",
      "Make qualifying investment"
    ]
  },

  "D4 Student Visa": {
    visaType: "D4 Student Visa",
    welcomeMessage: "Welcome! You are applying for a student visa to study in Portugal.",
    description: "The D4 visa allows you to study at a Portuguese university or educational institution.",
    processingTime: "30-60 days",
    successRate: "90%",
    keyRequirements: [
      "Acceptance letter from Portuguese university",
      "Proof of tuition payment or financial guarantee",
      "Minimum €565/month for living expenses",
      "Accommodation proof"
    ],
    commonChallenges: [
      "Proving sufficient funds for entire study period",
      "Finding accommodation before arrival",
      "Getting academic records properly translated"
    ],
    tips: [
      "Apply as soon as you get your acceptance letter",
      "Student visa allows 20 hours/week part-time work",
      "Consider university dormitories for easier accommodation proof",
      "Budget €565-€800/month for living expenses"
    ],
    nextSteps: [
      "Get official acceptance letter from university",
      "Show financial proof (€565/month x duration)",
      "Secure accommodation (dorm or rental)",
      "Get academic records apostilled"
    ]
  },

  "D6 Family Reunification": {
    visaType: "D6 Family Reunification Visa",
    welcomeMessage: "Welcome! You are applying to join your family member in Portugal.",
    description: "The D6 visa allows family members of Portuguese residents to live in Portugal together.",
    processingTime: "60-90 days",
    successRate: "85%",
    keyRequirements: [
      "Proof of family relationship (marriage/birth certificate)",
      "Sponsor has valid residence permit in Portugal",
      "Sponsor has sufficient income to support family",
      "Adequate accommodation for family size"
    ],
    commonChallenges: [
      "Proving genuine relationship",
      "Sponsor showing sufficient financial means",
      "Accommodation meeting size requirements"
    ],
    tips: [
      "Gather all relationship documents (marriage/birth certificates)",
      "Sponsor should show stable income (employment or savings)",
      "Accommodation must meet minimum space requirements per person",
      "Get all documents apostilled in country of origin"
    ],
    nextSteps: [
      "Get relationship documents apostilled",
      "Obtain copy of sponsor's residence permit",
      "Sponsor prepares financial documentation",
      "Secure appropriate accommodation proof"
    ]
  },

  "Schengen Visa": {
    visaType: "Schengen Short-Stay Visa",
    welcomeMessage: "Welcome! You are applying for a short-stay Schengen visa to visit Portugal.",
    description: "The Schengen visa allows stays up to 90 days within 180 days for tourism, business, or family visits.",
    processingTime: "15-30 days",
    successRate: "85%",
    keyRequirements: [
      "Valid passport (3+ months beyond stay)",
      "Travel itinerary and accommodation bookings",
      "Travel insurance (€30,000 minimum coverage)",
      "Proof of €65/day financial means"
    ],
    commonChallenges: [
      "Proving intention to return home",
      "Showing sufficient funds",
      "Getting travel insurance that meets requirements"
    ],
    tips: [
      "Don't buy non-refundable tickets before visa approval",
      "Show strong ties to home country (job, property, family)",
      "Travel insurance must cover all Schengen countries",
      "Bank statements should show regular income, not sudden deposits"
    ],
    nextSteps: [
      "Book refundable hotel reservations",
      "Purchase Schengen travel insurance",
      "Prepare travel itinerary",
      "Schedule appointment at consulate"
    ]
  },

  "Temporary Stay Visa": {
    visaType: "Temporary Stay Visa",
    welcomeMessage: "Welcome! You are applying for a temporary stay visa for your specific purpose in Portugal.",
    description: "Temporary stay visas are for specific purposes like medical treatment, research, seasonal work, or cultural activities.",
    processingTime: "30-60 days",
    successRate: "80%",
    keyRequirements: [
      "Documentation supporting purpose of stay",
      "Proof of accommodation",
      "Financial means for duration",
      "Health insurance"
    ],
    commonChallenges: [
      "Clearly documenting purpose of stay",
      "Limited duration and renewal options",
      "Purpose-specific documentation requirements"
    ],
    tips: [
      "Be very clear and specific about your purpose",
      "Gather official invitations or authorization letters",
      "This visa type is very purpose-dependent",
      "May not lead to long-term residency"
    ],
    nextSteps: [
      "Obtain official documentation for your specific purpose",
      "Secure accommodation for stay duration",
      "Purchase health insurance",
      "Prepare detailed explanation of your activity"
    ]
  }
};

export function getVisaPersonalization(visaType: string): VisaPersonalization {
  return visaPersonalizations[visaType] || visaPersonalizations["Temporary Stay Visa"];
}

export function getVisaTypeColor(visaType: string): string {
  const colors: Record<string, string> = {
    "D7 Visa": "bg-blue-500",
    "D1 Visa": "bg-green-500",
    "D2 Visa": "bg-purple-500",
    "D3 Visa": "bg-indigo-500",
    "D7 Digital Nomad": "bg-cyan-500",
    "Golden Visa": "bg-yellow-500",
    "D4 Student Visa": "bg-pink-500",
    "D6 Family Reunification": "bg-rose-500",
    "Schengen Visa": "bg-gray-500",
    "Temporary Stay Visa": "bg-slate-500"
  };
  return colors[visaType] || "bg-gray-500";
}
