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
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const thumbContainerRef = useRef<HTMLDivElement>(null);

  const handleImageError = (idx: number) => {
    setImageErrors((prev) => new Set(prev).add(idx));
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

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, allImages.length - 1));
      if (lightboxOpen) {
        setLightboxIndex(clamped);
      } else {
        setActiveIndex(clamped);
        if (thumbContainerRef.current) {
          const thumb = thumbContainerRef.current.children[clamped] as HTMLElement;
          if (thumb) {
            thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
          }
        }
      }
    },
    [lightboxOpen, allImages.length],
  );

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
  const hasError = imageErrors.has(displayIndex);

  return (
    <>
      {/* ── Main Carousel ── */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-white/[0.05] shadow-2xl shadow-black/40">
        <div
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:max-h-[560px] overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(activeIndex)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Only render active image + preload next */}
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-foreground/[0.03]">
              <span className="text-xs uppercase tracking-wider font-display text-foreground/50">
                Sin imagen
              </span>
            </div>
          ) : (
            <>
              <img
                src={allImages[displayIndex]}
                alt={`${title} — Imagen ${displayIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
                onError={() => handleImageError(displayIndex)}
                loading={displayIndex === 0 ? "eager" : "lazy"}
              />
              {/* Preload next image hidden */}
              <link rel="preload" as="image" href={allImages[(displayIndex + 1) % allImages.length]} />
            </>
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

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

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 size-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 hover:border-white/20 active:scale-95"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
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
              className="flex gap-2 overflow-x-auto snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {allImages.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`relative shrink-0 size-[52px] sm:size-[64px] md:size-[72px] rounded-xl overflow-hidden border-2 transition-all duration-300 snap-center ${
                    idx === activeIndex
                      ? "border-gold-500 shadow-[0_0_12px_rgba(207,177,85,0.3)]"
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
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all active:scale-95"
            aria-label="Cerrar galeria"
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
            {imageErrors.has(lightboxIndex) ? (
              <div className="text-white/50 text-sm uppercase tracking-wider">Sin imagen</div>
            ) : (
              <img
                src={allImages[lightboxIndex]}
                alt={`${title} — Imagen ${lightboxIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-xl"
                onError={() => handleImageError(lightboxIndex)}
              />
            )}

            {allImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all active:scale-95"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all active:scale-95"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
              {allImages.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`size-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    idx === lightboxIndex
                      ? "border-gold-500"
                      : "border-transparent opacity-40 hover:opacity-70"
                  }`}
                >
                  {imageErrors.has(idx) ? (
                    <div className="w-full h-full bg-white/5" />
                  ) : (
                    <img
                      src={src}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
