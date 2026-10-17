import type { Metadata } from "next";
import { CommercialLanding } from "@/components/business/CommercialLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

const config = SUB_BRAND_CONFIGS.business;
export const metadata: Metadata = config.metadata;

export default function BlackBusinessPage() {
    return <><CommercialLanding /><JsonLd id="ld-business" data={config.jsonLd} /></>;
}
