# Hillclimb round 6 (haiku): MOZA, Honeycomb, SLAW, MFG

Checked 2026-10-20 to 2026-10-21. Scope: `src/content/components/{moza,honeycomb,slaw,mfg}/`. Scratch renders in `work/haiku/`.

## Changed

| Product | Field | Value | Source |
|---|---|---|---|
| MOZA MTP Flight Throttle | `controls` | Replaced one unitemized `switch` count 27 with 19 itemized panel controls: 8 toggles (L GEN, BATT, R GEN, LSTR/FLR, APU, ENG CRANK 3-way, STROBE, INTR WING), 3 switches (FLIR, LTDR, PROBE), 6 rotaries/selectors (RADAR, INS/GND, FORMATION, POSITION, LIGHT CONTROL, RUD TRIM push), 1 button (RESET), 1 slider (MAX). Coverage stays `partial`. | MTP manual p.2 panel diagram, rendered at zoom 10 (`work/moza-research/pdf/mtp.pdf`); [support article](https://support.mozaracing.com/en/support/solutions/articles/70000679591-moza-mtp-throttle-support) |
| MOZA MTP Flight Throttle | notes | Manufacturer total of 27 kept in notes. The 8 not located are not added as a count. | As above |
| MOZA MGX1000 | `prices` | Added EU EUR 469 (tax included, `eu.mozaracing.com`), UK GBP 449 (VAT included). US USD 449 already present. | [EU](https://eu.mozaracing.com/products/mgx1000), [UK](https://uk.mozaracing.com/products/mgx1000) |
| MOZA MA3F EFCM | `prices` | Added EU EUR 159 (main module, tax included), UK GBP 149 (VAT included). | [EU](https://eu.mozaracing.com/products/ma3f-efcm), [UK](https://uk.mozaracing.com/products/ma3f-efcm) |
| MOZA MA3F FCD | `prices` | Added EU EUR 259, UK GBP 229 (tax included on both). | [EU](https://eu.mozaracing.com/products/ma3f-fcd), [UK](https://uk.mozaracing.com/products/ma3f-fcd) |
| MOZA MB7F FCD | `prices` | Added EU EUR 259, UK GBP 229 (tax included on both). | [EU](https://eu.mozaracing.com/products/mb7f-fcd), [UK](https://uk.mozaracing.com/products/mb7f-fcd) |
| MOZA MFY Yoke Handle | `prices` | Added EU EUR 139 and UK GBP 129 as **sale** prices (regular EUR 159 / GBP 149). Tax included. Amount uses the sale price, following the AB9 convention. | [EU](https://eu.mozaracing.com/products/mfy-yoke), [UK](https://uk.mozaracing.com/products/mfy-yoke) |
| MOZA MTLP Panel | `prices` | Added EU EUR 159 (tax included). | [EU](https://eu.mozaracing.com/products/mtlp-panel) |
| MOZA MRP Adjustable Damper | `prices` | Added UK GBP 65 (tax included) and US USD 65 (tax and shipping calculated at checkout, so `incl_vat: false`). | [UK](https://uk.mozaracing.com/products/mrp-damper), [US](https://us.mozaracing.com/products/mrp-damper) |
| MOZA Z-Axis Twist Module | `controls` | Type changed from `lever`/`other` to `axis` kind `twist` (count 1). The control is an analog twist input, not a lever. | Existing manual and product page |
| Honeycomb Echo Aviation Controller | `controls` | Added 1 button for the Honeycomb logo button with LED charge indicator (page text). Relabelled the 3 top buttons as camera, checklist and toolbar (page text plus icons in the official image). Added 4 buttons for the left diamond cluster (official image only). | [Echo product page](https://flyhoneycomb.com/products/echo-aviation-controller), [official image](https://flyhoneycomb.com/cdn/shop/files/HC003981_EchoAviationController_1.webp?v=1774814963&width=1920) |

## Checked, not changed

- **MOZA MH16:** Manual lists weapon release, NWS, FOV buttons (3), trim and DMS hats (2), trigger (2-stage), paddle switch. TMS and CMS are shown but their mechanism is not confirmed in the diagram, so the existing `switch` count of 2 stays. The 30 vs 27 input-count conflict is unchanged.
- **MOZA MFY Pro Yoke:** Existing `coverage: complete` inventory matches the notes from round 4. No change.
- **MOZA AY210:** Manual states 13 programmable RGB panel switches with no itemized list. Left as `switch` count 13, partial.
- **MOZA MA3F FCD, MB7F FCD, MGX1000:** Keyboard and key counts are already itemized. No change.
- **MOZA MTQ:** Itemized 31 inputs vs "23 physical controls" marketing conflict is still unreconciled. No change.
- **MOZA AB6 base:** Price left unset. The only AB6 product URL in the record is a YouTube link, and the bundle page is not a base listing.

## Left unset, with reasons

- **Honeycomb Bravo lever contacts (`button_contacts`, lever `push`):** No official Honeycomb source gives a per-lever contact map. The Honeycomb downloads page has no Bravo button map. `work/honeycomb-bravo-mapping.pdf` has Bravo button numbers (reverse, TOGA), but it is a 2021 community PMDG profile by an individual author, not an official source, so it is not used. Consistent with `docs/research/hillclimb-honeycomb-mfg-turtle.md`.
- **Honeycomb Echo upper-left concentric round control:** Visible in the official image, not named in any text. Not classified.
- **Honeycomb Echo bottom levers:** Page says "tactile levers for flaps, parking brake, and gear," while another page line says "four detented sliders" and the earlier note said "four levers." Not counted separately, because the wording overlaps.
- **Honeycomb Echo prices:** The US page shows USD 149.99 with the wording "incl. VAT plus shipping costs." That conflicts with a US-store price, so no price is recorded.
- **Honeycomb UK prices (Alpha Lite, Bravo Lite, Foxtrot Stick, Sierra):** Honeycomb publishes only US (USD) pages. No official GBP page was found in earlier rounds either.
- **MOZA MTP panel: 8 unlocated switches:** See above.
- **MOZA MTLP UK price:** The page's sale and regular prices belong to the MTP throttle, and the MTLP price read was ambiguous. Not recorded.
- **MOZA xbox/ps5 platform fields:** Only explicit "PC only" or "does not support Xbox or PlayStation" wording marks `unsupported`. None found on the pages checked here, so those fields stay `unknown`.
- **SLAW RX Viper V3, RH Rotor V2 pedals:** Official pages name no platform (no PC, Xbox, PS5). Stay `unknown`. The RX Viper V3 page gives 3 axes (one rudder, two toe-brake), 13-bit non-contact sensors. Not applied in this round because existing records already match and the sensor fields are not in the brief.
- **SLAW regional prices (UK, US):** Stay unset. The earlier audit (`hillclimb-vkb-slaw.md`) records that SLAW sells only in EUR without regional storefronts. No conversion.
- **MFG:** Not reviewed in this round beyond the platform and price gap list; no changes.

## Validation

- `pnpm check`: 0 errors, 0 warnings, 4 hints (existing deprecation hints in `schema.ts`).
