import { createHash, randomBytes, randomInt } from "crypto";

export const DOCUMENT_ACCESS_COOKIE = "bc_document_access";
export const DOCUMENT_ACCESS_TTL_SECONDS = 60 * 24 * 60 * 60;
export const DOCUMENT_ACCESS_SIGNED_URL_SECONDS = 10 * 60;
export const DOCUMENT_ACCESS_CODE_TTL_MS = 10 * 60 * 1000;
export const NDA_VERSION = "nda-v1";
export const PRIVACY_NOTICE_VERSION = "aviso-privacidad-v1";
export const DEFAULT_DOCUMENT_BUCKET = "secure-brochures";

type JsonRecord = Record<string, unknown>;

export type StoredPropertyDocument = {
    id: string;
    label: string;
    type: string;
    bucket?: string;
    path?: string;
    url?: string;
};

export type VisiblePropertyDocument = Pick<StoredPropertyDocument, "id" | "label" | "type">;

export function hashSecret(value: string) {
    const salt = process.env.DOCUMENT_ACCESS_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "black-capital-document-access";
    return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

export function createVerificationCode() {
    return String(randomInt(100000, 999999));
}

export function createSessionToken() {
    return randomBytes(32).toString("hex");
}

export function isoFromNow(ms: number) {
    return new Date(Date.now() + ms).toISOString();
}

export function normalizeWhatsappPhone(input: string) {
    const digits = input.replace(/\D/g, "");
    if (digits.length === 10) return `52${digits}`;
    if (digits.length === 11 && digits.startsWith("1")) return `52${digits.slice(1)}`;
    return digits;
}

export function isValidWhatsappPhone(phone: string) {
    return /^\d{11,15}$/.test(phone);
}

export function placeholderEmailForWhatsapp(phone: string) {
    return `whatsapp-${phone}@blackcapital.local`;
}

export function isPlaceholderEmail(email?: string | null) {
    return !!email && email.endsWith("@blackcapital.local");
}

export function documentTypeFromLabel(label: string) {
    const clean = label.toLowerCase();
    if (clean.includes("brochure")) return "Brochure";
    if (clean.includes("ficha")) return "Ficha técnica";
    if (clean.includes("predial")) return "Predial";
    if (clean.includes("dictamen")) return "Dictamen";
    if (clean.includes("plano")) return "Plano";
    if (clean.includes("escritura")) return "Escritura";
    if (clean.includes("avaluo") || clean.includes("avalúo")) return "Avalúo";
    return "Documento";
}

function stringFrom(value: unknown) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isRecord(value: unknown): value is JsonRecord {
    return !!value && typeof value === "object" && !Array.isArray(value);
}

export function getPropertyDocuments(property: {
    documents?: unknown;
    brochure_path?: string | null;
}): StoredPropertyDocument[] {
    const docs: StoredPropertyDocument[] = [];

    if (Array.isArray(property.documents)) {
        property.documents.forEach((entry, index) => {
            if (!isRecord(entry)) return;

            const label = stringFrom(entry.label) || `Documento ${index + 1}`;
            const path = stringFrom(entry.path) || stringFrom(entry.storage_path);
            const bucket = stringFrom(entry.bucket) || (path ? DEFAULT_DOCUMENT_BUCKET : undefined);
            const url = stringFrom(entry.url);

            if (!path && !url) return;

            docs.push({
                id: stringFrom(entry.id) || `documents:${index}`,
                label,
                type: stringFrom(entry.type) || documentTypeFromLabel(label),
                bucket,
                path,
                url,
            });
        });
    }

    if (property.brochure_path) {
        const alreadyListed = docs.some((doc) => doc.url === property.brochure_path || doc.path === property.brochure_path);
        if (!alreadyListed) {
            const isUrl = /^https?:\/\//i.test(property.brochure_path);
            docs.push({
                id: "brochure",
                label: "Brochure Ejecutivo",
                type: "Brochure",
                bucket: isUrl ? undefined : DEFAULT_DOCUMENT_BUCKET,
                path: isUrl ? undefined : property.brochure_path,
                url: isUrl ? property.brochure_path : undefined,
            });
        }
    }

    return docs;
}

export function toVisibleDocuments(documents: StoredPropertyDocument[]): VisiblePropertyDocument[] {
    return documents.map(({ id, label, type }) => ({ id, label, type }));
}

export function resolvePropertyDocument(
    property: { documents?: unknown; brochure_path?: string | null },
    documentId: string,
) {
    return getPropertyDocuments(property).find((doc) => doc.id === documentId) || null;
}
