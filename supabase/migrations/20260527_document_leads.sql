-- Document existing leads table structure
-- This migration is for documentation/reproducibility purposes

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    source TEXT NOT NULL DEFAULT 'organic',
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    notes TEXT,
    privacy_accepted BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'new',
    downloaded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert leads (public lead capture)
CREATE POLICY "Anyone can insert leads" ON public.leads
    FOR INSERT
    WITH CHECK (true);

-- Only authenticated users (admin) can read/update leads
CREATE POLICY "Authenticated users can read leads" ON public.leads
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can update leads" ON public.leads
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at ON public.leads;
CREATE TRIGGER leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION update_leads_updated_at();
