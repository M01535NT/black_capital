import { expect, test } from "@playwright/test";

test.describe("Public UI follow-up", () => {
    test("inventory filters and empty state work without layout blockers", async ({ page }) => {
        await page.goto("/inventario");

        const catalog = page.locator("#catalogo");
        const search = catalog.getByPlaceholder(/Buscar por titulo|Buscar por título/i);

        await expect(page.getByRole("heading", { name: /Inventario inmobiliario/i })).toBeVisible();
        await expect(search).toBeVisible();

        await search.fill("sin-resultados-qa");
        await expect(page.getByRole("heading", { name: /No encontramos coincidencias/i })).toBeVisible();

        await page.getByRole("button", { name: /Limpiar filtros/i }).click();
        await expect(search).toHaveValue("");

        await catalog.getByRole("button", { name: "Venta" }).click();
        await catalog.getByRole("button", { name: "Residencial" }).click();
        await catalog.locator("#catalog-sort").selectOption("price_asc");

        await expect(page).toHaveURL(/tipo=Venta/);
        await expect(page).toHaveURL(/uso=Residencial/);
        await expect(page).toHaveURL(/orden=price_asc/);
    });

    test("contact form keeps required fields and privacy consent enforced", async ({ page }) => {
        await page.goto("/contacto");

        await expect(page.getByRole("heading", { name: /Hablemos de tu siguiente operación/i })).toBeVisible();
        await page.getByRole("link", { name: /Enviar solicitud/i }).first().click();

        const name = page.locator('input[name="full_name"]');
        const email = page.locator('input[name="email"]').last();
        const privacy = page.locator('input[name="privacy_accepted"]');

        await expect(name).toBeVisible();
        await expect(email).toBeVisible();
        await expect(privacy).toBeVisible();

        await page.getByRole("button", { name: /Enviar solicitud/i }).click();

        await expect.poll(async () => privacy.evaluate((input) => (input as HTMLInputElement).validity.valid)).toBe(false);
        await name.fill("QA Visual");
        await email.fill("qa@example.com");
        await expect.poll(async () => privacy.evaluate((input) => (input as HTMLInputElement).validity.valid)).toBe(false);
    });

    test("mobile inventory and contact keep primary controls visible", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });

        await page.goto("/inventario");
        const catalog = page.locator("#catalogo");
        await expect(page.getByRole("link", { name: /Explorar catálogo/i })).toBeVisible();
        await catalog.scrollIntoViewIfNeeded();
        await expect(catalog.getByPlaceholder(/Buscar por titulo|Buscar por título/i)).toBeVisible();

        const whatsappFloat = page.getByTestId("whatsapp-float");
        await expect(whatsappFloat).toBeVisible();
        const box = await whatsappFloat.boundingBox();
        expect(box?.x ?? 0).toBeGreaterThan(250);

        await page.goto("/contacto");
        await expect(page.getByRole("link", { name: /WhatsApp directo/i }).first()).toBeVisible();
        await expect(page.getByRole("button", { name: /Enviar solicitud/i })).toBeVisible();
    });

    test("property detail follows the public visual system when inventory has live items", async ({ page }) => {
        await page.goto("/inventario");

        const detailHref = await page
            .locator('#catalogo article a[href^="/inventario/"]')
            .first()
            .getAttribute("href")
            .catch(() => null);

        test.skip(!detailHref, "No live property detail was available in inventory.");

        await page.goto(detailHref!);
        await expect(page.getByRole("link", { name: /Volver/i })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Ficha Técnica" })).toBeVisible();
        await expect(page.getByRole("link", { name: /Contactar por WhatsApp/i })).toBeVisible();
        await expect(page.getByText(/calculadora|hipoteca/i)).toHaveCount(0);

        const whatsappFloat = page.getByTestId("whatsapp-float");
        await expect(whatsappFloat).toBeVisible();
        const box = await whatsappFloat.boundingBox();
        expect(box?.x ?? 0).toBeGreaterThan(800);
    });
});
