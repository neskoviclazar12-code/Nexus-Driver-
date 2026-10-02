// Tells Google about job pages through the Indexing API (recommended by Google for JobPosting pages).
//   active jobs   → URL_UPDATED
//   inactive jobs → URL_DELETED   (keep the job in jobs.ts with active: false for one deploy, then delete it)
// Run:  GOOGLE_INDEXING_KEY='<service account JSON>' node --experimental-strip-types scripts/google-indexing.mjs
// Setup (once): Google Cloud project → enable "Web Search Indexing API" → service account → JSON key.
// Then add the service account email as an OWNER of the property in Google Search Console.
import { createSign } from "node:crypto";
import { jobs } from "../src/data/jobs.ts";

const SITE = "https://www.nexusdrivers.com";
const raw = process.env.GOOGLE_INDEXING_KEY;
if (!raw) { console.log("GOOGLE_INDEXING_KEY not set, skipping."); process.exit(0); }
const key = JSON.parse(raw);

const b64 = (x) => Buffer.from(typeof x === "string" ? x : JSON.stringify(x)).toString("base64url");
async function token() {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: key.client_email, scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600,
  })}`;
  const sig = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
  });
  if (!res.ok) throw new Error(`OAuth ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
}

const access = await token();
let failed = 0;
for (const job of jobs) {
  const url = `${SITE}/cdl-jobs/${job.slug}/`;
  const type = job.active ? "URL_UPDATED" : "URL_DELETED";
  const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST", headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, type }),
  });
  console.log(`${res.ok ? "OK  " : "FAIL"} ${type.padEnd(11)} ${url}${res.ok ? "" : " → " + (await res.text())}`);
  if (!res.ok) failed++;
}
process.exit(failed ? 1 : 0);
