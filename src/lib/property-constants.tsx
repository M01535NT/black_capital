/**
 * Property-related enums, labels, and icon mappings.
 * Centralized so the public site, admin, and any future code stays in sync.
 */
import {
    Bed,
    Bath,
    Layers,
    Car,
    ShieldCheck,
    type LucideIcon,
} from "lucide-react";

/* ── Status ────────────────────────────────────────────────────────── */

export type PropertyStatus = "Available" | "Under_Offer" | "Sold" | "Rented" | string;

export const STATUS_LABELS: Record<string, string> = {
    Available: "Disponible",
    Under_Offer: "Bajo Oferta",
    Sold: "Vendido",
    Rented: "Rentado",
};

export type StatusVariant = "success" | "warning" | "destructive" | "info" | "muted";

export const STATUS_VARIANTS: Record<string, StatusVariant> = {
    Available: "success",
    Under_Offer: "warning",
    Sold: "destructive",
    Rented: "info",
};

/* Tailwind class string per variant — used by inline badges where Badge doesn't fit */
export const STATUS_CLASSES: Record<string, string> = {
    Available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Under_Offer: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Sold: "bg-red-500/10 text-red-400 border-red-500/20",
    Rented: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

/* ── Custom attribute icons (Spanish + variants) ───────────────────── */

export const ATTRIBUTE_ICONS: Record<string, LucideIcon> = {
    habitaciones: Bed,
    dormitorios: Bed,
    recamaras: Bed,
    recámaras: Bed,
    baños: Bath,
    banos: Bath,
    pisos: Layers,
    niveles: Layers,
    estacionamiento: Car,
    cajones: Car,
};

export const DEFAULT_ATTRIBUTE_ICON: LucideIcon = ShieldCheck;

/** React component that returns the right icon for an attribute key. */
export function getAttributeIcon(key: string): React.ReactNode {
    const Icon = ATTRIBUTE_ICONS[key.toLowerCase()] || DEFAULT_ATTRIBUTE_ICON;
    return <Icon className="size-4" />;
}

/* ── Business type / use (used by filters, badges) ─────────────────── */

export const USES = ["Residencial", "Comercial", "Industrial"] as const;
export const BUSINESS_TYPES = ["Venta", "Renta"] as const;

export type PropertyUse = (typeof USES)[number];
export type BusinessType = (typeof BUSINESS_TYPES)[number];

/* Map from brand URL slug to use (used for deep links from sub-brand pages) */
export const BRAND_TO_USE: Record<string, PropertyUse> = {
    luxury: "Residencial",
    business: "Comercial",
    industrial: "Industrial",
};
