import type { Metadata } from "next";
import { ResidentialLanding } from "@/components/luxury/ResidentialLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

const config = SUB_BRAND_CONFIGS.luxury;
export const metadata: Metadata = config.metadata;

export default function BlackLuxuryPage() {
    return <><ResidentialLanding /><JsonLd id="ld-luxury" data={config.jsonLd} /></>;
}
