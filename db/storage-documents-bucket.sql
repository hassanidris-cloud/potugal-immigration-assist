-- Storage bucket "documents" – RLS policies so users can upload case documents
-- Run this in Supabase SQL Editor. Create the bucket first if needed: Dashboard → Storage → New bucket → name: documents (private).

-- Allow authenticated users to upload into a folder only when that folder is their case id and they own the case
DROP POLICY IF EXISTS "Users can upload documents to own case folder" ON storage.objects;
CREATE POLICY "Users can upload documents to own case folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id::text = (storage.foldername(name))[1]
      AND cases.user_id = auth.uid()
    )
  );

-- Allow users to read objects in their own case folders (for viewing/downloading uploaded docs)
DROP POLICY IF EXISTS "Users can read documents in own case folder" ON storage.objects;
CREATE POLICY "Users can read documents in own case folder"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id::text = (storage.foldername(name))[1]
      AND cases.user_id = auth.uid()
    )
  );

-- Admins can do everything in documents bucket (optional)
DROP POLICY IF EXISTS "Admins can manage documents bucket" ON storage.objects;
CREATE POLICY "Admins can manage documents bucket"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'documents' AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin')
  WITH CHECK (bucket_id = 'documents' AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
