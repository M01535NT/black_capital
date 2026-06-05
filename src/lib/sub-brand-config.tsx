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
        name: "Black Corporativo",
        url: "https://blackcorporativo.com",
    },
} as const;

const LUXURY_STATS: StatItem[] = [
    { value: 850, label: "Millones USD en Portafolio", suffix: "+", prefix: "$" },
    { value: 120, label: "Propiedades Curadas", suffix: "+", prefix: "" },
    { value: 35, label: "Desarrollos Exclusivos", suffix: "+", prefix: "" },
    { value: 6, label: "Ciudades Premium", suffix: "", prefix: "" },
];

const BUSINESS_STATS: StatItem[] = [
    { value: 420, label: "Millones USD Comerciales", suffix: "+", prefix: "$" },
    { value: 80, label: "Activos Clase A", suffix: "+", prefix: "" },
    { value: 95, label: "% Ocupación Promedio", suffix: "%", prefix: "" },
    { value: 12, label: "Años en Mercado", suffix: "+", prefix: "" },
];

const INDUSTRIAL_STATS: StatItem[] = [
    { value: 250, label: "Mil m² Portafolio", suffix: "K+", prefix: "" },
    { value: 45, label: "Naves Activas", suffix: "+", prefix: "" },
    { value: 8, label: "Estados", suffix: "", prefix: "" },
    { value: 12, label: "Años Track Record", suffix: "+", prefix: "" },
];

export const SUB_BRAND_CONFIGS: Record<SubBrandKey, SubBrandConfig> = {
    luxury: {
        key: "luxury",
        ctaSectionId: "luxury-cta",
        hero: {
            brand: "Black Luxury",
            backgroundImage: "/luxury-hero.png",
            backgroundImageWebp: "/luxury-hero.webp",
            backgroundAlt: "Residencia de súper lujo",
            accent: "gold",
            headline: (
                <>
                    Donde el Lujo
                    <br />
                    se Convierte en <span className="metallic-gold">Legado</span>
                </>
            ),
            subtitle:
                "Residencias trofeo, penthouses de autor y desarrollos exclusivos seleccionados para inversores HNWI con los estándares más exigentes del mercado inmobiliario mexicano.",
            primaryCta: { label: "Explorar Portafolio", href: "/inventario?brand=luxury" },
            secondaryCta: { label: "Solicitar Acceso Privado", href: "#luxury-cta" },
        },
        value: {
            eyebrow: "Exclusividad Certificada",
            title: (
                <>
                    El Arte de Invertir en{" "}
                    <span className="metallic-gold">lo Extraordinario</span>
                </>
            ),
            description:
                "Cada propiedad en nuestro portafolio de lujo ha sido curada personalmente bajo criterios de ubicación, diseño, plusvalía y nivel de exclusividad.",
            items: [
                {
                    icon: Crown,
                    title: "Residencias Trofeo",
                    description:
                        "Propiedades icónicas en las zonas de mayor plusvalía. Casas de autor, mansiones y fincas con diseño arquitectónico de firma y amenidades excepcionales.",
                },
                {
                    icon: Building2,
                    title: "Penthouses de Autor",
                    description:
                        "Los pisos más altos con las mejores vistas. Penthouses en torres emblemáticas con acabados de altísima gama y sistemas domóticos de última generación.",
                },
                {
                    icon: Gem,
                    title: "Desarrollos Exclusivos",
                    description:
                        "Acceso anticipado a proyectos residenciales Pre-Venta y Off-Market. Oportunidades de inversión con rendimientos superiores al promedio del mercado.",
                },
            ],
        },
        stats: LUXURY_STATS,
        inventory: {
            brandSlug: "luxury",
            propertyUse: "Residencial",
            title: "Propiedades de",
            highlight: "Súper Lujo",
            subtitle:
                "Cada propiedad ha sido verificada, analizada financieramente y aprobada por nuestro comité de inversiones.",
            ctaText: "Ver Portafolio Completo",
            accentColor: "gold",
        },
        cta: {
            brand: "luxury",
            panel: "luxury",
            source: "landing_luxury",
            notesPrefix: "Luxury Landing",
            notesFormat: "optional",
            sectionId: "luxury-cta",
            eyebrowIcon: "lock",
            eyebrow: "Acceso Privado",
            title: "Accede al Directorio",
            titleHighlight: "de Propiedades Exclusivas",
            description:
                "Portafolio reservado con propiedades Off-Market, análisis financiero personalizado, y acompañamiento fiduciario para inversiones de alto patrimonio.",
            indicator: "Respuesta en menos de 24h",
            companyLabel: "Empresa o Fondo",
            companyPlaceholder: "Empresa o Fondo",
            companyRequired: false,
            emailPlaceholder: "Correo Electrónico",
            submitLabel: "Solicitar Acceso Exclusivo",
            successTitle: "¡Bienvenido al Directorio Exclusivo!",
            successMessage:
                "Tu solicitud ha sido registrada. Nuestro equipo de relaciones con inversores se pondrá en contacto contigo en las próximas 24 horas para brindarte acceso personalizado.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Luxury · Residencias de Súper Lujo",
            description:
                "Portafolio curado de residencias trofeo, penthouses de autor y desarrollos exclusivos para inversores HNWI en México.",
        },
        metadata: {
            title: "Black Luxury | Residencias de Súper Lujo en México",
            description:
                "Residencias trofeo, penthouses de autor y desarrollos exclusivos para inversores HNWI. Propiedades curadas con análisis financiero personalizado.",
            keywords: [
                "residencias de lujo México",
                "penthouses premium",
                "inversión inmobiliaria alto patrimonio",
                "propiedades exclusivas",
                "Black Luxury",
                "bienes raíces lujo",
            ],
            robots: "index, follow",
            alternates: {
                canonical: "https://blackcorporativo.com/black-luxury",
            },
            openGraph: {
                title: "Black Luxury | Residencias de Súper Lujo en México",
                description:
                    "Portafolio curado de propiedades de súper lujo con análisis financiero, acceso Off-Market y acompañamiento fiduciario.",
                type: "website",
                locale: "es_MX",
                siteName: "Black Corporativo",
                url: "https://blackcorporativo.com/black-luxury",
                images: [
                    {
                        url: "https://blackcorporativo.com/luxury-hero.png",
                        width: 1200,
                        height: 630,
                        alt: "Residencia de súper lujo Black Luxury",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "Black Luxury | Residencias de Súper Lujo en México",
                description:
                    "Portafolio curado de propiedades de súper lujo con análisis financiero, acceso Off-Market y acompañamiento fiduciario.",
                images: ["https://blackcorporativo.com/luxury-hero.png"],
            },
        },
    },

    business: {
        key: "business",
        ctaSectionId: "business-cta",
        hero: {
            brand: "Black Business",
            backgroundImage: "/business-hero.png",
            backgroundImageWebp: "/business-hero.webp",
            backgroundAlt: "Oficina corporativa premium",
            accent: "gold",
            headline: (
                <>
                    Espacios que
                    <br />
                    Impulsan <span className="metallic-gold">Negocios</span>
                </>
            ),
            subtitle:
                "Oficinas corporativas, locales comerciales y plazas premium seleccionadas para empresas que exigen ubicación estratégica, eficiencia operativa y retorno garantizado.",
            primaryCta: { label: "Explorar Portafolio", href: "/inventario?brand=business" },
            secondaryCta: { label: "Solicitar Asesoría Corporativa", href: "#business-cta" },
        },
        value: {
            eyebrow: "Oportunidades Comerciales",
            title: (
                <>
                    Activos que Generan <span className="metallic-gold">Valor</span>
                </>
            ),
            description:
                "Cada propiedad comercial en nuestro portafolio ha sido analizada bajo criterios de ubicación, flujo operativo, cap rate y proyección de plusvalía.",
            items: [
                {
                    icon: Briefcase,
                    title: "Oficinas Corporativas",
                    description:
                        "Espacios de trabajo en torres emblemáticas con acabados premium, estacionamiento ejecutivo y salas de juntas equipadas. Ubicaciones estratégicas en los corredores de negocio más importantes.",
                },
                {
                    icon: Building,
                    title: "Locales y Plazas Comerciales",
                    description:
                        "Locales comerciales de alta visibilidad en plazas con flujo peatonal comprobado. Ideales para retail premium, restaurantes, showrooms y flagship stores de marcas líderes.",
                },
                {
                    icon: TrendingUp,
                    title: "Inversión en Renta Comercial",
                    description:
                        "Portafolio de activos comerciales con inquilinos triple-net, contratos a largo plazo y rendimientos superiores a la renta fija. Análisis Cap Rate y flujo operativo incluido.",
                },
            ],
        },
        stats: BUSINESS_STATS,
        inventory: {
            brandSlug: "business",
            propertyUse: "Comercial",
            title: "Activos",
            highlight: "Corporativos",
            subtitle:
                "Cada activo ha sido evaluado por ubicación, flujo, retorno y potencial de plusvalía para asegurar decisiones de inversión informadas.",
            ctaText: "Ver Portafolio Completo",
            accentColor: "gold",
        },
        cta: {
            brand: "business",
            panel: "luxury",
            source: "landing_business",
            notesPrefix: "Business Landing",
            notesFormat: "optional",
            sectionId: "business-cta",
            eyebrowIcon: "lock",
            eyebrow: "Asesoría Corporativa",
            title: "Encuentra el Espacio",
            titleHighlight: "Ideal para tu Empresa",
            description:
                "Análisis de mercado corporativo, proyecciones de rendimiento y asesoría personalizada para optimizar tu operación inmobiliaria comercial.",
            indicator: "Respuesta en menos de 24h",
            companyLabel: "Empresa",
            companyPlaceholder: "Empresa",
            companyRequired: false,
            emailPlaceholder: "Correo Electrónico",
            submitLabel: "Solicitar Asesoría Comercial",
            successTitle: "¡Solicitud Recibida!",
            successMessage:
                "Tu solicitud ha sido registrada. Nuestro equipo de asesoría corporativa se pondrá en contacto contigo en las próximas 24 horas con opciones personalizadas.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Business · Activos Corporativos Clase A",
            description:
                "Oficinas corporativas, locales comerciales y plazas premium para empresas que exigen ubicación estratégica y retorno garantizado.",
        },
        metadata: {
            title: "Black Business | Activos Corporativos Clase A en México",
            description:
                "Oficinas corporativas, locales comerciales y plazas premium. Activos para empresas que exigen ubicación estratégica, eficiencia operativa y retorno garantizado.",
            keywords: [
                "oficinas corporativas México",
                "locales comerciales premium",
                "inversión inmobiliaria comercial",
                "activos clase A",
                "Black Business",
                "bienes raíces corporativos",
            ],
            robots: "index, follow",
            alternates: {
                canonical: "https://blackcorporativo.com/black-business",
            },
            openGraph: {
                title: "Black Business | Activos Corporativos Clase A",
                description:
                    "Portafolio curado de propiedades comerciales clase A con análisis financiero estructurado y acompañamiento corporativo integral.",
                type: "website",
                locale: "es_MX",
                siteName: "Black Corporativo",
                url: "https://blackcorporativo.com/black-business",
                images: [
                    {
                        url: "https://blackcorporativo.com/business-hero.png",
                        width: 1200,
                        height: 630,
                        alt: "Oficina corporativa premium Black Business",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "Black Business | Activos Corporativos Clase A",
                description:
                    "Portafolio curado de propiedades comerciales clase A con análisis financiero estructurado y acompañamiento corporativo integral.",
                images: ["https://blackcorporativo.com/business-hero.png"],
            },
        },
    },

    industrial: {
        key: "industrial",
        ctaSectionId: "industrial-cta",
        hero: {
            brand: "Black Industrial",
            backgroundImage: "/industrial-hero.png",
            backgroundImageWebp: "/industrial-hero.webp",
            backgroundAlt: "Complejo industrial moderno",
            accent: "steel",
            overlayClass: "from-black/70 via-black/50",
            headline: (
                <>
                    Infraestructura
                    <br />
                    <span className="metallic-gold">que Escala</span>
                </>
            ),
            subtitle:
                "Terrenos macro, naves industriales clase A y parques logísticos en los principales corredores de México. Análisis estructurado para decisiones de inversión institucional.",
            primaryCta: { label: "Ver Inventario Industrial", href: "/inventario?brand=industrial" },
            highlights: [
                { value: "250K+", label: "m² en portafolio" },
                { value: "45+", label: "naves activas" },
                { value: "8", label: "estados" },
            ],
            gridLines: true,
            cursorGlow: false,
        },
        value: {
            eyebrow: "Verticales de activo",
            title: (
                <>
                    Activos Industriales de
                    <span className="metallic-gold"> Alto Calibre</span>
                </>
            ),
            description:
                "Tres clases de activo industrial, una sola plataforma con análisis financiero estructurado para cada oportunidad.",
            items: [
                {
                    icon: Factory,
                    title: "Terrenos Macro",
                    description:
                        "Predios de +5 hectáreas estratégicamente ubicados en zonas de alta demanda industrial con acceso a vías primarias y servicios de infraestructura.",
                },
                {
                    icon: Warehouse,
                    title: "Naves Industriales",
                    description:
                        "Desde naves industriales clase A con alturas de +12m hasta soluciones Build-to-Suit (BTS) diseñadas para operaciones específicas.",
                },
                {
                    icon: Truck,
                    title: "Parques Logísticos",
                    description:
                        "Parques con conectividad estratégica a los principales corredores logísticos de México: T-MEC, Bajío, Pacífico y frontera norte.",
                },
            ],
        },
        stats: INDUSTRIAL_STATS,
        inventory: {
            brandSlug: "industrial",
            propertyUse: "Industrial",
            title: "Naves y",
            highlight: "Parques",
            subtitle:
                "Cada activo ha sido evaluado por ubicación, capacidad, conectividad y retorno para decisiones de inversión institucional.",
            ctaText: "Ver Portafolio Completo",
            accentColor: "steel",
        },
        cta: {
            brand: "industrial",
            panel: "industrial",
            source: "landing_industrial",
            notesPrefix: "Industrial Landing",
            notesFormat: "always",
            py: "py-24",
            eyebrowIcon: "download",
            eyebrow: "Portafolio Industrial",
            title: "Recibe Nuestro Portafolio",
            titleHighlight: "Industrial Actualizado",
            description:
                "Análisis financiero con cap rates, ocupación histórica, benchmarks de mercado y proyecciones de rendimiento para cada activo industrial disponible.",
            tags: ["Cap Rates", "Benchmarks", "Proyecciones"],
            companyLabel: "Empresa",
            companyPlaceholder: "Empresa *",
            companyRequired: true,
            emailPlaceholder: "Correo Corporativo",
            submitLabel: "Solicitar Portafolio Industrial",
            successTitle: "Solicitud Registrada",
            successMessage:
                "Nuestro equipo de inversiones industriales se pondrá en contacto contigo en las próximas 24 horas con el portafolio actualizado y análisis financiero correspondiente.",
        },
        jsonLd: {
            ...baseJsonLd,
            "@type": "ItemList",
            name: "Black Industrial · Naves, Bodegas y Parques Logísticos",
            description:
                "Terrenos macro, naves industriales clase A y parques logísticos en los principales corredores de México.",
        },
        metadata: {
            title: "Black Industrial | Naves, Bodegas y Parques Logísticos",
            description:
                "Terrenos macro, naves industriales clase A y parques logísticos en los principales corredores de México. Análisis estructurado para inversión institucional.",
            keywords: [
                "naves industriales México",
                "parques logísticos",
                "terrenos industriales",
                "inversión industrial institucional",
                "Black Industrial",
                "bienes raíces industriales",
            ],
            robots: "index, follow",
            alternates: {
                canonical: "https://blackcorporativo.com/black-industrial",
            },
            openGraph: {
                title: "Black Industrial | Infraestructura que Escala",
                description:
                    "Portafolio industrial con análisis estructurado para decisiones de inversión institucional en los principales corredores logísticos de México.",
                type: "website",
                locale: "es_MX",
                siteName: "Black Corporativo",
                url: "https://blackcorporativo.com/black-industrial",
                images: [
                    {
                        url: "https://blackcorporativo.com/industrial-hero.png",
                        width: 1200,
                        height: 630,
                        alt: "Complejo industrial moderno Black Industrial",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "Black Industrial | Infraestructura que Escala",
                description:
                    "Portafolio industrial con análisis estructurado para decisiones de inversión institucional en los principales corredores logísticos de México.",
                images: ["https://blackcorporativo.com/industrial-hero.png"],
            },
        },
    },
};
