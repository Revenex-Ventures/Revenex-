# Local verification — 28 October 2026

The frontend build, workspace TypeScript checks and 23 isolated backend HTTP tests passed. The latest security patch updates qs to 6.16.1. Audit: zero critical, zero moderate, one high finding in node-forge through Expo development tooling; upstream has no published fix. This is not a claim of an attack-proof site.

## Hero and model

The desktop heading and description each occupy two lines. The hero has no forced full-screen height; the partner strip follows the model with reserved clearance. The unrigged student keeps its hand pose. A blended shader deformation turns the head at the neck, with a much smaller body turn, scoped to the intro pointer events. It returns to centre outside the intro and respects reduced-motion preferences. No spotlight or custom cursor is rendered. Home, login and signup now share the same portrait component. Seven module cards move around its perimeter without visible rings, with gentle tilt, depth and warm shadows; a pause control and reduced-motion support are included. Narrow screens use compact module icons to keep the student clear.

## Chatbot

This is improved prompting and curated public knowledge, not model fine-tuning. The shared knowledge source is `lib/api-zod/src/chat-knowledge.ts`. Public FAQs run locally and on the server, without broad substring matching. Unconfirmed pricing, SLAs and deployment guarantees are referred to the team. The assistant cannot book appointments or access school data. Open-ended questions use the configured OpenRouter provider with temperature 0.2 and a 320-token response budget; optional `OPENROUTER_MODELS` chooses up to three approved IDs. Provider failures remain explicit. Provider authentication, permission and account-credit failures stop model fallback immediately and return a generic 503; FAQs remain available. The visitor interface shows a green FAQ availability indicator and a neutral notice when AI replies are unavailable instead of wrongly claiming the whole API is offline, and only marks the assistant AI-powered after an actual successful AI reply. A live check returned HTTP 401 from OpenRouter: the configured key is not accepted. Curated FAQs work; open-ended AI is not yet operational. The prompt is a quality control, not an authorization boundary.

## Logs and security

Useful status and security logs remain enabled. Query strings, raw error stacks, credentials, bodies and private data are excluded from HTTP logs. Regression tests exercise a real failing HTTP request and verify that secrets do not enter log output. The configured database is reachable, the additive `auth_sessions` and `request_limits` migration succeeded, and local health/readiness checks both returned JSON with HTTP 200.

The Three.js Clock deprecation warning remains upstream: the current React Three Fiber release still constructs the deprecated clock. It is a compatibility notice, not a credential leak. We have not suppressed warnings globally. See [Fiber source](https://github.com/pmndrs/react-three-fiber/blob/v9.8.2/packages/fiber/src/core/store.ts) and [Three Clock source](https://github.com/mrdoob/three.js/blob/r185/src/core/Clock.js).

## Before public release

1. Review these local changes. The user has authorized pushing this iteration after verification. Production configuration checks below still apply.
2. Deploy the repository root to the prepared Vercel frontend/API project. Confirm DATABASE_URL and SESSION_SECRET in its environment settings; do not paste secrets into chat.
3. Set GOOGLE_CLIENT_ID in the backend and the identical VITE_GOOGLE_CLIENT_ID at build time. In Google Cloud Console, select the intended project, open APIs & Services → Credentials → the OAuth web client, and authorize the exact public website origin.
4. Attach the public domain to the deployment that serves the API. Currently `https://www.revenex.in/api/healthz` returns HTML rather than API JSON. A successful static frontend deploy does not establish a working API.
5. Check public `/api/healthz` and `/api/readyz` for JSON and HTTP 200, then verify Google sign-in, reset email delivery and a non-sensitive chatbot conversation. Configure provider sender verification and spending limits in their dashboards as needed.
6. Open [OpenRouter Keys](https://openrouter.ai/settings/keys), create a server API key, and set `OPENROUTER_API_KEY` in `artifacts/api-server/.env` locally and in the production backend environment settings. Do not use a VITE variable or paste it into chat. Restart the API, then test an open-ended question. The current key is rejected with HTTP 401.
7. Resolve the remaining Expo/node-forge advisory when an upstream patch is available. Avoid using its certificate tooling on untrusted input in the meantime.

References: [OpenRouter API parameters](https://openrouter.ai/docs/api_reference/overview), [OWASP logging guidance](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), [node-forge advisory](https://github.com/advisories/GHSA-86w9-cpqp-85rv).
