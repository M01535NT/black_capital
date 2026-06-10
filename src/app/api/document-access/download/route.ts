import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
    DEFAULT_DOCUMENT_BUCKET,
    DOCUMENT_ACCESS_COOKIE,
    DOCUMENT_ACCESS_SIGNED_URL_SECONDS,
    hashSecret,
    resolvePropertyDocument,
} from "@/lib/document-access";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
    try {
        const requestId = req.nextUrl.searchParams.get("requestId");
        if (!requestId) {
            return NextResponse.json({ error: "Falta la solicitud." }, { status: 400 });
        }

        const sessionToken = req.cookies.get(DOCUMENT_ACCESS_COOKIE)?.value;
        if (!sessionToken) {
            return NextResponse.json({ error: "Sesión no validada." }, { status: 403 });
        }

        const supabase = createAdminClient();
        const { data: accessRequest, error } = await supabase
            .from("document_access_requests")
            .select("id, lead_id, property_id, document_id, document_label, status")
            .eq("id", requestId)
            .single();

        if (error || !accessRequest) {
            return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
        }

        if (!["verified", "delivered"].includes(accessRequest.status)) {
            return NextResponse.json({ error: "Solicitud no validada." }, { status: 403 });
        }

        const { data: lead } = await supabase
            .from("leads")
            .select("id, document_access_session_token_hash, document_access_expires_at")
            .eq("id", accessRequest.lead_id)
            .single();

        if (
            !lead?.document_access_session_token_hash ||
            lead.document_access_session_token_hash !== hashSecret(sessionToken) ||
            !lead.document_access_expires_at ||
            new Date(lead.document_access_expires_at).getTime() < Date.now()
        ) {
            return NextResponse.json({ error: "Sesión vencida." }, { status: 403 });
        }

        const { data: property } = await supabase
            .from("properties")
            .select("id, documents, brochure_path")
            .eq("id", accessRequest.property_id)
            .single();

        if (!property) {
            return NextResponse.json({ error: "Propiedad no encontrada." }, { status: 404 });
        }

        const doc = resolvePropertyDocument(property, accessRequest.document_id);
        if (!doc) {
            return NextResponse.json({ error: "Documento no disponible." }, { status: 404 });
        }

        let url = doc.url || "";
        const signedUrlExpiresAt = new Date(Date.now() + DOCUMENT_ACCESS_SIGNED_URL_SECONDS * 1000).toISOString();

        if (!url && doc.path) {
            const { data: signed, error: signedError } = await supabase.storage
                .from(doc.bucket || DEFAULT_DOCUMENT_BUCKET)
                .createSignedUrl(doc.path, DOCUMENT_ACCESS_SIGNED_URL_SECONDS);

            if (signedError || !signed?.signedUrl) {
                return NextResponse.json({ error: "No se pudo preparar el documento." }, { status: 500 });
            }

            url = signed.signedUrl;
        }

        if (!url) {
            return NextResponse.json({ error: "Documento sin archivo asociado." }, { status: 404 });
        }

        await Promise.all([
            supabase
                .from("document_access_requests")
                .update({
                    status: "delivered",
                    delivered_at: new Date().toISOString(),
                    signed_url_expires_at: signedUrlExpiresAt,
                })
                .eq("id", requestId),
            supabase
                .from("leads")
                .update({ downloaded_at: new Date().toISOString() })
                .eq("id", accessRequest.lead_id),
            supabase.from("lead_activities").insert({
                lead_id: accessRequest.lead_id,
                type: "system",
                title: "Documento abierto",
                body: `Abrió ${accessRequest.document_label}.`,
                metadata: { request_id: requestId, property_id: accessRequest.property_id, document_id: accessRequest.document_id },
            }),
        ]);

        return NextResponse.redirect(url);
    } catch (error) {
        logger.error("API/document-access/download", "[Document access download]", error);
        return NextResponse.json({ error: "No se pudo abrir el documento." }, { status: 500 });
    }
}
