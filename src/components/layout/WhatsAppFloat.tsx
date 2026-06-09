"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { CONTACT_CONFIG } from "@/lib/contact-config";

/**
 * Botón flotante de WhatsApp — visible en todo el sitio público.
 *
 * Single CTA persistente: wa.me con mensaje predefinido desde
 * CONTACT_CONFIG. Renderizado en el layout público, una sola vez,
 * para no duplicar el link (Footer ya tiene uno en sus social icons
 * — este es la versión "always-on" de conversión).
 */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const isPropertyDetail = /^\/inventario\/[^/]+/.test(pathname);
  const href = `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(
    "Hola, me gustaría recibir información sobre propiedades de inversión.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp · ${CONTACT_CONFIG.phone}`}
      title={`WhatsApp · ${CONTACT_CONFIG.phone}`}
      data-testid="whatsapp-float"
      className={`gold-gradient fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] right-5 z-[90] h-14 w-14 items-center justify-center rounded-full text-black shadow-[0_10px_34px_rgba(210,167,60,0.28)] transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold-light)] sm:bottom-6 sm:right-6 lg:flex lg:h-16 lg:w-16 ${isPropertyDetail ? "hidden" : "flex"}`}
    >
      <MessageCircle className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={2} aria-hidden="true" />
    </a>
  );
}
