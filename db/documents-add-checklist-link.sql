-- Explicit link between documents and checklist items (no title-matching bypass)
-- Run in Supabase SQL Editor. Safe to run multiple times.

ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS case_checklist_id UUID REFERENCES public.case_checklist(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_documents_case_checklist_id ON public.documents(case_checklist_id);

COMMENT ON COLUMN public.documents.case_checklist_id IS 'Checklist requirement this document satisfies; used for validation and completion.';
