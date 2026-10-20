# MOZA hillclimb (round 4)

Checked 2026-10-20. Scope: `src/content/components/moza/*.yaml`. Only official MOZA pages (product, support, regional stores) were used. No currency conversion, no related-variant data. Sale prices are stored as the sale amount (AB9 convention); the schema has no sale field, so sale status is recorded here.

## Filled

| Record | Field | Value | Source |
|---|---|---|---|
| ab6-force-feedback-base | `hardware.extension_support` | `true` | [AB6 support](https://support.mozaracing.com/en/support/solutions/articles/70000684201-ab6-force-feedback-base): "RJ11 accessory ports"; "Any extension with the correct data interface on both ends can be used." |
| ay210-yoke-base | `prices` UK / US | GBP 699 / USD 699 (no sale label) | [UK](https://uk.mozaracing.com/products/ay210-yoke-base), [US](https://us.mozaracing.com/products/ay210-yoke-base) |
| ay90-yoke-base | `controls[0].ways` | `5` | [AY90 US](https://us.mozaracing.com/pages/ay90-yoke-base) spec: "5-Way Hat Switch", value 1 |
| ay90-yoke-base | `controls[3].mode` | `selector` | Same page: "1 multi-position rotary knob" |
| ay90-yoke-base | `prices` UK / US | GBP 379 / USD 399 (no sale label) | [UK](https://uk.mozaracing.com/products/ay90-yoke-base), [US](https://us.mozaracing.com/products/ay90-yoke-base) |
| ma3x-side-stick | `software` | `MOZA Cockpit` | [MA3X support](https://support.mozaracing.com/en/support/solutions/articles/70000679588-moza-ma3x-side-stick-support): MOZA Cockpit, "PC compatible" |
| ma3x-side-stick | `prices` UK / US | GBP 79 / USD 79 (no sale label) | [UK](https://uk.mozaracing.com/products/ma3x-sidestick), [US](https://us.mozaracing.com/products/ma3x-sidestick) |
| mfy-yoke-pro | `connectivity.standalone_usb` | `false` | [MFY support](https://support.mozaracing.com/en/support/solutions/articles/70000679589-moza-mfy-yoke-support): "It cannot function independently or with other bases." |
| mfy-yoke-pro | `prices` UK / US | GBP 279 / USD 299 (no sale label) | [UK](https://uk.mozaracing.com/products/mfy-pro-yoke), [US](https://us.mozaracing.com/products/mfy-pro-yoke) |
| mh16-flight-grip | `prices` UK | GBP 139 **sale** (regular 169) | [UK](https://uk.mozaracing.com/products/mh16-flightstick) |
| mhg-flight-grip | `prices` UK / US | GBP 99 / USD 99 (no sale label) | [UK](https://uk.mozaracing.com/products/mhg-flightstick), [US](https://us.mozaracing.com/products/mhg-flightstick) |
| mrp-rudder-pedals | `prices` UK / US | GBP 329 / USD 349 (no sale label) | [UK](https://uk.mozaracing.com/products/mrp-rudder-pedals), [US](https://us.mozaracing.com/products/mrp-rudder-pedals) |
| mtp-throttle | `hardware.sensor` | `15-bit magnetic encoder` (throttle axis) | [MTP support](https://support.mozaracing.com/en/support/solutions/articles/70000679591-moza-mtp-throttle-support) |
| mtp-throttle | `prices` UK / US | GBP 289 / USD 299 **sale** (regular 329 both) | [UK](https://uk.mozaracing.com/products/mtp-throttle), [US](https://us.mozaracing.com/products/mtp-throttle) |
| mtq-throttle | `hardware.damping` | "per-axis adjustable resistance" (was "independently adjustable mechanical damping"; "mechanical" is not in the source) | [MTQ support](https://support.mozaracing.com/en/support/solutions/articles/70000679590-mtq-throttle-quadrant-support) |
| mtq-throttle | `prices` UK / US | GBP 199 / USD 199 (no sale label) | [UK](https://uk.mozaracing.com/products/mtq-throttle), [US](https://us.mozaracing.com/products/mtq-throttle) |
| tqa-throttle-module | `prices` UK / US | GBP 39 / USD 39 (no sale label) | [UK](https://uk.mozaracing.com/products/tqa-mod), [US](https://us.mozaracing.com/products/tqa-mod) |
| tqb-throttle-module | `prices` UK / US | GBP 39 / USD 39 (no sale label) | [UK](https://uk.mozaracing.com/products/tqb-mod), [US](https://us.mozaracing.com/products/tqb-mod) |
| z-axis-twist-module | `prices` UK / US | GBP 89 / USD 89 (no sale label) | [UK](https://uk.mozaracing.com/products/z-axis-module), [US](https://us.mozaracing.com/products/z-axis-module) |

Already correct, confirmed: AB9 EU 529 (sale; regular 599), UK 479 (sale; regular 549), US 499 (sale; regular 549) ([EU](https://eu.mozaracing.com/products/ab9-base), [UK](https://uk.mozaracing.com/products/ab9-base), [US](https://us.mozaracing.com/products/ab9-base)). MH16 US 149 was not re-fetched this round (round 3 value unchanged). AB6 dimensions 188×123×163 and weight 2.95 kg confirmed on the [AB6 bundle page](https://eu.mozaracing.com/products/ab6-bundle/). MRP pedals 354×518×264 mm and 8.0 kg confirmed.

YAML edits are in `ab6-force-feedback-base`, `ay210-yoke-base`, `ay90-yoke-base`, `ma3x-side-stick`, `mfy-yoke-pro`, `mh16-flight-grip`, `mhg-flight-grip`, `mrp-rudder-pedals`, `mtp-throttle`, `mtq-throttle`, `tqa-throttle-module`, `tqb-throttle-module`, `z-axis-twist-module`. `mtq-throttle` gained a backlit-subset note in its evidence notes. `ay90-yoke-base` evidence notes were rewritten for the ways/mode change.

## Conflicts recorded, not resolved

- **MFY weight:** 1.2 kg on the [US product page](https://us.mozaracing.com/pages/mfy-pro-yoke) vs 1.3 kg in the [MFY support article](https://support.mozaracing.com/en/support/solutions/articles/70000679589-moza-mfy-yoke-support). `physical.weight_g` removed (was 1300, which matched the support side only). Re-add when the source is settled.
- **Z-axis sensor:** "16-bit Hall" in the overview and FAQ vs "15-bit (32768 PPR)" in the spec table, on the [Z-axis product page](https://mozaracing.com/products/z-axis-module). Existing wording kept, conflict noted in the YAML.
- **MTQ control count:** "23 physical controls" vs itemised 30 (10 buttons + 3 rotaries + 17 toggles) or 31 with the landing gear lever, on the [MTQ support article](https://support.mozaracing.com/en/support/solutions/articles/70000679590-mtq-throttle-quadrant-support). Itemised counts kept.
- **MH16 inputs:** 30 on the [MH16 support article](https://support.mozaracing.com/en/support/solutions/articles/70000679587-moza-mh16-flightstick-support) and the product page, 27 in the overview. Not used as a physical count.
- **MTQ backlit:** support spec says "6 — RGB-backlit" alongside "10 multifunction buttons"; the subset is not identified. `backlit` left unset rather than applied to all 10.
- **MRP pedals platform:** spec table says "PC", no exclusion wording. Treated as `unknown`, same rule as earlier rounds.

## Unresolved, with reason

**AB6 (ab6-force-feedback-base)**
- `platform.xbox`, `platform.ps5`: support article names PC/USB only; product page says "Platform: PC". No exclusion wording, so `unknown`.
- `hardware.throw_deg`: "±20° roll (X-axis), ±17° pitch (Y-axis)". Per-axis, no per-side or total wording. Unset.
- `controls[1].positions`, `controls[1].center_detent`: sliders are described as analog axis sliders; no detent or position wording.
- `prices` EU/UK/US (base only): no base-only page found. EU `ab6-force-feedback-base` URL returns 404. The bundle prices (EUR 449, GBP 399, USD 399) include the MHG grip and were not used.

**AB9 (ab9-force-feedback-base)**
- `physical.weight_g`, `physical.dimensions_mm`: not in any text on the support, EU, UK or US pages. Dimensions are only in image diagrams ("MOZA AB9 Dimensions", "Product Size Description" bottom/T-slot/table-clamp images). The 5.5 kg and 157×227.9×184 mm on the active-shifter page were not used (shifter page, unclear if base-only).
- `hardware.throw_deg`: "Maximum Limit Angle ±20° (adjustable)". No per-side or total wording.
- `hardware.axes`, `hardware.extension_support`: not stated. Ports listed as "Power, Data, Throttle, Rudder Pedals, etc."; RJ11 not mentioned.

**AY210 (ay210-yoke-base)**
- `controls[0].push`, `momentary`, `positions`: "13 programmable (RGB, telemetry sync, long-press)". No mechanism or latching wording.
- Platforms, weight, dimensions, roll range: already correct.

**AY90 (ay90-yoke-base)**
- `controls[0].push`, `controls[1].push`, `controls[2].positions`, `controls[2].center_detent`, `controls[3].positions`, `controls[3].push`: not described; rocker/slider behaviour absent.
- Platforms `unknown`: PC titles listed, no exclusion.

**MA3X (ma3x-side-stick)**
- `controls[0].stages`: trigger stages not described. `controls[1].push`: hat push not described.
- `controls[2].ways`, `momentary`, `push`: toggle switch count 1 only.
- `hardware.sensor`, `gimbal`, `damping`, `force_adjustable`, `cams_swappable`, `extension_support`, `throw_deg`, `axes`: not stated. Page covers a stick with "5-pin aviation connector", not force feedback.
- `connectivity.usb`: not stated (connector only described as 5-pin aviation).
- `physical.dimensions_mm`: not listed.

**MFY (mfy-yoke-pro)**
- `controls[0].push`, `controls[1].push`, `controls[2].backlit`, `controls[3].stages`, `controls[3].action`: thumbstick push, hat push, trigger stages/action not described. Backlight is "16.7 million-color RGB" cockpit lighting, not per-control.
- `hardware.*` gimbal/sensor/damping/force-adjust: not stated for the handle.
- `connectivity.usb`: connector not stated.
- Platforms `unknown`: no supported platform list; AY210/AY90 bases named.

**MH16 (mh16-flight-grip)**
- `controls[0].stages`, `controls[0].action`: "two-stage" not stated; trigger stage count unknown.
- `controls[1].push`, `controls[2].push`: hat push not stated; paddle described only as "binary button input", no momentary/push.
- `physical.weight_g`: not listed on the support or product pages.
- `connectivity.usb`: not stated (5-pin aviation connector only).
- Platforms: "PC compatible" only; Xbox and PlayStation `unknown`.

**MHG (mhg-flight-grip)**
- `controls[0].action`: trigger action not stated.
- `controls[1].push`: mini stick push not stated.
- `controls[2].backlit`: not stated.
- `controls[3].momentary`, `controls[3].push`, `controls[4].positions`, `controls[4].push`, `controls[4].momentary`: the three "5-way" management switches have no defined arrangement; the 5-way wording is marketing text, not a position count. Left as generic switches.
- `physical.weight_g`, `physical.dimensions_mm`: not listed on the UK product page.
- `connectivity.usb`, `standalone_usb`: not mentioned.
- Hat vs mini-stick conflict (UK page "hat switch", manual "mini stick") from round 3 is unchanged.

**MRP damper (mrp-adjustable-damper)**
- Accessory with no controls, sensors or connectivity per its page. Remaining gaps are inapplicable, not missing. No changes.

**MRP pedals (mrp-rudder-pedals)**
- `controls[1].count` (toe-brake axes 1 vs 2): "differential braking" does not say. Two-axis representation kept and flagged.
- `hardware.throw_deg`: "Rudder Rotation Angle ±30°". Same "±X, unqualified" convention as the other ±X entries, so unset.
- `connectivity.usb`: connector type not stated (RJ11 or USB).

**MTP (mtp-throttle)**
- `controls[1].count` (detents, currently 2): no count on the support or product page; three detent types named (afterburner, idle lockout, centre detents). Existing count 2 kept but unverified.
- `controls[2].push` (thumb joystick): push/click not stated.
- `hardware.gimbal`, `damping`, `force_adjustable`, `cams_swappable`, `extension_support`: not stated. Page mentions "integrated motors with telemetry support" only.
- `connectivity.usb`: connector type not stated.

**MTQ (mtq-throttle)**
- `controls[0].push`, `controls[1].push`, `controls[2].push`: not described.
- `controls[3].backlit`: subset of 10 buttons (6 backlit) with no identification; unset.
- `controls[4].mode`, `positions`, `push`: rotary mode/positions/push not described.
- `controls[5].push`, `controls[6].positions`, `controls[6].push`, `controls[6].momentary`: toggle ways/momentary/push not described.
- `physical.weight_g`: not mentioned.
- `connectivity.usb`: connector not specified.

**TQA (tqa-throttle-module)** and **TQB (tqb-throttle-module)**
- Weight, dimensions, materials, grip count and platforms: not stated on the product pages. TQB TO/GA and lift-to-arm already in YAML.
- `controls[0].push`: no push wording.

**Z-axis (z-axis-twist-module)**
- `hardware.sensor`: 15-bit vs 16-bit conflict (see above).
- `hardware.throw_deg`: "±20° range" with no per-side or total wording. Unset (same as round 3).
- `hardware.extension_support`: the module is itself a 97 mm extension kit; no statement on whether it accepts further extensions. Null.
- `hardware.damping`, `force_adjustable`: not stated. Page lists "self-centering and locking" as supported, which is not a damping or force-adjust field.
- `connectivity.usb`: not stated.
- Platforms `unknown`: "compatible with the MOZA ecosystem and some third-party options"; no platform named.
- `software`: not stated.

## Sources read

Product/support pages: [AB6 support](https://support.mozaracing.com/en/support/solutions/articles/70000684201-ab6-force-feedback-base), [AB6 bundle EU](https://eu.mozaracing.com/products/ab6-bundle/), [AB9 support](https://support.mozaracing.com/en/support/solutions/articles/70000668982-moza-ab9-base-support), [AB9 EU/UK/US](https://eu.mozaracing.com/products/ab9-base), [AB9 UK](https://uk.mozaracing.com/products/ab9-base), [AB9 US](https://us.mozaracing.com/products/ab9-base), [AY210 support](https://support.mozaracing.com/en/support/solutions/articles/70000679586-moza-ay210-yoke-base-support), [AY90 US](https://us.mozaracing.com/pages/ay90-yoke-base), [MFY US](https://us.mozaracing.com/pages/mfy-pro-yoke), [MFY support](https://support.mozaracing.com/en/support/solutions/articles/70000679589-moza-mfy-yoke-support), [MH16 support](https://support.mozaracing.com/en/support/solutions/articles/70000679587-moza-mh16-flightstick-support), [MHG UK](https://uk.mozaracing.com/products/mhg-flightstick), [MA3X support](https://support.mozaracing.com/en/support/solutions/articles/70000679588-moza-ma3x-side-stick-support), [MRP pedals support](https://support.mozaracing.com/en/support/solutions/articles/70000684204-mrp-rudder-pedals), [MTP support](https://support.mozaracing.com/en/support/solutions/articles/70000679591-moza-mtp-throttle-support), [MTQ support](https://support.mozaracing.com/en/support/solutions/articles/70000679590-mtq-throttle-quadrant-support), [TQA EU](https://eu.mozaracing.com/products/tqa-mod), [TQB EU](https://eu.mozaracing.com/products/tqb-mod), [Z-axis](https://mozaracing.com/products/z-axis-module), [Z-axis US](https://us.mozaracing.com/products/z-axis-module), [Product Size Description](https://support.mozaracing.com/en/support/solutions/articles/70000666799-product-size-description).

Regional price pages: UK and US product pages for AY210, AY90, MA3X, MFY, MH16, MHG, MRP pedals, MTP, MTQ, TQA, TQB, Z-axis (links above). AB6 base EU page returned 404.

Validation: all `moza/*.yaml` parse (PyYAML). `pnpm check` reports 234 errors, all from `work/hillclimb/us-sierra-tpm-module.js` (another agent's file, TS 1005). No MOZA file errors appear in the output.
