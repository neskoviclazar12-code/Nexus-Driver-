# Nexus Driver Solutions

Updated Astro website with the supplied Nexus logo, Sublima headings and Urbane body text.

## Run locally

    npm ci
    npm run dev

## Build

    npm run build
    npm run preview

The included `dist/` directory is the static build. Host that directory using a static web host; use a web server, not file://, for local review. Source files are included for further changes. No hosting account or domain has been changed.

## Activate email delivery (Vercel + Resend)

All driver applications and carrier inquiries go to **info@nexusdrivers.com**. A separate receipt goes to the email submitted by the visitor. The administrator can reply directly to the applicant; the applicant can reply to info@nexusdrivers.com.

1. Deploy the full project root to Vercel, not only `dist/`. The `api/contact.js` function is required. Static-only hosting does not provide email delivery.
2. In Resend, add and verify `nexusdrivers.com` using the exact DNS records Resend supplies. Keep existing Google Workspace receiving MX records intact. Do not guess DNS values.
3. Create a sending API key in Resend. Add `RESEND_API_KEY` as a server-side secret in the Vercel project environment settings. Do not put it in source files, browser code or a PUBLIC_ variable.
4. Set `RESEND_FROM_EMAIL` to `Nexus Driver Solutions <info@nexusdrivers.com>` (the default), after domain verification.
5. Redeploy and send a controlled test from each form. Check both the admin inbox and the visitor inbox, including spam, plus the Resend delivery logs. These end-to-end checks have NOT been run in this package.
6. For the FMCSA company search on `/carriers/book-a-call/`, register for a free WebKey at https://mobile.fmcsa.dot.gov/QCDevsite/ and add it as `FMCSA_WEBKEY` (server-side) in Vercel. Without it the page still works: carriers enter their DOT number manually and get a link to FMCSA SAFER.

The UI shows success only after the email provider accepts both emails. Acceptance is not a guarantee of inbox delivery; bounces and delivery failures must be checked in the provider dashboard. Missing credentials or provider failures display an error and preserve the completed form. The form does not fall back to opening the visitor's email app.

The server validates fields, includes the job selection and optional SMS choice in the admin message, rejects honeypot submissions, and reuses an idempotency key for unchanged retries for the provider's 24-hour window. It does not store a CRM record. Use host-level rate limits/spam protection for a public launch.

For local UI review use `npm run dev`; this Astro server does not serve Vercel functions. Test the full endpoint using Vercel's local or deployed runtime. Run `node --test tests/contact.test.js` for the isolated server tests, which do not send real mail.

Official setup references:
- https://resend.com/docs/dashboard/domains/introduction
- https://resend.com/docs/api-reference/emails/send-batch-emails
- https://vercel.com/docs/functions/runtimes/node-js

## Changes

- Oct 2026: new NEXUS wordmark (header/footer) and X-symbol favicon; lighter headline type (Urbane DemiBold instead of Sublima ExtraBold); "Trusted by 30+ carriers"; 9-step "Book a 15-min call" flow with FMCSA lookup (`api/fmcsa.js`) sent as a `call_request` email.

- Carrier-focused hero with a secondary route for drivers.
- Carrier section placed first, followed by an About section and driver content.
- Real supplied brand assets and locally hosted fonts.
- Mobile menu retains all links; video playback control and reduced-motion support.
- Three featured jobs on the homepage; all ten offers remain in the jobs directory.
- Server email handler sends an admin notification and applicant receipt, once activated.
- No invented testimonials, metrics, phone number or team portraits.

## Validation

Production build: 17 pages. Browser checks at desktop 1440px and mobile 390px: navigation toggle, job filter counts, job preselection, fallback button. No browser JavaScript errors in checked flows; no horizontal overflow on checked homepage. Email handler tests cover both form types, destinations, replies, validation, retry idempotency and provider failure using mocked network responses. Actual email delivery and booking remain unconnected and untested.

`review/` contains desktop and mobile screenshots. The hero footage is still the supplied low-resolution clip.
