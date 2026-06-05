-- 20260605_fix_storage_policies.sql
-- Sprint 2: Storage
--
-- PROBLEMA DETECTADO:
-- 1) Bucket `public` permitía INSERT anónimo (rol `anon`). Un visitante
--    sin auth podía subir cualquier archivo. Riesgo de spam, abuso de
--    ancho de banda, y de alojar contenido malicioso bajo nuestro dominio.
-- 2) Bucket `secure-brochures` (public=false) tenía una policy de SELECT
--    con `roles: {public}`, lo que hacía los brochures PÚBLICOS de facto
--    a pesar del nombre. Cualquiera con el link podía descargarlos.
--
-- FIX:
-- - Quitar INSERT anónimo del bucket `public`. Solo authenticated puede
--   subir (via API routes con createAdminClient o session admin).
-- - Quitar SELECT público de `secure-brochures`. Solo authenticated
--   puede descargar. Si en el futuro quieres links firmados temporales,
--   el patrón es: subir via service_role, generar signed URL con
--   expiry, devolver al cliente.
--
-- VERIFICACIÓN POST-APLICAR:
-- 1. anon NO debe poder POST a /storage/v1/object/public/foo (403).
-- 2. anon NO debe poder GET /storage/v1/object/secure-brochures/foo (403).
-- 3. authenticated SÍ debe poder POST a ambos buckets.
-- 4. Service role (admin) bypasea — no debe cambiar nada para el admin.

-- ============================================================
-- BUCKET: public
-- ============================================================

-- Drop upload anónimo (la policy "Allow public uploads 1iv6gyx_0")
DROP POLICY IF EXISTS "Allow public uploads 1iv6gyx_0" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;

-- Mantener: admin (authenticated) puede subir, leer, eliminar
-- Estas ya existen, las dropeamos para recrear con nombres consistentes
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads 1iv6gyx_0" ON storage.objects;

-- Anon: solo SELECT del bucket `public` (catálogo público de imágenes)
CREATE POLICY "Public can read public bucket"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'public');

-- Admin (authenticated): CRUD total del bucket `public`
CREATE POLICY "Authenticated can manage public bucket"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'public')
    WITH CHECK (bucket_id = 'public');

-- ============================================================
-- BUCKET: secure-brochures
-- ============================================================

-- Drop política que hacía el bucket público de facto
DROP POLICY IF EXISTS "Public read access to secure-brochures for download" ON storage.objects;
DROP POLICY IF EXISTS "Admin full access secure-brochures" ON storage.objects;

-- Admin (authenticated): CRUD total del bucket `secure-brochures`
-- Para servir un brochure a un lead, generar signed URL con expiry
-- desde una API route autenticada.
CREATE POLICY "Authenticated can read secure-brochures"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'secure-brochures');

CREATE POLICY "Authenticated can manage secure-brochures"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'secure-brochures')
    WITH CHECK (bucket_id = 'secure-brochures');
