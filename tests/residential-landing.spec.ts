import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 390, 320]) {
  test.describe(`residential discovery at ${width}px`, () => {
    test.use({ viewport: { width, height: 1000 }, isMobile: width < 768, hasTouch: width < 768, contextOptions: { reducedMotion: "reduce" } });

    test("keeps the split design readable and submits residential filters to the catalog", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto("/black-luxury", { waitUntil: "domcontentloaded" });
      await expect(page.locator("main h1")).toHaveText(/Vivir bien.*Elegir.*con criterio/);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
      const photo = await page.locator("[data-section=residential-hero] [data-cinematic-image]").boundingBox();
      const discovery = await page.locator("#residencias").boundingBox();
      expect(photo!.y + photo!.height).toBeLessThanOrEqual(discovery!.y + 1);
      const gallery = page.locator("[data-section=residential-collections]");
      await expect(gallery.getByRole("link")).toHaveCount(2);
      await gallery.getByRole("link").first().scrollIntoViewIfNeeded();
      await expect(gallery.locator(":scope > div").first()).toHaveCSS("opacity", "1");
      const form = page.getByRole("form", { name: "Buscar inmuebles residenciales" });
      await form.getByLabel("Tipo de propiedad", { exact: true }).selectOption("Casa");
      await form.getByLabel("Zona residencial", { exact: true }).selectOption("Rosarito");
      await form.getByRole("button", { name: "Buscar", exact: true }).click();
      await expect(page).toHaveURL(/\/inventario\?/);
      const url = new URL(page.url());
      expect(url.searchParams.get("uso")).toBe("Residencial");
      expect(url.searchParams.get("propiedad")).toBe("Casa");
      expect(url.searchParams.get("zona")).toBe("Rosarito");
      expect(url.hash).toBe("#catalogo");
      await expect(page.getByRole("button", { name: "Quitar filtro Residencial" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Quitar filtro Casa" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Quitar filtro Zona: Rosarito" })).toBeVisible();
      expect(errors).toEqual([]);
    });

    test("collection links keep their city and contact keeps the residential context", async ({ page }) => {
      await page.goto("/black-luxury");
      const coastal = page.getByRole("link", { name: /Cerca del mar/ });
      await coastal.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/zona=Rosarito/);
      expect(new URL(page.url()).searchParams.get("uso")).toBe("Residencial");
      await page.goto("/black-luxury");
      await page.getByRole("link", { name: "Hablar con un asesor", exact: true }).click();
      await expect(page).toHaveURL(/#luxury-cta$/);
      const contact = page.getByRole("link", { name: "Pedir opciones", exact: true });
      await expect(contact).toBeInViewport();
      await contact.click();
      await expect(page).toHaveURL(/\/contacto\?brand=luxury&objetivo=buscar-propiedad/);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  });
}

test("residential photography and text reveal with motion enabled", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/black-luxury", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#main-content [data-section=residential-hero] [data-image-plane]")).not.toHaveCSS("transform", "none");
  const title = page.locator("#main-content #residential-discovery-title");
  await title.scrollIntoViewIfNeeded();
  await expect(title.locator("..")).toHaveCSS("opacity", "1");
  const firstCollection = page.locator("#main-content [data-section=residential-collections] > div").first();
  await firstCollection.scrollIntoViewIfNeeded();
  await expect(firstCollection).toHaveCSS("opacity", "1");
});
