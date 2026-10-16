import fs from "node:fs";
import { randomBytes, createHmac } from "node:crypto";

const directory = ".superpowers/sdd/2026-10-16-preparacion-black-capital";
fs.mkdirSync(directory, { recursive: true });
const envPath = `${directory}/local-stack.env`;
if (fs.existsSync(envPath)) {
  process.stdout.write("Existing isolated environment retained; no credentials rotated.\n");
} else {
  const secret = randomBytes(48).toString("hex");
  const sign = role => {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify({ role, iss: "supabase", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 * 30 })).toString("base64url");
    const input = `${header}.${payload}`;
    return `${input}.${createHmac("sha256", secret).update(input).digest("base64url")}`;
  };
  const anon = sign("anon"), service = sign("service_role");
  fs.writeFileSync(envPath, `BLACK_CAPITAL_LOCAL_DB_PASSWORD=${randomBytes(24).toString("hex")}\nBLACK_CAPITAL_LOCAL_JWT_SECRET=${secret}\nBLACK_CAPITAL_LOCAL_ANON_KEY=${anon}\nBLACK_CAPITAL_LOCAL_SERVICE_KEY=${service}\n`, { mode: 0o600 });
  fs.writeFileSync(`${directory}/local-status.json`, JSON.stringify({ API_URL: "http://127.0.0.1:54321", ANON_KEY: anon, SERVICE_ROLE_KEY: service, JWT_SECRET: secret }), { mode: 0o600 });
  process.stdout.write("Isolated local configuration prepared; credentials remain in ignored files.\n");
}
