import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateSessionToken } from "@/lib/auth";

const ALLOWED_COLUMNS = new Set([
  "title", "slug", "property_use", "property_type", "business_type",
  "is_project", "is_assignment", "is_featured",
  "m2_terrain", "m2_construction", "price", "currency",
  "address", "description", "status",
  "video_urls", "tour_embeds", "brochure_path", "cover_image",
  "custom_attributes", "images", "documents",
]);

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function filterPayload(data: Record<string, unknown>): Record<string, unknown> {
  const filtered: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "agent_ids") continue;
    if (key === "pdf_url") {
      filtered["brochure_path"] = value;
    } else if (key === "video_url") {
      filtered["video_urls"] = value ? [value] : null;
    } else if (key === "tour_url") {
      filtered["tour_embeds"] = value ? [value] : null;
    } else if (ALLOWED_COLUMNS.has(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
}

async function syncPropertyAgents(
  supabase: ReturnType<typeof createAdminClient>,
  propertyId: string,
  agentIds: string[]
): Promise<string | null> {
  await supabase.from("property_agents").delete().eq("property_id", propertyId);
  if (agentIds.length > 0) {
    const rows = agentIds.map((agentId) => ({
      property_id: propertyId,
      agent_id: agentId,
    }));
    const { error } = await supabase.from("property_agents").insert(rows);
    if (error) {
      console.error("[API /properties] Error syncing property_agents:", error);
      return error.message;
    }
  }
  return null;
}

// ── Auth helper ──
async function checkAuth(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const session = cookieStore.get("bc_admin_session");
  return !!(session?.value && (await validateSessionToken(session.value)));
}

export async function POST(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await req.json();

    // Validate required fields
    if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
      return NextResponse.json({ error: "El título es requerido" }, { status: 400 });
    }

    const { agent_ids } = data;
    const slug = data.slug || generateSlug(data.title);
    const payload = filterPayload({ ...data, slug });
    const supabase = createAdminClient();

    const { data: property, error } = await supabase
      .from("properties")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("[API /properties POST] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Sync agent assignments — propagate error
    if (agent_ids && Array.isArray(agent_ids)) {
      const syncErr = await syncPropertyAgents(supabase, property.id, agent_ids);
      if (syncErr) {
        return NextResponse.json(
          { property, warning: `Propiedad creada pero falló asignación de agentes: ${syncErr}` },
          { status: 201 }
        );
      }
    }

    return NextResponse.json({ property }, { status: 201 });
  } catch (err) {
    console.error("[API /properties POST] Unexpected error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await req.json();
    const { id, agent_ids, ...rest } = data;
    const supabase = createAdminClient();

    if (!id) {
      return NextResponse.json({ error: "Missing property id" }, { status: 400 });
    }

    // Validate title if provided
    if ("title" in rest && (!rest.title || typeof rest.title !== "string" || !rest.title.trim())) {
      return NextResponse.json({ error: "El título no puede estar vacío" }, { status: 400 });
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

    if (agent_ids && Array.isArray(agent_ids)) {
      const syncErr = await syncPropertyAgents(supabase, id, agent_ids);
      if (syncErr) {
        return NextResponse.json(
          { property, warning: `Propiedad actualizada pero falló asignación de agentes: ${syncErr}` },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ property }, { status: 200 });
  } catch (err) {
    console.error("[API /properties PUT] Unexpected error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
