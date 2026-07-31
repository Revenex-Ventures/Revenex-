# Build & Deployment Documentation

## Purpose
Documents the building pipeline, local development scripts, and deployment configurations on Vercel.

---

## Workspace Scripts Reference

Execute all actions from the repository root:

-   **Install dependencies**:
    ```bash
    pnpm install
    ```
-   **Start development stack**:
    ```bash
    pnpm run dev
    ```
    *Starts the Express API server (localhost:8080) and Vite frontend server (localhost:5173).*
-   **Typecheck files**:
    ```bash
    pnpm run typecheck
    ```
-   **Build frontend production package**:
    ```bash
    pnpm --filter @workspace/revenex build
    ```
    *Compiles all assets and deposits outputs inside `artifacts/revenex/dist/public`.*

---

## Vercel Deployment Architecture

To support client-side routing fallback and serve assets correctly, the Vercel deployments follow strict instructions:

### Build Parameters
- **Root Directory**: repository root (`.`)
- **Build Command**: `pnpm run build`
- **Output Directory**: `artifacts/revenex/dist/public`

### Configuration Files
Vercel configurations are defined in [vercel.json](file:///c:/VS%20Code/Revenex/vercel.json):
1.  **outputDirectory**: Set explicitly to `artifacts/revenex/dist/public` (or `dist/public` in the subfolder config) to direct Vercel's edge server to deploy the correct build outputs.
2.  **Reverse Proxy**: Redirects API routes `/api/:path*` to the Railway-hosted Express backend server.
3.  **SPA Rewrites**: Routes all non-static, non-API files `/((?!api/).*)` back to `/index.html` to avoid 404 errors on browser reloads.
