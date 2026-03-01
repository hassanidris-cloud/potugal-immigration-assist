-- Make a user an admin
-- Run in Supabase Dashboard → SQL Editor (not Table Editor).
-- Replace 'admin@example.com' with the exact email they use to sign in.

-- If the role column is missing (table created before schema had role), run this first:
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'client';

UPDATE public.users
SET role = 'admin'
WHERE email = 'admin@example.com';

-- Check: run this to confirm (change email if needed)
-- SELECT id, email, full_name, role FROM public.users WHERE email = 'admin@example.com';
