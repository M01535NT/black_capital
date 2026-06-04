/**
 * Input sanitization utilities for API routes.
 * Prevents XSS and normalizes user input.
 */

/** Trim and normalize whitespace */
export function sanitizeString(input: unknown): string {
    if (typeof input !== "string") return "";
    return input.trim().replace(/\s+/g, " ");
}

/** Sanitize email: lowercase + trim */
export function sanitizeEmail(email: unknown): string | null {
    if (typeof email !== "string") return null;
    const cleaned = email.trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ? cleaned : null;
}

/** Sanitize phone: keep only digits, +, spaces, dashes */
export function sanitizePhone(phone: unknown): string | null {
    if (typeof phone !== "string") return null;
    const cleaned = phone.trim().replace(/[^\d\s\-\+]/g, "");
    return cleaned.length >= 10 ? cleaned : null;
}

/** Validate UUID format */
export function isValidUUID(id: unknown): boolean {
    if (typeof id !== "string") return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
