# Issue #22 visibility decisions

2026-10-25. Classification is an editorial catalog decision, not a specification or price change. Existing `category: module` stays intact; `catalog_kind` changes from absent (visible) to the kind below (hidden). Missing kind or `core` stays visible for components and bundles. All YAML remains validated and available to price refresh/audit tooling.

## Borderline items

- **virpil/vpc-control-panel-1: hide (panel).** Supplementary cockpit button/encoder panel. [Manufacturer evidence](https://virpil-controls.eu/vpc-control-panel-1.html).
- **virpil/vpc-control-panel-2: hide (panel).** Supplementary gear/flap/cockpit panel. [Manufacturer evidence](https://virpil-controls.eu/vpc-control-panel-2.html).
- **virpil/vpc-control-panel-3: hide (panel).** Auxiliary panel; its four axis levers do not make it a primary throttle/quadrant SKU. [Manufacturer evidence](https://virpil-controls.eu/vpc-universal-control-panel-3.html).
- **virpil/vector-engine-mcp: hide (panel).** Engine starter and switch panel, not a throttle. [Manufacturer evidence](https://virpil-controls.eu/vector-emc-panel.html).
- **virpil/vector-gear-mcp: hide (panel).** Gear control panel. [Manufacturer evidence](https://virpil-controls.eu/vector-gmc-panel.html).
- **virpil/vector-lighting-mcp: hide (panel).** Lighting control panel. [Manufacturer evidence](https://virpil-controls.eu/vector-lmc-panel.html).
- **thrustmaster/viper-bap-panel: hide (panel).** Cockpit replica panel; keep the separate Viper TQS throttle and Mission Pack bundle visible. [Manufacturer evidence](https://ts.thrustmaster.com/download/accessories/Manuals/Viper/Viper_Mission_Pack_User_Manual.pdf).
- **moza/ma3f-efcm: hide (panel).** A320 FCU/autopilot panel, not primary flight controls. [Manufacturer evidence](https://us.mozaracing.com/products/ma3f-efcm).
- **moza/ma3f-fcd: hide (panel).** Flight computer display/keypad. [Manufacturer evidence](https://us.mozaracing.com/products/ma3f-fcd).
- **moza/mb7f-fcd: hide (panel).** Flight computer display/keypad. [Manufacturer evidence](https://us.mozaracing.com/products/mb7f-fcd).
- **mfg/crosswind-hydraulic-damper: hide (accessory).** Passive pedal accessory; plain-text pedal upgrade and bundle contents, with manufacturer source link. [Manufacturer evidence](https://mfg-sim.com/rudder-acessories/hydraulic-damper-universal-kit-for-v1-3-pedals.html).
- **slaw/slaw-damper-kit: hide (accessory).** Passive pedal accessory; plain-text RH Rotor/RX Viper upgrade with manufacturer source link. [Manufacturer evidence](https://slawdevice.com/en/rudder-pedals/50-pre-order-rh-rotor-v2-rudder-pedals.html).
- **moza/mrp-adjustable-damper: hide (accessory).** Passive pedal accessory; plain-text MRP pedal upgrade with manufacturer source link. [Manufacturer evidence](https://eu.mozaracing.com/products/mrp-damper).

Dampers have no standalone route, as required by the issue; contextual pedal add-ons link externally to the manufacturer. Upgrade targets that become hidden render as plain text, retaining notes/source links. Hidden bundle members retain their names and control inventory without a product card.

## Additional inventory decisions

The current inventory also contains WINCTRL PAC/PCR/PDC/PFP/PTO/RMP/TCAS panels and USB instrument display, MOZA MGX1000, and VKB GNX MFH. These follow the same panel/accessory rule.

OMNI Extension remains visible because it changes stick/throttle orientation; MOZA Z-axis adds a flying axis. TCA quadrant add-on, VKB SEM/SEM-V/FSM-GA/ATEM/STEM, MOZA TQA/TQB and VIRPIL grip/throttle modules stay visible because they alter primary controls. GNX MFH is a passive holder, so it is hidden.

## Complete hidden inventory

- logitech/flight-instrument-panel: panel
- logitech/flight-multi-panel: panel
- logitech/flight-radio-panel: panel
- logitech/flight-switch-panel: panel
- mfg/crosswind-cessna-footrests: accessory
- mfg/crosswind-combat-footrests: accessory
- mfg/crosswind-hydraulic-damper: accessory
- moza/ma3f-efcm: panel
- moza/ma3f-fcd: panel
- moza/mb7f-fcd: panel
- moza/mgx1000: panel
- moza/mrp-adjustable-damper: accessory
- moza/mtlp-panel: panel
- slaw/slaw-damper-kit: accessory
- thrustmaster/viper-bap-panel: panel
- virpil/vector-engine-mcp: panel
- virpil/vector-gear-mcp: panel
- virpil/vector-lighting-mcp: panel
- virpil/vpc-control-panel-1: panel
- virpil/vpc-control-panel-2: panel
- virpil/vpc-control-panel-3: panel
- vkb/blackbox-mk2: controller_board
- vkb/blackbox-mk3: controller_board
- vkb/gnx-mfh: accessory
- vkb/gnx-usb-controller-hid-main: controller_board
- winctrl/agp-32-metal: panel
- winctrl/carrierace-ufc-2: panel
- winctrl/ecam-32: panel
- winctrl/efis-l: panel
- winctrl/efis-r: panel
- winctrl/f16-icp-module: panel
- winctrl/fcu-unit: panel
- winctrl/mcdu-32: panel
- winctrl/mfd-unit: panel
- winctrl/navyace-hud: panel
- winctrl/navyace-ufc: panel
- winctrl/pac-32-metal: panel
- winctrl/pcr-panel: panel
- winctrl/pdc-3m: panel
- winctrl/pdc-3n: panel
- winctrl/pfp-3n: panel
- winctrl/pfp-4: panel
- winctrl/pfp-7: panel
- winctrl/pfp3-cockpit-module: panel
- winctrl/pto-2: panel
- winctrl/rmp-32: panel
- winctrl/tcas-32: panel
- winctrl/usb-instrument-display: panel

Panel-only bundles also hidden: `winctrl/efis-combo`, `winctrl/glareshield-3`, `winctrl/pdc-3-combo` (`catalog_kind: panel`). Bundles combining core controls with panels/accessories remain visible.

## Verification

- `pnpm check`: 0 errors, 0 warnings; 5 existing Zod deprecation hints.
- `pnpm test`: 16 files / 109 tests passed, including real-YAML route/listing and hidden-reference regressions.
- `pnpm build`: production build and Pagefind index passed (288 indexed pages); existing large-chunk warning remains.
- Generated-output audit: all 51 hidden records have no detail HTML route, catalog API entry, or internal HTML link; 274 public products remain.
- Browser: BlackBox catalog search gives zero cards; Crosswind Combo retains damper as plain text and pedal card; production MRP page retains damper upgrade text with only an external manufacturer source link; hidden BlackBox Mk3 URL returns 404. Production Pagefind BlackBox search returns no hidden product URL.
- Narrow browser verification completed after merging main: Brave measured 312 CSS pixels at its existing zoom. BlackBox search gives zero cards, Crosswind Combo retains plain-text damper contents, and the MRP pedal add-on has only its external source link; these pages have no horizontal overflow. The visible CM3-to-CM4 successor banner was also verified at 390 CSS pixels without horizontal overflow. Temporary viewport overrides were reset. T3 preview resize still reports 390 requested but 1280 actual; fallback browser measurements establish the narrow result.

## Integration with merged main (#23, #24, #25)

Merged `origin/main` at `0793fb2`, retaining sensor/verdict updates, successor fields/filtering, and family data/helpers. The only textual conflict was the catalog imports; both imports remain.

Family validation now uses the full derived inventory before public visibility filtering, so hidden members remain valid content references. Public `familyOf` members, tiers, siblings, and switcher lineup exclude hidden products, including a hidden current item. Integrity errors involving retained hidden members still fail validation.

Successor resolution validates all retained records before suppressing links involving hidden products. Public catalog serialization omits hidden successor IDs, preventing them from affecting discontinued filtering or wizard recommendations. Upgrade targets with a hidden replacement remain available; their hidden targets render as plain text. Regression tests cover hidden component/bundle successors, invalid hidden successor records, family exclusion, and validation with hidden members.

Post-merge checks: `pnpm check` passes (0 errors/warnings; 5 existing hints), `pnpm test` passes (109 tests), and `pnpm build` plus Pagefind passes (288 pages). The first build attempt encountered a Windows directory lock held by the previous static server; stopping that server resolved it. The fresh production-output audit confirms 51 hidden records have no generated route, catalog API entry, or internal HTML link; the visible CM3 successor remains intact.

A final fetch found #27 (live-editable wizard results) had merged while this integration was in progress. Merged that update too (`origin/main` at `b0e679c`); the final full suite passes with 109 tests.
