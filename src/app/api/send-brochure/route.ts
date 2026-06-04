import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

// TODO: Implement rate limiting (max 5 requests/min per IP)
// Consider using Vercel's @vercel/edge or upstash/ratelimit
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, propertyId, name, pdfUrl, docType } = body;

        if (!email || !propertyId) {
            return NextResponse.json(
                { error: "Faltan parametros requeridos" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Fetch property info
        const { data: property, error: propertyError } = await supabase
            .from("properties")
            .select("title")
            .eq("id", propertyId)
            .single();

        if (propertyError || !property) {
            return NextResponse.json(
                { error: "Propiedad no encontrada" },
                { status: 404 }
            );
        }

        const docLabel = docType === "escrituras" ? "Escrituras"
            : docType === "avaluo" ? "Avaluo"
            : docType === "planos" ? "Planos"
            : "Brochure Ejecutivo";

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            logger.info("API/brochure", "[Resend] API key not configured — skipping email");
            return NextResponse.json({ success: true, message: "Documento listo (email no configurado)" });
        }

        // Build email HTML
        const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0A0A0A;color:#FAFAFA;font-family:Inter,-apple-system,sans-serif;padding:48px 24px;margin:0">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto">
        <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #222">
                <h1 style="color:#D4AF37;font-size:24px;margin:0;font-weight:700;letter-spacing:-0.02em">
                    BLACK <span style="color:#D4AF37">CORP</span>
                </h1>
                <p style="color:#666;font-size:12px;margin:4px 0 0;text-transform:uppercase;letter-spacing:0.2em">
                    Boutique Inmobiliaria
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding:32px 0">
                <p style="font-size:16px;margin:0 0 8px;color:#FAFAFA">
                    Hola <strong>${escapeHtml(name || "Inversionista")}</strong>,
                </p>
                <p style="font-size:14px;color:#999;line-height:1.6;margin:0 0 24px">
                    Gracias por tu interes en <strong style="color:#D4AF37">${escapeHtml(property.title)}</strong>.
                    Adjunto encontraras el documento <strong>${docLabel}</strong> con informacion detallada.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #222">
                    <tr>
                        <td style="padding:24px">
                            <p style="font-size:14px;color:#ccc;margin:0 0 4px">Documento solicitado:</p>
                            <p style="font-size:18px;color:#D4AF37;font-weight:600;margin:0">${docLabel}</p>
                            <p style="font-size:13px;color:#666;margin:8px 0 0">Propiedad: ${escapeHtml(property.title)}</p>
                        </td>
                    </tr>
                </table>

                ${pdfUrl ? `
                <p style="font-size:13px;color:#888;margin:24px 0 0;line-height:1.5">
                    Si no puedes descargar el adjunto, accede al documento aqui:<br>
                    <a href="${escapeHtml(pdfUrl)}" style="color:#D4AF37;text-decoration:underline">Descargar ${docLabel}</a>
                </p>` : ""}
            </td>
        </tr>
        <tr>
            <td style="padding-top:32px;border-top:1px solid #222">
                <p style="font-size:11px;color:#555;margin:0 0 4px">
                    Black Corporativo — Boutique Inmobiliaria de Alto Nivel
                </p>
                <p style="font-size:11px;color:#444;margin:0">
                    Este correo fue enviado porque solicitaste informacion en nuestro portal.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;

        // Build Resend payload
        const resendPayload: Record<string, unknown> = {
            from: "Black Corporativo <docs@blackcorporativo.com>",
            to: [email],
            subject: `${docLabel}: ${property.title}`,
            html,
        };

        // Attach PDF — only if URL is from our Supabase storage (SSRF prevention)
        if (pdfUrl) {
            const allowedDomains = [
                "supabase.co",
                "tewfdfmicifpdecxcpfy.supabase.co",
            ];
            let pdfHost: string | null = null;
            try {
                pdfHost = new URL(pdfUrl).hostname;
            } catch {
                logger.warn("API/brochure", "[Resend] Invalid pdfUrl, skipping attachment");
            }

            const isAllowed = pdfHost && allowedDomains.some(d =>
                pdfHost === d || pdfHost.endsWith("." + d)
            );

            if (!isAllowed) {
                logger.warn("API/brochure", "[Resend] pdfUrl domain not allowed:", pdfHost);
            } else {
                try {
                    const pdfResponse = await fetch(pdfUrl, { signal: AbortSignal.timeout(15000) });
                    if (pdfResponse.ok) {
                        const contentLength = Number(pdfResponse.headers.get("content-length") || "0");
                        // Reject files larger than 10 MB
                        if (contentLength > 10 * 1024 * 1024) {
                            logger.warn("API/brochure", "[Resend] PDF too large, skipping attachment");
                        } else {
                            const pdfBuffer = await pdfResponse.arrayBuffer();
                            // Double-check actual size
                            if (pdfBuffer.byteLength <= 10 * 1024 * 1024) {
                                const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");
                                resendPayload.attachments = [{
                                    filename: `${docLabel.toLowerCase().replace(/\s+/g, "-")}-${property.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")}.pdf`,
                                    content: pdfBase64,
                                }];
                            }
                        }
                    }
                } catch (attachErr) {
                    logger.warn("API/brochure", "[Resend] Could not attach PDF, sending email with link only:", attachErr);
                }
            }
        }

        // Verify Resend API response
        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resendPayload),
        });

        if (!resendResponse.ok) {
            const resendBody = await resendResponse.text();
            logger.error("API/brochure", "[Resend] API error:", resendResponse.status, resendBody);
            return NextResponse.json(
                { error: "No se pudo enviar el documento. Intenta nuevamente." },
                { status: 502 }
            );
        }

        return NextResponse.json({ success: true, message: "Documento enviado correctamente" });

    } catch (error) {
        logger.error("API/brochure", "[send-brochure] Error:", error);
        return NextResponse.json(
            { error: "Error al procesar la solicitud" },
            { status: 500 }
        );
    }
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
