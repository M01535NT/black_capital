import { assertIsolatedTarget, isolatedTargetFromEnv } from "./isolated-target";

export async function sendOperationalRequest(service: "resend" | "whatsapp", url: string, init: RequestInit): Promise<Response> {
  if (process.env.BLACK_CAPITAL_TEST_MODE !== undefined) {
    if (process.env.VERCEL_ENV === "production") throw new Error("Simulated providers are forbidden in production.");
    assertIsolatedTarget(isolatedTargetFromEnv());
    return Response.json({ isolated: true, id: `isolated-${service}`, messages: [{ id: "isolated-message" }] });
  }
  return fetch(url, init);
}
