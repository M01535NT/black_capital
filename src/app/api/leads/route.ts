import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateSessionToken } from "@/lib/auth";
import { getLeadsCount } from "@/lib/data";

async function checkAuth(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const session = cookieStore.get("bc_admin_session");
  return !!(session?.value && (await validateSessionToken(session.value)));
}

export async function GET(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const newCount = await getLeadsCount("new");
    return NextResponse.json({ newCount });
  } catch (err) {
    console.error("[API /leads GET]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { full_name, email, phone, source, status, notes, assigned_agent_id, property_id, privacy_accepted } = body;

    if (!full_name) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        full_name: full_name?.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        source: source || "organic",
        status: status || "new",
        notes: notes?.trim() || null,
        assigned_agent_id: assigned_agent_id || null,
        property_id: property_id || null,
        privacy_accepted: privacy_accepted ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("[API /leads POST]", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ lead: data }, { status: 201 });
  } catch (err) {
    console.error("[API /leads POST]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, notes, assigned_agent_id } = body;

    if (!id) {
      return NextResponse.json({ error: "Se requiere el ID del lead" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updateData: Record<string, unknown> = {};

    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (assigned_agent_id !== undefined) updateData.assigned_agent_id = assigned_agent_id;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[API /leads PUT]", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ lead: data });
  } catch (err) {
    console.error("[API /leads PUT]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
