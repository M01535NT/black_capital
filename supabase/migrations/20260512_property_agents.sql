-- Junction table: properties <-> agents (many-to-many)
CREATE TABLE IF NOT EXISTS property_agents (
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (property_id, agent_id)
);

ALTER TABLE property_agents ENABLE ROW LEVEL SECURITY;

-- Anyone can read assignments (public property pages need this)
CREATE POLICY "Anyone can read property_agents"
    ON property_agents FOR SELECT
    USING (true);

-- Admin full access
CREATE POLICY "Admin full access property_agents"
    ON property_agents FOR ALL
    USING (true)
    WITH CHECK (true);
