/**
 * Centralized contact configuration.
 * All contact data across the app should be sourced from this module.
 * Replace placeholder values with real data before going to production.
 */

export const CONTACT_CONFIG = {
    /** Display phone number (human-readable) */
    phone: "+52 (664) 000 0000",
    /** Raw phone number for WhatsApp links (no +, spaces, or parentheses) */
    phoneRaw: "526640000000",
    email: "contacto@blackcorporativo.com",
    address: "Tijuana, Baja California, México",
    /** Multi-line address for card/detail displays */
    addressLines: ["Tijuana, Baja California"],
    social: {
        linkedin: "#",
        instagram: "#",
        x: "#",
    },
    /** Business hours (display lines) */
    hours: [
        "Lunes a Viernes",
        "9:00 AM — 6:00 PM (PT)",
        "Sábados con cita previa",
    ],
} as const;

export type ContactConfig = typeof CONTACT_CONFIG;
