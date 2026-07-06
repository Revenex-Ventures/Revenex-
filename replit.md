# Revenex

A School ERP SaaS marketing site for the Indian K-12/higher-ed market, with visitor-facing marketing pages, auth (email + Google), reviews, contact/demo-request forms, an admin panel, and a support chatbot.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Frontend: `artifacts/revenex` (Vite + React, wouter routing, previewPath `/`)
- API: `artifacts/api-server` (Express, routes in `src/routes/*`, mounted at `/api`)
- DB schema: `lib/db/src/schema/*` (users, reviews, contacts, demo_requests)
- API contract: `lib/api-spec/openapi.yaml` (source of truth; codegen produces `lib/api-zod` and `lib/api-client-react`)
- Seeded admin account: `team@revenex.in` / `Revenex@2205` (created by `seed.ts` on API server startup)

## Architecture decisions

- Frontend fetch calls to `/api/...` are NOT prefixed with `BASE_URL` — the API artifact's own previewPath is `/api`, so relative `/api/...` paths resolve correctly through the proxy as-is.
- Google Sign-In degrades gracefully (shows a disabled placeholder) when `VITE_GOOGLE_CLIENT_ID` is unset — not required for core auth flows.
- Optional features (email via `RESEND_API_KEY`, chatbot via `OPENROUTER_API_KEY`) degrade/return 503 without their env vars set; this is intentional, not a bug.

## Product

- Marketing pages: Home, About, Security, Our Story, Founders, feature detail pages
- Auth: email/password signup+login, Google sign-in (optional), password reset
- Contact form and demo-booking form (stored in DB, visible in admin panel)
- Reviews (public GET, admin moderation)
- Admin panel (`/admin`, admin-role only): stats dashboard, contacts, demos, reviews, users management
- Support chatbot widget

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- When an endpoint like `/api/auth/me` is consumed, verify its actual response shape with curl rather than assuming it matches a sibling endpoint (e.g. `/auth/login`) — a shape mismatch here previously caused a silent redirect bounce back to `/login` right after a successful login.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
