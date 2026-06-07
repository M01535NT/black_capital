import { MessageCircle } from "lucide-react";
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
      className="brushed-gold fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(212,175,55,0.25)] hover:scale-105 transition-transform duration-300"
    >
      <MessageCircle className="w-6 h-6" strokeWidth={2} aria-hidden="true" />
    </a>
  );
}
