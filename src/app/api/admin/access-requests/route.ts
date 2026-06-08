import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";
import { isAdmin, requireApiProfile } from "@/lib/auth";

type AdminAccessRequest = {
  id: string;
  full_name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  reviewed_by?: string | null;
};

export async function GET() {
  const profile = await requireApiProfile();
  if (!profile || !isAdmin(profile)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_access_requests")
    .select("id, full_name, email, phone, age, operating_city, years_experience, current_company, profile_photo_url, social_instagram, social_tiktok, social_linkedin, specialties, internal_reference, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ requests: data || [] });
}

async function parseUserByEmail(supabase: ReturnType<typeof createAdminClient>, email: string) {
  const { data } = await supabase.auth.admin.listUsers();
  return (data?.users || []).find((user) => user.email?.toLowerCase() === email.toLowerCase()) || null;
}

export async function PATCH(req: NextRequest) {
  const profile = await requireApiProfile();
  if (!profile || !isAdmin(profile)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const requestId = String(body.id || "").trim();
  const action = body.action === "approve" || body.action === "reject" ? body.action : "";

  if (!requestId || !action) {
    return NextResponse.json({ error: "Solicitud o acción inválida." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: request, error: requestError } = await supabase
    .from("admin_access_requests")
    .select("*")
    .eq("id", requestId)
    .eq("status", "pending")
    .maybeSingle();

  if (requestError) {
    logger.error("API/admin-access-requests", "[Fetch request error]", requestError);
    return NextResponse.json({ error: "No se pudo obtener la solicitud." }, { status: 500 });
  }

  if (!request) {
    return NextResponse.json({ error: "La solicitud no existe o ya fue procesada." }, { status: 404 });
  }

  if (action === "reject") {
    const { error } = await supabase
      .from("admin_access_requests")
      .update({
        status: "rejected",
        reviewed_by: profile.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", request.id);

    if (error) {
      logger.error("API/admin-access-requests", "[Reject request error]", error);
      return NextResponse.json({ error: "No se pudo rechazar la solicitud." }, { status: 500 });
    }

    return NextResponse.json({ success: true, status: "rejected" });
  }

  const requestPayload = request as AdminAccessRequest;
  const { data: existing, error: existingError } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("email", requestPayload.email)
    .maybeSingle();

  if (existingError) {
    logger.error("API/admin-access-requests", "[Existing profile error]", existingError);
    return NextResponse.json({ error: "No se pudo validar si ya existe usuario." }, { status: 500 });
  }

  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let userId = existing?.id || "";

  if (!userId) {
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(requestPayload.email, {
      redirectTo: `${origin}/admin/update-password`,
      data: { full_name: requestPayload.full_name },
    });

    if (inviteError || !inviteData.user?.id) {
      const existingUser = await parseUserByEmail(supabase, requestPayload.email);
      if (!existingUser?.id) {
        logger.error("API/admin-access-requests", "[Invite user error]", inviteError);
        return NextResponse.json({ error: inviteError?.message || "No se pudo invitar al usuario." }, { status: 400 });
      }
      userId = existingUser.id;
      await supabase.auth.admin.updateUserById(userId, {
        app_metadata: { role: "agent" },
        user_metadata: { full_name: requestPayload.full_name },
      });
    } else {
      userId = inviteData.user.id;
      await supabase.auth.admin.updateUserById(userId, {
        app_metadata: { role: "agent" },
        user_metadata: { full_name: requestPayload.full_name },
      });
    }
  } else {
    await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role: "agent" },
      user_metadata: { full_name: requestPayload.full_name },
    });
  }

  await supabase.from("admin_profiles").upsert({
    id: userId,
    email: requestPayload.email,
    full_name: requestPayload.full_name,
    role: "agent",
    is_active: true,
  });

  const { error: approveError } = await supabase
    .from("admin_access_requests")
    .update({
      status: "approved",
      reviewed_by: profile.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", request.id);

  if (approveError) {
    logger.error("API/admin-access-requests", "[Approve request error]", approveError);
    return NextResponse.json({ error: "No se pudo aprobar la solicitud." }, { status: 500 });
  }

  await supabase.from("audit_logs").insert({
    actor_profile_id: profile.id,
    action: "admin_access_request.approve",
    entity_type: "admin_access_request",
    entity_id: request.id,
    metadata: { email: requestPayload.email, user_id: userId },
  });

  return NextResponse.json({ success: true, status: "approved", userId });
}
