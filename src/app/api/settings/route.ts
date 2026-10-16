import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin, requireApiProfile } from "@/lib/auth";

export type { SiteSettings as AppSettings } from "@/lib/site-settings-schema";
import { normalizeSiteSettings, siteSettingsPatchSchema } from "@/lib/site-settings-schema";
import { getSiteSettings } from "@/lib/site-settings";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const profile = await requireApiProfile();
    if (!profile) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/settings", "[Settings GET]", err);
    return NextResponse.json({ error: `Error al leer configuración: ${message}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const profile = await requireApiProfile();
    if (!profile || !isAdmin(profile)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const parsed = siteSettingsPatchSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Configuración inválida", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    const sanitized = parsed.data;

    const supabase = createAdminClient();
    // Public rendering may fall back to defaults; saving must read the real value.
    const { data: current, error: readError } = await supabase.from("app_settings").select("value").eq("key", "site").maybeSingle();
    if (readError) {
      logger.error("API/settings", "[Settings POST] Cannot read existing settings", readError);
      return NextResponse.json({ error: "No se pudo leer la configuración actual. Intenta de nuevo." }, { status: 503 });
    }
    const merged = normalizeSiteSettings({ ...normalizeSiteSettings(current?.value), ...sanitized });
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key: "site", value: merged, updated_by: profile.id, updated_at: new Date().toISOString() });

    if (error) {
      logger.error("API/settings", "[Settings POST] Supabase error", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabase.from("audit_logs").insert({
      actor_profile_id: profile.id,
      action: "settings.update",
      entity_type: "app_settings",
      entity_id: "site",
      metadata: { keys: Object.keys(sanitized) },
    });

    revalidatePath("/", "layout");
    return NextResponse.json(merged);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/settings", "[Settings POST]", err);
    return NextResponse.json({ error: `Error al guardar configuración: ${message}` }, { status: 500 });
  }
}
