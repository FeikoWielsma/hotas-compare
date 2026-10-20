# Catalog hillclimb handover

Saved 2026-10-20. Catalog: 247 components, 73 bundles (320 products). `pnpm check`, 45 tests and `pnpm build` pass.

## Priorities (user)

Every model of every brand present; at least physical button counts, hat ways/push, axis counts and control types. Weights, dimensions and prices are low priority. Never guess: leave conflicting or silent fields unset and record the reason and source URL.

## Where the research lives

- `docs/research/hillclimb*-*.md`: per-brand evidence notes from each round (1 = first pass, 2 = coverage/counts, 3-5 = variants, visual counts, Luna passes). Current YAML supersedes older notes; notes explain why fields stay unset.
- `docs/research/unknowns-*.md`, `controls-*.md`, `catalog-refresh-*.md`: earlier rounds.
- `docs/catalog-unknowns.md`: audit of remaining gaps per product. Regenerate with `python research-tools/work-archive/catalog_unknowns_audit.py` (it expects its JSON snapshots in `work/`; copy `research-tools/work-archive/*.json` there first).
- `research-tools/work-archive/`: every script, JSON snapshot and text dump used by the agents (download/crop/render helpers per brand, `hotas_scope_audit.py`, `validate_yaml.py`, WINCTRL manual-list JSON, VIRPIL parsed pages). Restore into `work/` (gitignored) to re-run. Downloaded PDFs and rendered PNGs (about 1 GB) are NOT tracked: re-download from the manual URLs cited in the notes.

## Remaining gaps (see audit and notes)

- Control mechanisms nobody itemizes: MOZA MTP 27 switches, WINCTRL HUD buttons / KA-50 tally / ViperAce EX throttle, Honeycomb Echo left cluster and Bravo lever contacts, Logitech Extreme 3D Pro, Flight Instrument Panel, Thrustmaster Quadrant Add-On buttons, Hornet grip.
- Not in catalog: ~70 VKB and many other passive accessories (no accessory category in the schema), Logitech Cessna yoke/trim wheel and Backlit Information Panel (no first-party sale evidence), MOZA AMPCD and FMP18 bundle.
- VKB records are `verification: draft` until every key field traces to official sources.
- Regional prices for many new records, console platform support where unstated, sensors on many products.
- Keystatic: standalone USB and other nullable booleans are checkboxes, which cannot preserve "unknown".

## Working notes

- Delegation: T3 `delegate_task` with explicit models; give each child disjoint brand folders and a notes file; no commits by children. Models used: Claude Haiku 5.5 (high), Cursor Grok 4.7, Antigravity Gemini 3.8 Flash (medium), Codex GPT-6 Luna (high).
- Children can leave a YAML file temporarily invalid and break `pnpm check` for everyone: a stray colon in an unquoted multi-line `notes:` is the usual cause (use `>-`).
- `tsconfig.json` excludes `work/` so scratch scripts do not break `pnpm check`.
- Dev server must run in background mode: `pnpm exec astro dev --background`.
- Turtle Beach support pages need browser shadow-DOM inspection; WINCTRL pages time out often (use the Download Center API); Thrustmaster eshop slugs are best found by browsing from product pages.

## Rounds 6-7 (2026-10-20/21)

Notes: `docs/research/hillclimb6*-*.md`, `hillclimb7*-*.md`, audits `hillclimb6-audit*.md`. Price gaps: 191 -> 104 of 960 product-region slots (`python work/pricegap.py`; counts missing `region:` entries, so discontinued/region-unavailable slots are included).

- Gemini 3.8 Flash set many `push: false`/`backlit: false`/null hardware values from silence. Two audit rounds (Luna, Haiku) removed unsupported ones. Audit every Gemini batch: silence is not evidence for false.
- MFG and SLAW UK/US prices are EUR conversions on the stores and were deliberately removed or left unset. Honeycomb has no GBP store. Do not copy product-page prices when the shop listing disagrees (TCA Sidestick X, Sol-R 2, Captain Pack X UK).
- "Supported Platform: PC" is not an Xbox/PS5 exclusion: keep unknown.
- Still unresolved: MOZA MTP 8 of 27 switches, MTQ 23 vs 31 controls, AY210 13 switches vs ~14 in diagram, MH16 TMS/CMS mechanism, Bravo lever contacts, Switch panel 13 switches, hat way counts on T.Flight/NEO/TCA sidesticks, SKY YOKE controls, Boeing yoke 18-button split, Warthog panel latching switches.
- VKB inventories exhausted from public sources; stays `draft`.
