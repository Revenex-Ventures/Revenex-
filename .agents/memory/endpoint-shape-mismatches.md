---
name: Endpoint shape mismatches during migration
description: A frontend/backend response-shape mismatch caused a silent auth redirect loop; how it was found and the general lesson.
---

While migrating a React frontend onto an existing Express backend, `/api/auth/login` returned `{token, user: {...}}` but `/api/auth/me` returned the user fields flat (`{id, email, name, role}`, no `user` wrapper). Frontend code written against the `login`/`signup` shape (`data.user.role`) was reused for the `/me` check, so `data.user` was `undefined`, threw, and silently redirected back to `/login` right after a successful login — looked like "login doesn't redirect" but was actually a caught exception in a downstream auth-check effect.

**Why:** Endpoints that seem similar (same resource, same auth concern) are not guaranteed to share a response envelope, especially when ported from separate route handlers. A Playwright/e2e test reported "URL didn't change" when the real behavior was "URL changed then bounced back within ms" — worth re-testing with console.log/debug traces before trusting the first read of a test failure.

**How to apply:** When wiring frontend consumers to backend endpoints (especially during migrations), curl each endpoint individually to confirm the actual JSON shape rather than assuming consistency with a sibling endpoint. If an e2e test reports a navigation/redirect that "doesn't happen," suspect a fast bounce-back (mount → async check → catch → redirect) over a totally inert navigate() call — add temporary console.log traces to distinguish the two before concluding the routing library itself is broken.
