#!/bin/sh
set -eu
psql -v ON_ERROR_STOP=1 --username postgres --dbname postgres --set=local_password="$POSTGRES_PASSWORD" <<'SQL'
CREATE SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE ROLE anon NOLOGIN NOINHERIT;
CREATE ROLE authenticated NOLOGIN NOINHERIT;
CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
CREATE ROLE authenticator LOGIN NOINHERIT PASSWORD :'local_password';
CREATE ROLE supabase_auth_admin LOGIN CREATEROLE PASSWORD :'local_password';
CREATE ROLE supabase_storage_admin LOGIN BYPASSRLS PASSWORD :'local_password';
GRANT anon, authenticated, service_role TO authenticator, supabase_storage_admin;
CREATE SCHEMA auth AUTHORIZATION supabase_auth_admin;
CREATE SCHEMA storage AUTHORIZATION supabase_storage_admin;
GRANT CREATE ON DATABASE postgres TO supabase_auth_admin, supabase_storage_admin;
ALTER ROLE supabase_auth_admin SET search_path = auth, public, extensions;
ALTER ROLE supabase_storage_admin SET search_path = storage, public, extensions;
GRANT USAGE ON SCHEMA public, extensions TO anon, authenticated, service_role, authenticator, supabase_auth_admin, supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO service_role;
GRANT USAGE ON SCHEMA storage TO anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_storage_admin IN SCHEMA storage GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_storage_admin IN SCHEMA storage GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated, anon;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''), (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'))::uuid $$;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')) $$;
CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb) $$;
ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;
ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;
ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
SQL
