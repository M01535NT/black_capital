-- Create base properties table
-- This migration was missing — all others depend on it.

CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    property_use TEXT,
    property_type TEXT,
    business_type TEXT,
    price BIGINT,
    currency TEXT DEFAULT 'MXN',
    m2_construction DOUBLE PRECISION,
    m2_terrain DOUBLE PRECISION,
    price_mxn BIGINT,
    address TEXT,
    cover_image TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    video_urls JSONB DEFAULT '[]'::jsonb,
    tour_embeds JSONB DEFAULT '[]'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    brochure_path TEXT,
    custom_attributes JSONB DEFAULT '{}'::jsonb,
    attributes JSONB DEFAULT '[]'::jsonb,
    is_project BOOLEAN DEFAULT false,
    is_assignment BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'Available',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Public can read available properties
CREATE POLICY "Anyone can read available properties" ON public.properties
    FOR SELECT
    USING (status = 'Available');

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can manage properties" ON public.properties
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_property_use ON public.properties(property_use);
CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON public.properties(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_updated_at ON public.properties;
CREATE TRIGGER properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_updated_at();
