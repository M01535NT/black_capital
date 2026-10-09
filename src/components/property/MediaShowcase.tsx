"use client";

import { useState } from "react";
import { Camera, Play, Rotate3d } from "lucide-react";
import { ImageGallery } from "@/components/public/image-gallery";
import { VideoEmbed } from "@/components/public/video-embed";
import { TourEmbed } from "@/components/public/tour-embed";
import { cn } from "@/lib/utils";

type MediaTab = "fotos" | "video" | "360";

/** Media controls are shown only for assets available on this property. */
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
    const availableTabs = tabs.filter(({ available }) => available);

    return (
        <div className="flex flex-col gap-3">
            <div
                role="tablist"
                aria-label="Tipo de medio"
                className="flex shrink-0 flex-row gap-1 self-start border border-white/[0.12] p-1"
            >
                {availableTabs.map(({ key, label, icon: Icon }, index) => {
                    const active = tab === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            id={`media-tab-${key}`}
                            tabIndex={active ? 0 : -1}
                            aria-selected={active}
                            aria-controls={`media-panel-${key}`}
                            onClick={() => setTab(key)}
                            onKeyDown={(event) => {
                                const next = event.key === "ArrowRight" ? (index + 1) % availableTabs.length
                                    : event.key === "ArrowLeft" ? (index - 1 + availableTabs.length) % availableTabs.length
                                    : event.key === "Home" ? 0 : event.key === "End" ? availableTabs.length - 1 : -1;
                                if (next < 0) return;
                                event.preventDefault();
                                const nextKey = availableTabs[next].key;
                                setTab(nextKey);
                                document.getElementById(`media-tab-${nextKey}`)?.focus();
                            }}
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
                <div id="media-panel-fotos" role="tabpanel" aria-labelledby="media-tab-fotos" hidden={tab !== "fotos"}>
                    <ImageGallery
                        images={images}
                        title={title}
                        coverImage={coverImage}
                        propertyUse={propertyUse}
                    />
                </div>

                {hasVideo && <div id="media-panel-video" role="tabpanel" aria-labelledby="media-tab-video" hidden={tab !== "video"}><VideoEmbed urls={videoUrls || []} bare /></div>}
                {hasTour && <div id="media-panel-360" role="tabpanel" aria-labelledby="media-tab-360" hidden={tab !== "360"}><TourEmbed urls={tourEmbeds || []} bare /></div>}
            </div>
        </div>
    );
}
