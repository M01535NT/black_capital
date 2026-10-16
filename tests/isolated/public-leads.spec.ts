import { expect, test } from "@playwright/test";
import { cleanupTestFixtures, createTestFixtures, isolatedAdmin } from "../support/isolated-fixtures";
import { actorRequest } from "../support/isolated-session";

test("public consented form reaches the isolated CRM and notifies its admin", async () => {
  const fixtures = await createTestFixtures();
  const visitor = await actorRequest();
  try {
    const payload = { full_name: "Contacto sintético", email: `contact-${fixtures.runId}@example.test`, phone: "0000000000", privacy_accepted: true, source: "organic", status: "new", property_id: fixtures.propertyA, notes: "Contexto de prueba" };
    expect((await visitor.post("/api/public-leads", { data: { ...payload, privacy_accepted: false } })).status()).toBe(400);
    const response = await visitor.post("/api/public-leads", { data: payload });
    expect(response.status()).toBe(201);
    const { leadId } = await response.json();
    fixtures.created.leads.push(leadId);
    const client = isolatedAdmin();
    const record = await client.from("leads").select("property_id,notes,privacy_accepted").eq("id", leadId).single();
    expect(record.data).toEqual({ property_id: fixtures.propertyA, notes: "Contexto de prueba", privacy_accepted: true });
    const notifications = await client.from("notifications").select("id").eq("recipient_profile_id", fixtures.admin.id).eq("href", `/admin/leads/${leadId}`);
    expect(notifications.data).toHaveLength(1);
  } finally { await visitor.dispose(); await cleanupTestFixtures(fixtures); }
});
