# Memoturn web

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

Web surfaces for [Memoturn](https://github.com/memoturn/memoturn), split out of the product
repo (history preserved). The brand and positioning registers (`BRAND.md`, `PRODUCT.md`,
`DESIGN.md`) live here.

pnpm/Turborepo monorepo, deployed to Cloudflare Workers:

- `apps/web` — marketing site (Vite + TanStack) → [memoturn.ai](https://memoturn.ai)
- `apps/docs` — docs (Astro Starlight) → [docs.memoturn.ai](https://docs.memoturn.ai)
- `packages/ui` — shared design system; tokens at `packages/ui/src/styles/tokens.css`

## Commands

```bash
pnpm install
pnpm dev          # both apps (marketing on :3000 + docs)
pnpm dev:web      # marketing site only
pnpm dev:docs     # docs site only
pnpm build        # production build of both apps
pnpm typecheck    # tsc/astro check
pnpm check        # biome lint + format (this repo is biome, not eslint/prettier)
pnpm run deploy   # build + deploy both apps via wrangler ("run" required: bare `pnpm deploy` is pnpm's built-in)
```

## Source of truth

When touching copy or UI: `BRAND.md` (voice + palette), `DESIGN.md`/`DESIGN.json`, and
`PRODUCT.md` are authoritative. All product copy describes the agent-memory database —
positioning comes from `PRODUCT.md`, not from the product repo's docs.
