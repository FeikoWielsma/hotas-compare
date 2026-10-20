# VKB Hillclimb 3: Comprehensive Catalog Expansion and Unknowns Resolution

**Date:** 2026-10-20  
**Scope:** `src/content/components/vkb/*.yaml`, `src/content/bundles/vkb/*.yaml`, `public/images/vkb/`, this notes file.  
**Sources:** Official VKB US Store (`vkbsimcontrollers.com`), official VKB EU Store (`flightsimcontrols.com`), official VKB Australia Store (`vkb-sim.com.au`), and official VKB control templates & manuals (Shopify CDN / VKB downloads repository).

---

## 1. Summary of Completed Work

1. **Same-Hardware Mk.III / Mk.IV Add-on SKUs Added (12 component records):**
   - `f14-add-on-grip-gunfighter-mk-iv.yaml` & `f14-add-on-grip-gunfighter-mk-iii.yaml`: F-14 Combat Grips for Gunfighter Mk.IV (Rev.C) and Mk.III (Rev.B). Includes dual-stage trigger, single-stage emergency autopilot trigger, 4-way hat with push, 4-position ammo selector with push, 4 buttons, DLC maneuver wheel axis, and lockable twist Z-axis.
   - `kg12-gen-2-add-on-grip-gunfighter-mk-iv.yaml` & `kg12-gen-2-add-on-grip-gunfighter-mk-iii.yaml`: KG12 Gen.2 Grips for Gunfighter Mk.IV (Rev.C) and Mk.III (Rev.B). Features single-stage folding metal trigger, pinky metal lever button, bomb release button, 8-way hat switch without push, side button, and lockable twist Z-axis.
   - `mcg-pro-add-on-grip-gunfighter-mk-iii.yaml`: Modern Combat Grip Pro for Gunfighter Mk.III (Rev.B). Features 24 programmable non-backlit buttons (OMRON/ALPS), 2 analog ministicks with integrated center push, analog brake lever axis, dual-stage main trigger, and 2-position metal folding trigger.
   - `mcg-ultimate-add-on-grip-gunfighter-mk-iii.yaml`: Modern Combat Grip Ultimate for Gunfighter Mk.III (Rev.B). Features all-metal CNC aluminum construction, dual-stage main trigger, 2-position folding trigger, analog brake lever, 2 analog ministicks with push, three 4-way hats with push, and 4 buttons.
   - `scg-standard-grip-gunfighter-mk-iv-l.yaml` & `scg-standard-grip-gunfighter-mk-iv-r.yaml`: SCG Standard Add-On Grips for Gunfighter Mk.IV (Rev.C) in Left- and Right-handed variants.
   - `scg-standard-grip-gunfighter-mk-iii-l.yaml` & `scg-standard-grip-gunfighter-mk-iii-r.yaml`: SCG Standard Add-On Grips for Gunfighter Mk.III (Rev.B) in Left- and Right-handed variants.
   - `gnx-scg-premium-grip-with-ota-l.yaml` & `gnx-scg-premium-grip-with-ota-r.yaml`: GNX SCG Premium Grips with preinstalled Omni Throttle Adapter (OTA) for Gladiator NXT/EVO in Left- and Right-handed variants.

2. **Right-Hand STECS Space Configurations Added (5 component records):**
   - `stecs-stg-grip-r.yaml`: Standalone right-handed Space Throttle Grip (STG-R). Features built-in X/Y gimbal (2 axes), two 5-way hats with push, two 3-way hats with push, two non-backlit buttons, single-stage trigger, and encoder wheel with push.
   - `stecs-space-throttle-system-mini-r.yaml`: Right-hand STECS base with 1 analog main throttle axis + STG-R grip + 2 base buttons + 5-position rotary switch (total 3 analog axes: Throttle_Right, STG(x), STG(y)).
   - `stecs-space-throttle-system-mini-plus-r.yaml`: Right-hand base (1 axis) + STG-R + ATEM module (6 buttons, 4-way directional rotary encoder with push).
   - `stecs-space-throttle-system-standard-r.yaml`: Right-hand base (1 axis) + STG-R + STEM module (8 buttons, 2 K-switches with push, 2 push encoders, 2 3-way flip switches).
   - `stecs-space-throttle-system-max-r.yaml`: Right-hand base (1 axis) + STG-R + STEM module + ATEM module.
   *(Key distinction documented: STECS Left-Hand base features dual throttle levers with 2 analog axes; STECS Right-Hand base features a single throttle lever with 1 analog axis).*

3. **Official Bundle SKUs Added (15 bundle records in `src/content/bundles/vkb/`):**
   - `gunfighter-iv-tabletop-modern-combat-edition.yaml`: Gunfighter Mk.IV Base + MCG Pro Add-on Grip.
   - `gunfighter-iv-tabletop-space-combat-edition-l.yaml`: Gunfighter Mk.IV Base + SCG Premium Left Grip.
   - `gunfighter-iv-tabletop-space-combat-edition-r.yaml`: Gunfighter Mk.IV Base + SCG Premium Right Grip.
   - `gunfighter-iv-tabletop-f-14-combat-edition.yaml`: Gunfighter Mk.IV Base + F-14 Add-on Grip.
   - `gunfighter-iv-tabletop-wwii-combat-edition.yaml`: Gunfighter Mk.IV Base + KG12 Gen.2 Add-on Grip.
   - `gladiator-nxt-evo-f-14-combat-edition.yaml`: Gladiator NXT EVO Base + GNX F-14 Combat Grip.
   - `gladiator-nxt-evo-wwii-combat-edition.yaml`: Gladiator NXT EVO Base + GNX KG12 WWII Grip.
   - `gnx-dual-thq-fsm-ga-combo.yaml`: 2x GNX THQ + GNX FSM-GA + GNX MFH.
   - `gnx-dual-thq-sem-fsm-ga-combo.yaml`: 2x GNX THQ + GNX SEM + GNX FSM-GA + GNX MFH.
   - `gnx-dual-thq-sem-v-thq-v-combo.yaml`: 2x GNX THQ + GNX SEM-V + GNX THQ-V + GNX MFH.
   - `gnx-dual-thq-sem-v-combo.yaml`: 2x GNX THQ + GNX SEM-V + GNX MFH.
   - `gnx-triple-thq-fsm-ga-combo.yaml`: 3x GNX THQ + GNX FSM-GA + GNX MFH.
   - `gnx-triple-thq-sem-v-combo.yaml`: 3x GNX THQ + GNX SEM-V + GNX MFH.
   - `gnx-wwii-throttle-combo.yaml`: GNX THQ + WWII GNX THQ Add-on Grip + GNX USB Controller (HID-Main).
   - `stecs-space-throttle-gladiator-hosas.yaml`: STECS Space Throttle Standard + Gladiator NXT EVO Base + SCG Premium Right Grip.

4. **Filled Remaining Unset Fields Across 35 Existing VKB Records:**
   - Visual inspection of official templates (`VKB-FSM-GA-v1.0.pdf`, `VKB-SEM-V-v1.0.pdf`, `VKB-THQ-v1.0.pdf`, `VKB-STECS-v1.1.pdf`, `VKB-STECS-SpaceThrottleGrip-LH/RH-v1.0.pdf`):
     - `gnx-fsm-ga`: VS wheel encoder confirmed without push (`push: false`, template labels ˄, ˅ without ʘ symbol); all 16 buttons confirmed non-backlit (`backlit: false`).
     - `gnx-sem-v`: MaRS contactless magnetic sensors verified on Flaps (4 positions) and Gear (3 positions) levers; buttons confirmed non-backlit.
     - `gnx-thq` & `gnx-thq-v`: Contactless MaRS sensors verified across all 3 analog throttle axes; buttons confirmed non-backlit.
     - `kg12-gf-gen-1`: Contactless MaRS sensor verified on twist Z-axis; 4-way hat confirmed without push (`push: false`).
     - `mcg-pro-add-on-grip-gunfighter-mk-iv`: Contactless MaRS sensors verified; Slew and Trimmer ministicks confirmed with integrated tactile center push (`push: true`); metal folding trigger verified as 2-position (`stages: 2, action: flip`); buttons confirmed non-backlit; handedness and mount set to right and Rev.C.
     - `stecs-modern-throttle-grip-premium-combo` & `standard-combo`: Contactless MaRS sensors verified; ministick push confirmed (`push: true`); trigger stages confirmed (`stages: 1, action: sequential`).
     - `stecs-space-throttle-system-mini`, `-mini-plus`, `-standard`, `-max`: Contactless MaRS sensors verified; STG main trigger confirmed single-stage (`stages: 1, action: sequential`); all push buttons confirmed non-backlit (`backlit: false`).
     - `stecs-stem`: 8 standalone buttons confirmed non-backlit (`backlit: false`).
     - `stecs-stg-grip-l`: Contactless MaRS sensors verified; buttons confirmed non-backlit; main trigger confirmed single-stage (`stages: 1, action: sequential`).
     - `wwii-gnx-thq-add-on-grip`: Buttons confirmed non-backlit (`backlit: false`); K-switch rocker confirmed without center push (`push: false`).

5. **Photographs Added:**
   - 32 official manufacturer product photographs downloaded from the official VKB Shopify CDN, converted to standard high-quality JPG, and verified at `public/images/vkb/<filename>.jpg`.

---

## 2. Passive Accessories, Spares, Mounts, and Conversion Kits Audit

The official VKB storefront (`vkbsimcontrollers.com`) carries **71 passive accessories, spares, kits, and mounts**. None of these items possess interactive game controller inputs (buttons, hats, analog levers, or standalone axes).

### Category Breakdown:
1. **Cables, Spares, Hardware, and Fasteners (29 SKUs):**
   - Small Baseplate for Gunfighter
   - STECS Standard Baseplate, STECS Mini Baseplate, STECS Mini Plus/Max Baseplate
   - STECS STEM Back Cover, STECS BUS Cover for UCM
   - STECS Rubberized Grip Pads (Set of 2)
   - Gunfighter Springs, Gladiator NXT Springs
   - Gunfighter Grip Fasteners (Set of 2)
   - Gunfighter BlackBox Interface Cable
   - Grip Stand for Gunfighter Grips
   - GNX Side Wall Cover (Set of 2)
   - GNX Module-to-Module Interface Cable (Type-C to Type-C, 40cm)
   - GNX Module-to-Module Interface Cable (Type-C to JST2.0-4, 35cm)
   - GNX Module to Gladiator NXT/EVO base (R & L) Reinforcing Plates
   - GNX Module Plastic Spacers
   - GNX Module Coupler (Set of 2)
   - GNX Intermodular Reinforcing Plate
   - Adhesive Rubber Pads for Gladiator NXT/EVO Baseplate
   - UCM Universal Mounting Plate
   - UCM Adapter Plates (for TM Warthog Throttle, STECS Standard, STECS Mini, STECS Max/MiniPlus, Mouse/Keypad, Gunfighter, Gladiator)

2. **Grip Upgrade & Conversion Kits (14 SKUs):**
   - STECS Modern Throttle Grip Mk.II Upgrade Kit
   - STECS Button Module Upgrade Kit
   - SCG Standard to SCG Premium Grip Upgrade Kit
   - SCG Grip Conversion Kits: GNX2GF-RevC, GNX OTA, GF2GNX, GNX2GF-RevB
   - Gladiator NXT to EVO Upgrade Kit
   - SCG Grip Upgrade Kit (RevB to RevC)
   - MCG Pro Grip Upgrade Kit (RevB to RevC) - with Twist Adapter
   - KG12 (Gen.2) Grip Upgrade Kit (RevB to RevC)
   - F-14 Grip Upgrade Kit (RevB to RevC)
   - MCG Pro/Ultimate Grip Upgrade Kit (RevB to RevC) – without Twist Adapter
   - MCG Ultimate Grip Upgrade Kit (RevB to RevC) - with Twist Adapter

3. **Adapters, Cams & Extensions (12 SKUs):**
   - Warthog Adapter for Gunfighter IV & Mk.II/III
   - Twist Adapter for Gunfighter IV MCG Ultimate Grip & MCG Pro Grip
   - Twist Adapter for Gunfighter Mk.II/III MCG Ultimate Grip & MCG Pro Grip
   - Omni Throttle Adapter (OTA) for Gunfighter Mk.IV & Mk.II/III
   - Extension Kit for Gunfighter Mk.IV
   - Gunfighter Space Cams Kit, Combo Cams Kit, Avia Cams Kit

4. **Desk Mounts & Mount Accessories (16 SKUs):**
   - UCM-S for STECS Mini, STECS Standard, STECS Max/MiniPlus
   - UCM-S for TM Warthog Throttle, Gunfighter, Gladiator, Mouse/Keypad, Universal
   - UCM-L for Gunfighter, UCM-L Universal
   - UCM Accessories: Phone Holder, Mounting Panel, Keyboard Holder, Cupholder
   - STECS MFH Fixture, STECS Accessory Magazine

### Catalog Recommendation:
- **Do NOT add passive accessories to `src/content/components/`:** The current `ComponentCategoryEnum` (`base`, `grip`, `stick_fixed`, `throttle`, `quadrant`, `yoke`, `pedals`, `module`) is designed specifically for flight input devices. Adding passive mounting brackets, screws, springs, and cables with `controls: []` pollutes the compare matrix, axis filters, and price ranges for flight simulation controls.
- **Future Architecture:** If physical mounting and spare parts tracking is required, implement a dedicated Astro content collection (e.g. `src/content/accessories/*.yaml`) governed by a distinct `AccessorySchema` (`type: 'mount' | 'spare_part' | 'conversion_kit' | 'cable'`, `compatibility: string[]`, `material: string`, `weight_g: number`).
