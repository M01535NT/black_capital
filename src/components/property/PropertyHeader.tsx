import { MapPin, Badge as BadgeIcon } from "lucide-react";
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
 * Top block of the property detail page: status pill, business/use/type badges,
 * title, address, and price. Restored to a more visible size per design intent.
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
        <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-gold-500 text-black font-semibold uppercase tracking-wider text-caption px-2.5 py-0.5">
                    {businessType}
                </Badge>
                <Badge
                    variant="outline"
                    className="uppercase tracking-wider text-caption border-foreground/15 px-2.5 py-0.5"
                >
                    {propertyUse}
                </Badge>
                <Badge
                    variant="outline"
                    className="uppercase tracking-wider text-caption border-foreground/15 px-2.5 py-0.5"
                >
                    {propertyType}
                </Badge>
                {isProject && (
                    <Badge className="bg-blue-600 text-white text-caption uppercase tracking-wider px-2.5 py-0.5">
                        Proyecto
                    </Badge>
                )}
                <span
                    className={`ml-auto text-caption font-semibold px-2.5 py-0.5 rounded-full border ${statusClass}`}
                >
                    {statusLabel}
                </span>
            </div>

            {/* Title — restored to a more visible size for premium feel */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-wider text-foreground leading-tight">
                {title}
            </h1>

            {/* Address */}
            {address && (
                <div className="flex items-start gap-2 text-foreground/50 text-sm">
                    <MapPin className="size-4 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{address}</span>
                </div>
            )}

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3">
                <p className="text-2xl sm:text-3xl md:text-4xl font-numerics font-bold tracking-tight text-gold-500">
                    {formatPrice(price, currency)}
                </p>
                {priceMxn && currency !== "MXN" && (
                    <span className="text-sm text-foreground/50">≈ {currencyMXN.format(priceMxn)}</span>
                )}
            </div>
        </div>
    );
}
