"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const criteria = [
  {
    value: "Privacidad",
    label: "Acceso, entorno y condiciones de uso antes de visitar.",
    image: "/brand-luxury.webp",
    position: "object-[48%_50%]",
  },
  {
    value: "Zona",
    label: "Ubicaciones con servicios, conectividad y plusvalía residencial.",
    image: "/hero-luxury.webp",
    position: "object-[58%_50%]",
  },
  {
    value: "Diseño",
    label: "Distribución, luz, acabados y mantenimiento visible.",
    image: "/brand-luxury.webp",
    position: "object-[72%_50%]",
  },
  {
    value: "Valor",
    label: "Comparables para comprar o vender con mejor contexto.",
    image: "/hero-luxury.webp",
    position: "object-[43%_50%]",
  },
];

export function LuxuryCriteria() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((node, index) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index);
        },
        { threshold: 0.58, rootMargin: "-28% 0px -28% 0px" },
      );
      observer.observe(node);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [shouldReduceMotion]);

  const active = criteria[activeIndex];

  return (
    <section
      id="luxury-stats"
      aria-label="Criterios residenciales Black Luxury"
      className="relative overflow-hidden border-y border-white/[0.06] bg-white/[0.02]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent"
      />

      <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mb-12 grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mb-3 property-tag-type gold-ink">Criterios residenciales</p>
            <h2 className="text-display-2 text-white">Menos recorrido. Mejor decisión.</h2>
          </div>
          <p className="max-w-md text-body text-white/58 lg:col-span-5 lg:ml-auto">
            Cada opción se revisa por privacidad, zona, estado y valor comercial
            antes de recomendar una visita.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden border border-white/[0.08] bg-white/[0.02]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`${active.image}-${active.position}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.06, clipPath: "inset(6% 0% 0% 0%)" }}
                    animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.58, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={active.image}
                      alt={`${active.value} residencial Black Luxury`}
                      fill
                      sizes="(max-width: 1024px) 0vw, 52vw"
                      className={`object-cover ${active.position}`}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/48 via-black/6 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/22 via-transparent to-transparent" />
                <div className="grain-overlay opacity-[0.08]" aria-hidden="true" />
                <div className="absolute inset-x-6 bottom-6">
                  <p className="property-tag-type gold-ink">Criterio activo</p>
                  <p className="mt-2 text-display-3 text-white">{active.value}</p>
                </div>
              </div>
            </div>
          </div>

          <ol className="lg:col-span-5">
            {criteria.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={item.value}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  className="group border-b border-white/[0.08] py-7 first:pt-0 last:border-b-0"
                >
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden border border-white/[0.08] lg:hidden">
                    <Image
                      src={item.image}
                      alt={`${item.value} residencial Black Luxury`}
                      fill
                      sizes="100vw"
                      className={`object-cover ${item.position}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/52 via-black/8 to-transparent" />
                  </div>
                  <div className="flex items-baseline justify-between gap-5">
                    <p className={`property-tag-type transition-colors duration-500 ${isActive ? "gold-ink" : "text-white/42"}`}>
                      0{index + 1}
                    </p>
                    <span
                      aria-hidden="true"
                      className={`h-px flex-1 origin-left transition-transform duration-700 ${
                        isActive ? "scale-x-100 bg-[var(--color-accent)]/45" : "scale-x-75 bg-white/[0.08]"
                      }`}
                    />
                  </div>
                  <h3 className={`mt-5 text-display-3 transition-colors duration-500 ${isActive ? "text-white" : "text-white/62"}`}>
                    {item.value}
                  </h3>
                  <p className={`mt-3 text-body transition-colors duration-500 ${isActive ? "text-white/72" : "text-white/50"}`}>
                    {item.label}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
