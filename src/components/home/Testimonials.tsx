const defaultTestimonials = [
  {
    quote:
      "Nos acompañaron desde la primera visita hasta la firma. Cada decisión tuvo un dato detrás, no una corazonada.",
    attribution: "M. R.",
    role: "Propietario residencial, Chapultepec",
  },
  {
    quote:
      "Encontraron un activo industrial que ya habíamos descartado dos veces. La lectura comercial cambió toda la operación.",
    attribution: "L. F.",
    role: "Inversionista industrial, Otay",
  },
  {
    quote:
      "Vendimos en menos tiempo del que esperábamos y al precio que nos prometieron desde la opinión de valor inicial.",
    attribution: "A. G.",
    role: "Familia compradora, Zona Río",
  },
];

export function Testimonials({
  items = defaultTestimonials,
}: {
  items?: typeof defaultTestimonials;
}) {
  return (
    <section
      aria-label="Voces de clientes Black Capital"
      className="relative border-y border-white/[0.06] bg-white/[0.02]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent"
      />
      <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-4">
            <p className="mb-3 property-tag-type gold-ink">Voces</p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Quienes nos confiaron operaciones.
            </h2>
            <p className="mt-6 max-w-md text-body text-white/58">
              Propietarios, familias e inversionistas que decidieron operar con
              criterio antes que con prisa.
            </p>
          </div>

          <ul className="grid gap-5 lg:col-span-8 lg:grid-cols-3 lg:gap-6">
            {items.map((item) => (
              <li
                key={item.attribution}
                className="relative flex flex-col border border-white/[0.08] bg-background/40 p-6 transition-colors duration-500 hover:border-[var(--color-accent)]/35 lg:p-7"
              >
                <span
                  aria-hidden="true"
                  className="gold-ink select-none font-display text-6xl font-extrabold leading-none opacity-30"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-2 text-body-lg leading-relaxed text-white/85">
                  {item.quote}
                </blockquote>
                <span
                  aria-hidden="true"
                  className="mt-6 block h-px w-10 bg-[var(--color-accent)]/45"
                />
                <footer className="mt-4">
                  <p className="property-tag-type text-white">
                    {item.attribution}
                  </p>
                  <p className="mt-1 text-body-sm text-white/55">{item.role}</p>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent"
      />
    </section>
  );
}
