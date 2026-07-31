# Revenex — School ERP SaaS Platform (Monorepo)

Revenex is India's leading School ERP SaaS platform, designed specifically to digitize, automate, and streamline K-12 and higher education institutions (supporting CBSE, ICSE, and State Board grading and curricula). This monorepo contains the Express API server backend, the React/Vite frontend application, and shared database configurations.

## Monorepo Project Structure

The codebase is organized as a `pnpm` monorepo workspace:

```
Revenex/
├── artifacts/
│   ├── api-server/        # Node.js/Express API Backend Server
│   │   ├── src/
│   │   │   ├── routes/    # API routes (chat, admin, auth, reviews, contact, etc.)
│   │   │   ├── middlewares/ # Express middlewares (logger, rate-limiting)
│   │   │   ├── lib/       # Utility wrappers (seeding, logger configs)
│   │   │   ├── index.ts   # Main server entrypoint (port listener)
│   │   │   └── app.ts     # Express application configuration
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── revenex/           # React + Vite Web Frontend Application
│   │   ├── docs/          # Frontend developer docs & READMEs
│   │   ├── src/
│   │   │   ├── components/# React UI Components (Navbar, Footer, Chatbot, Testimonials)
│   │   │   ├── pages/     # Page views (Home, About, OurStory, Features, BookDemo)
│   │   │   ├── lib/       # Frontend state contexts & utility modules
│   │   │   ├── App.tsx    # Router setup & query wrappers
│   │   │   └── main.tsx   # React entrypoint hook
│   │   ├── package.json
│   │   ├── vercel.json    # Frontend Vercel deployment overrides
│   │   └── vite.config.ts # Vite compilation configuration
│   │
│   └── revenex-mobile/    # Mobile React Native application (under development)
│
├── lib/                   # Shared libraries
│   ├── db/                # Shared database configuration and Drizzle schema
│   └── integrations/      # Shared third-party API clients
│
├── vercel.json            # Root Vercel routing configuration
├── package.json           # Root package.json managing workspaces
├── pnpm-workspace.yaml    # Workspace configuration (pnpm packages)
└── start.bat              # Command script to launch the full dev stack
```

---

## Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- `pnpm` (Workspace dependency manager)

### Installation
Run the following command from the workspace root to install all dependencies across all packages:
```bash
pnpm install
```

### Running Locally
To launch both the Frontend development server and the API server concurrently:
```bash
pnpm run dev
# OR double-click the helper script in Windows:
start.bat
```
*   **Vite Web Preview**: [http://localhost:5173/](http://localhost:5173/)
*   **API Server Endpoint**: [http://localhost:8080/](http://localhost:8080/)

### Typechecking & Compiling
To compile libraries and verify TypeScript type safety across the entire workspace (all subprojects):
```bash
pnpm run typecheck
```

To build a production-ready bundle of the frontend website:
```bash
pnpm --filter @workspace/revenex build
```

---

## Production Deployment Architecture

Revenex is deployed using a decoupled architecture for maximum speed and scalability:

1.  **Frontend Website (React/Vite)**: Deployed automatically on **Vercel** via GitHub integration.
    - Deployment URL: [https://revenex.in](https://revenex.in)
    - Vercel routes all non-API paths (`/((?!api/).*)`) to `index.html` to support Client-Side routing (Wouter).
    - To prevent white screen crashes, Vercel is configured in `vercel.json` with `"outputDirectory": "artifacts/revenex/dist/public"`.
2.  **Backend API Server (Express/Node)**: Hosted separately on **Railway** with core database synchronization.
    - API Endpoint: `https://workspaceapi-server-production-51b0.up.railway.app`
    - Vercel reverse-proxies `/api/:path*` traffic to the Railway server.

---

## Development Guidelines

1.  **Strict Styling Constraints**: The site uses a luxury, warm-beige design language. Review [README-COLORS.md](file:///c:/VS%20Code/Revenex/artifacts/revenex/docs/README-COLORS.md) before styling.
2.  **No Direct Fallbacks without API Integration**: The Chatbot is configured to default to local client-side API requests via OpenRouter if the API server goes offline, but standard calls must go through the API server route (`/api/chat`).
3.  **Vite Asset Management**: Place all assets (images/logos) inside the `attached_assets` workspace directory and import them using `@assets` alias.
