-- Add paid_at to users: when set by admin, user can access dashboard and create a case
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Allow admins to update any user (e.g. set paid_at)
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (is_admin());
