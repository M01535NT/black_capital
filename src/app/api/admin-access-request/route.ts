import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOperationalEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { CONTACT_CONFIG } from "@/lib/contact-config";

const ACCESS_REQUEST_RATE = {
  limit: 5,
  windowMs: 3 * 60 * 1000,
};

const SPECIALTY_OPTIONS = ["Residencial", "Comercial", "Industrial"] as const;
type Specialty = (typeof SPECIALTY_OPTIONS)[number];

type AccessRequestPayload = {
  full_name: string;
  email: string;
  phone?: string;
  age?: number;
  operating_city?: string;
  years_experience?: number | null;
  current_company?: string;
  profile_photo_url?: string;
  social_instagram?: string;
  social_tiktok?: string;
  social_linkedin?: string;
  specialties?: string[];
  internal_reference?: string;
};

function trimOrEmpty(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseInteger(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = trimOrEmpty(value);
  return text === "" ? null : Number(text);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function buildNotificationBody(payload: AccessRequestPayload): string {
  const rows = [
    `<strong>Nombre:</strong> ${escapeHtml(payload.full_name)}`,
    `<strong>Correo:</strong> ${escapeHtml(payload.email)}`,
    payload.phone ? `<strong>Teléfono:</strong> ${escapeHtml(payload.phone)}` : "",
    typeof payload.age === "number" ? `<strong>Edad:</strong> ${payload.age} años` : "",
    payload.operating_city ? `<strong>Ciudad:</strong> ${escapeHtml(payload.operating_city)}` : "",
    typeof payload.years_experience === "number"
      ? `<strong>Experiencia:</strong> ${payload.years_experience} años`
      : "",
    payload.current_company ? `<strong>Empresa:</strong> ${escapeHtml(payload.current_company)}` : "",
    payload.profile_photo_url ? `<strong>Foto de perfil:</strong> ${escapeHtml(payload.profile_photo_url)}` : "",
    payload.social_instagram ? `<strong>Instagram:</strong> ${escapeHtml(payload.social_instagram)}` : "",
    payload.social_tiktok ? `<strong>TikTok:</strong> ${escapeHtml(payload.social_tiktok)}` : "",
    payload.social_linkedin ? `<strong>LinkedIn:</strong> ${escapeHtml(payload.social_linkedin)}` : "",
    payload.specialties?.length
      ? `<strong>Especialidades:</strong> ${payload.specialties.map((specialty) => escapeHtml(specialty)).join(", ")}`
      : "",
    payload.internal_reference ? `<strong>Referencia interna:</strong> ${escapeHtml(payload.internal_reference)}` : "",
  ];

  return rows.filter(Boolean).join("<br/>");
}

function buildAdminAccessRequestEmail(payload: AccessRequestPayload, siteUrl: string) {
  const details = buildNotificationBody(payload);
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #171717; line-height: 1.55; max-width: 640px">
      <h2 style="margin: 0 0 16px">Nueva solicitud de acceso al panel</h2>
      <p style="margin: 0 0 14px">Un agente del equipo solicitó acceso al panel de administración.</p>
      <div style="padding: 14px; background: #f6f6f6; border-left: 4px solid #d4af37;">
        ${details}
      </div>
      <p style="margin: 16px 0 8px">
        <a href="${siteUrl}/admin/login" style="color: #0a0a0a; background: #d4af37; padding: 10px 14px; text-decoration: none; font-weight: 700">
          Abrir panel de administración
        </a>
      </p>
    </div>
  `;
}

function formatPayload(body: unknown): { payload?: AccessRequestPayload; error?: string } {
  if (!body || typeof body !== "object") {
    return { error: "Datos inválidos." };
  }

  const source = body as Record<string, unknown>;
  const full_name = trimOrEmpty(source.full_name);
  const email = trimOrEmpty(source.email).toLowerCase();
  const phone = trimOrEmpty(source.phone);
  const operating_city = trimOrEmpty(source.operating_city);
  const current_company = trimOrEmpty(source.current_company);
  const profile_photo_url = trimOrEmpty(source.profile_photo_url);
  const social_instagram = trimOrEmpty(source.social_instagram);
  const social_tiktok = trimOrEmpty(source.social_tiktok);
  const social_linkedin = trimOrEmpty(source.social_linkedin);
  const internal_reference = trimOrEmpty(source.internal_reference);
  const company_honeypot = trimOrEmpty((source as { company_honeypot?: unknown }).company_honeypot);

  const age = parseInteger(source.age);
  const years_experience = parseInteger(source.years_experience);

  const specialtiesRaw = source.specialties;
  const parsedSpecialties = Array.isArray(specialtiesRaw)
    ? specialtiesRaw.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : [];
  const specialties = Array.from(new Set(parsedSpecialties));
  const normalizedSpecialties = Array.isArray(specialtiesRaw)
    ? specialties.filter((specialty): specialty is Specialty =>
      (SPECIALTY_OPTIONS as readonly string[]).includes(specialty),
    )
    : [];

  const invalidSpecialties = parsedSpecialties.some(
    (specialty) => !(SPECIALTY_OPTIONS as readonly string[]).includes(specialty),
  );

  if (specialtiesRaw !== undefined && !Array.isArray(specialtiesRaw)) return { error: "Especialidad no válida." };
  if (invalidSpecialties) return { error: "Alguna especialidad no es válida." };

  const missingRequired: string[] = [];
  if (!full_name || full_name.length < 2) return { error: "Nombre completo inválido." };
  if (email.length < 5 || !/^\S+@\S+\.\S+$/.test(email)) return { error: "Correo electrónico inválido." };
  if (!phone) missingRequired.push("teléfono");
  if (!/^[+0-9()\-\s]{8,}$/.test(phone || "")) return { error: "Teléfono inválido." };
  if (!operating_city) missingRequired.push("ciudad o zona de operación");
  if (age === null) missingRequired.push("edad");
  if (missingRequired.length > 0) return { error: `Faltan campos obligatorios: ${missingRequired.join(", ")}.` };
  if (age !== null && (Number.isNaN(age) || !Number.isInteger(age))) return { error: "La edad debe ser un número entero." };
  if (age !== null && (age < 18 || age > 99)) return { error: "La edad debe estar entre 18 y 99 años." };
  if (years_experience === null) {
    // optional
  } else if (Number.isNaN(years_experience)) return { error: "Los años de experiencia deben ser un número." };
  else if (!Number.isInteger(years_experience)) return { error: "Años de experiencia debe ser un número entero." };
  else if (years_experience < 0 || years_experience > 80) return { error: "Años de experiencia fuera de rango." };
  if (company_honeypot) return { error: "Solicitud rechazada." };
  if (profile_photo_url && !isValidUrl(profile_photo_url)) return { error: "La URL de la foto de perfil no es válida." };
  if (social_instagram && !isValidUrl(social_instagram)) return { error: "La URL de Instagram no es válida." };
  if (social_tiktok && !isValidUrl(social_tiktok)) return { error: "La URL de TikTok no es válida." };
  if (social_linkedin && !isValidUrl(social_linkedin)) return { error: "La URL de LinkedIn no es válida." };
  return {
    payload: {
      full_name,
      email,
      ...(phone ? { phone } : {}),
      ...(age === null ? {} : { age }),
      ...(operating_city ? { operating_city } : {}),
      ...(years_experience === null ? {} : { years_experience }),
      ...(current_company ? { current_company } : {}),
      ...(profile_photo_url ? { profile_photo_url } : {}),
      ...(social_instagram ? { social_instagram } : {}),
      ...(social_tiktok ? { social_tiktok } : {}),
      ...(social_linkedin ? { social_linkedin } : {}),
      ...(normalizedSpecialties.length > 0 ? { specialties: normalizedSpecialties } : {}),
      ...(internal_reference ? { internal_reference } : {}),
    },
  };
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rate = checkRateLimit(`admin-access-request:${ip}`, ACCESS_REQUEST_RATE);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta en unos minutos." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  try {
    const raw = await req.json();
    const parsed = formatPayload(raw);

    if (!parsed.payload) {
      return NextResponse.json({ error: parsed.error || "Datos inválidos." }, { status: 400 });
    }

    const payload = parsed.payload;
    const supabase = createAdminClient();

    const { data: accessRequest, error: requestError } = await supabase
      .from("admin_access_requests")
      .insert({
        full_name: payload.full_name,
        email: payload.email,
        phone: payload.phone || null,
        age: payload.age ?? null,
        operating_city: payload.operating_city || null,
        years_experience: payload.years_experience ?? null,
        current_company: payload.current_company || null,
        profile_photo_url: payload.profile_photo_url || null,
        social_instagram: payload.social_instagram || null,
        social_tiktok: payload.social_tiktok || null,
        social_linkedin: payload.social_linkedin || null,
        specialties: payload.specialties || null,
        internal_reference: payload.internal_reference || null,
        metadata: payload,
      })
      .select("id")
      .single();

    if (requestError || !accessRequest) {
      logger.error("API/admin-access-request", "[Access request insert error]", requestError);
      return NextResponse.json({ error: "No se pudo guardar la solicitud en este momento." }, { status: 500 });
    }

    const { data: admins, error: adminError } = await supabase
      .from("admin_profiles")
      .select("id,email")
      .eq("role", "admin")
      .eq("is_active", true);

    if (adminError) {
      logger.error("API/admin-access-request", "[Admin fetch error]", adminError);
    }

    const activeAdmins = (admins || []).filter((admin) => typeof admin?.id === "string" && typeof admin?.email === "string" && admin.email);
    const validEmails = Array.from(new Set(activeAdmins.map((admin) => (admin.email as string).toLowerCase())));

    const notificationRows = (activeAdmins.length > 0
      ? activeAdmins.map((admin) => ({
          recipient_profile_id: admin.id,
          type: "admin_access_request",
          title: "Solicitud de acceso al panel",
          body: buildNotificationBody(payload),
          href: `/admin/users?access_request_id=${accessRequest.id}`,
        }))
      : [{
          recipient_profile_id: null,
          type: "admin_access_request",
          title: "Solicitud de acceso al panel",
          body: buildNotificationBody(payload),
          href: `/admin/users?access_request_id=${accessRequest.id}`,
        }])
      .map((row) => ({
        ...row,
        recipient_profile_id: row.recipient_profile_id || null,
      }));

    const { error: notificationError } = await supabase.from("notifications").insert(notificationRows);

    if (notificationError) {
      logger.error("API/admin-access-request", "[Notification insert error]", notificationError);
    }

    const recipients = validEmails.length > 0 ? validEmails : [CONTACT_CONFIG.email];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";
    const subject = `Solicitud de acceso: ${payload.full_name}`;
    const html = buildAdminAccessRequestEmail(payload, siteUrl.replace(/\/$/, ""));

    const emailDispatches = await Promise.allSettled(
      recipients.map((to) => sendOperationalEmail({ to, subject, html })),
    );

    const emailFailed = emailDispatches.some((entry) => {
      if (entry.status === "rejected") return true;
      return Boolean(entry.value?.error) && entry.value?.skipped === false;
    });

    const warnings: string[] = [];
    if (notificationError) warnings.push("No se pudo crear notificación en el panel en este momento.");
    if (emailFailed) warnings.push("No se pudo enviar correo de aviso en este momento.");

    if (notificationError && emailFailed) {
      return NextResponse.json(
        { error: "No se pudo completar la notificación completa en este momento." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      warnings: warnings.length > 0 ? warnings : undefined,
    });
  } catch (error) {
    logger.error("API/admin-access-request", "Error procesando solicitud", error);
    return NextResponse.json({ error: "Error al procesar la solicitud." }, { status: 500 });
  }
}
