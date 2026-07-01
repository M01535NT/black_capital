import { test, expect } from "@playwright/test";

/**
 * Smoke test de producción — se ejecuta contra un deploy real (Vercel).
 *
 * Uso:
 *   SMOKE_BASE_URL=https://blackmx.vercel.app npx playwright test tests/production-smoke.spec.ts --project=chromium
 *
 * No depende de datos: valida disponibilidad de rutas públicas, artefactos SEO,
 * el gate de seguridad del admin y las cabeceras de seguridad. Pensado para
 * correr post-deploy (el residual "smoke test panel vs Supabase real").
 */

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:3000";

const PUBLIC_ROUTES = [
    "/",
    "/black-luxury",
    "/black-business",
    "/black-industrial",
    "/inventario",
    "/herramientas",
    "/nosotros",
    "/nosotros/equipo",
    "/nosotros/historia",
    "/nosotros/valores",
    "/contacto",
    "/legal/aviso-privacidad",
];

test.describe(`Production smoke @ ${BASE}`, () => {
    for (const route of PUBLIC_ROUTES) {
        test(`public route responds 200: ${route}`, async ({ page }) => {
            const resp = await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
            expect(resp?.status(), `status for ${route}`).toBe(200);
            // No horizontal overflow at mobile width is checked separately; here we
            // just assert the page rendered a body with content.
            await expect(page.locator("body")).toBeVisible();
        });
    }

    test("SEO artifacts are served", async ({ request }) => {
        const robots = await request.get(BASE + "/robots.txt");
        expect(robots.status()).toBe(200);
        const sitemap = await request.get(BASE + "/sitemap.xml");
        expect(sitemap.status()).toBe(200);
        const og = await request.get(BASE + "/opengraph-image");
        expect(og.status()).toBe(200);
        expect(og.headers()["content-type"] || "").toContain("image");
    });

    test("admin routes are gated (redirect to login when unauthenticated)", async ({ page }) => {
        for (const r of ["/admin", "/admin/leads", "/admin/properties", "/admin/settings"]) {
            await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
            expect(page.url(), `${r} should redirect to login`).toContain("/admin/login");
        }
    });

    test("security headers are present", async ({ request }) => {
        const resp = await request.get(BASE + "/");
        const headers = resp.headers();
        expect(headers["content-security-policy"], "CSP header").toBeTruthy();
        expect(headers["content-security-policy"]).toContain("default-src 'self'");
        // connect-src must allow Supabase for the app to function in prod.
        expect(headers["content-security-policy"]).toContain("*.supabase.co");
        expect(headers["x-content-type-options"] || "").toContain("nosniff");
    });
});
