import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});

test("why section mobile parallax is visually active during scroll", async ({ page }) => {
  await page.goto("/");

  const section = page.getByText("Por qué Black Capital").locator("..").locator("..").locator("..");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);

  await page.screenshot({
    path: "test-results/parallax-mobile-before.png",
    fullPage: false,
  });

  const sample = page.locator(".timeline-mobile-reveal").nth(1);
  const before = await sample.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      opacity: styles.opacity,
      transform: styles.transform,
      filter: styles.filter,
    };
  });

  await page.mouse.wheel(0, 260);
  await page.waitForTimeout(250);

  await page.screenshot({
    path: "test-results/parallax-mobile-after.png",
    fullPage: false,
  });

  const after = await sample.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      opacity: styles.opacity,
      transform: styles.transform,
      filter: styles.filter,
    };
  });

  await page.evaluate(({ before, after }) => {
    console.info("[parallax-visual]", JSON.stringify({ before, after }));
  }, { before, after });

  expect(before.transform).not.toBe(after.transform);
  expect(before.filter).not.toBe(after.filter);
  expect(Number(after.opacity)).toBeGreaterThan(Number(before.opacity));
});
