/**
 * SocialProof data layer.
 *
 * Fetches live counts from Supabase so the homepage counters reflect
 * the actual state of the business (no more "0+" while data loads).
 *
 * Safe to call from a server component. If Supabase is unreachable
 * or returns an error, we return zeros — the home page will still
 * render and the fallback UI will guide the visitor.
 */
import { createAdminClient } from "@/lib/supabase/admin";
import { CONTACT_CONFIG } from "@/lib/contact-config";

export interface SocialStats {
    /** Years the firm has been in business. Static; lives in CONTACT_CONFIG. */
    yearsInBusiness: number;
    /** Count of properties whose status indicates a closed transaction. */
    closedDeals: number;
    /** Count of unique leads ever captured. */
    clientsServed: number;
    /** Sum of asking prices of all currently-available properties, in MXN. */
    portfolioValueMXN: number;
    /** True when the Supabase queries succeeded. */
    isLive: boolean;
}

const ZERO_STATS: SocialStats = {
    yearsInBusiness: CONTACT_CONFIG.business.yearsInBusiness,
    closedDeals: 0,
    clientsServed: 0,
    portfolioValueMXN: 0,
    isLive: false,
};

/** Fetch the four social-proof numbers in parallel. */
export async function getSocialStats(): Promise<SocialStats> {
    try {
        const supabase = createAdminClient();

        const [closedRes, clientsRes, portfolioRes] = await Promise.all([
            supabase
                .from("properties")
                .select("id", { count: "exact", head: true })
                .in("status", ["Sold", "Rented"]),
            supabase
                .from("leads")
                .select("id", { count: "exact", head: true }),
            supabase
                .from("properties")
                .select("price")
                .eq("status", "Available"),
        ]);

        if (closedRes.error || clientsRes.error || portfolioRes.error) {
            console.warn(
                "[getSocialStats] Supabase returned an error, falling back to zeros",
                { closedRes, clientsRes, portfolioRes },
            );
            return ZERO_STATS;
        }

        const portfolioValueMXN =
            portfolioRes.data?.reduce(
                (sum, row) => sum + (Number(row.price) || 0),
                0,
            ) ?? 0;

        return {
            yearsInBusiness: CONTACT_CONFIG.business.yearsInBusiness,
            closedDeals: closedRes.count ?? 0,
            clientsServed: clientsRes.count ?? 0,
            portfolioValueMXN,
            isLive: true,
        };
    } catch (err) {
        console.warn("[getSocialStats] Failed to fetch stats", err);
        return ZERO_STATS;
    }
}
