# CLAUDE.md

## Project Overview

LightDetail API - REST API for managing project portfolios, staff, and images.

## Commands

```sh
bun install          # Install dependencies
bun run dev          # Start dev server (port 3001)
bunx drizzle-kit migrate  # Run database migrations
bunx drizzle-kit studio   # Open database GUI
```

## Tech Stack

- Runtime: Bun
- Framework: Hono.js with OpenAPI
- Database: SQLite via Drizzle ORM
- Auth: Better Auth (session-based)
- Validation: Zod schemas

## Code Conventions

### Route Structure

Routes follow this pattern in `src/routes/{resource}/`:
- `{resource}.index.ts` - Router setup and exports
- `{resource}.routes.ts` - Route definitions with OpenAPI schemas
- `{resource}.handlers.ts` - Handler functions with business logic

### Protected Routes

Use `authMiddleware` from `src/middlewares/auth-middleware.ts` for admin-only endpoints:
```ts
.use(authMiddleware({ permission: "project-management" }))
```

### Database

- Schema defined in `src/db/schema.ts`
- Migrations in `src/db/migrations/`
- Access via `db` from `src/db/index.ts`

### Validation

All request/response schemas use Zod with `@hono/zod-openapi` for automatic OpenAPI docs.

## File Locations

- Entry point: `src/index.ts`
- App config: `src/app.ts`
- Environment validation: `src/env.ts`
- Database: `data/dev.db`
- Uploaded images: `data/uploads/`
