"use client";

interface TourEmbedProps {
    urls: string[];
    /** Sin encabezado propio (cuando la sección padre ya lo pone, p.ej. tabs de galería). */
    bare?: boolean;
}

function getEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname.includes("kuula.co")) {
            u.searchParams.set("embed", "1");
            return u.toString();
        }
        return url;
    } catch {
        return null;
    }
}

export function TourEmbed({ urls, bare = false }: TourEmbedProps) {
    if (!urls || urls.length === 0) return null;

    const validUrls = urls.map(getEmbedUrl).filter(Boolean) as string[];
    if (validUrls.length === 0) return null;

    return (
        <section className="space-y-5">
            {!bare && (
                <div className="flex items-center gap-3">
                    <span className="h-px w-10 bg-[var(--color-accent)]/60" aria-hidden="true" />
                    <h2 className="property-tag-type text-white/48">
                        Recorrido Virtual 360°
                    </h2>
                </div>
            )}
            <div className="space-y-4">
                {validUrls.map((embedUrl, i) => (
                    <div
                        key={i}
                        className="aspect-video w-full overflow-hidden border border-white/[0.08] bg-white/[0.025]"
                    >
                        <iframe
                            src={embedUrl}
                            title={`Recorrido virtual ${i + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
                            allowFullScreen
                            loading="lazy"
                            className="h-full w-full"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
