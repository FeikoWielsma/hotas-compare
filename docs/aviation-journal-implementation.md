# Aviation Journal implementation plan

Status: implemented and verified.

## Design reference

Use the Aviation Journal concept in `work/aviation-design-styles.html` (the `journal` variant). It is the selected direction. Keep its warm paper, ink blue, burnt orange, condensed editorial headlines, printed-photo treatment, and restrained hangar stripes. Body text, product names, forms, specifications, and navigation use readable proportional sans-serif type. Avoid cockpit telemetry, glowing panels, reticles, tiny monospaced labels, and military mission language.

## Shared design contract

- Display font: Barlow Condensed, weights 600–700. Body: DM Sans, weights 400–700. Display type belongs in page and section headings, not product names or data tables.
- Default palette: paper `#f5f2e9`, ink `#172e42`, muted text `#586875`, orange `#bf421f` (accessible text and primary buttons), orange highlight `#ed7044`, white-paper panels `#fffdf7`, photo ground `#e8e8de`, rules `#d6d8d2`.
- Retain a deliberate optional dark appearance, with readable paper-colored type and warm orange highlights. Default to the approved light appearance; preserve an explicitly stored theme preference.
- New semantic CSS tokens: `--font-display`, `--font-sans`, `--color-paper`, `--color-ink`, `--color-muted`, `--color-accent`, `--color-accent-soft`, `--color-rule`, `--color-surface`, `--color-photo`, `--color-navy`, `--color-on-navy`. Existing cockpit tokens remain compatibility aliases while components adopt the shared palette. `--font-mono` aliases the body font; no visible monospace styling remains.
- Layout: restrained square or gently rounded surfaces, thin divider rules, generous readable spacing, strong hierarchy. Keep familiar hardware icons where useful. Decorative stripes are limited to hero/brand treatments.
- Tone: independent hardware journal, made by enthusiasts. Use “catalog,” “setup,” “compare,” “recommendations,” and “help me choose.” Retain exact domain terminology where it describes real hardware.

## Work packages and ownership

1. Lead: shared tokens and reset, font loading, header/footer, homepage hero and catalog introduction, favicon, shared region/search controls. Make the reference concrete before final integration.
2. Sol: catalog and comparison surfaces — `CatalogFilter.svelte`, `ProductCard.svelte`, `CompareView.svelte`, `CompareTray.svelte`, `AddCompare.svelte`, `pages/compare.astro`. Preserve filtering, regional pricing, inventory information, persistent comparison, URL sharing, four-item limits, and keyboard access.
3. Sol: setup wizard — `Wizard.svelte`, `pages/wizard.astro`. Restyle every step, results and manifest with the journal language. Preserve recommendations, budget validation, serialized URLs, simulations, regional settings, and existing-pedals behavior.
4. Luna: product and bundle details, brand pages, 404, and `ControlInventory.svelte`. Preserve all data, source links, structured metadata, pricing caveats and inventories; make long specs readable and mobile-safe.

All agents share the current checkout so they can see the approved, uncommitted icons and existing work. Each agent edits only its assigned files. No content/data migrations, commits, pushes, or deployment are required. Preserve `random_img_dump/` and all mockups.

## Implementation sequence

1. Record this plan and ownership; distribute the same design contract and reference to each agent.
2. Implement shared foundation and page shell while the three independent work packages proceed.
3. Integrate all changes; audit remaining cockpit copy, font declarations, hard-coded colors, and component inconsistencies.
4. Run `pnpm run check`, `pnpm test`, and `pnpm run build` sequentially to avoid development cache contention.
5. Use the background dev server (`pnpm exec astro dev --background`) for browser checks. Inspect desktop and mobile catalog, detail, brand, comparison and wizard screens; verify light/dark appearances, search modal, category filters, region changes and compare tray. Exercise wizard steps and a shared results URL.
6. Fix material regressions, repeat only affected checks, then report the final outcome and any remaining limitations.

## Acceptance criteria

- The homepage visibly matches Aviation Journal: navy editorial hero, orange condensed headline, framed real product photo, restrained stripe, warm paper catalog.
- Every public route and shared overlay belongs to the same visual system, with readable body/product/specification text.
- Default light appearance and optional dark appearance are coherent; mobile pages do not overflow except intentional scrollable spec/comparison tables.
- Existing catalog/search, regional prices, comparison persistence/sharing, detail data and wizard rules work unchanged.
- Type checks, relevant existing tests, production build and representative browser checks pass. Record any pre-existing warnings separately.

## Implementation results

- Completed the shared design system, light-first theme behavior, condensed wordmark, journal homepage, navigation/footer, search dialog and region controls.
- Sol completed catalog/cards/comparison/tray and the full setup wizard; Luna completed detail, brand, inventory and error surfaces. The lead integrated typography, dark-theme contrast, hero links and breadcrumbs.
- `pnpm run check`: 0 errors, 0 warnings; four existing Zod deprecation hints.
- `pnpm test`: all 34 tests across six files passed.
- `pnpm run build`: passed, including Pagefind indexing of 149 pages. Existing dependency bundle warnings and the local Node 24 versus declared Node 26 engine warning remain.
- Browser checks passed for catalog category filtering, EU/US price changes, search and Escape dismissal, persistent comparison, four-item limits, highlighted differences, mobile table scrolling, component/bundle inventories, brand pages, light/dark themes, every wizard step, invalid-budget blocking, recommendations and shared-result URL restoration.
- Mobile checks found no page-level horizontal overflow. Comparison/pricing tables retain intentional scrolling inside their own containers. Confirmed product names use DM Sans.
- No deployment, content migration or catalog-data changes were made. Earlier mockups and user image directories were preserved.

## Catalog and visual refinement

- Added persistent Cards, Compact cards, and Detailed rows catalog layouts, using the same product component and filtering/compare state.
- Added handedness, minimum axes, minimum estimated button inputs, component/bundle type, and regional-price-availability filters. Mobile filters are collapsible; active filters and reset controls remain visible. Pure filter tests cover combined requirements, missing numeric data, regional prices, sorting and former brand names.
- Added a consistent set of drawn physical-control icons and six cleaner summary tiles. Removed repeated control-source links, audit notes, coverage/draft badges and deployment status from buyer-facing surfaces. Content evidence stays in source files; product references are collapsed. Non-hands-on verdicts are labeled as specification-based.
- Added reusable BrandMark and JournalHeader components. Seven official manufacturer assets are stored locally with provenance in `public/brands/SOURCES.md`; Logitech, MFG and WinCtrl use initial badges until suitable official artwork is supplied. Brand marks are reused in the directory, profiles, catalog, filters and detail pages.
- Follow-up verification: 38 tests across seven files passed; Astro check passed (existing Zod hints remain); production build and Pagefind indexing passed. Live browser tests confirmed layout persistence, combined filters, regional-price availability and compare actions. Alternate-renderer checks confirmed row/mobile layouts, control icons and brand artwork after the collaborative screenshot tool timed out.
