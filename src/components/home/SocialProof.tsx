/**
 * SocialProof — authority counters shown on the home page.
 *
 * Server component: fetches live stats from Supabase (see lib/stats.ts).
 * The inner `Counter` is a client island that handles the on-scroll
 * number-roll animation.
 */
import { FadeIn } from "@/components/ui/motion";
import { Counter } from "@/components/ui/counter";
import { getSocialStats } from "@/lib/stats";

export async function SocialProof() {
    const stats = await getSocialStats();

    const items = [
        {
            // Years is a static config value; never shown as "—".
            value: stats.yearsInBusiness,
            display: stats.yearsInBusiness > 0 ? stats.yearsInBusiness : null,
            label: "Años de Experiencia",
            suffix: "+",
        },
        {
            value: stats.closedDeals,
            display: stats.isLive ? stats.closedDeals : null,
            label: "Negocios Cerrados",
            suffix: "+",
        },
        {
            value: stats.clientsServed,
            display: stats.isLive ? stats.clientsServed : null,
            label: "Clientes Satisfechos",
            suffix: "+",
        },
        {
            // Display in millions with 1 decimal so sub-million
            // values (e.g. $300K USD) show as 0.3 instead of 0.
            // NOTE: the underlying `price` values are in their property's
            // own `currency` (not normalized to MXN). The label was
            // "Millones MXN" historically, but that's misleading when
            // every published property is in USD. Until we add a
            // currency-conversion step, the label reads "MILLONES USD".
            value: stats.portfolioValueMXN,
            display:
                stats.isLive && stats.portfolioValueMXN > 0
                    ? Number((stats.portfolioValueMXN / 1_000_000).toFixed(1))
                    : null,
            label: "Millones USD en Portafolio",
            suffix: "M",
            prefix: "$",
        },
    ];

    const hasLiveData = items.some((i) => i.display !== null);

    return (
        <FadeIn direction="up">
            <section
                className="w-full bg-gradient-to-b from-background via-zinc-950 to-background border-y border-gold-500/10 py-20"
                aria-label="Indicadores de autoridad de la marca"
                aria-live="polite"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="font-display text-caption font-bold uppercase tracking-eyebrow text-gold-solid">
                            Track Record
                        </span>
                        <p className="text-body text-foreground/60 mt-3">
                            Cifras consolidadas al cierre del último trimestre
                            fiscal, auditadas internamente.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {items.map((stat, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center p-6 space-y-3 relative"
                            >
                                {i > 0 && (
                                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-gold-500/20 to-transparent" />
                                )}
                                <h4 className="text-display-3 font-numerics font-bold metallic-gold-static flex items-center min-h-[1em]">
                                    {stat.display === null ? (
                                        <span
                                            className="text-foreground/50"
                                            title={
                                                hasLiveData
                                                    ? "Sin datos disponibles"
                                                    : "Cargando datos del portafolio…"
                                            }
                                        >
                                            —
                                        </span>
                                    ) : (
                                        <Counter
                                            from={0}
                                            to={stat.display}
                                            suffix={stat.suffix}
                                            prefix={stat.prefix ?? ""}
                                            duration={2}
                                        />
                                    )}
                                </h4>
                                <p className="font-display text-xs md:text-sm font-bold uppercase tracking-overline text-foreground/60">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </FadeIn>
    );
}
