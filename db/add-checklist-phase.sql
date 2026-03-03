-- Add phase column to checklist tables for grouping (e.g. Phase 1, Phase 2, Phase 3)
-- Run once. Safe to re-run: ignores error if column already exists.

DO $$
BEGIN
  ALTER TABLE public.checklist_templates ADD COLUMN phase TEXT;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.case_checklist ADD COLUMN phase TEXT;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;
