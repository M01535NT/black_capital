import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin, requireApiProfile } from "@/lib/auth";

export interface AppSettings {
  heroVideoUrl?: string;
  heroImageUrl?: string;
  luxuryHeroTitle?: string;
  luxuryHeroSubtitle?: string;
  businessHeroTitle?: string;
  businessHeroSubtitle?: string;
  industrialHeroTitle?: string;
  industrialHeroSubtitle?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  whatsAppTemplate?: string;
}

const ALLOWED_KEYS = new Set([
  "heroVideoUrl", "heroImageUrl",
  "luxuryHeroTitle", "luxuryHeroSubtitle",
  "businessHeroTitle", "businessHeroSubtitle",
  "industrialHeroTitle", "industrialHeroSubtitle",
  "contactPhone", "contactEmail", "contactAddress",
  "whatsAppTemplate",
]);

const DEFAULTS: AppSettings = {
  heroVideoUrl: "",
  heroImageUrl: "",
  luxuryHeroTitle: "Black Luxury",
  luxuryHeroSubtitle: "Casas y residencias",
  businessHeroTitle: "Black Business",
  businessHeroSubtitle: "Espacios comerciales",
  industrialHeroTitle: "Black Industrial",
  industrialHeroSubtitle: "Naves y bodegas",
  contactPhone: "+52 (664) 104 9491",
  contactEmail: "contacto@blackmx.vercel.app",
  contactAddress: "Tijuana, Baja California, México",
  whatsAppTemplate: "Hola, estoy interesado en sus servicios.",
};

async function readSettings(): Promise<AppSettings> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "site")
    .maybeSingle();
  if (error) {
    logger.error("API/settings", "[Settings] Error reading settings:", error);
    return { ...DEFAULTS };
  }
  return { ...DEFAULTS, ...((data?.value as AppSettings | null) || {}) };
}

export async function GET() {
  try {
    const profile = await requireApiProfile();
    if (!profile) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const settings = await readSettings();
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

    const body = await req.json();

    // Only allow known keys — prevents stored XSS via arbitrary keys
    const sanitized: Partial<AppSettings> = {};
    for (const key of Object.keys(body)) {
      if (ALLOWED_KEYS.has(key)) {
        (sanitized as Record<string, unknown>)[key] = body[key];
      }
    }

    const existing = await readSettings();
    const merged = { ...existing, ...sanitized };
    const supabase = createAdminClient();
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

    return NextResponse.json(merged);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/settings", "[Settings POST]", err);
    return NextResponse.json({ error: `Error al guardar configuración: ${message}` }, { status: 500 });
  }
}
