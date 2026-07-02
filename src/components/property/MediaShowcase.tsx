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
 * Black"): un solo componente con los 3 botones Fotos / Video / 360° siempre
 * presentes. Si la propiedad no tiene video o recorrido, el panel muestra un
 * estado para pedirlo por WhatsApp en lugar de ocultar el botón.
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

    const requestHref = (medium: string) =>
        `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(
            `Hola, me interesa ver ${medium} de: ${title}`,
        )}`;

    return (
        <div className="space-y-4">
            <div
                role="tablist"
                aria-label="Tipo de medio"
                className="inline-flex gap-1 border border-white/[0.12] p-1"
            >
                {tabs.map(({ key, label, icon: Icon }) => {
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

            <div id="media-panel-fotos" role="tabpanel" hidden={tab !== "fotos"}>
                <ImageGallery
                    images={images}
                    title={title}
                    coverImage={coverImage}
                    propertyUse={propertyUse}
                />
            </div>

            <div id="media-panel-video" role="tabpanel" hidden={tab !== "video"}>
                {hasVideo ? (
                    <VideoEmbed urls={videoUrls || []} bare />
                ) : (
                    <MediaRequest
                        icon={Play}
                        medium="video"
                        href={requestHref("el video")}
                    />
                )}
            </div>

            <div id="media-panel-360" role="tabpanel" hidden={tab !== "360"}>
                {hasTour ? (
                    <TourEmbed urls={tourEmbeds || []} bare />
                ) : (
                    <MediaRequest
                        icon={Rotate3d}
                        medium="recorrido 360°"
                        href={requestHref("el recorrido 360°")}
                    />
                )}
            </div>
        </div>
    );
}

/** Estado del panel cuando la propiedad aún no tiene ese medio cargado. */
function MediaRequest({
    icon: Icon,
    medium,
    href,
}: {
    icon: typeof Play;
    medium: string;
    href: string;
}) {
    return (
        <div className="flex aspect-[16/10] max-h-[520px] flex-col items-center justify-center gap-4 border border-white/[0.08] bg-white/[0.02] px-6 text-center">
            <span className="flex size-14 items-center justify-center border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10">
                <Icon className="size-6 text-[var(--color-accent)]" aria-hidden="true" />
            </span>
            <p className="max-w-sm text-body-sm text-white/60">
                Esta propiedad aún no tiene {medium} publicado. Solicítalo y un asesor
                te lo comparte.
            </p>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-gradient inline-flex min-h-11 items-center gap-2 px-5 font-display text-[0.7rem] font-bold uppercase tracking-[0.08em] text-black transition-[filter] hover:brightness-110"
            >
                <MessageCircle className="size-3.5" aria-hidden="true" />
                Pedir {medium} por WhatsApp
            </a>
        </div>
    );
}
