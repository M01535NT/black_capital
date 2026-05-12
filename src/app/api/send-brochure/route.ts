import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, propertyId, name, pdfUrl } = body;

        if (!email || !propertyId) {
            return NextResponse.json(
                { error: "Faltan parámetros requeridos" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // 1. Fetch Property info
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

        // 2. Send email via Resend API (direct fetch, no npm dependency)
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            const html = `<body style="background:#0A0A0A;color:#FAFAFA;font-family:Inter,sans-serif;padding:40px">
                <h2 style="color:#C4956A">Black Corporativo</h2>
                <p>Hola <strong>${name || "Inversionista"}</strong>,</p>
                <p>Gracias por tu interés en <strong>${property.title}</strong>.</p>
                <p>Adjunto encontrarás el brochure con información detallada de la propiedad.</p>
                ${pdfUrl ? `<p><a href="${pdfUrl}" style="color:#C4956A">Descargar brochure aquí</a></p>` : ""}
                <hr style="border-color:#333;margin:24px 0" />
                <p style="color:#888;font-size:12px">Black Corporativo — Boutique Inmobiliaria de Alto Nivel</p>
            </body>`;

            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${resendApiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "Black Corporativo <noreply@blackcorporativo.com>",
                    to: [email],
                    subject: `Brochure: ${property.title}`,
                    html,
                }),
            });
        } else {
            console.log(`[Resend] API key not configured — skipping email to ${email}`);
        }

        return NextResponse.json({ success: true, message: "Brochure enviado correctamente." });

    } catch (error) {
        console.error("Error sending brochure:", error);
        return NextResponse.json(
            { error: "Ocurrió un error al procesar la solicitud." },
            { status: 500 }
        );
    }
}
