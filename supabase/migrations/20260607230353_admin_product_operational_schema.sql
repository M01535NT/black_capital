-- Operational admin product schema.
-- Admin UI uses server-side service_role routes; direct Data API access is denied.

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'agent')),
  agent_id uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  invited_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  actor_profile_id uuid REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('note','call','email','status_change','assignment','task','system')),
  title text NOT NULL,
  body text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lead_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_profile_id uuid REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  assigned_agent_id uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  due_at timestamptz,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','done','canceled')),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_profile_id uuid REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS lead_tasks_updated_at ON public.lead_tasks;
CREATE TRIGGER lead_tasks_updated_at
  BEFORE UPDATE ON public.lead_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny direct access to admin_profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Deny direct access to lead_activities" ON public.lead_activities;
DROP POLICY IF EXISTS "Deny direct access to lead_tasks" ON public.lead_tasks;
DROP POLICY IF EXISTS "Deny direct access to notifications" ON public.notifications;
DROP POLICY IF EXISTS "Deny direct access to audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Deny direct access to app_settings" ON public.app_settings;

CREATE POLICY "Deny direct access to admin_profiles"
  ON public.admin_profiles FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to lead_activities"
  ON public.lead_activities FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to lead_tasks"
  ON public.lead_tasks FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to notifications"
  ON public.notifications FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to audit_logs"
  ON public.audit_logs FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny direct access to app_settings"
  ON public.app_settings FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_agent_id ON public.admin_profiles(agent_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_created ON public.lead_activities(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_lead_status ON public.lead_tasks(lead_id, status);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_assigned_due ON public.lead_tasks(assigned_profile_id, due_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read ON public.notifications(recipient_profile_id, read_at, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id, created_at DESC);

INSERT INTO public.app_settings(key, value)
VALUES (
  'site',
  '{"heroVideoUrl":"","heroImageUrl":"","luxuryHeroTitle":"Black Luxury","luxuryHeroSubtitle":"Propiedades de lujo","businessHeroTitle":"Black Business","businessHeroSubtitle":"Espacios comerciales","industrialHeroTitle":"Black Industrial","industrialHeroSubtitle":"Naves y bodegas","contactPhone":"+52 (664) 104 9491","contactEmail":"contacto@blackcorporativo.vercel.app","contactAddress":"Tijuana, Baja California, México","whatsAppTemplate":"Hola, estoy interesado en sus servicios."}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
