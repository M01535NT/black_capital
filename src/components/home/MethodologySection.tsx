"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    step: "01",
    title: "Conocimiento local",
    text:
      "Leemos zonas, usos y demanda real antes de proponer una ruta. La opinión empieza con datos del terreno.",
    signal: "Ventaja local",
    image: "/hero-luxury.webp",
  },
  {
    step: "02",
    title: "Diagnóstico del activo",
    text:
      "Tipología, ocupación, contexto legal y comparables. Lo que el activo es, y lo que el mercado pagará por él.",
    signal: "Ruta clara",
    image: "/hero-business.webp",
  },
  {
    step: "03",
    title: "Estrategia y negociación",
    text:
      "Marketing dirigido, contraparte calibrada y mapa de decisiones. Cierre por criterio, no por desgaste.",
    signal: "Sin ruido",
    image: "/industrial-hero.webp",
  },
  {
    step: "04",
    title: "Cierre con respaldo",
    text:
      "Documentación, asesoría notarial y criterio comercial hasta la firma. La operación termina cuando todo está limpio.",
    signal: "Criterio",
    image: "/hero-industrial.webp",
  },
];

export function MethodologySection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((node, idx) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(idx);
        },
        { threshold: 0.6, rootMargin: "-30% 0px -30% 0px" },
      );
      observer.observe(node);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const activeStep = steps[activeIndex];

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent"
      />
      <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mb-3 property-tag-type gold-ink">
              Metodología Black Capital
            </p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Información, criterio, cierre.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <p className="max-w-md text-body text-white/58">
              Cuatro pasos que convierten una opinión inicial en una operación
              firmada — sin pasos perdidos en el camino.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: vertical timeline */}
          <ol className="relative lg:col-span-5">
            <span
              aria-hidden="true"
              className="absolute left-[5px] top-2 bottom-6 w-px bg-white/[0.08]"
            />
            {steps.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <li
                  key={item.step}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  className="relative pl-8 pb-12 last:pb-0 sm:pl-10"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-[0.65rem] h-3 w-3 rounded-full border transition-all duration-500 ${
                      isActive
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] shadow-[0_0_0_5px_rgba(210,167,60,0.18)]"
                        : "border-white/30 bg-background"
                    }`}
                  />

                  {/* Mobile: distinct poster image per step */}
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden border border-white/[0.08] lg:hidden">
                    <Image
                      src={item.image}
                      alt={`${item.title} — Black Capital`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex border border-white/20 bg-black/40 px-2.5 py-1 property-tag-type gold-ink backdrop-blur-sm">
                      Paso {item.step}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-4 border-b border-[var(--color-accent)]/25 pb-3">
                    <p
                      className={`property-tag-type transition-colors duration-500 ${
                        isActive ? "gold-ink" : "text-white/55"
                      }`}
                    >
                      {item.step}
                    </p>
                    <span className="text-caption text-white/55">
                      {item.signal}
                    </span>
                  </div>
                  <h3
                    className={`mt-5 text-display-3 leading-tight transition-colors duration-500 ${
                      isActive ? "text-white" : "text-white/65"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-3 text-body transition-colors duration-500 ${
                      isActive ? "text-white/75" : "text-white/50"
                    }`}
                  >
                    {item.text}
                  </p>
                </li>
              );
            })}
          </ol>

          {/* Right: sticky image synced with active step (desktop only) */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden border border-white/[0.08]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeStep.image}
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, scale: 1.08 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={
                      shouldReduceMotion
                        ? undefined
                        : { opacity: 0, scale: 1.02 }
                    }
                    transition={{ duration: 0.7, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeStep.image}
                      alt={`${activeStep.title} — Black Capital`}
                      fill
                      sizes="(max-width: 1024px) 0vw, 50vw"
                      className="object-cover"
                      priority={activeIndex === 0}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="property-tag-type gold-ink">
                      Paso {activeStep.step}
                    </p>
                    <p className="mt-2 text-display-3 leading-tight text-white">
                      {activeStep.title}
                    </p>
                  </div>
                  <ol className="flex shrink-0 items-center gap-2">
                    {steps.map((item, idx) => (
                      <li
                        key={item.step}
                        aria-current={idx === activeIndex ? "step" : undefined}
                        className={`h-1 w-8 rounded-full transition-colors duration-500 ${
                          idx === activeIndex
                            ? "bg-[var(--color-accent)]"
                            : "bg-white/15"
                        }`}
                      />
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />
    </section>
  );
}
