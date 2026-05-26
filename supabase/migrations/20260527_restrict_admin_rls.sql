-- Restrict RLS policies: Admin operations should require authentication
-- Previously, "Admin full access" policies used USING (true) which allows
-- anonymous access. This migration restricts them to authenticated users.

-- Drop old permissive policies
DROP POLICY IF EXISTS "Admin full access" ON public.agents;
DROP POLICY IF EXISTS "Admin full access property_agents" ON public.property_agents;

-- Recreate with proper restrictions
-- Only authenticated users can modify agents
CREATE POLICY "Admin full access" ON public.agents
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Only authenticated users can modify property-agent assignments
CREATE POLICY "Admin full access property_agents" ON public.property_agents
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
