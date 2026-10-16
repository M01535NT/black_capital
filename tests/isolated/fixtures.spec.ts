import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { cleanupTestFixtures, createTestFixtures, isolatedAdmin } from "../support/isolated-fixtures";

test("fixture cleanup is repeatable and preserves an unrelated sentinel", async () => {
  const client = isolatedAdmin();
  const sentinel = randomUUID();
  const inserted = await client.from("agents").insert({ id: sentinel, full_name: "Unrelated sentinel" });
  expect(inserted.error).toBeNull();
  try {
    const fixtures = await createTestFixtures();
    expect(fixtures.created.users).toHaveLength(4);
    await cleanupTestFixtures(fixtures);
    await cleanupTestFixtures(fixtures);
    const surviving = await client.from("agents").select("id").eq("id", sentinel).single();
    expect(surviving.data?.id).toBe(sentinel);
    const removed = await client.from("properties").select("id").in("id", fixtures.created.properties);
    expect(removed.data).toEqual([]);
  } finally {
    await client.from("agents").delete().eq("id", sentinel);
  }
});
