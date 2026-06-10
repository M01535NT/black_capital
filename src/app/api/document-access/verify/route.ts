import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import {
    DOCUMENT_ACCESS_COOKIE,
    DOCUMENT_ACCESS_TTL_SECONDS,
    NDA_VERSION,
    PRIVACY_NOTICE_VERSION,
    createSessionToken,
    hashSecret,
    isoFromNow,
} from "@/lib/document-access";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const verifySchema = z.object({
    requestId: z.string().uuid(),
    code: z.string().regex(/^\d{6}$/, "Código inválido"),
});

const RATE = { limit: 8, windowMs: 60 * 1000 };

export async function POST(req: NextRequest) {
    const ip = getClientIp(req.headers);
    const rate = checkRateLimit(`document-access-verify:${ip}`, RATE);

    if (!rate.allowed) {
        return NextResponse.json(
            { error: "Demasiados intentos. Intenta de nuevo en un momento." },
            { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
        );
    }

    try {
        const parsed = verifySchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const { requestId, code } = parsed.data;
        const supabase = createAdminClient();
        const { data: accessRequest, error } = await supabase
            .from("document_access_requests")
            .select("id, lead_id, property_id, document_label, status, verification_code_hash, verification_expires_at")
            .eq("id", requestId)
            .single();

        if (error || !accessRequest) {
            return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
        }

        if (accessRequest.status !== "pending_verification") {
            return NextResponse.json({ error: "Esta solicitud ya fue procesada." }, { status: 400 });
        }

        if (!accessRequest.verification_expires_at || new Date(accessRequest.verification_expires_at).getTime() < Date.now()) {
            await supabase.from("document_access_requests").update({ status: "expired" }).eq("id", requestId);
            return NextResponse.json({ error: "El código venció. Solicita uno nuevo." }, { status: 400 });
        }

        if (accessRequest.verification_code_hash !== hashSecret(code)) {
            return NextResponse.json({ error: "Código incorrecto." }, { status: 400 });
        }

        const now = new Date().toISOString();
        const sessionToken = createSessionToken();
        const sessionExpiresAt = isoFromNow(DOCUMENT_ACCESS_TTL_SECONDS * 1000);

        const [{ error: requestUpdateError }, { error: leadUpdateError }] = await Promise.all([
            supabase
                .from("document_access_requests")
                .update({
                    status: "verified",
                    verified_at: now,
                    verification_code_hash: null,
                })
                .eq("id", requestId),
            supabase
                .from("leads")
                .update({
                    whatsapp_verified_at: now,
                    document_access_session_token_hash: hashSecret(sessionToken),
                    document_access_expires_at: sessionExpiresAt,
                    nda_version: NDA_VERSION,
                    privacy_notice_version: PRIVACY_NOTICE_VERSION,
                })
                .eq("id", accessRequest.lead_id),
        ]);

        if (requestUpdateError || leadUpdateError) {
            throw requestUpdateError || leadUpdateError;
        }

        await supabase.from("lead_activities").insert({
            lead_id: accessRequest.lead_id,
            type: "system",
            title: "WhatsApp validado",
            body: `Validó WhatsApp para acceder a ${accessRequest.document_label}.`,
            metadata: { request_id: requestId, property_id: accessRequest.property_id },
        });

        const response = NextResponse.json({
            success: true,
            requestId,
            downloadUrl: `/api/document-access/download?requestId=${requestId}`,
            sessionExpiresAt,
        });

        response.cookies.set(DOCUMENT_ACCESS_COOKIE, sessionToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: DOCUMENT_ACCESS_TTL_SECONDS,
        });

        return response;
    } catch (error) {
        logger.error("API/document-access/verify", "[Document access verify]", error);
        return NextResponse.json({ error: "No se pudo validar el código." }, { status: 500 });
    }
}
