import { randomInt, randomUUID } from "node:crypto";
import { strict as assert } from "node:assert";
import type { APIRequestContext } from "@playwright/test";
import { isolatedAdmin, recordFixture, type TestFixtures } from "./isolated-fixtures";

export async function requestFixtureDocument(context: APIRequestContext, fixtures: TestFixtures, preferredPhone?: string) {
  const client = isolatedAdmin();
  let phone = preferredPhone || `52000${String(randomInt(10_000_000)).padStart(7, "0")}`;
  for (;;) {
    const existing = await client.from("leads").select("id").eq("whatsapp_normalized", phone);
    assert.equal(existing.error, null);
    if (!existing.data!.length) break;
    phone = `52000${String(randomInt(10_000_000)).padStart(7, "0")}`;
  }
  // Reserve an owned ID before the endpoint can reuse a phone-matched lead.
  const leadId = randomUUID();
  const inserted = await client.from("leads").insert({ id: leadId, full_name: `Fixture ${fixtures.runId}`, email: `doc-${leadId}@example.test`, whatsapp_normalized: phone, source: "organic", privacy_accepted: true });
  assert.equal(inserted.error, null);
  recordFixture(fixtures, "leads", leadId);
  const response = await context.post("/api/document-access/request", { data: { propertyId: fixtures.propertyA, documentId: "fixture-document", fullName: `Fixture ${fixtures.runId}`, phone, email: `doc-${leadId}@example.test`, acceptedNda: true, acceptedPrivacy: true } });
  assert.equal(response.status(), 200);
  const body = await response.json();
  const row = await client.from("document_access_requests").select("lead_id").eq("id", body.requestId).single();
  assert.equal(row.error, null);
  assert.equal(row.data!.lead_id, leadId);
  return { ...body, leadId } as { requestId: string; devCode: string; leadId: string };
}
