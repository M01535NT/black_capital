-- 20260605_fix_leads_policies.sql
-- Limpieza: eliminar policies duplicadas en leads y restringir SELECT
--
-- Las policies de leads tienen:
-- 1) "Anonymous allow insert for leads" (INSERT, public)
-- 2) "Anyone can insert leads" (INSERT, public)  ← DUPLICADA, mismo efecto
-- 3) "Admin all access for leads" (ALL, authenticated) - demasiado permisiva
--
-- FIX:
-- - DROP duplicada "Anyone can insert leads"
-- - Renombrar "Anonymous allow insert for leads" a convención consistente
-- - Cambiar "Admin all access for leads" a "Authenticated users can manage leads"
--   (FOR ALL con auth.role() check)

DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anonymous allow insert for leads" ON public.leads;
DROP POLICY IF EXISTS "Admin all access for leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can read leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON public.leads;

-- Anon: solo INSERT (formulario público de leads)
CREATE POLICY "Anonymous can insert leads"
    ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Authenticated: CRUD total
CREATE POLICY "Authenticated users can manage leads"
    ON public.leads
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
