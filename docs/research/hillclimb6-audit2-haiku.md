# Hillclimb 6 audit 2 (haiku-audit)

Audited 2026-10-21 the Gemini round 6 / 6b edits to `logitech` and `virpil` YAML: every added `push`, `backlit`, `momentary`, `center_detent`, `ways`, `positions`, `sensor`, `cams_swappable`, `throw_deg`, weight and dimension value, plus the Logitech Flight panel and X52 bundle prices.

Rule applied: a value stays only if an official manufacturer manual, spec table or product page states it. Silence leaves the key unset. Removed keys are listed below, with the reason and the source checked.

Method notes:
- Manuals: X52 HOTAS user guide (65328), Flight Yoke guide (65128), Flight Instrument Panel guide (65156), Flight Multi Panel guide (65126), Flight Radio Panel guide (65157) were downloaded and text-extracted with `pdftotext`. The Flight Switch Panel guide (65158) returned 403.
- Product pages were read with WebFetch, which summarises the page. Quotes below are as the fetch reported them. Strikethrough prices are inferred from the discount label and the lower amount, because the fetch loses strikethrough formatting.
- Virpil pages are on `virpil-controls.eu`. Where the page or the `.co.uk` / `.us.com` variant returned 403/404, the official support article or the EU B-stock listing was used. B-stock listings describe the same product but are used stock; they are noted per record.
- Images (button-mapping diagrams) could not be read. Claims that rest only on a diagram are unset.

## Logitech: values removed

| Product | Removed (added by Gemini) | Reason / source |
| --- | --- | --- |
| X52 Space Flight Stick | `push: false` on mode selector, base switches, pinkie switch | Manual product tour names no push function for these: [X52 HOTAS guide](https://www.logitech.com/assets/65328/2/x52-hotas.pdf) |
| X52 Space Flight Stick | base switches `ways: 3` reverted to `ways: 2`; notes "center neutral" removed | Manual: "3 toggle switches Spring loaded ... extra 6 programmable flight commands", so two directions per switch. Center-neutral and 3-way are not stated. Same source. |
| X52 Space Flight Stick | `hardware.sensor: hall`, axis sensors X/Y `hall`, Twist `potentiometer` | Manual says only "Non-contact technology on x and y axes". No sensor type or Twist sensor is stated. Same source. |
| X52 Pro Flight Stick | mode selector `push: false`; base switches `push: false`; base switches `ways: 3` reverted to `ways: 2` | Same family guide used (see note below). The Pro-specific guide (65327) was not text-extracted. |
| X52 Throttle | thumb slider `center_detent: false` | Manual: "Smooth-action thumb slider" with no detent statement. Same source. |
| X52 Throttle | `hardware.sensor: potentiometer` and axis `potentiometer` | Manual names no sensor type. Same source. |
| G Flight Yoke (yoke) | `push: false` on POV hat, 3 rockers, mode selector | Manual: "8-way point of view hat switch", "2-way rocker", "3-position Mode switch". No push function stated. [Flight Yoke guide](https://www.logitech.com/assets/65128/flight-yoke-system.pdf) |
| G Flight Yoke (yoke) | `momentary: false` on mode selector | "3-position Mode switch": latching not stated. Same source. |
| G Flight Yoke (yoke) | `backlit: false` on handle buttons and chronograph buttons | Not stated. Same source. |
| Extreme 3D Pro | `backlit: false` on buttons 2, 3-6, 7-12; `push: false` on 8-way hat | Official page states "12 programmable buttons" and "8-way hat switch", nothing about backlight or push: [Extreme 3D Pro](https://www.logitechg.com/en-us/shop/p/extreme-3d-pro-joystick). `coverage` changed from complete to partial, because the throttle lever, button numbering and the trigger/thumb/head/base split are not on that page. |
| Flight Instrument Panel | `backlit: false` on 6 hotkeys and 2 cursor buttons | Product page: "Backlighting: Absent". Manual silent. [Product page](https://www.logitechg.com/en-us/shop/p/flight-simulator-instrument-panel) |
| Flight Instrument Panel | `push: false` on dials; label "continuous" removed; label now "Twin display selection dials" | Product page: "Twin dials and a set of hotkeys". Push and continuous behaviour not stated. |
| Flight Instrument Panel | `hardware` values, `axes: []`, `physical` weight 118 g and dimensions 94x26x84 mm, `materials: [abs]`; both blocks set to `null` | The official product page spec section is empty in the fetch. A search summary cited a Logitech HK spec page, but the fetch of that page also had an empty spec section. Not verified. |
| Flight Multi Panel | `backlit: false` on 8 AP buttons | Manual silent. Product page: no backlight statement. |
| Flight Multi Panel | `hardware` values; `physical` (392 g, 282x57x84 mm, abs) set to `null` | Same as Instrument panel: spec section empty in fetch. Not verified. |
| Flight Radio Panel | `backlit: false` on ACT/STBY buttons | Product page: "Four LED displays"; no backlight statement. |
| Flight Radio Panel | `hardware` values; `physical` (419 g, 282x55x84 mm) set to `null` | Same as above. |
| Flight Switch Panel | `momentary: false` on 13 ON/OFF switches | Product page names the five-setting rotary and lever only, no ON/OFF or momentary statement. |
| Flight Switch Panel | `hardware` values; `physical` (369 g, 282x63x84 mm, abs) set to `null` | Spec section not stated. Not verified. |

## Logitech: prices

| Product | Region | Was | Now | Source (fetched) |
| --- | --- | --- | --- |
| X52 HOTAS System (bundle) | EU | 179.99 | 179.99 (kept) | [de-de](https://www.logitechg.com/de-de/shop/p/x52-space-flight-simulator-controller): "179,99 €" |
| X52 HOTAS System (bundle) | UK | 159.99 | 159.99 (kept) | [en-gb](https://www.logitechg.com/en-gb/shop/p/x52-space-flight-simulator-controller): "£159.99" |
| X52 HOTAS System (bundle) | US | 159.99 | 159.99 (kept) | [en-us](https://www.logitechg.com/en-us/shop/p/x52-space-flight-simulator-controller.945-000025): "$159.99" |
| X52 Pro HOTAS System (bundle) | EU | 229.99 | 229.99 (kept) | [de-de](https://www.logitechg.com/de-de/shop/p/x52-pro-space-flight-simulator-controller): "229,99 €" |
| X52 Pro HOTAS System (bundle) | UK | 199.99 | 199.99 (kept) | [en-gb](https://www.logitechg.com/en-gb/shop/p/x52-pro-space-flight-simulator-controller): "£199.99" |
| X52 Pro HOTAS System (bundle) | US | 199.99 | 199.99 (kept) | [en-us](https://www.logitechg.com/en-us/shop/p/x52-pro-space-flight-simulator-controller.945-000022): "$199.99" |
| Flight Instrument Panel | US / UK / EU | 179.99 / 139.99 / 159.99 | unchanged (verified) | [en-us](https://www.logitechg.com/en-us/shop/p/flight-simulator-instrument-panel) $179.99; [en-gb](https://www.logitechg.com/en-gb/shop/p/flight-simulator-instrument-panel) £139.99 (page shows "Sold Out Temporarily"); [de-de](https://www.logitechg.com/de-de/shop/p/flight-simulator-instrument-panel) 159,99 € |
| Flight Multi Panel | UK | 79.99 | **69.99** | [en-gb](https://www.logitechg.com/en-gb/shop/p/flight-simulator-autopilot-multipanel): current £69.99, original £79.99 (12% off label) |
| Flight Multi Panel | EU | 89.99 | **84.99** | [de-de](https://www.logitechg.com/de-de/shop/p/flight-simulator-autopilot-multipanel): current 84,99 €, original 89,99 € (5% Rabatt) |
| Flight Multi Panel | US | 169.99 | 169.99 (kept) | [en-us](https://www.logitechg.com/en-us/products/flight/flight-simulator-autopilot-multipanel.html): "$169.99" |
| Flight Radio Panel | UK | 94.99 | **79.99** | [en-gb](https://www.logitechg.com/en-gb/shop/p/flight-simulator-cockpit-radio-panel): current £79.99, original £94.99 (15% off label) |
| Flight Radio Panel | EU | 109.99 | **89.99** | [de-de](https://www.logitechg.com/de-de/shop/p/flight-simulator-cockpit-radio-panel): current 89,99 €, original 109,99 € (20,00 € Rabatt) |
| Flight Radio Panel | US | 169.99 | 169.99 (kept) | [en-us](https://www.logitechg.com/en-us/shop/p/flight-simulator-cockpit-radio-panel): "$169.99" |
| Flight Switch Panel | US / UK / EU | 119.99 / 59.99 / 69.99 | unchanged (verified) | [en-us](https://www.logitechg.com/en-us/shop/p/flight-simulator-switch-panel) $119.99; [en-gb](https://www.logitechg.com/en-gb/shop/p/flight-simulator-switch-panel) £59.99; [de-de](https://www.logitechg.com/de-de/shop/p/flight-simulator-switch-panel) 69,99 € |

Not checked: whether the EU/UK prices include VAT. None of the pages above say "incl. VAT" or "inkl. MwSt", so the `incl_vat: true` flags on EU/UK prices are left as they were. Flagged for a decision.

## Logitech: kept (with source)

- X52 Space stick: 3 fire buttons `backlit: true` ("3 Fire Buttons Backlit", manual p. 3); base switches `momentary: true` ("Spring loaded"); trigger, hats 8-way, scroll wheel `push: true` ("includes built-in button", manual p. 4); idle/afterburner detents (manual p. 4).
- Yoke: 3 rockers, 8-way hat, 2 handle buttons, 3-position mode selector, 3 chronograph buttons (manual feature list).
- Extreme 3D Pro: 8-way hat, 12 programmable buttons (product page).
- Flight Instrument Panel: 6 left-side display hotkeys and 2 cursor up/down buttons (manual p. 6: "The six buttons on the left"; "cursor up or down buttons at the bottom centre"). Twin dials (product page).
- Flight Multi Panel: 8 AP buttons, 2-way flaps rocker, 3-way autothrottle, function selector, value knob, pitch trim wheel (manual, product page "two-way rocker switch", "built-in trim wheel").
- Flight Radio Panel: rotary/encoder and ACT/STBY entries kept, but counts are unverified (see below).
- Flight Switch Panel: five-setting rotary switch `positions: 5` (product page: "five-setting rotary switch"), landing gear lever (product page: "physical lever").
- Platform: `pc: supported` kept on all panels (manual Windows 10/8.1/7 setup; Multi page: "works with Windows 7, 8.1 and 10"). Xbox and PS5 remain `unknown`.

## Logitech: unresolved (flagged, not changed)

- Flight Radio Panel: the manual names one "radio mode selector knob" and one "ACT/STBY switch", singular. The records say 2 and 2. Counts left as-is, `coverage` set to partial.
- Flight Switch Panel: "13 ON/OFF rocker switches" comes from the user guide, which returned 403. Left as-is, `coverage` set to partial. Also `ways: 2` on the rockers (not Gemini's change) is not stated by the product page.
- Extreme 3D Pro: the throttle lever, the trigger/thumb/head/base split and `weight_g: 800` are not on the official page. They predate Gemini's edits and were left as-is for review.
- Flight Instrument Panel, Multi, Radio, Switch: weight and dimensions were removed. A search summary cited Logitech spec figures, but the fetched official pages showed empty spec sections. If Logitech's spec table can be read from a browser, the values can be restored with that source.
- X52 Pro Flight Stick: the Pro-specific user guide (65327) was not text-extracted. The Pro edits rely on the family guide (65328).
- X52 Space and Pro sticks: `hardware.gimbal: ball_joint` and the pinkie switch `positions: 2`/`momentary: false` predate Gemini's edits. Not verified.
- X52 throttle: rotary `push: false` (two analogue rotaries), hat `push: false`, and the head/clutch buttons `backlit: false` predate Gemini's edits. Manual does not state them; flagged.

## Virpil: values removed

| Product | Removed or changed | Reason / source |
| --- | --- | --- |
| B-Jet Ministick Module | ministick sensors `contactless_magnetic` -> `contactless` (3 places) | Page: "Contactless Analogue Ministick". "Magnetic" not stated. [Page](https://virpil-controls.eu/b-jet-ministick-module.html) |
| CDT-VMAX Throttle | axis sensors `contactless_magnetic` -> `contactless` (5 places) | Page: "VPC Contactless Digital Proximity Sensors". "Magnetic" not stated. [Page](https://virpil-controls.eu/vpc-cdt-vmax-throttle.html) |
| Constellation Alpha Prime [R] | top-level `sensor` removed; ministick X/Y sensors removed; brake and twist `contactless_magnetic` -> `contactless`; `force_adjustable: false`, `cams_swappable: false`, `extension_support: false` removed | Page: "VPC Contactless Sensor" on brake lever and lockable twist axis only; stick sensor not stated; force/cams/extension not stated. [Page](https://virpil-controls.eu/vpc-constellation-alpha-prime-r.html) |
| MongoosT-50CM3 Throttle | `push: false` on both levers, handle encoder, ON-OFF-ON and ON-ON toggles, 5-way mode dial; `center_detent: false` on slider; `backlit: false` on handle buttons; `weight_g: 3100` removed; sensors -> `contactless` | Official listing (EU B-stock): "2 x Throttle Axes (VPC Contactless Sensors)"; push only stated for encoders; "Slider Axis" center detent and handle button LEDs not stated; no weight figure. The standard product page returned 404 and the support article has no specs. Used-stock listing, so specs are from the same product text. [B-stock](https://virpil-controls.eu/vpc-mongoost-50cm3-throttle-b-stock.html) |
| MongoosT-50CM4 Throttle | `push: false` on both levers and 3 ON-OFF-ON momentary toggles; `backlit: false` on base single button and grip buttons | Page: "Throttle Axes (Contactless Sensors)" kept; levers and toggles push not stated; B1-B6 RGB stated, other buttons' lighting not. [Page](https://virpil-controls.eu/mongoost-50cm4-throttle.html) |
| VPC Universal Control Panel #1 | `push: false` on ON-OFF-ON, ON-ON, flip-cover toggles and axis dials; `sensor: contactless_magnetic` on Dial 1/2 removed | Page: "6 x Momentary Toggle Switches (ON-OFF-ON)", "2 x Latched", "2 x Flip Cover Toggle Switches", "2 x Axis Dials" (no push or sensor stated). Encoders (+ Push) kept. [Page](https://virpil-controls.eu/vpc-control-panel-1.html) |
| VPC Universal Control Panel #2 | `push: false` on 3 toggle types and landing gear lever; `momentary: false` and `positions: 3` on lever removed; label now "Landing-gear lever (2- or 3-position detent plate)" | Page: 2- or 3-position is a swappable detent plate, not a fixed count; spring-loaded lift; momentary/latched not stated. [Page](https://virpil-controls.eu/vpc-control-panel-2.html) |
| VPC Universal Control Panel #3 | `push: false` on axis levers and 2 toggle types; `backlit: false` on 3 momentary push buttons; `push: true` on 5-way mode dial; notes rewritten; sensors -> `contactless` | Page: "4 Axis Levers using High Precision VPC Contactless Digital Sensors"; "Momentary Push Buttons" backlit not stated; mode dial push not stated (the cited button-mapping diagram could not be read). Encoders (+Push) and RGB tactile backlit kept. [Page](https://virpil-controls.eu/vpc-universal-control-panel-3.html) |
| VPC Dual-SF Collective Grip | `action: sequential` on 2 single-stage triggers; `backlit: false` on 6 push buttons; `momentary: true` and `push: false` on [ON]-OFF-[ON] toggle | Page: "Single Stage Trigger"; button LEDs not stated; bracket notation "does not explain" latching or momentary. Hats with push kept (4-way and 2-way "+ Push"). [Page](https://virpil-controls.eu/vpc-dual-sf-collective-grip.html) |
| VPC FLNKR Grip | `action: sequential` on primary trigger; `backlit: false` on 8 buttons; `push: false` on brake lever | Page: "primary single-stage trigger"; button backlight not stated; brake lever push not stated. [Page](https://virpil-controls.eu/vpc-flnkr-grip.html) |
| VPC HAWK-60 Grip | `action: sequential` on trigger; `push: false` on ON-OFF-ON toggle | Page: "Single-Stage Trigger"; toggle push not stated. [Page](https://virpil-controls.eu/vpc-hawk-60-collective-grip.html) |
| VPC Rotor TCS Base (Upgraded) | `push: false` on collective; `sensor: contactless_magnetic` on collective (top and axis) removed; `cams_swappable: true` removed; `throw_deg: 40` removed | Support manual: limiter adjusted by unscrewing two marked screws; no cams in the box; no degree range, no swap statement; collective push and sensor not stated. Official EU product page 404; US product page 403. [Support manual](https://support.virpil.com/en/support/solutions/articles/47001258804-rotor-tcs-base-upgraded-user-manual) |
| VPC Rotor TCS Plus Base (`vpc-rotor-tcs-base`) | `push: false` on collective and twist axes; `backlit: false` on engine idle button; `momentary: false` and `push: false` on twist restrictor switch; `cams_swappable: true` and `throw_deg: 40` removed | Product page: collective push not stated; sensor for collective not stated; "3-Position Cam Plate to Limit the Travel Range" with no degree figure; no statement that cams are swappable; no engine idle button or twist restrictor details. [Page](https://virpil-controls.eu/products/vpc-rotor-tcs-plus-base) |
| VPC SharKa-50 Collective Grip | `push: false` on 3 ON-OFF-ON toggles; `backlit: false` on 3 push buttons | Page: "3 x ON-OFF-ON" with no push or backlight statement. 8-way hats (+Push) and 2-way switch (+Push) kept. [Page](https://virpil-controls.eu/vpc-sharka-50-collective-grip.html) |
| VPC VMAX Prime Throttle | `push: false` on 2 levers and toggles, `push: false` on mode dial; `positions: 5` on mode dial removed; `weight_g: 3100` removed | Page: "Mode Switch Dial" with no positions or push; levers push not stated; "Product Weight" field blank. Toggles stated as momentary, kept. [Page](https://virpil-controls.eu/vpc-vmax-prime-throttle.html) |

## Virpil: kept (with source)

- Atlas FFB Base and Atlas Pro FFB Base: gimbal `contactless_magnetic` kept. Page: "VPC Contactless Digital Sensors... described with 'contactless magnetic sensing'"; `throw_deg` left unset because the page says "axis range of 18 degrees" without total or per-side ([Atlas](https://virpil-controls.eu/atlas-ffb-base.html), [Atlas Pro](https://virpil-controls.eu/atlas-pro-ffb-base.html)).
- B-Jet Yoke Handle: 8-way hat `push: true` and 4-way hat `push: true` kept ("8-Way Hat w/ Push", "4-Way Hat w/ Push"; [page](https://virpil-controls.eu/b-jet-yoke-handle.html)).
- PRM Hat Module: 4-way hat with push kept ("4-WAY + PUSH HAT INPUT", "locking push input"; [page](https://virpil-controls.eu/prm-hat-module.html)).
- PRM HES Module: `hall_effect` kept ("Contactless Hall-Effect Stick Module"; [page](https://virpil-controls.eu/prm-hes-module.html)).
- R1 Falcon / Legend Rudder Pedals: toe brake `contactless_magnetic` kept as a judgement call. The page states "VPC Contactless Digital Proximity Sensors" and "reliability with its magnetic sensing" for the pedals as a whole, but does not state a sensor per toe brake ([Falcon](https://virpil-controls.eu/r1-falcon-rudder-pedals.html), [Legend](https://virpil-controls.eu/r1-legend-rudder-pedals.html)).
- Vector Flight Yoke Base: `contactless_magnetic` kept ("VPC Contactless Digital Sensors", "magnetic sensing"). Pitch throw in degrees left unset (page gives 160 mm). Magnetic detent noted ([page](https://virpil-controls.eu/vector-flight-yoke-base.html)).
- VEGA Yoke Handle: 8-way hats with push kept ("2 x 8-Way Hat w/ Push"); scroll wheel `push: true` kept ("1 x Scroll Wheel w/ 2 x Push"); RGB push buttons `backlit: true` kept as "programmable RGB" (the page does not use the word "backlit"; this is a reading). Luna's uncommitted edits to this file (push on lever, backlit on 2 push buttons) were not changed ([page](https://virpil-controls.eu/constellation-vega-yoke-handle.html)).
- CM4 throttle sensors `contactless` kept (matches "Throttle Axes (Contactless Sensors)").
- Control Panel #1 encoders `push: true` and momentary ON-OFF-ON kept; Control Panel #3 RGB tactile `backlit: true` and 5-way mode dial `positions: 5` kept.

## Virpil: Luna's uncommitted edits (not re-audited)

Four files already carry Luna's uncommitted removals in the working tree: `constellation-vega-yoke-handle.yaml`, `vector-engine-mcp.yaml`, `vector-gear-mcp.yaml`, `vector-lighting-mcp.yaml`. Luna's note is `docs/research/hillclimb6-audit-luna.md`. This audit checked only the VEGA hats, scroll wheel and RGB buttons, listed above. The Vector MCP fields were not re-checked.

## Virpil: unresolved / pre-existing (flagged, not changed)

- Pre-existing `sensor: contactless_magnetic` on several records where the official wording is only "contactless": MongoosT-50CM3 top-level (now changed), Control Panel #1 top-level, Control Panel #3 top-level (changed), MongoosT-50CM3 base panel, Flanker axes, VMAX Prime axes. Left as-is where Gemini did not add them.
- Weights not stated on the official page but present (predate Gemini's edits): Alpha Prime [R] `weight_g: 540`; Flanker `weight_g: 650`; Rotor TCS Plus Base `weight_g: 1650` (page says 1.5 kg); VPC Control Panel #1 `weight_g: 1900` (page 1.9 kg, matches). Flagged, not changed.
- Pre-existing `cams_swappable: false` and `throw_deg: null` on CP3, Dual-SF, Flanker, HAWK-60, SharKa-50, Alpha Prime [R] (partly removed), B-Jet Ministick: not stated on the official pages. Flagged.
- MongoosT-50CM3: the standard product page is 404 on `.eu` and `.co.uk`; the B-stock listing is used product. Re-check when a new-unit page is available.
- Virpil prices were not in scope (grok3 handles price blocks). The Logitech price blocks above were verified.

## Files changed

- Logitech: `x52-space-flight-stick.yaml`, `x52-pro-flight-stick.yaml`, `x52-throttle.yaml`, `g-saitek-pro-flight-yoke.yaml`, `extreme-3d-pro.yaml`, `flight-instrument-panel.yaml`, `flight-multi-panel.yaml`, `flight-radio-panel.yaml`, `flight-switch-panel.yaml`.
- Virpil: `mongoost-50cm3-throttle.yaml`, `mongoost-50cm4-throttle.yaml`, `vpc-control-panel-1.yaml`, `vpc-control-panel-2.yaml`, `vpc-control-panel-3.yaml`, `vpc-dual-sf-collective-grip.yaml`, `vpc-flanker-grip.yaml`, `vpc-hawk-60-grip.yaml`, `vpc-rotor-tcs-base-upgraded.yaml`, `vpc-rotor-tcs-base.yaml`, `vpc-sharka-50-collective-grip.yaml`, `vpc-vmax-prime-throttle.yaml`, `b-jet-ministick-module.yaml`, `cdt-vmax-throttle.yaml`, `constellation-alpha-prime-r.yaml`.
- No Virpil or Logitech price blocks were changed except the Multi UK/EU and Radio UK/EU values listed above.
- `pnpm check`: 0 errors, 0 warnings, 4 hints (before and after the edits).
