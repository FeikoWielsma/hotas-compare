# Site status — 2026-10-31

The public catalog, product and brand pages, comparison, regional pricing,
search, setup guide and tier lists are live. The site is static and hosted on
Cloudflare Pages. Current YAML overrides any count in this file.

## Editorial model

The site publishes no verdicts of its own. The maintainer does not own enough
of the hardware for them to be credible, so all 66 verdicts were removed from
the content, schema and UI on 2026-10-31. Git history has the text.

- Fit scores come from shared tier lists. They rank the catalog and drive the
  wizard.
- External reviews from trusted reviewers such as Mysh appear on cards and
  product pages, and the wizard names them as a reason for a pick. A review tag
  breaks ties in the catalog rank; it does not change wizard scores.

## Scope

Complete products and bundles people actually buy come first. Modules, panels
and passive accessories (extensions, mounts, cams) wait until that is done.

## Next priorities

1. **Sign off specifications.** 310 products are still draft, and 18 verified.
2. **Finish the remaining complete-product inventories.** The T.Flight HOTAS 4
   and One family, MOZA MTP and MTQ, and Honeycomb Echo stay partial because
   exact sources do not settle them. Keep those facts unknown until they do.
3. **Decide on production editing.** `/keystatic` returns 404 because Pages
   serves only the static build, so no server routes exist there. The local dev
   server serves `/keystatic`. Production editing needs a
   move to Cloudflare Workers, or Pages Functions, plus a GitHub app and its
   secrets, all outside the repository.
4. **Fill fit gaps.** The 46 modules have no fit scores, which is acceptable
   until panels are in scope.
5. **Review the 8 products with no price** (6 are still sold). Do not fill
   prices with currency conversions or related-product prices.

## Automation

- `.github/workflows/ci.yml` runs `pnpm check`, `pnpm test` and `pnpm build` on
  pushes to `main` and on pull requests. Pages deploys independently of it, so
  a failed run warns but does not block a release.
- `.github/workflows/price-refresh.yml` opens a weekly price pull request. Its
  only recorded run failed on a missing `.nvmrc`, which now exists. It has not
  yet run successfully.
- `src/lib/content-checks.test.ts` rejects unsourced superlatives in catalog
  text.
