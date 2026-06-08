import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/validations/lead";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const PUBLIC_LEAD_LIMIT = {
  limit: 5,
  windowMs: 60 * 1000,
};

async function parseBody(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return req.json();
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await req.formData();
    return Object.fromEntries(formData.entries());
  }

  return {};
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rate = checkRateLimit(`public-leads:${ip}`, PUBLIC_LEAD_LIMIT);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un momento." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfter) },
      },
    );
  }

  try {
    const raw = await parseBody(req);

    if (typeof raw.company_honeypot === "string" && raw.company_honeypot.trim()) {
      return NextResponse.json({ ok: true });
    }

    const parsed = leadSchema.safeParse({
      full_name: raw.full_name || raw.name || "Lead web",
      email: raw.email,
      phone: raw.phone || "",
      privacy_accepted:
        raw.privacy_accepted === true ||
        raw.privacy_accepted === "true" ||
        raw.privacy_accepted === "on",
      source: raw.source || "organic",
      property_id: raw.property_id || null,
      notes: raw.notes || null,
      status: raw.status || "new",
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const supabase = createAdminClient();
    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        full_name: data.full_name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone ? data.phone.replace(/[^0-9+]/g, "") : null,
        source: data.source,
        status: data.status,
        notes: data.notes,
        property_id: data.property_id,
        privacy_accepted: data.privacy_accepted,
        downloaded_at: raw.downloaded_at || null,
      })
      .select("id")
      .single();

    if (error) {
      logger.error("API/public-leads", "[Public lead insert]", error);
      return NextResponse.json(
        { error: "No se pudo registrar la solicitud." },
        { status: 500 },
      );
    }

    const { data: admins } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("role", "admin")
      .eq("is_active", true);

    if (admins && admins.length > 0) {
      await supabase.from("notifications").insert(
        admins.map((admin) => ({
          recipient_profile_id: admin.id,
          type: "lead",
          title: "Nuevo lead recibido",
          body: `${data.full_name} envió una solicitud desde ${data.source}.`,
          href: `/admin/leads/${lead?.id}`,
        })),
      );
    }

    return NextResponse.json({ success: true, leadId: lead?.id }, { status: 201 });
  } catch (error) {
    logger.error("API/public-leads", "[Public lead unexpected error]", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
