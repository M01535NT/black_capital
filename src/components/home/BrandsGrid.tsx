import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { RevealText } from "@/components/ui/reveal-text";

import brandLuxury from "../../../public/brand-luxury.png";
import brandLuxuryWebp from "../../../public/brand-luxury.webp";
import brandBusiness from "../../../public/brand-business.png";
import brandBusinessWebp from "../../../public/brand-business.webp";
import brandIndustrial from "../../../public/brand-industrial.png";
import brandIndustrialWebp from "../../../public/brand-industrial.webp";

const BRANDS: {
  name: string;
  href: string;
  description: string;
  image: StaticImageData;
  imageWebp: StaticImageData;
}[] = [
  {
    name: "Black Luxury",
    href: "/black-luxury",
    description: "Residencias y propiedades de alto valor con ubicación privilegiada.",
    image: brandLuxury,
    imageWebp: brandLuxuryWebp,
  },
  {
    name: "Black Business",
    href: "/black-business",
    description: "Oficinas, locales y activos corporativos con potencial real.",
    image: brandBusiness,
    imageWebp: brandBusinessWebp,
  },
  {
    name: "Black Industrial",
    href: "/black-industrial",
    description: "Naves, bodegas y terrenos para operaciones que mueven la economía.",
    image: brandIndustrial,
    imageWebp: brandIndustrialWebp,
  },
];

export function BrandsGrid() {
  return (
    <section className="scroll-snap-section relative py-20 sm:py-28 bg-[#0A0A0A]" aria-label="Verticales de inversión">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-14 sm:mb-20">
          <span className="text-[11px] tracking-[0.18em] uppercase text-white/50 font-semibold mb-4 block">
            Tres líneas de inversión
          </span>
          <RevealText as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.08] tracking-[-0.02em] mb-4">
            Elige la que va contigo
          </RevealText>
          <p className="text-[clamp(0.875rem,1.2vw,1rem)] text-white/70 max-w-lg font-light">
            Sin tecnicismos. Tres caminos claros para hacer crecer tu patrimonio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {BRANDS.map((brand, i) => (
            <Link key={brand.name} href={brand.href}
              className="group relative block aspect-[4/5] overflow-hidden rounded-3xl hover:scale-[1.02] transition-all duration-500"
            >
              <picture>
                <source srcSet={brand.imageWebp.src} type="image/webp" />
                <Image src={brand.image} alt={brand.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/65 to-[#060606]/20" />

              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
                <span className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-accent)] font-bold mb-3 block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-[-0.01em]">
                  {brand.name}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed max-w-[85%] mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  {brand.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
