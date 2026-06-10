const defaultTestimonials = [
  {
    quote:
      "Nos explicaron precio, zona y condiciones antes de hacer oferta.",
    attribution: "M. R.",
    role: "Propietario, Chapultepec",
  },
  {
    quote:
      "Revisaron superficie, accesos y maniobra antes de descartar la nave.",
    attribution: "L. F.",
    role: "Inversionista, Otay",
  },
  {
    quote:
      "Definimos valor comercial, preparamos la venta y cerramos en el tiempo previsto.",
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
      <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-4">
            <p className="mb-2 property-tag-type gold-ink lg:mb-3">Voces</p>
            <h2 className="mb-0 text-display-2 leading-display tracking-headline text-white">
              Operaciones que nos confiaron.
            </h2>
            <p className="mt-4 mb-0 max-w-md text-body leading-snug text-white/58 lg:mt-6">
              Personas que necesitaban comprar, vender o evaluar un inmueble con mejor información.
            </p>
          </div>

          <ul className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 sm:-mx-10 sm:px-10 md:gap-5 lg:col-span-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
            {items.map((item) => (
              <li
                key={item.attribution}
                className="relative flex min-h-[250px] min-w-[78vw] snap-center flex-col border border-white/[0.08] bg-background/40 p-5 transition-colors duration-500 hover:border-[var(--color-accent)]/35 sm:min-w-[46vw] md:min-h-[260px] md:min-w-[42vw] lg:min-h-0 lg:min-w-0 lg:p-7"
              >
                <span
                  aria-hidden="true"
                  className="gold-ink select-none font-display text-5xl font-extrabold leading-none opacity-30 lg:text-6xl"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-1 text-[1rem] font-medium leading-snug text-white/85 lg:mt-2 lg:text-body-lg lg:leading-relaxed">
                  {item.quote}
                </blockquote>
                <span
                  aria-hidden="true"
                  className="mt-auto block h-px w-10 bg-[var(--color-accent)]/45"
                />
                <footer className="mt-3 lg:mt-4">
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
