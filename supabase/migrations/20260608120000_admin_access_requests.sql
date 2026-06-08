-- Admin access requests table
CREATE TABLE IF NOT EXISTS public.admin_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  reviewed_by uuid REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_access_requests_status_created
  ON public.admin_access_requests(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_access_requests_email
  ON public.admin_access_requests(email);

DROP TRIGGER IF EXISTS admin_access_requests_updated_at ON public.admin_access_requests;
CREATE TRIGGER admin_access_requests_updated_at
  BEFORE UPDATE ON public.admin_access_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.admin_access_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny direct access to admin_access_requests" ON public.admin_access_requests;
CREATE POLICY "Deny direct access to admin_access_requests"
  ON public.admin_access_requests FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
