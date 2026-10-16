import { randomUUID } from "node:crypto";
import { expect, test, type APIRequestContext } from "@playwright/test";
import { cleanupTestFixtures, createTestFixtures, recordFixture, isolatedAdmin, type TestFixtures } from "../support/isolated-fixtures";
import { actorRequest } from "../support/isolated-session";

let fixtures: TestFixtures, admin: APIRequestContext, agent: APIRequestContext;
test.beforeAll(async () => { fixtures = await createTestFixtures(); admin = await actorRequest(fixtures.admin); agent = await actorRequest(fixtures.agentA); });
test.afterAll(async () => { await admin?.dispose(); await agent?.dispose(); if (fixtures) await cleanupTestFixtures(fixtures); });

test("admin creates, updates, assigns and deletes a property", async () => {
  const id = randomUUID();
  const response = await admin.post("/api/properties", { data: { title: `Fixture CRUD ${id}`, slug: `fixture-crud-${id}`, description: "Synthetic property for isolated administrative tests.", property_use: "Residencial", property_type: "Casa", business_type: "Venta", price: 1100000, currency: "MXN", status: "Available", agent_ids: [fixtures.agentA.agentId] } });
  expect(response.status()).toBe(201);
  const propertyId = (await response.json()).property.id;
  recordFixture(fixtures, "properties", propertyId);
  expect((await admin.put("/api/properties", { data: { id: propertyId, price: 1200000 } })).status()).toBe(200);
  expect((await admin.delete(`/api/properties?id=${propertyId}`)).status()).toBe(200);
  expect((await isolatedAdmin().from("properties").select("id").eq("id", propertyId)).data).toEqual([]);
});

test("agent updates own lead and completes own task", async () => {
  expect((await agent.put("/api/leads", { data: { id: fixtures.leadA, notes: "Isolated follow-up" } })).status()).toBe(200);
  const created = await agent.post("/api/lead-tasks", { data: { lead_id: fixtures.leadA, title: "Isolated task" } });
  expect(created.status()).toBe(201);
  const taskId = (await created.json()).task.id;
  expect((await agent.patch("/api/lead-tasks", { data: { id: taskId, status: "done" } })).status()).toBe(200);
});

test("agent cannot assign a task to another profile through payload", async () => {
  const response = await agent.post("/api/lead-tasks", { data: { lead_id: fixtures.leadA, title: "Scoped task", assigned_profile_id: fixtures.agentB.id, assigned_agent_id: fixtures.agentB.agentId } });
  expect(response.status()).toBe(201);
  const task = (await response.json()).task;
  expect(task.assigned_profile_id).toBe(fixtures.agentA.id);
  expect(task.assigned_agent_id).toBe(fixtures.agentA.agentId);
});

test("upload enforces admin, bucket, type and size", async () => {
  expect((await agent.post("/api/upload")).status()).toBe(401);
  const badBucket = await admin.post("/api/upload", { multipart: { bucket: "unknown", propertyId: fixtures.propertyA, file: { name: "x.pdf", mimeType: "application/pdf", buffer: Buffer.from("pdf") } } });
  expect(badBucket.status()).toBe(400);
  const badType = await admin.post("/api/upload", { multipart: { propertyId: fixtures.propertyA, file: { name: "x.exe", mimeType: "application/octet-stream", buffer: Buffer.from("x") } } });
  expect(badType.status()).toBe(400);
  const tooLarge = await admin.post("/api/upload", { multipart: { propertyId: fixtures.propertyA, file: { name: "large.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(10 * 1024 * 1024 + 1) } } });
  expect(tooLarge.status()).toBe(400);
});
