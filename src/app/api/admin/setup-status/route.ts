import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from("admin_profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin")
    .eq("is_active", true);

  if (error) {
    return NextResponse.json({ error: "No se pudo validar la configuración de admin." }, { status: 500 });
  }

  return NextResponse.json({ hasAdmin: (count || 0) > 0 });
}
