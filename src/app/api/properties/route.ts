import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Columnas que existen realmente en la tabla 'properties' de Supabase
const ALLOWED_COLUMNS = new Set([
    "title", "property_use", "property_type", "business_type",
    "is_project", "is_assignment", "is_featured",
    "m2_terrain", "m2_construction", "price", "currency",
    "address", "description", "status",
    "video_urls", "tour_embeds", "brochure_path", "cover_image",
    "custom_attributes", "images",
    // Campos del agente se guardan en custom_attributes (ver abajo)
]);

async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim(),
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "").trim(),
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {}
                },
            },
        }
    );
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

/** Filtra el payload para solo incluir columnas que existen en la tabla */
function filterPayload(data: Record<string, unknown>): Record<string, unknown> {
    const filtered: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
        // Mapear nombres viejos a nuevos
        if (key === "pdf_url") {
            filtered["brochure_path"] = value;
        } else if (key === "video_url") {
            // Si ya hay video_urls, append; si no, crear array
            filtered["video_urls"] = value ? [value] : [];
        } else if (key === "tour_url") {
            filtered["tour_embeds"] = value ? [value] : [];
        } else if (ALLOWED_COLUMNS.has(key)) {
            filtered[key] = value;
        }
        // agent_name, agent_phone, agent_email se ignoran (no existen en la tabla)
    }

    return filtered;
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const slug = generateSlug(data.title);
        const payload = filterPayload({ ...data, slug });
        const supabase = await getSupabase();

        const { data: property, error } = await supabase
            .from("properties")
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error("[API /properties POST] Supabase error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ property }, { status: 201 });
    } catch (err) {
        console.error("[API /properties POST] Unexpected error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const { id, ...rest } = data;
        const supabase = await getSupabase();

        if (!id) {
            return NextResponse.json({ error: "Missing property id" }, { status: 400 });
        }

        const updatePayload = filterPayload(rest);
        if (rest.title) {
            updatePayload.slug = generateSlug(rest.title as string);
        }

        const { data: property, error } = await supabase
            .from("properties")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("[API /properties PUT] Supabase error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ property }, { status: 200 });
    } catch (err) {
        console.error("[API /properties PUT] Unexpected error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
    }
}
