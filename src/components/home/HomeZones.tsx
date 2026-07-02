import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

const ZONES = [
  { name: "Chapultepec", count: "07" },
  { name: "Zona Río", count: "06" },
  { name: "Otay", count: "05" },
  { name: "Playas", count: "03" },
  { name: "Díaz Ordaz", count: "02" },
  { name: "El Florido", count: "01" },
] as const;

// Approximate pin positions over the map backdrop (top/left %).
const PINS = [
  { top: "38%", left: "32%", size: 14 },
  { top: "55%", left: "54%", size: 11 },
  { top: "30%", left: "66%", size: 9 },
] as const;

export function HomeZones() {
  return (
    <section className="grid grid-cols-1 border-t border-white/[0.08] bg-white/[0.02] lg:grid-cols-2">
      <div className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <p className="mb-3 property-tag-type gold-ink">Dónde operamos</p>
        <h2 className="text-display-2 leading-display tracking-headline text-white">
          Zonas donde sí tenemos contexto.
        </h2>
        <p className="mt-5 max-w-sm text-body text-white/58">
          Tijuana cambia por colonia. Te ayudamos a leer precio, demanda y tipo
          de inmueble por zona.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
          {ZONES.map((zone) => (
            <Link
              key={zone.name}
              href={`/inventario?zona=${encodeURIComponent(zone.name)}`}
              className="group flex items-center justify-between gap-3 border-t border-white/[0.08] py-4 transition-colors hover:border-[var(--color-accent)]/40"
            >
              <span className="inline-flex items-center gap-2.5 text-body font-medium text-white/80 transition-colors group-hover:text-white">
                <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                {zone.name}
              </span>
              <span className="font-display text-body font-extrabold gold-ink">
                {zone.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative min-h-[300px] overflow-hidden border-t border-[var(--color-accent)]/15 lg:border-l lg:border-t-0">
        <Image
          src="/hero-poster.webp"
          alt="Mapa de zonas de cobertura en Tijuana"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60" />
        <span className="absolute left-7 top-6 property-tag-type text-[var(--color-accent)]/70">
          Mapa · Tijuana · zonas de cobertura
        </span>
        {PINS.map((pin, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute rounded-full bg-[var(--color-accent)]"
            style={{
              top: pin.top,
              left: pin.left,
              width: pin.size,
              height: pin.size,
              boxShadow: `0 0 0 ${pin.size / 2}px rgba(210,167,60,0.16)`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
