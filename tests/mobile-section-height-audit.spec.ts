import { test } from "@playwright/test";

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
  const report: Record<string, Array<{ label: string; height: number; scrollWidth: number; clientWidth: number }>> = {};

  for (const route of routes) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

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
