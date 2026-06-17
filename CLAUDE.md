# Prayerboard

> This file is kept in sync with `AGENT.md`. Whenever you edit this file,
> mirror the same change into `AGENT.md` in the same turn.

## Tech Stack

- Solid.js + TypeScript, bundled with Vite
- Biome for linting and formatting
- lefthook for git hooks (installed but not yet configured — `lefthook.yml`
  only has example comments)
- pnpm, Node `^24` (see `devEngines` in `package.json`)
- Vitest for testing

## Commands

- `pnpm dev` — start the dev server
- `pnpm build` — type-check (`tsc -b`) then build
- `pnpm check` — Biome check + type-check (no emit)
- `pnpm fix` — Biome auto-fix
- `pnpm test` — run Vitest

Run `pnpm check` before considering any change done.

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
