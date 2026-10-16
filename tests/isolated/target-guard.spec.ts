import { expect, test } from "@playwright/test";
import { assertIsolatedTarget } from "../support/isolated-target";

const valid = { mode: "isolated", url: "http://127.0.0.1:54321", allowedOrigin: "http://127.0.0.1:54321", projectRef: "black-capital-isolated", allowedProjectRef: "black-capital-isolated" };

test("accepts only the explicitly selected local target", () => {
  expect(() => assertIsolatedTarget(valid)).not.toThrow();
});

for (const [name, override] of [
  ["missing mode", { mode: undefined }],
  ["missing project", { projectRef: "" }],
  ["unlisted host", { url: "http://elsewhere.test:54321" }],
  ["production project", { projectRef: "tewfdfmicifpdecxcpfy", allowedProjectRef: "tewfdfmicifpdecxcpfy" }],
  ["production URL", { url: "https://tewfdfmicifpdecxcpfy.supabase.co", allowedOrigin: "https://tewfdfmicifpdecxcpfy.supabase.co" }],
  ["remote even if allowlisted", { url: "https://example.supabase.co", allowedOrigin: "https://example.supabase.co" }],
] as const) {
  test(`rejects ${name} before a client can be created`, () => {
    expect(() => assertIsolatedTarget({ ...valid, ...override })).toThrow(/isolated/i);
  });
}
