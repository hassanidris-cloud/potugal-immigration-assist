-- Add explicit document-to-checklist links and OCR verification metadata
-- Run this on existing environments after schema.sql + rls.sql

CREATE TABLE IF NOT EXISTS public.case_checklist_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  checklist_item_id UUID NOT NULL REFERENCES public.case_checklist(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  ocr_status TEXT NOT NULL DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'matched', 'mismatch', 'unavailable', 'error')),
  ocr_confidence NUMERIC(5,2),
  ocr_excerpt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (document_id),
  UNIQUE (checklist_item_id, document_id)
);

CREATE INDEX IF NOT EXISTS idx_case_checklist_documents_case_id
  ON public.case_checklist_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_case_checklist_documents_checklist_item_id
  ON public.case_checklist_documents(checklist_item_id);
CREATE INDEX IF NOT EXISTS idx_case_checklist_documents_document_id
  ON public.case_checklist_documents(document_id);

ALTER TABLE public.case_checklist_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view checklist document links in own cases" ON public.case_checklist_documents;
CREATE POLICY "Users can view checklist document links in own cases" ON public.case_checklist_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_checklist_documents.case_id
      AND (cases.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Users can link documents to own checklist items" ON public.case_checklist_documents;
CREATE POLICY "Users can link documents to own checklist items" ON public.case_checklist_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.cases
      JOIN public.case_checklist ON case_checklist.case_id = cases.id
      JOIN public.documents ON documents.case_id = cases.id
      WHERE cases.id = case_checklist_documents.case_id
      AND case_checklist.id = case_checklist_documents.checklist_item_id
      AND documents.id = case_checklist_documents.document_id
      AND (cases.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Users can delete checklist document links in own cases" ON public.case_checklist_documents;
CREATE POLICY "Users can delete checklist document links in own cases" ON public.case_checklist_documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_checklist_documents.case_id
      AND (cases.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Admins can manage all checklist document links" ON public.case_checklist_documents;
CREATE POLICY "Admins can manage all checklist document links" ON public.case_checklist_documents
  FOR ALL USING (public.is_admin());
