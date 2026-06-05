import { RevealText } from "@/components/ui/reveal-text";

const PHRASES = [
  { phrase: "No vendemos humo.", sub: "Cada propiedad tiene un análisis financiero detrás. Sin atajos." },
  { phrase: "El trato es directo.", sub: "Sin intermediarios innecesarios. Tú, nosotros, y la propiedad." },
  { phrase: "Tu patrimonio, en serio.", sub: "Lo tratamos como si fuera el nuestro. Porque así empezamos." },
];

export function LoQueDicen() {
  return (
    <section className="scroll-snap-section relative py-24 sm:py-32 bg-[#0A0A0A] border-t border-white/[0.04]" aria-label="Nuestra palabra">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16 sm:mb-24">
          <span className="text-[11px] tracking-[0.18em] uppercase text-white/50 font-semibold mb-4 block">Nuestra palabra</span>
          <RevealText as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.08] tracking-[-0.02em]">
            Lo que sí cumplimos.
          </RevealText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
          {PHRASES.map((item, i) => (
            <div key={i} className="text-center">
              <span className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-accent)] font-bold mb-6 block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-4">
                {item.phrase}
              </p>
              <p className="text-base text-white/70 font-light max-w-xs mx-auto leading-relaxed">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 sm:mt-24 text-center">
          <p className="text-white/80 font-light text-lg mb-6">¿Listo para invertir con alguien que te habla claro?</p>
          <a href="/contacto"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 brushed-gold text-sm font-bold tracking-wide rounded-2xl hover:brightness-105 hover:scale-[1.02] transition-all duration-300"
          >
            Hablar con un Asesor <span className="text-base">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
