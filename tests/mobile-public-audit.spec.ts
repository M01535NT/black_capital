import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});

const publicRoutes = [
  "/",
  "/black-luxury",
  "/black-business",
  "/black-industrial",
  "/black-luxury/contacto",
  "/black-business/contacto",
  "/black-industrial/contacto",
  "/contacto",
  "/herramientas",
  "/legal/aviso-privacidad",
  "/legal/terminos-condiciones",
  "/nosotros",
  "/nosotros/equipo",
  "/nosotros/historia",
  "/nosotros/valores",
] as const;

test.describe("mobile public pages audit", () => {
  for (const route of publicRoutes) {
    test(`${route} has no document-level horizontal overflow`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        const offenders = Array.from(document.querySelectorAll("body *"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(),
              className: element.getAttribute("class") ?? "",
              text: (element.textContent ?? "").trim().slice(0, 70),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              scrollWidth: (element as HTMLElement).scrollWidth,
              clientWidth: (element as HTMLElement).clientWidth,
            };
          })
          .filter((entry) => entry.width > 0 && (
            entry.left < -2 ||
            entry.right > window.innerWidth + 2 ||
            entry.scrollWidth > entry.clientWidth + 2
          ))
          .slice(0, 8);

        return {
          scrollWidth: root.scrollWidth,
          clientWidth: root.clientWidth,
          bodyScrollWidth: document.body.scrollWidth,
          viewportWidth: window.innerWidth,
          offenders,
        };
      });

      expect(overflow.scrollWidth, JSON.stringify(overflow.offenders, null, 2)).toBeLessThanOrEqual(overflow.clientWidth + 2);
      expect(overflow.bodyScrollWidth, JSON.stringify(overflow.offenders, null, 2)).toBeLessThanOrEqual(overflow.viewportWidth + 2);
    });
  }

  for (const route of ["/black-luxury", "/black-business", "/black-industrial"] as const) {
    test(`${route} brand inventory is horizontal on mobile`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const rail = page.locator("[data-section='brand-inventory-rail']");
      await expect(rail).toHaveCount(1);
      await rail.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      const metrics = await rail.evaluate((element) => ({
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
      }));

      expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
    });
  }
});
