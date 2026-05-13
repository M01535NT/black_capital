"use client";

import { useState, useCallback, useEffect } from "react";
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

    const openLightbox = useCallback((index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
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
        return () => window.removeEventListener("keydown", handleKey);
    }, [lightboxOpen, lightboxIndex, closeLightbox, goTo]);

    if (allImages.length === 0) return null;

    const currentImage = allImages[lightboxOpen ? lightboxIndex : activeIndex];

    return (
        <>
            {/* Main gallery */}
            <div className="space-y-4">
                {/* Main image */}
                <div className="relative aspect-[16/9] md:aspect-[21/9] bg-zinc-900 rounded-xl overflow-hidden group">
                    <img
                        src={currentImage}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    {/* Expand button */}
                    <button
                        onClick={() => openLightbox(activeIndex)}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Ver en pantalla completa"
                    >
                        <Expand className="w-5 h-5" />
                    </button>

                    {/* Arrows for multiple images */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Imagen anterior"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Imagen siguiente"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Counter */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                            {activeIndex + 1} / {allImages.length}
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
                        {allImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all snap-start ${
                                    i === activeIndex
                                        ? "border-gold-500 opacity-100"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`${title} ${i + 1}`}
                                    className="w-full h-full object-cover"
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
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full z-10"
                        aria-label="Cerrar"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 text-white text-sm rounded-full z-10">
                        {lightboxIndex + 1} / {allImages.length}
                    </div>

                    {/* Navigation arrows */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goTo(lightboxIndex - 1); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full z-10"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goTo(lightboxIndex + 1); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full z-10"
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
                        className="max-w-full max-h-[90vh] object-contain select-none"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Thumbnail strip at bottom */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-1">
                            {allImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                                    className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
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
