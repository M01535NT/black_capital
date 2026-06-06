"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
  coverImage?: string | null;
  videos?: string[];
}

export function ImageGallery({
  images,
  title,
  coverImage,
  videos = [],
}: ImageGalleryProps) {
  // ── Build unique ordered image list (cover first, no duplicates) ──
  const allImages: string[] = [];
  if (coverImage) allImages.push(coverImage);
  for (const img of images) {
    if (img && !allImages.includes(img)) allImages.push(img);
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [hasLoaded, setHasLoaded] = useState<Set<number>>(new Set([0]));

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const thumbContainerRef = useRef<HTMLDivElement>(null);

  const handleImageError = (idx: number) => {
    setImageErrors((prev) => new Set(prev).add(idx));
  };

  const markLoaded = (idx: number) => {
    setHasLoaded((prev) => {
      if (prev.has(idx)) return prev;
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
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

  const scrollThumbIntoView = useCallback((index: number) => {
    if (!thumbContainerRef.current) return;
    const thumb = thumbContainerRef.current.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (allImages.length === 0) return;
      const clamped = ((index % allImages.length) + allImages.length) % allImages.length;
      if (lightboxOpen) {
        setLightboxIndex(clamped);
      } else {
        setActiveIndex(clamped);
        scrollThumbIntoView(clamped);
      }
    },
    [lightboxOpen, allImages.length, scrollThumbIntoView],
  );

  const next = useCallback(() => {
    const idx = lightboxOpen ? lightboxIndex : activeIndex;
    goTo(idx + 1);
  }, [lightboxOpen, lightboxIndex, activeIndex, goTo]);

  const prev = useCallback(() => {
    const idx = lightboxOpen ? lightboxIndex : activeIndex;
    goTo(idx - 1);
  }, [lightboxOpen, lightboxIndex, activeIndex, goTo]);

  // ── Keyboard navigation (only inside lightbox) ──
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

  // ── Body overflow cleanup on unmount ──
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ── Touch swipe (carousel) ──
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
  const hasError = imageErrors.has(displayIndex);
  const isLoading = !hasError && !hasLoaded.has(displayIndex);

  // ── Lightbox swipe handlers ──
  const lightboxTouchStartX = useRef(0);
  const lightboxTouchEndX = useRef(0);
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchStartX.current = e.touches[0].clientX;
  };
  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    lightboxTouchEndX.current = e.changedTouches[0].clientX;
    const diff = lightboxTouchStartX.current - lightboxTouchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  // Total media = images + videos (videos shown as badge in lightbox only for now)
  const totalMedia = allImages.length + (videos?.length ?? 0);

  return (
    <>
      {/* ── Main Carousel ── */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-white/[0.05] shadow-2xl shadow-black/40">
        <div
          className={cn(
            "relative w-full overflow-hidden cursor-pointer group",
            // Alturas responsivas (vh + max-h)
            "h-[35vh] max-h-[350px]",
            "sm:h-[40vh] sm:max-h-[400px]",
            "md:h-[55vh] md:max-h-[500px]",
            "lg:h-[60vh] lg:max-h-[650px]",
          )}
          onClick={() => openLightbox(activeIndex)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={displayIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {hasError ? (
                <div className="w-full h-full flex items-center justify-center bg-foreground/[0.03]">
                  <span className="text-xs uppercase tracking-wider font-display text-foreground/50">
                    Sin imagen
                  </span>
                </div>
              ) : (
                <Image
                  src={allImages[displayIndex]}
                  alt={`${title} — Imagen ${displayIndex + 1}`}
                  fill
                  priority={displayIndex === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1200px"
                  className={cn(
                    "object-cover object-center transition-all duration-700 ease-out",
                    "group-hover:scale-[1.02]",
                    isLoading ? "opacity-0" : "opacity-100",
                  )}
                  onLoad={() => markLoaded(displayIndex)}
                  onError={() => handleImageError(displayIndex)}
                />
              )}

              {/* Loading shimmer */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/[0.03] z-10">
                  <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
                </div>
              )}

              {/* Gradients for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Expand icon hint */}
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="size-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <ZoomIn className="size-4 text-white/80" />
            </div>
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 right-4 z-20">
            <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-numerics font-medium border border-white/10">
              {displayIndex + 1} / {allImages.length}
            </span>
          </div>

          {/* Navigation arrows (desktop hover) */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 size-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hidden sm:flex items-center justify-center text-white hover:bg-black/70 hover:border-white/20 active:scale-95"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 size-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hidden sm:flex items-center justify-center text-white hover:bg-black/70 hover:border-white/20 active:scale-95"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>

        {/* ── Thumbnail strip ── */}
        {allImages.length > 1 && (
          <div className="w-full bg-black/80 backdrop-blur-sm border-t border-white/5 px-3 sm:px-4 py-3 sm:py-4">
            <div
              ref={thumbContainerRef}
              className="flex gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none"
            >
              {/* Left padding to allow first thumb to center on mobile */}
              <div className="shrink-0 w-1 sm:w-2" aria-hidden="true" />
              {allImages.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={cn(
                    "relative shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 snap-center",
                    // Thumb sizes: 40 → 50 → 60 → 72
                    "h-[40px] w-[40px]",
                    "sm:h-[50px] sm:w-[50px]",
                    "md:h-[60px] md:w-[60px]",
                    "lg:h-[72px] lg:w-[72px]",
                    idx === activeIndex
                      ? "border-gold-500 shadow-[0_0_12px_rgba(212,175,55,0.35)]"
                      : "border-transparent opacity-50 hover:opacity-80 hover:border-white/20",
                  )}
                  aria-label={`Ver imagen ${idx + 1}`}
                >
                  {imageErrors.has(idx) ? (
                    <div className="w-full h-full bg-foreground/[0.05] flex items-center justify-center">
                      <span className="text-[9px] text-white/20 uppercase">—</span>
                    </div>
                  ) : (
                    <Image
                      src={src}
                      alt={`${title} — Miniatura ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 40px, (max-width: 768px) 50px, (max-width: 1024px) 60px, 72px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  )}
                  {idx === activeIndex && (
                    <div className="absolute inset-0 bg-gold-500/15 pointer-events-none" />
                  )}
                </button>
              ))}
              <div className="shrink-0 w-1 sm:w-2" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all active:scale-95"
              aria-label="Cerrar galería"
            >
              <X className="size-5" />
            </button>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-numerics font-medium border border-white/10">
                {lightboxIndex + 1} / {allImages.length}
              </span>
            </div>

            <div
              className="relative w-full h-full max-w-[90vw] max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  {imageErrors.has(lightboxIndex) ? (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-sm uppercase tracking-wider">
                      Sin imagen
                    </div>
                  ) : (
                    <Image
                      src={allImages[lightboxIndex]}
                      alt={`${title} — Vista completa ${lightboxIndex + 1}`}
                      fill
                      sizes="90vw"
                      priority
                      className="object-contain"
                      onError={() => handleImageError(lightboxIndex)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 hidden sm:flex items-center justify-center text-white transition-all active:scale-95"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 hidden sm:flex items-center justify-center text-white transition-all active:scale-95"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            {/* Lightbox thumbnails */}
            {allImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 max-w-[90vw] overflow-x-auto scrollbar-none">
                {allImages.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={cn(
                      "size-10 rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0",
                      idx === lightboxIndex
                        ? "border-gold-500"
                        : "border-transparent opacity-40 hover:opacity-70",
                    )}
                    aria-label={`Ir a imagen ${idx + 1}`}
                  >
                    {imageErrors.has(idx) ? (
                      <div className="w-full h-full bg-white/5" />
                    ) : (
                      <Image
                        src={src}
                        alt={`Miniatura ${idx + 1}`}
                        fill
                        sizes="40px"
                        className="object-cover"
                        loading="lazy"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
