/**
 * Centralized contact configuration.
 * All contact data across the app should be sourced from this module.
 * Replace placeholder values with real data before going to production.
 */

export const CONTACT_CONFIG = {
    /** Display phone number (human-readable) */
    phone: "+52 (664) 104 9491",
    /** Raw phone number for WhatsApp links (no +, spaces, or parentheses) */
    phoneRaw: "526641049491",
    email: "contacto@blackmx.vercel.app",
    address: "Tijuana, Baja California, México",
    /** Multi-line address for card/detail displays */
    addressLines: ["Tijuana, Baja California"],
    social: {
        linkedin: "https://linkedin.com/company/blackcapital",
        instagram: "https://instagram.com/blackcapital",
        x: "https://x.com/blackcapital",
    },
    /** Business hours (display lines) */
    hours: [
        "Lunes a Viernes",
        "9:00 AM — 6:00 PM (PT)",
        "Sábados con cita previa",
    ],
    /** Business-level facts (not stored in DB). Edit here when the company grows. */
    business: {
        // TODO(cliente): confirmar el dato real; el sitio publicaba 8 y esta config decía 12.
        yearsInBusiness: 8,
    },
} as const;

export type ContactConfig = typeof CONTACT_CONFIG;
