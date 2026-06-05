"use client";

interface TourEmbedProps {
    urls: string[];
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

export function TourEmbed({ urls }: TourEmbedProps) {
    if (!urls || urls.length === 0) return null;

    const validUrls = urls.map(getEmbedUrl).filter(Boolean) as string[];
    if (validUrls.length === 0) return null;

    return (
        <section className="space-y-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-wide-display text-foreground/50">
                Recorrido Virtual 360°
            </h2>
            <div className="space-y-4">
                {validUrls.map((embedUrl, i) => (
                    <div
                        key={i}
                        className="w-full aspect-video rounded-2xl overflow-hidden bg-background-elevated border border-foreground/5 shadow-lg"
                    >
                        <iframe
                            src={embedUrl}
                            title={`Recorrido virtual ${i + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
                            allowFullScreen
                            loading="lazy"
                            className="w-full h-full"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
