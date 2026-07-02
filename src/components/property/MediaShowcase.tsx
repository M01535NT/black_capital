"use client";

import { useState } from "react";
import { Camera, Play, Rotate3d, MessageCircle } from "lucide-react";
import { ImageGallery } from "@/components/public/image-gallery";
import { VideoEmbed } from "@/components/public/video-embed";
import { TourEmbed } from "@/components/public/tour-embed";
import { CONTACT_CONFIG } from "@/lib/contact-config";
import { cn } from "@/lib/utils";

type MediaTab = "fotos" | "video" | "360";

/**
 * Galería unificada de la ficha de propiedad (plantilla "Propiedad Editorial
 * Black"): un solo capítulo con switcher Fotos / Video / 360°. Los tabs solo
 * aparecen cuando la propiedad tiene ese medio; si faltan video o 360 se
 * ofrece pedirlos por WhatsApp en lugar de mostrar contenido falso.
 */
export function MediaShowcase({
    images,
    coverImage,
    title,
    propertyUse,
    videoUrls,
    tourEmbeds,
}: {
    images: string[];
    coverImage?: string | null;
    title: string;
    propertyUse?: string | null;
    videoUrls: string[] | null;
    tourEmbeds: string[] | null;
}) {
    const hasVideo = Boolean(videoUrls?.length);
    const hasTour = Boolean(tourEmbeds?.length);
    const [tab, setTab] = useState<MediaTab>("fotos");

    const tabs: { key: MediaTab; label: string; icon: typeof Camera; available: boolean }[] = [
        { key: "fotos", label: "Fotos", icon: Camera, available: true },
        { key: "video", label: "Video", icon: Play, available: hasVideo },
        { key: "360", label: "360°", icon: Rotate3d, available: hasTour },
    ];
    const availableTabs = tabs.filter((t) => t.available);
    const missing = tabs.filter((t) => !t.available).map((t) => (t.key === "360" ? "recorrido 360°" : t.label.toLowerCase()));

    const requestHref = `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(
        `Hola, me interesa ver ${missing.join(" y ")} de: ${title}`,
    )}`;

    return (
        <div className="space-y-4">
            {availableTabs.length > 1 && (
                <div
                    role="tablist"
                    aria-label="Tipo de medio"
                    className="inline-flex gap-1 border border-white/[0.12] p-1"
                >
                    {availableTabs.map(({ key, label, icon: Icon }) => {
                        const active = tab === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                aria-controls={`media-panel-${key}`}
                                onClick={() => setTab(key)}
                                className={cn(
                                    "inline-flex min-h-10 items-center gap-2 px-4 font-display text-[0.7rem] font-bold uppercase tracking-[0.08em] transition-colors",
                                    active
                                        ? "gold-gradient text-black"
                                        : "text-white/60 hover:text-[var(--color-accent)]",
                                )}
                            >
                                <Icon className="size-3.5" aria-hidden="true" />
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}

            <div id="media-panel-fotos" role="tabpanel" hidden={tab !== "fotos"}>
                <ImageGallery
                    images={images}
                    title={title}
                    coverImage={coverImage}
                    propertyUse={propertyUse}
                />
            </div>

            {hasVideo && (
                <div id="media-panel-video" role="tabpanel" hidden={tab !== "video"}>
                    <VideoEmbed urls={videoUrls || []} bare />
                </div>
            )}

            {hasTour && (
                <div id="media-panel-360" role="tabpanel" hidden={tab !== "360"}>
                    <TourEmbed urls={tourEmbeds || []} bare />
                </div>
            )}

            {missing.length > 0 && (
                <a
                    href={requestHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 border border-white/[0.08] bg-white/[0.02] px-4 py-3 transition-colors hover:border-[var(--color-accent)]/30"
                >
                    <span className="text-body-sm text-white/55">
                        ¿Quieres ver {missing.join(" y ")} de esta propiedad? Pídelo por WhatsApp.
                    </span>
                    <MessageCircle className="size-4 shrink-0 text-[var(--color-accent)] transition-transform group-hover:scale-110" aria-hidden="true" />
                </a>
            )}
        </div>
    );
}
