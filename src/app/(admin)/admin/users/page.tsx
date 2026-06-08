import { requireAdminRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { UsersClient } from "./users-client";

export const revalidate = 0;

export default async function AdminUsersPage() {
  await requireAdminRole();
  const supabase = createAdminClient();

  const { data: users } = await supabase
    .from("admin_profiles")
    .select("id, email, full_name, role, agent_id, is_active, invited_at, last_seen_at, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Acceso"
        title="Administradores"
        description="Invita administradores internos y controla su acceso al panel."
      />
      <UsersClient initialUsers={users || []} />
    </div>
  );
}
