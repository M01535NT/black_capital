-- Secure document access: visible document catalog, protected file delivery.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS whatsapp_normalized text,
  ADD COLUMN IF NOT EXISTS whatsapp_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS nda_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS nda_version text,
  ADD COLUMN IF NOT EXISTS privacy_notice_version text,
  ADD COLUMN IF NOT EXISTS legal_acceptance_ip text,
  ADD COLUMN IF NOT EXISTS legal_acceptance_user_agent text,
  ADD COLUMN IF NOT EXISTS document_access_session_token_hash text,
  ADD COLUMN IF NOT EXISTS document_access_expires_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_leads_whatsapp_normalized
  ON public.leads(whatsapp_normalized)
  WHERE whatsapp_normalized IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_document_access_session
  ON public.leads(document_access_session_token_hash)
  WHERE document_access_session_token_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.document_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  document_id text NOT NULL,
  document_label text NOT NULL,
  document_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending_verification'
    CHECK (status IN ('pending_verification', 'verified', 'delivered', 'expired', 'blocked')),
  whatsapp_normalized text NOT NULL,
  verification_code_hash text,
  verification_expires_at timestamptz,
  verified_at timestamptz,
  delivered_at timestamptz,
  signed_url_expires_at timestamptz,
  accepted_nda boolean NOT NULL DEFAULT false,
  accepted_privacy boolean NOT NULL DEFAULT false,
  nda_version text,
  privacy_notice_version text,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_document_access_requests_lead_created
  ON public.document_access_requests(lead_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_document_access_requests_property_created
  ON public.document_access_requests(property_id, created_at DESC);

DROP TRIGGER IF EXISTS document_access_requests_updated_at ON public.document_access_requests;
CREATE TRIGGER document_access_requests_updated_at
  BEFORE UPDATE ON public.document_access_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.document_access_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny direct access to document_access_requests" ON public.document_access_requests;
CREATE POLICY "Deny direct access to document_access_requests"
  ON public.document_access_requests FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);
