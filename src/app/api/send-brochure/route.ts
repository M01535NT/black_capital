import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, propertyId, name } = body;

        if (!email || !propertyId) {
            return NextResponse.json(
                { error: "Faltan parámetros requeridos" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // 1. Fetch Property info to include in email
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

        // 2. Here you would integrate with Resend API
        // Example:
        // import { Resend } from 'resend';
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({
        //     from: 'Black Corporativo <noreply@blackcorporativo.com>',
        //     to: [email],
        //     subject: `Brochure: ${property.title}`,
        //     html: `<p>Hola ${name},</p><p>Gracias por tu interés en <strong>${property.title}</strong>.</p><p><a href="[URL_FIRMED]">Descarga tu brochure aquí</a>.</p>`,
        // });

        console.log(`[Mock Resend] Enviando brochure de ${property.title} a ${email}`);

        // 3. Update lead status if necessary, or just return success
        return NextResponse.json({ success: true, message: "Brochure enviado en simulación." });

    } catch (error) {
        console.error("Error sending brochure:", error);
        return NextResponse.json(
            { error: "Ocurrió un error al procesar la solicitud." },
            { status: 500 }
        );
    }
}
