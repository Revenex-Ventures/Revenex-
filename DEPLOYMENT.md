# Revenex deployment and verification

## Current live-site diagnosis

The checks made during this repair found:

- `https://revenex.in/api/healthz` and the `www` equivalent return the SPA HTML, not JSON. Static hosting is swallowing API requests; POST requests consequently fail with 405.
- The old Railway endpoint returns `Application not found`.
- The old Cloudflare redirect points at a Firebase project different from `.firebaserc`. No working API was found there.
- The configured PostgreSQL connection timed out during a read-only connection check. A reachable database connection is still required before production can be considered operational.

These are deployment problems; rebuilding the frontend alone does not resolve them.

## Prepared deployment: Vercel frontend and API together

Deploy from the **repository root** with the existing `vercel.json`. The Node function at `api/[...path].js` loads the compiled Express app bundle. It serves `/api/*` inside the same deployment as the Vite frontend; it does not proxy credentials to an external backend. Client-side pages retain their SPA fallback. The function has a 30-second timeout; provider requests have shorter timeouts.

Set these in the deployment's environment settings:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Reachable PostgreSQL database containing the four schema tables |
| `SESSION_SECRET` | Random secret of at least 32 characters; use 32 random bytes encoded as hex |
| `APP_URL` | Public website origin, for example `https://www.revenex.in`; set it to the actual deployment URL when testing a preview |
| `GOOGLE_CLIENT_ID` | Backend Google OAuth web client ID |
| `VITE_GOOGLE_CLIENT_ID` | The **same** OAuth client ID, available during frontend build |
| `RESEND_API_KEY` | Email provider key |
| `FROM_EMAIL` | Sender verified with the email provider |
| `OPENROUTER_API_KEY` | Server-side chatbot provider key |
| `TRUST_PROXY_HOPS` | Trusted reverse-proxy hop count; use `0` locally and configure for the actual hosting path |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used only by the explicit admin bootstrap command |

Never put secret provider keys or `SESSION_SECRET` in a `VITE_*` variable. `.env.example` files list local options without secret values.

In Google's OAuth settings, authorize the exact website origin, including `www` if it is used. Google sign-in submits a signed ID token, which the backend verifies for signature, audience, issuer, expiration and verified email. New Google accounts receive the user role. Existing administrators keep the role already stored in the database. Client-submitted names, emails and Google IDs cannot grant access.

Use a PostgreSQL URL with the provider's required TLS settings. Provision the schema before accepting users. With `DATABASE_URL` set in your shell, run `pnpm --filter @workspace/db push` against the intended database and review the proposed changes. Do not use `push-force` against production.

To create a missing initial administrator, with backend environment variables loaded:

```sh
pnpm --filter @workspace/api-server bootstrap:admin
```

Bootstrap requires an admin password of 12–72 UTF-8 bytes. It never overwrites an existing account's password or promotes an existing user. The standalone local server also attempts bootstrap on startup; the Vercel entry does not. Existing credentials remain unchanged by these repairs.

After deployment, verify:

1. `/api/healthz` returns JSON `{ "status": "ok" }`.
2. `/api/readyz` returns JSON `{ "status": "ready" }`; it checks all four database tables.
3. A normal signup/login restores the session after refresh. Google sign-in uses the same client ID on both sides.
4. Contact and demo submissions appear in the admin panel. Review submissions remain hidden until approved.
5. Reset emails arrive, their links point at the public origin, and a consumed reset link cannot be reused.
6. Chat answers through `/api/chat`. Provider keys never appear in browser requests or bundles.

The custom domain still needs to point to this deployment. The current Cloudflare **static-only** deployment does not run the Node backend. No domain, hosting account or live database was changed by this repair. The obsolete external API redirects were removed from the prepared Vercel configuration.

## Local use

Use Node 22.9+ and pnpm 10.33.4. Copy the backend and frontend `.env.example` files into `.env` and `.env.local`, respectively, and supply real local settings. PostgreSQL can be run with the existing Docker Compose file when Docker is available. The database push command reads `DATABASE_URL` from the shell.

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

Frontend: `http://localhost:5173`. Backend: `http://localhost:8080`. The Vite server proxies `/api` locally.

## Verification and remaining operational requirements

```sh
pnpm run typecheck
pnpm test
pnpm run build
```

The HTTP regression suite uses an isolated PostgreSQL emulator and locally generated Google test signatures. Email and AI providers are mocked; tests never send email or modify the live database. It covers all implemented route groups, validation, moderation, admin permissions, password-reset replay and session invalidation, provider failures, bounded chat history and throttling. These tests do not certify live OAuth-console settings, provider keys, sender verification or database reachability.

The initial release uses per-process rate-limit counters and bounded chat memory. For multiple production instances, configure hosting-level rate limits or a shared rate-limit store; chat history is best-effort and may reset on a cold start. Rotate any credentials that were previously committed or exposed. Existing sessions and reset links from older releases must be renewed because the session format and reset-token storage have changed.

The browser-extension font warning in the supplied logs belongs to the Adobe extension. The application changes address the API failures and Google sign-in; they do not modify browser extensions.

## Brand artwork

The shared `BrandLogo` component uses scalable RV mark and geometric wordmark artwork redrawn from the supplied business card, with navy, light blue and gold variants. It is used in the navigation, preloader, account pages, footer, admin, and product showcases. Artwork lives in `artifacts/revenex/public/brand`; the favicon uses the same identity. Body typography is kept separate from the vector wordmark so font loading cannot change the logo.
