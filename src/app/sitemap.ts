import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blackcorporativo.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        // ── Nivel 1: Home ──
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },

        // ── Nivel 1: Servicios (divisiones) ──
        { url: `${SITE_URL}/black-luxury`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${SITE_URL}/black-business`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${SITE_URL}/black-industrial`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },

        // ── Nivel 1: Catálogo unificado ──
        { url: `${SITE_URL}/inventario`, lastModified: now, changeFrequency: "daily", priority: 0.9 },

        // ── Nivel 2: Herramientas ──
        { url: `${SITE_URL}/herramientas`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },

        // ── Nivel 2: Corporativo ──
        { url: `${SITE_URL}/nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${SITE_URL}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },

        // ── Nivel 3: Legal ──
        { url: `${SITE_URL}/legal/aviso-privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: `${SITE_URL}/legal/terminos-condiciones`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ];

    // Dynamic property pages
    let propertyPages: MetadataRoute.Sitemap = [];
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from("properties")
            .select("slug, id, updated_at, created_at")
            .eq("status", "Available")
            .order("created_at", { ascending: false });

        if (data) {
            propertyPages = (data as Array<{ slug: string | null; id: string; updated_at: string | null; created_at: string }>).map((p) => ({
                url: `${SITE_URL}/inventario/${p.slug || p.id}`,
                lastModified: new Date(p.updated_at || p.created_at),
                changeFrequency: "weekly" as const,
                priority: 0.8,
            }));
        }
    } catch {
        // Si Supabase no responde, el sitemap igual se entrega con las páginas estáticas
    }

    return [...staticPages, ...propertyPages];
}
