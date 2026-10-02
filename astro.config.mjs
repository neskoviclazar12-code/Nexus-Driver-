import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { jobsIn } from "./src/data/jobs.ts";

// Pages that are noindex (empty category) or redirects stay out of the sitemap.
const excluded = ["/carriers/book-a-call/"];
if (jobsIn("owner-operator").length === 0) excluded.push("/cdl-jobs/owner-operator/");

export default defineConfig({
  site: "https://www.nexusdrivers.com",
  trailingSlash: "always",
  redirects: { "/carriers/book-a-call/": "/hire-drivers/" },
  integrations: [sitemap({ filter: (page) => !excluded.some((p) => page.endsWith(p)) })],
});
