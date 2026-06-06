import type { Metadata } from "next";
import { SubBrandHero } from "@/components/shared/SubBrandHero";
import { IndustrialValue } from "@/components/industrial/IndustrialValue";
import { IndustrialStats } from "@/components/industrial/IndustrialStats";
import { BrandInventory } from "@/components/shared/BrandInventory";
import { IndustrialCTA } from "@/components/industrial/IndustrialCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

const config = SUB_BRAND_CONFIGS.industrial;

export const metadata: Metadata = config.metadata;

export default function BlackIndustrialPage() {
    return (
        <>
            <SubBrandHero
                brand={config.hero.brand}
                backgroundImage={config.hero.backgroundImage}
                backgroundImageWebp={config.hero.backgroundImageWebp}
                backgroundAlt={config.hero.backgroundAlt}
                accent={config.hero.accent}
                overlayClass={config.hero.overlayClass}
                headline={config.hero.headline}
                subtitle={config.hero.subtitle}
                primaryCta={config.hero.primaryCta}
                secondaryCta={config.hero.secondaryCta}
                highlights={config.hero.highlights}
                gridLines={config.hero.gridLines}
                cursorGlow={config.hero.cursorGlow}
            />
            <IndustrialValue />
            <IndustrialStats />
            <BrandInventory
                brandSlug={config.inventory.brandSlug}
                propertyUse={config.inventory.propertyUse}
                title={config.inventory.title}
                highlight={config.inventory.highlight}
                subtitle={config.inventory.subtitle}
                ctaText={config.inventory.ctaText}
                accentColor={config.inventory.accentColor}
            />
            <IndustrialCTA />
            <JsonLd id="ld-industrial" data={config.jsonLd} />
        </>
    );
}
