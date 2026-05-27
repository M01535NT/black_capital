import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateSessionToken } from "@/lib/auth";

/**
 * Normaliza email: convierte string vacío a null para evitar
 * violaciones de unique constraint con strings vacíos
 */
function normalizeEmail(email: string | undefined | null): string | null {
    if (!email || email.trim() === "") return null;
    return email.trim().toLowerCase();
}

/**
 * Traduce errores de Supabase a mensajes amigables en español
 */
function translateError(error: { code?: string; message?: string; details?: string }): string {
    const msg = error.message || "";
    const code = error.code || "";

    if (code === "23505" || msg.includes("duplicate key") || msg.includes("unique constraint")) {
        if (msg.includes("agents_email_key") || msg.includes("email")) {
            return "Ya existe un agente registrado con ese correo electrónico. Usa otro email.";
        }
        return "Ya existe un registro con ese valor. Verifica los datos.";
    }
    if (code === "23503" || msg.includes("foreign key")) {
        return "No se puede realizar la operación porque hay datos relacionados.";
    }
    if (code === "42501" || msg.includes("permission")) {
        return "No tienes permisos para realizar esta acción.";
    }
    if (msg.includes("Invalid API key")) {
        return "Error de conexión con la base de datos. Verifica las credenciales de Supabase.";
    }
    return msg || "Error desconocido al procesar la solicitud";
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
        if (!data.full_name || typeof data.full_name !== "string" || !data.full_name.trim()) {
            return NextResponse.json({ error: "El nombre completo es requerido" }, { status: 400 });
        }

        const supabase = createAdminClient();

        const email = normalizeEmail(data.email);

        const { data: agent, error } = await supabase
            .from("agents")
            .insert({
                full_name: data.full_name?.trim() || "",
                email,
                phone: data.phone?.trim() || null,
                photo_url: data.photo_url?.trim() || null,
                license_number: data.license_number?.trim() || null,
                bio: data.bio?.trim() || null,
                is_active: data.is_active ?? true,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: translateError(error) },
                { status: 400 }
            );
        }

        return NextResponse.json({ agent }, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Error interno del servidor" },
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
        const { id, ...rest } = data;
        const supabase = createAdminClient();

        if (!id) {
            return NextResponse.json({ error: "Se requiere el ID del agente" }, { status: 400 });
        }

        const email = normalizeEmail(rest.email);

        const { data: agent, error } = await supabase
            .from("agents")
            .update({
                full_name: rest.full_name?.trim(),
                email,
                phone: rest.phone?.trim() || null,
                photo_url: rest.photo_url?.trim() || null,
                license_number: rest.license_number?.trim() || null,
                bio: rest.bio?.trim() || null,
                is_active: rest.is_active,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: translateError(error) },
                { status: 400 }
            );
        }

        return NextResponse.json({ agent }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Error interno del servidor" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        if (!(await checkAuth())) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const supabase = createAdminClient();

        if (!id) {
            return NextResponse.json({ error: "Se requiere el ID del agente" }, { status: 400 });
        }

        // Verificar si el agente tiene propiedades asignadas
        const { data: assignments } = await supabase
            .from("property_agents")
            .select("id")
            .eq("agent_id", id);

        if (assignments && assignments.length > 0) {
            return NextResponse.json(
                { error: "No se puede eliminar: el agente tiene propiedades asignadas. Desasígnalas primero." },
                { status: 409 }
            );
        }

        const { error } = await supabase.from("agents").delete().eq("id", id);

        if (error) {
            return NextResponse.json(
                { error: translateError(error) },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Error interno del servidor" },
            { status: 500 }
        );
    }
}
