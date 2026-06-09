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
    { value: 3, label: "Tipos de propiedad", suffix: "", prefix: "" },
    { value: 24, label: "Horas para responder", suffix: "h", prefix: "" },
    { value: 5, label: "Zonas de ejemplo", suffix: "", prefix: "" },
    { value: 1, label: "Catálogo editable", suffix: "", prefix: "" },
];

const BUSINESS_STATS: StatItem[] = [
    { value: 3, label: "Formatos comerciales", suffix: "", prefix: "" },
    { value: 24, label: "Horas para responder", suffix: "h", prefix: "" },
    { value: 4, label: "Variables de análisis", suffix: "", prefix: "" },
    { value: 1, label: "Catálogo editable", suffix: "", prefix: "" },
];

const INDUSTRIAL_STATS: StatItem[] = [
    { value: 3, label: "Tipos industriales", suffix: "", prefix: "" },
    { value: 24, label: "Horas para responder", suffix: "h", prefix: "" },
    { value: 4, label: "Criterios logísticos", suffix: "", prefix: "" },
    { value: 1, label: "Portafolio editable", suffix: "", prefix: "" },
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
                "Residencial seleccionado por zona, valor y estilo de vida.",
            primaryCta: { label: "Explorar Propiedades", href: "/inventario?brand=luxury" },
            secondaryCta: { label: "Solicitar Información", href: "#luxury-cta" },
        },
        value: {
            eyebrow: "Residencial Premium",
            title: (
                <>
                    Segmenta propiedades residenciales desde el primer clic.
                </>
            ),
            description:
                "La estructura está preparada para mostrar propiedades por ubicación, seguridad, diseño arquitectónico y potencial de plusvalía cuando el catálogo real esté disponible.",
            items: [
                {
                    icon: Crown,
                    title: "Fraccionamientos Privados",
                    description:
                        "Casas en cotos con acceso controlado, seguridad 24/7, áreas verdes y amenidades familiares. Chapultepec, La Escondida, El Lago y zonas premium consolidadas.",
                },
                {
                    icon: Building2,
                    title: "Residencial Plus",
                    description:
                        "Propiedades de 3+ recámaras con acabados de calidad superior, cocinas equipadas, jardín privado y estacionamiento para 2+ autos. Listas para habitar o personalizar.",
                },
                {
                    icon: Gem,
                    title: "Pre-Venta y Estreno",
                    description:
                        "Acceso anticipado a desarrollos nuevos en zonas de alta demanda. Oportunidades de compra sobre plano con precio preferencial y condiciones de financiamiento flexibles.",
                },
            ],
        },
        stats: LUXURY_STATS,
        inventory: {
            brandSlug: "luxury",
            propertyUse: "Residencial",
            title: "Casas en",
            highlight: "Tijuana",
            subtitle:
                "Muestra de cómo se presentará el inventario residencial real con ubicación, superficies, precios y estado comercial administrables.",
            ctaText: "Ver Todas las Propiedades",
            accentColor: "gold",
        },
        cta: {
            brand: "luxury",
            source: "landing_luxury",
            notesPrefix: "Luxury Landing",
            notesFormat: "optional",
            sectionId: "luxury-cta",
            eyebrowIcon: "lock",
            eyebrow: "Información Personalizada",
            title: "Recibe el Catálogo",
            titleHighlight: "de Casas Disponibles",
            description:
                "Solicita información y te contactaremos cuando el catálogo residencial real esté listo para publicarse.",
            indicator: "Respuesta en menos de 24h",
            companyLabel: "Empresa (opcional)",
            companyPlaceholder: "Empresa o particular",
            companyRequired: false,
            emailPlaceholder: "Correo Electrónico",
            submitLabel: "Recibir Catálogo de Casas",
            successTitle: "¡Catálogo en Camino!",
            successMessage:
                "Tu solicitud ha sido registrada. Nuestro equipo de asesores se pondrá en contacto contigo en las próximas 24 horas con la información personalizada de propiedades disponibles.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Luxury · Casas Residenciales Premium en Tijuana",
            description:
                "Casas en fraccionamientos privados con seguridad 24/7, amenidades y ubicación premium en las mejores zonas de Tijuana, Baja California.",
        },
        metadata: {
            title: "Casas Residenciales Premium en Tijuana | Fraccionamientos Privados | Black Capital",
            description:
                "Encuentra tu casa ideal en los mejores fraccionamientos de Tijuana. Residencial Plus con seguridad 24/7, amenidades y ubicación estratégica. Agenda visita.",
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
                title: "Casas Residenciales Premium en Tijuana | Fraccionamientos Privados",
                description:
                    "Casas en los mejores fraccionamientos de Tijuana. Residencial Plus con seguridad 24/7, amenidades premium y ubicación estratégica.",
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
                title: "Casas Residenciales Premium en Tijuana | Fraccionamientos Privados",
                description:
                    "Casas en los mejores fraccionamientos de Tijuana. Residencial Plus con seguridad 24/7, amenidades premium y ubicación estratégica.",
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
                "Locales, oficinas y plazas con lectura comercial.",
            primaryCta: { label: "Explorar Propiedades", href: "/inventario?brand=business" },
            secondaryCta: { label: "Asesoría Comercial", href: "#business-cta" },
        },
        value: {
            eyebrow: "Oportunidades Comerciales",
            title: (
                <>
                    Ordena oportunidades comerciales por uso y zona.
                </>
            ),
            description:
                "La estructura está preparada para ordenar activos comerciales por ubicación, flujo, formato y potencial de operación cuando el catálogo real esté disponible.",
            items: [
                {
                    icon: Briefcase,
                    title: "Oficinas Ejecutivas",
                    description:
                        "Espacios de trabajo modernos en corredores comerciales consolidados como Zona Río, Otay y Díaz Ordaz. Estacionamiento, seguridad y servicios incluidos.",
                },
                {
                    icon: Building,
                    title: "Locales y Plazas Comerciales",
                    description:
                        "Locales de alta visibilidad en plazas con flujo peatonal comprobado. Ideales para retail, restaurantes, consultorios y showrooms en zonas de alto tráfico.",
                },
                {
                    icon: TrendingUp,
                    title: "Inversión en Renta Comercial",
                    description:
                        "Activos con inquilinos verificados y contratos a largo plazo. Análisis de cap rate y flujo operativo incluido para cada oportunidad de inversión.",
                },
            ],
        },
        stats: BUSINESS_STATS,
        inventory: {
            brandSlug: "business",
            propertyUse: "Comercial",
            title: "Locales y",
            highlight: "Oficinas",
            subtitle:
                "Muestra de cómo se presentará el inventario comercial real con formato, superficie y datos de operación administrables.",
            ctaText: "Ver Todas las Propiedades",
            accentColor: "gold",
        },
        cta: {
            brand: "business",
            source: "landing_business",
            notesPrefix: "Business Landing",
            notesFormat: "optional",
            sectionId: "business-cta",
            eyebrowIcon: "lock",
            eyebrow: "Asesoría Comercial",
            title: "Encuentra el Espacio",
            titleHighlight: "Ideal para tu Negocio",
            description:
                "Solicita información y te contactaremos cuando el catálogo comercial real esté listo para publicarse.",
            indicator: "Respuesta en menos de 24h",
            companyLabel: "Empresa",
            companyPlaceholder: "Empresa",
            companyRequired: false,
            emailPlaceholder: "Correo Electrónico",
            submitLabel: "Solicitar Asesoría Comercial",
            successTitle: "¡Solicitud Recibida!",
            successMessage:
                "Tu solicitud ha sido registrada. Nuestro equipo de asesoría comercial se pondrá en contacto contigo en las próximas 24 horas con opciones personalizadas.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Business · Centros Comerciales y Locales en Tijuana",
            description:
                "Locales comerciales, oficinas ejecutivas y plazas en zonas de alto tráfico de Tijuana, Baja California.",
        },
        metadata: {
            title: "Centros Comerciales y Locales en Tijuana | Inversión Comercial | Black Capital",
            description:
                "Locales comerciales, oficinas y plazas en zonas de alto tráfico en Tijuana. Inversión segura con flujo comprobado y contratos transparentes. Solicita información.",
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
                title: "Centros Comerciales y Locales en Tijuana | Inversión Comercial",
                description:
                    "Locales comerciales, oficinas y plazas en zonas de alto tráfico en Tijuana. Análisis de cap rate y flujo operativo incluido.",
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
                title: "Centros Comerciales y Locales en Tijuana | Inversión Comercial",
                description:
                    "Locales comerciales, oficinas y plazas en zonas de alto tráfico en Tijuana. Análisis de cap rate y flujo operativo incluido.",
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
            overlayClass: "from-black/70 via-black/50",
            headline: (
                <>
                    Operación industrial.
                </>
            ),
            subtitle:
                "Naves, bodegas y corredores logísticos en Tijuana.",
            primaryCta: { label: "Ver Inventario Industrial", href: "/inventario?brand=industrial" },
            gridLines: true,
            cursorGlow: false,
        },
        value: {
            eyebrow: "Verticales de Activo",
            title: (
                <>
                    Filtra naves, bodegas y suelo industrial con claridad.
                </>
            ),
            description:
                "La estructura está preparada para presentar activos industriales por ubicación, conectividad, capacidad y criterios logísticos cuando el catálogo real esté disponible.",
            items: [
                {
                    icon: Factory,
                    title: "Naves Industriales",
                    description:
                        "Naves clase A con alturas de +8m, andenes de carga y patios de maniobra. Ideales para manufactura ligera, ensamblaje, almacenaje y distribución en parques consolidados.",
                },
                {
                    icon: Warehouse,
                    title: "Bodegas y Almacenes",
                    description:
                        "Espacios de almacenamiento seco con acceso controlado, rampas y muelles. Desde bodegas de 500 m² hasta centros de distribución de 5,000 m² cerca de la garita de Otay.",
                },
                {
                    icon: Truck,
                    title: "Parques Logísticos",
                    description:
                        "Parques industriales con conectividad directa a vías primarias, acceso a corredores de exportación T-MEC y servicios de infraestructura completa para operaciones logísticas.",
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
                "Muestra de cómo se presentará el inventario industrial real con superficie, uso, conectividad y estado comercial administrables.",
            ctaText: "Ver Todas las Propiedades",
            accentColor: "steel",
        },
        cta: {
            brand: "industrial",
            source: "landing_industrial",
            notesPrefix: "Industrial Landing",
            notesFormat: "always",
            eyebrowIcon: "download",
            eyebrow: "Portafolio Industrial",
            title: "Recibe Nuestro Portafolio",
            titleHighlight: "Industrial Actualizado",
            description:
                "Solicita información y te contactaremos cuando el portafolio industrial real esté listo para publicarse.",
            companyLabel: "Empresa",
            companyPlaceholder: "Empresa *",
            companyRequired: true,
            emailPlaceholder: "Correo Corporativo",
            submitLabel: "Solicitar Portafolio Industrial",
            successTitle: "Solicitud Registrada",
            successMessage:
                "Nuestro equipo de inversiones industriales se pondrá en contacto contigo en las próximas 24 horas con el portafolio actualizado y análisis correspondiente.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Industrial · Naves, Bodegas y Parques Logísticos en Tijuana",
            description:
                "Naves industriales, bodegas y parques logísticos en los principales corredores industriales de Tijuana, Baja California.",
        },
        metadata: {
            title: "Naves Industriales y Parques Logísticos en Tijuana | Black Capital",
            description:
                "Naves industriales, bodegas y parques logísticos en Tijuana. Ubicación estratégica cerca de garitas y corredores de exportación. Contáctanos.",
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
                title: "Naves Industriales y Parques Logísticos en Tijuana | Black Capital",
                description:
                    "Naves industriales, bodegas y parques logísticos en Tijuana. Conectividad estratégica cerca de garitas y corredores de exportación T-MEC.",
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
                title: "Naves Industriales y Parques Logísticos en Tijuana | Black Capital",
                description:
                    "Naves industriales, bodegas y parques logísticos en Tijuana. Conectividad estratégica cerca de garitas y corredores de exportación T-MEC.",
                images: ["https://blackmx.vercel.app/industrial-hero.webp"],
            },
        },
    },
};
