import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, Mail, ArrowRight } from "lucide-react";
import { propertyContactHref } from "@/lib/property-contact";
import { formatPrice } from "@/lib/format";

interface Fact {
    label: string;
    value: string;
}

interface SummaryAgent {
    full_name: string;
    photo_url: string | null;
    license_number: string | null;
    phone: string | null;
    email: string | null;
}

interface PropertySummaryCardProps {
    price: number;
    currency: string;
    businessType: string;
    pricePerM2?: string | null;
    facts: Fact[];
    agent?: SummaryAgent | null;
    whatsappFallback: string;
    propertyTitle: string;
    propertyId: string;
    address?: string | null;
    brand?: string;
}

function waHref(phoneRaw: string, title: string) {
    const cleaned = phoneRaw.replace(/\D/g, "");
    const formatted = cleaned.length === 10 ? `52${cleaned}` : cleaned;
    return `https://wa.me/${formatted}?text=${encodeURIComponent(`Hola, me interesa esta propiedad: ${title}`)}`;
}

/**
 * Tarjeta-resumen sticky del detalle de propiedad: precio, datos clave, asesor
 * y CTAs de contacto. Es la ancla de conversión que permanece visible mientras
 * el usuario recorre el contenido (patrón estándar de ficha inmobiliaria).
 */
export function PropertySummaryCard({
    price,
    currency,
    businessType,
    pricePerM2,
    facts,
    agent,
    whatsappFallback,
    propertyTitle,
    propertyId,
    address,
    brand,
}: PropertySummaryCardProps) {
    const whatsappPhone = agent?.phone || whatsappFallback;
    const contact = { propertyId, propertyTitle, brand };

    return (
        <div className="border border-white/[0.1] bg-white/[0.02]">
            {/* Precio */}
            <div className="border-b border-white/[0.08] p-6">
                <p className="property-tag-type text-white/45">
                    {businessType === "Renta" ? "Renta mensual" : "Precio"}
                </p>
                <p className="mt-1.5 font-display text-[clamp(1.7rem,2.4vw,2.25rem)] font-extrabold leading-none tabular-nums gold-ink">
                    {formatPrice(price, currency)}
                </p>
                {pricePerM2 && (
                    <p className="mt-2 property-metadata-type text-white/45">{pricePerM2} por m²</p>
                )}
            </div>

            {/* Contacto inmediato antes de los datos de apoyo. */}
            <div className="space-y-2.5 p-6">
                {address && <p className="property-metadata-type text-white/60">{address}</p>}
                <Link href={propertyContactHref(contact)} className="brushed-gold premium-cta flex min-h-12 items-center justify-center gap-2 rounded-none px-3 active:scale-[0.98]">
                    Consultar esta propiedad
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
                <Link href={propertyContactHref({ ...contact, objective: "solicitar-visita" })} className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-white/[0.12] property-tag-type text-white/80 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-[0.98]">
                    Solicitar visita
                </Link>
            </div>

            {/* Datos clave */}
            {facts.length > 0 && (
                <dl className="border-b border-white/[0.08] px-6 py-2">
                    {facts.map((f) => (
                        <div
                            key={f.label}
                            className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-3 last:border-b-0"
                        >
                            <dt className="property-metadata-type text-white/45">{f.label}</dt>
                            <dd className="font-display text-body-sm font-bold text-white">{f.value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {/* Asesor */}
            {agent && (
                <div className="flex items-center gap-3 border-b border-white/[0.08] p-6">
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 font-semibold text-[var(--color-accent)]">
                        {agent.photo_url ? (
                            <Image
                                src={agent.photo_url}
                                alt={agent.full_name}
                                width={48}
                                height={48}
                                className="size-full object-cover"
                            />
                        ) : (
                            <span className="text-lg">{agent.full_name.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="property-tag-type text-white/45">Tu asesor</p>
                        <p className="truncate font-display text-body-sm font-bold text-white">
                            {agent.full_name}
                        </p>
                    </div>
                </div>
            )}

            {/* CTAs */}
            <div className="space-y-2.5 p-6">
                <a
                    href={waHref(whatsappPhone, propertyTitle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 property-tag-type text-white/80 hover:text-[var(--color-accent)]"
                >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Consultar por WhatsApp
                </a>
                <div className="grid grid-cols-2 gap-2.5">
                    {agent?.phone && (
                        <a
                            href={`tel:${agent.phone}`}
                            className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/[0.12] property-tag-type text-white/80 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-[0.98]"
                        >
                            <Phone className="size-3.5" aria-hidden="true" />
                            Llamar
                        </a>
                    )}
                    {agent?.email && (
                        <a
                            href={`mailto:${agent.email}`}
                            className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/[0.12] property-tag-type text-white/80 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-[0.98]"
                        >
                            <Mail className="size-3.5" aria-hidden="true" />
                            Email
                        </a>
                    )}
                </div>

            </div>
        </div>
    );
}
