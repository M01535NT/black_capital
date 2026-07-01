-- Covering indexes for foreign keys flagged by the Supabase performance linter
-- (unindexed_foreign_keys). Without a covering index, lookups and parent-row
-- DELETE/UPDATE take a sequential scan and hold wider locks. Cheap to add and
-- correct for client-scale operation. Idempotent.

CREATE INDEX IF NOT EXISTS idx_admin_access_requests_reviewed_by
  ON public.admin_access_requests(reviewed_by);

CREATE INDEX IF NOT EXISTS idx_app_settings_updated_by
  ON public.app_settings(updated_by);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_profile_id
  ON public.audit_logs(actor_profile_id);

CREATE INDEX IF NOT EXISTS idx_lead_activities_actor_profile_id
  ON public.lead_activities(actor_profile_id);

CREATE INDEX IF NOT EXISTS idx_lead_tasks_assigned_agent_id
  ON public.lead_tasks(assigned_agent_id);
