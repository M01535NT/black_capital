import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isAdmin, requireApiProfile } from "@/lib/auth";
import { sendTeamInviteEmail } from "@/lib/email/team-invite";
import type { AdminRole } from "@/lib/auth";

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

async function parseUserByEmail(supabase: ReturnType<typeof createAdminClient>, email: string) {
    const { data } = await supabase.auth.admin.listUsers();
    return (data?.users || []).find((user) => user.email?.toLowerCase() === email.toLowerCase()) || null;
}

async function countAgentAssignments(supabase: ReturnType<typeof createAdminClient>, agentId: string) {
    const [{ count: propertyCount }, { count: leadCount }] = await Promise.all([
        supabase
            .from("property_agents")
            .select("agent_id", { count: "exact", head: true })
            .eq("agent_id", agentId),
        supabase
            .from("leads")
            .select("id", { count: "exact", head: true })
            .eq("assigned_agent_id", agentId),
    ]);

    return {
        propertyCount: propertyCount || 0,
        leadCount: leadCount || 0,
    };
}

// ── Auth helper ──
export async function GET() {
  try {
    const profile = await requireApiProfile();
    if (!profile) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const supabase = createAdminClient();
    const { data: agents, error } = await supabase
      .from("agents")
      .select("id, full_name, email, phone, photo_url, license_number, is_active")
      .order("full_name", { ascending: true });

    if (error) {
      logger.error("API/agents", "[API /agents GET]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agents: agents || [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/agents", "[API /agents GET]", err);
    return NextResponse.json({ error: `Error al obtener agentes: ${message}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
        const profile = await requireApiProfile();
        if (!profile || !isAdmin(profile)) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        const data = await req.json();

        if (!data.full_name || typeof data.full_name !== "string" || !data.full_name.trim()) {
            return NextResponse.json({ error: "El nombre completo es requerido" }, { status: 400 });
        }

        const supabase = createAdminClient();

        const email = normalizeEmail(data.email);
        if (!email) {
            return NextResponse.json({ error: "El correo es obligatorio para crear el acceso del agente." }, { status: 400 });
        }

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

        const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        let userId = "";
        let actionLink = "";
        const role: AdminRole = data.role === "admin" ? "admin" : "agent";
        const { data: inviteData, error: inviteError } = await supabase.auth.admin.generateLink({
            type: "invite",
            email,
            options: {
                redirectTo: `${origin}/admin/update-password`,
                data: { full_name: agent.full_name },
            },
        });

        if (inviteError || !inviteData.user?.id) {
            const existingUser = await parseUserByEmail(supabase, email);
            if (!existingUser?.id) {
                await supabase.from("agents").delete().eq("id", agent.id);
                return NextResponse.json(
                    { error: inviteError?.message || "No se pudo crear el acceso del integrante." },
                    { status: 400 }
                );
            }
            userId = existingUser.id;
            const { data: recoveryData, error: recoveryError } = await supabase.auth.admin.generateLink({
                type: "recovery",
                email,
                options: {
                    redirectTo: `${origin}/admin/update-password`,
                },
            });

            if (recoveryError || !recoveryData.properties?.action_link) {
                await supabase.from("agents").delete().eq("id", agent.id);
                return NextResponse.json(
                    { error: recoveryError?.message || "No se pudo generar el enlace de acceso del integrante." },
                    { status: 400 }
                );
            }
            actionLink = recoveryData.properties.action_link;
        } else {
            userId = inviteData.user.id;
            actionLink = inviteData.properties.action_link;
        }

        await supabase.auth.admin.updateUserById(userId, {
            app_metadata: { role },
            user_metadata: { full_name: agent.full_name },
        });

        const { error: profileError } = await supabase.from("admin_profiles").upsert({
            id: userId,
            email,
            full_name: agent.full_name,
            role,
            agent_id: agent.id,
            is_active: data.is_active ?? true,
            invited_at: new Date().toISOString(),
        });

        if (profileError) {
            await supabase.from("agents").delete().eq("id", agent.id);
            return NextResponse.json({ error: profileError.message }, { status: 400 });
        }

        const emailDelivery = await sendTeamInviteEmail({
            to: email,
            fullName: agent.full_name,
            role,
            actionLink,
        });

        if (emailDelivery.skipped || emailDelivery.error) {
            logger.error("API/agents", "Agent access email was not delivered", {
                to: email,
                skipped: emailDelivery.skipped,
                error: emailDelivery.error,
                reason: emailDelivery.reason,
            });
        }

        return NextResponse.json({ agent, emailDelivery }, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno del servidor";
        return NextResponse.json({ error: `Error en operación de agente: ${message}` }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const profile = await requireApiProfile();
        if (!profile || !isAdmin(profile)) {
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
        const message = err instanceof Error ? err.message : "Error interno del servidor";
        return NextResponse.json({ error: `Error en operación de agente: ${message}` }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const profile = await requireApiProfile();
        if (!profile) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const data = await req.json();
        const { id, is_active } = data;

        if (!id) {
            return NextResponse.json({ error: "Se requiere el ID del agente" }, { status: 400 });
        }
        if (typeof is_active !== "boolean") {
            return NextResponse.json({ error: "El estado del agente es inválido" }, { status: 400 });
        }
        if (!isAdmin(profile) && profile.agent_id !== id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const supabase = createAdminClient();
        if (!is_active) {
            const { propertyCount, leadCount } = await countAgentAssignments(supabase, id);
            if (propertyCount > 0 || leadCount > 0) {
                return NextResponse.json(
                    {
                        error: `No se puede dar de baja: el agente tiene ${propertyCount} propiedades y ${leadCount} leads asignados. Reasígnalos primero.`,
                    },
                    { status: 409 }
                );
            }
        }

        const { data: agent, error } = await supabase
            .from("agents")
            .update({ is_active })
            .eq("id", id)
            .select("id, is_active")
            .single();

        if (error) {
            return NextResponse.json(
                { error: translateError(error) },
                { status: 400 }
            );
        }

        await supabase
            .from("admin_profiles")
            .update({ is_active })
            .eq("agent_id", id);

        return NextResponse.json({ agent }, { status: 200 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno del servidor";
        return NextResponse.json({ error: `Error al actualizar estado del agente: ${message}` }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const profile = await requireApiProfile();
        if (!profile || !isAdmin(profile)) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const body = await req.json().catch(() => ({}));
        const id = searchParams.get("id") || String(body.id || "");
        const password = String(body.password || "");
        const supabase = createAdminClient();

        if (!id) {
            return NextResponse.json({ error: "Se requiere el ID del agente" }, { status: 400 });
        }
        if (!password) {
            return NextResponse.json({ error: "Confirma tu contraseña de administrador." }, { status: 400 });
        }

        const authClient = await createClient();
        const { error: passwordError } = await authClient.auth.signInWithPassword({
            email: profile.email,
            password,
        });

        if (passwordError) {
            return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
        }

        const { propertyCount, leadCount } = await countAgentAssignments(supabase, id);
        if (propertyCount > 0 || leadCount > 0) {
            return NextResponse.json(
                { error: `No se puede eliminar: el agente tiene ${propertyCount} propiedades y ${leadCount} leads asignados. Reasígnalos primero.` },
                { status: 409 }
            );
        }

        const { data: adminProfiles } = await supabase
            .from("admin_profiles")
            .select("id")
            .eq("agent_id", id);

        const { error } = await supabase.from("agents").delete().eq("id", id);

        if (error) {
            return NextResponse.json(
                { error: translateError(error) },
                { status: 400 }
            );
        }

        if (adminProfiles?.length) {
            const profileIds = adminProfiles.map((item) => item.id);
            await supabase.from("admin_profiles").delete().in("id", profileIds);
            await Promise.all(profileIds.map((profileId) => supabase.auth.admin.deleteUser(profileId)));
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno del servidor";
        return NextResponse.json({ error: `Error en operación de agente: ${message}` }, { status: 500 });
    }
}
