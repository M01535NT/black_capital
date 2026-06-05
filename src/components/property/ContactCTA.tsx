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
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-background/95 backdrop-blur-xl border-t border-foreground/10 safe-area-pb">
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
        <div className="bg-card border border-foreground/10 rounded-2xl p-5 space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--color-gold-500)/0.04,_transparent_60%)]" />
            <div className="relative z-10 space-y-4">
                <h3 className="font-display text-caption font-bold uppercase tracking-wide-display text-foreground/50">
                    ¿Te interesa?
                </h3>
                <p className="text-sm text-foreground/50 leading-relaxed">
                    Solicita información detallada o agenda una visita.
                </p>
                <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/25 active:scale-[0.98]"
                >
                    <MessageCircle className="size-4" />
                    Contactar por WhatsApp
                </a>
            </div>
        </div>
    );
}
