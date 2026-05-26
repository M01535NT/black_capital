"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

interface ImageGalleryProps {
    images: string[];
    title: string;
    coverImage?: string | null;
}

export function ImageGallery({ images, title, coverImage }: ImageGalleryProps) {
    // Combine cover + gallery, deduplicate
    const allImages: string[] = [];
    if (coverImage && !allImages.includes(coverImage)) allImages.push(coverImage);
    for (const img of images) {
        if (!allImages.includes(img)) allImages.push(img);
    }

    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Touch/swipe state for lightbox
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const openLightbox = useCallback((index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = "hidden";
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
        document.body.style.overflow = "";
    }, []);

    const goTo = useCallback((index: number) => {
        const clamped = Math.max(0, Math.min(index, allImages.length - 1));
        if (lightboxOpen) {
            setLightboxIndex(clamped);
        } else {
            setActiveIndex(clamped);
        }
    }, [lightboxOpen, allImages.length]);

    // Keyboard support
    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") goTo(lightboxIndex - 1);
            if (e.key === "ArrowRight") goTo(lightboxIndex + 1);
        };
        window.addEventListener("keydown", handleKey);
        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [lightboxOpen, lightboxIndex, closeLightbox, goTo]);

    // Swipe handlers for lightbox
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goTo(lightboxIndex + 1);
            else goTo(lightboxIndex - 1);
        }
    };

    if (allImages.length === 0) return null;

    const currentImage = allImages[lightboxOpen ? lightboxIndex : activeIndex];

    return (
        <>
            {/* Main gallery */}
            <div className="space-y-3">
                {/* Main image */}
                <div className="relative aspect-[4/3] md:aspect-[16/10] max-h-[70vh] bg-zinc-900 rounded-xl overflow-hidden group">
                    <img
                        src={currentImage}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                    {/* Expand button — always visible on mobile */}
                    <button
                        onClick={() => openLightbox(activeIndex)}
                        className="absolute top-3 right-3 p-2.5 min-w-[44px] min-h-[44px] bg-black/60 hover:bg-black/90 text-white rounded-lg transition-colors flex items-center justify-center"
                        aria-label="Ver en pantalla completa"
                    >
                        <Expand className="w-5 h-5" />
                    </button>

                    {/* Arrows — always visible on mobile, hover on desktop */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2.5 min-w-[44px] min-h-[44px] bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors flex items-center justify-center md:opacity-0 md:group-hover:opacity-100"
                                aria-label="Imagen anterior"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2.5 min-w-[44px] min-h-[44px] bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors flex items-center justify-center md:opacity-0 md:group-hover:opacity-100"
                                aria-label="Imagen siguiente"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Counter */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 text-white text-xs md:text-sm rounded-full">
                            {activeIndex + 1} / {allImages.length}
                        </div>
                    )}
                </div>

                {/* Thumbnails — scrollable on mobile */}
                {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 snap-x scrollbar-hide">
                        {allImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all snap-start ${
                                    i === activeIndex
                                        ? "border-gold-500 opacity-100"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`${title} ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox — Fullscreen overlay */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                    onClick={closeLightbox}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-3 right-3 md:top-4 md:right-4 p-3 min-w-[44px] min-h-[44px] text-white hover:bg-white/10 rounded-full z-10 flex items-center justify-center"
                        aria-label="Cerrar"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 px-3 py-1.5 bg-white/10 text-white text-sm rounded-full z-10">
                        {lightboxIndex + 1} / {allImages.length}
                    </div>

                    {/* Navigation arrows */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goTo(lightboxIndex - 1); }}
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-3 min-w-[48px] min-h-[48px] bg-white/10 hover:bg-white/20 text-white rounded-full z-10 flex items-center justify-center"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goTo(lightboxIndex + 1); }}
                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-3 min-w-[48px] min-h-[48px] bg-white/10 hover:bg-white/20 text-white rounded-full z-10 flex items-center justify-center"
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Image */}
                    <img
                        src={currentImage}
                        alt={title}
                        className="max-w-[95vw] max-h-[80vh] md:max-h-[90vh] object-contain select-none"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Thumbnail strip at bottom */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-1">
                            {allImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                                    className={`flex-shrink-0 w-14 h-10 md:w-16 md:h-12 rounded-md overflow-hidden border-2 transition-all ${
                                        i === lightboxIndex
                                            ? "border-gold-500 opacity-100"
                                            : "border-white/20 opacity-50 hover:opacity-80"
                                    }`}
                                >
                                    <img
                                        src={img}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
