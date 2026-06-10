import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import {
    DOCUMENT_ACCESS_CODE_TTL_MS,
    DOCUMENT_ACCESS_COOKIE,
    NDA_VERSION,
    PRIVACY_NOTICE_VERSION,
    createVerificationCode,
    hashSecret,
    isValidWhatsappPhone,
    isoFromNow,
    normalizeWhatsappPhone,
    placeholderEmailForWhatsapp,
    resolvePropertyDocument,
} from "@/lib/document-access";
import { sendWhatsappVerificationCode } from "@/lib/whatsapp";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const requestSchema = z.object({
    propertyId: z.string().uuid(),
    documentId: z.string().min(1),
    fullName: z.string().min(2).optional(),
    phone: z.string().min(8).optional(),
    email: z.string().email().optional().or(z.literal("")),
    acceptedNda: z.boolean().optional(),
    acceptedPrivacy: z.boolean().optional(),
});

const RATE = { limit: 8, windowMs: 60 * 1000 };

async function getPropertyOrError(supabase: ReturnType<typeof createAdminClient>, propertyId: string) {
    const { data: property, error } = await supabase
        .from("properties")
        .select("id, title, status, documents, brochure_path")
        .eq("id", propertyId)
        .eq("status", "Available")
        .single();

    if (error || !property) return null;
    return property;
}

async function createDocumentRequest({
    supabase,
    leadId,
    propertyId,
    doc,
    whatsapp,
    status,
    codeHash,
    verifiedAt,
    ip,
    userAgent,
}: {
    supabase: ReturnType<typeof createAdminClient>;
    leadId: string;
    propertyId: string;
    doc: { id: string; label: string; type: string };
    whatsapp: string;
    status: "pending_verification" | "verified";
    codeHash?: string;
    verifiedAt?: string;
    ip: string;
    userAgent: string;
}) {
    const { data, error } = await supabase
        .from("document_access_requests")
        .insert({
            lead_id: leadId,
            property_id: propertyId,
            document_id: doc.id,
            document_label: doc.label,
            document_type: doc.type,
            status,
            whatsapp_normalized: whatsapp,
            verification_code_hash: codeHash || null,
            verification_expires_at: codeHash ? isoFromNow(DOCUMENT_ACCESS_CODE_TTL_MS) : null,
            verified_at: verifiedAt || null,
            accepted_nda: true,
            accepted_privacy: true,
            nda_version: NDA_VERSION,
            privacy_notice_version: PRIVACY_NOTICE_VERSION,
            ip,
            user_agent: userAgent,
        })
        .select("id")
        .single();

    if (error) throw error;
    return data;
}

async function insertActivity({
    supabase,
    leadId,
    title,
    body,
    metadata,
}: {
    supabase: ReturnType<typeof createAdminClient>;
    leadId: string;
    title: string;
    body: string;
    metadata: Record<string, unknown>;
}) {
    await supabase.from("lead_activities").insert({
        lead_id: leadId,
        type: "system",
        title,
        body,
        metadata,
    });
}

export async function POST(req: NextRequest) {
    const ip = getClientIp(req.headers);
    const rate = checkRateLimit(`document-access-request:${ip}`, RATE);

    if (!rate.allowed) {
        return NextResponse.json(
            { error: "Demasiadas solicitudes. Intenta de nuevo en un momento." },
            { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
        );
    }

    try {
        const raw = await req.json();
        const parsed = requestSchema.safeParse(raw);

        if (!parsed.success) {
            return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const data = parsed.data;
        const supabase = createAdminClient();
        const property = await getPropertyOrError(supabase, data.propertyId);

        if (!property) {
            return NextResponse.json({ error: "Propiedad no disponible." }, { status: 404 });
        }

        const doc = resolvePropertyDocument(property, data.documentId);
        if (!doc) {
            return NextResponse.json({ error: "Documento no disponible." }, { status: 404 });
        }

        const sessionToken = req.cookies.get(DOCUMENT_ACCESS_COOKIE)?.value;
        const sessionHash = sessionToken ? hashSecret(sessionToken) : null;
        const userAgent = req.headers.get("user-agent") || "";

        if (sessionHash && !data.phone && !data.fullName) {
            const { data: sessionLead } = await supabase
                .from("leads")
                .select("id, whatsapp_normalized, document_access_expires_at, whatsapp_verified_at, nda_version, privacy_notice_version")
                .eq("document_access_session_token_hash", sessionHash)
                .gt("document_access_expires_at", new Date().toISOString())
                .maybeSingle();

            if (
                sessionLead?.id &&
                sessionLead.whatsapp_normalized &&
                sessionLead.whatsapp_verified_at &&
                sessionLead.nda_version === NDA_VERSION &&
                sessionLead.privacy_notice_version === PRIVACY_NOTICE_VERSION
            ) {
                const requestRow = await createDocumentRequest({
                    supabase,
                    leadId: sessionLead.id,
                    propertyId: property.id,
                    doc,
                    whatsapp: sessionLead.whatsapp_normalized,
                    status: "verified",
                    verifiedAt: new Date().toISOString(),
                    ip,
                    userAgent,
                });

                await insertActivity({
                    supabase,
                    leadId: sessionLead.id,
                    title: "Documento solicitado",
                    body: `${doc.label} solicitado para ${property.title}.`,
                    metadata: { property_id: property.id, document_id: doc.id, document_label: doc.label, request_id: requestRow.id },
                });

                return NextResponse.json({
                    requiresProfile: false,
                    requiresVerification: false,
                    requestId: requestRow.id,
                    downloadUrl: `/api/document-access/download?requestId=${requestRow.id}`,
                });
            }
        }

        if (!data.fullName || !data.phone || !data.acceptedNda || !data.acceptedPrivacy) {
            return NextResponse.json({ requiresProfile: true });
        }

        const whatsapp = normalizeWhatsappPhone(data.phone);
        if (!isValidWhatsappPhone(whatsapp)) {
            return NextResponse.json({ error: "Ingresa un WhatsApp válido con lada." }, { status: 400 });
        }

        const cleanEmail = data.email?.trim().toLowerCase() || placeholderEmailForWhatsapp(whatsapp);
        const legalNow = new Date().toISOString();

        const { data: existingLead } = await supabase
            .from("leads")
            .select("id")
            .eq("whatsapp_normalized", whatsapp)
            .maybeSingle();

        let leadId = existingLead?.id as string | undefined;

        if (leadId) {
            const { error } = await supabase
                .from("leads")
                .update({
                    full_name: data.fullName.trim(),
                    email: cleanEmail,
                    phone: `+${whatsapp}`,
                    source: "brochure",
                    property_id: property.id,
                    privacy_accepted: true,
                    nda_accepted_at: legalNow,
                    nda_version: NDA_VERSION,
                    privacy_notice_version: PRIVACY_NOTICE_VERSION,
                    legal_acceptance_ip: ip,
                    legal_acceptance_user_agent: userAgent,
                })
                .eq("id", leadId);
            if (error) throw error;
        } else {
            const { data: createdLead, error } = await supabase
                .from("leads")
                .insert({
                    full_name: data.fullName.trim(),
                    email: cleanEmail,
                    phone: `+${whatsapp}`,
                    whatsapp_normalized: whatsapp,
                    source: "brochure",
                    status: "new",
                    property_id: property.id,
                    privacy_accepted: true,
                    nda_accepted_at: legalNow,
                    nda_version: NDA_VERSION,
                    privacy_notice_version: PRIVACY_NOTICE_VERSION,
                    legal_acceptance_ip: ip,
                    legal_acceptance_user_agent: userAgent,
                })
                .select("id")
                .single();
            if (error) throw error;
            leadId = createdLead.id;
        }

        if (!leadId) {
            throw new Error("No se pudo crear la ficha del prospecto.");
        }

        const code = createVerificationCode();
        const requestRow = await createDocumentRequest({
            supabase,
            leadId,
            propertyId: property.id,
            doc,
            whatsapp,
            status: "pending_verification",
            codeHash: hashSecret(code),
            ip,
            userAgent,
        });

        await insertActivity({
            supabase,
            leadId,
            title: "Solicitud de documentos",
            body: `${doc.label} solicitado para ${property.title}. Pendiente de validar WhatsApp.`,
            metadata: { property_id: property.id, document_id: doc.id, document_label: doc.label, request_id: requestRow.id },
        });

        const whatsappResult = await sendWhatsappVerificationCode({
            to: whatsapp,
            code,
            propertyTitle: property.title,
        });

        if (!whatsappResult.sent) {
            return NextResponse.json({ error: whatsappResult.error || "No se pudo enviar el código." }, { status: 502 });
        }

        return NextResponse.json({
            requiresProfile: false,
            requiresVerification: true,
            requestId: requestRow.id,
            devCode: whatsappResult.devCode,
        });
    } catch (error) {
        logger.error("API/document-access/request", "[Document access request]", error);
        return NextResponse.json({ error: "No se pudo iniciar la solicitud." }, { status: 500 });
    }
}
