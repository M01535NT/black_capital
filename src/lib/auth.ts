/**
 * Admin authentication module.
 * Works in both Edge (middleware) and Node.js (API routes) runtimes.
 */

export const AUTH_COOKIE = "bc_admin_session";

/** Derive a session token from the admin password using SHA-256. Works in Edge. */
export async function deriveToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`bc:${password}:v2`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

/**
 * Constant-time string comparison to mitigate timing attacks.
 * Returns true if both strings are byte-identical.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/** Validate a session token format (64 hex chars). Fast check for middleware. */
export function isValidTokenFormat(token: string): boolean {
  return /^[a-f0-9]{64}$/.test(token);
}

/** Full validation: derive expected token from ADMIN_PASSWORD and compare. */
export async function validateSessionToken(token: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const expected = await deriveToken(adminPassword);
  return timingSafeEqual(token, expected);
}

/**
 * Server-component auth guard. Call at the top of admin pages.
 * Redirects to /admin/login if the session is invalid.
 * Only works in Node.js runtime (NOT Edge middleware).
 */
export async function requireAdminSession(): Promise<void> {
  const { cookies } = await import("next/headers");
  const { redirect } = await import("next/navigation");
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE);

  if (!session?.value || !(await validateSessionToken(session.value))) {
    redirect("/admin/login");
  }
}
