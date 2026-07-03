"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPropertyPlaceholderImage } from "@/lib/property-placeholder-image";

interface ImageGalleryProps {
  images: string[];
  title: string;
  coverImage?: string | null;
  propertyUse?: string | null;
  videos?: string[];
}

export function ImageGallery({
  images,
  title,
  coverImage,
  propertyUse,
}: ImageGalleryProps) {
  const fallbackImage = getPropertyPlaceholderImage(propertyUse);
  // ── Build unique ordered image list (cover first, no duplicates) ──
  const allImages: string[] = [];
  if (coverImage) allImages.push(coverImage);
  for (const img of images) {
    if (img && !allImages.includes(img)) allImages.push(img);
  }
  if (allImages.length === 0) allImages.push(fallbackImage.src);

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
    const container = thumbContainerRef.current;
    if (!container) return;
    const thumb = container.children[index] as HTMLElement | undefined;
    if (!thumb) return;

    const target =
      thumb.offsetLeft - (container.clientWidth - thumb.clientWidth) / 2;
    container.scrollTo({
      left: Math.max(0, target),
      behavior: "smooth",
    });
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

  // ── Lightbox swipe refs (must be before early return) ──
  const lightboxTouchStartX = useRef(0);
  const lightboxTouchEndX = useRef(0);

  const displayIndex = lightboxOpen ? lightboxIndex : activeIndex;
  const hasError = imageErrors.has(displayIndex);
  const isLoading = !hasError && !hasLoaded.has(displayIndex);
  const displaySrc = hasError ? fallbackImage.src : allImages[displayIndex];

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

  return (
    <>
      {/* ── Main Carousel ── */}
      <div className="relative w-full max-w-full overflow-hidden border border-white/[0.08] bg-black shadow-2xl shadow-black/40">
        <div
          className={cn(
            "relative w-full overflow-hidden cursor-pointer group",
            // Compacto, no hero. Topes relativos al viewport en desktop para que
            // la galería quepa en pantalla (no se corte bajo el encabezado).
            "aspect-[4/3] max-h-[440px]",
            "sm:aspect-[16/10] sm:max-h-[500px]",
            "md:aspect-[16/10] md:max-h-[58vh]",
            "lg:aspect-[3/2] lg:max-h-[62vh]",
            "xl:max-h-[66vh]",
          )}
          onClick={() => openLightbox(activeIndex)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-label={`Ampliar imagen ${displayIndex + 1} de ${allImages.length}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openLightbox(activeIndex);
            }
          }}
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
              <Image
                src={displaySrc}
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

              {/* Loading shimmer */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/[0.03] z-10">
                  <div className="w-8 h-8 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Expand icon hint */}
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
              <ZoomIn className="size-4 text-white/80" />
            </div>
          </div>

          {/* Counter */}
          <div className="absolute left-4 top-4 z-20">
              <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 property-metadata-type text-white/90 backdrop-blur-md">
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
                className="absolute left-2 top-1/2 z-20 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black focus-visible:opacity-100 active:scale-95 group-hover:opacity-100 sm:left-3 sm:flex sm:size-10"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="size-4 sm:size-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 top-1/2 z-20 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black focus-visible:opacity-100 active:scale-95 group-hover:opacity-100 sm:right-3 sm:flex sm:size-10"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="size-4 sm:size-5" />
              </button>
            </>
          )}
        </div>

        {/* ── Thumbnail strip ── */}
        {allImages.length > 1 && (
          <div className="w-full bg-black/80 backdrop-blur-sm border-t border-white/5 px-3 sm:px-4 py-2.5 sm:py-3">
            <div
              ref={thumbContainerRef}
              className="scrollbar-none flex max-w-full snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain scroll-px-3 sm:gap-3 sm:scroll-px-4"
            >
              {allImages.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={cn(
                    "relative shrink-0 snap-center overflow-hidden border-2 transition-all duration-300",
                    // Thumb sizes: 48 (móvil) → 60 (tablet) → 72 (desktop)
                    "h-12 w-12",
                    "md:h-[60px] md:w-[60px]",
                    "lg:h-[72px] lg:w-[72px]",
                    idx === activeIndex
                      ? "border-[var(--color-accent)] shadow-[0_0_12px_rgba(210,167,60,0.35)]"
                      : "border-transparent opacity-50 hover:opacity-80 hover:border-white/20",
                  )}
                  aria-label={`Ver imagen ${idx + 1}`}
                >
                  <Image
                    src={imageErrors.has(idx) ? fallbackImage.src : src}
                    alt={`${title} — Miniatura ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 40px, (max-width: 768px) 50px, (max-width: 1024px) 60px, 72px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {idx === activeIndex && (
                    <div className="absolute inset-0 bg-[var(--color-accent)]/15 pointer-events-none" />
                  )}
                </button>
              ))}
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
            role="dialog"
            aria-modal="true"
            aria-label={`Galería de ${title}`}
            onClick={closeLightbox}
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
              aria-label="Cerrar galería"
            >
              <X className="size-5" />
            </button>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 property-metadata-type text-white backdrop-blur-md">
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
                  <Image
                    src={imageErrors.has(lightboxIndex) ? fallbackImage.src : allImages[lightboxIndex]}
                    alt={`${title} — Vista completa ${lightboxIndex + 1}`}
                    fill
                    sizes="90vw"
                    priority
                    className="object-contain"
                    onError={() => handleImageError(lightboxIndex)}
                  />
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
                  className="absolute left-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 sm:flex"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 sm:flex"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            {/* Lightbox thumbnails */}
            {allImages.length > 1 && (
              <div className="scrollbar-none absolute bottom-6 left-1/2 z-10 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto border border-white/10 bg-black/60 p-2 backdrop-blur-md">
                {allImages.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={cn(
                      "relative size-10 shrink-0 overflow-hidden border-2 transition-all duration-200",
                      idx === lightboxIndex
                        ? "border-[var(--color-accent)]"
                        : "border-transparent opacity-40 hover:opacity-70",
                    )}
                    aria-label={`Ir a imagen ${idx + 1}`}
                  >
                    <Image
                      src={imageErrors.has(idx) ? fallbackImage.src : src}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      sizes="40px"
                      className="object-cover"
                      loading="lazy"
                    />
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
