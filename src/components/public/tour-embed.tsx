"use client";

interface TourEmbedProps {
    urls: string[];
}

function getEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);

        // Kuula: https://kuula.co/share/XXXXX → add embed param
        if (u.hostname.includes("kuula.co")) {
            u.searchParams.set("embed", "1");
            return u.toString();
        }

        // Matterport or any other platform
        return url;
    } catch (parseErr) {
        // Silently fallback on tour parse error
        return null;
    }
}

export function TourEmbed({ urls }: TourEmbedProps) {
    if (!urls || urls.length === 0) return null;

    return (
        <div className="space-y-6">
            <h2 className="section-heading text-2xl tracking-tight border-b border-foreground/10 pb-4">
                Recorrido Virtual 360°
            </h2>
            <div className="space-y-4">
                {urls.map((url, i) => {
                    const embedUrl = getEmbedUrl(url);
                    if (!embedUrl) return null;

                    return (
                        <div
                            key={i}
                            className="w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-foreground/5 shadow-lg"
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
                    );
                })}
            </div>
        </div>
    );
}
