"use client";

interface VideoEmbedProps {
    urls: string[];
}

function extractYoutubeId(url: string): string | null {
    try {
        const u = new URL(url);
        // youtube.com/watch?v=ID
        if (u.hostname.includes("youtube.com") && u.searchParams.has("v")) {
            return u.searchParams.get("v");
        }
        // youtu.be/ID
        if (u.hostname === "youtu.be") {
            return u.pathname.slice(1);
        }
        // youtube.com/embed/ID
        if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
            return u.pathname.split("/")[2];
        }
        // youtube.com/shorts/ID
        if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/shorts/")) {
            return u.pathname.split("/")[2];
        }
    } catch {
        // If URL parsing fails, try regex fallback
        const match = url.match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        return match ? match[1] : null;
    }
    return null;
}

export function VideoEmbed({ urls }: VideoEmbedProps) {
    if (!urls || urls.length === 0) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-foreground/10 pb-4">
                Video Promocional
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {urls.map((url, i) => {
                    const videoId = extractYoutubeId(url);
                    if (!videoId) return null;

                    return (
                        <div
                            key={i}
                            className="aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-foreground/10"
                        >
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={`Video promocional ${i + 1}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
