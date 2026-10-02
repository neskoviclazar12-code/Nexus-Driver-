export const SITE = {
  name: "Nexus Driver Solutions",
  email: "info@nexusdrivers.com",
  phone: "(307) 317-2875",
  phoneHref: "tel:+13073172875",
  phoneE164: "+1-307-317-2875",
  legalName: "Nexus Driver Solutions LLC",
  url: "https://www.nexusdrivers.com",
  instagram: "https://www.instagram.com/_nexusds/",
  facebook: "", // TODO: Facebook page URL
  // The one carrier sign-up flow (FMCSA lookup → fleet questions → call time).
  hireUrl: "/hire-drivers/",
  bookingUrl: "/hire-drivers/",
  // Headline rates shown for categories that have no listing in jobs.ts yet (owner's claim, keep it true).
  categoryClaims: { "owner-operator": 90 } as Record<string, number>,
  // Same-origin server endpoint; API keys remain server-side.
  formWebhook: "/api/contact",
  address: { street: "30 North Gould Street Ste R", city: "Sheridan", region: "WY", zip: "82801", country: "US" },
};
