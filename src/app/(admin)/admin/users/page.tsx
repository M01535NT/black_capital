import { requireAdminRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { UsersClient } from "./users-client";

export const revalidate = 0;

export default async function AdminUsersPage() {
  await requireAdminRole();
  const supabase = createAdminClient();

  const [{ data: users }, { data: agents }, { data: accessRequests }] = await Promise.all([
    supabase
      .from("admin_profiles")
      .select("id, email, full_name, role, agent_id, is_active, invited_at, last_seen_at, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("agents")
      .select("id, full_name, email, is_active")
      .order("full_name", { ascending: true }),
    supabase
      .from("admin_access_requests")
      .select("id, full_name, email, phone, age, operating_city, years_experience, current_company, status, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Acceso"
        title="Usuarios"
        description="Invita administradores y agentes, vincula cuentas al equipo comercial y controla permisos."
      />
      <UsersClient initialUsers={users || []} agents={agents || []} initialAccessRequests={accessRequests || []} />
    </div>
  );
}
