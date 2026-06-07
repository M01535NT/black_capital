"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Section } from "@/components/layout/Section";
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
  const [activeIdx, setActiveIdx] = useState<number | null>(0); // first item open by default for mobile (no hover)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const shouldReduce = useReducedMotion();

  const focusIdx = hoveredIdx ?? activeIdx;

  return (
    <Section id="valores" label="Nuestra palabra">
      <SectionHeader
        eyebrow="Nuestra palabra"
        title={<>Nuestro <span className="metallic-gold-static">compromiso</span>.</>}
      />

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
                  aria-expanded={activeIdx === i}
                  className="group w-full text-left py-10 sm:py-14 lg:py-16 flex items-start gap-6 sm:gap-10 transition-opacity duration-700"
                  style={{ opacity: isDimmed ? 0.35 : isFocused ? 1 : 0.55 }}
                >
                  {/* Number */}
                  <span
                    className={cn(
                      "shrink-0 text-[clamp(1.5rem,2.5vw,2.25rem)] font-light tabular-nums leading-none mt-2 transition-colors duration-700",
                      isFocused ? "metallic-gold-static" : "text-white/55",
                    )}
                    aria-hidden="true"
                  >
                    {v.number}
                  </span>

                  {/* Title + body */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        "text-[clamp(1.5rem,2.8vw,2.5rem)] font-light leading-display tracking-display transition-colors duration-700",
                        isFocused ? "text-white" : "text-white/90",
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
                          <p className="text-body-fluid-sm text-white/90 leading-relaxed font-light max-w-3xl pt-6">
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
                        ? "border-accent text-accent rotate-45"
                        : "border-white/30 text-white/70",
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
    </Section>
  );
}
