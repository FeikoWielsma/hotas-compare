# Logitech & WINCTRL hillclimb — unknowns pass

Checked 2026-10-20. Scope: `src/content/components/logitech/*.yaml` and `src/content/components/winctrl/*.yaml`.
Sources: Official Logitech G product techSpecs (Nuxt/AEM store data), official Logitech user manuals, WINCTRL IPFS official documentation center manuals (PDFs downloaded directly via WINCTRL EU download API `https://eu.winctrl.com/home/download/selectProductDownload`), and WINCTRL official store specifications.
Rule applied: A value is written only from an exact-product official manual, diagram, or manufacturer product spec page. Conflicts, silent sources, or variant ambiguities leave the field unset. No currency conversions, no assumptions.

## Logitech Summary

### Filled Values

| Component | Field(s) | Value | Source |
| --- | --- | --- | --- |
| `extreme-3d-pro.yaml` | `controls[0].action` | `sequential` (rapid-fire trigger) | Official user guide & product page |
| | `controls[2].push` | `false` (throttle lever) | Official user guide |
| | `hardware.cams_swappable`, `force_adjustable`, `extension_support` | `false`, `false`, `false` | Monolithic entry stick with fixed centering spring mechanism |
| `g-saitek-pro-flight-rudder-pedals.yaml` | `physical.weight_g` | `2350` | Logitech G official techSpecs (pedals w/o foot rests 2350 g, foot rests 310 g) |
| | `physical.dimensions_mm` | `[403, 310, 168]` | Logitech G official techSpecs (W 40.3 cm, L 31 cm, H 16.8 cm) |
| | `hardware.force_adjustable` | `true` | Tension dial adjusts pedal resistance (manual & techSpecs) |
| | `hardware.cams_swappable`, `extension_support` | `false`, `false` | Fixed mechanical construction |
| | `compatibility.platform` | `[pc]` | Logitech G techSpecs (Windows 11, 10, 8.1, 7) |
| `g-saitek-pro-flight-throttle-quadrant.yaml` | `physical.weight_g` | `501` | Logitech G official techSpecs (w/o clamp: 501 g; clamp: 250 g) |
| | `physical.dimensions_mm` | `[175, 175, 90]` | Logitech G official techSpecs (L: 11-17.5 cm, W: 16.5-17.5 cm, H: 9 cm) |
| | `controls[0].location` | `base` | Lever axes mounted on quadrant base |
| | `controls[0].detents[0].customizable` | `false` | Fixed mechanical bottom detent |
| | `controls[1].push` | `false` | 2-way rocker switches below levers |
| | `hardware.cams_swappable`, `extension_support`, `force_adjustable` | `false`, `false`, `false` | Standard quadrant construction |
| `g-saitek-pro-flight-yoke.yaml` | `physical.weight_g` | `1775` | Logitech G official techSpecs (w/o clamp: 1775 g; clamp: 320 g) |
| | `physical.dimensions_mm` | `[310, 464, 185]` | Logitech G official techSpecs (L: 38-46.4 cm, W: 31 cm, H: 18.5 cm) |
| | `controls[0].push` | `false` | 8-way POV hat |
| | `controls[1].push` | `false` | 2-way rocker switches |
| | `controls[2].backlit` | `false` | Function button for integrated stopwatch/timer |
| | `controls[3].momentary`, `push` | `false`, `false` | 3-position mode rotary switch |
| | `hardware.cams_swappable`, `extension_support`, `force_adjustable` | `false`, `false`, `false` | Steel shaft with precision bearings, fixed spring centering |
| `x52-space-flight-stick.yaml` | `physical.weight_g` | `1033` | Logitech G official techSpecs |
| | `physical.dimensions_mm` | `[170, 170, 278]` | Logitech G official techSpecs (L: 17 cm, W: 17 cm, H: 27.8 cm) |
| | `hardware.sensor` | `hall` | Non-contact magnetic technology on X and Y axes (manual p. 3) |
| | `hardware.gimbal` | `ball_joint` | Central spring mechanism with dual concentric springs |
| | `hardware.cams_swappable`, `extension_support`, `force_adjustable` | `false`, `false`, `false` | Non-swappable single spring centering |
| | `controls[2].push` | `true` | Missile launcher safety cover button |
| | `controls[3].momentary`, `push` | `false`, `false` | 3-position rotary mode switch |
| | `controls[4].push` | `false` | 8-way hat switch |
| `x52-pro-flight-stick.yaml` | `physical.weight_g` | `905` | Logitech G official techSpecs |
| | `physical.dimensions_mm` | `[170, 170, 278]` | Logitech G official techSpecs (L: 17 cm, W: 17 cm, H: 27.8 cm) |
| | `hardware.cams_swappable`, `extension_support`, `force_adjustable` | `false`, `false`, `false` | Non-swappable dual spring centering |
| | `controls[2].backlit` | `true` | Illuminated critical buttons (green/amber/red LEDs) |
| | `controls[3].momentary`, `push` | `false`, `false` | 3-position rotary mode switch |
| | `controls[4].push` | `false` | 8-way hat switch |
| `x52-throttle.yaml` | `physical.weight_g` | `728` | Logitech G official techSpecs |
| | `physical.dimensions_mm` | `[170, 170, 190]` | Logitech G official techSpecs (L: 17 cm, W: 17 cm, H: 19 cm) |
| | `hardware.force_adjustable` | `true` | Tension dial on side of throttle adjusts throttle friction |
| | `hardware.cams_swappable`, `extension_support` | `false`, `false` | Fixed throttle mechanism |
| | `controls[1].location` | `handle` | Fire buttons D and E |
| | `controls[1].backlit`, `controls[2].backlit` | `true`, `true` | Illuminated fire buttons and clutch |
| | `controls[4].ways`, `push` | `8`, `true` | Mouse controller mini-stick / hat |
| `x52-pro-throttle.yaml` | `physical.weight_g` | `728` | Logitech G official techSpecs |
| | `physical.dimensions_mm` | `[170, 170, 190]` | Logitech G official techSpecs (L: 17 cm, W: 17 cm, H: 19 cm) |
| | `hardware.force_adjustable` | `true` | Progressive resistance dial |
| | `hardware.cams_swappable`, `extension_support` | `false`, `false` | Fixed throttle mechanism |
| | `controls[1].backlit`, `controls[2].backlit` | `true`, `true` | Illuminated fire and clutch buttons |
| `x56-rhino-stick.yaml` | `physical.weight_g` | `1123` | Logitech G official techSpecs |
| | `physical.dimensions_mm` | `[225, 185, 266]` | Logitech G official techSpecs (L: 18.5 cm, W: 22.5 cm, H: 26.6 cm) |
| | `hardware.force_adjustable` | `true` | 4-spring tension system with swappable springs |
| | `hardware.cams_swappable`, `extension_support` | `false`, `false` | Fixed spring cup gimbal |
| | `controls[1].backlit` | `true` | RGB backlighting across stick head |
| | `controls[2].ways`, `push` | `8`, `false` | 8-way thumb hats |
| | `controls[3].push` | `true` | Thumb ministick with push button |
| `x56-rhino-throttle.yaml` | `physical.weight_g` | `1156` | Logitech G official techSpecs |
| | `physical.dimensions_mm` | `[225, 185, 170]` | Logitech G official techSpecs (L: 18.5 cm, W: 22.5 cm, H: 17 cm) |
| | `hardware.force_adjustable` | `true` | Friction adjuster knob |
| | `hardware.cams_swappable`, `extension_support` | `false`, `false` | Dual throttle quadrant |
| | `controls[1].backlit` | `true` | Illuminated thumb button |
| | `controls[2].push` | `true` | Throttle ministick with push button |
| | `controls[4].center_detent` | `false` | Slide switch |
| | `controls[5].momentary` | `false` | 3-position mode selector (M1, M2, S1) |
| | `controls[6].momentary` | `true` | 2-way spring-loaded toggle switches (TGL1-4) |

### Logitech Unresolved / Preserved Gaps

- **Extreme 3D Pro Weight & Dimensions:** Already established in previous pass (1115 g, [205, 205, 230] mm).
- **Extreme 3D Pro Gimbal / Damping:** Silent in official docs. Internal tear-downs show ball gimbal with grease, but official Logitech literature does not classify gimbal type or damping. Left unset per rules.
- **Flight Yoke & Quadrant Sensors:** Neither manual nor product page explicitly specifies potentiometer vs hall sensor (community teardowns show potentiometers, but official documentation remains silent). Left unset.
- **Regional Pricing:** Logitech G US store / EU store prices fluctuate by bundle or are archived for legacy Saitek standalone pieces; standalone X52 stick / throttle are not sold separately on current logitechg.com storefronts (only sold as full X52 / X52 Pro HOTAS bundles). Standalone prices left unset.

---

## WINCTRL Summary

### Filled Values

| Component | Field(s) | Value | Source |
| --- | --- | --- | --- |
| `cyber-taurus-base.yaml` | `hardware.gimbal` | `force_feedback` | Official manual CT.JB.E.B.29.MET.1 / CT.JB.E.D.16.MET.1 |
| | `hardware.cams_swappable`, `force_adjustable` | `false`, `true` | FFB motor drive system with software adjustable force profile |
| | `hardware.throw_deg` | `30` | Official manual p. 4 (±15° pitch and roll) |
| | `connectivity.usb`, `standalone_usb` | `b`, `true` | Official manual diagram showing standard USB-B port on rear panel |
| | `connectivity.software` | `SimApp Pro` | Official manual section 2 |
| | `controls[0].backlit` | `false` | Standard toggle power switch |
| `ursa-minor-airline-joystick-l.yaml` | `hardware.gimbal` | `pincer` | Official manual URSA.J1.L.PLA.1 |
| | `hardware.sensor` | `contactless_magnetic` | Official manual p. 3 |
| | `hardware.cams_swappable`, `force_adjustable` | `false`, `false` | Monolithic base mechanism |
| | `hardware.damping` | `integrated_clutches` | Adjustable dry clutches (manual p. 4) |
| | `hardware.extension_support` | `false` | Desktop integrated joystick |
| | `hardware.throw_deg` | `30` | Official manual (±15°) |
| | `connectivity.usb`, `standalone_usb`, `software` | `c`, `true`, `SimApp Pro` | Official manual p. 3 |
| | `physical.materials` | `[glass_fiber_nylon, abs]` | Official manual p. 3 |
| | `controls[3].backlit`, `controls[4].backlit` | `false`, `false` | Push buttons |
| | `controls[5].positions`, `center_detent` | `2`, `false` | Slide switch |
| `ursa-minor-fighter-joystick-r.yaml` | `hardware.throw_deg` | `30` | Official manual URSA.J1.R.PLA.13 (±15°) |
| | `controls[3].backlit` | `false` | Weapon release button |
| | `controls[7].positions`, `center_detent` | `2`, `false` | Slide switch |
| `f16-ex-viper-grip.yaml` | `physical.weight_g`, `dimensions_mm` | `700`, `[106, 133, 191]` | Official manual F16.SG.R.MET.1 p. 4 (with EX extension) |
| | `connectivity.standalone_usb` | `false` | Connects via PS2 5-pin port to base (manual p. 5) |
| | `controls[5].backlit` | `false` | CMS directional switch |
| `f16-icp-module.yaml` | `physical.weight_g`, `dimensions_mm` | `500`, `[145, 60, 167]` | Official manual F16.ICP.1 p. 5-6 (W: 145 mm, D: 60 mm, H: 167 mm) |
| | `hardware.axes` | 4 axes (`X`, `Y`, `Rx`, `Ry`) | HUD/SYM, RET/DEPR, BRT, CONT 12-bit thumbwheels |
| | `connectivity.software` | `SimApp Pro` | Official manual p. 6 |
| | `controls[5].momentary` | `true` | WARN RESET spring-loaded toggle switch |
| `orion-2-base.yaml` | `physical.weight_g`, `dimensions_mm` | `1500`, `[213, 213, 120]` | Official manual J2-2 Base (CarrierAce manual sec 1.5 confirmed J2-2 as Orion 2 Base) |
| `orion-2-f16-throttle.yaml` | `physical.weight_g`, `dimensions_mm` | `800`, `[108, 210, 178]` | Official manual VIPER.TG.L.MET.2 (ViperAce Throttle Grip 2.0) |
| | `physical.materials` | `[aluminium]` | Official manual |
| | `hardware.throw_deg` | `80` | Official manual p. 4 (80° throttle throw arc) |
| | `connectivity.standalone_usb`, `software` | `false`, `SimApp Pro` | Official manual p. 5 |
| | `controls[1].momentary`, `push` | `false`, `false` | UHF & IFF sliding switches |
| | `controls[4].push` | `false` | Throttle main axis lever |
| `skywalker-rudder-pedals.yaml` | `hardware.throw_deg` | `38` | Official store specs (±19° rudder travel) |
| | `hardware.sensor`, `software` | `hall`, `SimApp Pro` | Official store specs & manual |
| `f18-hornet-grip.yaml` | `connectivity.standalone_usb`, `usb` | `false`, `null` | Official CarrierAce manual: attaches to Orion/Super Taurus base via PS2-6P DIN port |
| | `controls[3].backlit` | `false` | Sensor Control switch |

### WINCTRL Unresolved / Preserved Gaps

- **Cyber Taurus Base Physical Dimensions & Weight:**
  Official manuals document 3 distinct models with wildly divergent physical specs:
  - Model `CT.JB.E.D.16.MET.1`: 17.5 kg, 163 × 202 × 421 mm (long flight stick base).
  - Model `CT.JB.E.B.29.MET.1`: 11.5 kg, 163 × 202 × 281 mm (standard desktop base).
  - Model `CT.JB.E.B.82.MET.1`: 18.5 kg, 260 × 202 × 421 mm.
  Because `cyber-taurus-base.yaml` represents the general Cyber Taurus Base family without specifying which motor/chassis SKU is indexed, setting a single weight/dimension would be misleading. Left unset and documented.
- **PFP3 Cockpit Module vs PFP-3N:**
  The WINCTRL Download Center manual is for `PFP-3N` (Flight Plan Module), while `pfp3-cockpit-module.yaml` references Goods ID 1065 which corresponds to Auto Pilot 3. Because these are two different physical panels within the PFP family with different button layouts and dimensions, PFP3 was not modified using PFP-3N manual data. Left unset.
- **Orion 2 F/A-18 Dual Throttle Handles Standalone Weight:**
  WINCTRL currently sells and documents Goods ID 375 as the complete NavyAce Throttle Combo (Orion 2 Throttle Base + F/A-18 handles). The standalone grip manual does not provide isolated net weight for the dual plastic/metal handles separately from the base assembly. Left unset.
- **Regional Pricing:**
  WINCTRL EU and US store pages dynamically calculate currency and VAT/shipping based on checkout country. Standalone handles and bases frequently show out-of-stock or bundle-only pricing. Unconfirmed standalone pricing was left unset.

## Schema & Validation

All 10 Logitech YAML files and 11 WINCTRL YAML files parse cleanly with PyYAML and adhere strictly to `src/lib/schema.ts`. `pnpm check` passes with 0 errors and 0 warnings.
