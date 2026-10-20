# Hillclimb round 6b (haiku2): MOZA, Honeycomb, SLAW, MFG

Checked 2026-10-21. Scope: `src/content/components/{moza,honeycomb,slaw,mfg}/` and `src/content/bundles/mfg/`. Continues `hillclimb6-haiku.md`. Scratch renders and downloads in `work/haiku2/`.

## Changed

| Product | Field | Value | Source |
|---|---|---|---|
| MFG Crosswind V3 Graphite | `prices` | UK GBP 247.32 and US USD 331.75 removed. EU EUR 286.22 kept. | Storefront currency switch: the page shows EUR × `currencyRate` (GBP 0.860447). The value is a conversion, not a set price. [Pack page](https://mfg-sim.com/rudders/mfg-crosswind-v3-me109-rudder-pedals.html) |
| MFG Cessna Footrests | `prices` | UK and US removed. EU EUR 38 kept. | Same conversion (GBP and USD = EUR × store rate). EUR 38 = base 34 + 4 for the Cessna variant (combination impact on [footrest page](https://mfg-sim.com/rudder-acessories/footrest-kit-for-mfg-rudder-pedals.html)). |
| MFG Combat Footrests | `prices` | UK and US removed. EU EUR 34 kept. | Same conversion. Base price 34, tax excluded. |
| MFG Hydraulic Damper | `prices` | UK and US removed. EU EUR 45.60 kept. | Same conversion. [Damper page](https://mfg-sim.com/rudder-acessories/hydraulic-damper-universal-kit-for-v1-3-pedals.html) |
| MFG Crosswind V3 Combo (bundle) | `prices` | All three set to `[]`. | No combo listing on mfg-sim.com. `mfg.com` returns 403. The stored EU 350 (incl. VAT) does not reconcile with pedals 286.22 + damper 45.60 excl. VAT. |
| MFG Crosswind V3 Graphite | `controls` | Rudder axis (kind `rudder`, count 1) added to the two toe-brake axes. Notes corrected: the schema does have a rudder axis kind. | Schema `axis` kinds; matches the SLAW records. |
| SLAW RX Viper V3 | `physical.weight_g` | 7500 | Store product parameters "Weight 7,5 kg". [Product page](https://slawdevice.com/en/glowna/45-pre-order-rx-viper-v3-rudder-pedals-dark-metalic.html) |
| SLAW RF Dora V3 | `physical.weight_g` | 7500 | Same table on [its page](https://slawdevice.com/en/glowna/52-pre-order-rx-viper-v3-rudder-pedals-dark-metalic.html) (page shows RF Dora V3). |
| SLAW RF Dora V3 | `hardware.axes[*].resolution_bits` | 13 on all three axes | Parameters table "Resolution of digital sensors 13 bit". |
| SLAW RF Dora V3 | `software` | Rudder pedals calibration program (listed for RX Viper, RX Viper V2, BF109, RF Dora) | [Downloads](https://slawdevice.com/en/content/7-downloads) lists the RF Dora under that program, not under the Rudder calibration software for RH Rotor and RX Viper V3. |
| SLAW RF Dora V3 | `platform_compatibility.notes` | Downloads named wording; no OS stated. | As above. |
| SLAW Damper Kit | `platform_compatibility.notes` | "Xbox and PS5 are not supported by the host pedals" removed. The page does not say it. Platform stays `unknown` for Xbox and PS5. | [RH Rotor page](https://slawdevice.com/en/rudder-pedals/50-pre-order-rh-rotor-v2-rudder-pedals.html) |
| Honeycomb Echo | `controls` | Four sliders changed from `lever` to `slider` (count 4). Page: "Four detented sliders and interchangeable caps for throttle, flaps, and speed brakes." | [Echo product page](https://flyhoneycomb.com/products/echo-aviation-controller), Configurable Aircraft Control section |
| Honeycomb Echo | `controls` | Added 3 `lever` items (count 3, location `other`) for the lower-edge tactile levers. Page: "Tactile levers for flaps, parking brake, and gear." Official image shows three lever stems on the lower edge. | Same page; [official image](https://flyhoneycomb.com/cdn/shop/files/HC003981_EchoAviationController_1.webp?v=1774814963&width=1920) |
| Honeycomb Echo | `platform_compatibility` | `pc: supported`; `xbox`, `ps5` `unknown`. | Spec table "System Compatibility: PC, Mac" on the Echo page. No Xbox or PS5 statement. |
| Honeycomb Echo | `physical.dimensions_mm` | [169, 69, 119] (W, H, D) | Spec table "Width 169 mm, Depth 119 mm, Height 69 mm (with standard lever caps)". The order was rearranged to W, H, D to match the other records. |
| Honeycomb Echo | `software` | Dongle and controller firmware update (standard and X-Input beta), input documentation, MSFS 2024 profiles | Downloads list on the Echo product page. |
| MOZA MA3X Side Stick | `controls_evidence.coverage` | `partial` → `complete` | Quick guide page 1 "Buttons" diagram shows four grip controls: A/P, Auxiliary Switch, View Control Switch, MIC. Those match the record's button, toggle, 8-way hat and trigger. Stage, position and center-push values remain unset. |
| MOZA MA3F Flight Computer Display | `controls_evidence.coverage` | `partial` → `complete` | Manual cover photo at 3x render: 12 bezel keys + 14 function keys + 6 airport/blank/arrow keys + 42 alphanumeric = 74 keys. The five top lamps are indicators. |
| MOZA MB7F Flight Computer Display | `controls_evidence.coverage` | `partial` → `complete` | Manual cover photo at 3x render: 12 bezel + 16 function (BRT included) + 42 alphanumeric = 70 keys. Side labels and lamps are indicators. |
| MOZA MGX1000 | `physical.dimensions_mm` | [304, 201, 66.8] (W, H, D) | Manual page 3 "Parameters" drawing labels 304 (width), 201 (height), 66.8 (side depth). |

## Checked, not changed

- **MOZA MH16.** Quick guide page 2 labels nine grip controls: weapon release, trim switch, DMS, NWS, TMS, CMS, trigger, FOV, paddle. Current record matches. The support article names one "8-way ALPS hat switch" for POV/trim/camera, but does not say which dome it is. The DMS cross is visibly 4-way, so `ways` is not set on either hat. Coverage stays `partial` because the optional side module (5-way hat + 3-position selector) is excluded and its inclusion is not stated. Source: [support article](https://support.mozaracing.com/en/support/solutions/articles/70000679587-moza-mh16-flightstick-support), manual p.2.
- **MOZA MTQ.** The panel photo and manual are consistent with 10 buttons, 3 rotaries, 17 toggles and a gear lever (31 discrete). The "23 physical controls" marketing figure is not reconciled. The photo cannot settle it, so the record is unchanged.
- **MOZA AY210.** The Cockpit "Button Number" screenshot (manual p.5) numbers the panel 49–77, with 6 two-number groups, a 5-way hat (53–57) and separate singles. That does not map cleanly onto the stated "13 programmable RGB panel switches", and the mechanism is still not named. Left at 13, partial.
- **MOZA MGX1000 inventory.** The product page names a 7-way ALPS joystick that does not appear in the hero or diagram, so coverage stays partial. Button and rotary counts are unchanged.
- **MOZA Z-Axis.** No platform or sensor statement on the product page. No change.
- **MOZA Flight Computer Displays, platform.** Both product pages say "Supported Platform: PC" (see below).

## Platform wording (MOZA)

Spec tables on the product or support pages: MH16 "Platform: PC" (manual and product page), MA3X "Platform: PC" (manual), MGX1000 "Supported Platform: PC", MA3F FCD and MB7F FCD "Supported Platform: PC", AY210 "Platform Support: PC" with FAQ "does not support Xbox or PlayStation", MTQ overview "PC only".

The rule for this round is that only explicit "PC only" or "does not support Xbox/PlayStation" wording marks `unsupported`. The spec-table lines name PC as the single supported platform but do not say Xbox or PlayStation are excluded. So Xbox and PS5 stay `unknown` for MH16, MA3X, MGX1000, MA3F FCD and MB7F FCD. AY210 and MTQ keep their existing `unsupported` values. **Decision for you:** if a single-platform spec table should count as an exclusion, those five records need `xbox: unsupported` and `ps5: unsupported`.

## Left unset, with reasons

- **Honeycomb Echo upper-left control.** Visible in the official image as a fixed round dome with concentric rings. Not named in any text, and it is not a thumbstick, hat or slider. Not classified, and no count added. Coverage stays `partial`.
- **Honeycomb Echo weight.** The page gives 564 g only "with Full Set, Travel Case & Accessories", so it is not the controller's weight.
- **Honeycomb Echo "assignable switches".** The page mentions them without a number. Not counted.
- **Honeycomb Echo "Hall-effect" wording.** Kept as is (the Echo's own section names a 16-bit Hall-effect thumbstick). The Section 2 wording about "mechanically linked rudder pedals" names Alpha and Charlie, so it is not used for Echo.
- **Honeycomb Echo US price.** The US store shows USD 149.99 "incl. VAT plus shipping". No price recorded, as before.
- **SLAW `contactless_magnetic` sensor (all pedals).** The store pages say "non-contact digital sensors" (RH Rotor) and "13 bit". The word "magnetic" or "Hall" was not found on the store pages. Left as recorded, but not verified. Changing it would also remove these pedals from the catalog's contactless filter.
- **SLAW `pc: supported`.** The store names "all flight simulators" and a calibration program, but never names PC or Windows. Left as recorded. Stated basis: calibration program.
- **SLAW regional prices (UK, US).** Store is EUR-only. Not converted.
- **SLAW Viper V2 and RX Viper V3 damper**, other fields. Not in the brief; left.
- **MFG footrests and damper platform, weight and dimensions.** No platform statement on those pages (Windows/Mac/Linux is stated for the base only). Weight and dimensions are not published for the accessories.
- **MFG V3 base pedals**: sensor "contactless magnetic" and 13-bit are supported by the base page ("3rd generation triaxis digital Hall sensor on rudder axis", "13bit"). No change.
- **MFG Crosswind V3 Combo bundle.** Prices removed (above). Bundle still needs an official combo listing to re-add prices.

## Validation

- `pnpm check`: 0 errors, 0 warnings, 4 hints (existing deprecation hints in `schema.ts`).
- `pnpm test`: 7 files, 45 tests pass.
