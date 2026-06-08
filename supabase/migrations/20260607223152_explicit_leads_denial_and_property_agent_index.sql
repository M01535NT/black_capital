-- Make direct leads access explicit. Leads are created and managed only
-- through service_role API routes, which bypass RLS safely server-side.
CREATE POLICY "Deny direct access to leads"
    ON public.leads
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

-- Cover the foreign key used when deleting or looking up agent assignments.
CREATE INDEX IF NOT EXISTS idx_property_agents_agent_id
    ON public.property_agents(agent_id);
