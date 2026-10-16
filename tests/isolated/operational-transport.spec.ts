import { expect, test } from "@playwright/test";
import { sendOperationalRequest } from "../../src/lib/operational-transport";

const variables = ["BLACK_CAPITAL_TEST_MODE", "BLACK_CAPITAL_TEST_ORIGIN", "BLACK_CAPITAL_TEST_PROJECT_REF", "NEXT_PUBLIC_SUPABASE_URL", "VERCEL_ENV"];
let saved: Record<string, string | undefined>;
let originalFetch: typeof fetch;
let networkCalls = 0;

test.beforeEach(() => {
  saved = Object.fromEntries(variables.map(key => [key, process.env[key]]));
  variables.forEach(key => delete process.env[key]);
  originalFetch = globalThis.fetch;
  networkCalls = 0;
  globalThis.fetch = async () => { networkCalls++; return Response.json({ live: true }); };
});
test.afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of variables) { if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key]; }
});

function isolate() {
  Object.assign(process.env, { BLACK_CAPITAL_TEST_MODE: "isolated", BLACK_CAPITAL_TEST_ORIGIN: "http://127.0.0.1:54321", BLACK_CAPITAL_TEST_PROJECT_REF: "black-capital-isolated", NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321" });
}

test("isolated email and WhatsApp produce successful responses without network", async () => {
  isolate();
  for (const service of ["resend", "whatsapp"] as const) {
    const response = await sendOperationalRequest(service, service === "resend" ? "https://api.resend.com/emails" : "https://graph.facebook.com/v21.0/test/messages", { method: "POST" });
    expect(response.ok).toBe(true);
    expect(await response.json()).toMatchObject({ isolated: true });
  }
  expect(networkCalls).toBe(0);
});

test("normal mode retains the provider network transport", async () => {
  const response = await sendOperationalRequest("resend", "https://api.resend.com/emails", { method: "POST" });
  expect(await response.json()).toEqual({ live: true });
  expect(networkCalls).toBe(1);
});

test("invalid isolated configuration fails closed without network", async () => {
  isolate();
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://tewfdfmicifpdecxcpfy.supabase.co";
  await expect(sendOperationalRequest("resend", "https://api.resend.com/emails", {})).rejects.toThrow(/isolated/i);
  expect(networkCalls).toBe(0);
});

test("a production Vercel deployment cannot enable simulated providers", async () => {
  isolate(); process.env.VERCEL_ENV = "production";
  await expect(sendOperationalRequest("whatsapp", "https://graph.facebook.com/v21.0/test/messages", {})).rejects.toThrow(/production/i);
  expect(networkCalls).toBe(0);
});
