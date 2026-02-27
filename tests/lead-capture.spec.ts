import { test, expect } from '@playwright/test';

test('Flujo de Captura de Leads (Gated Content)', async ({ page }) => {
    // 1. Visit Inventario
    await page.goto('/inventario');

    // 2. Wait for Properties grid to load and click the first property's "Ver Detalles"
    const detailsButton = page.locator('text=Ver Detalles').first();
    await expect(detailsButton).toBeVisible({ timeout: 15000 });

    // Get the href to navigate or click it
    await detailsButton.click();

    // 3. Ensure we are on the property detail page and locate "Descargar Brochure"
    const downloadBtn = page.locator('button:has-text("Descargar Brochure")');
    await expect(downloadBtn).toBeVisible({ timeout: 15000 });

    // 4. Open Capture Modal
    await downloadBtn.click();

    // 5. Verify modal content
    await expect(page.locator('text=Contenido Exclusivo')).toBeVisible();

    // 6. Fill the Lead Form
    await page.fill('input[name="name"]', 'QA Test User');
    await page.fill('input[name="email"]', 'qatest@blackcorporativo.com');
    await page.fill('input[name="phone"]', '1234567890');

    // 7. Submit form
    await page.click('button:has-text("Enviar y Descargar PDF")');

    // 8. Wait for API mock & success state (Mock email flow + Supabase offline bypass depending on Dev state)
    // Expect to see the success check or the unlocked brochure message
    const successText = page.locator('text=¡Brochure Desbloqueado!');
    await expect(successText).toBeVisible({ timeout: 10000 });
});
