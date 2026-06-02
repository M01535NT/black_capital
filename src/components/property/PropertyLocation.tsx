const SECTION_HEADING =
    "font-display text-xs font-bold uppercase tracking-[0.2em] text-foreground/40";

/**
 * Google Maps embed with the gold/grayscale brand treatment.
 */
export function PropertyLocation({
    address,
    title,
}: {
    address: string;
    title: string;
}) {
    return (
        <section className="space-y-4">
            <h2 className={SECTION_HEADING}>Ubicación</h2>
            <div className="rounded-2xl overflow-hidden border border-foreground/5 aspect-[4/3] sm:aspect-[16/9] bg-foreground/[0.02]">
                <iframe
                    title={`Mapa de ${title}`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    className="border-0 map-grayscale"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`}
                    allowFullScreen
                />
            </div>
        </section>
    );
}
