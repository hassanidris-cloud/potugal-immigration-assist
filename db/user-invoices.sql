-- Client invoices: admin uploads PDF per client, client can view and download
CREATE TABLE IF NOT EXISTS public.user_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_user_invoices_user_id ON public.user_invoices(user_id);

ALTER TABLE public.user_invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own invoices" ON public.user_invoices;
CREATE POLICY "Clients can view own invoices" ON public.user_invoices
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Admins full access to invoices" ON public.user_invoices;
CREATE POLICY "Admins full access to invoices" ON public.user_invoices
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Storage bucket "invoices" (create in Dashboard → Storage → New bucket, name: invoices, private).
-- Then in Storage → invoices → Policies add:
--
-- Policy 1 (INSERT for admins):
--   Name: Admins can upload invoices
--   Allowed operation: INSERT
--   Target roles: authenticated
--   Policy definition (USING expression): (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
--
-- Policy 2 (SELECT for clients - read own folder only):
--   Name: Users can read own invoices
--   Allowed operation: SELECT
--   Target roles: authenticated
--   Policy definition: (storage.foldername(name))[1] = auth.uid()::text
--
-- The download API uses the service role to create signed URLs, so bucket can stay private.
