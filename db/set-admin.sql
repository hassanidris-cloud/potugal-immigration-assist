-- Make a user an admin
-- Run in Supabase Dashboard → SQL Editor (not Table Editor).
-- Replace 'admin@example.com' with the exact email they use to sign in.
--
-- WHERE TO SEE THE ROLE COLUMN:
-- Supabase Authentication → Users does NOT have a role column.
-- To see and edit role, go to: Table Editor → public schema → "users" table.
-- That table has the role column (client / admin).

-- If the role column is missing (table created before schema had role), run this first:
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'client';

UPDATE public.users
SET role = 'admin'
WHERE email = 'admin@example.com';

-- Sync role into Authentication (so it shows in Authentication → Users):
-- Run once from project root: node scripts/sync-roles-to-auth.js
-- Or call POST /api/admin/sync-user-role with body { userId, role: 'admin', adminUserId }.

-- Check: run this to confirm (change email if needed)
-- SELECT id, email, full_name, role FROM public.users WHERE email = 'admin@example.com';
