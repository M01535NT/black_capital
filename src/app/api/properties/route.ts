import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin, requireApiProfile } from "@/lib/auth";

const ALLOWED_COLUMNS = new Set([
  "title", "slug", "property_use", "property_type", "business_type",
  "is_project", "is_assignment", "is_featured",
  "m2_terrain", "m2_construction", "price", "currency",
  "address", "description", "status",
  "video_urls", "tour_embeds", "brochure_path", "cover_image",
  "custom_attributes", "images", "documents",
]);

/**
 * Traduce errores de Supabase a mensajes descriptivos en español
 */
function translateError(error: { code?: string; message?: string; details?: string }): string {
    const msg = error.message || "";
    const code = error.code || "";

    if (code === "23505" || msg.includes("duplicate key") || msg.includes("unique constraint")) {
        if (msg.includes("properties_slug_key") || msg.includes("slug")) {
            return "Ya existe una propiedad con ese slug. Cambia el título o el slug manualmente.";
        }
        return "Ya existe un registro con ese valor. Verifica los datos.";
    }
    if (code === "23503" || msg.includes("foreign key")) {
        return "No se puede realizar la operación porque hay datos relacionados.";
    }
    if (code === "42501" || msg.includes("permission")) {
        return "No tienes permisos para realizar esta acción.";
    }
    return msg || "Error desconocido al procesar la solicitud";
}

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

const STORAGE_BUCKETS = ["public", "secure-brochures"] as const;

async function deletePropertyFiles(
  supabase: ReturnType<typeof createAdminClient>,
  propertyId: string
): Promise<void> {
  for (const bucket of STORAGE_BUCKETS) {
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(propertyId);

    if (listError) {
      logger.error("API/properties", `[API /properties DELETE] Error listando storage (${bucket}):`, listError);
      continue;
    }
    if (!files || files.length === 0) continue;

    const paths = files.map((file) => `${propertyId}/${file.name}`);
    const { error: removeError } = await supabase.storage.from(bucket).remove(paths);
    if (removeError) {
      logger.error("API/properties", `[API /properties DELETE] Error borrando storage (${bucket}):`, removeError);
    }
  }
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
      logger.error("API/properties", "[API /properties] Error syncing property_agents:", error);
      return error.message;
    }
  }
  return null;
}

// ── Auth helper ──
export async function POST(req: NextRequest) {
  try {
    const profile = await requireApiProfile();
    if (!profile || !isAdmin(profile)) {
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
      logger.error("API/properties", "[API /properties POST] Supabase error:", error);
      return NextResponse.json({ error: translateError(error) }, { status: 400 });
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
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/properties", "[API /properties POST] Unexpected error:", err);
    return NextResponse.json({ error: `Error al crear propiedad: ${message}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const profile = await requireApiProfile();
    if (!profile || !isAdmin(profile)) {
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
      logger.error("API/properties", "[API /properties PUT] Supabase error:", error);
      return NextResponse.json({ error: translateError(error) }, { status: 400 });
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
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/properties", "[API /properties PUT] Unexpected error:", err);
    return NextResponse.json({ error: `Error al actualizar propiedad: ${message}` }, { status: 500 });
  }
}

export async function GET() {
  try {
    const profile = await requireApiProfile();
    if (!profile) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const supabase = createAdminClient();
    let query = supabase
      .from("properties")
      .select("id, title, business_type, price, currency")
      .order("title", { ascending: true });

    if (!isAdmin(profile)) {
      if (!profile.agent_id) return NextResponse.json({ properties: [] });
      const { data: assigned } = await supabase
        .from("property_agents")
        .select("property_id")
        .eq("agent_id", profile.agent_id);
      const ids = (assigned || []).map((row) => row.property_id);
      if (ids.length === 0) return NextResponse.json({ properties: [] });
      query = query.in("id", ids);
    }

    const { data: properties, error } = await query;

    if (error) {
      logger.error("API/properties", "[API /properties GET]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ properties: properties || [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/properties", "[API /properties GET]", err);
    return NextResponse.json({ error: `Error al obtener propiedades: ${message}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const profile = await requireApiProfile();
    if (!profile || !isAdmin(profile)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Se requiere el ID de la propiedad" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) {
      logger.error("API/properties", "[API /properties DELETE]", error);
      return NextResponse.json({ error: translateError(error) }, { status: 400 });
    }

    await deletePropertyFiles(supabase, id);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/properties", "[API /properties DELETE]", err);
    return NextResponse.json({ error: `Error al eliminar propiedad: ${message}` }, { status: 500 });
  }
}
