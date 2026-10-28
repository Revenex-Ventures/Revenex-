# Local verification — 28 October 2026

The frontend build, workspace TypeScript checks and 25 isolated backend HTTP tests passed. The latest security patch updates qs to 6.16.1. Audit: zero critical, zero moderate, one high finding in node-forge through Expo development tooling; upstream has no published fix. This is not a claim of an attack-proof site.

## Hero and model

The desktop heading and description each occupy two lines. The hero has no forced full-screen height; the partner strip follows the model with reserved clearance. The unrigged student keeps its hand pose. A blended shader deformation turns the head at the neck, with a much smaller body turn, scoped to the intro pointer events. It returns to centre outside the intro and respects reduced-motion preferences. No spotlight or custom cursor is rendered. Home, login and signup now share the same portrait component. Seven module cards move around its perimeter without visible rings, with gentle tilt, depth and warm shadows; a pause control and reduced-motion support are included. The student stays to the right from 600px upwards. The portrait retains the close lens, and narrow columns use compact cards with every module name visible.

## Chatbot

The user selected FAQ help for now. The website uses shared curated answers directly, shows a green “FAQ help available” indicator, and makes no AI-provider requests. An unsupported question gets an explicit FAQ-scope answer and public team contact information, without an AI connection warning. This mode uses its own session-history key so old connection-error messages are not carried into the new conversation; the previous history remains untouched in its original key.

The API also defaults to FAQ mode. `CHAT_MODE=ai` explicitly opts the backend into provider replies; this does not enable AI in the current FAQ-only website component. A regression test verifies that unknown questions return HTTP 200 and never contact the provider in FAQ mode. Public knowledge, identity and basic help remain shared in `lib/api-zod/src/chat-knowledge.ts`. No pricing, SLA or capabilities are invented. The prior OpenRouter key returned 401; no provider key change is needed for the chosen FAQ mode.

## Logs and security

Useful status and security logs remain enabled. Query strings, raw error stacks, credentials, bodies and private data are excluded from HTTP logs. Regression tests exercise a real failing HTTP request and verify that secrets do not enter log output. The configured database is reachable, the additive `auth_sessions` and `request_limits` migration succeeded, and local health/readiness checks both returned JSON with HTTP 200.

The Three.js Clock deprecation warning remains upstream: the current React Three Fiber release still constructs the deprecated clock. It is a compatibility notice, not a credential leak. We have not suppressed warnings globally. See [Fiber source](https://github.com/pmndrs/react-three-fiber/blob/v9.8.2/packages/fiber/src/core/store.ts) and [Three Clock source](https://github.com/mrdoob/three.js/blob/r185/src/core/Clock.js).

## Before public release

1. Review these local changes. The user has authorized pushing this iteration after verification. Production configuration checks below still apply.
2. Deploy the repository root to the prepared Vercel frontend/API project. Confirm DATABASE_URL and SESSION_SECRET in its environment settings; do not paste secrets into chat.
3. Set GOOGLE_CLIENT_ID in the backend and the identical VITE_GOOGLE_CLIENT_ID at build time. In Google Cloud Console, select the intended project, open APIs & Services → Credentials → the OAuth web client, and authorize the exact public website origin.
4. Attach the public domain to the deployment that serves the API. Currently `https://www.revenex.in/api/healthz` returns HTML rather than API JSON. A successful static frontend deploy does not establish a working API.
5. Check public `/api/healthz` and `/api/readyz` for JSON and HTTP 200, then verify Google sign-in, reset email delivery and a non-sensitive chatbot conversation. Configure provider sender verification and spending limits in their dashboards as needed.
6. Only if AI replies are requested later: open [OpenRouter Keys](https://openrouter.ai/settings/keys), create a server API key, and set `OPENROUTER_API_KEY` in `artifacts/api-server/.env` locally and in the production backend environment settings. Do not use a VITE variable or paste it into chat. Restart the API, then test an open-ended question. The current key is rejected with HTTP 401.
7. Resolve the remaining Expo/node-forge advisory when an upstream patch is available. Avoid using its certificate tooling on untrusted input in the meantime.

References: [OpenRouter API parameters](https://openrouter.ai/docs/api_reference/overview), [OWASP logging guidance](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), [node-forge advisory](https://github.com/advisories/GHSA-86w9-cpqp-85rv).

## Release routing

Cloudflare Pages API entrypoints preserve same-origin cookies and forward only to the fixed first-party Vercel production origin. Regression checks cover POST forwarding, response headers and safe upstream errors. The production build command is `pnpm run build:web`, which checks and builds the web application, API and their libraries; the full workspace build remains in GitHub verification.
