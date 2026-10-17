import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', async route => {
    if (route.request().method() !== 'GET') return route.abort();
    return route.continue();
  });
});

async function openProperty(page: import('@playwright/test').Page) {
  await page.goto('/inventario');
  await expect(page.locator('#catalogo article').first()).toBeVisible();
  const link = page.locator('#catalogo article a[href^="/inventario/"]').first();
  test.skip(await link.count() === 0, "No public detail data is configured; run against the read-only property fixture server.");
  await expect(link).toBeVisible();
  await page.goto((await link.getAttribute('href'))!);
}

test('property has contact context, anchored sections and gallery beside summary', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openProperty(page);
  const consult = page.getByRole('link', { name: 'Consultar esta propiedad', exact: true }).first();
  await expect(consult).toBeVisible();
  const url = new URL((await consult.getAttribute('href'))!, 'http://localhost');
  expect(url.searchParams.get('property_id')).toMatch(/^[0-9a-f-]{36}$/);
  expect(url.searchParams.get('propiedad')).toBe(await page.locator('h1').textContent());
  expect(url.searchParams.get('objetivo')).toBe('consultar-propiedad');
  await expect(page.getByRole('link', { name: 'Solicitar visita', exact: true }).first()).toHaveAttribute('href', /objetivo=solicitar-visita/);
  const gallery = await page.locator('#galeria').boundingBox();
  const summary = await page.locator('aside[aria-label="Resumen de la propiedad"]').boundingBox();
  expect(summary!.x).toBeGreaterThan(gallery!.x + gallery!.width - 1);
  expect(Math.abs(summary!.y - gallery!.y)).toBeLessThan(5);
  const nav = page.getByRole('navigation', { name: 'Secciones de la propiedad' });
  await nav.getByRole('link', { name: 'Características', exact: true }).click();
  await expect(page).toHaveURL(/#caracteristicas$/);
  await expect(page.locator('#caracteristicas').getByRole('button', { name: 'Descargar ficha' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Condiciones de operación', exact: true })).toBeVisible();
  await expect(page.getByText(/Video no disponible|360 no disponible/)).toHaveCount(0);
});

test('property mobile action remains visible without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openProperty(page);
  const bar = page.getByRole('region', { name: 'Contacto de la propiedad' });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole('link', { name: 'Consultar esta propiedad' })).toBeVisible();
  const box = await bar.boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator('footer').last().scrollIntoViewIfNeeded();
  await expect(bar).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bar).toBeVisible();
});

for (const brand of ['industrial']) {
  test(`${brand} puts inventory before criteria and keeps contextual contact`, async ({ page }) => {
    await page.goto(`/black-${brand}`);
    const inventory = page.locator(`#${brand}-inventory`);
    const criteria = page.locator(`#${brand}-value`);
    await expect(inventory).toBeVisible();
    expect(await inventory.evaluate((el, id) => Boolean(el.compareDocumentPosition(document.getElementById(id)!) & Node.DOCUMENT_POSITION_FOLLOWING), `${brand}-value`)).toBe(true);
    await expect(criteria).toBeVisible();
    const cta = page.locator(`#${brand}-cta`).getByRole('link', { name: 'Hablemos', exact: true });
    await expect(cta).toHaveAttribute('href', new RegExp(`brand=${brand}`));
    await expect(cta).toHaveAttribute('href', /objetivo=buscar-propiedad/);
  });
}

test('property gallery traps focus and returns it when closed', async ({ page }) => {
  await openProperty(page);
  const trigger = page.getByRole('button', { name: /Ampliar imagen/ });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: /Galería de/ });
  const close = dialog.getByRole('button', { name: 'Cerrar galería' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
