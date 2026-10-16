import { getSiteSettings } from "@/lib/site-settings";
import { SubBrandHero } from '@/components/shared/SubBrandHero';
import { SubBrandValue } from '@/components/shared/SubBrandValue';
import { SubBrandCTA } from '@/components/shared/SubBrandCTA';
import { BrandInventory } from '@/components/shared/BrandInventory';
import { JsonLd } from '@/components/seo/JsonLd';
import type { SubBrandConfig } from '@/lib/sub-brand-config';

/** One browsing sequence, with each segment's own content and search criteria. */
export async function SubBrandPage({ config }: { config: SubBrandConfig }) {
    const settings = await getSiteSettings();
    const hero = { ...config.hero, headline: settings[`${config.key}HeroTitle`], subtitle: settings[`${config.key}HeroSubtitle`] };
    return (
        <>
            <SubBrandHero {...hero} />
            <BrandInventory {...config.inventory} useLiveData />
            <SubBrandValue brand={config.key} accent={config.hero.accent} {...config.value} />
            <SubBrandCTA config={config.cta} />
            <JsonLd id={`ld-${config.key}`} data={config.jsonLd} />
        </>
    );
}
