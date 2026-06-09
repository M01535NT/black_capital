import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { canAccessAgentScopedResource, isAdmin, requireApiProfile } from "@/lib/auth";
import { getLeadsCount } from "@/lib/data";
import { sendOperationalEmail } from "@/lib/email";

export async function GET() {
  try {
    const profile = await requireApiProfile();
    if (!profile) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const newCount = await getLeadsCount("new");
    return NextResponse.json({ newCount });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/leads", "[API /leads GET]", err);
    return NextResponse.json({ error: `Error al obtener leads: ${message}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const profile = await requireApiProfile();
    if (!profile) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { full_name, email, phone, source, status, notes, assigned_agent_id, property_id, privacy_accepted } = body;

    // Validate required fields
    if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2) {
      return NextResponse.json({ error: "El nombre es requerido (mínimo 2 caracteres)" }, { status: 400 });
    }
    
    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Formato de correo electrónico inválido" }, { status: 400 });
    }
    
    // Validate phone format if provided
    if (phone && !/^[\d\s\-\+\(\)]{10,}$/.test(phone)) {
      return NextResponse.json({ error: "Formato de teléfono inválido" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const finalAssignedAgentId = isAdmin(profile)
      ? (assigned_agent_id || null)
      : (profile.agent_id || null);
    const { data, error } = await supabase
      .from("leads")
      .insert({
        full_name: full_name?.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        source: source || "organic",
        status: status || "new",
        notes: notes?.trim() || null,
        assigned_agent_id: finalAssignedAgentId,
        property_id: property_id || null,
        privacy_accepted: privacy_accepted ?? true,
      })
      .select()
      .single();

    if (error) {
      logger.error("API/leads", "[API /leads POST]", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabase.from("lead_activities").insert({
      lead_id: data.id,
      actor_profile_id: profile.id,
      type: "system",
      title: "Lead creado",
      body: notes?.trim() || null,
      metadata: { source: source || "organic", assigned_agent_id: finalAssignedAgentId },
    });

    return NextResponse.json({ lead: data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/leads", "[API /leads POST]", err);
    return NextResponse.json({ error: `Error al crear lead: ${message}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const profile = await requireApiProfile();
    if (!profile) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, notes, assigned_agent_id } = body;

    if (!id) {
      return NextResponse.json({ error: "Se requiere el ID del lead" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: existingLead, error: existingError } = await supabase
      .from("leads")
      .select("assigned_agent_id, status")
      .eq("id", id)
      .maybeSingle();

    if (existingError || !existingLead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }
    if (!canAccessAgentScopedResource(profile, existingLead.assigned_agent_id)) {
      return NextResponse.json({ error: "No autorizado para este lead" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};

    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (assigned_agent_id !== undefined && isAdmin(profile)) updateData.assigned_agent_id = assigned_agent_id;

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
      logger.error("API/leads", "[API /leads PUT]", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const activityRows = [];
    if (status && status !== existingLead.status) {
      activityRows.push({
        lead_id: id,
        actor_profile_id: profile.id,
        type: "status_change",
        title: "Estado actualizado",
        metadata: { from: existingLead.status, to: status },
      });
    }
    if (assigned_agent_id !== undefined && isAdmin(profile) && assigned_agent_id !== existingLead.assigned_agent_id) {
      activityRows.push({
        lead_id: id,
        actor_profile_id: profile.id,
        type: "assignment",
        title: "Asignación actualizada",
        metadata: { from: existingLead.assigned_agent_id, to: assigned_agent_id },
      });
      if (assigned_agent_id) {
        const { data: recipient } = await supabase
          .from("admin_profiles")
          .select("id, email")
          .eq("agent_id", assigned_agent_id)
          .eq("is_active", true)
          .maybeSingle();
        if (recipient) {
          await supabase.from("notifications").insert({
            recipient_profile_id: recipient.id,
            type: "assignment",
            title: "Lead asignado",
            body: "Se te asignó un lead para seguimiento.",
            href: `/admin/leads/${id}`,
          });
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";
          await sendOperationalEmail({
            to: recipient.email,
            subject: "Nuevo lead asignado",
            html: `<p>Se te asignó un lead para seguimiento.</p><p><a href="${siteUrl.replace(/\/$/, "")}/admin/leads/${id}">Abrir lead</a></p>`,
          });
        }
      }
    }
    if (notes !== undefined) {
      activityRows.push({
        lead_id: id,
        actor_profile_id: profile.id,
        type: "note",
        title: "Nota actualizada",
        body: notes,
      });
    }
    if (activityRows.length > 0) await supabase.from("lead_activities").insert(activityRows);

    return NextResponse.json({ lead: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/leads", "[API /leads PUT]", err);
    return NextResponse.json({ error: `Error al actualizar lead: ${message}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const profile = await requireApiProfile();
    if (!profile || !isAdmin(profile)) {
      return NextResponse.json({ error: "Solo un administrador puede eliminar leads." }, { status: 403 });
    }

    const body = await req.json();
    const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown): id is string => typeof id === "string" && id.length > 0) : [];
    const password = String(body.password || "");

    if (ids.length === 0) {
      return NextResponse.json({ error: "Selecciona al menos un lead." }, { status: 400 });
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

    const supabase = createAdminClient();
    const { data: existingLeads, error: fetchError } = await supabase
      .from("leads")
      .select("id")
      .in("id", ids);

    if (fetchError) {
      logger.error("API/leads", "[API /leads DELETE fetch]", fetchError);
      return NextResponse.json({ error: "No se pudieron validar los leads." }, { status: 400 });
    }

    const existingIds = (existingLeads || []).map((lead) => lead.id);
    if (existingIds.length === 0) {
      return NextResponse.json({ error: "No se encontraron leads para eliminar." }, { status: 404 });
    }

    await supabase.from("lead_tasks").delete().in("lead_id", existingIds);
    await supabase.from("lead_activities").delete().in("lead_id", existingIds);

    const { error } = await supabase
      .from("leads")
      .delete()
      .in("id", existingIds);

    if (error) {
      logger.error("API/leads", "[API /leads DELETE]", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabase.from("audit_logs").insert({
      actor_profile_id: profile.id,
      action: "lead.delete",
      entity_type: "lead",
      entity_id: existingIds.length === 1 ? existingIds[0] : null,
      metadata: { ids: existingIds, count: existingIds.length },
    });

    return NextResponse.json({ success: true, deletedIds: existingIds });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/leads", "[API /leads DELETE]", err);
    return NextResponse.json({ error: `Error al eliminar leads: ${message}` }, { status: 500 });
  }
}
