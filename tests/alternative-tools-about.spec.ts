import { expect, test } from "@playwright/test";

test.describe("Alternativa Black: herramientas y nosotros", () => {
  test("selector opens real calculators, updates links and retains entered amounts", async ({ page }) => {
    await page.goto("/herramientas?calculadora=roi");
    const navigation = page.getByRole("navigation", { name: "Elegir calculadora" });
    await expect(navigation.getByRole("link", { name: "Rendimiento de renta" })).toHaveAttribute("aria-current", "page");
    await page.getByLabel("Renta mensual").fill("20000");
    await expect(page.locator("#roi")).toContainText("12.5%");
    await navigation.getByRole("link", { name: "Compra y remodelación" }).click();
    await expect(page).toHaveURL(/calculadora=flipping/);
    await expect(page.locator("#flipping")).toBeVisible();
    await expect(page.locator("#roi")).toBeHidden();
    await expect(page.getByRole("link", { name: "Pedir orientación" })).toHaveAttribute("href", /calculadora=flipping/);
    await navigation.getByRole("link", { name: "Rendimiento de renta" }).click();
    await expect(page).toHaveURL(/calculadora=roi/);
    await expect(page.locator("#roi")).toBeVisible();
    await expect(page.getByLabel("Renta mensual")).toHaveValue("20000");
    await page.goBack();
    await expect(page.locator("#flipping")).toBeVisible();
  });

  test("mortgage inputs change the estimate and taxes use the entered rate", async ({ page }) => {
    await page.goto("/herramientas?calculadora=hipoteca");
    const result = page.locator("#hipoteca [aria-live]");
    const initial = await result.innerText();
    await page.getByLabel("Precio del inmueble").fill("2500000");
    await expect(result).not.toHaveText(initial);
    await page.getByRole("navigation", { name: "Elegir calculadora" }).getByRole("link", { name: "Impuestos" }).click();
    await page.getByLabel("Valor de compra").fill("2000000");
    await page.getByLabel("Tasa aplicable").fill("3");
    await expect(page.locator("#isai [aria-live]")).toContainText("$60,000");
  });

  for (const calculator of ["roi", "flipping", "isai"]) {
    test(`legacy #${calculator} links open the matching calculator on mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/herramientas#${calculator}`);
      await expect(page.locator(`#${calculator}`)).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Elegir calculadora" }).locator('[aria-current="page"]')).toHaveAttribute("href", `?calculadora=${calculator}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }

  for (const section of ["equipo", "historia", "valores"]) {
    test(`legacy nosotros/${section} redirects into the consolidated page`, async ({ page }) => {
      await page.goto(`/nosotros/${section}`);
      await expect(page).toHaveURL(new RegExp(`/nosotros#${section}$`));
      // Next's streamed redirect briefly retains a hidden outgoing tree. Retry
      // the complete destination contract; a persistent duplicate still fails.
      await expect(async () => {
        await expect(page.locator(`#${section}`)).toHaveCount(1);
        await expect(page.locator(`#${section}`)).toBeVisible();
        await expect(page.getByRole("heading", { name: "Moisés Núñez" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Omar Medina Yañez" })).toBeVisible();
        await expect(page.locator("#historia")).toContainText("2018");
      }).toPass({ timeout: 15000 });
    });
  }
});
