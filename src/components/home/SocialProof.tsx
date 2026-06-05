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
                className="w-full bg-gradient-to-b from-background via-zinc-950 to-background border-y border-gold-500/10 py-24"
                aria-label="Indicadores de autoridad de la marca"
                aria-live="polite"
            >
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 font-display text-caption uppercase tracking-eyebrow font-bold mb-3">
                                <span className="font-mono text-gold-solid text-body-sm">
                                    02 /
                                </span>
                                <span className="text-gold-solid">Track Record</span>
                            </div>
                            <h2 className="text-display-2 font-display font-bold tracking-tight text-foreground leading-[0.95]">
                                Cifras auditadas.
                                <br />
                                <span className="text-foreground/55">
                                    No estimadas.
                                </span>
                            </h2>
                        </div>
                        <p className="text-body text-foreground/60 max-w-md md:text-right">
                            Datos consolidados al cierre del último trimestre
                            fiscal. Sin inflar, sin aproximar.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-0 md:gap-px bg-gold-500/10 border border-gold-500/10">
                        {items.map((stat, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-start justify-center p-6 md:p-8 space-y-3 relative bg-background"
                            >
                                <span className="font-mono text-caption uppercase tracking-overline text-foreground/40">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <h4 className="font-mono text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-none metallic-gold-static tabular-nums min-h-[1em]">
                                    {stat.display === null ? (
                                        <span
                                            className="text-foreground/30"
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
                                <p className="font-display text-caption uppercase tracking-overline text-foreground/55 leading-relaxed">
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
