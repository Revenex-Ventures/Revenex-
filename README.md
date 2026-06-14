# Revenex — Indian School ERP Platform

A full-stack SaaS platform for Indian schools. Manages admissions, attendance, fees, academics, and communications.

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4 + Framer Motion + Wouter
- **Backend:** Node.js + Express 5 + TypeScript
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** JWT (cookie + header) + Google OAuth (`@react-oauth/google`)
- **Email:** Resend API
- **AI Chatbot:** OpenRouter (free models, auto-fallback)

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20.6+ | https://nodejs.org |
| pnpm | 9+ | `npm install -g pnpm` |
| PostgreSQL | 14+ | https://postgresql.org OR use [Neon](https://neon.tech) free tier |

---

## Setup

### 1. Install dependencies

```
pnpm install
```

### 2. Configure environment — fill in `artifacts/api-server/.env`

```env
DATABASE_URL=postgresql://USER:PASS@HOST:5432/revenex
SESSION_SECRET=any-long-random-string
RESEND_API_KEY=re_xxxx
OPENROUTER_API_KEY=sk-or-xxxx
ADMIN_EMAIL=team@revenex.in
FROM_EMAIL=team@revenex.in
PORT=8080
NODE_ENV=development
APP_URL=http://localhost:5173
```

Google OAuth is already configured in `artifacts/revenex/.env.local`. See `GOOGLE-OAUTH-SETUP.md` to add `http://localhost:5173` as an authorized origin.

### 3. Push database schema

```
pnpm --filter @workspace/db run push
```

This creates all tables: `users`, `reviews`, `contacts`, `demo_requests`.

---

## Running Locally

Open **two terminals**:

**Terminal 1 — Backend (port 8080):**

```
cd artifacts/api-server
pnpm run dev
```

**Terminal 2 — Frontend (port 5173):**

```
cd artifacts/revenex
pnpm run dev
```

Open **http://localhost:5173**

> **Windows PowerShell note:** Use separate `cd` and `pnpm run dev` commands on two lines (or two terminals). PowerShell does not support `&&` — use `;` instead if chaining on one line.

### Admin login
- Email: `team@revenex.in`
- Password: `Revenex@2205`

---

## Project Structure

```
artifacts/
  api-server/           Backend (Express, port 8080)
    src/routes/         auth, reviews, contact, demo, chat, admin
    src/lib/            logger, seed (auto-creates admin on startup)
    .env                Fill in your secrets here
  revenex/              Frontend (React + Vite, port 5173)
    src/pages/          16 pages
    src/components/     Navbar, Footer, Chatbot, CursorGlow, etc.
    src/lib/            auth-context, language-context
    .env.local          VITE_GOOGLE_CLIENT_ID (pre-filled)
    vite.config.ts      proxies /api → localhost:8080

lib/
  db/                   Drizzle schema + migrations
  api-spec/             OpenAPI spec (source of truth)
  api-client-react/     Auto-generated React Query hooks
  api-zod/              Auto-generated Zod schemas
```

---

## Useful Commands

```
# Regenerate API hooks after changing lib/api-spec/openapi.yaml
pnpm --filter @workspace/api-spec run codegen

# TypeScript check entire workspace
pnpm run typecheck

# Health check (once backend is running)
curl http://localhost:8080/api/healthz
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | JWT signing secret |
| `RESEND_API_KEY` | Optional | Resend API key — emails won't send without it |
| `OPENROUTER_API_KEY` | Optional | OpenRouter key — AI chatbot returns 503 without it |
| `ADMIN_EMAIL` | Yes | Admin account email (auto-seeded on startup) |
| `FROM_EMAIL` | Yes | Sender address for emails |
| `PORT` | Yes | API server port (8080 for local dev) |
| `APP_URL` | Yes | Base URL for password reset links |
| `VITE_GOOGLE_CLIENT_ID` | Optional | Google OAuth Client ID (pre-filled in .env.local) |

---

## Google OAuth

See `GOOGLE-OAUTH-SETUP.md` for the one-time step to enable Google Sign-In locally.

---

## Free Database Options

- **[Neon](https://neon.tech)** — free PostgreSQL, no credit card required. Copy the connection string into `DATABASE_URL`.
- **[Supabase](https://supabase.com)** — free tier available. Use the "Connection string" (URI format).
- Local PostgreSQL: `postgresql://postgres:password@localhost:5432/revenex`
