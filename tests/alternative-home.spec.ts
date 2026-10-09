import { expect, test } from "@playwright/test";

test("home finder carries operation, use, zone and currency-specific price to inventory", async ({ page }) => {
  await page.goto("/");
  const finder = page.getByRole("search", { name: "Buscar propiedades" });
  await expect(finder).toBeVisible();
  await finder.getByLabel("Operación").selectOption("Renta");
  await finder.getByLabel("Uso").selectOption("Comercial");
  await finder.getByLabel("Zona").fill("Zona Río");
  await finder.getByLabel("Moneda").selectOption("USD");
  await finder.getByLabel("Precio mínimo").fill("1000");
  await finder.getByLabel("Precio máximo").fill("5000");
  await finder.getByRole("button", { name: "Buscar propiedades" }).click();
  await expect(page).toHaveURL(/\/inventario\?/);
  const url = new URL(page.url());
  for (const [name, value] of Object.entries({ tipo: "Renta", uso: "Comercial", zona: "Zona Río", moneda: "USD", precioMin: "1000", precioMax: "5000" })) {
    expect(url.searchParams.get(name)).toBe(value);
  }
});

test("home presents inventory first and compact segments and process", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Cada\s*propiedad,\s*su\s*estrategia\./);
  const sequence = await page.locator("#main-content section").evaluateAll(nodes => nodes.map(node => node.querySelector("h2")?.textContent?.trim() || node.getAttribute("aria-label")));
  expect(sequence.indexOf("Inventario disponible.")).toBeLessThan(sequence.indexOf("Un método, tres líneas."));
  expect(sequence.indexOf("Un método, tres líneas.")).toBeLessThan(sequence.indexOf("Tu propiedad, con una estrategia."));
  expect(sequence.indexOf("Del diagnóstico a la firma.")).toBeLessThan(sequence.indexOf("Indicadores comerciales Black Capital"));
  const segments = page.locator("[data-section='home-segments'] article");
  await expect(segments).toHaveCount(3);
  const tops = await segments.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
  expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(2);
  const method = page.locator("[data-section='home-methodology']");
  await expect(method.locator("ol > li")).toHaveCount(4);
  expect((await method.boundingBox())!.height).toBeLessThan(1100);
});

test("featured properties scroll with accessible controls on mobile without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const rail = page.getByRole("region", { name: "Propiedades destacadas" });
  await rail.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Siguientes propiedades" }).click();
  await expect.poll(() => rail.evaluate(node => node.scrollLeft)).toBeGreaterThan(50);
  await page.getByRole("button", { name: "Propiedades anteriores" }).click();
  await expect.poll(() => rail.evaluate(node => node.scrollLeft)).toBeLessThan(10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(2);
});

test("testimonials stay still until the visitor advances them", async ({ page }) => {
  await page.goto("/");
  const voices = page.getByRole("region", { name: "Voces de clientes Black Capital" });
  await voices.scrollIntoViewIfNeeded();
  const quote = voices.locator("blockquote p");
  await expect(quote).toHaveText("Nos explicaron precio, zona y condiciones antes de hacer oferta.");
  await page.mouse.move(0, 0);
  await page.waitForTimeout(7000);
  await expect(quote).toHaveText("Nos explicaron precio, zona y condiciones antes de hacer oferta.");
  await voices.getByRole("button", { name: "Siguiente testimonio" }).click();
  await expect(quote).toHaveText("Revisaron superficie, accesos y maniobra antes de descartar la nave.");
});

test("segment titles fit their cards on smaller desktops", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 1000 });
  await page.goto("/");
  const titles = await page.locator("[data-section='home-segments'] h3").evaluateAll(nodes => nodes.map(node => ({ width: node.clientWidth, contentWidth: node.scrollWidth })));
  expect(titles).toHaveLength(3);
  for (const title of titles) expect(title.contentWidth).toBeLessThanOrEqual(title.width + 1);
});

test("testimonial controls fit narrow mobile screens", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  const voices = page.getByRole("region", { name: "Voces de clientes Black Capital" });
  const bounds = await voices.boundingBox();
  for (const button of await voices.getByRole("button").all()) {
    const control = await button.boundingBox();
    expect(control!.x + control!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width);
  }
});

test("hero words fit their column without clipping at narrow widths", async ({ page }) => {
  for (const width of [320, 1024]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const heading = page.getByRole("heading", { level: 1 });
    const bounds = await heading.boundingBox();
    for (const word of await heading.locator("span").all()) {
      const wordBounds = await word.boundingBox();
      expect(wordBounds!.x + wordBounds!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width + 1);
    }
  }
});

test("home counters fit narrow screens without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(async () => { await document.fonts.ready; });
  const counters = page.getByRole("region", { name: "Indicadores comerciales Black Capital" });
  await expect(counters).toBeVisible();
  const metrics = await counters.evaluate(node => ({ width: node.clientWidth, contentWidth: node.scrollWidth }));
  expect(metrics.contentWidth).toBeLessThanOrEqual(metrics.width + 2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(2);
});
