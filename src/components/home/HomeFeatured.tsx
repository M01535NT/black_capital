import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";

const FALLBACK: PropertyCardData[] = [
  {
    id: "featured-residencial",
    slug: null,
    title: "Residencia con vista en Chapultepec",
    property_use: "Residencial",
    property_type: "Casa",
    business_type: "Venta",
    price: 12400000,
    currency: "MXN",
    m2_terrain: 420,
    m2_construction: 320,
    cover_image: "/brand-luxury.webp",
    status: "Available",
    address: "Chapultepec, Tijuana",
    is_featured: true,
    isPlaceholder: true,
  },
  {
    id: "featured-comercial",
    slug: null,
    title: "Oficina corporativa en Zona Río",
    property_use: "Comercial",
    property_type: "Oficina",
    business_type: "Renta",
    price: 48000,
    currency: "MXN",
    m2_terrain: 210,
    m2_construction: 210,
    cover_image: "/brand-business.webp",
    status: "Available",
    address: "Zona Río, Tijuana",
    is_featured: true,
    isPlaceholder: true,
  },
  {
    id: "featured-industrial",
    slug: null,
    title: "Nave con andén en Otay",
    property_use: "Industrial",
    property_type: "Nave",
    business_type: "Venta",
    price: 2400000,
    currency: "USD",
    m2_terrain: 4200,
    m2_construction: 3600,
    cover_image: "/brand-industrial.webp",
    status: "Available",
    address: "Otay, Tijuana",
    is_featured: true,
    isPlaceholder: true,
  },
];

export async function HomeFeatured() {
  const supabase = await createClient();

  const columns =
    "id, slug, title, property_use, property_type, business_type, price, currency, m2_terrain, m2_construction, cover_image, status, address, created_at, is_featured";

  const { data: featured } = await supabase
    .from("properties")
    .select(columns)
    .eq("status", "Available")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(3);

  let list = (featured ?? []) as PropertyCardData[];

  if (list.length < 3) {
    const { data: recent } = await supabase
      .from("properties")
      .select(columns)
      .eq("status", "Available")
      .order("created_at", { ascending: false })
      .limit(3);
    if (recent && recent.length > 0) list = recent as PropertyCardData[];
  }

  if (list.length === 0) list = FALLBACK;

  return (
    <section className="border-t border-white/[0.08]">
      <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 property-tag-type gold-ink">Inventario destacado</p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Propiedades seleccionadas.
            </h2>
          </div>
          <Link
            href="/inventario"
            className="group inline-flex items-center gap-2 property-tag-type text-[var(--color-accent)]"
          >
            <span className="relative pb-1">
              Ver todo el inventario
              <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.slice(0, 3).map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
