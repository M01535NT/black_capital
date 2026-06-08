-- Hardening aplicado al proyecto remoto el 2026-06-07.
-- La app administra datos desde API routes server-side con service_role.
-- El acceso directo desde anon/authenticated queda limitado a lectura publica.

-- Fix mutable search_path warnings on trigger functions.
ALTER FUNCTION public.update_agents_updated_at() SET search_path = public;
ALTER FUNCTION public.update_leads_updated_at() SET search_path = public;
ALTER FUNCTION public.update_properties_updated_at() SET search_path = public;

-- Remove direct authenticated/anonymous write policies from exposed tables.
DROP POLICY IF EXISTS "Authenticated users can manage agents" ON public.agents;
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can manage properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can manage property_agents" ON public.property_agents;
DROP POLICY IF EXISTS "Anonymous can insert leads" ON public.leads;

-- Tighten public junction read to published inventory only.
DROP POLICY IF EXISTS "Anyone can read property_agents" ON public.property_agents;
CREATE POLICY "Anyone can read property_agents for available properties"
    ON public.property_agents
    FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.properties p
            WHERE p.id = property_agents.property_id
              AND p.status = 'Available'
        )
    );

-- Public buckets can serve public object URLs without broad storage.objects
-- SELECT policies. Removing these prevents clients from listing all files.
DROP POLICY IF EXISTS "Allow public reads   1iv6gyx_0" ON storage.objects;
DROP POLICY IF EXISTS "Public can read public bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can manage public bucket" ON storage.objects;
