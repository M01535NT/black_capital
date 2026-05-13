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
    } catch {
        return null;
    }
}

export function TourEmbed({ urls }: TourEmbedProps) {
    if (!urls || urls.length === 0) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-foreground/10 pb-4">
                Recorrido Virtual 360°
            </h2>
            <div className="space-y-4">
                {urls.map((url, i) => {
                    const embedUrl = getEmbedUrl(url);
                    if (!embedUrl) return null;

                    return (
                        <div
                            key={i}
                            className="w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-foreground/10"
                        >
                            <iframe
                                src={embedUrl}
                                title={`Recorrido virtual ${i + 1}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
