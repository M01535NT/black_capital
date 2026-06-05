"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Value {
  number: string;
  title: string;
  body: string;
}

const VALUES: Value[] = [
  {
    number: "01",
    title: "No vendemos humo.",
    body: "Cada propiedad tiene un análisis financiero estructurado detrás: TIR, cap rate, yield objetivo, escenarios de salida a 3, 5 y 10 años. Sin atajos, sin aproximaciones. Si un activo no pasa nuestro filtro cuantitativo, no entra al inventario, por más bonito que se vea la foto.",
  },
  {
    number: "02",
    title: "El trato es directo.",
    body: "Sin intermediarios innecesarios, sin comisiones ocultas, sin vendedores girando el mismo activo. Tú hablas con la persona que estructura la operación. Una línea de comunicación, una mesa de decisión. Así cerramos más rápido y mejor.",
  },
  {
    number: "03",
    title: "Tu patrimonio, en serio.",
    body: "Lo tratamos como si fuera el nuestro. Porque así empezamos — compramos, vendimos, estructuramos y vivimos con nuestras propias tesis antes de ofrecerlas. Esa es la diferencia entre un bróker que muestra propiedades y un operador que las respalda.",
  },
];

/**
 * Valores / Promesas — Lista de hover (no accordion tradicional, no cards).
 * Por defecto todos atenuados al 40% de opacidad. Al hacer hover en uno,
 * este se ilumina al 100% y los demás bajan a 25%. El body se expande
 * con animación al pasar el cursor. Click fija el estado activo.
 */
export function ValuesAccordion() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const shouldReduce = useReducedMotion();

  const focusIdx = hoveredIdx ?? activeIdx;

  return (
    <section
      id="valores"
      className="scroll-snap-section relative py-24 sm:py-32 lg:py-40 bg-[#050505] border-t border-white/[0.04]"
      aria-label="Nuestra palabra"
    >
      <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16">
        {/* ── Header ── */}
        <div className="max-w-2xl mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[var(--color-accent)]/60" />
            <span className="text-[11px] tracking-[0.22em] uppercase text-white/70 font-semibold">
              Nuestra palabra
            </span>
          </div>
          <h2 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-light text-white leading-[1.05] tracking-[-0.03em]">
            Lo que <span className="metallic-gold-static">sí cumplimos</span>.
          </h2>
        </div>

        {/* ── List ── */}
        <ul
          className="border-t border-white/[0.06]"
          role="list"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {VALUES.map((v, i) => {
            const isFocused = focusIdx === i;
            const isDimmed = focusIdx !== null && !isFocused;

            return (
              <li
                key={v.number}
                className="border-b border-white/[0.06]"
                onMouseEnter={() => setHoveredIdx(i)}
              >
                <button
                  type="button"
                  onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                  aria-expanded={isFocused}
                  className="group w-full text-left py-10 sm:py-14 lg:py-16 flex items-start gap-6 sm:gap-10 transition-opacity duration-700"
                  style={{ opacity: isDimmed ? 0.25 : isFocused ? 1 : 0.4 }}
                >
                  {/* Number */}
                  <span
                    className={cn(
                      "shrink-0 text-[clamp(1.5rem,2.5vw,2.25rem)] font-light tabular-nums leading-none mt-2 transition-colors duration-700",
                      isFocused ? "metallic-gold-static" : "text-white/30",
                    )}
                    aria-hidden="true"
                  >
                    {v.number}
                  </span>

                  {/* Title + body */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        "text-[clamp(1.5rem,2.8vw,2.5rem)] font-light leading-[1.1] tracking-[-0.02em] transition-colors duration-700",
                        isFocused ? "text-white" : "text-white/80",
                      )}
                    >
                      {v.title}
                    </h3>

                    <AnimatePresence initial={false}>
                      {isFocused && (
                        <motion.div
                          key="body"
                          initial={shouldReduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={shouldReduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-[clamp(0.9375rem,1.15vw,1.0625rem)] text-white/65 leading-[1.75] font-light max-w-3xl pt-6">
                            {v.body}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Toggle indicator */}
                  <span
                    className={cn(
                      "shrink-0 mt-2 w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-500",
                      isFocused
                        ? "border-[var(--color-accent)] text-[var(--color-accent)] rotate-45"
                        : "border-white/15 text-white/50",
                    )}
                    aria-hidden="true"
                  >
                    <Plus className="w-4 h-4" strokeWidth={1.25} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
