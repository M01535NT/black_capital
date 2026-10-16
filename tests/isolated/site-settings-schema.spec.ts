import { expect, test } from "@playwright/test";
import { DEFAULT_SITE_SETTINGS, normalizeSiteSettings, siteSettingsPatchSchema } from "../../src/lib/site-settings-schema";

test("partial settings preserve defaults and never expose unknown fields", () => {
  const value = normalizeSiteSettings({ contactEmail: "team@example.test", SUPABASE_SERVICE_ROLE_KEY: "must-not-leak" });
  expect(value.contactEmail).toBe("team@example.test");
  expect(value.contactPhone).toBe(DEFAULT_SITE_SETTINGS.contactPhone);
  expect(value).not.toHaveProperty("SUPABASE_SERVICE_ROLE_KEY");
});

test("invalid persisted values and missing config use safe defaults", () => {
  expect(normalizeSiteSettings(null)).toEqual(DEFAULT_SITE_SETTINGS);
  expect(normalizeSiteSettings({ contactEmail: "bad", contactPhone: 12, heroImageUrl: "javascript:alert(1)" })).toEqual(DEFAULT_SITE_SETTINGS);
});

for (const data of [
  { heroImageUrl: "javascript:alert(1)" },
  { heroImageUrl: "https://attacker.example/cover.jpg" },
  { heroVideoUrl: "https://www.youtube.com/watch?v=abc" },
  { heroImageUrl: "//attacker.example/image.jpg" },
  { heroImageUrl: "/\\attacker.example/image.jpg" },
  { contactEmail: "not-an-email" },
  { contactPhone: "123" },
  { internalSecret: "forbidden" },
]) {
  test(`rejects invalid update ${Object.keys(data)[0]} ${Object.values(data)[0]}`, () => {
    expect(siteSettingsPatchSchema.safeParse(data).success).toBe(false);
  });
}

test("allows local images, permitted HTTPS media and plain title text", () => {
  expect(siteSettingsPatchSchema.safeParse({ heroImageUrl: "/brand-luxury.webp", heroVideoUrl: "https://res.cloudinary.com/example/video/upload/hero.webm", luxuryHeroTitle: "<b>Texto</b>" }).success).toBe(true);
});
