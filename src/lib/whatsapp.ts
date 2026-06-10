import { logger } from "@/lib/logger";

type SendWhatsappVerificationCodeInput = {
    to: string;
    code: string;
    propertyTitle: string;
};

export async function sendWhatsappVerificationCode({
    to,
    code,
    propertyTitle,
}: SendWhatsappVerificationCodeInput): Promise<{ sent: boolean; devCode?: string; error?: string }> {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const templateName = process.env.WHATSAPP_VERIFICATION_TEMPLATE_NAME;
    const languageCode = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "es_MX";
    const apiVersion = process.env.WHATSAPP_GRAPH_API_VERSION || "v21.0";
    const isProduction = process.env.NODE_ENV === "production";

    if (!token || !phoneNumberId) {
        if (isProduction) {
            return { sent: false, error: "WhatsApp no está configurado." };
        }
        return { sent: true, devCode: code };
    }

    if (isProduction && !templateName) {
        return { sent: false, error: "Falta configurar la plantilla de WhatsApp." };
    }

    const payload = templateName
        ? {
            messaging_product: "whatsapp",
            to,
            type: "template",
            template: {
                name: templateName,
                language: { code: languageCode },
                components: [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: code },
                            { type: "text", text: propertyTitle.slice(0, 60) },
                        ],
                    },
                ],
            },
        }
        : {
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: {
                preview_url: false,
                body: `Tu código Black Capital es ${code}. Úsalo para solicitar documentos de ${propertyTitle}.`,
            },
        };

    try {
        const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const body = await response.text();
            logger.error("WhatsApp", "[verification] API error:", response.status, body);
            return { sent: false, error: "No se pudo enviar el código por WhatsApp." };
        }

        return { sent: true };
    } catch (error) {
        logger.error("WhatsApp", "[verification] Unexpected error:", error);
        return { sent: false, error: "No se pudo contactar WhatsApp." };
    }
}
