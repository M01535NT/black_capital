import { MapPin, Navigation } from "lucide-react";
import Link from "next/link";

const SECTION_HEADING =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-white/48";

/**
 * Google Maps embed with premium frame, overlay info, and "Cómo llegar" CTA.
 * Aligned with Home design aesthetic.
 */
export function PropertyLocation({
    address,
    title,
}: {
    address: string;
    title: string;
}) {
    return (
        <section className="space-y-5">
            <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[var(--color-accent)]/60" aria-hidden="true" />
                <h2 className={SECTION_HEADING}>Ubicación Estratégica</h2>
            </div>
            
            <div className="relative">
                <div className="relative aspect-[4/3] overflow-hidden border border-white/[0.08] bg-white/[0.025] sm:aspect-[16/9]">
                    <iframe
                        title={`Mapa de ${title}`}
                        width="100%"
                        height="100%"
                        loading="lazy"
                        className="map-grayscale border-0 transition-all duration-500 hover:grayscale-0"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`}
                        allowFullScreen
                    />
                    
                    <div className="absolute bottom-3 left-3 right-3 border border-white/10 bg-black/80 p-3 backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-4 sm:p-4">
                        <div className="flex items-center gap-3">
                            <MapPin className="size-5 shrink-0 text-[var(--color-accent)]" />
                            <span className="text-sm font-medium text-white/78">{address}</span>
                        </div>
                    </div>
                </div>
                
                <Link
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brushed-gold mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-bold uppercase tracking-[0.14em]"
                >
                    <Navigation className="size-4" />
                    Cómo llegar
                </Link>
            </div>
        </section>
    );
}
