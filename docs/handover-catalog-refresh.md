# Catalog research handover

Saved 2026-10-20, approximately 22:06 Europe/Amsterdam. Workspace: `C:\Users\feiko\hotas-compare`, PowerShell. All changes are uncommitted. User requested this handover because Codex tokens are nearly exhausted; stop launching research until they resume.

## Resume here

1. Preserve the dirty working tree, including preexisting user edits. Read [remaining gaps](catalog-unknowns.md) and [parent integration findings](research/unknowns-parent-integration.md). Current YAML supersedes older research notes.
2. Verify the freshly restarted development server shows current catalog data. Immediately before handover, production output was correct but the long-running dev server displayed an old Flightstick II inventory (zero buttons). I stopped it, removed only generated `.astro/data-store.json`, and restarted with `pnpm exec astro dev --background`. New PID was **36476**, port **4321**. Verification after that restart is still pending.
3. If more research is requested, select exact unresolved fields from the audit and use focused manufacturer manual/diagram passes. Broad passes have diminishing returns. Several apparent unknowns are inapplicable fields or genuine publication gaps; preserve uncertainty and record the source limitation.

Completion for the next verification: Flightstick II displays **16 standalone physical push buttons**, **two lever end contacts per lever**, and its documented hats/ministick/trigger/dial; API has **152 products**, all with platform entries. Production build already has these values.

## User intent and authorization

- Research missing data across the **whole catalog**, using Luna subagents and optionally Claude Haiku 5.5. Browser use is authorized. User explicitly asked to keep researching unknowns; no need to ask permission to continue normal research/edits.
- Remove discontinued original VIRPIL Constellation Alpha Left/Right. **Keep Alpha Prime.**
- Correct Turtle Beach VelocityOne Flight Yoke System photo (previous photo was Flightdeck).
- Add all supplied Turtle Beach, Thrustmaster and SOL-R products; track **PC, Xbox, PS5** compatibility.
- Original Honeycomb Alpha and XPC share the supplied physical control layout; XPC adds four Xbox/navigation buttons and upgrades sensors. Owner supplied a Honeycomb mapping diagram. Its local path is `C:\Users\feiko\.t3\userdata\attachments\cb05f84c-eb02-49b9-8aff-f524515b7c3a-69aa39f6-4211-4c65-8cde-9eb1af160d6a.png`.
- No commit, push, PR or deployment was requested.

## Implemented catalog and UI work

Added the requested 18 products, with downloaded official photos and source notes:

- Turtle Beach: Flightstick II, Dual Throttle, H.O.T.A.S. bundle, Flightdeck.
- Thrustmaster: TCA Sky Yoke; Ace Combat 8 NEO PlayStation and Xbox/PC editions; Warthog MKII and MKII Base; Airbus Add-On Grip; OMNI Extension; T.Flight HOTAS 5 MSFS Edition; Warthog AVA Edition.
- SOL-R: 2 HOSAS bundle, 3 AVA grip, 4 HOTAS bundle, 5 Base, 6 Throttle. Existing Sol-R 1 record also researched.

Original Alpha L/R files are removed and yoke photo is corrected. HOTAS One/4/X were split into exact separate records, preserving the existing HOTAS One ID `thrustmaster/t-flight-hotas-one-x`. Removed the unsupported MOZA **J04** duplicate; exact AY210 bundle now references existing **MFY** handle. Catalog now totals **152** records (151 before the later unknowns research, two HOTAS variants added, one alias removed).

Shared code changes:

- `src/lib/schema.ts`: optional platform compatibility (`pc/xbox/ps5`, supported/unsupported/unknown, sources/notes); optional published `hardware.axis_count`; `lever.button_contacts` for travel-operated contacts; missing standalone USB now resolves to **null**, rather than manufactured `true`.
- `src/lib/platforms.ts`, `catalog.ts`, `catalog-filter.ts`, `CatalogFilter.svelte`, `ProductCard.svelte`, `CompareView.svelte`: platform projection/filter/display and documented zero-axis handling.
- `src/components/PlatformCompatibility.astro` and component/bundle detail pages show platform evidence.
- `control-inventory.ts`: analog controls show continuous travel; lever contacts display separately from standalone physical buttons.
- `derive.ts`: published axis totals take precedence; travel contacts contribute electrical outputs without increasing physical push-button bodies.
- Keystatic includes the new catalog fields. **Remaining editor limitation:** standalone USB is still a checkbox, although the data schema now permits unknown. This deserves a later editor review if preserving unknown through editing is required; other preexisting nullable booleans have similar checkbox limitations.

## Important integrated research outcomes

- Alpha and XPC physical inventories are complete using the owner's diagram; optional click/backlight/switch properties can remain unknown. Original Alpha sensor is unknown; XPC Hall sensor documented. Both have 180-degree roll travel.
- Passive MFG/Slaw accessories had inherited electronics removed. Explicit zero standalone axes display as zero.
- SOL-R manuals visually resolve clickable eight-way hats, ministick and digital scroll wheel; installed grip buttons versus spares; base toggles, eight backlit pads, clickable encoder and four-position selector. SOL-R 6 has **three** standalone action buttons plus one two-position toggle, not four buttons. These physical inventories are complete. Secondary grip trigger behavior remains unknown.
- Flightdeck full product guide loaded through browser shadow DOM. Its full physical inventory is now complete; virtual detents/touchscreen cells are excluded from physical buttons. Combined mass is **2970 g** (1460 stick +1510 throttle). Removed stick-only dimensions from the whole-system field.
- Flightstick II and Dual Throttle official support charts now enumerate physical controls. Parent corrected the agent's separate detent-button entries into `button_contacts: 2` on each relevant lever. Flightstick II physical buttons **16**, Dual Throttle **8**. Optional clicks/stages remain unset unless established.
- New Turtle Beach products now show Add To Cart and are marked current. Dual Throttle Xbox operation requires Flightstick II host. Xbox One wording conflicts between HOTAS bundle and support guides; note records the conflict, Series X|S established. Standalone Dual Throttle product page says **1.9 kg / 273×158×256 mm**, while support/bundle says **1.3 kg / smaller dimensions**; record follows exact standalone product page and notes conflict.
- Bravo official photograph resolved eight autopilot buttons, five-position selector, adjustment knob and separate flap switch. Removed unsupported six-detent group; overall inventory still partial pending lever configuration/contact reconciliation.
- Logitech X52 standard now cites its own manual; stick head has three buttons and throttle two. Yoke and quadrant rockers are recorded as physical rockers, not individual directional buttons. Several old Logitech manuals remain sparse.
- VKB STECS installed controls corrected: spare hat modules are not additional installed hats. SCG 380 g claim removed; 550 g store weight has unclear packed/bare basis. SEM supplied connection is GNX BUS; standalone USB needs optional HID-Main. F-14 grip has DLC plus twist axes. F-14/SEM physical counts complete while optional behaviors remain unknown.
- VIRPIL exact store weights corrected (basis not labeled net/packed): ACE Interceptor 7.85 kg; panels 1/2 1.9/2.3 kg; Hawk-60 350 g; Rotor Plus 1.65 kg. Five unlabeled dimension triples remain in notes, not assigned W/D/H. Hawk-60 unsubstantiated magnetic sensor removed. AEROMAX fixed-stick inventories remain partial due exact revision/mapping identity gaps.
- MOZA AB9 uses an encoder, magnetic subtype unverified; servo motors are actuators. AB9 explicitly excludes consoles. AB6/AY90/MHG and others have platform unknowns where exact evidence is silent. AB9+MH16 has no exact official bundle SKU; prices remain empty. Z-axis resolution conflicts 15-bit/16-bit; parent removed selected numeric resolution rather than choosing the majority wording. Several MOZA sources conflict on counts/dimensions.

## Remaining unknowns and audit

[docs/catalog-unknowns.md](catalog-unknowns.md) contains the precise missing keys for every product, with a summary and links to research. Regenerate using `python work/catalog_unknowns_audit.py`.

Latest raw counts (include optional/inapplicable fields, new physical controls, and scope changes):

| Family | Before | Remaining |
| --- | ---: | ---: |
| Platform fields | 392 | 123 |
| Hardware fields | 575 | 531 |
| Physical fields | 220 | 156 |
| Software | 52 | 35 |
| Regional prices | 135 | 123 |
| Control behavior/location | 604 | 647 |
| Partial inventories | 66 | 58 |
| USB connector | 42 | 26 |
| Standalone USB | 10 | 4 |

**All unknowns have not been eliminated.** More controls were identified and unsupported assertions removed, which can increase raw field gaps. Avoid claiming all remaining values are conclusively unpublished: some are conflicting, ambiguous SKU/revision identities, incompletely documented, or inapplicable. Keep console absence distinct from explicit exclusion. Manufacturer confirmation or physical inspection may be needed for some fields; sending messages to manufacturers has not been authorized.

## Evidence index — read only the relevant branch

Start with [parent integration](research/unknowns-parent-integration.md), then:

- New product additions: `research/catalog-refresh-turtle-beach.md`, `catalog-refresh-thrustmaster.md`, `catalog-refresh-solr.md`.
- Honeycomb shared controls: `research/alpha-xpc-shared-controls.md`.
- Consumer: `research/unknowns-consumer-round1.md`, `unknowns-consumer-round2-haiku.md`, `unknowns-logitech-round3-luna.md`, `unknowns-turtle-new-round3-haiku.md`.
- Enthusiast: `research/unknowns-enthusiast-round1.md`, `unknowns-enthusiast-round2-haiku.md`, `unknowns-vkb-round3-luna.md`, `unknowns-winctrl-round3-luna.md`, `unknowns-virpil-round3-luna.md`.
- Thrustmaster/MOZA: `research/unknowns-thrustmaster-moza-round1.md`, `unknowns-thrustmaster-moza-round2-haiku.md`, `unknowns-thrustmaster-manuals-round3-luna.md`, `unknowns-moza-round3-haiku.md`.

All delegated tasks are finished. No child needs monitoring. Earlier completion notifications asking whether to continue were already acted upon; do not repeat those questions.

## Validation and environment gotchas

- **45 tests pass**, `pnpm check` succeeds with zero errors/warnings (four preexisting Zod deprecation hints), final `pnpm build` succeeds with Pagefind indexing **166 pages**. Existing large-chunk warning remains.
- Final built API: **152** products, **152** platform entries; original Alpha L/R and J04 absent; all catalog image files and bundle component references exist. Flightstick II and Dual Throttle inventories verified in built JSON as complete with 16/8 physical buttons.
- Parent fixed two malformed MOZA multiline YAML notes in AB6 and Z-axis after the last agent; all parse/build checks then passed.
- Latest content edit was before final successful build at about 22:04:51. Dev cache restart afterward changes generated files only; browser verification pending as above.
- Development server **must use background mode**: `pnpm exec astro dev --background`; management `pnpm exec astro dev stop/status/logs`.
- T3 preview browser worked, though snapshots frequently timed out. `preview_navigate` and `preview_evaluate` work for local pages and many manufacturer pages. Parent tab: `tab_3_3a7a2cb0-6791-4888-83ef-586e3591d2b8`. Call `preview_status` first. Last URL was local Flightstick II detail page. WINCTRL navigation/evaluation timed out; exact source mismatch noted in research.
- Official Turtle Beach support pages often return CSS-error text to web fetch but load article contents in browser shadow DOM. Recursively inspect shadow roots for images/links. Flightdeck official PDF: `https://acpv.prod.turtlebeach.com/support/qig/en/33/velocityone-flightdeck.pdf`.
- Download PDFs using Python requests with Mozilla user agent; PyMuPDF via `uv run --with pymupdf python -` works. Set `sys.stdout.reconfigure(encoding='utf-8')` for extracted text on Windows. Rendered mapping pages and downloaded PDFs are in `work/`.
- `work/catalog-unknowns-before.json` is the original audit; `work/catalog-values-before-unknown-research.json` is full original YAML snapshot. Audit backfills newly tracked standalone-USB gaps from that snapshot. `work/catalog-unknowns-after.json` holds latest machine-readable results.
- `work/` contains substantial task downloads AND preexisting user files. Preserve user material; no recursive cleanup was authorized. Existing unrelated dirty files include Astro/config/package changes, editor work and miscellaneous images/artwork. No reset/clean/revert.
- Delegation: discover T3 models with `orchestrator_capabilities`; confirmed Codex `gpt-6-luna` with `{reasoningEffort:'high'}` and `claudeAgent` `claude-haiku-5-5` with `{effort:'high'}`. Use T3 `delegate_task` async with explicit model options, new stable clientRequestId per round, original brief + relevant prior findings, disjoint shared-checkout ownership. At most three children alongside parent.
