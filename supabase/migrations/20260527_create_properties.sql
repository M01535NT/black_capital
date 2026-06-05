-- 20260527_create_properties.sql
-- Crea la tabla `properties` con el shape actualmente en producción.
--
-- NOTA HISTÓRICA (2026-06-05): Esta migración fue reescrita para que coincida
-- con el schema real del remoto. La versión original declaraba columnas
-- (`attributes`, `price_mxn`), tipos (`address TEXT`) y objetos (índices,
-- trigger updated_at) que nunca se aplicaron al remoto. El schema real
-- (consultado via supabase gen types) es lo que está abajo. La diferencia
-- histórica está documentada en supabase/SCHEMA_DRIFT.md.
--
-- Crear una property usa el service_role key (admin client) y requiere
-- status='Available' para ser pública. RLS: anon puede SELECT, authenticated
-- puede ALL. La definición final de las policies está en
-- 20260605_fix_rls_policies.sql (recrea la policy inicial que estaba mal).

CREATE TYPE public.property_status_enum AS ENUM (
    'Available', 'Under_Offer', 'Sold', 'Rented'
);

CREATE TYPE public.currency_enum AS ENUM (
    'MXN', 'USD'
);

CREATE TYPE public.property_use_enum AS ENUM (
    'Residencial', 'Comercial', 'Industrial', 'Habitacional'
);

CREATE TYPE public.property_type_enum AS ENUM (
    'Terreno', 'Casa', 'Departamento', 'Oficina', 'Bodega',
    'Local', 'Plaza', 'Nave', 'Parque'
);

CREATE TYPE public.business_type_enum AS ENUM (
    'Venta', 'Renta', 'Aportación', 'Cesión'
);

CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    property_use property_use_enum NOT NULL,
    property_type property_type_enum NOT NULL,
    business_type business_type_enum NOT NULL,
    is_project BOOLEAN DEFAULT false,
    is_assignment BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    m2_terrain NUMERIC,
    m2_construction NUMERIC,
    custom_attributes JSONB,
    price NUMERIC NOT NULL,
    currency currency_enum NOT NULL,
    address JSONB,
    description TEXT,
    status property_status_enum DEFAULT 'Available',
    images TEXT[] DEFAULT '{}'::text[],
    video_urls TEXT[] DEFAULT '{}'::text[],
    tour_embeds TEXT[] DEFAULT '{}'::text[],
    brochure_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    cover_image TEXT,
    documents JSONB DEFAULT '[]'::jsonb
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Public can read available properties
CREATE POLICY "Anyone can read available properties" ON public.properties
    FOR SELECT
    TO anon, authenticated
    USING (status = 'Available');

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can manage properties" ON public.properties
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_use ON public.properties(property_use);
