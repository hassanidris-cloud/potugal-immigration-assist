# Portugal Immigration App

A secure, user-friendly web application that helps people moving to Portugal prepare, submit, and track all required immigration and residency documents.

## Features

### For Clients
- **Smart Checklist**: Automatically generated document checklist based on visa type
- **Secure Upload**: Upload and track immigration documents
- **Real-time Status**: Get updates from your immigration consultant
- **Payment Integration**: Pay for services securely via Stripe

### For Admins (Immigration Consultants)
- **Case Management**: Manage multiple client cases from one dashboard
- **Document Review**: Review, approve, or request revisions on documents
- **Custom Templates**: Create checklist templates for different visa types
- **Invoicing**: Generate invoices and track payments

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe Checkout

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- A Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portugal-immigration-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Copy `.env.local.example` to `.env.local` and fill in your values:
```bash
cp .env.local.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (server-side only)
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `BASE_URL`: Your app URL (http://localhost:3000 for local)

4. Set up the database:
Run the SQL scripts in the `db/` folder in your Supabase SQL Editor:
- `db/schema.sql` - Creates all tables
- `db/rls.sql` - Sets up Row Level Security policies

5. Create a Storage bucket:
In Supabase Dashboard, create a private bucket called `documents`

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Seed Data (Optional)

To add demo data for testing:
```bash
npm run seed
```

### Testing

Run smoke tests:
```bash
npm run test:smoke
```

Run extended API tests:
```bash
npm run test:extended
```

## Project Structure

```
portugal-immigration-app/
├── pages/              # Next.js pages and API routes
│   ├── api/           # Backend API endpoints
│   ├── auth/          # Authentication pages
│   ├── case/[id]/     # Case-specific pages
│   ├── admin/         # Admin pages
│   └── pay/           # Payment pages
├── lib/               # Utility libraries
├── db/                # Database schema and RLS policies
├── scripts/           # Seed and test scripts
├── styles/            # Global styles
└── .github/           # GitHub Actions CI
```

## Documentation

- [Running Locally](./RUNNING.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Role & Permissions](./ROLE_PERMISSIONS.md)
- [Deployment Guide](./DEPLOYMENT.md)

## License

MIT
