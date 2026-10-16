import { expect, test, type APIRequestContext } from "@playwright/test";
import { cleanupTestFixtures, createTestFixtures, isolatedAdmin, type TestFixtures } from "../support/isolated-fixtures";
import { actorRequest } from "../support/isolated-session";

let fixtures: TestFixtures, admin: APIRequestContext;
let original: unknown;
test.beforeAll(async () => {
  fixtures = await createTestFixtures(); admin = await actorRequest(fixtures.admin);
  original = (await isolatedAdmin().from("app_settings").select("value").eq("key", "site").maybeSingle()).data?.value;
});
test.afterAll(async () => {
  if (fixtures) {
    const client = isolatedAdmin();
    if (original === undefined) await client.from("app_settings").delete().eq("key", "site");
    else await client.from("app_settings").upsert({ key: "site", value: original });
    await cleanupTestFixtures(fixtures);
  }
  await admin?.dispose();
});

test("saved contact, segment copy and cover reach a new public visitor", async ({ page }) => {
  const response = await admin.post("/api/settings", { data: { contactEmail: "isolated-team@example.test", contactPhone: "+52 000 000 0000", contactAddress: "Dirección sintética", luxuryHeroTitle: "<b>Residencias de prueba</b>", heroImageUrl: "/brand-luxury.webp" } });
  expect(response.status()).toBe(200);
  await page.goto("/contacto", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: "isolated-team@example.test", exact: true }).first()).toBeVisible();
  await page.goto("/black-luxury", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main h1")).toHaveText("<b>Residencias de prueba</b>");
  await expect(page.locator("main h1 b")).toHaveCount(0);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-section=cinematic-hero] img")).toHaveAttribute("src", /brand-luxury/);
});

test("invalid configuration is rejected without changing the stored value", async () => {
  const before = (await isolatedAdmin().from("app_settings").select("value").eq("key", "site").single()).data?.value;
  expect((await admin.post("/api/settings", { data: { heroImageUrl: "javascript:alert(1)" } })).status()).toBe(400);
  const after = (await isolatedAdmin().from("app_settings").select("value").eq("key", "site").single()).data?.value;
  expect(after).toEqual(before);
});

test("failed save displays an error rather than claiming publication", async ({ page }) => {
  await page.context().addCookies((await admin.storageState()).cookies);
  await page.goto("/admin/settings", { waitUntil: "domcontentloaded" });
  await page.route("**/api/settings", route => route.request().method() === "POST" ? route.fulfill({ status: 503, json: { error: "Fallo de prueba" } }) : route.continue());
  await page.getByRole("button", { name: /Guardar/i }).click();
  await expect(page.getByRole("alert").filter({ hasText: /no se pudo guardar/i })).toBeVisible();
});

test("reduced motion keeps the cover visible without autoplay video", async ({ page }) => {
  expect((await admin.post("/api/settings", { data: { heroVideoUrl: "/hero.webm" } })).status()).toBe(200);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-section=cinematic-hero] video")).toHaveCount(0);
  await expect(page.locator("[data-section=cinematic-hero] img")).toBeVisible();
});
