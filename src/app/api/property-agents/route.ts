import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateSessionToken } from "@/lib/auth";

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

    const body = await req.json();
    const { agent_id, property_id } = body;

    if (!agent_id || !property_id) {
      return NextResponse.json({ error: "Faltan agent_id o property_id" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("property_agents")
      .insert({ agent_id, property_id });

    if (error) {
      logger.error("API/prop-agents", "[API /property-agents POST] Supabase error:", error);
      // 23505 = unique violation (already assigned)
      if (error.code === "23505") {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/prop-agents", "[API /property-agents POST] Unexpected error:", err);
    return NextResponse.json({ error: `Error al asignar agente: ${message}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const agent_id = searchParams.get("agent_id");
    const property_id = searchParams.get("property_id");

    if (!agent_id) {
      return NextResponse.json({ error: "Falta agent_id" }, { status: 400 });
    }

    const supabase = createAdminClient();
    let query = supabase.from("property_agents").delete().eq("agent_id", agent_id);

    if (property_id) {
      query = query.eq("property_id", property_id);
    }

    const { error } = await query;

    if (error) {
      logger.error("API/prop-agents", "[API /property-agents DELETE] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/prop-agents", "[API /property-agents DELETE] Unexpected error:", err);
    return NextResponse.json({ error: `Error al desasignar agente: ${message}` }, { status: 500 });
  }
}
