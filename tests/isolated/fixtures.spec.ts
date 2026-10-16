import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { cleanupFixtureManifest, cleanupTestFixtures, createTestFixtures, isolatedAdmin } from "../support/isolated-fixtures";
import { requestFixtureDocument } from "../support/document-fixture";
import { actorRequest } from "../support/isolated-session";

test("fixture cleanup is repeatable and preserves an unrelated sentinel", async () => {
  const client = isolatedAdmin();
  const sentinel = randomUUID();
  const inserted = await client.from("agents").insert({ id: sentinel, full_name: "Unrelated sentinel" });
  expect(inserted.error).toBeNull();
  try {
    const fixtures = await createTestFixtures();
    expect(fixtures.created.users).toHaveLength(4);
    // Simulate interruption after one owned row was already removed. Recover
    // using only the durable IDs, without passwords or the original process.
    expect((await client.from("properties").delete().eq("id", fixtures.propertyB)).error).toBeNull();
    await cleanupFixtureManifest(fixtures.runId);
    await cleanupFixtureManifest(fixtures.runId);
    await cleanupTestFixtures(fixtures);
    const surviving = await client.from("agents").select("id").eq("id", sentinel).single();
    expect(surviving.data?.id).toBe(sentinel);
    const removed = await client.from("properties").select("id").in("id", fixtures.created.properties);
    expect(removed.data).toEqual([]);
  } finally {
    await client.from("agents").delete().eq("id", sentinel);
  }
});

test("document fixtures neither reuse nor delete a pre-existing phone-matched lead", async () => {
  const client = isolatedAdmin();
  const sentinel = randomUUID();
  const phone = "520000000001";
  expect((await client.from("leads").insert({ id: sentinel, full_name: "Unrelated documentary sentinel", email: `${sentinel}@example.test`, whatsapp_normalized: phone, source: "organic" })).error).toBeNull();
  const fixtures = await createTestFixtures();
  const visitor = await actorRequest();
  try {
    const result = await requestFixtureDocument(visitor, fixtures, phone);
    expect(result.leadId).not.toBe(sentinel);
    expect(fixtures.created.leads).not.toContain(sentinel);
    await cleanupTestFixtures(fixtures);
    const surviving = await client.from("leads").select("full_name,whatsapp_normalized").eq("id", sentinel).single();
    expect(surviving.data).toEqual({ full_name: "Unrelated documentary sentinel", whatsapp_normalized: phone });
  } finally {
    await visitor.dispose();
    await cleanupTestFixtures(fixtures);
    await client.from("leads").delete().eq("id", sentinel);
  }
});
