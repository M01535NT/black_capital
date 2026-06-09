import type { Metadata } from "next";
import { SubBrandHero } from "@/components/shared/SubBrandHero";
import { BusinessValue } from "@/components/business/BusinessValue";
import { BusinessStats } from "@/components/business/BusinessStats";
import { BrandInventory } from "@/components/shared/BrandInventory";
import { JsonLd } from "@/components/seo/JsonLd";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

const config = SUB_BRAND_CONFIGS.business;

export const metadata: Metadata = config.metadata;

export default function BlackBusinessPage() {
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
            <BusinessValue />
            <BusinessStats />
            <BrandInventory
                brandSlug={config.inventory.brandSlug}
                propertyUse={config.inventory.propertyUse}
                title={config.inventory.title}
                highlight={config.inventory.highlight}
                subtitle={config.inventory.subtitle}
                ctaText={config.inventory.ctaText}
                accentColor={config.inventory.accentColor}
            />
            <JsonLd id="ld-business" data={config.jsonLd} />
        </>
    );
}
