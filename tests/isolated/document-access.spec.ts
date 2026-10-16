import { expect, test, type APIRequestContext } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { cleanupTestFixtures, createTestFixtures, isolatedAdmin, type TestFixtures } from "../support/isolated-fixtures";
import { actorRequest } from "../support/isolated-session";

let fixtures: TestFixtures, visitor: APIRequestContext;
test.beforeAll(async () => { fixtures = await createTestFixtures(); visitor = await actorRequest(); });
test.afterAll(async () => { await visitor?.dispose(); if (fixtures) await cleanupTestFixtures(fixtures); });

test("documents require consent and reject missing or incorrect verification", async () => {
  const profile = await (await visitor.post("/api/document-access/request", { data: { propertyId: fixtures.propertyA, documentId: "fixture-document" } })).json();
  expect(profile.requiresProfile).toBe(true);
  expect((await visitor.get("/api/document-access/download?requestId=missing")).status()).toBe(403);
});

test("verified visitor downloads the private PDF; unrelated and expired sessions fail", async () => {
  const response = await visitor.post("/api/document-access/request", { data: { propertyId: fixtures.propertyA, documentId: "fixture-document", fullName: `Fixture ${fixtures.runId}`, phone: "520000000001", email: `doc-${fixtures.runId}@example.test`, acceptedNda: true, acceptedPrivacy: true } });
  expect(response.status()).toBe(200);
  const body = await response.json();
  const client = isolatedAdmin();
  const row = await client.from("document_access_requests").select("lead_id").eq("id", body.requestId).single();
  expect(row.error).toBeNull();
  fixtures.created.leads.push(row.data!.lead_id);
  expect((await visitor.post("/api/document-access/verify", { data: { requestId: body.requestId, code: "000000" } })).status()).toBe(400);
  expect((await visitor.post("/api/document-access/verify", { data: { requestId: body.requestId, code: body.devCode } })).status()).toBe(200);
  const downloaded = await visitor.get(`/api/document-access/download?requestId=${body.requestId}`);
  expect(downloaded.status()).toBe(200);
  expect((await downloaded.body()).toString()).toContain("%PDF-1.4");
  const unrelated = await actorRequest();
  expect((await unrelated.get(`/api/document-access/download?requestId=${body.requestId}`)).status()).toBe(403);
  await unrelated.dispose();
  await client.from("leads").update({ document_access_expires_at: "2000-01-01T00:00:00Z" }).eq("id", row.data!.lead_id);
  expect((await visitor.get(`/api/document-access/download?requestId=${body.requestId}`)).status()).toBe(403);
});

test("an expired code cannot establish a document session", async () => {
  const context = await actorRequest();
  try {
    const response = await context.post("/api/document-access/request", { data: { propertyId: fixtures.propertyA, documentId: "fixture-document", fullName: "Fixture expired", phone: "520000000002", acceptedNda: true, acceptedPrivacy: true } });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const client = isolatedAdmin();
    const row = await client.from("document_access_requests").select("lead_id").eq("id", body.requestId).single();
    fixtures.created.leads.push(row.data!.lead_id);
    await client.from("document_access_requests").update({ verification_expires_at: "2000-01-01T00:00:00Z" }).eq("id", body.requestId);
    expect((await context.post("/api/document-access/verify", { data: { requestId: body.requestId, code: body.devCode } })).status()).toBe(400);
  } finally { await context.dispose(); }
});

test("authenticated agent cannot directly read another property's private document", async () => {
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
  expect((await client.auth.signInWithPassword({ email: fixtures.agentB.email, password: fixtures.agentB.password })).error).toBeNull();
  const result = await client.storage.from("secure-brochures").download(fixtures.documentPath);
  expect(result.error).not.toBeNull();
  expect(result.data).toBeNull();
});
