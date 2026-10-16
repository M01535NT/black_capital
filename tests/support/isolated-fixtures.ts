import { randomBytes, randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync, renameSync, readFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { assertIsolatedTarget, isolatedTargetFromEnv } from "./isolated-target";

export type TestActor = { id: string; email: string; password: string; role: "admin" | "agent"; agentId: string | null };
export type TestFixtures = {
  runId: string;
  admin: TestActor;
  agentA: TestActor;
  agentB: TestActor;
  inactive: TestActor;
  propertyA: string;
  propertyB: string;
  leadA: string;
  leadB: string;
  documentPath: string;
  created: { users: string[]; agents: string[]; properties: string[]; leads: string[]; files: string[] };
};
type FixtureManifest = Pick<TestFixtures, "runId" | "created">;
const manifestDirectory = ".superpowers/sdd/2026-10-16-preparacion-black-capital/fixtures";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function manifestPath(runId: string) {
  if (!uuid.test(runId)) throw new Error("Invalid fixture run ID.");
  return join(manifestDirectory, `${runId}.json`);
}

export function recordFixture(fixtures: FixtureManifest, kind: keyof TestFixtures["created"], id: string) {
  assertIsolatedTarget(isolatedTargetFromEnv());
  fixtures.created[kind].push(id);
  mkdirSync(manifestDirectory, { recursive: true, mode: 0o700 });
  const path = manifestPath(fixtures.runId);
  // IDs and object paths only; never persist actor credentials or sessions.
  writeFileSync(`${path}.tmp`, JSON.stringify({ runId: fixtures.runId, created: fixtures.created }), { mode: 0o600 });
  renameSync(`${path}.tmp`, path);
}

export async function cleanupFixtureManifest(runId: string) {
  assertIsolatedTarget(isolatedTargetFromEnv());
  const path = manifestPath(runId);
  if (!existsSync(path)) return;
  const manifest = JSON.parse(readFileSync(path, "utf8")) as FixtureManifest;
  if (manifest.runId !== runId || !manifest.created) throw new Error("Invalid fixture manifest.");
  for (const kind of ["users", "agents", "properties", "leads"] as const) {
    if (!Array.isArray(manifest.created[kind]) || !manifest.created[kind].every(id => uuid.test(id))) throw new Error("Invalid fixture IDs.");
  }
  if (!Array.isArray(manifest.created.files) || !manifest.created.files.every(path => manifest.created.properties.some(id => path === `${id}/${runId}.pdf`))) throw new Error("Invalid fixture file paths.");
  await cleanupTestFixtures(manifest);
}

export function isolatedAdmin(): SupabaseClient {
  assertIsolatedTarget(isolatedTargetFromEnv());
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing isolated service key.");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

function checked(error: { message: string } | null) {
  if (error) throw new Error(`Isolated fixture operation failed: ${error.message}`);
}

export async function createTestFixtures(runId = randomUUID()): Promise<TestFixtures> {
  const client = isolatedAdmin();
  const created: TestFixtures["created"] = { users: [], agents: [], properties: [], leads: [], files: [] };
  const fixtures = { runId, created } as TestFixtures;
  try {
    const actors: TestActor[] = [];
    for (const kind of ["admin", "agentA", "agentB", "inactive"] as const) {
      const email = `bc-${runId}-${kind.toLowerCase()}@example.test`;
      const password = randomBytes(24).toString("base64url");
      const { data, error } = await client.auth.admin.createUser({ email, password, email_confirm: true });
      checked(error);
      const id = data.user!.id;
      recordFixture(fixtures, "users", id);
      const role = kind === "admin" ? "admin" : "agent";
      const agentId = role === "agent" ? randomUUID() : null;
      if (agentId) {
        checked((await client.from("agents").insert({ id: agentId, full_name: `Fixture ${runId} ${kind}`, email })).error);
        recordFixture(fixtures, "agents", agentId);
      }
      checked((await client.from("admin_profiles").insert({ id, email, full_name: `Fixture ${kind}`, role, agent_id: agentId, is_active: kind !== "inactive" })).error);
      actors.push({ id, email, password, role, agentId });
    }
    [fixtures.admin, fixtures.agentA, fixtures.agentB, fixtures.inactive] = actors;
    fixtures.propertyA = randomUUID(); fixtures.propertyB = randomUUID();
    for (const [id, actor] of [[fixtures.propertyA, fixtures.agentA], [fixtures.propertyB, fixtures.agentB]] as const) {
      checked((await client.from("properties").insert({ id, slug: `fixture-${id}`, title: `Fixture ${runId}`, description: "Inmueble sintético exclusivo para pruebas aisladas.", property_use: "Residencial", property_type: "Casa", business_type: "Venta", price: 1000000, currency: "MXN", status: "Available", address: "Zona de pruebas", is_project: false, is_assignment: false, is_featured: false })).error);
      recordFixture(fixtures, "properties", id);
      checked((await client.from("property_agents").insert({ property_id: id, agent_id: actor.agentId })).error);
    }
    fixtures.leadA = randomUUID(); fixtures.leadB = randomUUID();
    for (const [id, actor] of [[fixtures.leadA, fixtures.agentA], [fixtures.leadB, fixtures.agentB]] as const) {
      checked((await client.from("leads").insert({ id, full_name: `Fixture lead ${runId}`, email: `lead-${id}@example.test`, source: "organic", status: "new", assigned_agent_id: actor.agentId, privacy_accepted: true })).error);
      recordFixture(fixtures, "leads", id);
    }
    fixtures.documentPath = `${fixtures.propertyA}/${runId}.pdf`;
    const bucket = await client.storage.getBucket("secure-brochures");
    if (bucket.error) checked((await client.storage.createBucket("secure-brochures", { public: false, allowedMimeTypes: ["application/pdf"], fileSizeLimit: 15 * 1024 * 1024 })).error);
    checked((await client.storage.from("secure-brochures").upload(fixtures.documentPath, Buffer.from("%PDF-1.4\n% isolated-fixture\n%%EOF"), { contentType: "application/pdf" })).error);
    recordFixture(fixtures, "files", fixtures.documentPath);
    checked((await client.from("properties").update({ documents: [{ id: "fixture-document", label: "Ficha de prueba", type: "Ficha técnica", bucket: "secure-brochures", path: fixtures.documentPath }] }).eq("id", fixtures.propertyA)).error);
    return fixtures;
  } catch (error) {
    try { await cleanupTestFixtures(fixtures); } catch { /* Preserve the initiating failure; rerun cleanup using the run's recorded IDs. */ }
    throw error;
  }
}

export async function cleanupTestFixtures(fixtures: FixtureManifest): Promise<void> {
  const client = isolatedAdmin();
  const { created } = fixtures;
  if (created.files.length) checked((await client.storage.from("secure-brochures").remove(created.files)).error);
  if (created.users.length) checked((await client.from("audit_logs").delete().in("actor_profile_id", created.users)).error);
  if (created.leads.length) checked((await client.from("leads").delete().in("id", created.leads)).error);
  if (created.properties.length) checked((await client.from("properties").delete().in("id", created.properties)).error);
  for (const id of created.users) {
    const { error } = await client.auth.admin.deleteUser(id);
    if (error && error.status !== 404) checked(error);
  }
  if (created.agents.length) checked((await client.from("agents").delete().in("id", created.agents)).error);
  rmSync(manifestPath(fixtures.runId), { force: true });
}
