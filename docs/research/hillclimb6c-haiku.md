# Hillclimb round 6c (haiku3): MOZA, Honeycomb, SLAW, MFG

Checked 2026-10-21. Scope: `src/content/components/{moza,honeycomb,slaw,mfg}/` and `src/content/bundles/moza/`. Continues `hillclimb6-haiku.md` and `hillclimb6b-haiku.md`. Scratch renders in `work/haiku3/`. Orchestrator decision applied: a spec line such as "Supported Platform: PC" is not an exclusion.

## Changed

| Product | Field | Value | Source |
|---|---|---|---|
| SLAW RX Viper V3 | `hardware.sensor`, `hardware.axes[*].sensor` | `contactless_magnetic` → `contactless` (3 axes) | Store: "non-contact digital sensors for all three axes" ([product page](https://slawdevice.com/en/glowna/45-pre-order-rx-viper-v3-rudder-pedals-dark-metalic.html)). "Magnetic" and "Hall" do not appear on the page, so `contactless` is the closest stated term. |
| SLAW RH Rotor V2 | same fields | `contactless_magnetic` → `contactless` | Store: "non-contact digital sensors" ([RH Rotor page](https://slawdevice.com/en/rudder-pedals/50-pre-order-rh-rotor-v2-rudder-pedals.html)). Page has no "magnetic" or "Hall" (checked 2026-10-21). |
| SLAW RF Dora V3 | same fields | `contactless_magnetic` → `contactless` | Same store table and wording as RX Viper V3 ([RF Dora page](https://slawdevice.com/en/glowna/52-pre-order-rx-viper-v3-rudder-pedals-dark-metalic.html)). |
| MOZA MTQ Throttle | `controls_evidence.notes` | "23 physical controls" reconciled as unresolved. Removed the earlier unsourced claim that 23 means "grouped physical control stations". | EU product copy (`mozaracing.com/products/mtq-throttle`) says "23 physical controls, including 10 multifunction buttons, 3 rotary knobs, 3 toggle switches, and a dedicated landing gear lever". That breakdown sums to 17, not 23. The EU spec table says "Physical Toggle Switches: 17". The MOZA MTQ support article also says "23 physical controls" with no breakdown. |
| MOZA MTQ Throttle | `platform_compatibility` source | "PC only" now cited to the support article, not the product overview. Values unchanged (xbox, ps5 `unsupported`). | MOZA support article, spec line "216 × 166 × 198 mm \| PC only \| RJ11 base connection + USB" ([70000679590](https://support.mozaracing.com/en/support/solutions/articles/70000679590-mtq-throttle-quadrant-support)). The earlier attribution to the product overview was not found in the cached copy. |
| MOZA AY210 Yoke Bundle | `prices` | UK GBP 828 (tax included; sale price, regular GBP 868). US USD 828 (taxes and shipping at checkout, `incl_vat: false`). EU EUR 908 kept. | [UK](https://uk.mozaracing.com/products/ay210-ffb-yoke-bundle), [US](https://us.mozaracing.com/products/ay210-ffb-yoke-bundle). Sale price on UK is used, matching the EU record convention. |
| MOZA MTLP Panel | `prices` | UK GBP 149 (tax included). EU 159 and US 149 kept. | [UK product header](https://uk.mozaracing.com/products/mtlp-panel): "MOZA MTLP Panel" with price £149.00, tax included, no sale. The other £289/£329/£199 figures on that page belong to the MTP throttle. |

## Checked, not changed

- **MOZA MTQ, 23 vs 31.** Itemized discrete inputs are 31 (10 buttons + 3 rotaries + 17 toggles + gear lever), supported by the EU spec table. The 23 figure is not reproduced by any breakdown in the sources. The Cockpit "Button Number" diagram (manual p.4, embedded image 600 px) shows about 13 dots on the lever modules and panel, plus 3 switches in the bottom-right row and 1 oval. That is consistent with 17 toggles but is not a reliable count at this resolution. Left at 31 itemized, `partial`.
- **MOZA AY210 base, 13 switches.** The Cockpit "Button Number" diagram (manual p.7 embedded image) shows the front panel as: NAV, BEACON, STROBE (3 two-number switches); BATT, FUEL PUMP, PITOT (3 two-number switches); 4 push buttons (49–52); a 3-position switch (58–60); a 3-position switch (61–63); 2 singles (76, 77). That is 14 switch-type items, plus a rotary and a 5-way hat (53–57) with no separate count. The manufacturer says 13. The mismatch cannot be settled from the diagram, so the count stays at 13. The 5-way hat is not in the record; it may belong to the panel or to the MFY handle, and the diagram does not say, so it is not added.
- **MOZA MH16, TMS and CMS.** The quick guide p.2 labels TMS and CMS but gives no mechanism. In the head crop, the TMS leader ends on a ridged rectangular surface and the CMS leader on a protruding tab. Neither is named as a hat or a rocker in official text. A third-party review (unofficial, cached in `work/moza-research/raw/`) says TMS is pressed left/right, which would make it a 2-way rocker, but this is not an official statement and is not used. The MHG manual lists TMS, CMS and SMS as 5-way hats, but that is a different product and is not transferred. `switch` count 2 stays.
- **MOZA MTP, 8 unlocated switches.** Manual p.2 says "27 Physical Switches". The panel itemizes 19. The grip is partly hidden by the drawn overlay in the parameters diagram, and the 8 are not identified in any legible view. Left at 19 itemized, `partial`.
- **MOZA MHG.** Existing record is `coverage: complete` with 11 itemized controls (trigger, mini stick, 4 buttons, 3 five-way hats, 3-way toggle, twist axis). Not re-verified against the manual this round; no change.
- **MOZA MFP / MBC base, MS series sticks, MCG.** No MOZA MFP, MBC, MS or MCG record exists in `src/content`. MCG records are VKB products. Not added (new products are outside the brief).
- **MOZA AB6 base, price.** No standalone AB6 product URL on the EU, UK or US storefronts (`/products/ab6*` returns 404). The storefront lists `ab6-bundle`, a different SKU. No price recorded.
- **Honeycomb Bravo lever contacts.** Official Bravo page (`flyhoneycomb.com/products/bravo-throttle-quadrant`) says "6 levers", "7 assignable switches", "TOGA lever" and "General aviation & commercial levers included". No per-lever contact map. Consistent with `hillclimb-honeycomb-mfg-turtle.md`. Left unset.
- **Honeycomb UK prices (Alpha Lite, Bravo Lite, Foxtrot Stick, Sierra, Foxtrot Throttle Box, Echo).** Honeycomb's US store has no GBP storefront. Left unset.
- **Honeycomb Echo, US price.** Still "incl. VAT plus shipping" wording (see 6b). Left unset.
- **SLAW UK and US prices.** Store is EUR-only (€ and "Euro" in the page's currency data; no GBP or USD). Left unset.
- **SLAW Viper V2 sensor.** The record says "contactless digital magnetic sensors", but the source is an older blog post and the discontinued product is outside the current store wording. Not changed; flagged for a separate check.
- **SLAW `pc: supported`.** Still based on the calibration program, as in 6b.
- **MFG.** No new prices added, per instruction. The converted UK/US amounts stay removed.

## Validation

- `pnpm check`: 0 errors, 0 warnings, 4 hints (existing deprecation hints in `schema.ts`). One intermediate save of `mtq-throttle.yaml` broke the YAML (an unquoted note with `: `); fixed with `>-` before the final run.
