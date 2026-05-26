import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

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

const DEFAULTS: AppSettings = {
    heroVideoUrl: "",
    heroImageUrl: "",
    luxuryHeroTitle: "Black Luxury",
    luxuryHeroSubtitle: "Propiedades de lujo",
    businessHeroTitle: "Black Business",
    businessHeroSubtitle: "Espacios comerciales",
    industrialHeroTitle: "Black Industrial",
    industrialHeroSubtitle: "Naves y bodegas",
    contactPhone: "+52 (664) 000 0000",
    contactEmail: "contacto@blackcorporativo.com",
    contactAddress: "Tijuana, Baja California, México",
    whatsAppTemplate: "Hola, estoy interesado en sus servicios.",
};

async function readSettings(): Promise<AppSettings> {
    try {
        const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
        const parsed = JSON.parse(raw) as AppSettings;
        return { ...DEFAULTS, ...parsed };
    } catch {
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
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Error reading settings" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as Partial<AppSettings>;
        const existing = await readSettings();
        const merged = { ...existing, ...body };
        await writeSettings(merged);
        return NextResponse.json(merged);
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Error saving settings" },
            { status: 500 }
        );
    }
}
