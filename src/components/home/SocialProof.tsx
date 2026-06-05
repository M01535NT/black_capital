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
            value: stats.yearsInBusiness,
            label: "Años de Experiencia",
            suffix: "+",
        },
        {
            value: stats.closedDeals,
            label: "Negocios Cerrados",
            suffix: "+",
        },
        {
            value: stats.clientsServed,
            label: "Clientes Satisfechos",
            suffix: "+",
        },
        {
            value: Math.round(stats.portfolioValueMXN / 1_000_000),
            label: "Millones MXN en Portafolio",
            suffix: "",
        },
    ];

    return (
        <FadeIn direction="up">
            <section
                className="w-full bg-gradient-to-b from-background via-zinc-950 to-background border-y border-gold-500/10 py-20"
                aria-label="Indicadores de autoridad de la marca"
            >
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {items.map((stat, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center p-6 space-y-3 relative"
                            >
                                {i > 0 && (
                                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-gold-500/20 to-transparent" />
                                )}
                                <h4 className="text-display-3 font-numerics font-bold metallic-gold flex items-center">
                                    <Counter
                                        from={0}
                                        to={stat.value}
                                        suffix={stat.suffix}
                                    />
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
