"use client";

interface VideoEmbedProps {
    urls: string[];
    /** Sin encabezado propio (cuando la sección padre ya lo pone, p.ej. tabs de galería). */
    bare?: boolean;
}

function extractYoutubeId(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtube.com") && u.searchParams.has("v")) {
            return u.searchParams.get("v");
        }
        if (u.hostname === "youtu.be") {
            return u.pathname.slice(1);
        }
        if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
            return u.pathname.split("/")[2];
        }
        if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/shorts/")) {
            return u.pathname.split("/")[2];
        }
    } catch {
        const match = url.match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        return match ? match[1] : null;
    }
    return null;
}

export function VideoEmbed({ urls, bare = false }: VideoEmbedProps) {
    if (!urls || urls.length === 0) return null;

    const validUrls = urls.map(extractYoutubeId).filter(Boolean) as string[];
    if (validUrls.length === 0) return null;

    return (
        <section className="space-y-5">
            {!bare && (
                <div className="flex items-center gap-3">
                    <span className="h-px w-10 bg-[var(--color-accent)]/60" aria-hidden="true" />
                    <h2 className="property-tag-type text-white/48">
                        Video Promocional
                    </h2>
                </div>
            )}
            <div className="space-y-4">
                {validUrls.map((videoId, i) => (
                    <div
                        key={i}
                        className="aspect-video w-full overflow-hidden border border-white/[0.08] bg-white/[0.025]"
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                            title={`Video promocional ${i + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
