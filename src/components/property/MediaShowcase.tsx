"use client";

import { useState } from "react";
import { Camera, Play, Rotate3d } from "lucide-react";
import { ImageGallery } from "@/components/public/image-gallery";
import { VideoEmbed } from "@/components/public/video-embed";
import { TourEmbed } from "@/components/public/tour-embed";
import { cn } from "@/lib/utils";

type MediaTab = "fotos" | "video" | "360";

/**
 * Galería unificada de la ficha de propiedad (plantilla "Propiedad Editorial
 * Black"): un solo componente con los 3 botones Fotos / Video / 360° siempre
 * presentes. Si la propiedad no tiene video o recorrido, el panel muestra una
 * leyenda "no disponible" en lugar de ocultar el botón.
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

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            {/* Tabs: horizontal arriba en móvil, columna vertical a la izquierda en sm+.
                Al salir del tope, la media sube y gana alto (se ve más cuadrada). */}
            <div
                role="tablist"
                aria-label="Tipo de medio"
                className="flex shrink-0 flex-row gap-1 self-start border border-white/[0.12] p-1 sm:flex-col"
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
                                "inline-flex min-h-10 items-center gap-2 px-4 font-display text-[0.7rem] font-bold uppercase tracking-[0.08em] transition-colors duration-200 ease-out active:scale-[0.98] sm:w-full sm:justify-start",
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

            <div className="min-w-0 flex-1">
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
                        <MediaUnavailable label="Video no disponible" />
                    )}
                </div>

                <div id="media-panel-360" role="tabpanel" hidden={tab !== "360"}>
                    {hasTour ? (
                        <TourEmbed urls={tourEmbeds || []} bare />
                    ) : (
                        <MediaUnavailable label="360 no disponible" />
                    )}
                </div>
            </div>
        </div>
    );
}

/** Leyenda simple cuando la propiedad no tiene ese medio cargado. */
function MediaUnavailable({ label }: { label: string }) {
    return (
        <div className="flex min-h-[220px] items-center justify-center border border-white/[0.08] bg-white/[0.02] px-6">
            <p className="property-tag-type text-white/40">{label}</p>
        </div>
    );
}
