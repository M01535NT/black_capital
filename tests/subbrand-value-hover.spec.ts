import { expect, test, type Locator } from "@playwright/test";

const routes = ["/black-luxury", "/black-business", "/black-industrial"] as const;

const railSelector = "[data-section='sub-brand-value-rail']";
const cardSelector = `${railSelector} .sub-brand-value-card-shell`;

async function cardWidths(cards: Locator) {
  return cards.evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().width)),
  );
}

function expectEvenWidths(widths: number[]) {
  const min = Math.min(...widths);
  const max = Math.max(...widths);

  expect(max - min, `Expected even card widths, received ${widths.join(", ")}`).toBeLessThanOrEqual(8);
}

test.describe("sub-brand value cards desktop interaction", () => {
  test.use({
    viewport: { width: 1440, height: 1000 },
    isMobile: false,
  });

  for (const route of routes) {
    test(`${route} starts even and expands the hovered card`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const rail = page.locator(railSelector);
      await expect(rail).toHaveCount(1);
      await rail.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);

      const cards = page.locator(cardSelector);
      await expect(cards).toHaveCount(3);

      const initialWidths = await cardWidths(cards);
      expectEvenWidths(initialWidths);

      for (let activeIndex = 0; activeIndex < 3; activeIndex += 1) {
        await cards.nth(activeIndex).hover();
        await page.waitForTimeout(820);

        const hoveredWidths = await cardWidths(cards);
        const activeWidth = hoveredWidths[activeIndex];
        const inactiveWidths = hoveredWidths.filter((_, index) => index !== activeIndex);

        expect(activeWidth, `Expected active card ${activeIndex} to grow on ${route}; received ${hoveredWidths.join(", ")}`).toBeGreaterThan(
          Math.max(...inactiveWidths) * 1.55,
        );
        expect(activeWidth, `Expected active card ${activeIndex} to grow beyond the even state on ${route}`).toBeGreaterThan(
          initialWidths[activeIndex] * 1.35,
        );
        expect(Math.max(...inactiveWidths), `Expected inactive cards to shrink on ${route}`).toBeLessThan(
          Math.max(...initialWidths) * 0.9,
        );
      }

      await page.mouse.move(8, 8);
      await page.waitForTimeout(820);
      expectEvenWidths(await cardWidths(cards));
    });

    test(`${route} expands the focused card`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const rail = page.locator(railSelector);
      await expect(rail).toHaveCount(1);
      await rail.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);

      const cards = page.locator(cardSelector);
      await expect(cards).toHaveCount(3);

      const initialWidths = await cardWidths(cards);
      expectEvenWidths(initialWidths);

      await cards.nth(1).locator("a").focus();
      await page.waitForTimeout(820);

      const focusedWidths = await cardWidths(cards);
      expect(focusedWidths[1], `Expected focused card to grow on ${route}; received ${focusedWidths.join(", ")}`).toBeGreaterThan(
        Math.max(focusedWidths[0], focusedWidths[2]) * 1.55,
      );
    });
  }
});

test.describe("sub-brand value rail mobile behavior", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });

  for (const route of routes) {
    test(`${route} keeps the value rail horizontal on mobile without document overflow`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const rail = page.locator(railSelector);
      await expect(rail).toHaveCount(1);
      await rail.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      const railMetrics = await rail.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));

      const documentMetrics = await page.evaluate(() => ({
        bodyScrollWidth: document.body.scrollWidth,
        rootClientWidth: document.documentElement.clientWidth,
        rootScrollWidth: document.documentElement.scrollWidth,
      }));

      expect(railMetrics.scrollWidth).toBeGreaterThan(railMetrics.clientWidth);
      expect(documentMetrics.rootScrollWidth).toBeLessThanOrEqual(documentMetrics.rootClientWidth + 2);
      expect(documentMetrics.bodyScrollWidth).toBeLessThanOrEqual(documentMetrics.rootClientWidth + 2);
    });
  }
});
