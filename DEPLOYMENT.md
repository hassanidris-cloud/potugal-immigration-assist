# Portugal Immigration App - Deployment Guide

## Overview
This guide walks you through deploying your Next.js application to production so clients can access it online.

## Prerequisites
- Git repository (recommended: GitHub)
- Supabase account (already set up)
- Stripe account with production keys
- Vercel account (free tier available)

---

## Step 1: Prepare Your Git Repository

### 1.1 Initialize Git (if not already done)
```bash
cd portugal-immigration-app
git init
git add .
git commit -m "Initial commit: Portugal immigration app ready for deployment"
```

### 1.2 Push to GitHub
1. Create a new repository on GitHub: https://github.com/new
2. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/portugal-immigration-app.git
git branch -M main
git push -u origin main
```

---

## Step 2: Configure Supabase for Production

### 2.1 Create Subscriptions Table
Your app requires the subscriptions table. In Supabase Dashboard:

1. Go to **SQL Editor**
2. Run the following SQL:

```sql
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('trial', 'Essential', 'Premium', 'Concierge')),
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('trial', 'pending', 'active', 'cancelled', 'expired')) DEFAULT 'active',
  stripe_session_id TEXT,
  stripe_subscription_id TEXT,
  paid_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can manage subscriptions
CREATE POLICY "Admins can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

### 2.2 Configure Authentication URLs
In Supabase Dashboard → Authentication → URL Configuration:

Add these redirect URLs:
```
https://your-domain.com/auth/callback
https://your-domain.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

Replace `your-domain.com` with your actual custom domain.

### 2.3 Get Production Keys
Collect these from Supabase:
- NEXT_PUBLIC_SUPABASE_URL (from Settings → General)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (from Settings → API)
- SUPABASE_SERVICE_ROLE_KEY (from Settings → API → Service Role Secret)

---

## Step 3: Configure Stripe for Production

### 3.1 Get Production Keys
In Stripe Dashboard → Developers → API Keys:

Copy the **Production** keys:
- Publishable Key (starts with `pk_live_`)
- Secret Key (starts with `sk_live_`)

### 3.2 Set Up Webhooks
In Stripe Dashboard → Developers → Webhooks:

1. Click "Add endpoint"
2. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Get the **Webhook Secret** (starts with `whsec_`)

---

## Step 4: Deploy to Vercel

### 4.1 Connect Repository to Vercel
1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Select your `portugal-immigration-app` repository
4. Click "Import"

### 4.2 Add Environment Variables
In the "Environment Variables" section, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
STRIPE_SECRET_KEY=sk_live_your_production_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
BASE_URL=https://your-domain.vercel.app
```

### 4.3 Deploy
1. Click "Deploy"
2. Vercel will build and deploy your app
3. You'll get a URL: `https://your-project.vercel.app`

---

## Step 5: Connect Custom Domain (Optional but Recommended)

### 5.1 In Vercel Dashboard
1. Go to your project
2. Settings → Domains
3. Add your custom domain (e.g., `immigrationapp.com`)
4. Follow DNS configuration steps

### 5.2 Update Supabase
Update the redirect URLs in Supabase → Authentication → URL Configuration to use your custom domain.

---

## Step 6: Test Production Environment

### Test Checklist
- [ ] Sign up with new email
- [ ] Verify email (check inbox)
- [ ] Log in with email/password
- [ ] Try "Forgot Password" flow
- [ ] Create a test case
- [ ] Upload a test document
- [ ] Start free trial
- [ ] Test Stripe checkout with test card: `4242 4242 4242 4242`
- [ ] Check subscription appears in Supabase

### Test Card Numbers (Stripe)
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Require Auth: `4000 2500 0000 3155`
- Use any future date and any 3-digit CVC

---

## Step 7: Set Up Monitoring

### Enable Vercel Analytics
1. Vercel Dashboard → Settings → Analytics
2. Enable "Web Analytics"

### Monitor Supabase
1. Supabase Dashboard → Database → Realtime
2. Watch for errors in SQL Editor

### Monitor Stripe
1. Stripe Dashboard → Developers → Webhooks → Event Log
2. Ensure no failed webhook deliveries

---

## Production Checklist

- [ ] Git repository pushed to GitHub
- [ ] Supabase subscriptions table created
- [ ] Supabase authentication URLs configured
- [ ] Stripe production keys configured
- [ ] Stripe webhooks set up
- [ ] Deployed to Vercel
- [ ] Environment variables all set
- [ ] Custom domain configured (optional)
- [ ] Test signup → verify → trial → upgrade flow
- [ ] Test payment with test card
- [ ] Monitor for errors first 24 hours

---

## Troubleshooting

### Issue: "Could not find the table 'public.subscriptions'"
**Solution:** Run the SQL from Step 2.1 in Supabase SQL Editor

### Issue: "Invalid API Key" from Stripe
**Solution:** Ensure you're using PRODUCTION keys (sk_live_*, pk_live_*), not test keys

### Issue: Email verification not working
**Solution:** Check redirect URLs in Supabase Authentication → URL Configuration

### Issue: Payments not being processed
**Solution:** 
1. Check Stripe webhooks in Event Log
2. Verify webhook endpoint URL matches deployment URL
3. Ensure STRIPE_WEBHOOK_SECRET is correct

### Issue: Redirect loop or 404 errors
**Solution:** 
1. Verify BASE_URL environment variable matches deployment URL
2. Check Supabase redirect URLs include your domain

---

## Security Best Practices

1. **Never commit secrets** - All keys should be in environment variables only
2. **Use separate Stripe accounts** - One for testing, one for production
3. **Enable RLS** - Ensure all database tables have Row Level Security
4. **Rotate webhooks** - Periodically regenerate webhook secrets
5. **Monitor usage** - Set up billing alerts in Stripe and Vercel

---

## Support

For issues:
1. Check Vercel Deployment Logs: Vercel Dashboard → Deployments → Click deployment
2. Check Supabase Logs: Supabase Dashboard → Database → Logs
3. Check Stripe Event Log: Stripe Dashboard → Developers → Webhooks → Event Log

---

## Going Live with Clients

Once verified:
1. Share your domain with clients: `https://your-domain.com`
2. Clients can sign up and start creating cases
3. They can upload documents and make payments
4. You receive updates in real-time via Supabase

Good luck! 🚀
