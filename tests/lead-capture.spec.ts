import { expect, test } from "@playwright/test";

test("documentos visibles inician solicitud protegida sin enlace directo", async ({ page }) => {
  await page.goto("/inventario");
  await page.locator("#catalogo").first().waitFor({ state: "visible" }).catch(() => {});

  // count() no auto-espera al timeout: sin detalle público (p.ej. sin datos
  // sembrados) saltamos rápido en vez de agotar el timeout del test.
  const detailLinks = page.locator('#catalogo article a[href^="/inventario/"]');
  test.skip((await detailLinks.count()) === 0, "No hay detalle público disponible en inventario.");

  const detailHref = await detailLinks.first().getAttribute("href");
  await page.goto(detailHref!);

  const requestButton = page.getByRole("button", { name: /Solicitar documentos/i }).first();
  const buttonCount = await requestButton.count();
  test.skip(buttonCount === 0, "La propiedad no tiene documentos visibles para solicitar.");

  await expect(requestButton).toBeVisible();
  await expect(requestButton).not.toHaveAttribute("href", /.+/);

  await requestButton.click();

  await expect(page.getByRole("dialog", { name: /Solicitar documentos/i })).toBeVisible();
});
