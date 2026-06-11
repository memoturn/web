# Memoturn web

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

Web surfaces for [Memoturn](https://github.com/memoturn/memoturn), split out of the product
repo (history preserved). The brand and positioning registers (`BRAND.md`, `PRODUCT.md`,
`DESIGN.md`) live here.

pnpm/Turborepo monorepo, deployed to Cloudflare Workers:

- `apps/web` — marketing site (Vite + TanStack) → [memoturn.ai](https://memoturn.ai)
- `packages/ui` — shared design system; tokens at `packages/ui/src/styles/tokens.css`

The docs site (docs.memoturn.ai) lives in the product repo at
[`memoturn/memoturn` `docs/site`](https://github.com/memoturn/memoturn) — moved there so the
published docs evolve in the same repo as the code they describe (tokens.css is vendored
there; keep it in sync when the brand changes).

## Commands

```bash
pnpm install
pnpm dev          # marketing site (:3000)
pnpm build        # production build
pnpm typecheck    # tsc/astro check
pnpm check        # biome lint + format (this repo is biome, not eslint/prettier)
pnpm run deploy   # build + deploy via wrangler ("run" required: bare `pnpm deploy` is pnpm's built-in)
```

## Source of truth

When touching copy or UI: `BRAND.md` (voice + palette), `DESIGN.md`/`DESIGN.json`, and
`PRODUCT.md` are authoritative. All product copy describes the agent-memory database —
positioning comes from `PRODUCT.md`, not from the product repo's docs.
