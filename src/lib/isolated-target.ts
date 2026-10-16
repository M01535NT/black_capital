export interface IsolatedTarget {
  mode?: string;
  url?: string;
  allowedOrigin?: string;
  projectRef?: string;
  allowedProjectRef?: string;
}

/** Local-only by design: an allowlist cannot opt a hosted project into destructive tests. */
export function assertIsolatedTarget(config: IsolatedTarget): void {
  const fail = () => { throw new Error("An explicitly permitted local isolated target is required."); };
  if (config.mode !== "isolated" || !config.projectRef || config.projectRef !== config.allowedProjectRef || config.projectRef === "tewfdfmicifpdecxcpfy") fail();
  let url: URL;
  try { url = new URL(config.url || ""); } catch { return fail(); }
  if (url.protocol !== "http:" || !["127.0.0.1", "localhost"].includes(url.hostname) || url.origin !== config.allowedOrigin || url.username || url.password || url.pathname !== "/" || url.search || url.hash) fail();
}

export function isolatedTargetFromEnv(): IsolatedTarget {
  return {
    mode: process.env.BLACK_CAPITAL_TEST_MODE,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    allowedOrigin: process.env.BLACK_CAPITAL_TEST_ORIGIN,
    projectRef: process.env.BLACK_CAPITAL_TEST_PROJECT_REF,
    allowedProjectRef: "black-capital-isolated",
  };
}
