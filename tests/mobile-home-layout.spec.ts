import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});

// Tras el rediseño editorial, la sección de metodología del home es un timeline
// VERTICAL en móvil (pósters apilados por paso), no un rail horizontal. Este test
// protege ese layout: pasos apilados, alineados a la izquierda y sin overflow.
test("home methodology section stacks vertically on mobile", async ({ page }) => {
  await page.goto("/");

  const heading = page.getByRole("heading", { name: /De valor estimado a cierre/i });
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const section = page.locator("[data-section='home-methodology']");
  await expect(section).toHaveCount(1);

  const steps = section.locator("ol > li:has(h3)");
  await expect(steps).toHaveCount(4);

  const metrics = await section.evaluate((node) => {
    const items = Array.from(node.querySelectorAll("ol > li")).filter(
      (li) => li.querySelector("h3") !== null,
    );
    const rects = items.map((li) => li.getBoundingClientRect());
    return {
      scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth,
      firstTop: rects[0]?.top ?? 0,
      secondTop: rects[1]?.top ?? 0,
      firstLeft: rects[0]?.left ?? 0,
      secondLeft: rects[1]?.left ?? 0,
    };
  });

  // Timeline vertical: el segundo paso queda debajo del primero…
  expect(metrics.secondTop).toBeGreaterThan(metrics.firstTop);
  // …y alineado a la misma columna (no en horizontal).
  expect(Math.abs(metrics.secondLeft - metrics.firstLeft)).toBeLessThan(2);
  // La sección no debe introducir overflow horizontal.
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 2);

  await page.screenshot({
    path: "test-results/home-methodology-mobile-vertical.png",
    fullPage: false,
  });
});
