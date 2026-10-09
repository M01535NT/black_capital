import { expect, test } from '@playwright/test';
import { filterProperties } from "../src/components/public/catalog/filter-properties";
import { EMPTY_FILTERS, parseFilters, serializeFilters } from '../src/components/public/catalog/constants';

test('zone and finder price aliases survive filter serialization', () => {
  const filters = parseFilters(new URLSearchParams('zona=Zona+Río&moneda=USD&precioMin=100&precioMax=900'));
  expect(filters).toMatchObject({ zona: 'Zona Río', moneda: 'USD', precioMin: '100', precioMax: '900' });
  expect(new URLSearchParams(serializeFilters(filters)).get('zona')).toBe('Zona Río');
});

test('zone is a real filter and can be removed', async ({ page }) => {
  await page.goto('/inventario?zona=zona-inexistente-qa');
  await expect(page.getByRole('heading', { name: 'No encontramos coincidencias' })).toBeVisible();
  await page.getByRole('button', { name: 'Limpiar filtros', exact: true }).click();
  await expect(page.locator('#catalogo article').first()).toBeVisible();
  await expect(page).not.toHaveURL(/zona=/);
});

test('saved properties sync with the header, panel, and reload', async ({ page }) => {
  await page.goto('/inventario');
  const card = page.locator('#catalogo article').first();
  await expect(card).toBeVisible();
  const title = await card.locator('h3').innerText();
  await card.getByRole('button', { name: 'Agregar a favoritos' }).click();
  await page.getByRole('button', { name: 'Abrir guardados (1)' }).click();
  const drawer = page.getByRole('dialog', { name: 'Propiedades guardadas' });
  await expect(drawer.getByRole('link', { name: title, exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Abrir guardados (1)' })).toBeVisible();
  await expect(card.getByRole('button', { name: 'Quitar de favoritos' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Abrir guardados (1)' }).click();
  await drawer.getByRole('button', { name: `Quitar ${title}` }).click();
  await expect(drawer.getByText('Todavía no has guardado propiedades.')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(card.getByRole('button', { name: 'Agregar a favoritos' })).toHaveAttribute('aria-pressed', 'false');
});

test('card shares its destination rather than catalog URL', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: async (data: ShareData) => { (window as unknown as { shared: ShareData }).shared = data; }, configurable: true });
  });
  await page.goto('/inventario');
  const card = page.locator('#catalogo article').first();
  await expect(card).toBeVisible();
  const href = await card.locator('a').first().getAttribute('href');
  await card.getByRole('button', { name: 'Compartir propiedad' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { shared?: ShareData }).shared?.url)).toBe(new URL(href!, page.url()).href);
});

test('navigation traps keyboard focus and returns it on Escape', async ({ page }) => {
  await page.goto('/inventario');
  const trigger = page.getByRole('button', { name: 'Abrir navegación' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Navegación principal' });
  await expect(page.getByRole('button', { name: 'Cerrar navegación' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('currency gates price comparisons and zone matching ignores accents', async () => {
  const base = { slug: null, property_use: 'Residencial', business_type: 'Venta', m2_terrain: 100, m2_construction: 80, cover_image: null, address: 'Zona Río, Tijuana' };
  const properties = [
    { ...base, id: 'mxn', title: 'Casa pesos', currency: 'MXN', price: 5000000 },
    { ...base, id: 'usd-high', title: 'Casa dólares', currency: 'USD', price: 300000 },
    { ...base, id: 'usd-low', title: 'Casa dólares menor', currency: 'USD', price: 200000 },
  ];
  expect(filterProperties(properties, { ...EMPTY_FILTERS, zona: 'zona rio', precioMax: '250000' })).toHaveLength(3);
  expect(filterProperties(properties, { ...EMPTY_FILTERS, moneda: 'USD', precioMax: '250000' }).map(p => p.id)).toEqual(['usd-low']);
  expect(filterProperties(properties, { ...EMPTY_FILTERS, moneda: 'USD', orden: 'price_asc' }).map(p => p.id)).toEqual(['usd-low', 'usd-high']);
  expect(properties.map(p => p.id)).toEqual(['mxn', 'usd-high', 'usd-low']);
});

test('native history navigation restores catalog filter state', async ({ page }) => {
  await page.goto('/inventario?zona=primera-zona');
  await expect(page.getByRole('heading', { name: 'No encontramos coincidencias' })).toBeVisible();
  // Confirm hydration through a real interaction before calling the patched History API.
  await page.getByRole('button', { name: /^Filtros/ }).click();
  await expect(page.getByRole('dialog', { name: 'Filtros del catálogo' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.evaluate(() => window.history.pushState(null, '', '/inventario?zona=segunda-zona&moneda=USD'));
  await expect(page.locator('[aria-label="Filtros rápidos"]').getByLabel('Zona', { exact: true })).toHaveValue('segunda-zona');
  await page.goBack();
  await expect(page.locator('[aria-label="Filtros rápidos"]').getByLabel('Zona', { exact: true })).toHaveValue('primera-zona');
});

test('filter and saved panels contain keyboard focus and restore their triggers', async ({ page }) => {
  await page.goto('/inventario');
  for (const panel of [
    { trigger: page.getByRole('button', { name: /^Filtros/ }), title: 'Filtros del catálogo' },
    { trigger: page.getByRole('button', { name: 'Abrir guardados (0)' }), title: 'Propiedades guardadas' },
  ]) {
    await panel.trigger.click();
    const dialog = page.getByRole('dialog', { name: panel.title });
    await expect(dialog).toBeVisible();
    await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Shift+Tab');
    await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(panel.trigger).toBeFocused();
  }
});

test('legacy saved entries use stable property IDs and reject external destinations', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bc_favorites', JSON.stringify([
    { id: '12345678-1234-1234-1234-123456789abc', title: 'Nombre anterior', href: '/inventario/slug-anterior' },
    { id: 'legacy-property', title: 'Enlace inválido', href: 'https://example.com' },
    null, { id: false }, 'legacy-property',
    { id: 'malformed', title: 'Objeto inválido', href: { toString: 'bad' } },
    { id: 'array', title: 'Arreglo inválido', href: ['/inventario/wrong'] },
  ])));
  await page.goto('/inventario');
  await page.getByRole('button', { name: 'Abrir guardados (4)' }).click();
  const dialog = page.getByRole('dialog', { name: 'Propiedades guardadas' });
  await expect(dialog.getByRole('link', { name: 'Nombre anterior' })).toHaveAttribute('href', '/inventario/12345678-1234-1234-1234-123456789abc');
  await expect(dialog.getByRole('link', { name: 'Enlace inválido' })).toHaveAttribute('href', '/inventario/legacy-property');
  await expect(dialog.getByRole('link', { name: 'Objeto inválido' })).toHaveAttribute('href', '/inventario/malformed');
  await expect(dialog.getByRole('link', { name: 'Arreglo inválido' })).toHaveAttribute('href', '/inventario/array');
});
