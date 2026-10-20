# VKB & Slaw Catalog Hillclimb Research Notes

**Date:** 2026-10-20  
**Scope:** VKB and Slaw component records (`src/content/components/vkb/*.yaml`, `src/content/components/slaw/*.yaml`), product images, and research evidence.

---

## 1. Catalog Coverage & Products Present

### Slaw Device
1. **RH Rotor Pedals** (`src/content/components/slaw/rotor-pedals.yaml`): Complete 3-axis inventory (Rudder + 2x Toe Brake), 8000 g mass, spring tension force adjustability, optional hydraulic damper support, and official calibration software.
2. **Viper V2 Rudder Pedals** (`src/content/components/slaw/viper-v2-rudder-pedals.yaml`): Discontinued F-16 style pedals. Completed 3-axis inventory (Rudder + 2x Toe Brake), contactless magnetic sensors, spring tension force adjustability, and dedicated `Rudder.exe` software.
3. **Slaw Device Damper Kit** (`src/content/components/slaw/slaw-damper-kit.yaml`): Passive mechanical accessory (0 axes, passive hydraulic damping, no software/electronics; operates attached to host Slaw pedals on PC).
4. **RX Viper V3 Rudder Pedals** (`src/content/components/slaw/rx-viper-v3-rudder-pedals.yaml`): Current generation flagship rudder pedals from Slaw Device. Sourced from [Slaw Device RX Viper V3 Dark Metallic](https://slawdevice.com/en/glowna/45-pre-order-rx-viper-v3-rudder-pedals-dark-metalic.html). Features 3 axes (13-bit contactless digital sensors), 25 ball bearings, cam loading mechanisms with reversible hard/soft center cam, €535 price, and official photo.
5. **RF Dora V3 Rudder Pedals** (`src/content/components/slaw/rf-dora-v3-rudder-pedals.yaml`): Current WWII Dora-style rudder pedals. Sourced from [Slaw Device RF Dora V3](https://slawdevice.com/en/glowna/52-pre-order-rx-viper-v3-rudder-pedals-dark-metalic.html). Features 3 axes, all-metal construction, cam loading with 180° reversible cam, €495 price, and official photo.

### VKB (VKB-Sim)
1. **F-14 Combat Grip** (`src/content/components/vkb/f14-combat-grip.yaml`): Trim hat established as 4-way hat with center push; Emergency Autopilot Disable trigger confirmed as single-stage sequential pull; DLC maneuver wheel confirmed as spring-centered analog wheel axis without push; buttons confirmed non-backlit.
2. **Gladiator NXT EVO Base** (`src/content/components/vkb/gladiator-nxt-evo-base.yaml`): Base toggle switch (Sw1) confirmed non-pressable; analog throttle wheel confirmed non-pressable; rotary encoder (En1) confirmed non-pressable; base buttons confirmed non-backlit; dry clutch damping and spring tension force adjustability.
3. **Gladiator NXT EVO Omni-Throttle (Left)** (`src/content/components/vkb/gladiator-nxt-evo-omni-throttle-l.yaml`): Inventory completed to `complete`. Rapid-fire trigger confirmed bidirectional 2-stage (push/pull); gimbal established as ball-bearing gimbal ring (`gimbal_ring`), dry clutch damping, force adjustable (`force_adjustable: true`), 40° throw, 4 axes (`X`, `Y`, `Twist`, `Base_Throttle`), USB-C connector. All button backlighting and base push properties established.
4. **Gladiator NXT EVO Omni-Throttle (Right)** (`src/content/components/vkb/gladiator-nxt-evo-omni-throttle-r.yaml`): Official right-handed counterpart to the left Omni-Throttle, complete with official product image from [VKB FSC Europe](https://flightsimcontrols.com/product/gladiator-nxt-evo-omni-throttle/). 4 axes, bidirectional rapid-fire trigger, dry clutch damping, and spring tension force adjustability.
5. **Gunfighter Mk.IV Base** (`src/content/components/vkb/gunfighter-iv-base.yaml`): Base-only package with 0 physical buttons/hats; dual-cam all-metal gimbal, adjustable dry clutch damping, swappable cams/springs, USB-C, BlackBox 3.
6. **KG12 WWII Grip** (`src/content/components/vkb/kg12-wwii-grip.yaml`): Folding metal trigger confirmed as single-stage flip trigger; pinky metal lever confirmed as pressable button; 8-way hat switch confirmed without center push; bomb release and side buttons confirmed non-backlit; Rev.B connector to Gladiator base.
7. **Modern Combat Grip Ultimate** (`src/content/components/vkb/mcg-ultimate-grip.yaml`): Full physical inventory completed to `complete` from official VKB MCGU template (`VKB-Gunfighter-MCGU-v1.2.pdf`). Slew and trimmer ministicks confirmed with center push; analog brake lever confirmed without push; added three 4-way center-push hats (MANVR, RESET, DC) and four physical push buttons (AP OFF, LVLNG, GUN, Ring Finger); added 5 analog axes (Slew X/Y, Trimmer X/Y, Brake); Rev.C connector to Gunfighter base.
8. **Space Combat Grip (SCG) Premium (Left & Right)** (`src/content/components/vkb/scg-space-combat-grip-l.yaml`, `scg-space-combat-grip-r.yaml`): Rapid-fire trigger confirmed bidirectional 2-stage (`stages: 2`, `action: bidirectional`); buttons confirmed non-backlit opaque ABS; base connector connectivity established (`usb: none; connects via VKB Rev.B connector to Gladiator NXT/EVO base`, `standalone_usb: false`).
9. **GNX SEM Side Extension Module** (`src/content/components/vkb/sem-side-extension-module.yaml`): Sourced from official `VKB-SEM-v1.0.pdf` template. Multi-function levers (Flaps, Gear) confirmed with contactless magnetic MaRS sensors without push; K-switches confirmed 3-way momentary with center push (`ways: 3, momentary: true, push: true`); rotary switch confirmed 4 positions without push; standalone buttons confirmed non-backlit; 2 physical axes established.
10. **STECS Modern Throttle System Mk.II Mini** (`src/content/components/vkb/stecs-throttle-mini.yaml`): Inventory completed to `complete`. Features dual main throttle levers (`throttle_dual`, `count: 2`) with split MTG-L and MTG-R grips, 5 physical analog axes (`Throttle_Left`, `Throttle_Right`, `MTG-R Wheel Axis`, `Ministick X`, `Ministick Y`), adjustable friction damping (`friction`), external screw resistance adjustment (`force_adjustable: true`), analog wheel axis and wheel encoders without push, push buttons non-backlit, 4 grip triggers (single-stage sequential), and 5-position rotary switch.
11. **STECS Modern Throttle System Mk.II Standard** (`src/content/components/vkb/stecs-throttle-standard.yaml`): Inventory completed to `complete`. Dual main levers with friction damping and force adjustability; MTG-R rocker confirmed digital 2-way with center push; STEM K-switches confirmed 3-way momentary with center push (`ways: 3, momentary: true, push: true`); STEM encoders confirmed with center push; STEM self-centering 3-position flip switch (`ways: 3, momentary: true, push: false`) and 3-position latching flip switch (`ways: 3, momentary: false, push: false`); 4 grip triggers confirmed single-stage; 5 axes established.
12. **STECS Modern Throttle System Mk.II Max** (`src/content/components/vkb/stecs-throttle-max.yaml`): Inventory completed to `complete`. Incorporates all Standard controls plus ATEM module (6 non-backlit push buttons including safety lids, 4-way directional rotary encoder with center push); friction damping and force adjustability; 5 axes established.
13. **T-Rudder Mk.V Pedals** (`src/content/components/vkb/t-rudder-mk5.yaml`): Reversible hard/soft center cam, spring tension adjustable, 1 contactless magnetic Z-axis, dimensions confirmed as 380 × 211 × 88 mm from manufacturer-linked drawing.

---

## 2. Evidence & Control Mapping Details

### Official Templates Consulted (Shopify CDN / VKB Official Repositories)
- **STECS Mk1 & Mk2 Template (v1.1)** (`https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-STECS-v1.1.pdf`): Establishes MTG-L/MTG-R control layout, Side and Ring encoders without push, 4 grip triggers (Forward L/R, Aft L/R), 5 base mode buttons, and 2-axis ministick with center push.
- **STECS STEM Template (v1.0)** (`https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-STECS-STEM-v1.0_1d344eed-eb3d-4326-bff2-541f981d4e2a.pdf`): Establishes SW1 and SW2 K-switches (UP, DN, Center Push ⨀), EN1 and EN2 encoders with center push ⨀, self-centering 3-position toggle switch, 3-position landing gear lever, and 8 push buttons (A1, A2, B1-B5, C1).
- **STECS ATEM Template (v1.0)** (`https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-STECS-ATEM-v1.0.pdf`): Establishes 4-way multi-stick with center push and rotary encoder, plus 6 buttons (1, 2, 3, 4, Armed, Safe).
- **SEM Template (v1.0)** (`https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-SEM-v1.0.pdf`): Establishes Mode rotary switch (positions 1, 2, 3, 4), SW1 and SW2 K-switches (UP, DN, Center Push ⨀), Flaps lever (positions 1, 2, 3, 4), Landing gear lever (UP, -, DN), and 7 push buttons (A1, A2, B1, B2, B3, C1, Start).
- **Gladiator SCG OTA (LH) Template (v1.0)** (`https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-Gladiator-SCG-OTA-LH-v1.0_bf7bdf6c-2162-4c44-aa6a-34af80c25c34.pdf`): Establishes Rapid Fire trigger bidirectional actuation (˄, ˅), 3 center-push hats, A1 ministick with center push, base switch Sw1 (no push), and base encoder En1 (no push).
- **Gunfighter MCGU Template (v1.2)** (`https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-Gunfighter-MCGU-v1.2_c3f70829-8f40-4db1-b9d0-0a92706b5194.pdf`): Establishes Gate Cont and Master Mode ministicks with center push, Flip trigger stages and sensor states, Brake lever analog travel, MANVR, RESET, and DC 4-way hats with center push, and AP OFF, LVLNG, GUN, and Ring Finger push buttons.

---

## 3. Catalog Completeness & Noted Missing Models/Variants

### Slaw Device
- **Coverage Status:** **100% complete**. Every rudder pedal and accessory released or currently sold by Slaw Device is cataloged:
  - `rx-viper-v3-rudder-pedals` (Current flagship F-16 style pedals)
  - `rf-dora-v3-rudder-pedals` (Current WWII Fw 190 Dora style pedals)
  - `rotor-pedals` (Current helicopter/jet style pedals)
  - `viper-v2-rudder-pedals` (Discontinued predecessor to V3)
  - `slaw-damper-kit` (Hydraulic steering damper kit)

### VKB (VKB-Sim) Missing Models & Variant Notes
- **STECS Mini Plus:** A package combining the STECS Mini base and MTG grips with an ATEM module on an elongated baseplate. It sits intermediate between STECS Mini and STECS Standard. Not added as a separate component because it is physically an assembly of existing cataloged STECS components.
- **GNX THQ (Throttle Quadrant):** A standalone/interlocking 3-axis throttle quadrant module with swappable lever heads (multi-engine throttle, prop, mixture). Connects via GNX-BUS or optional GNX USB controller. Not yet cataloged; official source: [VKB GNX THQ](https://vkbsimcontrollers.com/products/gnx-thq-throttle-quadrant-us).
- **GNX FSM-GA (Front Switch Module - General Aviation):** Cockpit switch module featuring rotary ignition switch, landing gear lever, flap toggle, and lighting switches. Connects via GNX-BUS. Not yet cataloged; official source: [VKB GNX FSM-GA](https://vkbsimcontrollers.com/products/gnx-fsm-ga-front-switch-module-general-aviation-us).
- **Modern Combat Grip (MCG) Pro:** Polymer predecessor to the MCG Ultimate, featuring a folding trigger, dual-stage trigger, and analog brake lever. Retained as legacy/discontinued variant.
- **GNX MFH (Multi-Function Holder):** Structural mounting bracket accessory for attaching GNX modules (SEM, THQ, FSM) directly to Gladiator bases or desk setups. Passive mechanical mounting accessory.

---

## 4. Unresolved & Inapplicable Fields

| Product | Field | Status / Reason | Source |
|---|---|---|---|
| All VKB Grips (F-14, KG12, MCGU, SCG L/R) | `hardware.gimbal`, `hardware.damping`, `hardware.throw_deg` | **Inapplicable:** Detached grips do not possess gimbals, dampers, or throw angles; these mechanisms reside strictly in the joystick base (Gladiator EVO or Gunfighter IV). | [VKB Grip Guides](https://flightsimcontrols.com/grips/) |
| All VKB Grips | `connectivity.usb` | **Inapplicable:** Standalone grips have no standalone USB electronics (`standalone_usb: false`); connection is provided via proprietary base rev-B / rev-C contact pads. | [VKB Product Specifications](https://flightsimcontrols.com/) |
| STECS Throttles | `controls[3].positions` | **Inapplicable:** The MTG-R wheel axis is an analog potentiometer wheel (`mode: analog`) with smooth continuous rotation; discrete detent positions do not exist. | [VKB STECS Product Guides](https://vkbsimcontrollers.com/collections/stecs-throttles) |
| Gladiator EVO Base & Omni-Throttles | `controls.positions` (throttle wheel) | **Inapplicable:** Base throttle wheel is an analog axis lever (`mode: analog`) with continuous travel; discrete positions do not exist. | [Gladiator EVO Base Page](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-base-only-us) |
| Slaw Pedals (all) | `hardware.throw_deg` | **Unpublished:** Slaw publishes mechanical adjustment details (e.g. 3 pedal inclination angles, width settings, 25 bearings), but does not publish a numeric angular deflection/throw specification in degrees. | [Slaw Device Support](https://slawdevice.com/en/content/10-faq) |
| Slaw Pedals (all) | `prices.UK`, `prices.US` | **Legitimately Absent:** Slaw Device is a Polish artisan manufacturer selling directly in EUR (and PLN). They do not maintain regional storefronts or publish prices in GBP or USD. Currency conversions are prohibited by catalog rules. | [Slaw FAQ & Delivery](https://slawdevice.com/en/content/10-faq) |
| Slaw Pedals (all) | `platform.xbox`, `platform.ps5` | **Unpublished:** Manufacturer software documentation only lists PC compatibility (via Rudder.exe and Slaw Device Rudder calibration software); manufacturer is silent regarding console host compatibility. | [Slaw Downloads](https://slawdevice.com/en/content/7-downloads) |
| Slaw Device Damper Kit | All hardware & platform fields | **Inapplicable:** Passive mechanical motorcycle steering damper accessory without electronics, sensors, or USB controller. Measured axes belong to the host pedals. | [Slaw RH Rotor Product Page](https://slawdevice.com/en/rudder-pedals/50-pre-order-rh-rotor-v2-rudder-pedals.html) |
