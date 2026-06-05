# SCHEMA DRIFT — Historial de divergencias

Este documento explica por qué las migraciones locales difieren del
schema real en producción (ref `tewfdfmicifpdecxcpfy`).

## TL;DR

La DB de Supabase **no se construyó con `supabase db push`**. Fue
modificada a mano desde el Dashboard (SQL Editor) y/o con `psql` directo.
El proyecto no tiene un historial `_supabase_migrations` confiable, y
varias migraciones locales describen un schema distinto al aplicado.

**Esto NO es un problema operacional** — la app funciona. Pero significa
que `supabase db reset` en una DB virgen produciría un schema diferente
al de producción.

## Cronología de fixes

| Fecha | Acción | Migración |
|---|---|---|
| 2026-02-24 | Migración inicial: `add_cover_image.sql` | aplicada |
| 2026-05-12 | Migración `create_agents.sql` | aplicada |
| 2026-05-12 | Migración `property_agents.sql` | aplicada |
| 2026-05-27 | Migración `create_properties.sql` original | **NO aplicada completa** (ver abajo) |
| 2026-05-27 | Migración `document_leads.sql` | aplicada |
| 2026-05-27 | Migración `lead_assigned_agent.sql` | aplicada |
| 2026-05-27 | Migración `restrict_admin_rls.sql` original | aplicada con policies permisivas |
| 2026-06-05 | `20260605_fix_rls_policies.sql` | aplicada (cierra agujeros) |
| 2026-06-05 | `20260605_fix_storage_policies.sql` | aplicada (quita upload anónimo) |
| 2026-06-05 | `20260605_fix_leads_policies.sql` | aplicada (limpia duplicados) |
| 2026-06-05 | `20260605_add_updated_at_triggers.sql` | aplicada (triggers que faltaban) |
| 2026-06-05 | `20260605_drop_system_logs.sql` | aplicada (tabla huérfana) |

## Drift original (pre 2026-06-05)

### `properties` — diff entre local y remoto

| Atributo | Local (original) | Remoto (real) | Acción |
|---|---|---|---|
| Columna `attributes` JSONB | ✅ declarada | ❌ no existe | Remoto es la verdad |
| Columna `custom_attributes` JSONB | ✅ declarada | ✅ existe | OK |
| Columna `price_mxn` BIGINT | ✅ declarada | ❌ no existe | Remoto es la verdad |
| Columna `address` | TEXT | **JSONB** | Remoto es la verdad |
| Columna `cover_image` | TEXT | TEXT | OK |
| Columna `documents` | JSONB default `[]` | JSONB default `'[]'::jsonb` | Equivalente |
| Trigger `updated_at` | ✅ declarado | ❌ no existía | Agregado en 20260605_add_updated_at_triggers |
| Índice `idx_properties_property_use` | ✅ declarado | ❌ no existe | Remoto es la verdad |
| Índice `idx_properties_is_featured` | ✅ declarado | ❌ no existe | Remoto es la verdad |
| Índice `idx_properties_created_at` | ✅ declarado | ❌ no existe | Remoto es la verdad |
| Índice `idx_properties_slug` | ✅ declarado | ❌ no existe | Remoto es la verdad |
| RLS policies | 2 (Authenticated all, Public read) | 4 (mezcladas) | Limpio en 20260605_fix_rls_policies |

### `leads` — diff entre local y remoto

| Atributo | Local | Remoto | Acción |
|---|---|---|---|
| Policies | 2 | 5 (3 duplicadas) | Limpio en 20260605_fix_leads_policies |

### `agents`, `property_agents` — RLS permisiva

Policies `roles: {public}` + `cmd: ALL` permitían INSERT/UPDATE/DELETE
anónimo. Arreglado en 20260605_fix_rls_policies.

### Storage — upload anónimo + secure-brochures público

- Bucket `public` permitía INSERT con `roles: {anon}`. Arreglado en
  20260605_fix_storage_policies.
- Bucket `secure-brochures` (public=false) tenía SELECT público de facto.
  Arreglado en 20260605_fix_storage_policies.

### Tabla huérfana `system_logs`

Existía en la DB sin estar en ninguna migración local. El código nunca
la usaba. Eliminada en 20260605_drop_system_logs.

## Cómo se mantiene sincronizado

1. **Tipos TypeScript**: `src/types/database.types.ts` se genera con
   `supabase gen types typescript --linked --schema public` desde la DB
   real. NO se mantiene a mano.

2. **CLI instalado**: `/opt/supabase-cli/supabase`. Agregado al PATH.

3. **Proyecto vinculado**: `supabase link --project-ref tewfdfmicifpdecxcpfy`
   ya se corrió. Para regenerar tipos: `supabase gen types typescript
   --linked --schema public > src/types/database.types.ts`.

4. **Validación post-cambio**: después de cualquier migración nueva,
   correr `supabase db diff --schema public` y verificar que el diff
   está vacío.

## Para un dev nuevo

1. Clonar el repo
2. `supabase link --project-ref tewfdfmicifpdecxcpfy`
3. `supabase db reset` (solo si querés recrear la DB local — la prod
   ya está en el estado correcto)
4. `supabase gen types typescript --linked --schema public > src/types/database.types.ts`
