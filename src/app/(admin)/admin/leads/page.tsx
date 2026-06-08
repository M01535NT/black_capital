import { requireAdminSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { LeadsPageClient } from "./leads-client";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DbAgent, DbLead } from "@/lib/db-types";

export const revalidate = 0;

export default async function LeadsPage() {
    const profile = await requireAdminSession();

    // Use shared data layer for consistency with sidebar/dashboard
    const supabase = createAdminClient();

    let leadsQuery = supabase
        .from("leads")
        .select("id, full_name, email, phone, source, status, assigned_agent_id, created_at")
        .order("created_at", { ascending: false });

    if (profile.role === "agent") {
        if (!profile.agent_id) {
            leadsQuery = leadsQuery.eq("assigned_agent_id", "00000000-0000-0000-0000-000000000000");
        } else {
            leadsQuery = leadsQuery.eq("assigned_agent_id", profile.agent_id);
        }
    }

    const { data: leads, error: leadsError } = await leadsQuery;
    const leadIds = (leads || []).map((lead) => lead.id);

    const [{ data: tasks }, { data: activities }] = leadIds.length > 0
        ? await Promise.all([
            supabase
                .from("lead_tasks")
                .select("lead_id, due_at, status")
                .in("lead_id", leadIds)
                .eq("status", "pending"),
            supabase
                .from("lead_activities")
                .select("lead_id, created_at")
                .in("lead_id", leadIds)
                .order("created_at", { ascending: false }),
        ])
        : [{ data: [] }, { data: [] }];

    const now = new Date();
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    const taskStats = new Map<string, { pending_tasks: number; overdue_tasks: number; due_today_tasks: number }>();
    for (const task of tasks || []) {
        const stats = taskStats.get(task.lead_id) || { pending_tasks: 0, overdue_tasks: 0, due_today_tasks: 0 };
        const dueAt = task.due_at ? new Date(task.due_at) : null;
        stats.pending_tasks += 1;
        if (dueAt && dueAt < now) stats.overdue_tasks += 1;
        else if (dueAt && dueAt <= endOfToday) stats.due_today_tasks += 1;
        taskStats.set(task.lead_id, stats);
    }

    const latestActivity = new Map<string, string>();
    for (const activity of activities || []) {
        if (!latestActivity.has(activity.lead_id)) latestActivity.set(activity.lead_id, activity.created_at);
    }

    const enrichedLeads = (leads || []).map((lead) => ({
        ...lead,
        ...(taskStats.get(lead.id) || { pending_tasks: 0, overdue_tasks: 0, due_today_tasks: 0 }),
        last_activity_at: latestActivity.get(lead.id) || null,
    }));

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

    return (
        <LeadsPageClient
            leads={(enrichedLeads as DbLead[] | null) || []}
            agents={(agents as Pick<DbAgent, "id" | "full_name">[] | null) || []}
            supabaseError={supabaseError}
        />
    );
}
