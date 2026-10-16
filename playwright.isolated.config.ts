import { defineConfig } from "@playwright/test";
import { assertIsolatedTarget, isolatedTargetFromEnv } from "./src/lib/isolated-target";

if (process.env.BLACK_CAPITAL_ISOLATED_INTEGRATION === "1") assertIsolatedTarget(isolatedTargetFromEnv());

export default defineConfig({
  testDir: "./tests/isolated",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: ".superpowers/sdd/2026-10-16-preparacion-black-capital/test-results",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "off",
    screenshot: "off",
    video: "off",
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/chromium", args: ["--no-sandbox"] },
  },
  webServer: process.env.BLACK_CAPITAL_ISOLATED_INTEGRATION === "1" ? {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120000,
  } : undefined,
});
