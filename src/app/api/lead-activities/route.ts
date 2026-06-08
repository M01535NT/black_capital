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
  const type = String(body.type || "note");
  const bodyText = String(body.body || "").trim();

  if (!leadId || !(await canAccessLead(leadId, profile))) {
    return NextResponse.json({ error: "No autorizado para este lead" }, { status: 403 });
  }
  if (!bodyText) {
    return NextResponse.json({ error: "La nota no puede estar vacía." }, { status: 400 });
  }
  if (!["note", "call", "email"].includes(type)) {
    return NextResponse.json({ error: "Tipo de actividad inválido." }, { status: 400 });
  }

  const titleMap: Record<string, string> = {
    note: "Nota agregada",
    call: "Llamada registrada",
    email: "Email registrado",
  };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("lead_activities")
    .insert({
      lead_id: leadId,
      actor_profile_id: profile.id,
      type,
      title: titleMap[type],
      body: bodyText,
    })
    .select("id, type, title, body, metadata, created_at, actor_profile_id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ activity: data }, { status: 201 });
}
