import { expect, test } from "@playwright/test";

const brands = [
  { route: "/black-luxury", use: "Residencial", typeLabel: "Tipo de propiedad", type: "Casa", zoneLabel: "Zona residencial", zone: "Chapultepec", areaLabel: "Construcción mínima", area: "250" },
  { route: "/black-business", use: "Comercial", typeLabel: "Formato comercial", type: "Oficina", zoneLabel: "Zona comercial", zone: "Otay", areaLabel: "Superficie mínima", area: "150" },
  { route: "/black-industrial", use: "Industrial", typeLabel: "Tipo de nave", type: "Nave", zoneLabel: "Corredor logístico", zone: "Garita", areaLabel: "Rango de m²", area: "1500" },
] as const;
const gallerySelector = "[data-section='sub-brand-value-rail']";

test.describe("brand photographic galleries", () => {
  test.use({ viewport: { width: 1440, height: 1000 }, isMobile: false });
  for (const brand of brands) {
    test(`${brand.route} presents an asymmetric gallery with keyboard-accessible inventory links`, async ({ page }) => {
      await page.goto(brand.route, { waitUntil: "domcontentloaded" });
      const gallery = page.locator(gallerySelector);
      await gallery.scrollIntoViewIfNeeded();
      const links = gallery.getByRole("link");
      await expect(links).toHaveCount(3);
      const boxes = await links.evaluateAll(elements => elements.map(element => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      }));
      expect(boxes[0].height).toBeGreaterThan(boxes[1].height * 1.8);
      expect(boxes[0].width).toBeGreaterThan(boxes[1].width);
      expect(boxes[2].y).toBeGreaterThan(boxes[1].y + boxes[1].height);
      await links.first().focus();
      await expect(links.first()).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(links.nth(1)).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(links.nth(2)).toBeFocused();
      await expect(links.nth(2)).toHaveAttribute("href", `/inventario?uso=${brand.use}`);
      await expect(gallery.locator("img")).toHaveCount(3);
    });
  }
});

for (const width of [320, 390]) {
  test.describe(`brand search and layout at ${width}px`, () => {
    test.use({ viewport: { width, height: 844 }, contextOptions: { reducedMotion: "reduce" } });
    for (const brand of brands) {
      test(`${brand.route} keeps its gallery in bounds and preserves every search filter`, async ({ page }) => {
        await page.goto(brand.route, { waitUntil: "domcontentloaded" });
        await expect(page.locator("main h1")).toBeVisible();
        await expect(page.getByRole("form", { name: "Búsqueda rápida de inventario" })).toHaveCount(0);
        const trigger = page.getByRole("button", { name: "Buscar", exact: true });
        await trigger.focus();
        await page.keyboard.press("Enter");
        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole("combobox")).toHaveCount(4);
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();

        const gallery = page.locator(gallerySelector);
        await gallery.scrollIntoViewIfNeeded();
        const bounds = await gallery.getByRole("link").evaluateAll(elements => elements.map(element => {
          const box = element.getBoundingClientRect();
          return { left: box.left, right: box.right, height: box.height };
        }));
        for (const box of bounds) {
          expect(box.left).toBeGreaterThanOrEqual(0);
          expect(box.right).toBeLessThanOrEqual(width);
          expect(box.height).toBeGreaterThanOrEqual(400);
        }
        const metrics = await page.evaluate(() => ({ body: document.body.scrollWidth, root: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
        expect(metrics.root).toBeLessThanOrEqual(metrics.viewport + 2);
        expect(metrics.body).toBeLessThanOrEqual(metrics.viewport + 2);

        await trigger.click();
        await dialog.getByRole("combobox", { name: brand.typeLabel, exact: true }).selectOption(brand.type);
        await dialog.getByRole("combobox", { name: brand.zoneLabel, exact: true }).selectOption(brand.zone);
        await dialog.getByRole("combobox", { name: "Tipo", exact: true }).selectOption("Renta");
        await dialog.getByRole("combobox", { name: brand.areaLabel, exact: true }).selectOption(brand.area);
        await dialog.getByRole("button", { name: "Ver resultados" }).click();
        await expect(page).toHaveURL(/\/inventario\?/);
        const params = new URL(page.url()).searchParams;
        expect(Object.fromEntries(params)).toEqual({ uso: brand.use, propiedad: brand.type, zona: brand.zone, tipo: "Renta", m2_min: brand.area });
      });
    }
  });
}
