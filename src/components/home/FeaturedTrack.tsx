"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";

/**
 * Carrusel horizontal draggable de propiedades destacadas (framer-motion).
 * En reduced-motion cae a scroll nativo con snap. El drag se restringe al
 * contenedor exterior (patrón dragConstraints={ref}).
 */
export function FeaturedTrack({ properties }: { properties: PropertyCardData[] }) {
  const reduce = useReducedMotion();
  const constraints = useRef<HTMLDivElement>(null);

  if (reduce) {
    return (
      <div className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16">
        {properties.map((property, i) => (
          <div key={property.id} className="w-[85vw] shrink-0 snap-center sm:w-[380px]">
            <PropertyCard property={property} index={i} disableMotion />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={constraints} className="-mx-6 cursor-grab overflow-hidden px-6 active:cursor-grabbing sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16">
      <motion.div
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.08}
        dragMomentum
        className="flex gap-6"
      >
        {properties.map((property, i) => (
          <div key={property.id} className="w-[85vw] shrink-0 select-none sm:w-[380px]">
            <PropertyCard property={property} index={i} disableMotion />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
