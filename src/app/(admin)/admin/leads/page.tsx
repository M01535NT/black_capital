import { requireAdminSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { LeadsPageClient } from "./leads-client";
import { getRecentLeads, getLeadsCount } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DbAgent, DbLead } from "@/lib/db-types";

export const revalidate = 0;

export default async function LeadsPage() {
    await requireAdminSession();

    // Use shared data layer for consistency with sidebar/dashboard
    const supabase = createAdminClient();

    const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("id, full_name, email, phone, source, status, assigned_agent_id, created_at")
        .order("created_at", { ascending: false });

    const { data: agents, error: agentsError } = await supabase
        .from("agents")
        .select("id, full_name")
        .eq("is_active", true)
        .order("full_name", { ascending: true });

    // If there's a Supabase error, pass it to the client for display
    const supabaseError = leadsError?.message || agentsError?.message || null;
    if (supabaseError) {
        logger.error("admin/leads", "[LeadsPage] Supabase error:", supabaseError);
    }

    // Also get total count for debugging
    const totalLeads = await getLeadsCount();
    const newLeads = await getLeadsCount("new");

    return (
        <LeadsPageClient
            leads={(leads as DbLead[] | null) || []}
            agents={(agents as Pick<DbAgent, "id" | "full_name">[] | null) || []}
            supabaseError={supabaseError}
        />
    );
}
