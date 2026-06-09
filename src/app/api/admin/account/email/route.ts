import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireApiProfile } from "@/lib/auth";
import { logger } from "@/lib/logger";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function PATCH(req: NextRequest) {
  try {
    const profile = await requireApiProfile();
    if (!profile) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const email = normalizeEmail(String(body.email || ""));
    const password = String(body.password || "");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ingresa un correo válido." }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Confirma tu contraseña actual." }, { status: 400 });
    }
    if (email === profile.email.toLowerCase()) {
      return NextResponse.json({ error: "El correo nuevo es igual al actual." }, { status: 400 });
    }

    const authClient = await createClient();
    const { error: passwordError } = await authClient.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (passwordError) {
      return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data: existingProfile } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("email", email)
      .neq("id", profile.id)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json({ error: "Ese correo ya está registrado en otro acceso." }, { status: 409 });
    }

    const { error: authError } = await supabase.auth.admin.updateUserById(profile.id, {
      email,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const { error: profileError } = await supabase
      .from("admin_profiles")
      .update({ email })
      .eq("id", profile.id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    if (profile.agent_id) {
      const { error: agentError } = await supabase
        .from("agents")
        .update({ email })
        .eq("id", profile.agent_id);

      if (agentError) {
        return NextResponse.json({ error: agentError.message }, { status: 400 });
      }
    }

    await supabase.from("audit_logs").insert({
      actor_profile_id: profile.id,
      action: "account.email.update",
      entity_type: "admin_profile",
      entity_id: profile.id,
      metadata: { previous_email: profile.email, email },
    });

    return NextResponse.json({ success: true, email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/admin/account/email", "Email update error", err);
    return NextResponse.json({ error: `Error al actualizar correo: ${message}` }, { status: 500 });
  }
}
