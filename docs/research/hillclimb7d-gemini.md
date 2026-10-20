# Hillclimb Round 7d Research Notes (gemini4)

**Date:** 2026-10-21  
**Scope:** `vkb` components (`src/content/components/vkb/*.yaml`).  
**Focus:** VKB control inventory completeness (button counts, hat ways, POV/ministick/encoder presence, trigger stages, axes) and missing control counts across all VKB grip, base, and module records.  
**Sources:** Official VKB product pages (`vkb-sim.pro`, `vkbsimcontrollers.com`), official VKB user manuals and button-map templates (`cdn.shopify.com` downloads repository and UntoldForce official layout templates), and authorized dealers' technical listings (`flightsimcontrols.com`, `flightsimcontrols.co.uk`).

---

## 1. Context & Prior Audits

This round builds directly upon:
- `docs/research/unknowns-vkb-round3-luna.md`
- `docs/research/hillclimb-vkb-slaw.md`, `hillclimb2-vkb.md`, `hillclimb3-vkb.md`
- `docs/research/hillclimb6b-gemini.md`
- `docs/research/hillclimb6-audit-luna.md` (which removed unsupported negative hardware fields and explicit nulls where vendor pages were silent)

No unsupported negative assertions (`throw_deg: null`, `cams_swappable: false`, etc.) were re-added. All control counts and mechanics recorded below are directly attested by official manufacturer product pages or official labeled button-map templates.

---

## 2. Control Inventory Updates & Missing Counts Resolved

Across the 52 VKB component records, exactly 15 records contained control entries that lacked an explicit `count` attribute (which relied on schema defaulting to 1, causing discrepancies in inventory completeness). In addition, one record (`mcg-ultimate-add-on-grip-gunfighter-mk-iii.yaml`) had an accidental omission in its `hardware.axes` list where `Trimmer Y` was missing despite `axis_count: 5`.

All 15 records were updated with verified physical control counts and axis specifications confirmed against first-party VKB documentation:

### 1. F-14 Combat Grip (`f14-combat-grip.yaml`)
- **Source:** [VKB US GNX F-14 Add-On Grip](https://vkbsimcontrollers.com/products/gnx-f-14-add-on-grip-us) & [VKB FSC Europe](https://flightsimcontrols.com/product/f-14-stand-alone-grip-for-gladiator/)
- **Controls Updated:**
  - `controls[1]` (Dual-stage trigger): added `count: 1` (`stages: 2`, `action: sequential`).
  - `controls[2]` (Emergency Autopilot Disable trigger): added `count: 1` (`stages: 1`, `action: sequential`).
  - `controls[3]` (DLC maneuver wheel): added `count: 1` (`kind: other`, `analog: true`, `push: false`).
  - `controls[4]` (Four-stage ammo selector with safety lock and push): added `count: 1` (`mode: selector`, `positions: 4`, `push: true`).
- **Complete Inventory:** 1x 4-way trim hat with center push, 1x dual-stage trigger, 1x emergency autopilot disable trigger, 1x analog DLC wheel axis, 1x 4-position ammo selector with push, 4x programmable soft-click buttons.

### 2. Gladiator NXT EVO Base (`gladiator-nxt-evo-base.yaml`)
- **Source:** [VKB US Gladiator NXT EVO - Base Only](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-base-only-us)
- **Controls Updated:**
  - `controls[0]` (Auto-centering switch): added `count: 1` (`ways: 3`, `momentary: true`, `push: false`).
  - `controls[1]` (Throttle wheel): added `count: 1` (`mode: analog`, `push: false`).
  - `controls[2]` (Rotary encoder): added `count: 1` (`push: false`).
- **Complete Inventory:** 1x 3-position auto-centering toggle switch, 1x analog throttle wheel, 1x rotary encoder, 3x programmable base push buttons.

### 3 & 4. Gladiator NXT EVO Omni-Throttle Left & Right Hand (`gladiator-nxt-evo-omni-throttle-l.yaml`, `gladiator-nxt-evo-omni-throttle-r.yaml`)
- **Source:** [VKB US Gladiator NXT EVO Omni Throttle LH](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-omni-throttle-left-hand-us) & [RH](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-omni-throttle-right-hand-us), [VKB Official SCG OTA Template](https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-Gladiator-SCG-OTA-LH-v1.0_bf7bdf6c-2162-4c44-aa6a-34af80c25c34.pdf)
- **Controls Updated:**
  - `controls[0]` (Dual-action trigger): added `count: 1` (`stages: 2`, `action: sequential`).
  - `controls[1]` (Rapid-fire trigger): added `count: 1` (`stages: 2`, `action: bidirectional`).
  - `controls[3]` (Eight-way analog ministick): added `count: 1` (`push: true`).
  - `controls[6]` (Auto-centering switch): added `count: 1` (`ways: 3`, `momentary: true`, `push: false`).
  - `controls[7]` (Throttle wheel): added `count: 1` (`mode: analog`, `push: false`).
  - `controls[8]` (Rotary encoder): added `count: 1` (`push: false`).
- **Complete Inventory:** 1x dual-stage main trigger, 1x bidirectional rapid-fire trigger, 3x 4-way center-push hats, 1x 8-way analog ministick with push, 4x programmable grip buttons, 1x C1 button module, 1x 3-position auto-centering toggle switch, 1x analog throttle wheel, 1x rotary encoder, 3x base buttons.

### 5 & 6. GNX SCG Premium Grip with OTA Left & Right Hand (`gnx-scg-premium-grip-with-ota-l.yaml`, `gnx-scg-premium-grip-with-ota-r.yaml`)
- **Source:** [VKB US GNX SCG Premium Grip with OTA Preinstalled](https://vkbsimcontrollers.com/products/gnx-scg-premium-grip-with-ota-preinstalled-us), [VKB Official SCG OTA Template](https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-Gladiator-SCG-OTA-LH-v1.0_bf7bdf6c-2162-4c44-aa6a-34af80c25c34.pdf)
- **Controls Updated:**
  - `controls[0]` (Main dual-action trigger): added `count: 1` (`stages: 2`, `action: sequential`).
  - `controls[1]` (Rapid-fire trigger): added `count: 1` (`stages: 2`, `action: bidirectional`).
  - `controls[3]` (A1 analog ministick with push): added `count: 1` (`push: true`).
- **Complete Inventory:** 1x dual-action main trigger, 1x bidirectional rapid-fire trigger, 3x 4-way center-push hats, 1x A1 analog ministick with push, 3x installed grip buttons.

### 7. KG12 WWII Grip (`kg12-wwii-grip.yaml`)
- **Source:** [VKB US GNX KG12 Add-On Grip](https://vkbsimcontrollers.com/products/gnx-kg12-add-on-grip-us)
- **Controls Updated:**
  - `controls[0]` (Folding metal trigger): added `count: 1` (`stages: 1`, `action: flip`).
  - `controls[1]` (Pinky metal lever): added `count: 1` (`kind: other`, `analog: false`, `push: true`).
  - `controls[2]` (8-way hat switch): added `count: 1` (`ways: 8`, `push: false`).
  - `controls[3]` (Bomb release button): added `count: 1` (`backlit: false`).
  - `controls[4]` (Side button): added `count: 1` (`backlit: false`).
- **Complete Inventory:** 1x single-stage folding metal trigger, 1x digital pinky lever button, 1x 8-way hat switch (without push), 1x bomb release button, 1x side button.

### 8. MCG Ultimate Add-On Grip for Gunfighter Mk.III (`mcg-ultimate-add-on-grip-gunfighter-mk-iii.yaml`)
- **Source:** [VKB US MCG Ultimate Add-On Grip](https://vkbsimcontrollers.com/products/mcg-ultimate-add-on-grip-for-gunfighter-mk-iv-us), [VKB Official MCGU Template v1.2](https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-Gunfighter-MCGU-v1.2_c3f70829-8f40-4db1-b9d0-0a92706b5194.pdf)
- **Controls Updated:**
  - `controls[0]` (Main trigger): added `count: 1` (`stages: 2`, `action: sequential`).
  - `controls[1]` (Metal folding trigger): added `count: 1` (`stages: 2`, `action: flip`).
  - `controls[2]` (Brake lever): added `count: 1` (`kind: brake`, `analog: true`, `push: false`).
- **Hardware Axes Restored:** Added `Trimmer Y` (`name: Trimmer Y`, `sensor: contactless_magnetic`) to `hardware.axes`, restoring the full 5-axis inventory (`Slew X`, `Slew Y`, `Trimmer X`, `Trimmer Y`, `Brake`) corresponding to `axis_count: 5` and first-party specifications.
- **Complete Inventory:** 1x dual-stage main trigger, 1x two-position metal folding trigger, 1x analog brake lever, 2x 2-axis analog ministicks with push (Slew and Trimmer), 3x 4-way center-push hats (MANVR, RESET, DC), 4x push buttons.

### 9. MCG Ultimate Grip (`mcg-ultimate-grip.yaml`)
- **Source:** [VKB US MCG Ultimate Add-On Grip](https://vkbsimcontrollers.com/products/mcg-ultimate-add-on-grip-for-gunfighter-mk-iv-us), [VKB Official MCGU Template v1.2](https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-Gunfighter-MCGU-v1.2_c3f70829-8f40-4db1-b9d0-0a92706b5194.pdf)
- **Controls Updated:**
  - `controls[0]` (Main trigger): added `count: 1` (`stages: 2`, `action: sequential`).
  - `controls[1]` (Metal folding trigger): added `count: 1` (`stages: 2`, `action: flip`).
  - `controls[2]` (Brake lever): added `count: 1` (`kind: brake`, `analog: true`, `push: false`).
- **Complete Inventory:** 1x dual-stage main trigger, 1x two-position metal folding trigger, 1x analog brake lever, 2x 2-axis analog ministicks with push, 3x 4-way center-push hats, 4x push buttons.

### 10 & 11. Space Combat Grip (SCG) Premium Left & Right (`scg-space-combat-grip-l.yaml`, `scg-space-combat-grip-r.yaml`)
- **Source:** [VKB FSC Europe](https://flightsimcontrols.com/product/scg-kosmosima-premium-stand-alone-grip-gladiator/) & [VKB US GNX SCG Add-On Grip](https://vkbsimcontrollers.com/products/gnx-scg-add-on-grip-us), [VKB Official SCG Templates](https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-Gladiator-SCG-LH-v1.0_7b163c32-85ad-493a-ad90-2d281f285b9e.pdf)
- **Controls Updated:**
  - `controls[0]` (Main dual-action trigger): added `count: 1` (`stages: 2`, `action: sequential`).
  - `controls[1]` (Rapid-fire trigger): added `count: 1` (`stages: 2`, `action: bidirectional`).
  - `controls[3]` (A1 analog ministick): added `count: 1` (`push: true`).
- **Complete Inventory:** 1x dual-action main trigger, 1x bidirectional rapid-fire trigger, 3x 4-way center-push hats, 1x A1 analog ministick with push, 3x installed buttons.

### 12, 13, 14, 15. STECS Modern Throttle Systems (Mini, Mini Plus, Standard, Max)
- **Files:** `stecs-throttle-mini.yaml`, `stecs-throttle-mini-plus.yaml`, `stecs-throttle-standard.yaml`, `stecs-throttle-max.yaml`
- **Source:** [VKB US STECS Mk.II Store Pages](https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-standard-us) & [VKB Official STECS Template v1.1](https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-STECS-v1.1.pdf)
- **Control Updated:**
  - `controls[2]` (`type: analog_ministick`, label: MTG-R analog ministick): added `count: 1` (`push: true`).
- **Complete Inventory:** Explicit counts verified across all installed grip, base, and expansion module controls (STEM, ATEM).

---

## 3. Verification & Completeness Audit

- **All 52 VKB component records** were re-scanned:
  - `controls_evidence.coverage`: verified as `complete` across all records.
  - Missing control counts: 0 remaining across all records.
  - Hat specifications: all 4-way and 8-way hats possess explicit `ways` and `push` booleans.
  - Trigger specifications: all triggers possess explicit `stages` and `action` classifications.
  - Ministicks & Encoders: all ministicks and encoders have explicit `push` attributes.
  - Hardware axes: all axis lists match `hardware.axis_count` exactly.
- **Verification Status:**
  - Maintained `verification: draft` on all draft records.
  - Preserved `verification: verified` on existing hands-on benchmark records (`gladiator-nxt-evo-base.yaml`, `scg-space-combat-grip-r.yaml`, `t-rudder-mk5.yaml`).
- **Validation:**
  - `pnpm check`: 0 errors, 0 warnings.
  - `pnpm test`: 45 passed (45).
