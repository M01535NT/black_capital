"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTACT_CONFIG } from "@/lib/contact-config";

const FAQS = [
  {
    q: "¿Cobran por estimar el valor?",
    a: "La estimación inicial no tiene costo. Si necesitas avalúo formal, te conectamos con un perito autorizado.",
  },
  {
    q: "¿Qué documentos revisan antes de avanzar?",
    a: "Precio, zona, estado general y documentos básicos. La revisión completa depende del tipo de inmueble.",
  },
  {
    q: "¿Trabajan renta además de venta?",
    a: "Sí. Trabajamos compra, venta y renta residencial, comercial e industrial.",
  },
  {
    q: "¿En qué zonas trabajan?",
    a: "Principalmente Tijuana y zonas cercanas. Podemos revisar si tu zona encaja con el tipo de inmueble.",
  },
  {
    q: "¿Cuánto tarda una compra o venta?",
    a: "Depende del inmueble, documentos y forma de pago. Desde el inicio te explicamos los pasos probables.",
  },
];

const whatsappHref = `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(
  "Hola, tengo una duda sobre un inmueble.",
)}`;

export function HomeFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative border-t border-white/[0.08]">
      <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-16 lg:py-24">
        <div className="mb-10 lg:mb-0">
          <p className="mb-3 property-tag-type gold-ink">Preguntas frecuentes</p>
          <h2 className="text-display-2 leading-display tracking-headline text-white">
            Antes de empezar.
          </h2>
          <p className="mt-5 max-w-sm text-body text-white/58">
            ¿Otra duda? Escríbenos por WhatsApp y te orientamos directo.
          </p>
          <Link
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            className="group mt-6 inline-flex items-center gap-2 text-white/85 transition-colors hover:text-[var(--color-accent)]"
          >
            <span className="property-tag-type relative pb-1">
              Escribir por WhatsApp
              <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
            </span>
          </Link>
        </div>

        <div className="border-b border-white/[0.08]">
          {FAQS.map((faq, index) => {
            const isOpen = open === index;
            const panelId = `faq-panel-${index}`;
            return (
              <div key={faq.q} className="border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-[var(--color-accent)]"
                >
                  <span className="font-display text-display-4 font-bold leading-snug text-white">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-display text-2xl leading-none text-[var(--color-accent)]"
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
                    <p className="max-w-xl pb-6 text-body text-white/60">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
