# Revenex — Local Setup Guide

## Requirements

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20 or 22 | https://nodejs.org |
| pnpm | latest | `npm install -g pnpm` |

---

## Step 1 — Get a free PostgreSQL database (2 minutes)

1. Go to **https://neon.tech** and sign up (free)
2. Create a new project → name it `revenex`
3. Click **"Connection string"** → copy the full URL
   (looks like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)

---

## Step 2 — Set your database URL

Open **`artifacts/api-server/.env`** and replace the placeholder on line 8:

```
DATABASE_URL=postgresql://paste-your-connection-string-here
```

SESSION_SECRET and all other values are already filled in.

---

## Step 3 — Install dependencies

```
pnpm install
```

---

## Step 4 — Push the database schema

```
pnpm --filter @workspace/db run push
```

Creates all 4 tables (users, reviews, contacts, demo_requests). Must succeed before starting the server.

---

## Step 5 — Start the backend (Terminal 1)

Run from the root `revenex-final` folder:

```
pnpm --filter @workspace/api-server run dev
```

Wait until you see:
```
Server listening   port: 8080
Admin user verified and password synced
```

---

## Step 6 — Start the frontend (Terminal 2)

Open a **second terminal** in the same root folder:

```
pnpm --filter @workspace/revenex run dev
```

Open **http://localhost:5173** in your browser.

> IMPORTANT: Both terminals must be running at the same time. The frontend proxies all `/api` calls to port 8080. If the backend isn't running you will see ECONNREFUSED errors.

---

## Admin panel

URL: **http://localhost:5173/admin**
Email: `team@revenex.in`
Password: `Revenex@2205`

---

## Optional extras

Edit `artifacts/api-server/.env` to enable:

| Feature | Key | Get it from |
|---------|-----|-------------|
| Email notifications | `RESEND_API_KEY` | https://resend.com (free tier) |
| AI chatbot | `OPENROUTER_API_KEY` | https://openrouter.ai (free) |

The app works without these — emails just skip silently and the chatbot returns a 503.

---

## Google Sign-In (one-time setup)

1. Go to https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Under **Authorized JavaScript origins** → click **+ ADD URI** → add `http://localhost:5173`
4. Click **SAVE** — wait 5 minutes, then refresh

Your `VITE_GOOGLE_CLIENT_ID` is already set in `artifacts/revenex/.env.local`.

---

## Useful commands

```
# Full TypeScript check
pnpm run typecheck

# Regenerate API hooks (after editing openapi.yaml)
pnpm --filter @workspace/api-spec run codegen

# Test API health
curl http://localhost:8080/api/healthz
```
