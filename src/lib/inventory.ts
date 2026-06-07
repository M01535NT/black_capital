/**
 * Inventory data layer.
 *
 * Server-side fetch of featured properties for the home carousel.
 * Safe to call from a server component: any Supabase error or unreachable
 * DB returns an empty list with `isLive: false` so the home renders cleanly
 * with a "we are updating" empty state.
 */
import { createAdminClient } from "@/lib/supabase/admin";
import type { PropertyCardData } from "@/components/property/PropertyCard";

export type FeaturedProperty = PropertyCardData & { property_type: string };

export interface FeaturedInventoryResult {
  items: FeaturedProperty[];
  isLive: boolean;
}

const FEATURED_LIMIT = 6;

/** Fetch featured properties for the home carousel. */
export async function getFeaturedProperties(): Promise<FeaturedInventoryResult> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("properties")
      .select(
        "id, title, slug, property_use, business_type, m2_terrain, m2_construction, price, currency, cover_image, custom_attributes, property_type"
      )
      .eq("is_featured", true)
      .eq("status", "Available")
      .order("created_at", { ascending: false })
      .limit(FEATURED_LIMIT);

    if (error) {
      console.warn("[getFeaturedProperties] Supabase returned an error", error);
      return { items: [], isLive: false };
    }

    return { items: (data as FeaturedProperty[]) ?? [], isLive: true };
  } catch (err) {
    console.warn("[getFeaturedProperties] Failed to fetch", err);
    return { items: [], isLive: false };
  }
}
