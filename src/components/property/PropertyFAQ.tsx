"use client";

import { useState } from "react";

/**
 * FAQ del capítulo "Preguntas" de la ficha (plantilla sección 07):
 * acordeón numerado, respuestas genéricas parametrizadas por tipo de operación.
 */
export function PropertyFAQ({ businessType }: { businessType: string }) {
    const isSale = businessType === "Venta";
    const faqs = [
        {
            q: "¿Cuál es la situación legal de la propiedad?",
            a: "Revisamos escritura, boleta predial y gravámenes antes de publicar. La carpeta documental está disponible para revisión con tu notario a través de la solicitud de documentos de esta página.",
        },
        isSale
            ? {
                  q: "¿Aceptan financiamiento bancario?",
                  a: "Sí: crédito bancario, INFONAVIT/FOVISSSTE y pago de contado, según el perfil de la operación. Usa la calculadora de esta página para estimar tu mensualidad y te conectamos con instituciones para precalificar.",
              }
            : {
                  q: "¿Qué requisitos piden para rentar?",
                  a: "Identificación, comprobante de ingresos y aval u obligado solidario según el caso. Te confirmamos la lista exacta al agendar la visita.",
              },
        {
            q: "¿Puedo visitarla antes de decidir?",
            a: "Claro. Coordinamos una visita guiada con un asesor, con información previa del inmueble, la zona y las condiciones de la operación.",
        },
        {
            q: "¿Cuánto tarda el proceso completo?",
            a: "Depende de la documentación y el tipo de pago. Desde el diagnóstico definimos una ruta de cierre con tiempos estimados por etapa para que sepas qué esperar.",
        },
    ];

    const [open, setOpen] = useState<number | null>(0);

    return (
        <div className="border-b border-white/[0.1]">
            {faqs.map((faq, index) => {
                const isOpen = open === index;
                const panelId = `prop-faq-${index}`;
                return (
                    <div key={faq.q} className="border-t border-white/[0.1]">
                        <button
                            type="button"
                            onClick={() => setOpen(isOpen ? null : index)}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:text-[var(--color-accent)] sm:gap-5"
                        >
                            <span className="shrink-0 font-display text-[0.7rem] font-bold tabular-nums text-[var(--color-accent)]">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="flex-1 font-display text-body-lg font-bold leading-snug text-white">
                                {faq.q}
                            </span>
                            <span
                                aria-hidden="true"
                                className="shrink-0 font-display text-xl leading-none text-[var(--color-accent)]"
                            >
                                {isOpen ? "−" : "+"}
                            </span>
                        </button>
                        <div
                            id={panelId}
                            role="region"
                            aria-hidden={!isOpen}
                            className={`grid transition-all duration-300 ${
                                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                            <div className="overflow-hidden">
                                <p className="max-w-xl pb-5 pl-8 text-body-sm leading-relaxed text-white/60 sm:pl-9">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
