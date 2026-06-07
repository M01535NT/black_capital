const SECTION_HEADING =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-white/48";

/**
 * Google Maps embed with premium frame.
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
            </div>
        </section>
    );
}
