import { createServerClient } from "@supabase/ssr";
import { request, type APIRequestContext } from "@playwright/test";
import { assertIsolatedTarget, isolatedTargetFromEnv } from "./isolated-target";
import type { TestActor } from "./isolated-fixtures";
import { createHmac } from "node:crypto";

export async function actorRequest(actor?: TestActor, options: { expiredAccess?: boolean; invalidRefresh?: boolean } = {}): Promise<APIRequestContext> {
  assertIsolatedTarget(isolatedTargetFromEnv());
  const cookies: { name: string; value: string }[] = [];
  if (actor) {
    const auth = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      cookies: { getAll: () => [], setAll: values => { cookies.splice(0, cookies.length, ...values.map(({ name, value }) => ({ name, value }))); } },
    });
    const result = await auth.auth.signInWithPassword({ email: actor.email, password: actor.password });
    if (result.error) throw new Error(`Isolated login failed: ${result.error.message}`);
    if (options.expiredAccess) {
      const secret = process.env.BLACK_CAPITAL_TEST_SIGNING_SECRET;
      if (!secret) throw new Error("Local signing key required to exercise session expiry.");
      const session = { ...result.data.session! };
      const parts = session.access_token.split(".");
      const payload = { ...JSON.parse(Buffer.from(parts[1], "base64url").toString()), exp: Math.floor(Date.now() / 1000) - 3600 };
      const input = `${parts[0]}.${Buffer.from(JSON.stringify(payload)).toString("base64url")}`;
      session.access_token = `${input}.${createHmac("sha256", secret).update(input).digest("base64url")}`;
      session.expires_at = payload.exp;
      if (options.invalidRefresh) session.refresh_token = "invalid-local-refresh-token";
      // Encode the real SSR session shape, replacing only the tokens under test.
      const name = cookies[0].name.replace(/\.\d+$/, "");
      cookies.splice(0, cookies.length, { name, value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}` });
    }
  }
  return request.newContext({
    baseURL: "http://127.0.0.1:3100",
    storageState: { cookies: cookies.map(cookie => ({ ...cookie, domain: "127.0.0.1", path: "/", expires: -1, httpOnly: false, secure: false, sameSite: "Lax" })), origins: [] },
  });
}
