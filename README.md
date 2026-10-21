# HOTAS Compare

Flight simulation hardware catalog, comparison tool and setup guide at
[hotas.razortek.nl](https://hotas.razortek.nl).

Built with Astro, Svelte, TypeScript, YAML collections, Keystatic and Pagefind.
See [the site status report](docs/site-status.md) for remaining work.

## Development

Use Node >=26.12.0 (`.node-version`) and pnpm 10.33.2.

```sh
pnpm install --frozen-lockfile
pnpm exec astro dev --background
```

Manage the server with `pnpm exec astro dev status`, `pnpm exec astro dev logs`
and `pnpm exec astro dev stop`.

Product YAML is in `src/content/components/` and `src/content/bundles/`.
The validation schema is `src/lib/schema.ts`; the editor schema is
`keystatic.config.ts`. Preserve unknown values and cite exact manufacturer
sources. Research notes live in `docs/research/`.

## Release checks

Run sequentially:

```sh
pnpm check
pnpm test
pnpm build
```

The build creates public pages and `/api/catalog.json` in `dist/client`,
server output in `dist/server`, and the public Pagefind search index.

## Deployment

The existing **Cloudflare Pages GitHub integration** builds pushes to `main`
and publishes the public website. Push validated commits, inspect the commit's
**Cloudflare Pages** check on GitHub, and verify the custom domain's catalog
and assets after it succeeds.

```sh
git push origin main
```

`pnpm deploy` runs `wrangler deploy`, targeting the **Worker** in
`wrangler.json`. This separate deployment path requires Cloudflare
authentication and is not the currently observed Pages release process.
Unifying these paths and enabling production Keystatic server routes remain
open work. A successful static Pages build does not enable the CMS.

The [original plan](docs/implementation_plan.md) and
[research handover](docs/handover-hillclimb.md) provide background. Their
historical counts and hosting assumptions may differ from the current report.
