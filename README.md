# Bilal Runtime

Portfolio for Bilal Zahid, positioned as an LLM Infrastructure / Agentic AI / AI Platform engineer. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Motion, and React Flow. The site is designed to feel like one of Bilal's AI systems, not a resume on the web.

## Local development

Requires Node 20+ and pnpm (pinned via `packageManager`; enable with `corepack enable`).

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint
```

## Environment

Copy `.env.example` to `.env.local` and set values as needed.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin for SEO metadata, `sitemap.xml`, `robots.txt`, Open Graph and JSON-LD. Set to the real domain once live. |

If unset on Vercel, the app automatically falls back to the deployment's own URL (`VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`), and finally to a placeholder domain.

## Deploy on Vercel

Vercel auto-detects Next.js; no custom build command is needed.

1. Import the repo at [vercel.com/new](https://vercel.com/new). Root directory: this project folder.
2. Framework preset: **Next.js**. Build command `next build`, output handled automatically. Package manager: pnpm (from the lockfile / `packageManager` field).
3. Set the environment variable `NEXT_PUBLIC_SITE_URL` (Production) to the public origin, e.g. `https://bilalzahid.vercel.app` (or a custom domain once one is added under Project → Settings → Domains).
4. Deploy. `@vercel/analytics` reports automatically once deployed.

Notes:
- `vercel.json` sets the framework and long-cache headers for `/resumes/*` (the resume PDF).
- Output is intentionally **not** `output: "export"`, so `next/image`, dynamic OG, and SSG/ISR all work.
- Skill logos load from the Simple Icons CDN via plain `<img>` (no `next/image` remote config needed).
