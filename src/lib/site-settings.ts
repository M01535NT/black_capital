import "server-only";
import { cache } from "react";
import { createAdminClient } from "./supabase/admin";
import { normalizeSiteSettings, type SiteSettings } from "./site-settings-schema";

/** Render-scoped deduplication; no cross-request cache can keep a successful edit stale. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const { data, error } = await createAdminClient().from("app_settings").select("value").eq("key", "site").maybeSingle();
    return normalizeSiteSettings(error ? null : data?.value);
  } catch {
    return normalizeSiteSettings(null);
  }
});
