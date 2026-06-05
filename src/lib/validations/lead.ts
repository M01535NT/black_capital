import { z } from "zod";

// Comprehensive blocklist of known disposable email providers
const DISPOSABLE_EMAIL_DOMAINS = [
    "tempmail", "mailinator", "guerrillamail", "guerrillamailblock",
    "yopmail", "throwaway", "10minutemail", "10minute", "trashmail",
    "sharklasers", "grr.la", "guerrillamail.info", "getairmail",
    "dispostable", "mailnesia", "maildrop", "fakeinbox", "emailondeck",
    "temp-mail", "tempail", "getnada", "mohmal", "burnermail",
    "discard.email", "mailsac", "harakirimail", "33mail", "mailcatch",
    "mytemp.email", "tempr.email", "spamgourmet", "mailnull", "jetable",
    "crazymailing", "maildrop.cc", "inboxkitten", "spamfree24",
    "tempinbox", "mintemail", "kosmail", "tmail", "tmpmail",
];

function isDisposableEmail(email: string): boolean {
    const domain = email.toLowerCase().split("@")[1] || "";
    return DISPOSABLE_EMAIL_DOMAINS.some(
        (blocked) => domain.includes(blocked)
    );
}

export const leadSchema = z.object({
    full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string()
        .email("Debe ser un correo electrónico válido")
        .refine(
            (val) => !isDisposableEmail(val),
            { message: "Por favor, utiliza un dominio de correo corporativo o personal real (Gmail, Outlook, etc.)" }
        ),
    phone: z
        .string()
        .trim()
        .optional()
        .or(z.literal(""))
        .refine(
            (val) => !val || val.replace(/\D/g, "").length >= 10,
            { message: "El teléfono debe tener al menos 10 dígitos" }
        ),
    privacy_accepted: z.boolean().refine(val => val === true, { message: "Debes aceptar el aviso de privacidad" }),
    source: z.enum(["organic", "campaign", "referral", "other", "landing_luxury", "landing_business", "landing_industrial"]),
    property_id: z.string().uuid().optional().nullable(),
    notes: z.string().optional().nullable(),
    status: z.enum(["new", "contacted", "qualified", "lost", "won"]),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
