import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 390, 320]) {
  test.describe(`commercial discovery at ${width}px`, () => {
    test.use({ viewport: { width, height: 1000 }, isMobile: width < 768, hasTouch: width < 768, contextOptions: { reducedMotion: "reduce" } });

    test("keeps all three categories readable and opens the selected inventory type", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto("/black-business", { waitUntil: "domcontentloaded" });
      await expect(page.locator("main h1")).toHaveText(/La ubicación.*también es.*estrategia/);
      await page.evaluate(() => document.fonts.ready);
      const reveals = page.locator("[data-commercial-landing] [data-scroll-reveal]");
      await expect(reveals).toHaveCount(5);
      for (const reveal of await reveals.all()) await expect(reveal).toHaveCSS("opacity", "1");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
      const categories = page.locator("[data-section=commercial-categories]");
      await expect(categories.getByRole("link")).toHaveCount(3);
      for (const [name, type] of [["locales", "Local"], ["oficinas", "Oficina"], ["plazas", "Plaza"]]) {
        await expect(categories.getByRole("link", { name: `Explorar ${name}`, exact: true })).toHaveAttribute("href", `/inventario?uso=Comercial&propiedad=${type}#catalogo`);
      }
      const offices = categories.getByRole("link", { name: "Explorar oficinas", exact: true });
      await offices.scrollIntoViewIfNeeded();
      await expect(offices.locator("..")).toHaveCSS("opacity", "1");
      await offices.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/inventario\?uso=Comercial&propiedad=Oficina#catalogo$/);
      await expect(page.getByRole("button", { name: "Quitar filtro Comercial", exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Quitar filtro Oficina", exact: true })).toBeVisible();
      expect(errors).toEqual([]);
    });

    test("primary and contact actions preserve the commercial context", async ({ page }) => {
      await page.goto("/black-business");
      await page.getByRole("link", { name: "Ver espacios comerciales", exact: true }).click();
      await expect(page).toHaveURL(/\/inventario\?uso=Comercial#catalogo$/);
      await expect(page.getByRole("button", { name: "Quitar filtro Comercial", exact: true })).toBeVisible();
      await page.goto("/black-business");
      await page.getByRole("link", { name: "Hablar con un asesor", exact: true }).click();
      await expect(page).toHaveURL(/#business-cta$/);
      const contact = page.getByRole("link", { name: "Pedir opciones", exact: true });
      await expect(contact).toBeInViewport();
      await contact.click();
      await expect(page).toHaveURL(/\/contacto\?brand=business&objetivo=buscar-propiedad$/);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  });
}

test("commercial photography and categories reveal with motion enabled", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/black-business", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-section=commercial-hero] [data-image-plane]")).not.toHaveCSS("transform", "none");
  const firstCategory = page.locator("[data-section=commercial-categories] > div").first();
  await firstCategory.scrollIntoViewIfNeeded();
  await expect(firstCategory).toHaveCSS("opacity", "1");
});
