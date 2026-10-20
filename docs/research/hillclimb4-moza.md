# MOZA Hillclimb 4: Comprehensive Controls, Physical Reconciliation, and Product Sweep

Checked 2026-10-20.
Scope: `src/content/components/moza/*.yaml`, `src/content/bundles/moza/*.yaml`, `public/images/moza/`.
Primary Sources:
- Official MOZA user manuals (rendered and inspected via PyMuPDF):
  - AY90: `MOZA_AY90_Yoke_Base_User_Manual.pdf` (45 pages)
  - AB6: `moza_ab6_flight_simulator_manual.pdf` (15 pages)
  - AB9: `moza_ab9_force_feedback_base_manual.pdf` (32 pages)
  - MHG: `moza_mhg_flightsticks_manual.pdf` (10 pages)
  - MTQ: `moza_mtq_throttle_panel_manual.pdf` (13 pages)
  - MTP: `moza_mtp_throttle_panel_manual.pdf` (7 pages)
  - MFY Pro: `MOZA_MFY_Pro_Yoke_Handle_User_Manual.pdf` (45 pages)
  - MTLP: `moza_mtlp_panel_manual.pdf` (6 pages)
  - MRP Pedals: `moza_mrp_rudder_pedals_manual.pdf` (45 pages)
  - MA3F EFCM: `MOZA_MA3F_Electronic_Flight_Control_Modules_User_Manual.pdf` (11 pages)
- MOZA product pages, official store collections (US, UK, EU), and MOZA support articles (Freshdesk solution articles).

---

## 1. Targeted Record Completions and Reconciliations

### AY210 Yoke Base (`ay210-yoke-base.yaml`)
- **Product Image Added:** Downloaded official high-resolution product image from MOZA CDN (`BA1-YOKE-BASE.webp`) to `public/images/moza/ay210-yoke-base.webp` (1000×1000). Updated YAML `images` entry.
- **Controls & Hardware:** 13 programmable RGB front-panel switches documented in official support; 2 force-feedback axes (Roll, Pitch, 15-bit magnetic encoder).

### MRP Rudder Pedals (`mrp-rudder-pedals.yaml`)
- **Axis Count Settled:** The official MRP manual (p. 5) explicitly establishes **3 continuous axes**:
  1. Yaw axis (rudder)
  2. Left brake pedal (toe brake)
  3. Right brake pedal (toe brake)
  Both the software settings interface and calibration routine configure and calibrate all three axes independently.
- **Controls Evidence:** Set to `coverage: complete` citing `https://image.mozaracing.com/manuals/moza_mrp_rudder_pedals_manual.pdf`.
- **Connectivity:** Documented direct USB Type-B to Type-A connection for PC standalone use, alongside RJ11 connection to MOZA flight bases.

### MTLP Take-off and Landing Panel (`mtlp-panel.yaml`)
- **Physical Controls vs. "25 Switch Signals" Reconciled:**
  MOZA's product specification lists "25 switch signals", which represents the logical DirectInput electrical switch outputs across all multi-position switches and levers. The physical panel comprises **10 distinct physical controls**:
  - 1 Selective Jettison rotary selector (5 positions)
  - 1 Center JETT pushbutton
  - 5 Toggle switches:
    - Flap switch (3-position: AUTO / HALF / FULL)
    - Launch bar switch (2-position: EXTEND / RETRACT)
    - Anti-skid switch (2-position: ON / OFF)
    - Landing and taxi light switch (2-position: ON / OFF)
    - Hook bypass switch (2-position: FIELD / CARRIER)
  - 3 Levers:
    - Landing gear lever (2-position: UP / DOWN, with illuminated transit indicator)
    - Tailhook lever (2-position, continuous Hall sensor)
    - Parking / emergency brake lever (pull-and-turn mechanism with Hall sensor)
- **Correction:** Removed the erroneous `type: trigger, count: 2` entry, which was a machine translation artifact of Chinese documentation referring to levers/toggles.
- **Dimensions:** 196.5 × 134.75 × 149 mm (recorded as `[197, 135, 149]`).
- **Coverage:** Set to `coverage: complete`.

### AB6 Force Feedback Base (`ab6-force-feedback-base.yaml`)
- **Controls Documented:** Official AB6 manual (p. 4) confirms:
  - 8 RGB-backlit customizable buttons (16.7M colors, reactive/telemetry lighting)
  - 2 Analog throttle sliders (with 3 selectable signal mapping modes: Button Mode, Axis Mode, or Mixed Mode)
  - Power switch is excluded as a flight input. No other onboard flight controls exist.
- **Hardware & Axes:** Added `axis_count: 2` (X and Y axes, 15-bit magnetic encoder, 6 N·m active direct-drive motor).
- **Connectivity:** USB Type-B port to PC, RJ11 accessory ports (Throttle, Rudder Pedal, Dash Display), top aviation connector for flight stick.
- **Coverage:** Set to `coverage: complete`.

### AB9 Force Feedback Base (`ab9-force-feedback-base.yaml`)
- **Controls Verified:** Official AB9 manual (p. 3-5) confirms the base houses **no onboard flight controls** (`controls: []`). The unit contains only rear connection ports (USB Type-B, Throttle RJ11, Rudder RJ11, Dash Display RJ11, Control Panel RJ11, Power) and top aviation connector for flight sticks.
- **Hardware & Axes:** Added `axis_count: 2` (Pitch and Roll, dual servo motors, 12 N·m peak torque).
- **Physical:** Technical drawing (p. 3) confirms 157 mm width × 227.9 mm length × 184 mm height (`[157, 228, 184]`), mass 5.5 kg.
- **Coverage:** Set to `coverage: complete`.

### MHG Flight Grip (`mhg-flight-grip.yaml`)
- **Controls Itemized from Manual:** Official MHG manual (pages 2–4) and AB6 manual section itemize:
  - 1 Dual-stage trigger (`stages: 2`)
  - 1 Two-axis Hall-effect mini stick (analog ministick with X/Y calibration)
  - 4 Dedicated pushbuttons: Launch button, illuminated Warning button light, Mode cycle button, Nosewheel steering lock button
  - 3 Five-way management switches (TMS, CMS, SMS)
  - 1 Three-way management switch (NMS)
  - 1 Lockable twist Z-axis (yaw) with locking screws
- **Hardware & Axes:** Added `axis_count: 1` (`Twist Z`).
- **Physical & Connectivity:** 91 × 145 × 227 mm, 5-pin aviation connector (`standalone_usb: false`).
- **Coverage:** Set to `coverage: complete`.

### MFY Pro Yoke Handle (`mfy-yoke-pro.yaml`)
- **Controls Itemized from Manual:** Official MFY Pro manual (pages 3–5) itemizes:
  - 2 Hall-effect thumbsticks (Auxiliary Axis, POV Control Axis; software configurable to Axis, Button, or Mixed modes)
  - 2 Five-way / 8-way hat switches (Trim switch, View switch)
  - 2 AP Disconnect pushbuttons
  - 2 Push-to-talk pushbuttons (PTT 1, PTT 2)
  - 2 Hall-effect analog triggers on the rear (configurable to combined Z-axis or independent Z-axis and Slider axis)
  - Center module houses a full-color touchscreen display (providing timer, axis display, button test, checklist, and flight instruments; touchscreen interface, no discrete physical pushbuttons). Unlike the standard MFY Handle, there are no physical pushbuttons on the center faceplate.
- **Physical:** Dimensions 303.6 × 142.4 × 202.2 mm (`[304, 142, 202]`), weight 1.2 kg.
- **Coverage:** Set to `coverage: complete`.

### MTP Flight Throttle (`mtp-throttle.yaml`)
- **Controls & Levers:** Official MTP manual (pages 2–6) confirms:
  - 2 Independent throttle levers with aluminum alloy grips (15-bit magnetic encoder)
  - 2 Adjustable detents (afterburner and middle/idle detents)
  - 1 Hall-effect thumb joystick on grip
  - 27 Physical panel switches documented by manufacturer total count
  - Integrated airspeed telemetry vibration motor
- **Dimensions & Ports:** 277 × 194 × 216 mm, USB Type-B to PC, RJ11 to MOZA flight base.
- **Coverage:** Kept at `coverage: partial` because individual switch mechanisms (toggle vs rotary vs button) are not itemized individually in official literature.

### MTQ Throttle Quadrant (`mtq-throttle.yaml`)
- **Controls & Levers:** Official MTQ manual and support article 70000679590 establish:
  - 4 Continuous analog axes levers: 2 throttle levers (with default TQF fighter grips), 1 flap lever, 1 speedbrake lever
  - 1 Dedicated landing gear lever
  - 10 Multifunction panel pushbuttons (6 of which are 16.7M RGB backlit)
  - 3 Rotary knobs
  - 17 Toggle switches
- **Reconciliation:** The "23 physical controls" marketing summary represents grouped physical control stations on the unit, whereas the full itemized electrical switch total is 31 discrete inputs (excluding the 4 analog axes).
- **Dimensions & Ports:** 216.1 × 166.4 × 197.3 mm, USB Type-B to PC, RJ11 to MOZA flight base.

### AY90 Yoke Base (`ay90-yoke-base.yaml`)
- **Controls:** Official manual and US product specs confirm front panel controls:
  - 1 Five-way hat switch
  - 1 Multi-position rotary knob (selector)
  - 4 Rocker switches
  - 2 Slider switches
- **Hardware & Physical:** 2 force-feedback axes (Roll and Pitch, 15-bit magnetic encoder). Dimensions: width 325 mm, depth 252 mm, height 111 mm. Axial shaft length without yoke: 396–491 mm; with yoke: 500–595 mm. Weight 4.5 kg.
- **Coverage:** Set to `coverage: complete`.

### TQA and TQB Throttle Modules (`tqa-throttle-module.yaml`, `tqb-throttle-module.yaml`)
- **TQA:** Dual Airbus A3X style throttle levers with authentic detent steps (IDLE, CL, FLX/MCT, TOGA) and dual reverse-thrust latches.
- **TQB:** Dual Boeing style throttle levers with extended travel, 1 physical lift-to-arm reverse-thrust lever, and 1 TO/GA pushbutton.
- **Coverage:** Both updated to `coverage: complete`.

---

## 2. Product Sweep and Additions

### Added: MOZA AB6 Flight Simulator Bundle (`src/content/bundles/moza/ab6-bundle.yaml`)
- **Components:** Combines `moza/ab6-force-feedback-base` + `moza/mhg-flight-grip`.
- **Category:** `stick_combo`.
- **Pricing:** Verified on official regional stores:
  - US: USD 399
  - EU: EUR 449
  - UK: GBP 399
- **Image:** Downloaded official bundle hero image (`AB6_FLIGHT_SIMULATOR_Block-1_2400x960-1.png`) to `public/images/moza/ab6-flight-simulator-bundle.webp` (2400×960).
- **Platform:** `pc: supported`, consoles `unknown`.

### Evaluated and Excluded / Preserved in Notes:
1. **AMPCD Display Panel** (`https://us.mozaracing.com/products/ampcd`):
   - Dedicated square display panel for carrier aircraft (F/A-18).
   - Retail price USD 199.
   - Status: Excluded from component catalog because MOZA has published no technical specification table, no dimensions, no weight, and no manual. Preserved as an accessory/peripheral note.
2. **FMP18 Panel Bundle** (`https://us.mozaracing.com/products/fmp18`):
   - Front cockpit panel bundle combining dual DDI displays, AMPCD, and an FPP front panel (USD 849).
   - Status: Excluded because individual component records for DDI displays and FPP do not exist in MOZA's standalone catalog or our schema.
3. **MA3F EFCM L and R Modules** (`https://us.mozaracing.com/products/ma3f-efcm-l`, `https://us.mozaracing.com/products/ma3f-efcm-r`):
   - EFIS Left and Right side modules for the Airbus FCU system (USD 99 each).
   - Status: Connect via RJ11 directly to the `ma3f-efcm` main unit; they are not standalone USB devices. Their functionality and physical presence are documented in the `ma3f-efcm.yaml` record.
4. **HMA150 Motion Actuators** (`https://mozaracing.com/pages/hma150`):
   - Flagship haptic linear motion system for sim cockpits (linear servo actuators), not a HOTAS/flight controller.
5. **Passive mounting hardware** (Desk clamp, flight base adapter plate, yoke table clamp):
   - Excluded per catalog rules as passive accessories without electronics or controls.

---

## 3. Validation Summary

- **YAML Parsing:** All 24 MOZA component and bundle files validated cleanly using PyYAML with zero syntax or schema errors.
- **Schema Compliance:** All control structures follow `src/lib/schema.ts` (`hat`, `analog_ministick`, `button`, `lever`, `rotary`, `toggle`, `slider`, `switch`, `axis`).
- **Image Integrity:** Both `ay210-yoke-base.webp` and `ab6-flight-simulator-bundle.webp` verified in `public/images/moza/` and referenced in YAML files.
