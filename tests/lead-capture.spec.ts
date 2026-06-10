import { expect, test } from "@playwright/test";

test("documentos visibles inician solicitud protegida sin enlace directo", async ({ page }) => {
  await page.goto("/inventario");

  const detailHref = await page
    .locator('#catalogo article a[href^="/inventario/"]')
    .first()
    .getAttribute("href")
    .catch(() => null);

  test.skip(!detailHref, "No hay detalle público disponible en inventario.");

  await page.goto(detailHref!);

  const requestButton = page.getByRole("button", { name: /Solicitar documentos/i }).first();
  const buttonCount = await requestButton.count();
  test.skip(buttonCount === 0, "La propiedad no tiene documentos visibles para solicitar.");

  await expect(requestButton).toBeVisible();
  await expect(requestButton).not.toHaveAttribute("href", /.+/);

  await requestButton.click();

  await expect(page.getByRole("dialog", { name: /Solicitar documentos/i })).toBeVisible();
});
