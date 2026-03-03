-- Fix: Allow users to insert and delete case_checklist rows for their own cases.
-- Run this if the checklist never loads or "Generate Checklist" / onboarding checklist creation fails (RLS blocking insert/delete).
-- Idempotent: safe to run multiple times.

DROP POLICY IF EXISTS "Users can insert checklist in own cases" ON public.case_checklist;
CREATE POLICY "Users can insert checklist in own cases" ON public.case_checklist
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_checklist.case_id
      AND cases.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete checklist in own cases" ON public.case_checklist;
CREATE POLICY "Users can delete checklist in own cases" ON public.case_checklist
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_checklist.case_id
      AND cases.user_id = auth.uid()
    )
  );
