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
    node.scrollBy({ left: direction * ((firstCard?.offsetWidth ?? node.clientWidth) + 24), behavior: reduce ? "instant" : "smooth" });
  }

  return (
    <div>
      <div className="mb-5 flex justify-end gap-2">
        <button type="button" aria-label="Propiedades anteriores" aria-controls={trackId} onClick={() => move(-1)} className="flex h-11 w-11 items-center justify-center border border-white/12 text-white/70 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-95">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" aria-label="Siguientes propiedades" aria-controls={trackId} onClick={() => move(1)} className="flex h-11 w-11 items-center justify-center border border-white/12 text-white/70 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-95">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div ref={track} id={trackId} role="region" aria-label="Propiedades destacadas" tabIndex={0} className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]">
        {properties.map((property, i) => (
          <div key={property.id} className="w-full shrink-0 snap-start sm:w-[380px]">
            <PropertyCard property={property} index={i} disableMotion />
          </div>
        ))}
      </div>
    </div>
  );
}
