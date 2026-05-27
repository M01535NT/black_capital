import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/auth";
import { LeadsPageClient } from "./leads-client";

export const revalidate = 0;

export default async function LeadsPage() {
    await requireAdminSession();
    const supabase = createAdminClient();

    const { data: leads, error } = await supabase
        .from("leads")
        .select("id, full_name, email, phone, source, status, assigned_agent_id, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching leads:", error);
    }

    const { data: agents } = await supabase
        .from("agents")
        .select("id, full_name")
        .eq("is_active", true)
        .order("full_name", { ascending: true });

    return (
        <LeadsPageClient
            leads={(leads as any[]) || []}
            agents={(agents as any[]) || []}
        />
    );
}
