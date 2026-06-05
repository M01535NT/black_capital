import { chromium } from "@playwright/test";

const VIEWPORTS = [
    { name: "mobile-375", width: 375, height: 812 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "desktop-1280", width: 1280, height: 800 },
    { name: "wide-1536", width: 1536, height: 900 },
];

const PAGES = [
    { name: "home", path: "/" },
    { name: "black-luxury", path: "/black-luxury" },
    { name: "inventario", path: "/inventario" },
    { name: "contacto", path: "/contacto" },
];

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = "./playwright-audit";

async function main() {
    const browser = await chromium.launch();
    const results = [];

    for (const pageDef of PAGES) {
        for (const viewport of VIEWPORTS) {
            const context = await browser.newContext({
                viewport: { width: viewport.width, height: viewport.height },
                deviceScaleFactor: viewport.width < 800 ? 2 : 1,
            });
            const page = await context.newPage();
            const issues = [];
            const filename = `${pageDef.name}_${viewport.name}_${viewport.width}px`;

            try {
                await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: "networkidle", timeout: 30000 });
                await page.waitForTimeout(2000);

                await page.screenshot({ path: `${OUTPUT_DIR}/${filename}.png`, fullPage: true });

                const hasOverflow = await page.evaluate(() => {
                    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
                });
                if (hasOverflow) {
                    issues.push("HORIZONTAL OVERFLOW detected");
                }

                const brokenImages = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("img"))
                        .filter(img => !img.complete || img.naturalWidth === 0)
                        .map(img => img.src || img.alt || "unnamed")
                        .slice(0, 5);
                });
                if (brokenImages.length > 0) {
                    issues.push(`${brokenImages.length} broken images`);
                }

                const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
                results.push({ page: pageDef.name, viewport: `${viewport.name} (${viewport.width}px)`, issues, bodyHeight });
                console.log(`✅ ${filename} — ${bodyHeight}px body height${issues.length > 0 ? " — " + issues.join(", ") : ""}`);
            } catch (err) {
                issues.push(`CRASH: ${err}`);
                results.push({ page: pageDef.name, viewport: `${viewport.name} (${viewport.width}px)`, issues, bodyHeight: 0 });
                console.error(`❌ ${filename}: ${err}`);
            }

            await context.close();
        }
    }

    await browser.close();

    console.log("\n=== RESPONSIVE AUDIT SUMMARY ===\n");
    for (const r of results) {
        const status = r.issues.length === 0 ? "✅" : "⚠️ ";
        console.log(`${status} ${r.page} @ ${r.viewport} (${r.bodyHeight}px)${r.issues.length > 0 ? "\n   " + r.issues.join("\n   ") : ""}`);
    }

    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    console.log(`\nTotal: ${results.length} screenshots, ${totalIssues} issues found`);
}

main().catch(console.error);
