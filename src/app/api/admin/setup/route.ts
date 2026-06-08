import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export async function POST(request: Request) {
  try {
    const { fullName, email, password, setupToken } = await request.json();
    const expectedToken = process.env.ADMIN_SETUP_TOKEN || process.env.ADMIN_PASSWORD;

    if (!expectedToken) {
      return NextResponse.json({ error: "Configura ADMIN_SETUP_TOKEN para habilitar la invitación inicial de administrador." }, { status: 500 });
    }
    if (!setupToken || !safeEqual(String(setupToken), expectedToken)) {
      return NextResponse.json({ error: "Token de setup inválido." }, { status: 401 });
    }
    if (!fullName || !email || !password || password.length < 8) {
      return NextResponse.json({ error: "Nombre, correo y contraseña de 8 caracteres son obligatorios." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { count } = await supabase
      .from("admin_profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin")
      .eq("is_active", true);

    if ((count || 0) > 0) {
      return NextResponse.json(
        { error: "Ya existe un administrador activo. Usa el acceso de admin para invitar nuevos usuarios." },
        { status: 409 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      app_metadata: { role: "admin" },
      user_metadata: { full_name: fullName },
    });

    if (createError || !created.user) {
      return NextResponse.json({ error: createError?.message || "No se pudo crear el usuario." }, { status: 400 });
    }

    const { error: profileError } = await supabase.from("admin_profiles").insert({
      id: created.user.id,
      email: normalizedEmail,
      full_name: String(fullName).trim(),
      role: "admin",
      is_active: true,
    });

    if (profileError) {
      await supabase.auth.admin.deleteUser(created.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("API/admin/setup", "Setup error", error);
    return NextResponse.json({ error: "Error interno al crear el admin." }, { status: 500 });
  }
}
