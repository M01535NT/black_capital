import type { Metadata } from "next";
import { SubBrandHero } from "@/components/shared/SubBrandHero";
import { LuxuryValue } from "@/components/luxury/LuxuryValue";
import { LuxuryStats } from "@/components/luxury/LuxuryStats";
import { BrandInventory } from "@/components/shared/BrandInventory";
import { JsonLd } from "@/components/seo/JsonLd";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

const config = SUB_BRAND_CONFIGS.luxury;

export const metadata: Metadata = config.metadata;

export default function BlackLuxuryPage() {
    return (
        <>
            <SubBrandHero
                brand={config.hero.brand}
                backgroundImage={config.hero.backgroundImage}
                backgroundImageWebp={config.hero.backgroundImageWebp}
                backgroundAlt={config.hero.backgroundAlt}
                accent={config.hero.accent}
                headline={config.hero.headline}
                subtitle={config.hero.subtitle}
                primaryCta={config.hero.primaryCta}
                secondaryCta={config.hero.secondaryCta}
                highlights={config.hero.highlights}
                gridLines={config.hero.gridLines}
            />
            <LuxuryValue />
            <LuxuryStats />
            <BrandInventory
                brandSlug={config.inventory.brandSlug}
                propertyUse={config.inventory.propertyUse}
                title={config.inventory.title}
                highlight={config.inventory.highlight}
                subtitle={config.inventory.subtitle}
                ctaText={config.inventory.ctaText}
                accentColor={config.inventory.accentColor}
            />
            <JsonLd id="ld-luxury" data={config.jsonLd} />
        </>
    );
}
