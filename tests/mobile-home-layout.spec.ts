import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});

test("home process section is horizontal on mobile", async ({ page }) => {
  await page.goto("/");

  const heading = page.getByRole("heading", { name: /De la intención al cierre/i });
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const processRail = page.locator("[data-section='home-process-rail']");
  const processCards = processRail.locator("article");

  await expect(processCards).toHaveCount(5);

  const metrics = await processRail.evaluate((rail) => {
    const cards = Array.from(rail.querySelectorAll("article"));
    const rects = cards.map((card) => card.getBoundingClientRect());

    return {
      scrollWidth: rail.scrollWidth,
      clientWidth: rail.clientWidth,
      firstTop: rects[0]?.top ?? 0,
      secondTop: rects[1]?.top ?? 0,
      firstLeft: rects[0]?.left ?? 0,
      secondLeft: rects[1]?.left ?? 0,
    };
  });

  expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
  expect(Math.abs(metrics.firstTop - metrics.secondTop)).toBeLessThan(2);
  expect(metrics.secondLeft).toBeGreaterThan(metrics.firstLeft);

  await page.screenshot({
    path: "test-results/home-process-mobile-horizontal.png",
    fullPage: false,
  });
});
