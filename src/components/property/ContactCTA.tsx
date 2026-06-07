import { MessageCircle } from "lucide-react";

/**
 * The "Contáctanos por WhatsApp" CTA. Two variants:
 *  - "sidebar" (default): full card with heading, description, and prominent button.
 *  - "sticky": minimal bar for mobile, only the price + button.
 */
export function ContactCTA({
    whatsappHref,
    priceLabel,
    variant = "sidebar",
}: {
    whatsappHref: string;
    priceLabel?: string;
    variant?: "sidebar" | "sticky";
}) {
    if (variant === "sticky") {
        return (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/[0.06] shadow-2xl" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}>
                <div className="flex items-center gap-3">
                    {priceLabel && (
                        <div className="flex-1 min-w-0">
                            <p className="font-numerics font-bold text-gold-500 text-base sm:text-lg">
                                {priceLabel}
                            </p>
                        </div>
                    )}
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-full bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition-colors shrink-0 shadow-lg shadow-gold-500/25 active:scale-[0.98]"
                    >
                        <MessageCircle className="size-4" />
                        Contactar
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="relative z-10 space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/48">
                    ¿Te interesa?
                </h3>
                <p className="text-sm leading-relaxed text-white/58">
                    Solicita información detallada o agenda una visita.
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brushed-gold flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold tracking-wide transition-all duration-300 hover:brightness-105"
                >
                    <MessageCircle className="size-4" />
                    Contactar por WhatsApp
                </a>
            </div>
        </div>
    );
}
