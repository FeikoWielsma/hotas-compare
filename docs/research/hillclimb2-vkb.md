# VKB hillclimb 2: catalog sweep and new records

Date: 2026-10-20. Scope: `src/content/components/vkb/*.yaml`, `public/images/vkb/`, this file.
Sources: official VKB US store (vkbsimcontrollers.com, 134 products across 6 pages), VKB AU store
(vkb-sim.com.au), official VKB templates on the VKB Shopify CDN, and the VKB platform FAQ already cited by existing records.
The EU store (vkb-sim.pro) returned 404 and was not swept; the AU store lists only bundles and grips already covered.

## Added (21 records, all `verification: draft`, US prices only)

| Record | Inventory basis | Notes |
| --- | --- | --- |
| `gnx-thq` GNX THQ Throttle Quadrant | THQ template + product page | 3 analog levers, 8 buttons, no hats |
| `gnx-thq-v` GNX THQ-V (Vertical) | THQ-V template + product page | Same counts as THQ |
| `gnx-fsm-ga` GNX FSM-GA | FSM-GA template + product page | 16 buttons, 2 push encoders, 1 wheel encoder |
| `gnx-sem-v` GNX SEM-V (Vertical) | SEM-V template + product page | 2 multi-function levers, 4-pos selector, 2 K-switches with push, 7 buttons |
| `gnx-mfh` GNX MFH | Product page | Passive holder, no controls |
| `stecs-throttle-mini-plus` STECS Mk.II Mini Plus | Mini record + ATEM template/page | Mini grip/base + ATEM |
| `gnx-usb-controller-hid-main` GNX USB Controller (HID-Main) | Product page | Electronics, no controls |
| `stecs-stg-grip-l` STECS STG Left-Hand | STG-L template + product page | Partial, see unresolved |
| `stecs-stem` STECS STEM | STEM template + product page | 8 buttons, 2 K-switches, 2 push encoders, 2 flip switches |
| `stecs-atem` STECS ATEM | ATEM template + product page | 6 buttons, 4-way rotary with push |
| `blackbox-mk2` BlackBox Mk2 | Product page | Electronics, no controls, no US price on page |
| `blackbox-mk3` BlackBox Mk3 | Product page | Electronics, no controls |
| `mcg-pro-add-on-grip-gunfighter-mk-iv` MCG Pro (Gunfighter Mk.IV) | Product page only | Partial, no official template found |
| `wwii-gnx-thq-add-on-grip` WWII GNX THQ Add-On Grip | WWII THQ template + product page | 4 buttons, 1 K-switch rocker |
| `kg12-gf-gen-1-add-on-grip-for-gunfighter-mk-iii` KG12 GF Gen.1 (Mk.III) | Product page | Distinct from Gen.2 (4-way hat, profile pinky) |
| `stecs-space-throttle-system-mini` / `-mini-plus` / `-standard` / `-max` | Base + STG-L + ATEM/STEM templates + product pages | Left-hand build only (see notes) |
| `stecs-modern-throttle-grip-premium-combo` / `-standard-combo` | Product pages (Standard matches Mini/Max grip halves) | Left-hand; Premium partial |

Photos: official product images from the VKB CDN, converted to JPG, saved as `public/images/vkb/<name>.jpg`.
MCG Pro photo is `mcg-pro-add-on-grip-for-gunfighter-mk-iv.jpg` (record file name is shorter).

Checks: all 35 VKB records parse as YAML and validate against `ComponentSchema`
(`src/lib/schema.ts`). All image references resolve. All VKB bundle component references resolve.

## Already covered (no new record)

The following US-store SKUs share a source URL or hardware with an existing record:

- GNX F-14 Add-On Grip: `f14-combat-grip` (source is the same URL)
- GNX KG12 Add-On Grip (sold out): `kg12-wwii-grip`
- GNX SCG Add-On Grip, Premium variant: `scg-space-combat-grip-l/r`
- MCG Ultimate Add-On Grip for Gunfighter Mk.IV: `mcg-ultimate-grip`
- Base Only products: `gladiator-nxt-evo-base`, `gunfighter-iv-base`
- STECS Mini / Standard / Max, Modern Throttle System Mk.II: existing STECS records
- T-Rudders Mk.V Rudder Pedals (sold out): `t-rudder-mk5`

## Excluded: passive accessories, spares, mounts, cables, adapters

These have no control inventory. I did not add them, since the category enum has no accessory type and they would
pollute the compare view. This is a judgement call. Tell me if you want them added as `module` records with `controls: []`
(the MFH precedent).

- Cables, pads, springs, screws, covers, couplers, spacers, plates: GNX Module Coupler, Plastic Spacers, Side Wall Cover,
  Module-to-Module cables, Intermodular Reinforcing Plate, adhesive rubber pads, STECS rubberized pads, STEM Back Cover,
  BUS Cover, Gladiator NXT Springs, Gunfighter Springs, Gunfighter Grip Fasteners, Grip Stand, Gunfighter BlackBox
  Interface Cable, Small Baseplate.
- Upgrade and conversion kits: Gladiator NXT to EVO upgrade, F-14 RevB to RevC, KG12 RevB to RevC, MCG Pro/Ultimate
  RevB to RevC, SCG Grip Upgrade, SCG Standard to Premium, STECS Mk.II Grip Upgrade, STECS Button Module Upgrade,
  SCG Grip Conversion Kits (GF2GNX, GNX OTA, GNX2GF).
- Adapters and cams: Omni Throttle Adapter (OTA) for Gunfighter Mk.II/III and IV, Warthog Adapter for Gunfighter,
  Twist Adapters (contain a MaRS Z-axis sensor; decide if the Z axis should be recorded as an accessory axis), Gunfighter
  Avia/Combo/Space Cams Kits, Gunfighter Extension Kit, UCM Adapter Plates.
- Mounts and desk gear: UCM-S and UCM-L mounts, UCM Universal Mounting Plate, UCM Cupholder, Keyboard Holder, Phone
  Holder, Mounting Panel, Stronghold, STECS Accessory Magazine, STECS MFH Fixture, STECS Detent Frames Module,
  STECS 3-Position Switch Replacement Module.

## Excluded: bundles (out of scope, not created)

The following exact SKUs are bundles and belong in `src/content/bundles/vkb/`. Edits outside `components/vkb/` were out of scope.

- Gunfighter Mk.IV Tabletop bundles: Space Combat Edition (Left and Right), WWII Combat Edition, F-14 Combat Edition, Modern
  Combat Edition (plus Ultimate EN/RU and Pro variants)
- GNX Dual THQ + FSM-GA, Dual THQ + SEM + FSM-GA, Dual THQ + SEM-V + THQ-V, Dual THQ + SEM-V, Triple THQ + FSM-GA,
  Triple THQ + SEM-V, GNX WWII Throttle Combo
- Gladiator NXT EVO F-14 Combat Edition, WWII Combat Edition
- STECS Space Throttle system bundles beyond the four records above

## Remaining: SKUs not yet cataloged

Same hardware as an existing record, but a separate SKU with a different connector, version, or variant. These need their own
records if you want every purchasable SKU, and each needs its own verification:

- F-14 Add-On Grip for Gunfighter Mk.IV (same hardware as the GNX F-14 record; page: https://vkbsimcontrollers.com/products/f-14-add-on-grip-for-gunfighter-mk-iv-us)
- F-14 Add-On Grip for Gunfighter Mk.III (https://vkbsimcontrollers.com/products/f-14-add-on-grip-for-gunfighter-mk-iii)
- KG12 (Gen.2) Add-On Grip for Gunfighter Mk.IV (https://vkbsimcontrollers.com/products/kg12-gf-gen-2-add-on-grip-for-gunfighter-iv-us)
- KG12 (Gen.2) Add-On Grip for Gunfighter Mk.III (https://vkbsimcontrollers.com/products/kg12-gen-2-add-on-grip-for-gunfighter-mk-iii)
- MCG Pro Add-On Grip for Gunfighter Mk.III (https://vkbsimcontrollers.com/products/mcg-pro-add-on-grip-for-gunfighter-mk-iii; page lists RevB grip)
- MCG Ultimate Add-On Grip for Gunfighter Mk.III (https://vkbsimcontrollers.com/products/mcg-ultimate-add-on-grip-for-gunfighter-mk-iii; 24-32 buttons depending on hat module)
- SCG Add-On Grip for Gunfighter Mk.IV and Mk.III, Standard variant (https://vkbsimcontrollers.com/products/scg-add-on-grip-for-gunfighter-mk-iv-us). The Standard grip is not cataloged as its own variant, and its handedness needs checking.
- GNX SCG Premium Grip with OTA Preinstalled (https://vkbsimcontrollers.com/products/gnx-scg-premium-grip-with-ota-preinstalled-us)
- STECS Space Throttle right-hand configurations (the same SKU pages list an STG-R grip and a right-hand base with one analog axis)

## Unresolved fields (left unset)

- **GNX THQ / THQ-V / FSM-GA / SEM-V / STEM / ATEM / HID-Main / MFH**: `hardware.sensor`, dimensions and weight not published on the product pages, and no physical spec sheet located. Release year not stated. Button backlighting not stated for any of these. Source: https://vkbsimcontrollers.com/products/gnx-thq-throttle-quadrant-us
- **FSM-GA VS wheel encoder**: push not stated on the template or page. Source: https://vkbsimcontrollers.com/products/gnx-fsm-ga-front-switchboard-module-general-aviation-us
- **SEM-V lever positions**: template shows flap positions 1-4 but the product page doesn't assign a count. Left unset, matching the horizontal SEM. Source: https://vkbsimcontrollers.com/products/gnx-sem-v-side-extension-module-vertical-us
- **STG grip triggers and hats**: trigger stages and action not stated. The STG template labels Throttle, Brake and Laser beside the STG axes, which the product page does not match (two analog axes). Source: https://vkbsimcontrollers.com/products/stecs-space-throttle-add-on-grip-stg-left-hand-us
- **STG and MTG hat push**: template center-push symbols recorded as push for STG hats; MTG combo hats follow the Mini record. Trigger stages on MTG grips are not stated (`stages: 1` inherited from Mini; unverified for combos).
- **MCG Pro**: no official template. Ministick push, button backlight, and grip/base dimensions unknown. Twist variant Z axis not counted. Source: https://vkbsimcontrollers.com/products/mcg-pro-add-on-grip-for-gunfighter-mk-iv-us
- **MFH**: passive, so platform compatibility is recorded as `unknown` with a note rather than `unsupported`.
- **BlackBox Mk2 price**: not shown on the product page as fetched. Source: https://vkbsimcontrollers.com/products/blackbox-mk2
- **STECS Mini Plus dimensions**: official drawing (`STECS-MiniPlus.pdf`) gives overall numbers that do not clearly map to W/D/H. Left unset. Source: https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-mini-plus-us
- **Space Throttle systems**: recorded as the left-hand build only. The same SKU pages also offer right-hand builds (one analog base axis, STG-R grip), which are a different inventory. Source: https://vkbsimcontrollers.com/products/stecs-space-throttle-system-mini-us
- **Premium MTG combo**: no official template in the downloads. Inventory from the product page only. Source: https://vkbsimcontrollers.com/products/stecs-modern-throttle-grip-premium-combo-us

## Other notes

- Prices: US store only (USD, `incl_vat: false`, verified 2026-10-19). EU and UK prices not fetched.
- The MCG Pro price on the store page is "From $136.00". Recorded as 136 with the variant caveat in notes.
- `pnpm check` does not pass, but the failure is outside this scope: `src/content/components/moza/mh16-flight-grip.yaml` (line 42, nested mapping in notes) is in the uncommitted working tree and fails Astro's content parse. The VKB records all pass.
- Scratch files are under `work/vkb-hillclimb2/` (downloads, renders, validation scripts). No deletions, no resets, no commits.
