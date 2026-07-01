import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});

// El rediseño reemplazó la vieja "why section" por la metodología con reveal
// por scroll (framer-motion: opacity/translateY/blur al entrar en viewport).
// Este test protege que ese motion siga activo en móvil.
test("home methodology reveals steps on scroll (motion active on mobile)", async ({ page }) => {
  await page.goto("/");

  // Último paso: queda muy por debajo del fold al cargar, así que aún no se ha revelado.
  const step = page.locator("[data-section='home-methodology'] ol > li:has(h3)").last();

  const read = () =>
    step.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        opacity: styles.opacity,
        transform: styles.transform,
        filter: styles.filter,
      };
    });

  const before = await read();

  await step.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900); // deja completar la animación de reveal

  const after = await read();

  await page.evaluate(
    ({ before, after }) => console.info("[parallax-visual]", JSON.stringify({ before, after })),
    { before, after },
  );

  // Antes de entrar al viewport el paso está oculto/desplazado; al revelarse cambia.
  expect(Number(after.opacity)).toBeGreaterThan(Number(before.opacity));
  expect(after.transform).not.toBe(before.transform);
  expect(after.filter).not.toBe(before.filter);
});
