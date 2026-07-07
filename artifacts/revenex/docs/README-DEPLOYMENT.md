# Deployment Documentation

## Purpose
Notes the current build and preview workflow for the frontend app.

## Commands
- pnpm --filter @workspace/revenex build
- pnpm --filter @workspace/revenex typecheck
- pnpm --filter @workspace/revenex dev --host 0.0.0.0

## Important Notes
- The app is expected to remain compatible with Vercel and the existing Vite configuration.
- Verify the preview locally before pushing updates.
