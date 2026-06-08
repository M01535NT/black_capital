import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin, requireApiProfile } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  const profile = await requireApiProfile();
  if (!profile || !isAdmin(profile)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("id, email, full_name, role, agent_id, is_active, invited_at, last_seen_at, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ users: data || [] });
}

export async function POST(req: NextRequest) {
  try {
    const profile = await requireApiProfile();
    if (!profile || !isAdmin(profile)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const fullName = String(body.full_name || "").trim();
    const role = "admin";

    if (!email || !fullName) {
      return NextResponse.json({ error: "Nombre y correo son obligatorios." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const { data: invite, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${origin}/admin/update-password`,
      data: { full_name: fullName },
    });

    if (inviteError || !invite.user) {
      return NextResponse.json({ error: inviteError?.message || "No se pudo invitar el usuario." }, { status: 400 });
    }

    await supabase.auth.admin.updateUserById(invite.user.id, {
      app_metadata: { role },
      user_metadata: { full_name: fullName },
    });

    const { error: profileError } = await supabase.from("admin_profiles").upsert({
      id: invite.user.id,
      email,
      full_name: fullName,
      role,
      agent_id: null,
      is_active: true,
      invited_at: new Date().toISOString(),
    });

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    await supabase.from("audit_logs").insert({
      actor_profile_id: profile.id,
      action: "user.invite",
      entity_type: "admin_profile",
      entity_id: invite.user.id,
      metadata: { email, role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("API/admin/users", "Invite error", error);
    return NextResponse.json({ error: "Error al invitar usuario." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const profile = await requireApiProfile();
  if (!profile || !isAdmin(profile)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "Falta usuario." }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (body.full_name !== undefined) update.full_name = String(body.full_name).trim();
  if (body.role === "admin" || body.role === "agent") update.role = body.role;
  if (body.agent_id !== undefined) update.agent_id = body.agent_id || null;
  if (body.is_active !== undefined) update.is_active = Boolean(body.is_active);

  const supabase = createAdminClient();
  const { error } = await supabase.from("admin_profiles").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (update.role) {
    await supabase.auth.admin.updateUserById(id, { app_metadata: { role: update.role } });
  }

  await supabase.from("audit_logs").insert({
    actor_profile_id: profile.id,
    action: "user.update",
    entity_type: "admin_profile",
    entity_id: id,
    metadata: update,
  });

  return NextResponse.json({ success: true });
}
