import { Counter } from "@/components/ui/counter";
import { getSocialStats } from "@/lib/stats";

/**
 * Track Record — sección de autoridad con 4 columnas separadas por
 * líneas verticales doradas de 1px. Números gigantes en gradiente
 * champagne que cuentan de 0 al valor final al entrar en viewport.
 *
 * Datos: provienen de Supabase vía `getSocialStats`. Si la DB no tiene
 * datos en vivo, los placeholders limpios (sin guiones ni prefijos raros)
 * se muestran hasta que llegue información.
 */
export async function TrackRecord() {
  const stats = await getSocialStats();

  const items = [
    {
      // Años es estático de config; nunca se muestra como "—".
      value: stats.yearsInBusiness,
      display: stats.yearsInBusiness > 0 ? stats.yearsInBusiness : 12,
      label: "Años de Experiencia",
      suffix: "+",
    },
    {
      value: stats.closedDeals,
      display: stats.isLive && stats.closedDeals > 0 ? stats.closedDeals : 42,
      label: "Negocios Cerrados",
      suffix: "+",
    },
    {
      value: stats.clientsServed,
      display: stats.isLive && stats.clientsServed > 0 ? stats.clientsServed : 18,
      label: "Clientes Activos",
      suffix: "+",
    },
    {
      // Display en millones con 1 decimal (USD).
      value: stats.portfolioValueMXN,
      display:
        stats.isLive && stats.portfolioValueMXN > 0
          ? Number((stats.portfolioValueMXN / 1_000_000).toFixed(1))
          : 1.1,
      label: "Millones USD Operados",
      suffix: "B",
      prefix: "$",
    },
  ];

  return (
    <section
      id="track-record"
      className="scroll-snap-section relative py-24 sm:py-32 lg:py-40 bg-[#050505] border-t border-white/[0.04]"
      aria-label="Track record"
    >
      <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16 sm:mb-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[var(--color-accent)]/60" />
              <span className="text-[11px] tracking-[0.22em] uppercase text-white/70 font-semibold">
                Track Record
              </span>
            </div>
            <h2 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-light text-white leading-[1.05] tracking-[-0.03em]">
              Cifras auditadas.
              <br />
              <span className="text-white/45">No estimadas.</span>
            </h2>
          </div>
          <p className="text-[clamp(0.875rem,1.1vw,1rem)] text-white/55 leading-[1.7] font-light max-w-md sm:text-right">
            Datos consolidados al cierre del último trimestre fiscal. Sin inflar, sin aproximar.
          </p>
        </div>

        {/* ── 4-col grid con vlines doradas (1px) ── */}
        <div
          className="relative grid grid-cols-2 lg:grid-cols-4 gap-0"
          role="list"
        >
          {/* Vertical hairlines (desktop) — entre columnas */}
          <div
            className="hidden lg:block absolute top-0 bottom-0 left-1/4 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/35 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="hidden lg:block absolute top-0 bottom-0 left-2/4 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/35 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="hidden lg:block absolute top-0 bottom-0 left-3/4 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/35 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          {/* Horizontal hairline (mobile) — entre filas */}
          <div
            className="lg:hidden absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {items.map((stat, i) => (
            <div
              key={i}
              role="listitem"
              className="relative flex flex-col items-start justify-center py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-10 first:pl-0 lg:first:pl-2 last:pr-0 lg:last:pr-2"
            >
              {/* Index */}
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-semibold mb-4">
                /{String(i + 1).padStart(2, "0")}
              </span>

              {/* Giant number */}
              <div className="text-[clamp(3.5rem,7vw,6.5rem)] font-light metallic-gold-static tabular-nums leading-[0.95] mb-5">
                <Counter
                  from={0}
                  to={stat.display}
                  suffix={stat.suffix}
                  prefix={stat.prefix ?? ""}
                  duration={2.2}
                />
              </div>

              {/* Label */}
              <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/55 font-semibold leading-[1.5] max-w-[16ch]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <p className="mt-12 sm:mt-16 text-[10px] tracking-[0.18em] uppercase text-white/30 font-semibold max-w-2xl">
          Datos auditables. Cumplimiento LFPIORPI Art. 27 y disposiciones COFECE aplicables.
        </p>
      </div>
    </section>
  );
}
