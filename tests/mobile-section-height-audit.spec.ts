import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});

const routes = [
  "/",
  "/black-luxury",
  "/black-business",
  "/black-industrial",
  "/contacto",
  "/herramientas",
  "/nosotros",
  "/nosotros/equipo",
  "/nosotros/historia",
  "/nosotros/valores",
] as const;

test("reports tall mobile sections on public pages", async ({ page }) => {
  test.setTimeout(120_000);
  const report: Record<string, Array<{ label: string; height: number; scrollWidth: number; clientWidth: number }>> = {};

  for (const route of routes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("main h1").first()).toBeVisible();
    await expect(page.locator("[aria-label='Cargando contenido']")).toHaveCount(0);
    await page.evaluate(async () => { await document.fonts.ready; });

    if (route === "/") {
      const steps = page.locator("[data-section='home-methodology'] ol > li");
      await expect(steps).toHaveCount(4);
      const heights = await steps.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
      for (const height of heights) expect(height).toBeLessThan(844 * 0.65);
    }


    report[route] = await page.evaluate(() => {
      const viewport = window.innerHeight;
      return Array.from(document.querySelectorAll("main section, main [aria-label]"))
        .map((section) => {
          const rect = section.getBoundingClientRect();
          const heading = section.querySelector("h1,h2,h3")?.textContent?.trim();
          const label = section.getAttribute("aria-label") || section.id || heading || section.tagName.toLowerCase();
          return {
            label,
            height: Math.round(rect.height),
            scrollWidth: (section as HTMLElement).scrollWidth,
            clientWidth: (section as HTMLElement).clientWidth,
            ratio: rect.height / viewport,
          };
        })
        .filter((entry) => entry.ratio > 1.15)
        .map(({ label, height, scrollWidth, clientWidth }) => ({ label, height, scrollWidth, clientWidth }));
    });
  }

  console.info("[mobile-section-height-audit]", JSON.stringify(report, null, 2));
});
