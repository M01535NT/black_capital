import { defineConfig } from "@playwright/test";
import isolated from "./playwright.isolated.config";

export default defineConfig({
  ...isolated,
  testDir: "./tests",
  testIgnore: ["**/isolated/**"],
  globalSetup: "./tests/support/public-regression-setup.ts",
  use: { ...isolated.use, browserName: "chromium" },
});
