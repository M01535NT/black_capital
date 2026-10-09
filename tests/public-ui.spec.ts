import { expect, test } from "@playwright/test";

test.describe("Public UI follow-up", () => {
    test("inventory filters and empty state work without layout blockers", async ({ page }) => {
        await page.goto("/inventario");

        const catalog = page.locator("#catalogo");
        const search = catalog.getByPlaceholder(/Buscar por titulo|Buscar por título/i);

        await expect(search).toBeVisible();

        await search.fill("sin-resultados-qa");
        await expect(page.getByRole("heading", { name: /No encontramos coincidencias/i })).toBeVisible();

        await page.getByRole("button", { name: /Limpiar filtros/i }).click();
        await expect(search).toHaveValue("");

        await catalog.getByLabel("Operación", { exact: true }).selectOption("Venta");
        await catalog.getByLabel("Segmento", { exact: true }).selectOption("Residencial");
        await catalog.getByLabel("Moneda", { exact: true }).selectOption("MXN");
        await catalog.locator("#catalog-sort").selectOption("price_asc");

        await expect(page).toHaveURL(/tipo=Venta/);
        await expect(page).toHaveURL(/uso=Residencial/);
        await expect(page).toHaveURL(/orden=price_asc/);
    });

    test("contact form keeps required fields and privacy consent enforced", async ({ page }) => {
        await page.goto("/contacto");

        await expect(page.getByRole("heading", { name: /Cuéntanos qué necesitas/i })).toBeVisible();

        const name = page.locator('input[name="full_name"]');
        const email = page.locator('input[name="email"]').last();
        const privacy = page.locator('input[name="privacy_accepted"]');

        await expect(name).toBeVisible();
        await expect(email).toBeVisible();
        await expect(privacy).toBeVisible();

        await page.getByRole("button", { name: /Enviar mensaje/i }).click();

        await expect.poll(async () => privacy.evaluate((input) => (input as HTMLInputElement).validity.valid)).toBe(false);
        await name.fill("QA Visual");
        await email.fill("qa@example.com");
        await expect.poll(async () => privacy.evaluate((input) => (input as HTMLInputElement).validity.valid)).toBe(false);
    });

    test("mobile inventory and contact keep primary controls visible", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });

        await page.goto("/inventario");
        const catalog = page.locator("#catalogo");
        await catalog.scrollIntoViewIfNeeded();
        await expect(catalog.getByPlaceholder(/Buscar por titulo|Buscar por título/i)).toBeVisible();

        await expect(catalog.getByRole("button", { name: /Filtros/ })).toBeVisible();
        await catalog.getByRole("button", { name: /Filtros/ }).click();
        await expect(page.getByRole("dialog", { name: "Filtros del catálogo" })).toBeVisible();
        await expect(page.getByRole("button", { name: /Ver .* propiedades/ })).toBeVisible();
        await page.keyboard.press("Escape");

        await page.goto("/contacto");
        await expect(page.getByRole("link", { name: /Escribir por WhatsApp/i }).first()).toBeVisible();
        await expect(page.getByRole("button", { name: /Enviar mensaje/i })).toBeVisible();
    });

    test("property detail follows the public visual system when inventory has live items", async ({ page }) => {
        await page.goto("/inventario");
        await expect(page.locator("#catalogo article").first()).toBeVisible();

        // count() no auto-espera al timeout: si no hay detalle público (p.ej. sin datos
        // sembrados), saltamos rápido en lugar de agotar el timeout del test.
        const detailLinks = page.locator('#catalogo article a[href^="/inventario/"]');
        test.skip((await detailLinks.count()) === 0, "No live property detail was available in inventory.");

        const detailHref = await detailLinks.first().getAttribute("href");
        await page.goto(detailHref!);
        await expect(page.getByRole("link", { name: /Volver/i })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Características" })).toBeVisible();
        await expect(page.getByRole("link", { name: /Consultar esta propiedad|WhatsApp/i }).first()).toBeVisible();

        await expect(page.getByTestId("whatsapp-float")).toHaveCount(0);
    });
});
