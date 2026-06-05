-- 20260605_fix_rls_policies.sql
-- Sprint 1: Higiene RLS
--
-- PROBLEMA DETECTADO:
-- 1) Policies con `roles: {public}` + `cmd: ALL` + `qual: true` permitían que
--    CUALQUIER visitante anónimo hiciera INSERT/UPDATE/DELETE en
--    properties, agents y property_agents. La intención era "admin via
--    service_role" pero `{public}` = anon + authenticated, no service_role
--    (que bypasea RLS automáticamente).
-- 2) Policies duplicadas (mismo efecto, dos policies) confundían y abrían
--    agujeros: "Public read access for properties" dejaba leer TODO, no
--    solo `status = 'Available'`.
--
-- FIX:
-- - DROP todas las policies permisivas.
-- - RECREAR con `roles: {authenticated}` para admin (service_role sigue
--   bypaseando RLS via createAdminClient en src/lib/supabase/admin.ts).
-- - Mantener `roles: {public}` SOLO para SELECTs legítimos (anon puede
--   leer catálogo público).
-- - Eliminar policies duplicadas (la "Anyone can read X" gana sobre
--   "Public can read X" porque la primera es la convención del repo).
--
-- VERIFICACIÓN POST-APLICAR:
-- 1. anon NO debe poder INSERT en properties (HTTP 403 desde PostgREST).
-- 2. anon SÍ debe poder SELECT properties WHERE status='Available' (200).
-- 3. service_role (admin client) SÍ debe poder INSERT/UPDATE/DELETE todo.

-- ============================================================
-- PROPERTIES
-- ============================================================

-- Drop todas las policies permisivas/duplicadas
DROP POLICY IF EXISTS "Admin write access for properties" ON public.properties;
DROP POLICY IF EXISTS "Public read access for properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can manage properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can read available properties" ON public.properties;

-- Anon: solo SELECT de propiedades disponibles (catálogo público)
CREATE POLICY "Anyone can read available properties"
    ON public.properties
    FOR SELECT
    TO anon, authenticated
    USING (status = 'Available');

-- Admin (authenticated): CRUD total. service_role bypasea RLS igual.
CREATE POLICY "Authenticated users can manage properties"
    ON public.properties
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- AGENTS
-- ============================================================

DROP POLICY IF EXISTS "Admin full access" ON public.agents;
DROP POLICY IF EXISTS "Public can read active agents" ON public.agents;
DROP POLICY IF EXISTS "Anyone can read active agents" ON public.agents;
DROP POLICY IF EXISTS "Authenticated users can manage agents" ON public.agents;

-- Anon: SELECT de agentes activos
CREATE POLICY "Anyone can read active agents"
    ON public.agents
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Admin (authenticated): CRUD total
CREATE POLICY "Authenticated users can manage agents"
    ON public.agents
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- PROPERTY_AGENTS
-- ============================================================

DROP POLICY IF EXISTS "Admin full access property_agents" ON public.property_agents;
DROP POLICY IF EXISTS "Public can read property_agents" ON public.property_agents;
DROP POLICY IF EXISTS "Anyone can read property_agents" ON public.property_agents;
DROP POLICY IF EXISTS "Authenticated users can manage property_agents" ON public.property_agents;

-- Anon: SELECT de la junction (necesario para mostrar agentes asignados
-- en la página pública /inventario/[slug])
CREATE POLICY "Anyone can read property_agents"
    ON public.property_agents
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Admin (authenticated): CRUD total
CREATE POLICY "Authenticated users can manage property_agents"
    ON public.property_agents
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
