"use client";

import { useId, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";

export function FeaturedTrack({ properties }: { properties: PropertyCardData[] }) {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const trackId = useId();

  function move(direction: number) {
    const node = track.current;
    if (!node) return;
    const firstCard = node.firstElementChild as HTMLElement | null;
    node.scrollBy({ left: direction * ((firstCard?.offsetWidth ?? node.clientWidth) + parseFloat(getComputedStyle(node).columnGap || "0")), behavior: reduce ? "instant" : "smooth" });
  }

  return (
    <div>
      <div className="mb-7 flex items-center justify-end gap-3 px-6 sm:px-10 lg:px-16">
        <button type="button" aria-label="Propiedades anteriores" aria-controls={trackId} onClick={() => move(-1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-95">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" aria-label="Siguientes propiedades" aria-controls={trackId} onClick={() => move(1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-95">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div ref={track} id={trackId} role="region" aria-label="Propiedades destacadas" tabIndex={0} className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 [scroll-padding-inline:1.5rem] sm:gap-8 sm:px-10 sm:[scroll-padding-inline:2.5rem] lg:px-16 lg:[scroll-padding-inline:4rem] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]">
        {properties.map((property, i) => (
          <div key={property.id} className="w-[85vw] max-w-[850px] shrink-0 snap-start md:w-[65vw]">
            <PropertyCard property={property} variant="featured" index={i} disableMotion />
          </div>
        ))}
      </div>
    </div>
  );
}
