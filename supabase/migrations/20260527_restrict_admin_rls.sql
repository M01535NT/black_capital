-- 20260527_restrict_admin_rls.sql
-- Restringe las policies RLS de admin en todas las tablas del schema público.
--
-- NOTA HISTÓRICA (2026-06-05): Esta migración fue reescrita para reflejar el
-- estado real del remoto tras las correcciones de RLS aplicadas en
-- 20260605_fix_rls_policies.sql y 20260605_fix_leads_policies.sql.
--
-- La idea original era limitar las policies permisivas (`roles: {public}`
-- con `cmd: ALL`) que existían en la primera versión. La versión corregida
-- se aplica en las migraciones 20260605_* — esta migración queda como
-- punto histórico en el orden cronológico.
--
-- Si en el futuro se quiere resetear la DB, las policies correctas
-- vendrán de 20260605_*. Esta migración se mantiene para compatibilidad
-- con `supabase db reset` (debe ser idempotente — solo DROP IF EXISTS).

-- No-op: las policies correctas están en 20260605_fix_rls_policies.sql
-- y 20260605_fix_leads_policies.sql. Esta migración queda como marcador
-- histórico de cuándo se intentó restringir el admin.
SELECT 1;
