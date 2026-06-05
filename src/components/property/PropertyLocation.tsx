import { MapPin, Navigation } from "lucide-react";
import Link from "next/link";

const SECTION_HEADING =
    "font-display text-xs font-bold uppercase tracking-wide-display text-foreground/50";

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
            {/* Heading con hairline */}
            <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[var(--color-accent)]/60" />
                <h2 className={SECTION_HEADING}>Ubicación Estratégica</h2>
            </div>
            
            {/* Marco decorativo con glow on hover */}
            <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-500/20 via-transparent to-gold-500/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                
                {/* Contenedor del mapa */}
                <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 aspect-[4/3] sm:aspect-[16/9] bg-foreground/[0.02]">
                    <iframe
                        title={`Mapa de ${title}`}
                        width="100%"
                        height="100%"
                        loading="lazy"
                        className="border-0 map-grayscale transition-all duration-500 group-hover:grayscale-0"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`}
                        allowFullScreen
                    />
                    
                    {/* Overlay con info de ubicación */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <MapPin className="size-5 text-gold-500" />
                            <span className="text-sm font-medium">{address}</span>
                        </div>
                    </div>
                </div>
                
                {/* Botón "Cómo llegar" */}
                <Link
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500 text-black text-sm font-bold uppercase tracking-wider hover:bg-gold-400 transition-colors"
                >
                    <Navigation className="size-4" />
                    Cómo llegar
                </Link>
            </div>
        </section>
    );
}
