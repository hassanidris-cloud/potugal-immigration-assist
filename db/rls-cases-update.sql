-- Allow users to update their own case (e.g. change visa type on Edit Case page).
-- Run this in Supabase SQL Editor if "Save Changes" on Edit Case doesn't update the case.
-- Idempotent: safe to run multiple times.

DROP POLICY IF EXISTS "Users can update own cases" ON public.cases;
CREATE POLICY "Users can update own cases" ON public.cases
  FOR UPDATE USING (user_id = auth.uid());
