import { cleanupTestFixtures, createTestFixtures } from "./isolated-fixtures";

export default async function setup() {
  const fixtures = await createTestFixtures();
  return async () => { await cleanupTestFixtures(fixtures); };
}
