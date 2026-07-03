"use client";

import { useState } from "react";
import type { PropertyFaq } from "@/lib/property-faqs";

function genericFaqs(businessType: string): PropertyFaq[] {
    const isSale = businessType === "Venta";
    return [
        {
            q: "¿Cuál es la situación legal de la propiedad?",
            a: "Podemos compartir documentos disponibles bajo solicitud. Revisa detalles finales con tu notario antes de cerrar.",
        },
        isSale
            ? {
                  q: "¿Aceptan financiamiento bancario?",
                  a: "Puede aplicar crédito bancario, INFONAVIT/FOVISSSTE o pago de contado según la propiedad. Usa la calculadora como referencia inicial.",
              }
            : {
                  q: "¿Qué requisitos piden para rentar?",
                  a: "Normalmente identificación, comprobante de ingresos y aval u obligado solidario. Te confirmamos la lista exacta antes de avanzar.",
              },
        {
            q: "¿Puedo visitarla antes de decidir?",
            a: "Sí. Coordinamos una visita con información previa del inmueble, la zona y las condiciones principales.",
        },
        {
            q: "¿Cuánto tarda comprar o rentar?",
            a: "Depende de documentos, forma de pago y disponibilidad. Te explicamos los pasos probables desde el inicio.",
        },
    ];
}

/**
 * FAQ del capítulo "Preguntas" de la ficha (plantilla sección 07): acordeón
 * numerado. Usa las preguntas propias de la propiedad si existen; si no, cae a
 * un set genérico parametrizado por tipo de movimiento.
 */
export function PropertyFAQ({
    businessType,
    faqs: customFaqs,
}: {
    businessType: string;
    faqs?: PropertyFaq[];
}) {
    const faqs = customFaqs && customFaqs.length > 0 ? customFaqs : genericFaqs(businessType);

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
