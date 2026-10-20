# Hillclimb Round 6b Research Notes (gemini2)

**Date:** 2026-10-21  
**Scope:** `logitech`, `virpil`, `vkb` components and bundles.  
**Focus:** Control inventories and hardware (push buttons, hat ways, switch positions, lever contacts, sensors, axes, damping, cams, throw angles) and regional prices.

---

## 1. Summary of Edits & Changes

### Logitech
- **Logitech G X52 Flight Stick** (`x52-space-flight-stick.yaml`):
  - Updated `hardware.sensor: hall` and explicit axes sensors: X and Y contactless magnetic / Hall effect, Twist potentiometer. Verified against Logitech G technical specifications and user manual ("Non-contact technology on the X and Y axes...").
  - Updated toggle switch properties: Mode selector `push: false`; 3x base spring-loaded toggle switches `ways: 3`, `momentary: true`, `push: false` (3 physical levers, (ON)-OFF-(ON) momentary center-off spring return, 6 logical commands); pinkie switch `push: false`.
- **Logitech G X52 Pro Flight Stick** (`x52-pro-flight-stick.yaml`):
  - Updated toggle switch properties: Mode selector `push: false`; 3x base spring-loaded toggle switches `ways: 3`, `momentary: true`, `push: false`.
- **Logitech X52 Throttle** (`x52-throttle.yaml`):
  - Confirmed `controls[8]` (thumb slider) `center_detent: false` (smooth continuous linear travel without center notch).
  - Confirmed `hardware.sensor: potentiometer` and throttle axis sensor `potentiometer`.
- **Logitech G Flight Yoke System - Yoke** (`g-saitek-pro-flight-yoke.yaml`):
  - Left-handle POV hat: `push: false`.
  - 3x handle rocker switches: `push: false`.
  - 2x single-function handle buttons (Buttons A & B): `backlit: false`.
  - Right-handle 3-position mode selector: `momentary: false`, `push: false`.
  - 3x chronograph display buttons: `backlit: false`.

### Virpil Controls
- **VPC MongoosT-50CM3 Throttle** (`mongoost-50cm3-throttle.yaml`):
  - Levers: dual throttle `push: false`, auxiliary axis `push: false`.
  - Slider axis: `center_detent: false` (smooth analog linear axis).
  - Encoders: handle encoder without push `push: false`.
  - Buttons: 4x handle momentary buttons `backlit: false` (distinguished from 6x RGB base buttons).
  - Toggles: 3x ON-OFF-ON toggles `push: false`, 4x ON-ON latched toggles `push: false`.
  - Rotary: 5-way mode selector dial `push: false`.
- **MongoosT-50CM4 Throttle** (`mongoost-50cm4-throttle.yaml`):
  - Levers: dual throttle `push: false`, auxiliary axis `push: false`.
  - Buttons: 1x base panel momentary button `backlit: false`, 4x grip buttons `backlit: false`.
  - Toggles: 2x ON-OFF-ON momentary toggles `push: false`.
- **VPC Universal Control Panel #1** (`vpc-control-panel-1.yaml`):
  - Toggles: 6x ON-OFF-ON `push: false`, 2x ON-ON latched `push: false`, 2x flip-cover `push: false`.
  - Axis dials: `push: false`.
  - Axes: Defined 2 analog axes (`Dial 1`, `Dial 2`) with `contactless_magnetic` sensors.
- **VPC Universal Control Panel #2** (`vpc-control-panel-2.yaml`):
  - Toggles: 6x ON-OFF-ON `push: false`, 2x ON-ON latched `push: false`, 2x flip-cover `push: false`.
  - Landing gear lever: `positions: 3`, `momentary: false`, `push: false`.
- **VPC Universal Control Panel #3** (`vpc-control-panel-3.yaml`):
  - Axis levers: 4x axis levers `push: false`.
  - Buttons: 3x momentary push buttons `backlit: false` (separate from 10x RGB tactile switches).
  - Toggles: 7x ON-OFF-ON toggles `push: false`, 3x latching toggles `push: false`.
- **VPC VMAX Prime Throttle** (`vpc-vmax-prime-throttle.yaml`):
  - Levers: dual split throttle `push: false`, auxiliary lever `push: false`.
  - Toggles: 5x ON-OFF-ON toggles `push: false`.
  - Mode switch dial: `positions: 5`, `push: false` (verified against VPC manual and webstore).
- **VPC Dual-SF Collective Grip** (`vpc-dual-sf-collective-grip.yaml`):
  - Triggers: 2x single-stage triggers `action: sequential`.
  - Buttons: 6x momentary buttons `backlit: false`.
  - Toggles: [ON]-OFF-[ON] toggle `push: false`.
- **VPC FLNKR Grip** (`vpc-flanker-grip.yaml`):
  - Primary trigger: `action: sequential`.
  - Buttons: 8x grip buttons `backlit: false`.
  - Brake lever: `push: false`.
- **VPC Hawk-60 Collective Grip** (`vpc-hawk-60-grip.yaml`):
  - Trigger: single-stage trigger `action: sequential`.
  - Toggle: ON-OFF-ON toggle `push: false`.
- **VPC SharKa-50 Collective Grip** (`vpc-sharka-50-collective-grip.yaml`):
  - Switch: 2-way switch (+ push) `positions: 2`, `push: true`.
  - Toggles: 3x ON-OFF-ON toggles `push: false`.
  - Buttons: 3x push buttons `backlit: false`.
- **VPC Rotor TCS Plus Base** (`vpc-rotor-tcs-base.yaml`):
  - Levers: collective axis `push: false`, twist throttle axis `push: false`.
  - Button: engine idle button `backlit: false`.
  - Switch: twist restrictor switch `push: false`, `momentary: false`.
- **VPC Rotor TCS Base** (`vpc-rotor-tcs-base-upgraded.yaml`):
  - Lever: collective axis `push: false`.
  - Hardware: `cams_swappable: true` (ships with Limiter-30, Limiter-40, Limiter-50 limiter cams), `throw_deg: 40`.
- **VPC Vector Engine MCP** (`vector-engine-mcp.yaml`):
  - Rotary: 5-way starter dial `push: false`.
  - Toggles: 3x 3-way latched toggles `push: false`.
- **VPC Vector Gear MCP** (`vector-gear-mcp.yaml`):
  - Lever: landing gear lever `push: false`.
  - Button: push button `backlit: false`.
- **VPC Vector Lighting MCP** (`vector-lighting-mcp.yaml`):
  - Toggles: 6x 3-way latched toggles `push: false`.
- **VPC Constellation VEGA Yoke Handle** (`constellation-vega-yoke-handle.yaml`):
  - Levers: analogue triggers `push: false`.
  - Buttons: 2x push buttons `backlit: false` (unlit, distinguished from 6x RGB buttons).

### VKB
- **STECS STEM (Standard Throttle Extension Module)** (`stecs-stem.yaml`):
  - Hardware: Filled explicit module specifications (`axis_count: 0`, `gimbal: null`, `sensor: null`, `axes: []`, `force_adjustable: false`, `cams_swappable: false`, `damping: null`, `extension_support: false`, `throw_deg: null`).
  - Regional prices: Added EU €75.00 (`flightsimcontrols.com/product/stecs-stem/`) and UK £69.00 (`flightsimcontrols.co.uk/product/stecs-stem-standard-throttle-extension-module/`).
- **WWII GNX THQ Add-On Grip** (`wwii-gnx-thq-add-on-grip.yaml`):
  - Hardware: Filled explicit grip specifications (`axis_count: 0`, `gimbal: null`, `sensor: null`, `axes: []`, `force_adjustable: false`, `cams_swappable: false`, `damping: null`, `extension_support: false`, `throw_deg: null`).
- **STECS Space Throttle Add-On Grip (STG) Left & Right Hand** (`stecs-stg-grip-l.yaml`, `stecs-stg-grip-r.yaml`):
  - Hardware: `force_adjustable: false`, `cams_swappable: false`, `damping: null`, `extension_support: false`, `throw_deg: null`.
  - Regional prices (Left-Hand): Added EU €108.00 (`flightsimcontrols.com/product/stecs-space-throttle-add-on-grip-stg-left-hand/`) and UK £108.00 (`flightsimcontrols.co.uk/product/stecs-space-throttle-add-on-grip-stg-left-hand/`).
- **STECS Modern Throttle Grip - Standard Combo** (`stecs-modern-throttle-grip-standard-combo.yaml`):
  - Hardware: `gimbal: null`, `force_adjustable: false`, `cams_swappable: false`, `damping: null`, `extension_support: false`, `throw_deg: null`.
  - Regional prices: Added EU €112.00 (`flightsimcontrols.com/product/stecs-modern-throttle-grip-standard-combo/`) and UK £112.00 (`flightsimcontrols.co.uk/product/stecs-modern-throttle-grip-standard-combo/`).
- **STECS Modern Throttle Grip - Premium Combo** (`stecs-modern-throttle-grip-premium-combo.yaml`):
  - Hardware: `gimbal: null`, `force_adjustable: false`, `cams_swappable: false`, `damping: null`, `extension_support: false`, `throw_deg: null`.
  - Regional prices: Added EU €158.00 (`flightsimcontrols.com/product/stecs-modern-throttle-grip-premium-combo/`). UK store does not list a standalone Premium tier kit; left unset.
- **STECS Space Throttle Systems (Mini, Mini Plus, Standard, Max) Left & Right Hand**:
  - Hardware: Added `cams_swappable: false` (uses swappable detent frames, not cams) and `extension_support: false` across all 8 variants.
  - Regional prices verified and added for all 8 models on `flightsimcontrols.com` (EU) and `flightsimcontrols.co.uk` (UK):
    - Mini L/R: EU €237.00, UK £235.00
    - Mini Plus L/R: EU €258.00, UK £249.00
    - Standard L/R: EU €297.00, UK £285.00
    - Max L/R: EU €339.00, UK £320.00

---

## 2. Documented Gaps & Items Staying Unset

- **Logitech X52 / X52 Pro Throttle Continuous Axes vs Discrete Positions:**
  - Audit queries flag `controls[8].positions` (thumb slider) and `controls[9].positions` (rotary dials) on `x52-throttle` and `x52-pro-throttle`. Both controls are analog potentiometer axes with continuous linear/rotary travel. Discrete position counts do not apply and remain unset.
- **Logitech Flight Yoke Rotation Angle / Damping:**
  - While physical measurements and community teardowns establish 90° total roll rotation (±45°) and spring tensioning, Logitech's official technical specification table and user manual do not state numerical rotation angles or mechanical damping classifications. In compliance with the strict two-statement verification rule against first-party documents, `hardware.throw_deg` and `hardware.damping` remain unset.
- **VKB STECS Rotary Axes Positions:**
  - `controls[3].positions` on STECS Modern Throttle Systems (Mini, Mini Plus, Standard, Max) and `controls[6].positions` on MTG combos represent the MTG-R analog wheel axis (`mode: analog`). These are continuous rotary axes powered by MaRS contactless magnetic sensors; discrete position counts do not apply and remain unset.
- **VKB T-Rudder Mk.V Damping:**
  - T-Rudder Mk.V uses a spring-loaded dual-cam return mechanism without factory fluid or friction dampers (`damping: null`).
- **Virpil Toggle & Switch Momentary Behaviors Where Undocumented:**
  - On `vpc-control-panel-3` and `vpc-hawk-60-grip`, the manufacturer terms certain switches "ON-OFF-ON" without specifying whether the positions are spring-return momentary or latching maintained. Per the non-guessing rule, `momentary` is left unset.
- **Virpil PRM-HES Module Center Push:**
  - The official product page specifies a contactless analog ministick for yoke handles but omits mention of a center push switch; `push` remains unset.
