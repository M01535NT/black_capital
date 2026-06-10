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
    { value: "Privacidad", label: "Acceso, entorno y ritmo de vida evaluados antes de visitar." },
    { value: "Zona", label: "Ubicaciones con servicios, conectividad y plusvalía residencial." },
    { value: "Diseño", label: "Distribución, luz y acabados leídos con criterio familiar." },
    { value: "Plusvalía", label: "Perspectiva patrimonial para comprar con intención de largo plazo." },
];

const BUSINESS_STATS: StatItem[] = [
    { value: "Zona Río", label: "Corredor corporativo con servicios, oficinas y alta exposición." },
    { value: "Otay", label: "Conectividad binacional para operación, comercio y logística ligera." },
    { value: "Díaz Ordaz", label: "Eje comercial denso para atención local, retail y servicios." },
    { value: "Renta", label: "Lectura de flujo, visibilidad y permanencia del giro antes de ofertar." },
];

const INDUSTRIAL_STATS: StatItem[] = [
    { value: "m²", label: "Superficie útil, expansión posible y relación entre nave, patio y oficinas." },
    { value: "Andenes", label: "Altura, carga, rampas y accesos para el flujo diario de operación." },
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
            backgroundAlt: "Casa residencial premium en fraccionamiento privado",
            accent: "gold",
            headline: (
                <>
                    Casas en Tijuana.
                </>
            ),
            subtitle:
                "Residencias seleccionadas por privacidad, zona y plusvalía.",
            primaryCta: { label: "Ver residencias", href: "/inventario?brand=luxury" },
            secondaryCta: { label: "Hablar con asesor", href: "#luxury-cta" },
        },
        value: {
            eyebrow: "Residencial premium",
            title: (
                <>
                    Residencias con criterio, no solo metros.
                </>
            ),
            description:
                "Curamos opciones por privacidad, ubicación y potencial patrimonial.",
            items: [
                {
                    icon: Crown,
                    title: "Fraccionamientos Privados",
                    description:
                        "Entornos con acceso controlado, privacidad y vida familiar cerca de servicios clave.",
                },
                {
                    icon: Building2,
                    title: "Residencial Plus",
                    description:
                        "Casas con distribución, acabados y escala para habitar con intención.",
                },
                {
                    icon: Gem,
                    title: "Pre-Venta y Estreno",
                    description:
                        "Oportunidades nuevas con lectura de zona, entrega y valor futuro.",
                },
            ],
        },
        stats: LUXURY_STATS,
        inventory: {
            brandSlug: "luxury",
            propertyUse: "Residencial",
            title: "Residencias en",
            highlight: "Tijuana",
            subtitle:
                "Explora una muestra residencial y solicita opciones alineadas a zona, presupuesto y etapa de compra.",
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
            title: "Solicita una lectura",
            titleHighlight: "residencial privada",
            description:
                "Cuéntanos qué zona y tipo de residencia buscas. Te contactaremos con opciones curadas para tu decisión.",
            indicator: "Respuesta en menos de 24h",
            companyLabel: "Empresa (opcional)",
            companyPlaceholder: "Empresa o particular",
            companyRequired: false,
            emailPlaceholder: "Correo Electrónico",
            submitLabel: "Solicitar opciones residenciales",
            successTitle: "Solicitud recibida",
            successMessage:
                "Tu solicitud ha sido registrada. Nuestro equipo se pondrá en contacto contigo con una lectura residencial personalizada.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Luxury · Casas Residenciales Premium en Tijuana",
            description:
                "Residencias seleccionadas por privacidad, ubicación y plusvalía en Tijuana, Baja California.",
        },
        metadata: {
            title: "Casas en Tijuana | Black Capital",
            description:
                "Residencias seleccionadas en Tijuana por privacidad, ubicación y plusvalía. Asesoría residencial premium con criterio patrimonial.",
            keywords: [
                "casas en Tijuana",
                "fraccionamientos privados Tijuana",
                "residencial plus Tijuana",
                "Chapultepec Tijuana",
                "Playas de Tijuana",
                "casas en venta Tijuana",
                "Black Capital",
            ],
            robots: "index, follow",
            alternates: {
                canonical: "https://blackmx.vercel.app/black-luxury",
            },
            openGraph: {
                title: "Casas en Tijuana | Black Capital",
                description:
                    "Residencias seleccionadas en Tijuana por privacidad, ubicación y plusvalía.",
                type: "website",
                locale: "es_MX",
                siteName: "Black Capital",
                url: "https://blackmx.vercel.app/black-luxury",
                images: [
                    {
                        url: "https://blackmx.vercel.app/hero-luxury.webp",
                        width: 1200,
                        height: 630,
                        alt: "Casa residencial premium en Tijuana",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "Casas en Tijuana | Black Capital",
                description:
                    "Residencias seleccionadas en Tijuana por privacidad, ubicación y plusvalía.",
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
                    Espacios para operar.
                </>
            ),
            subtitle:
                "Locales, oficinas y plazas evaluadas por flujo, visibilidad y retorno.",
            primaryCta: { label: "Ver activos comerciales", href: "/inventario?brand=business" },
            secondaryCta: { label: "Solicitar análisis", href: "#business-cta" },
        },
        value: {
            eyebrow: "Criterio comercial",
            title: (
                <>
                    Decide por corredor, giro y rendimiento.
                </>
            ),
            description:
                "Priorizamos activos por demanda, exposición y claridad operativa.",
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
                        "Punto de cruce entre comercio, operación y conectividad binacional.",
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
            title: "Activos",
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
            title: "Solicita una lectura",
            titleHighlight: "de operación",
            description:
                "Cuéntanos el giro, zona y formato que buscas. Te ayudamos a comparar opciones con criterio comercial.",
            indicator: "Respuesta en menos de 24h",
            companyLabel: "Empresa",
            companyPlaceholder: "Empresa",
            companyRequired: false,
            emailPlaceholder: "Correo Electrónico",
            submitLabel: "Solicitar análisis comercial",
            successTitle: "Solicitud recibida",
            successMessage:
                "Tu solicitud ha sido registrada. Nuestro equipo se pondrá en contacto contigo con opciones comerciales alineadas a tu operación.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Business · Centros Comerciales y Locales en Tijuana",
            description:
                "Locales, oficinas y plazas comerciales evaluadas por flujo, visibilidad y operación en Tijuana, Baja California.",
        },
        metadata: {
            title: "Locales Comerciales en Tijuana | Black Capital",
            description:
                "Locales, oficinas y plazas en Tijuana evaluadas por flujo, visibilidad y operación. Asesoría comercial con lectura de zona.",
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
                    "Locales, oficinas y plazas en Tijuana evaluadas por flujo, visibilidad y operación.",
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
                    "Locales, oficinas y plazas en Tijuana evaluadas por flujo, visibilidad y operación.",
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
                    Operación industrial.
                </>
            ),
            subtitle:
                "Naves, bodegas y suelo para decisiones de escala operativa.",
            primaryCta: { label: "Ver activos industriales", href: "/inventario?brand=industrial" },
            secondaryCta: { label: "Solicitar portafolio", href: "#industrial-cta" },
            highlights: [
                { value: "m²", label: "Superficie" },
                { value: "Otay", label: "Corredor" },
                { value: "Carga", label: "Operación" },
            ],
            gridLines: true,
            cursorGlow: false,
        },
        value: {
            eyebrow: "Activos industriales",
            title: (
                <>
                    La operación manda sobre la ficha.
                </>
            ),
            description:
                "Ordenamos opciones por capacidad, conectividad y restricciones de uso.",
            items: [
                {
                    icon: Factory,
                    title: "Naves Industriales",
                    description:
                        "Altura, claros, energía y andenes leídos contra el tipo de operación.",
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
                "Revisa activos por superficie, conectividad, tipo de operación y capacidad de maniobra.",
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
            title: "Solicita una lectura",
            titleHighlight: "operativa",
            description:
                "Comparte superficie, uso y zona objetivo. Te ayudamos a filtrar activos por capacidad real de operación.",
            companyLabel: "Empresa",
            companyPlaceholder: "Empresa *",
            companyRequired: true,
            emailPlaceholder: "Correo Corporativo",
            submitLabel: "Solicitar análisis industrial",
            successTitle: "Solicitud Registrada",
            successMessage:
                "Nuestro equipo se pondrá en contacto contigo con una lectura industrial alineada a tu operación.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Industrial · Naves, Bodegas y Parques Logísticos en Tijuana",
            description:
                "Naves, bodegas y activos industriales en Tijuana evaluados por superficie, conectividad y capacidad operativa.",
        },
        metadata: {
            title: "Naves Industriales en Tijuana | Black Capital",
            description:
                "Naves, bodegas y parques industriales en Tijuana evaluados por superficie, conectividad y capacidad operativa.",
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
                    "Naves, bodegas y parques industriales en Tijuana evaluados por superficie, conectividad y operación.",
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
                    "Naves, bodegas y parques industriales en Tijuana evaluados por superficie, conectividad y operación.",
                images: ["https://blackmx.vercel.app/industrial-hero.webp"],
            },
        },
    },
};
