import { expect, test } from "@playwright/test";
import { NextRequest } from "next/server";
import { proxy } from "../../src/proxy";

const saved = process.env.VERCEL_ENV;
test.afterEach(() => { if (saved === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = saved; });

test("preview blocks every API operation, including document GET side effects", async () => {
  process.env.VERCEL_ENV = "preview";
  for (const [path, method] of [["/api/public-leads", "POST"], ["/api/settings", "POST"], ["/api/document-access/download?requestId=test", "GET"], ["/api/admin/setup", "POST"]]) {
    expect(proxy(new NextRequest(`http://localhost${path}`, { method })).status).toBe(503);
  }
});

test("preview blocks login, setup and administrative pages", () => {
  process.env.VERCEL_ENV = "preview";
  for (const path of ["/admin", "/admin/login", "/admin/setup", "/admin/reset-password"]) {
    const response = proxy(new NextRequest(`http://localhost${path}`));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("preview=readonly");
  }
});

test("normal deployments retain route-level authorization", () => {
  process.env.VERCEL_ENV = "production";
  expect(proxy(new NextRequest("http://localhost/api/settings", { method: "POST" })).status).toBe(200);
});
