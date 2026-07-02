import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";
import {
    DEFAULT_FAQ_CATALOG,
    normalizeFaqCatalog,
    type FaqCatalogItem,
} from "@/lib/property-faqs";

const SETTINGS_KEY = "faq_catalog";

/**
 * Catálogo vigente de FAQ. Lee `app_settings[faq_catalog]`; si no existe o está
 * corrupto, cae al DEFAULT_FAQ_CATALOG. Se usa tanto en la ficha pública (server
 * component) como en las páginas admin.
 */
export async function getFaqCatalog(): Promise<FaqCatalogItem[]> {
    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from("app_settings")
            .select("value")
            .eq("key", SETTINGS_KEY)
            .maybeSingle();
        if (error) {
            logger.error("faq-catalog", "[getFaqCatalog] read error:", error);
            return DEFAULT_FAQ_CATALOG;
        }
        if (!data?.value) return DEFAULT_FAQ_CATALOG;
        return normalizeFaqCatalog(data.value);
    } catch (err) {
        logger.error("faq-catalog", "[getFaqCatalog] unexpected:", err);
        return DEFAULT_FAQ_CATALOG;
    }
}

/** Persiste el catálogo completo (admin). Ya debe venir normalizado. */
export async function saveFaqCatalog(
    catalog: FaqCatalogItem[],
    profileId: string,
): Promise<{ error: string | null }> {
    const supabase = createAdminClient();
    const { error } = await supabase.from("app_settings").upsert({
        key: SETTINGS_KEY,
        value: catalog,
        updated_by: profileId,
        updated_at: new Date().toISOString(),
    });
    if (error) {
        logger.error("faq-catalog", "[saveFaqCatalog] write error:", error);
        return { error: error.message };
    }
    await supabase.from("audit_logs").insert({
        actor_profile_id: profileId,
        action: "faq_catalog.update",
        entity_type: "app_settings",
        entity_id: SETTINGS_KEY,
        metadata: { count: catalog.length },
    });
    return { error: null };
}
