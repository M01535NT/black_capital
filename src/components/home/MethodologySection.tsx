"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    step: "01",
    title: "Diagnóstico del activo",
    text:
      "Revisamos ubicación, uso, estado, documentos y comparables antes de definir precio o ruta.",
    signal: "Base real",
    image: "/hero-luxury.webp",
  },
  {
    step: "02",
    title: "Valor y estrategia",
    text:
      "Definimos valor de salida, perfil de comprador y argumentos de venta o renta según el tipo de propiedad.",
    signal: "Precio claro",
    image: "/hero-business.webp",
  },
  {
    step: "03",
    title: "Exposición y filtro",
    text:
      "Mostramos el activo donde corresponde, filtramos prospectos y ordenamos visitas, consultas y ofertas.",
    signal: "Demanda útil",
    image: "/industrial-hero.webp",
  },
  {
    step: "04",
    title: "Negociación y cierre",
    text:
      "Acompañamos contrapropuestas, condiciones, documentación y coordinación notarial hasta la firma.",
    signal: "Firma limpia",
    image: "/hero-industrial.webp",
  },
];

export function MethodologySection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;

    const updateActiveStep = () => {
      frame = 0;
      const targetY = window.innerHeight * 0.52;
      let nextIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      stepRefs.current.forEach((node, idx) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const stepCenter = rect.top + rect.height * 0.42;
        const distance = Math.abs(stepCenter - targetY);

        if (distance < closestDistance) {
          closestDistance = distance;
          nextIndex = idx;
        }
      });

      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveStep);
    };

    updateActiveStep();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const activeStep = steps[activeIndex];
  const stepReveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 44, filter: "blur(8px)" },
        whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
        viewport: { amount: 0.42, margin: "-8% 0px -18% 0px" },
      };

  return (
    <section className="relative" data-section="home-methodology">
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
              De valor estimado a cierre.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <p className="max-w-md text-body text-white/58">
              Antes de publicar o visitar, revisamos activo, precio, mercado y documentos.
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
                <motion.li
                  key={item.step}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  {...stepReveal}
                  transition={{
                    duration: 0.78,
                    delay: idx * 0.035,
                    ease: EASE,
                  }}
                  className="relative pl-8 pb-12 last:pb-0 sm:pl-10 lg:min-h-[34vh] lg:pb-16"
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
                </motion.li>
              );
            })}
            <li aria-hidden="true" className="hidden lg:block h-[42vh]" />
          </ol>

          {/* Right: sticky image synced with active step (desktop only) */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-28">
              <div className="relative h-[min(38rem,calc(100svh-10rem))] overflow-hidden border border-white/[0.08]">
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
