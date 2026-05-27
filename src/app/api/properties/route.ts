import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Columnas que existen realmente en la tabla 'properties' de Supabase
const ALLOWED_COLUMNS = new Set([
    "title", "slug", "property_use", "property_type", "business_type",
    "is_project", "is_assignment", "is_featured",
    "m2_terrain", "m2_construction", "price", "currency",
    "address", "description", "status",
    "video_urls", "tour_embeds", "brochure_path", "cover_image",
    "custom_attributes", "images", "documents",
]);

function getAdminSupabase() {
    return createAdminClient();
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
        if (key === "agent_ids") continue; // handled separately
        // Mapear nombres viejos a nuevos
        if (key === "pdf_url") {
            filtered["brochure_path"] = value;
        } else if (key === "video_url") {
            if (value) {
                filtered["video_urls"] = [value];
            } else {
                filtered["video_urls"] = null;
            }
        } else if (key === "tour_url") {
            if (value) {
                filtered["tour_embeds"] = [value];
            } else {
                filtered["tour_embeds"] = null;
            }
        } else if (ALLOWED_COLUMNS.has(key)) {
            filtered[key] = value;
        }
        // agent_name, agent_phone, agent_email se ignoran (no existen en la tabla)
    }

    return filtered;
}

/** Sincroniza property_agents: reemplaza todos los agentes asignados */
async function syncPropertyAgents(
    supabase: ReturnType<typeof createAdminClient>,
    propertyId: string,
    agentIds: string[]
) {
    // Delete existing
    await supabase.from("property_agents").delete().eq("property_id", propertyId);

    // Insert new
    if (agentIds.length > 0) {
        const rows = agentIds.map(agentId => ({
            property_id: propertyId,
            agent_id: agentId,
        }));
        const { error } = await supabase.from("property_agents").insert(rows);
        if (error) {
            console.error("[API /properties] Error syncing property_agents:", error);
        }
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { agent_ids } = data;
        const slug = data.slug || generateSlug(data.title);
        const payload = filterPayload({ ...data, slug });
        const supabase = getAdminSupabase();

        const { data: property, error } = await supabase
            .from("properties")
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error("[API /properties POST] Supabase error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Sync agent assignments
        if (agent_ids && Array.isArray(agent_ids)) {
            await syncPropertyAgents(supabase, property.id, agent_ids);
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
        const { id, agent_ids, ...rest } = data;
        const supabase = getAdminSupabase();

        if (!id) {
            return NextResponse.json({ error: "Missing property id" }, { status: 400 });
        }

        const updatePayload = filterPayload(rest);
        if (rest.title && !rest.slug) {
            updatePayload.slug = generateSlug(rest.title as string);
        } else if (rest.slug) {
            updatePayload.slug = rest.slug;
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

        // Sync agent assignments
        if (agent_ids && Array.isArray(agent_ids)) {
            await syncPropertyAgents(supabase, id, agent_ids);
        }

        return NextResponse.json({ property }, { status: 200 });
    } catch (err) {
        console.error("[API /properties PUT] Unexpected error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
    }
}
