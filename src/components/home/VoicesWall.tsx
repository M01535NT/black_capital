"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EASE_OUT, Reveal } from "./_motion";

const VOICES = [
  {
    quote: "Nos explicaron precio, zona y condiciones antes de hacer oferta.",
    attribution: "M. R.",
    role: "Propietario, Chapultepec",
  },
  {
    quote: "Revisaron superficie, accesos y maniobra antes de descartar la nave.",
    attribution: "L. F.",
    role: "Inversionista, Otay",
  },
  {
    quote: "Definimos valor comercial, preparamos la venta y cerramos en el tiempo previsto.",
    attribution: "A. G.",
    role: "Familia compradora, Zona Río",
  },
];

const AUTOPLAY_MS = 6500;

export function VoicesWall() {
  const reduce = useReducedMotion();
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback((dir: number) => {
    setState(([current]) => [(current + dir + VOICES.length) % VOICES.length, dir]);
  }, []);

  const goTo = useCallback(
    (target: number) => setState(([current]) => [target, target > current ? 1 : -1]),
    [],
  );

  // Auto-avance; se pausa en hover/drag y bajo reduced-motion.
  useEffect(() => {
    if (paused || reduce) return;
    const id = setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, reduce, paginate]);

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -300) paginate(1);
    else if (info.offset.x > 60 || info.velocity.x > 300) paginate(-1);
  };

  const active = VOICES[index];

  const variants = {
    enter: (dir: number) => ({ x: reduce ? 0 : dir > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: reduce ? 0 : dir > 0 ? -48 : 48, opacity: 0 }),
  };

  return (
    <section
      aria-label="Voces de clientes Black Capital"
      className="relative border-t border-white/[0.08] bg-white/[0.02]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent"
      />
      <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <Reveal className="mb-10 max-w-2xl">
          <h2 className="text-display-2 leading-display tracking-headline text-white">
            Ya confiaron en nosotros.
          </h2>
          <p className="mt-4 max-w-md text-body leading-snug text-white/58">
            Compraron, vendieron o evaluaron con mejor información.
          </p>
        </Reveal>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* Área de la cita: min-height fija para evitar saltos de layout */}
          <div className="relative min-h-[15rem] overflow-hidden border border-white/[0.1] bg-background/50 sm:min-h-[13rem]">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.blockquote
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: EASE_OUT }}
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragStart={() => setPaused(true)}
                onDragEnd={onDragEnd}
                aria-live="polite"
                className="flex h-full cursor-grab flex-col justify-center px-6 py-9 active:cursor-grabbing sm:px-10 lg:px-14"
              >
                <span aria-hidden="true" className="gold-ink font-display text-5xl font-extrabold leading-none opacity-30 lg:text-6xl">
                  &ldquo;
                </span>
                <p className="mt-2 max-w-3xl text-[clamp(1.15rem,2.2vw,1.6rem)] font-medium leading-relaxed text-white/90">
                  {active.quote}
                </p>
                <footer className="mt-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-[var(--color-accent)]/50" aria-hidden="true" />
                  <span className="property-tag-type text-white">{active.attribution}</span>
                  <span className="text-body-sm text-white/50">{active.role}</span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controles: puntos + flechas */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5" role="tablist" aria-label="Testimonios">
              {VOICES.map((v, i) => (
                <button
                  key={v.attribution}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Ver testimonio ${i + 1} de ${VOICES.length}`}
                  onClick={() => goTo(i)}
                  className="group flex h-6 items-center"
                >
                  <span
                    className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out ${
                      i === index
                        ? "w-7 bg-[var(--color-accent)]"
                        : "w-1.5 bg-white/25 group-hover:bg-white/50"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 property-tag-type tabular-nums text-white/40">
                {String(index + 1).padStart(2, "0")} / {String(VOICES.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => paginate(-1)}
                aria-label="Testimonio anterior"
                className="flex h-11 w-11 items-center justify-center border border-white/12 text-white/70 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                aria-label="Siguiente testimonio"
                className="flex h-11 w-11 items-center justify-center border border-white/12 text-white/70 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-95"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
