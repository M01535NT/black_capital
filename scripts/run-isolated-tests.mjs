import fs from "node:fs";
import { spawn } from "node:child_process";
import { assertIsolatedTarget } from "../src/lib/isolated-target.ts";

const statePath = process.env.BLACK_CAPITAL_LOCAL_STATUS_FILE || ".superpowers/sdd/2026-10-16-preparacion-black-capital/local-status.json";
if (!fs.existsSync(statePath)) throw new Error("Local Supabase status file is missing. Follow docs/testing/entorno-aislado.md; no productive fallback is permitted.");
const local = JSON.parse(fs.readFileSync(statePath, "utf8"));
assertIsolatedTarget({ mode: "isolated", url: local.API_URL, allowedOrigin: "http://127.0.0.1:54321", projectRef: "black-capital-isolated", allowedProjectRef: "black-capital-isolated" });
if (!local.ANON_KEY || !local.SERVICE_ROLE_KEY) throw new Error("Local Supabase keys are missing.");
const environment = {
  ...process.env,
  BLACK_CAPITAL_TEST_MODE: "isolated",
  BLACK_CAPITAL_TEST_ORIGIN: "http://127.0.0.1:54321",
  BLACK_CAPITAL_TEST_PROJECT_REF: "black-capital-isolated",
  BLACK_CAPITAL_ISOLATED_INTEGRATION: "1",
  NEXT_PUBLIC_SUPABASE_URL: local.API_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: local.ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: local.SERVICE_ROLE_KEY,
  DOCUMENT_ACCESS_SECRET: "isolated-only-document-salt",
  BLACK_CAPITAL_TEST_SIGNING_SECRET: local.JWT_SECRET || "",
  // No external provider credentials are inherited by the test application.
  RESEND_API_KEY: "re_placeholder",
  WHATSAPP_ACCESS_TOKEN: "",
  WHATSAPP_PHONE_NUMBER_ID: "",
  WHATSAPP_VERIFICATION_TEMPLATE_NAME: "",
  NEXT_PUBLIC_POSTHOG_KEY: "",
  NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3100",
  NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS: "1",
  SMOKE_BASE_URL: "http://127.0.0.1:3100",
};
delete environment.VERCEL_ENV;
const args = process.argv.slice(2);
const publicIndex = args.indexOf("--public");
if (publicIndex >= 0) args.splice(publicIndex, 1);
const config = publicIndex >= 0 ? "playwright.public-isolated.config.ts" : "playwright.isolated.config.ts";
const child = spawn(process.execPath, ["node_modules/@playwright/test/cli.js", "test", `--config=${config}`, ...args], { stdio: "inherit", env: environment });
child.on("exit", code => process.exitCode = code ?? 1);
child.on("error", () => { process.stderr.write("Unable to start isolated Playwright.\n"); process.exitCode = 1; });
