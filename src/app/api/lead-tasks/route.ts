import { NextRequest, NextResponse } from "next/server";
import { canAccessAgentScopedResource, requireApiProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

async function canAccessLead(leadId: string, profile: NonNullable<Awaited<ReturnType<typeof requireApiProfile>>>) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("leads").select("assigned_agent_id").eq("id", leadId).maybeSingle();
  return !!data && canAccessAgentScopedResource(profile, data.assigned_agent_id);
}

export async function POST(req: NextRequest) {
  const profile = await requireApiProfile();
  if (!profile) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const leadId = String(body.lead_id || "");
  if (!leadId || !(await canAccessLead(leadId, profile))) {
    return NextResponse.json({ error: "No autorizado para este lead" }, { status: 403 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("lead_tasks")
    .insert({
      lead_id: leadId,
      assigned_profile_id: body.assigned_profile_id || profile.id,
      assigned_agent_id: body.assigned_agent_id || profile.agent_id || null,
      title: String(body.title || "").trim(),
      description: body.description || null,
      due_at: body.due_at || null,
      priority: body.priority || "normal",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.from("lead_activities").insert({
    lead_id: leadId,
    actor_profile_id: profile.id,
    type: "task",
    title: "Tarea creada",
    body: data.title,
    metadata: { task_id: data.id, due_at: data.due_at },
  });

  return NextResponse.json({ task: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const profile = await requireApiProfile();
  if (!profile) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const id = String(body.id || "");
  const supabase = createAdminClient();
  const { data: task } = await supabase.from("lead_tasks").select("lead_id").eq("id", id).maybeSingle();
  if (!task || !(await canAccessLead(task.lead_id, profile))) {
    return NextResponse.json({ error: "No autorizado para esta tarea" }, { status: 403 });
  }

  const update: Record<string, unknown> = {};
  if (body.status) update.status = body.status;
  if (body.status === "done") update.completed_at = new Date().toISOString();
  if (body.title !== undefined) update.title = body.title;
  if (body.due_at !== undefined) update.due_at = body.due_at || null;
  if (body.priority !== undefined) update.priority = body.priority;

  const { data, error } = await supabase.from("lead_tasks").update(update).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ task: data });
}
