import { cleanupTestFixtures, createTestFixtures, isolatedAdmin } from "./isolated-fixtures";

export default async function setup() {
  const fixtures = await createTestFixtures();
  const { error } = await isolatedAdmin().from("properties").update({ created_at: new Date(Date.now() + 1000).toISOString() }).eq("id", fixtures.propertyA);
  if (error) { await cleanupTestFixtures(fixtures); throw new Error("Cannot select the documentary fixture for public regression."); }
  return async () => { await cleanupTestFixtures(fixtures); };
}
