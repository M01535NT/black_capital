import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });

test("home manifesto and its four rotating indicators fit mobile", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const section = page.locator("[data-section='home-methodology']");
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(/Una propiedad bien vendida no es suerte/);
  const counters = section.locator("[data-method-counter]");
  await expect(counters).toHaveCount(4);
  const positions = await counters.evaluateAll(nodes => nodes.map(node => ({ x: node.getBoundingClientRect().left, y: node.getBoundingClientRect().top })));
  expect(Math.max(...positions.map(p => p.y)) - Math.min(...positions.map(p => p.y))).toBeLessThan(2);
  expect(positions[1].x).toBeGreaterThan(positions[0].x);
  expect(positions[3].x).toBeGreaterThan(positions[2].x);
  for (const line of await section.locator("[data-method-line]").all()) {
    expect(await line.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  }
  expect(await section.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  await expect(section.getByRole("link", { name: "Pedir información" })).toHaveAttribute("href", /^https:\/\/wa\.me\//);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
});

test("odometer rotates to the real sector count and reduced motion keeps its final value", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const sector = page.locator("[data-section='home-methodology'] [data-method-counter]").nth(1);
  await expect(sector).toHaveAttribute("data-value", "3");
  const reel = sector.locator("[data-digit-reel]");
  const before = await reel.evaluate(el => getComputedStyle(el).transform);
  await sector.scrollIntoViewIfNeeded();
  await expect.poll(() => reel.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
  const finalOffset = () => reel.evaluate(el => {
    const frame = el.parentElement!.getBoundingClientRect();
    const rowHeight = el.children[0].getBoundingClientRect().height;
    return Math.abs(el.getBoundingClientRect().top - frame.top + 23 * rowHeight);
  });
  await expect.poll(finalOffset, { timeout: 8000 }).toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(finalOffset).toBeLessThan(1);
  await expect(sector.locator(".sr-only")).toHaveText("3 Sectores");
});
