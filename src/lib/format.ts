/**
 * Centralized formatters for prices, areas, dates.
 * Single source of truth — used by PropertyCard, property detail, catalog filter, admin.
 */

const compact = new Intl.NumberFormat("es-MX", {
    notation: "compact",
    maximumFractionDigits: 1,
});

const fullEsMX = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });

/**
 * Full price: "$24,500,000 MXN"
 * Use on property detail, hero cards, CTAs.
 */
export function formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(price);
}

/**
 * Short price: "$24.5 M MXN" for big numbers, "$850,000 MXN" for small.
 * Suffix "/mes" when businessType === "Renta".
 */
export function formatShortPrice(price: number, currency: string, businessType?: string): string {
    const suffix = businessType === "Renta" ? "/mes" : "";
    if (price >= 1_000_000) {
        return `$${compact.format(price)} ${currency}${suffix}`;
    }
    return `$${fullEsMX.format(price)} ${currency}${suffix}`;
}

/**
 * Square meters: "1,250 m²" or "—" for null/undefined.
 */
export function formatArea(m2: number | null | undefined, kind: "T" | "C" | "" = ""): string {
    if (m2 == null) return "—";
    const suffix = kind ? ` m² ${kind}` : " m²";
    return `${m2.toLocaleString("es-MX")}${suffix}`;
}

/**
 * Date in short es-MX format: "jun 2026"
 */
export function formatShortDate(iso: string | Date): string {
    const d = typeof iso === "string" ? new Date(iso) : iso;
    return d.toLocaleDateString("es-MX", { month: "short", year: "numeric" });
}
