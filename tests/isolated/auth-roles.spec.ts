import { expect, test, type APIRequestContext } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { cleanupTestFixtures, createTestFixtures, isolatedAdmin, type TestFixtures } from "../support/isolated-fixtures";
import { actorRequest } from "../support/isolated-session";

let fixtures: TestFixtures;
let admin: APIRequestContext, agent: APIRequestContext, inactive: APIRequestContext, visitor: APIRequestContext;
test.beforeAll(async () => {
  fixtures = await createTestFixtures();
  [admin, agent, inactive, visitor] = await Promise.all([actorRequest(fixtures.admin), actorRequest(fixtures.agentA), actorRequest(fixtures.inactive), actorRequest()]);
});
test.afterAll(async () => {
  for (const context of [admin, agent, inactive, visitor]) await context?.dispose();
  if (fixtures) await cleanupTestFixtures(fixtures);
});

test("visitor and inactive profile cannot use the administrative API", async () => {
  for (const context of [visitor, inactive]) {
    expect((await context.get("/api/properties")).status()).toBe(401);
    const response = await context.get("/admin", { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toContain("/admin/login");
  }
});

test("admin sees both fixtures; agent sees only assigned property", async () => {
  const all = await (await admin.get("/api/properties")).json();
  const own = await (await agent.get("/api/properties")).json();
  expect(all.properties.map((p: {id: string}) => p.id)).toEqual(expect.arrayContaining([fixtures.propertyA, fixtures.propertyB]));
  expect(own.properties.map((p: {id: string}) => p.id)).toEqual([fixtures.propertyA]);
});

test("agent cannot change another agent's lead, task or configuration", async () => {
  const client = isolatedAdmin();
  const before = (await client.from("leads").select("notes,assigned_agent_id").eq("id", fixtures.leadB).single()).data;
  const created = await admin.post("/api/lead-tasks", { data: { lead_id: fixtures.leadB, title: "Protected task", assigned_profile_id: fixtures.agentB.id, assigned_agent_id: fixtures.agentB.agentId } });
  expect(created.status()).toBe(201);
  const task = (await created.json()).task;
  expect((await agent.put("/api/leads", { data: { id: fixtures.leadB, notes: "Forbidden edit" } })).status()).toBe(403);
  expect((await agent.post("/api/lead-tasks", { data: { lead_id: fixtures.leadB, title: "Forbidden" } })).status()).toBe(403);
  expect((await agent.patch("/api/lead-tasks", { data: { id: task.id, status: "done", title: "Forbidden task edit" } })).status()).toBe(403);
  expect((await agent.post("/api/settings", { data: { contactEmail: "wrong@example.test" } })).status()).toBe(401);
  expect((await agent.post("/api/properties", { data: { title: "Forbidden property" } })).status()).toBe(401);
  expect((await client.from("leads").select("notes,assigned_agent_id").eq("id", fixtures.leadB).single()).data).toEqual(before);
  expect((await client.from("lead_tasks").select("id,title,status,assigned_profile_id,assigned_agent_id").eq("lead_id", fixtures.leadB)).data).toEqual([{ id: task.id, title: task.title, status: task.status, assigned_profile_id: task.assigned_profile_id, assigned_agent_id: task.assigned_agent_id }]);
});

test("directly opening another agent's lead page does not expose it", async ({ page }) => {
  await page.context().addCookies((await agent.storageState()).cookies);
  await page.goto(`/admin/leads/${fixtures.leadB}`, { waitUntil: "domcontentloaded" });
  await expect(page.getByText(`lead-${fixtures.leadB}@example.test`, { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /404|no encontrad/i }).first()).toBeVisible();
});

test("agent's new-lead counter is scoped to that agent", async () => {
  expect(await (await agent.get("/api/leads")).json()).toEqual({ newCount: 1 });
});

test("public and authenticated Data API cannot read private CRM rows", async () => {
  for (const actor of [undefined, fixtures.agentA]) {
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
    if (actor) expect((await client.auth.signInWithPassword({ email: actor.email, password: actor.password })).error).toBeNull();
    const result = await client.from("leads").select("id").in("id", [fixtures.leadA, fixtures.leadB]);
    expect(result.error).toBeNull(); expect(result.data).toEqual([]);
  }
});

test("signing out removes administrative access", async () => {
  const session = await actorRequest(fixtures.agentB);
  expect((await session.post("/api/admin/logout")).status()).toBe(200);
  expect((await session.get("/api/properties")).status()).toBe(401);
  await session.dispose();
});

test("an expired access token is renewed without elevating the agent's permissions", async () => {
  const session = await actorRequest(fixtures.agentA, { expiredAccess: true });
  try {
    const before = (await session.storageState()).cookies;
    const response = await session.get("/api/properties");
    expect(response.status()).toBe(200);
    expect((await response.json()).properties.map((p: {id: string}) => p.id)).toEqual([fixtures.propertyA]);
    expect(JSON.stringify((await session.storageState()).cookies) !== JSON.stringify(before)).toBe(true);
  } finally { await session.dispose(); }
});

test("an expired session with an invalid refresh token is denied", async () => {
  const session = await actorRequest(fixtures.agentA, { expiredAccess: true, invalidRefresh: true });
  try { expect((await session.get("/api/properties")).status()).toBe(401); }
  finally { await session.dispose(); }
});
