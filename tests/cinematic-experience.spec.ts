import { expect, test } from '@playwright/test';

test('GSAP scroll sequence changes images and cleans up when leaving home', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const stage = page.locator('#main-content [data-segment-stage]');
  await expect(stage).toHaveAttribute('data-pinned', 'true');
  await page.getByRole('button', { name: '02 · Comercial', exact: true }).click();
  await expect(stage).toHaveAttribute('data-active-scene', '1');
  await expect(stage.locator('[data-scene]').nth(1)).toHaveAttribute('aria-hidden', 'false');
  await expect(stage.locator('[data-scene]').first()).toHaveAttribute('inert', '');
  await page.getByRole('navigation', { name: 'Accesos principales' }).getByRole('link', { name: 'Propiedades', exact: true }).click();
  await expect(page).toHaveURL(/\/inventario$/);
  await expect(page.locator('#main-content [data-segment-stage]')).toHaveCount(0);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
});

test('large photographic planes move with scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const plane = page.locator('#main-content [data-section="cinematic-hero"] [data-image-plane]');
  await expect.poll(() => plane.evaluate(el => getComputedStyle(el).transform)).not.toBe('none');
  const before = await plane.evaluate(el => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect.poll(() => plane.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
});

test('reduced motion keeps all scenes readable and unpinned', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'Buscar propiedades', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Buscar propiedades', exact: true })).toBeFocused();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  const scenes = page.locator('[data-scene]');
  for (const scene of await scenes.all()) {
    await expect(scene).not.toHaveAttribute('aria-hidden', 'true');
    await expect(scene.getByRole('link')).toBeVisible();
  }
  await expect(page.locator('#main-content [data-section="cinematic-hero"] [data-image-plane]')).toHaveCSS('transform', 'none');
  expect(errors).toEqual([]);
});

for (const width of [320, 390]) {
  test(`image-led home fits ${width}px and search controls remain usable`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#main-content [data-section="cinematic-hero"] [data-image-plane]')).not.toHaveCSS('transform', 'none');
    await page.getByRole('button', { name: 'Buscar propiedades', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Zona', { exact: true }).fill('Otay');
    await expect(dialog.getByRole('button', { name: 'Buscar propiedades', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await page.locator('[data-section="home-methodology"]').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
    for (const heading of await page.locator('[data-section="home-methodology"] h3').all()) {
      expect(await heading.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(2);
    }
  });
}

 test('selecting a scene with the keyboard transfers focus to its destination', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#main-content [data-segment-stage]')).toHaveAttribute('data-pinned', 'true');
  const control = page.getByRole('button', { name: '02 · Comercial', exact: true });
  await control.focus();
  await page.keyboard.press('Enter');
  const destination = page.getByRole('link', { name: 'Explorar Comercial', exact: true });
  await expect(destination).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/black-business$/);
});
