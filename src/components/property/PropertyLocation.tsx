import { MapPin, ExternalLink } from "lucide-react";

/**
 * Ubicación de la propiedad: barra con dirección + acción fiable "Abrir en
 * Google Maps" y un mapa embebido debajo. La barra garantiza contenido útil
 * aunque el iframe tarde o quede en blanco. La página es dueña del encabezado.
 */
export function PropertyLocation({
    address,
    title,
}: {
    address: string;
    title: string;
}) {
    const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    return (
        <div className="border border-white/[0.1] bg-white/[0.02]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-3.5">
                <span className="inline-flex items-center gap-2 property-location-type text-white/80">
                    <MapPin className="size-4 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                    {address}
                </span>
                <a
                    href={mapsSearch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 property-tag-type text-white/60 transition-colors duration-200 ease-out hover:text-[var(--color-accent)]"
                >
                    Abrir en Google Maps
                    <ExternalLink className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.02] sm:aspect-[16/7]">
                <iframe
                    title={`Mapa de ${title}`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    className="map-grayscale border-0 transition-[filter] duration-500 ease-out hover:grayscale-0"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=14`}
                    allowFullScreen
                />
            </div>
        </div>
    );
}
