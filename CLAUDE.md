# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Remindly — a web application with a React frontend and NestJS backend, managed as an Nx monorepo using npm workspaces.

## Commands

```bash
# Run both apps in development (in separate terminals)
npx nx serve backend      # NestJS on http://localhost:3000
npx nx serve frontend     # React/Vite on http://localhost:4200

# Run both simultaneously
npx nx run-many -t serve -p frontend backend

# Build
npx nx build backend
npx nx build frontend

# Format code
npx prettier --write .

# Run tests
npx nx test backend
npx nx test frontend

# Run a single test file
npx nx test backend --testFile=apps/backend/src/app/app.controller.spec.ts

# Run e2e tests
npx nx e2e frontend-e2e
npx nx e2e backend-e2e
```

## Architecture

```
apps/
  backend/        # NestJS app (port 3000)
  backend-e2e/    # Backend e2e tests (Playwright)
  frontend/       # React + Vite app (port 4200)
  frontend-e2e/   # Frontend e2e tests (Playwright)
```

**Backend** (`apps/backend/src/`):
- NestJS with Express adapter
- Global prefix `/api` — all routes are under `http://localhost:3000/api`
- CORS enabled for `http://localhost:4200`
- Structure follows NestJS conventions: `app.module.ts` → `app.controller.ts` → `app.service.ts`
- Tests: Jest (via `@nestjs/testing`)

**Frontend** (`apps/frontend/src/`):
- React 19 + TypeScript + Vite
- Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, no config file needed)
- Vite dev proxy: requests to `/api/*` are forwarded to `http://localhost:3000` — use relative `/api` paths in fetch calls, never hardcode `localhost:3000`
- Entry: `main.tsx` → `app/app.tsx`
- Tests: Vitest for unit/integration, Playwright for e2e

## Key config files

- `nx.json` — Nx workspace config and task pipeline
- `tsconfig.base.json` — shared TypeScript paths
- `apps/frontend/vite.config.mts` — Vite + proxy + Tailwind plugin
- `.prettierrc` — code formatting rules
- `.env` — contains `ANTHROPIC_API_KEY` (never commit)
