import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});

// El manifiesto revela líneas con GSAP y el contacto con Motion.
test("home methodology heading reveals on scroll (motion active on mobile)", async ({ page }) => {
  await page.goto("/");

  // El nuevo manifiesto usa GSAP para revelar sus líneas al entrar en pantalla.
  const step = page.locator("[data-section='home-methodology'] [data-method-line]").first();
  const contact = page.locator("[data-method-contact]");
  const contactBefore = await contact.evaluate(el => ({ opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform }));
  await expect(step).toBeAttached();

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
  await expect(page.locator("[data-section='home-methodology'] h2")).toBeVisible();
  await contact.scrollIntoViewIfNeeded();
  await expect(contact).toHaveCSS("opacity", "1");
  expect(contactBefore.opacity).toBe("0");
  expect(await contact.evaluate(el => getComputedStyle(el).transform)).not.toBe(contactBefore.transform);
});
