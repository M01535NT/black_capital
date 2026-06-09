import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireApiProfile } from "@/lib/auth";
import { logger } from "@/lib/logger";

function cleanString(value: unknown): string {
  return String(value || "").trim();
}

export async function PATCH(req: NextRequest) {
  try {
    const profile = await requireApiProfile();
    if (!profile) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const fullName = cleanString(body.full_name);
    const phone = cleanString(body.phone);
    const photoUrl = cleanString(body.photo_url);
    const licenseNumber = cleanString(body.license_number);
    const bio = cleanString(body.bio);

    if (fullName.length < 3) {
      return NextResponse.json({ error: "El nombre debe tener al menos 3 caracteres." }, { status: 400 });
    }
    if (photoUrl && !/^https?:\/\/.+/i.test(photoUrl)) {
      return NextResponse.json({ error: "La URL de foto debe iniciar con http:// o https://." }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error: profileError } = await supabase
      .from("admin_profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    await supabase.auth.admin.updateUserById(profile.id, {
      user_metadata: { full_name: fullName },
    });

    if (profile.agent_id) {
      const { error: agentError } = await supabase
        .from("agents")
        .update({
          full_name: fullName,
          phone: phone || null,
          photo_url: photoUrl || null,
          license_number: licenseNumber || null,
          bio: bio || null,
        })
        .eq("id", profile.agent_id);

      if (agentError) {
        return NextResponse.json({ error: agentError.message }, { status: 400 });
      }
    }

    await supabase.from("audit_logs").insert({
      actor_profile_id: profile.id,
      action: "account.profile.update",
      entity_type: "admin_profile",
      entity_id: profile.id,
      metadata: { agent_id: profile.agent_id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/admin/account/profile", "Profile update error", err);
    return NextResponse.json({ error: `Error al actualizar perfil: ${message}` }, { status: 500 });
  }
}
