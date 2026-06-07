import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, STATUS_CLASSES } from "@/lib/property-constants";
import { formatPrice } from "@/lib/format";

interface PropertyHeaderProps {
    businessType: string;
    propertyUse: string;
    propertyType: string;
    isProject?: boolean;
    status: string;
    title: string;
    address?: string | null;
    price: number;
    currency: string;
    priceMxn?: number | null;
}

const currencyMXN = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
});

/**
 * Top block of the property detail page with premium styling aligned with Home design.
 * Features hairline vertical accent, eyebrow tag, and dramatic typography.
 */
export function PropertyHeader({
    businessType,
    propertyUse,
    propertyType,
    isProject,
    status,
    title,
    address,
    price,
    currency,
    priceMxn,
}: PropertyHeaderProps) {
    const statusClass = STATUS_CLASSES[status] || "text-foreground/50 border-foreground/15";
    const statusLabel = STATUS_LABELS[status] || status;

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-10 bg-[var(--color-accent)]/60" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/68">
                    {businessType} · {propertyUse} · {propertyType}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-[var(--color-accent)] px-2.5 py-0.5 text-caption font-semibold uppercase tracking-wider text-black">
                    {businessType}
                </Badge>
                <Badge
                    variant="outline"
                    className="border-white/15 px-2.5 py-0.5 text-caption uppercase tracking-wider"
                >
                    {propertyUse}
                </Badge>
                <Badge
                    variant="outline"
                    className="border-white/15 px-2.5 py-0.5 text-caption uppercase tracking-wider"
                >
                    {propertyType}
                </Badge>
                {isProject && (
                    <Badge className="bg-white/[0.08] px-2.5 py-0.5 text-caption uppercase tracking-wider text-white">
                        Proyecto
                    </Badge>
                )}
                <span
                    className={`text-caption font-semibold px-2.5 py-0.5 border ${statusClass}`}
                >
                    {statusLabel}
                </span>
            </div>

            <h1 className="text-display-1 font-light leading-hero tracking-tight text-white text-balance">
                {title}
            </h1>

            {address && (
                <div className="flex items-start gap-2.5 text-sm text-white/56">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" />
                    <span className="leading-relaxed">{address}</span>
                </div>
            )}

            <div className="flex flex-wrap items-baseline gap-3 pt-2">
                <p className="text-3xl font-semibold tracking-tight text-[var(--color-accent)] sm:text-4xl md:text-5xl">
                    {formatPrice(price, currency)}
                </p>
                {priceMxn && currency !== "MXN" && (
                    <span className="text-sm text-white/50">≈ {currencyMXN.format(priceMxn)}</span>
                )}
            </div>
        </div>
    );
}
