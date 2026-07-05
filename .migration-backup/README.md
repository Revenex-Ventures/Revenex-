<div align="center">

# REVENEX
### School ERP Platform for India

[![Live](https://img.shields.io/badge/Live-revenex.in-00E5C3?style=flat-square&logo=vercel&logoColor=black)](https://www.revenex.in)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)

</div>

---

Revenex is a cloud-based School ERP that helps Indian schools manage admissions, attendance, fees, academics, and parent communication — all in one place.

**Live → [www.revenex.in](https://www.revenex.in)**

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 · Vite · Tailwind CSS · Framer Motion |
| Backend | Node.js · Express 5 · TypeScript |
| Database | PostgreSQL · Drizzle ORM · Neon |
| Auth | JWT · Google OAuth |
| Email / AI | Resend API · OpenRouter |
| Deploy | Vercel |

---

## Features

- Secure role-based access — Admin, Teacher, Parent
- Fee management with installment tracking
- Attendance logging with automated parent alerts
- AI-powered front-desk chatbot
- Demo booking with email notifications
- Admin dashboard — users, inquiries, reviews

---

## Quick Start

```bash
git clone https://github.com/Revenex-Ventures/Revenex-.git
cd Revenex-
pnpm install
```

Create `artifacts/api-server/.env` with your `DATABASE_URL`, `SESSION_SECRET`, and API keys — see `.env.example`.

```bash
pnpm --filter @workspace/db run push         # create DB tables
pnpm --filter @workspace/api-server run dev  # backend  → :8080
pnpm --filter @workspace/revenex run dev     # frontend → :5173
```

> ⚠️ Never commit `.env` files or real credentials to GitHub.

---

© 2025 Revenex Ventures · [team@revenex.in](mailto:team@revenex.in)

> *"We didn't build this to follow trends — we built it to set standards."* — Prasanna