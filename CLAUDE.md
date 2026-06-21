# Prayerboard

> This file is kept in sync with `AGENT.md`. Whenever you edit this file,
> mirror the same change into `AGENT.md` in the same turn.

## Tech Stack

- Solid.js + TypeScript, bundled with Vite + `@cloudflare/vite-plugin`
- Hono for the Cloudflare Worker API (`src/server/`)
- Drizzle ORM + Cloudflare D1 (SQLite) for the database
- Zod for request validation
- Biome for linting and formatting
- lefthook for git hooks (installed but not yet configured — `lefthook.yml`
  only has example comments)
- pnpm, Node `^24` (see `devEngines` in `package.json`)
- Vitest for testing

## Commands

- `pnpm dev` — start the dev server (Vite + miniflare Worker + local D1)
- `pnpm build` — type-check (`tsc -b`) then build
- `pnpm check` — Biome check + type-check (no emit)
- `pnpm fix` — Biome auto-fix
- `pnpm test` — run Vitest
- `pnpm db:generate` — generate Drizzle migrations from schema changes
- `pnpm db:migrate` — apply pending migrations to the local D1 database
- `pnpm db:reset` — wipe local D1 state and re-apply all migrations from scratch
- `pnpm db:seed` — insert sample board + posts into the local D1 (`drizzle/seed.sql`)
- `pnpm dev:fresh` — reset DB, seed, then start dev server (clean-slate shortcut)

Run `pnpm check` before considering any change done.

## Architecture

```
src/
  server/          # Cloudflare Worker (Hono) — tsconfig.server.json
    db/schema.ts   # Drizzle table definitions
    middleware/    # adminAuth (Bearer token check)
    routes/        # public.ts (board/posts), admin.ts (CRUD)
    index.ts       # Hono app entry
    types.ts       # Bindings type (DB, ASSETS, ADMIN_SECRET)
  shared/          # Shared between client and Worker
    types.ts       # Board, Post, CurrentBoardResponse
    schemas.ts     # Zod schemas for API input validation
  pages/           # SPA pages (route-dispatched in App.tsx)
    PublicPage.tsx  # Public board view with optimistic post append
    AdminPage.tsx   # Board management (create / activate / delete)
  api/client.ts    # Fetch wrappers for all API endpoints
  components/      # Board, Note, PostDialog (reused across pages)
  App.tsx          # Path-based routing (/admin/<token> vs /)
```

### Admin access

The entire path segment is the secret token — there is no `/admin/` prefix.

- Local: `http://localhost:5173/dev` (`ADMIN_SECRET=dev` in `.dev.vars`)
- Production: `https://<worker>.workers.dev/<random-secret>`
  (secret set once via `wrangler secret put ADMIN_SECRET`)
- `"/"` → public page; `"/<token>"` → admin page (token forwarded as Bearer header)

### Deployment

Production deploys happen **only via GitHub Actions** (push to `main`).
Never run `wrangler deploy` locally.

Required GitHub Secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### First-time setup (interactive, run locally)

```sh
wrangler login
wrangler d1 create prayerboard   # paste database_id into wrangler.jsonc
pnpm db:generate
pnpm db:migrate
wrangler secret put ADMIN_SECRET  # production random token
```

## Language

- In-code comments, console output, error messages, log messages: English
  only.
- AI-readable config files (CLAUDE.md, AGENT.md, etc.): English only.
- User-facing UI strings (labels, button text, placeholders): Japanese,
  matching the app's audience.

## Code Structure

- Name variables, functions, and files to communicate intent.
- Extract a helper only when used in 3+ places; otherwise inline it.
- One concern per file; split when a file exceeds ~300 lines.
- Delete dead code; never comment it out.
- Prefer Solid's fine-grained reactivity (signals/stores) over duplicating
  state in component locals.

## Testing

- Write tests before or alongside implementation.
- Test observable outcomes and edge cases, not implementation details.
- Each test must be fully self-contained; no shared mutable state between
  tests.

## Dependencies

- Keep `@types/node`'s major version aligned with the `node` range in
  `devEngines` (currently `^24`) rather than chasing the absolute latest
  dist-tag — a newer major often targets a Node runtime this project doesn't
  declare support for.

## Commits

Format:

```
<one-line summary>

<Why: one sentence — motivation or problem>

- <change 1>
- <change 2>
```

- Summary: imperative mood, ≤70 chars, no trailing period, no prefix tags
  (`feat:`, `fix:`, etc.).
- Why line: include only when motivation is not evident from the diff alone.
- Bullets: include only for 2+ distinct changes.
- Never commit secrets (`*.key`, `*.pem`, `credentials*`).
- Never use `--no-verify` or `--amend`; always create a new commit.
