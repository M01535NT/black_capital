-- 20260605_add_updated_at_triggers.sql
-- Sprint 3: Triggers updated_at para properties y agents
--
-- PROBLEMA DETECTADO:
-- `properties` y `agents` tienen columna `updated_at` pero SIN trigger
-- que la actualice automáticamente. Cada UPDATE deja `updated_at` stale.
-- La migración local 20260527_create_properties.sql los declaraba pero
-- no se aplicaron al remoto.
--
-- FIX:
-- - CREATE OR REPLACE función update_*_updated_at (idempotente)
-- - CREATE TRIGGER BEFORE UPDATE para properties y agents
-- - Sigue el mismo patrón que update_leads_updated_at (ya aplicado).
--
-- VERIFICACIÓN POST-APLICAR:
-- 1. UPDATE a una property → updated_at cambia automáticamente.
-- 2. UPDATE a un agent → updated_at cambia automáticamente.

-- ============================================================
-- PROPERTIES
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_properties_updated_at()
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
    EXECUTE FUNCTION public.update_properties_updated_at();

-- ============================================================
-- AGENTS
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS agents_updated_at ON public.agents;

CREATE TRIGGER agents_updated_at
    BEFORE UPDATE ON public.agents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_agents_updated_at();
