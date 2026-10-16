-- Structural baseline captured read-only from black_capital on 2026-10-16.
-- TEST ONLY: apply only after assertIsolatedTarget; no production rows copied.
BEGIN;
CREATE TYPE public."property_use_enum" AS ENUM ('Residencial', 'Comercial', 'Industrial', 'Habitacional');
CREATE TYPE public."property_type_enum" AS ENUM ('Terreno', 'Casa', 'Departamento', 'Oficina', 'Bodega', 'Local', 'Plaza', 'Nave', 'Parque');
CREATE TYPE public."business_type_enum" AS ENUM ('Venta', 'Renta', 'Aportación', 'Cesión');
CREATE TYPE public."currency_enum" AS ENUM ('MXN', 'USD');
CREATE TYPE public."property_status_enum" AS ENUM ('Available', 'Under_Offer', 'Sold', 'Rented');
CREATE TABLE public."admin_access_requests" (
id uuid NOT NULL DEFAULT gen_random_uuid(),
full_name text NOT NULL,
email text NOT NULL,
phone text,
age integer,
operating_city text,
years_experience integer,
current_company text,
profile_photo_url text,
social_instagram text,
social_tiktok text,
social_linkedin text,
specialties text[],
internal_reference text,
status text NOT NULL DEFAULT 'pending'::text,
metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
reviewed_by uuid,
reviewed_at timestamp with time zone,
created_at timestamp with time zone NOT NULL DEFAULT now(),
updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE TABLE public."admin_profiles" (
id uuid NOT NULL,
email text NOT NULL,
full_name text NOT NULL,
role text NOT NULL,
agent_id uuid,
is_active boolean NOT NULL DEFAULT true,
invited_at timestamp with time zone,
last_seen_at timestamp with time zone,
created_at timestamp with time zone NOT NULL DEFAULT now(),
updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE TABLE public."agents" (
id uuid NOT NULL DEFAULT gen_random_uuid(),
full_name text NOT NULL,
email text,
phone text,
photo_url text,
license_number text,
bio text,
is_active boolean DEFAULT true,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now()
);
CREATE TABLE public."app_settings" (
key text NOT NULL,
value jsonb NOT NULL DEFAULT '{}'::jsonb,
updated_by uuid,
updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE TABLE public."audit_logs" (
id uuid NOT NULL DEFAULT gen_random_uuid(),
actor_profile_id uuid,
action text NOT NULL,
entity_type text NOT NULL,
entity_id text,
metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE TABLE public."document_access_requests" (
id uuid NOT NULL DEFAULT gen_random_uuid(),
lead_id uuid NOT NULL,
property_id uuid NOT NULL,
document_id text NOT NULL,
document_label text NOT NULL,
document_type text NOT NULL,
status text NOT NULL DEFAULT 'pending_verification'::text,
whatsapp_normalized text NOT NULL,
verification_code_hash text,
verification_expires_at timestamp with time zone,
verified_at timestamp with time zone,
delivered_at timestamp with time zone,
signed_url_expires_at timestamp with time zone,
accepted_nda boolean NOT NULL DEFAULT false,
accepted_privacy boolean NOT NULL DEFAULT false,
nda_version text,
privacy_notice_version text,
ip text,
user_agent text,
created_at timestamp with time zone NOT NULL DEFAULT now(),
updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE TABLE public."lead_activities" (
id uuid NOT NULL DEFAULT gen_random_uuid(),
lead_id uuid NOT NULL,
actor_profile_id uuid,
type text NOT NULL,
title text NOT NULL,
body text,
metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE TABLE public."lead_tasks" (
id uuid NOT NULL DEFAULT gen_random_uuid(),
lead_id uuid NOT NULL,
assigned_profile_id uuid,
assigned_agent_id uuid,
title text NOT NULL,
description text,
due_at timestamp with time zone,
priority text NOT NULL DEFAULT 'normal'::text,
status text NOT NULL DEFAULT 'pending'::text,
completed_at timestamp with time zone,
created_at timestamp with time zone NOT NULL DEFAULT now(),
updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE TABLE public."leads" (
id uuid NOT NULL DEFAULT gen_random_uuid(),
property_id uuid,
full_name character varying(255) NOT NULL,
email character varying(255) NOT NULL,
company character varying(255),
phone character varying(50),
privacy_accepted boolean NOT NULL DEFAULT false,
downloaded_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
name character varying,
source character varying DEFAULT 'organic'::character varying,
notes text,
status character varying DEFAULT 'new'::character varying,
assigned_agent_id uuid,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
whatsapp_normalized text,
whatsapp_verified_at timestamp with time zone,
nda_accepted_at timestamp with time zone,
nda_version text,
privacy_notice_version text,
legal_acceptance_ip text,
legal_acceptance_user_agent text,
document_access_session_token_hash text,
document_access_expires_at timestamp with time zone
);
CREATE TABLE public."notifications" (
id uuid NOT NULL DEFAULT gen_random_uuid(),
recipient_profile_id uuid,
type text NOT NULL DEFAULT 'info'::text,
title text NOT NULL,
body text,
href text,
read_at timestamp with time zone,
created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE TABLE public."properties" (
id uuid NOT NULL DEFAULT gen_random_uuid(),
title character varying(255) NOT NULL,
slug character varying(255) NOT NULL,
property_use property_use_enum NOT NULL,
property_type property_type_enum NOT NULL,
business_type business_type_enum NOT NULL,
is_project boolean DEFAULT false,
is_assignment boolean DEFAULT false,
is_featured boolean DEFAULT false,
m2_terrain numeric,
m2_construction numeric,
custom_attributes jsonb,
price numeric NOT NULL,
currency currency_enum NOT NULL,
address jsonb,
description text,
status property_status_enum DEFAULT 'Available'::property_status_enum,
images text[] DEFAULT '{}'::text[],
video_urls text[] DEFAULT '{}'::text[],
tour_embeds text[] DEFAULT '{}'::text[],
brochure_path character varying(255),
created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
cover_image text,
documents jsonb DEFAULT '[]'::jsonb,
faqs jsonb DEFAULT '[]'::jsonb
);
CREATE TABLE public."property_agents" (
property_id uuid NOT NULL,
agent_id uuid NOT NULL,
created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public."properties" ADD CONSTRAINT "properties_pkey" PRIMARY KEY (id);
ALTER TABLE public."properties" ADD CONSTRAINT "properties_slug_key" UNIQUE (slug);
ALTER TABLE public."agents" ADD CONSTRAINT "agents_email_key" UNIQUE (email);
ALTER TABLE public."agents" ADD CONSTRAINT "agents_pkey" PRIMARY KEY (id);
ALTER TABLE public."property_agents" ADD CONSTRAINT "property_agents_pkey" PRIMARY KEY (property_id, agent_id);
ALTER TABLE public."admin_profiles" ADD CONSTRAINT "admin_profiles_email_key" UNIQUE (email);
ALTER TABLE public."admin_profiles" ADD CONSTRAINT "admin_profiles_pkey" PRIMARY KEY (id);
ALTER TABLE public."admin_profiles" ADD CONSTRAINT "admin_profiles_role_check" CHECK ((role = ANY (ARRAY['admin'::text, 'agent'::text])));
ALTER TABLE public."lead_activities" ADD CONSTRAINT "lead_activities_pkey" PRIMARY KEY (id);
ALTER TABLE public."lead_activities" ADD CONSTRAINT "lead_activities_type_check" CHECK ((type = ANY (ARRAY['note'::text, 'call'::text, 'email'::text, 'status_change'::text, 'assignment'::text, 'task'::text, 'system'::text])));
ALTER TABLE public."lead_tasks" ADD CONSTRAINT "lead_tasks_pkey" PRIMARY KEY (id);
ALTER TABLE public."lead_tasks" ADD CONSTRAINT "lead_tasks_priority_check" CHECK ((priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text])));
ALTER TABLE public."lead_tasks" ADD CONSTRAINT "lead_tasks_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'done'::text, 'canceled'::text])));
ALTER TABLE public."notifications" ADD CONSTRAINT "notifications_pkey" PRIMARY KEY (id);
ALTER TABLE public."leads" ADD CONSTRAINT "leads_pkey" PRIMARY KEY (id);
ALTER TABLE public."audit_logs" ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY (id);
ALTER TABLE public."app_settings" ADD CONSTRAINT "app_settings_pkey" PRIMARY KEY (key);
ALTER TABLE public."admin_access_requests" ADD CONSTRAINT "admin_access_requests_pkey" PRIMARY KEY (id);
ALTER TABLE public."admin_access_requests" ADD CONSTRAINT "admin_access_requests_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])));
ALTER TABLE public."document_access_requests" ADD CONSTRAINT "document_access_requests_pkey" PRIMARY KEY (id);
ALTER TABLE public."document_access_requests" ADD CONSTRAINT "document_access_requests_status_check" CHECK ((status = ANY (ARRAY['pending_verification'::text, 'verified'::text, 'delivered'::text, 'expired'::text, 'blocked'::text])));
ALTER TABLE public."property_agents" ADD CONSTRAINT "property_agents_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE;
ALTER TABLE public."property_agents" ADD CONSTRAINT "property_agents_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE public."admin_profiles" ADD CONSTRAINT "admin_profiles_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL;
ALTER TABLE public."admin_profiles" ADD CONSTRAINT "admin_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."lead_activities" ADD CONSTRAINT "lead_activities_actor_profile_id_fkey" FOREIGN KEY (actor_profile_id) REFERENCES admin_profiles(id) ON DELETE SET NULL;
ALTER TABLE public."lead_activities" ADD CONSTRAINT "lead_activities_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE;
ALTER TABLE public."lead_tasks" ADD CONSTRAINT "lead_tasks_assigned_agent_id_fkey" FOREIGN KEY (assigned_agent_id) REFERENCES agents(id) ON DELETE SET NULL;
ALTER TABLE public."lead_tasks" ADD CONSTRAINT "lead_tasks_assigned_profile_id_fkey" FOREIGN KEY (assigned_profile_id) REFERENCES admin_profiles(id) ON DELETE SET NULL;
ALTER TABLE public."lead_tasks" ADD CONSTRAINT "lead_tasks_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE;
ALTER TABLE public."notifications" ADD CONSTRAINT "notifications_recipient_profile_id_fkey" FOREIGN KEY (recipient_profile_id) REFERENCES admin_profiles(id) ON DELETE CASCADE;
ALTER TABLE public."leads" ADD CONSTRAINT "leads_assigned_agent_id_fkey" FOREIGN KEY (assigned_agent_id) REFERENCES agents(id) ON DELETE SET NULL;
ALTER TABLE public."leads" ADD CONSTRAINT "leads_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE public."audit_logs" ADD CONSTRAINT "audit_logs_actor_profile_id_fkey" FOREIGN KEY (actor_profile_id) REFERENCES admin_profiles(id) ON DELETE SET NULL;
ALTER TABLE public."app_settings" ADD CONSTRAINT "app_settings_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES admin_profiles(id) ON DELETE SET NULL;
ALTER TABLE public."admin_access_requests" ADD CONSTRAINT "admin_access_requests_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES admin_profiles(id) ON DELETE SET NULL;
ALTER TABLE public."document_access_requests" ADD CONSTRAINT "document_access_requests_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE;
ALTER TABLE public."document_access_requests" ADD CONSTRAINT "document_access_requests_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;
CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $function$
;
CREATE OR REPLACE FUNCTION public.update_agents_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.update_properties_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_leads_updated_at();
CREATE TRIGGER properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION update_properties_updated_at();
CREATE TRIGGER agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION update_agents_updated_at();
CREATE TRIGGER admin_profiles_updated_at BEFORE UPDATE ON public.admin_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER lead_tasks_updated_at BEFORE UPDATE ON public.lead_tasks FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER admin_access_requests_updated_at BEFORE UPDATE ON public.admin_access_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER document_access_requests_updated_at BEFORE UPDATE ON public.document_access_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE public."properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."agents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."property_agents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."admin_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."lead_activities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."lead_tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."audit_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."app_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."admin_access_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."document_access_requests" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read available properties" ON public."properties" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((status = 'Available'::property_status_enum));
CREATE POLICY "Anyone can read active agents" ON public."agents" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((is_active = true));
CREATE POLICY "Anyone can read property_agents for available properties" ON public."property_agents" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((EXISTS ( SELECT 1
   FROM properties p
  WHERE ((p.id = property_agents.property_id) AND (p.status = 'Available'::property_status_enum)))));
CREATE POLICY "Deny direct access to leads" ON public."leads" AS PERMISSIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to admin_profiles" ON public."admin_profiles" AS PERMISSIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to lead_activities" ON public."lead_activities" AS PERMISSIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to lead_tasks" ON public."lead_tasks" AS PERMISSIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to notifications" ON public."notifications" AS PERMISSIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to audit_logs" ON public."audit_logs" AS PERMISSIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to app_settings" ON public."app_settings" AS PERMISSIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to admin_access_requests" ON public."admin_access_requests" AS PERMISSIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to document_access_requests" ON public."document_access_requests" AS PERMISSIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);
GRANT INSERT ON public."properties" TO "anon";
GRANT SELECT ON public."properties" TO "anon";
GRANT UPDATE ON public."properties" TO "anon";
GRANT DELETE ON public."properties" TO "anon";
GRANT TRUNCATE ON public."properties" TO "anon";
GRANT REFERENCES ON public."properties" TO "anon";
GRANT TRIGGER ON public."properties" TO "anon";
GRANT INSERT ON public."properties" TO "authenticated";
GRANT SELECT ON public."properties" TO "authenticated";
GRANT UPDATE ON public."properties" TO "authenticated";
GRANT DELETE ON public."properties" TO "authenticated";
GRANT TRUNCATE ON public."properties" TO "authenticated";
GRANT REFERENCES ON public."properties" TO "authenticated";
GRANT TRIGGER ON public."properties" TO "authenticated";
GRANT INSERT ON public."properties" TO "service_role";
GRANT SELECT ON public."properties" TO "service_role";
GRANT UPDATE ON public."properties" TO "service_role";
GRANT DELETE ON public."properties" TO "service_role";
GRANT TRUNCATE ON public."properties" TO "service_role";
GRANT REFERENCES ON public."properties" TO "service_role";
GRANT TRIGGER ON public."properties" TO "service_role";
GRANT INSERT ON public."agents" TO "anon";
GRANT SELECT ON public."agents" TO "anon";
GRANT UPDATE ON public."agents" TO "anon";
GRANT DELETE ON public."agents" TO "anon";
GRANT TRUNCATE ON public."agents" TO "anon";
GRANT REFERENCES ON public."agents" TO "anon";
GRANT TRIGGER ON public."agents" TO "anon";
GRANT INSERT ON public."agents" TO "authenticated";
GRANT SELECT ON public."agents" TO "authenticated";
GRANT UPDATE ON public."agents" TO "authenticated";
GRANT DELETE ON public."agents" TO "authenticated";
GRANT TRUNCATE ON public."agents" TO "authenticated";
GRANT REFERENCES ON public."agents" TO "authenticated";
GRANT TRIGGER ON public."agents" TO "authenticated";
GRANT INSERT ON public."agents" TO "service_role";
GRANT SELECT ON public."agents" TO "service_role";
GRANT UPDATE ON public."agents" TO "service_role";
GRANT DELETE ON public."agents" TO "service_role";
GRANT TRUNCATE ON public."agents" TO "service_role";
GRANT REFERENCES ON public."agents" TO "service_role";
GRANT TRIGGER ON public."agents" TO "service_role";
GRANT INSERT ON public."property_agents" TO "anon";
GRANT SELECT ON public."property_agents" TO "anon";
GRANT UPDATE ON public."property_agents" TO "anon";
GRANT DELETE ON public."property_agents" TO "anon";
GRANT TRUNCATE ON public."property_agents" TO "anon";
GRANT REFERENCES ON public."property_agents" TO "anon";
GRANT TRIGGER ON public."property_agents" TO "anon";
GRANT INSERT ON public."property_agents" TO "authenticated";
GRANT SELECT ON public."property_agents" TO "authenticated";
GRANT UPDATE ON public."property_agents" TO "authenticated";
GRANT DELETE ON public."property_agents" TO "authenticated";
GRANT TRUNCATE ON public."property_agents" TO "authenticated";
GRANT REFERENCES ON public."property_agents" TO "authenticated";
GRANT TRIGGER ON public."property_agents" TO "authenticated";
GRANT INSERT ON public."property_agents" TO "service_role";
GRANT SELECT ON public."property_agents" TO "service_role";
GRANT UPDATE ON public."property_agents" TO "service_role";
GRANT DELETE ON public."property_agents" TO "service_role";
GRANT TRUNCATE ON public."property_agents" TO "service_role";
GRANT REFERENCES ON public."property_agents" TO "service_role";
GRANT TRIGGER ON public."property_agents" TO "service_role";
GRANT INSERT ON public."admin_profiles" TO "anon";
GRANT SELECT ON public."admin_profiles" TO "anon";
GRANT UPDATE ON public."admin_profiles" TO "anon";
GRANT DELETE ON public."admin_profiles" TO "anon";
GRANT TRUNCATE ON public."admin_profiles" TO "anon";
GRANT REFERENCES ON public."admin_profiles" TO "anon";
GRANT TRIGGER ON public."admin_profiles" TO "anon";
GRANT INSERT ON public."admin_profiles" TO "authenticated";
GRANT SELECT ON public."admin_profiles" TO "authenticated";
GRANT UPDATE ON public."admin_profiles" TO "authenticated";
GRANT DELETE ON public."admin_profiles" TO "authenticated";
GRANT TRUNCATE ON public."admin_profiles" TO "authenticated";
GRANT REFERENCES ON public."admin_profiles" TO "authenticated";
GRANT TRIGGER ON public."admin_profiles" TO "authenticated";
GRANT INSERT ON public."admin_profiles" TO "service_role";
GRANT SELECT ON public."admin_profiles" TO "service_role";
GRANT UPDATE ON public."admin_profiles" TO "service_role";
GRANT DELETE ON public."admin_profiles" TO "service_role";
GRANT TRUNCATE ON public."admin_profiles" TO "service_role";
GRANT REFERENCES ON public."admin_profiles" TO "service_role";
GRANT TRIGGER ON public."admin_profiles" TO "service_role";
GRANT INSERT ON public."lead_activities" TO "anon";
GRANT SELECT ON public."lead_activities" TO "anon";
GRANT UPDATE ON public."lead_activities" TO "anon";
GRANT DELETE ON public."lead_activities" TO "anon";
GRANT TRUNCATE ON public."lead_activities" TO "anon";
GRANT REFERENCES ON public."lead_activities" TO "anon";
GRANT TRIGGER ON public."lead_activities" TO "anon";
GRANT INSERT ON public."lead_activities" TO "authenticated";
GRANT SELECT ON public."lead_activities" TO "authenticated";
GRANT UPDATE ON public."lead_activities" TO "authenticated";
GRANT DELETE ON public."lead_activities" TO "authenticated";
GRANT TRUNCATE ON public."lead_activities" TO "authenticated";
GRANT REFERENCES ON public."lead_activities" TO "authenticated";
GRANT TRIGGER ON public."lead_activities" TO "authenticated";
GRANT INSERT ON public."lead_activities" TO "service_role";
GRANT SELECT ON public."lead_activities" TO "service_role";
GRANT UPDATE ON public."lead_activities" TO "service_role";
GRANT DELETE ON public."lead_activities" TO "service_role";
GRANT TRUNCATE ON public."lead_activities" TO "service_role";
GRANT REFERENCES ON public."lead_activities" TO "service_role";
GRANT TRIGGER ON public."lead_activities" TO "service_role";
GRANT INSERT ON public."lead_tasks" TO "anon";
GRANT SELECT ON public."lead_tasks" TO "anon";
GRANT UPDATE ON public."lead_tasks" TO "anon";
GRANT DELETE ON public."lead_tasks" TO "anon";
GRANT TRUNCATE ON public."lead_tasks" TO "anon";
GRANT REFERENCES ON public."lead_tasks" TO "anon";
GRANT TRIGGER ON public."lead_tasks" TO "anon";
GRANT INSERT ON public."lead_tasks" TO "authenticated";
GRANT SELECT ON public."lead_tasks" TO "authenticated";
GRANT UPDATE ON public."lead_tasks" TO "authenticated";
GRANT DELETE ON public."lead_tasks" TO "authenticated";
GRANT TRUNCATE ON public."lead_tasks" TO "authenticated";
GRANT REFERENCES ON public."lead_tasks" TO "authenticated";
GRANT TRIGGER ON public."lead_tasks" TO "authenticated";
GRANT INSERT ON public."lead_tasks" TO "service_role";
GRANT SELECT ON public."lead_tasks" TO "service_role";
GRANT UPDATE ON public."lead_tasks" TO "service_role";
GRANT DELETE ON public."lead_tasks" TO "service_role";
GRANT TRUNCATE ON public."lead_tasks" TO "service_role";
GRANT REFERENCES ON public."lead_tasks" TO "service_role";
GRANT TRIGGER ON public."lead_tasks" TO "service_role";
GRANT INSERT ON public."notifications" TO "anon";
GRANT SELECT ON public."notifications" TO "anon";
GRANT UPDATE ON public."notifications" TO "anon";
GRANT DELETE ON public."notifications" TO "anon";
GRANT TRUNCATE ON public."notifications" TO "anon";
GRANT REFERENCES ON public."notifications" TO "anon";
GRANT TRIGGER ON public."notifications" TO "anon";
GRANT INSERT ON public."notifications" TO "authenticated";
GRANT SELECT ON public."notifications" TO "authenticated";
GRANT UPDATE ON public."notifications" TO "authenticated";
GRANT DELETE ON public."notifications" TO "authenticated";
GRANT TRUNCATE ON public."notifications" TO "authenticated";
GRANT REFERENCES ON public."notifications" TO "authenticated";
GRANT TRIGGER ON public."notifications" TO "authenticated";
GRANT INSERT ON public."notifications" TO "service_role";
GRANT SELECT ON public."notifications" TO "service_role";
GRANT UPDATE ON public."notifications" TO "service_role";
GRANT DELETE ON public."notifications" TO "service_role";
GRANT TRUNCATE ON public."notifications" TO "service_role";
GRANT REFERENCES ON public."notifications" TO "service_role";
GRANT TRIGGER ON public."notifications" TO "service_role";
GRANT INSERT ON public."leads" TO "anon";
GRANT SELECT ON public."leads" TO "anon";
GRANT UPDATE ON public."leads" TO "anon";
GRANT DELETE ON public."leads" TO "anon";
GRANT TRUNCATE ON public."leads" TO "anon";
GRANT REFERENCES ON public."leads" TO "anon";
GRANT TRIGGER ON public."leads" TO "anon";
GRANT INSERT ON public."leads" TO "authenticated";
GRANT SELECT ON public."leads" TO "authenticated";
GRANT UPDATE ON public."leads" TO "authenticated";
GRANT DELETE ON public."leads" TO "authenticated";
GRANT TRUNCATE ON public."leads" TO "authenticated";
GRANT REFERENCES ON public."leads" TO "authenticated";
GRANT TRIGGER ON public."leads" TO "authenticated";
GRANT INSERT ON public."leads" TO "service_role";
GRANT SELECT ON public."leads" TO "service_role";
GRANT UPDATE ON public."leads" TO "service_role";
GRANT DELETE ON public."leads" TO "service_role";
GRANT TRUNCATE ON public."leads" TO "service_role";
GRANT REFERENCES ON public."leads" TO "service_role";
GRANT TRIGGER ON public."leads" TO "service_role";
GRANT INSERT ON public."audit_logs" TO "anon";
GRANT SELECT ON public."audit_logs" TO "anon";
GRANT UPDATE ON public."audit_logs" TO "anon";
GRANT DELETE ON public."audit_logs" TO "anon";
GRANT TRUNCATE ON public."audit_logs" TO "anon";
GRANT REFERENCES ON public."audit_logs" TO "anon";
GRANT TRIGGER ON public."audit_logs" TO "anon";
GRANT INSERT ON public."audit_logs" TO "authenticated";
GRANT SELECT ON public."audit_logs" TO "authenticated";
GRANT UPDATE ON public."audit_logs" TO "authenticated";
GRANT DELETE ON public."audit_logs" TO "authenticated";
GRANT TRUNCATE ON public."audit_logs" TO "authenticated";
GRANT REFERENCES ON public."audit_logs" TO "authenticated";
GRANT TRIGGER ON public."audit_logs" TO "authenticated";
GRANT INSERT ON public."audit_logs" TO "service_role";
GRANT SELECT ON public."audit_logs" TO "service_role";
GRANT UPDATE ON public."audit_logs" TO "service_role";
GRANT DELETE ON public."audit_logs" TO "service_role";
GRANT TRUNCATE ON public."audit_logs" TO "service_role";
GRANT REFERENCES ON public."audit_logs" TO "service_role";
GRANT TRIGGER ON public."audit_logs" TO "service_role";
GRANT INSERT ON public."app_settings" TO "anon";
GRANT SELECT ON public."app_settings" TO "anon";
GRANT UPDATE ON public."app_settings" TO "anon";
GRANT DELETE ON public."app_settings" TO "anon";
GRANT TRUNCATE ON public."app_settings" TO "anon";
GRANT REFERENCES ON public."app_settings" TO "anon";
GRANT TRIGGER ON public."app_settings" TO "anon";
GRANT INSERT ON public."app_settings" TO "authenticated";
GRANT SELECT ON public."app_settings" TO "authenticated";
GRANT UPDATE ON public."app_settings" TO "authenticated";
GRANT DELETE ON public."app_settings" TO "authenticated";
GRANT TRUNCATE ON public."app_settings" TO "authenticated";
GRANT REFERENCES ON public."app_settings" TO "authenticated";
GRANT TRIGGER ON public."app_settings" TO "authenticated";
GRANT INSERT ON public."app_settings" TO "service_role";
GRANT SELECT ON public."app_settings" TO "service_role";
GRANT UPDATE ON public."app_settings" TO "service_role";
GRANT DELETE ON public."app_settings" TO "service_role";
GRANT TRUNCATE ON public."app_settings" TO "service_role";
GRANT REFERENCES ON public."app_settings" TO "service_role";
GRANT TRIGGER ON public."app_settings" TO "service_role";
GRANT INSERT ON public."admin_access_requests" TO "anon";
GRANT SELECT ON public."admin_access_requests" TO "anon";
GRANT UPDATE ON public."admin_access_requests" TO "anon";
GRANT DELETE ON public."admin_access_requests" TO "anon";
GRANT TRUNCATE ON public."admin_access_requests" TO "anon";
GRANT REFERENCES ON public."admin_access_requests" TO "anon";
GRANT TRIGGER ON public."admin_access_requests" TO "anon";
GRANT INSERT ON public."admin_access_requests" TO "authenticated";
GRANT SELECT ON public."admin_access_requests" TO "authenticated";
GRANT UPDATE ON public."admin_access_requests" TO "authenticated";
GRANT DELETE ON public."admin_access_requests" TO "authenticated";
GRANT TRUNCATE ON public."admin_access_requests" TO "authenticated";
GRANT REFERENCES ON public."admin_access_requests" TO "authenticated";
GRANT TRIGGER ON public."admin_access_requests" TO "authenticated";
GRANT INSERT ON public."admin_access_requests" TO "service_role";
GRANT SELECT ON public."admin_access_requests" TO "service_role";
GRANT UPDATE ON public."admin_access_requests" TO "service_role";
GRANT DELETE ON public."admin_access_requests" TO "service_role";
GRANT TRUNCATE ON public."admin_access_requests" TO "service_role";
GRANT REFERENCES ON public."admin_access_requests" TO "service_role";
GRANT TRIGGER ON public."admin_access_requests" TO "service_role";
GRANT INSERT ON public."document_access_requests" TO "anon";
GRANT SELECT ON public."document_access_requests" TO "anon";
GRANT UPDATE ON public."document_access_requests" TO "anon";
GRANT DELETE ON public."document_access_requests" TO "anon";
GRANT TRUNCATE ON public."document_access_requests" TO "anon";
GRANT REFERENCES ON public."document_access_requests" TO "anon";
GRANT TRIGGER ON public."document_access_requests" TO "anon";
GRANT INSERT ON public."document_access_requests" TO "authenticated";
GRANT SELECT ON public."document_access_requests" TO "authenticated";
GRANT UPDATE ON public."document_access_requests" TO "authenticated";
GRANT DELETE ON public."document_access_requests" TO "authenticated";
GRANT TRUNCATE ON public."document_access_requests" TO "authenticated";
GRANT REFERENCES ON public."document_access_requests" TO "authenticated";
GRANT TRIGGER ON public."document_access_requests" TO "authenticated";
GRANT INSERT ON public."document_access_requests" TO "service_role";
GRANT SELECT ON public."document_access_requests" TO "service_role";
GRANT UPDATE ON public."document_access_requests" TO "service_role";
GRANT DELETE ON public."document_access_requests" TO "service_role";
GRANT TRUNCATE ON public."document_access_requests" TO "service_role";
GRANT REFERENCES ON public."document_access_requests" TO "service_role";
GRANT TRIGGER ON public."document_access_requests" TO "service_role";
CREATE POLICY "Authenticated can read secure-brochures" ON storage."objects" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((bucket_id = 'secure-brochures'::text));
CREATE POLICY "Authenticated can manage secure-brochures" ON storage."objects" AS PERMISSIVE FOR ALL TO "authenticated" USING ((bucket_id = 'secure-brochures'::text)) WITH CHECK ((bucket_id = 'secure-brochures'::text));
COMMIT;

