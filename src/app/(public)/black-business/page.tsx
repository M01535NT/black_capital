import type { Metadata } from "next";
import { SubBrandPage } from "@/components/shared/SubBrandPage";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

const config = SUB_BRAND_CONFIGS.business;
export const metadata: Metadata = config.metadata;

export default function BlackBusinessPage() {
    return <SubBrandPage config={config} />;
}
