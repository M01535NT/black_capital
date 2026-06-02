"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
    images: string[];
    title: string;
    coverImage?: string | null;
}

export function ImageGallery({ images, title, coverImage }: ImageGalleryProps) {
    const allImages: string[] = [];
    if (coverImage) allImages.push(coverImage);
    for (const img of images) {
        if (img && !allImages.includes(img)) allImages.push(img);
    }

    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState<boolean[]>(() => new Array(allImages.length).fill(false));
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const thumbContainerRef = useRef<HTMLDivElement>(null);

    const markLoaded = (idx: number) => {
        setIsLoaded(prev => {
            const next = [...prev];
            next[idx] = true;
            return next;
        });
    };

    const handleImageError = (idx: number) => {
        setImageErrors(prev => new Set(prev).add(idx));
    };

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
            // Scroll thumbnail into view
            if (thumbContainerRef.current) {
                const thumb = thumbContainerRef.current.children[clamped] as HTMLElement;
                if (thumb) {
                    thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                }
            }
        }
    }, [lightboxOpen, allImages.length]);

    const next = useCallback(() => {
        const idx = lightboxOpen ? lightboxIndex : activeIndex;
        goTo((idx + 1) % allImages.length);
    }, [lightboxOpen, lightboxIndex, activeIndex, goTo, allImages.length]);

    const prev = useCallback(() => {
        const idx = lightboxOpen ? lightboxIndex : activeIndex;
        goTo((idx - 1 + allImages.length) % allImages.length);
    }, [lightboxOpen, lightboxIndex, activeIndex, goTo, allImages.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            else if (e.key === "ArrowLeft") prev();
            else if (e.key === "Escape") closeLightbox();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [lightboxOpen, next, prev, closeLightbox]);

    // Cleanup body overflow on unmount if lightbox was open
    useEffect(() => {
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // Reset state when props change
    useEffect(() => {
        setIsLoaded(new Array(allImages.length).fill(false));
        setActiveIndex(0);
    }, [images, coverImage]);

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) next();
            else prev();
        }
    };

    if (allImages.length === 0) return null;

    const displayIndex = lightboxOpen ? lightboxIndex : activeIndex;

    return (
        <>
            {/* ── Main Carousel ── */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-foreground/5 shadow-2xl shadow-black/40">
                <div
                    ref={carouselRef}
                    className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:max-h-[560px] overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(activeIndex)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Main Image */}
                    {allImages.map((src, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                                idx === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-[1.04] pointer-events-none"
                            }`}
                        >
                            {imageErrors.has(idx) ? (
                                <div className="w-full h-full flex items-center justify-center bg-foreground/[0.03]">
                                    <div className="text-center text-foreground/40">
                                        <span className="text-xs uppercase tracking-wider font-display">Sin imagen</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Blur placeholder */}
                                    <div
                                        className={`absolute inset-0 bg-foreground/[0.03] transition-opacity duration-500 ${
                                            isLoaded[idx] ? "opacity-0" : "opacity-100"
                                        }`}
                                    />
                                    <img
                                        src={src}
                                        alt={`${title} — Imagen ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
                                        onLoad={() => markLoaded(idx)}
                                        onError={() => handleImageError(idx)}
                                        loading={idx === 0 ? "eager" : "lazy"}
                                    />
                                </>
                            )}
                        </div>
                    ))}

                    {/* Gradient overlays — subtle, premium */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

                    {/* Expand icon hint */}
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="size-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center">
                            <ZoomIn className="size-4 text-white/80" />
                        </div>
                    </div>

                    {/* Counter — bottom right */}
                    <div className="absolute bottom-4 right-4 z-20">
                        <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-numerics font-medium border border-white/10">
                            {activeIndex + 1} / {allImages.length}
                        </span>
                    </div>

                    {/* Navigation arrows — visible on hover, always on touch */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 size-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 hover:border-white/20 active:scale-95"
                                aria-label="Imagen anterior"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 size-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 hover:border-white/20 active:scale-95"
                                aria-label="Imagen siguiente"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* ── Thumbnail strip ── */}
                {allImages.length > 1 && (
                    <div className="w-full bg-black/80 backdrop-blur-sm border-t border-white/5 px-3 py-3">
                        <div
                            ref={thumbContainerRef}
                            className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory"
                        >
                            {allImages.map((src, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goTo(idx)}
                                    className={`relative shrink-0 size-[52px] sm:size-[64px] md:size-[72px] rounded-xl overflow-hidden border-2 transition-all duration-300 snap-center ${
                                        idx === activeIndex
                                            ? "border-gold-500 shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                                            : "border-transparent opacity-50 hover:opacity-80 hover:border-white/20"
                                    }`}
                                    aria-label={`Ver imagen ${idx + 1}`}
                                >
                                    {imageErrors.has(idx) ? (
                                        <div className="w-full h-full bg-foreground/[0.05] flex items-center justify-center">
                                            <span className="text-[9px] text-white/20 uppercase">—</span>
                                        </div>
                                    ) : (
                                        <img
                                            src={src}
                                            alt={`${title} — Miniatura ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Lightbox ── */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all active:scale-95"
                        aria-label="Cerrar galería"
                    >
                        <X className="size-5" />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                        <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-numerics font-medium border border-white/10">
                            {lightboxIndex + 1} / {allImages.length}
                        </span>
                    </div>

                    {/* Image container */}
                    <div
                        className="relative w-full h-full flex items-center justify-center px-4 md:px-20"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {allImages.map((src, idx) => (
                            <img
                                key={idx}
                                src={src}
                                alt={`${title} — Imagen ${idx + 1}`}
                                className={`max-w-full max-h-[80vh] object-contain rounded-lg transition-all duration-500 select-none ${
                                    idx === lightboxIndex
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-95 absolute inset-0 m-auto pointer-events-none"
                                }`}
                                draggable={false}
                            />
                        ))}
                    </div>

                    {/* Navigation arrows */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all active:scale-95"
                                aria-label="Imagen anterior"
                            >
                                <ChevronLeft className="size-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all active:scale-95"
                                aria-label="Imagen siguiente"
                            >
                                <ChevronRight className="size-6" />
                            </button>
                        </>
                    )}

                    {/* Thumbnail row — bottom */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-[90vw]">
                            <div className="flex gap-1.5 p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5 overflow-x-auto scrollbar-none">
                                {allImages.map((src, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                                        className={`size-12 sm:size-14 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                                            idx === lightboxIndex
                                                ? "border-gold-500"
                                                : "border-transparent opacity-40 hover:opacity-70"
                                        }`}
                                        aria-label={`Ir a imagen ${idx + 1}`}
                                    >
                                        <img
                                            src={src}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
