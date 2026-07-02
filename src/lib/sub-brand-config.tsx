/**
 * Sub-brand configuration — single source of truth for the 3 sub-brand
 * landings (Black Luxury, Black Business, Black Industrial).
 *
 * Why a config object instead of three hard-coded page components?
 * - Adding a 4th sub-brand (e.g. "Black Hospitality") becomes a
 *   one-file change to SUB_BRANDS, not a copy of `black-luxury/page.tsx`.
 * - The sub-brand landing pages render the same skeleton
 *   (Hero → Value → Stats → Inventory → CTA → JsonLd); only the
 *   content and accent change.
 * - A/B testing copy or visual chrome is a one-line change in
 *   SUB_BRANDS vs a git commit against each page.
 *
 * The page files (`/black-luxury/page.tsx` etc.) are now thin
 * wrappers that import the config and pass it to a single
 * <SubBrandLanding /> component.
 *
 * Note: the per-brand CTA/Stats/Value files in `src/components/luxury/`
 * etc. are kept as thin re-exports of the shared `SubBrand*` components
 * so any external imports keep working.
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
    Crown,
    Building2,
    Gem,
    Briefcase,
    Building,
    TrendingUp,
    Factory,
    Warehouse,
    Truck,
} from "lucide-react";
import type { SubBrandCTAConfig } from "@/components/shared/SubBrandCTA";
import type { StatItem } from "@/components/shared/SubBrandStats";
import type { SubBrandValueItem, Accent } from "@/components/shared/SubBrandValue";

export type { Accent };
export type SubBrandKey = "luxury" | "business" | "industrial";

export interface SubBrandHeroConfig {
    brand: string;
    backgroundImage: string;
    backgroundImageWebp?: string;
    backgroundAlt: string;
    accent: Accent;
    /** Override default overlay gradient (industrial uses darker). */
    overlayClass?: string;
    headline: ReactNode;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    /** Inline stats bar above the CTAs (industrial only). */
    highlights?: Array<{ value: string; label: string }>;
    /** Decorative grid lines (industrial only). */
    gridLines?: boolean;
    /** Whether to disable the gold cursor-follow glow (industrial). */
    cursorGlow?: boolean;
}

export type PropertyUse = "Residencial" | "Comercial" | "Industrial";

export interface SubBrandInventoryConfig {
    brandSlug: SubBrandKey;
    propertyUse: PropertyUse;
    title: string;
    highlight: string;
    subtitle: string;
    ctaText: string;
    accentColor: Accent;
}

export interface SubBrandValueConfig {
    eyebrow: string;
    title: ReactNode;
    description: string;
    items: SubBrandValueItem[];
}

export interface SubBrandConfig {
    key: SubBrandKey;
    /** id used by the SubBrandHero's secondaryCta href="#<id>". */
    ctaSectionId: string;
    hero: SubBrandHeroConfig;
    value: SubBrandValueConfig;
    stats: StatItem[];
    inventory: SubBrandInventoryConfig;
    cta: SubBrandCTAConfig;
    /** Schema.org JSON-LD emitted on the page. */
    jsonLd: Record<string, unknown>;
    /** Next.js page metadata. */
    metadata: Metadata;
}

const baseJsonLd = {
    "@context": "https://schema.org",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: 0,
    provider: {
        "@type": "RealEstateAgent",
        name: "Black Capital",
        url: "https://blackmx.vercel.app",
    },
} as const;

const LUXURY_STATS: StatItem[] = [
    { value: "Privacidad", label: "Acceso, entorno y condiciones de uso antes de visitar." },
    { value: "Zona", label: "Servicios, conectividad y vida diaria alrededor." },
    { value: "Diseño", label: "Distribución, luz, acabados y mantenimiento visible." },
    { value: "Precio", label: "Referencias de mercado para comprar o vender con más contexto." },
];

const BUSINESS_STATS: StatItem[] = [
    { value: "Zona Río", label: "Corredor corporativo con servicios, oficinas y alta exposición." },
    { value: "Otay", label: "Conectividad para comercio, servicios y atención empresarial." },
    { value: "Díaz Ordaz", label: "Eje comercial denso para atención local, retail y servicios." },
    { value: "Renta", label: "Flujo peatonal, visibilidad y permanencia del giro antes de ofertar." },
];

const INDUSTRIAL_STATS: StatItem[] = [
    { value: "m²", label: "Superficie útil, expansión posible y relación entre nave, patio y oficinas." },
    { value: "Andenes", label: "Altura, carga, rampas y accesos para el trabajo diario." },
    { value: "Patio", label: "Maniobra, radios de giro y capacidad para unidades de carga." },
    { value: "Garitas", label: "Conexión con corredores industriales y rutas de exportación." },
];

export const SUB_BRAND_CONFIGS: Record<SubBrandKey, SubBrandConfig> = {
    luxury: {
        key: "luxury",
        ctaSectionId: "luxury-cta",
        hero: {
            brand: "Black Luxury",
            backgroundImage: "/hero-luxury.webp",
            backgroundImageWebp: "/hero-luxury.webp",
            backgroundAlt: "Casa residencial en fraccionamiento privado",
            accent: "gold",
            headline: (
                <>
                    Casas y residencias.
                </>
            ),
            subtitle:
                "Tijuana y Rosarito. Zonas privadas, presupuesto claro y referencias de mercado.",
            primaryCta: { label: "Ver residencias", href: "/inventario?brand=luxury" },
            secondaryCta: { label: "Hablar con asesor", href: "#luxury-cta" },
        },
        value: {
            eyebrow: "Residencial",
            title: (
                <>
                    Casas revisadas antes de visitar.
                </>
            ),
            description:
                "Filtramos opciones por zona, precio, estado visible y etapa de compra o venta.",
            items: [
                {
                    icon: Crown,
                    title: "Fraccionamientos Privados",
                    description:
                        "Entornos con acceso controlado, privacidad y servicios cercanos.",
                },
                {
                    icon: Building2,
                    title: "Residencial Plus",
                    description:
                        "Casas con distribución, acabados y mantenimiento acordes al presupuesto.",
                },
                {
                    icon: Gem,
                    title: "Pre-Venta y Estreno",
                    description:
                        "Opciones nuevas revisadas por zona, entrega, precio y disponibilidad.",
                },
            ],
        },
        stats: LUXURY_STATS,
        inventory: {
            brandSlug: "luxury",
            propertyUse: "Residencial",
            title: "Residencias en",
            highlight: "zonas privadas",
            subtitle:
                "Revisa una muestra residencial y solicita opciones alineadas a zona, presupuesto y etapa de compra.",
            ctaText: "Ver inventario residencial",
            accentColor: "gold",
        },
        cta: {
            brand: "luxury",
            source: "landing_luxury",
            notesPrefix: "Luxury Landing",
            notesFormat: "optional",
            sectionId: "luxury-cta",
            eyebrowIcon: "lock",
            eyebrow: "Asesoría residencial",
            title: "Pide opciones",
            titleHighlight: "residenciales",
            description:
                "Cuéntanos zona, presupuesto y tipo de casa. Te contactamos con opciones que encajan.",
            indicator: "Respuesta en menos de 24h",
            companyLabel: "Empresa (opcional)",
            companyPlaceholder: "Empresa o particular",
            companyRequired: false,
            emailPlaceholder: "Correo Electrónico",
            submitLabel: "Pedir opciones residenciales",
            successTitle: "Solicitud recibida",
            successMessage:
                "Recibimos tu solicitud. Nuestro equipo te contactará con opciones que encajan.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Luxury · Residencias en Tijuana y Rosarito",
            description:
                "Casas y residencias filtradas por zona, privacidad y presupuesto en Tijuana y Rosarito.",
        },
        metadata: {
            title: "Residencias en Tijuana y Rosarito | Black Capital",
            description:
                "Casas y residencias en zonas seleccionadas de Tijuana y Rosarito, filtradas por privacidad, zona y presupuesto.",
            keywords: [
                "residencias en Tijuana",
                "residencias en Rosarito",
                "fraccionamientos privados Tijuana",
                "fraccionamientos privados Rosarito",
                "residencial plus Tijuana",
                "Chapultepec Tijuana",
                "Playas de Tijuana",
                "casas en venta Rosarito",
                "Black Capital",
            ],
            robots: "index, follow",
            alternates: {
                canonical: "https://blackmx.vercel.app/black-luxury",
            },
            openGraph: {
                title: "Residencias en Tijuana y Rosarito | Black Capital",
                description:
                    "Residencias seleccionadas por privacidad, zona y presupuesto en Tijuana y Rosarito.",
                type: "website",
                locale: "es_MX",
                siteName: "Black Capital",
                url: "https://blackmx.vercel.app/black-luxury",
                images: [
                    {
                        url: "https://blackmx.vercel.app/hero-luxury.webp",
                        width: 1200,
                        height: 630,
                        alt: "Residencia en zona seleccionada",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "Residencias en Tijuana y Rosarito | Black Capital",
                description:
                    "Residencias seleccionadas por privacidad, zona y presupuesto en Tijuana y Rosarito.",
                images: ["https://blackmx.vercel.app/hero-luxury.webp"],
            },
        },
    },

    business: {
        key: "business",
        ctaSectionId: "business-cta",
        hero: {
            brand: "Black Business",
            backgroundImage: "/hero-business.webp",
            backgroundImageWebp: "/hero-business.webp",
            backgroundAlt: "Local comercial en plaza corporativa de Tijuana",
            accent: "gold",
            headline: (
                <>
                    Espacios para tu negocio.
                </>
            ),
            subtitle:
                "Locales, oficinas y plazas revisadas por flujo, visibilidad, uso permitido y renta.",
            primaryCta: { label: "Ver espacios comerciales", href: "/inventario?brand=business" },
            secondaryCta: { label: "Pedir opciones", href: "#business-cta" },
        },
        value: {
            eyebrow: "Comercial",
            title: (
                <>
                    Elige por zona, giro y visibilidad.
                </>
            ),
            description:
                "Comparamos opciones por zona, formato, superficie, visibilidad y condiciones de renta o venta.",
            items: [
                {
                    icon: Briefcase,
                    title: "Zona Río",
                    description:
                        "Corredor corporativo con servicios, accesos y demanda de oficinas profesionales.",
                },
                {
                    icon: Building,
                    title: "Otay",
                    description:
                        "Zona útil para comercio, servicios y atención empresarial.",
                },
                {
                    icon: TrendingUp,
                    title: "Díaz Ordaz",
                    description:
                        "Eje comercial de alto movimiento para retail, servicios y atención local.",
                },
            ],
        },
        stats: BUSINESS_STATS,
        inventory: {
            brandSlug: "business",
            propertyUse: "Comercial",
            title: "Espacios",
            highlight: "Comerciales",
            subtitle:
                "Compara opciones por formato, zona, superficie y uso comercial antes de agendar recorrido.",
            ctaText: "Ver inventario comercial",
            accentColor: "gold",
        },
        cta: {
            brand: "business",
            source: "landing_business",
            notesPrefix: "Business Landing",
            notesFormat: "optional",
            sectionId: "business-cta",
            eyebrowIcon: "lock",
            eyebrow: "Asesoría comercial",
            title: "Pide opciones",
            titleHighlight: "para tu negocio",
            description:
                "Cuéntanos giro, zona y formato. Te ayudamos a comparar opciones comerciales que encajan.",
            indicator: "Respuesta en menos de 24h",
            companyLabel: "Empresa",
            companyPlaceholder: "Empresa",
            companyRequired: false,
            emailPlaceholder: "Correo Electrónico",
            submitLabel: "Pedir opciones comerciales",
            successTitle: "Solicitud recibida",
            successMessage:
                "Recibimos tu solicitud. Nuestro equipo te contactará con opciones comerciales que encajan.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Business · Centros Comerciales y Locales en Tijuana",
            description:
                "Locales, oficinas y plazas comerciales filtradas por flujo, visibilidad y uso permitido en Tijuana, Baja California.",
        },
        metadata: {
            title: "Locales Comerciales en Tijuana | Black Capital",
            description:
                "Locales, oficinas y plazas en Tijuana evaluadas por flujo, visibilidad, uso permitido y condiciones comerciales.",
            keywords: [
                "centros comerciales Tijuana",
                "locales comerciales Tijuana",
                "oficinas en Tijuana",
                "plazas comerciales Tijuana",
                "inversión comercial Tijuana",
                "renta de locales Tijuana",
                "Black Capital",
            ],
            robots: "index, follow",
            alternates: {
                canonical: "https://blackmx.vercel.app/black-business",
            },
            openGraph: {
                title: "Locales Comerciales en Tijuana | Black Capital",
                description:
                    "Locales, oficinas y plazas en Tijuana filtradas por flujo, visibilidad y uso permitido.",
                type: "website",
                locale: "es_MX",
                siteName: "Black Capital",
                url: "https://blackmx.vercel.app/black-business",
                images: [
                    {
                        url: "https://blackmx.vercel.app/hero-business.webp",
                        width: 1200,
                        height: 630,
                        alt: "Local comercial en Tijuana",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "Locales Comerciales en Tijuana | Black Capital",
                description:
                    "Locales, oficinas y plazas en Tijuana filtradas por flujo, visibilidad y uso permitido.",
                images: ["https://blackmx.vercel.app/hero-business.webp"],
            },
        },
    },

    industrial: {
        key: "industrial",
        ctaSectionId: "industrial-cta",
        hero: {
            brand: "Black Industrial",
            backgroundImage: "/industrial-hero.webp",
            backgroundImageWebp: "/industrial-hero.webp",
            backgroundAlt: "Nave industrial moderna en parque logístico de Tijuana",
            accent: "steel",
            overlayClass: "from-background via-background/90 to-background/55",
            headline: (
                <>
                    Naves y bodegas en Tijuana.
                </>
            ),
            subtitle:
                "Naves y bodegas revisadas por superficie, accesos, maniobra, uso y conectividad.",
            primaryCta: { label: "Ver naves y bodegas", href: "/inventario?brand=industrial" },
            secondaryCta: { label: "Pedir opciones", href: "#industrial-cta" },
            gridLines: true,
            cursorGlow: false,
        },
        value: {
            eyebrow: "Industrial",
            title: (
                <>
                    La nave debe funcionar para tu logística.
                </>
            ),
            description:
                "Comparamos naves y bodegas por superficie útil, conectividad, restricciones de uso y maniobra.",
            items: [
                {
                    icon: Factory,
                    title: "Naves Industriales",
                    description:
                        "Altura, claros, energía y andenes revisados según el trabajo diario.",
                },
                {
                    icon: Warehouse,
                    title: "Bodegas y Almacenes",
                    description:
                        "Almacenaje, patios y rampas revisados por flujo de entrada y salida.",
                },
                {
                    icon: Truck,
                    title: "Parques Logísticos",
                    description:
                        "Conectividad a garitas, rutas primarias y corredores de distribución.",
                },
            ],
        },
        stats: INDUSTRIAL_STATS,
        inventory: {
            brandSlug: "industrial",
            propertyUse: "Industrial",
            title: "Naves y",
            highlight: "Bodegas",
            subtitle:
                "Revisa naves y bodegas por superficie, conectividad, uso permitido y capacidad de maniobra.",
            ctaText: "Ver inventario industrial",
            accentColor: "steel",
        },
        cta: {
            brand: "industrial",
            source: "landing_industrial",
            notesPrefix: "Industrial Landing",
            notesFormat: "always",
            eyebrowIcon: "download",
            eyebrow: "Portafolio industrial",
            title: "Pide opciones",
            titleHighlight: "industriales",
            description:
                "Comparte superficie, uso y zona objetivo. Te ayudamos a filtrar naves y bodegas por capacidad real.",
            companyLabel: "Empresa",
            companyPlaceholder: "Empresa *",
            companyRequired: true,
            emailPlaceholder: "Correo Corporativo",
            submitLabel: "Pedir opciones industriales",
            successTitle: "Solicitud registrada",
            successMessage:
                "Recibimos tu solicitud. Nuestro equipo te contactará con opciones industriales que encajan.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Industrial · Naves, Bodegas y Parques Logísticos en Tijuana",
            description:
                "Naves, bodegas e inmuebles industriales en Tijuana filtrados por superficie, conectividad y capacidad de maniobra.",
        },
        metadata: {
            title: "Naves Industriales en Tijuana | Black Capital",
            description:
                "Naves, bodegas y parques industriales en Tijuana filtrados por superficie, conectividad y capacidad de maniobra.",
            keywords: [
                "naves industriales Tijuana",
                "parques industriales Tijuana",
                "bodegas en Tijuana",
                "zona industrial Otay",
                "logística Tijuana",
                "manufactura Tijuana",
                "Black Capital",
            ],
            robots: "index, follow",
            alternates: {
                canonical: "https://blackmx.vercel.app/black-industrial",
            },
            openGraph: {
                title: "Naves Industriales en Tijuana | Black Capital",
                description:
                    "Naves, bodegas y parques industriales en Tijuana filtrados por superficie, conectividad y maniobra.",
                type: "website",
                locale: "es_MX",
                siteName: "Black Capital",
                url: "https://blackmx.vercel.app/black-industrial",
                images: [
                    {
                        url: "https://blackmx.vercel.app/industrial-hero.webp",
                        width: 1200,
                        height: 630,
                        alt: "Nave industrial en Tijuana",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "Naves Industriales en Tijuana | Black Capital",
                description:
                    "Naves, bodegas y parques industriales en Tijuana filtrados por superficie, conectividad y maniobra.",
                images: ["https://blackmx.vercel.app/industrial-hero.webp"],
            },
        },
    },
};
