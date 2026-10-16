-- Prepared and verified only in the isolated stack. Apply remotely as a separate release.
-- The application uploads with service_role and delivers documents with signed URLs
-- after verifying the documentary session; a Supabase login alone is insufficient.
BEGIN;
DROP POLICY IF EXISTS "Authenticated can read secure-brochures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can manage secure-brochures" ON storage.objects;
DROP POLICY IF EXISTS "Restrict private document direct access" ON storage.objects;
CREATE POLICY "Restrict private document direct access"
  ON storage.objects AS RESTRICTIVE FOR ALL TO anon, authenticated
  USING (bucket_id <> 'secure-brochures')
  WITH CHECK (bucket_id <> 'secure-brochures');
COMMIT;
