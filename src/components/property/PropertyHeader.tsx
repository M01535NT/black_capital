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
        <div className="grid gap-6 border-b border-white/[0.06] pb-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <div className="space-y-5">
                <div className="flex items-center gap-3">
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

                <h1 className="text-4xl font-light leading-[1.02] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
                    {title}
                </h1>

                {address && (
                    <div className="flex items-start gap-2.5 text-sm text-white/56">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" />
                        <span className="leading-relaxed">{address}</span>
                    </div>
                )}
            </div>

            <div className="border border-white/[0.08] bg-white/[0.025] p-5 lg:text-right">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                    Precio publicado
                </p>
                <p className="text-3xl font-semibold tracking-tight text-[var(--color-accent)] sm:text-4xl">
                    {formatPrice(price, currency)}
                </p>
                {priceMxn && currency !== "MXN" && (
                    <p className="mt-2 text-sm text-white/50">≈ {currencyMXN.format(priceMxn)}</p>
                )}
            </div>
        </div>
    );
}
