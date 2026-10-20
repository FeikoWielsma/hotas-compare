# MOZA hillclimb3: physical control counts

Checked 2026-10-20. Scope: `src/content/components/moza/*.yaml` and `public/images/moza/`. Only physical controls are counted (buttons, hats, rotaries, triggers, levers, switches). Weights, dimensions and prices are not used. Counts come from official MOZA user manuals (PDF on `cdn.shopify.com`, linked from the MOZA support pages), product photos and MOZA Cockpit "Button Number" diagrams. Diagrams were rendered and read visually.

## Filled or corrected

| Record | Change | Source and basis |
|---|---|---|
| `mh16-flight-grip` | Controls rebuilt: 3 buttons (weapon release, NWS, FOV), 2 hats (trim, DMS), 1 two-stage trigger, 2 switches (TMS, CMS), 1 paddle. Was 1 hat, 1 trigger, 1 paddle. | [MH16 manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_mh16_flightstick_manual.pdf) p.2 diagram; p.7 lists "two-stage trigger". The detachable side module (5-way hat + 3-position selector) is excluded, as in the earlier record. |
| `ma3x-side-stick` | Added 1 A/P button. Existing trigger (MIC), hat (view control) and toggle (auxiliary) kept. | [MA3X manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_ma3x_side_stick_manual.pdf) p.2 "Buttons" diagram. The hat's "8 ways" value was not re-verified. |
| `ma3f-efcm` (new controls) | 6 backlit pushbuttons (AP1, AP2, A/THR, LOC, EXPED, APPR), 3 round pushbuttons (SPD MACH, HDG TRK/V-S FPA, METRIC ALT), 3 rotaries, 1 rotary with push (V/S "push to level off"). 13 controls total. | [MA3F EFCM manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MOZA_MA3F_Electronic_Flight_Control_Modules_User_Manual.pdf) cover panel photo. Push state of the three other knobs is not stated. |
| `ma3f-fcd` (new controls) | 74 keys: 12 bezel line-select, 14 function, 6 airport/blank/arrow, 42 alphanumeric. Top row of 5 lamps not counted. | [MA3F FCD manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MOZA_MA3F_Flight_Computer_Display_User_Manual.pdf) cover photo at 300 dpi. Manual has no further diagrams. |
| `mb7f-fcd` (new controls) | 70 keys: 12 bezel line-select, 16 function, 42 alphanumeric. | [MB7F manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MOZA_MB7F_Flight_Computer_Display_User_Manual.pdf) cover photo, checked at higher zoom. |
| `mgx1000` (new controls) | 9 rotaries (8 with push, ALT without a stated push), 32 buttons: 12 left grid, 6 right grid, 12 bottom softkeys, 2 transfer buttons. | [MOZA product hero image](https://us.mozaracing.com/products/mgx1000) (MGX1000InstrumentPanel-1, 2000 px) and MOZA Cockpit diagram in the [MGX1000 manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MOZA_MGX1000_Instrument_Panel_User_Manual.pdf). The 7-way ALPS joystick named on the product page is not visible in either image, so it is omitted. |
| `mfy-yoke-handle` (centre panel) | Added 8 centre-panel buttons. Existing 2 hats, 2 ministicks, 2 bumpers, 2 triggers kept. | [MFY Yoke Handle manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MFY-Yoke-Handle-Manual-EN.pdf) p.1 photo; MOZA Cockpit "Button Number" diagram in the [AY210 manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_ay210_ffb_yoke_base_manual.pdf) p.5, which numbers the 8 panel buttons 5 to 12. |

## Product images added (`public/images/moza/`, 1000–1200 px webp)

- `mtlp-panel.webp` (product page hero)
- `ma3f-efcm.webp` (MA3F EFCM product image)
- `ma3f-fcd.webp` (MA3F FCD product image)
- `mb7f-fcd.webp` (MB7F FCD product image)
- `mgx1000.webp` (MGX1000 hero)
- `mfy-yoke-handle.webp` (MFY block image)
- `z-axis-twist-module.webp` (Z-axis product page image)

`ay210-yoke-base` still has no image. Its support page was scraped but its images were not checked, so none was added.

## Confirmed without change

- `ab9-force-feedback-base`: `controls: []` kept. The manual lists only the base's connection ports. The power switch is excluded as a device input.
- `mrp-adjustable-damper`: no controls (accessory).
- `mrp-rudder-pedals`: 1 rudder axis, 2 toe-brake axes. No manual available here; no change.

## Unresolved, with reason

- **MTQ** (`mtq-throttle`): the manual's software diagram is too small to count. Sources conflict: 23 physical controls on the [support article](https://support.mozaracing.com/en/support/solutions/articles/70000679590-mtq-throttle-quadrant-support), 30 or 31 when itemised. Itemised counts are kept (10 buttons, 3 rotaries, 17 toggles, plus levers). Not verified.
- **MH16 inputs 30 vs 27**: these are signal counts, not physical controls. They are not used.
- **AY210** (`ay210-yoke-base`): the manual says 13 programmable panel switches. The Cockpit diagram in the [AY210 manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_ay210_ffb_yoke_base_manual.pdf) p.5 shows about 15 numbered positions, and the image is too low-resolution to settle the count. Kept at 13.
- **MTLP** (`mtlp-panel`): the product image shows about 9 distinct physical controls (launch bar, flap, LDG/taxi light, anti-skid, JETT selector and push, red lever cap, yellow lever, HOOK lever, EMERG BRK pull, PARK BRK/TURN pull). No manual was found. The record's 25 "switch signals" is a signal count and is not a physical count. Left as is. Source: [MTLP product page](https://us.mozaracing.com/products/mtlp-panel).
- **AY90** (`ay90-yoke-base`): no manual was found in the support pages. Counts are unchanged from round 4.
- **AB6** (`ab6-force-feedback-base`): no manual found. Counts unchanged (8 buttons, 2 sliders).
- **MHG** (`mhg-flight-grip`): no manual found. Counts unchanged.
- **MTP** (`mtp-throttle`): manual is in the cache but was not checked in this pass. Counts unchanged.
- **MFY Yoke Pro** (`mfy-yoke-pro`): the Pro manual's cover page shows the same handle family, but it was not verified. The record lacks the 8 centre-panel buttons seen on the MFY handle. Counts unchanged.
- **TQA / TQB**: no manual downloaded. Counts unchanged.
- **Z-axis**: 1 analog twist axis, no discrete controls. No change.

## Checks

- All `moza/*.yaml` files parse with PyYAML (0 errors).
- `pnpm check` fails before reaching the MOZA files. Astro stops on `src/content/components/vkb/gnx-fsm-ga.yaml` (line 38, "Nested mappings are not allowed in compact mappings", notes field). That file is outside this task's scope and was not edited. No error in the output mentions MOZA. Astro stops at the first content parse error, so MOZA schema validation has not run through Astro. Run `pnpm check` again once the VKB file is fixed.
