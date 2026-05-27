import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { validateSessionToken } from "@/lib/auth";

const SETTINGS_FILE = path.join(process.cwd(), "src", "lib", "settings.json");

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
  luxuryHeroSubtitle: "Propiedades de lujo",
  businessHeroTitle: "Black Business",
  businessHeroSubtitle: "Espacios comerciales",
  industrialHeroTitle: "Black Industrial",
  industrialHeroSubtitle: "Naves y bodegas",
  contactPhone: "+52 (664) 104 9491",
  contactEmail: "contacto@blackcorporativo.com",
  contactAddress: "Tijuana, Baja California, México",
  whatsAppTemplate: "Hola, estoy interesado en sus servicios.",
};

async function readSettings(): Promise<AppSettings> {
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as AppSettings;
    return { ...DEFAULTS, ...parsed };
  } catch (err) {
    console.error("[Settings] Error reading settings file:", err instanceof Error ? err.message : err);
    return { ...DEFAULTS };
  }
}

async function writeSettings(settings: AppSettings) {
  const dir = path.dirname(SETTINGS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

export async function GET() {
  try {
    const settings = await readSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("[Settings GET]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error reading settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const session = cookieStore.get("bc_admin_session");
    if (!session?.value || !(await validateSessionToken(session.value))) {
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
    await writeSettings(merged);
    return NextResponse.json(merged);
  } catch (err) {
    console.error("[Settings POST]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error saving settings" },
      { status: 500 }
    );
  }
}
