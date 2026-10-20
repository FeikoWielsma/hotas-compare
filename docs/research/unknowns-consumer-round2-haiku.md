# Consumer catalog unknowns — round 2 (Haiku pass)

Checked 2026-10-20. Scope: Honeycomb, Logitech, Turtle Beach, MFG and Slaw component and bundle records (41 files). Round 1 (`unknowns-consumer-round1.md`) and its Xbox/Alpha regressions were re-verified against primary pages before any new facts were added.

## Regressions corrected first

- **Turtle Beach Xbox support restored, with conditions:**
  - VelocityOne Complete Flight Pack bundle: page header "Compatible with XBOX | PC" → PC and Xbox supported. Source: bundle product page.
  - VelocityOne H.O.T.A.S. bundle: "Compatible with XBOX | Windows 10 & 11"; Xbox Series X|S & XBOX One USB via Flightstick II pass-through → PC and Xbox supported.
  - VelocityOne Dual Throttle: PC direct; Xbox only with Flightstick II pass-through → Xbox `supported`, conditional in notes.
  - VelocityOne Rudder Pedals: Xbox requires the Flight Universal Control System (or Flightstick pass-through) → Xbox `supported`, conditional in notes.
  - VelocityOne Flightstick: direct USB to Xbox Series X|S & One → Xbox `supported`. The previous "conditional on host" note was wrong for this device.
  - VelocityOne Flight yoke system: direct USB to Xbox Series X|S & One → Xbox `supported`. It is the host for the Rudder, not a dependent device.
  - VelocityOne Flightstick II: Xbox Series X|S direct USB → Xbox `supported`.
- **PS5 changed from `unsupported` to `unknown`** on every Turtle Beach and Honeycomb record. Neither brand's page says "not compatible with PS5"; the earlier value was inferred from absence.
- **Honeycomb Alpha Lite:** removed unsourced `potentiometer` sensor and 8-bit resolution on both axes, and removed 18 unsourced `false` booleans. The official page does not state sensor technology.
- **Honeycomb Alpha XPC:** removed 7 unsourced `push: false` flags. Inventory unchanged; it still matches the owner-supplied default-setup diagram (4 master/avionics switches, 5 light switches, 5-position ignition, 1 POV, 4 handle rockers, 4 handle buttons, 4 Xbox navigation buttons).
- **Honeycomb Alpha original:** sensor remains `null`. Official page specifies no technology.

## Physical values filled from official pages

| Record | Values | Source |
|---|---|---|
| TB Dual Throttle | 273 × 158 × 256 mm, 1,900 g (replaces previous 208 × 190 × 140, 1,300 g) | [Dual Throttle](https://www.turtlebeach.com/products/velocity-one-dual-throttle?Title=Default+Title) |
| TB Flightstick | 164.1 × 216.84 × 230.47 mm, 820 g | [Flightstick](https://www.turtlebeach.com/products/velocity-one-flight-stick) |
| TB Flightdeck (stick module) | 177 × 215.8 × 234.3 mm, 1,460 g | [Flightdeck](https://www.turtlebeach.com/products/velocity-one-flight-deck) |
| TB Rudder | materials `metal` (page says "sturdy metal construction"; previous steel/aluminium not stated) | [Rudder](https://www.turtlebeach.com/products/velocity-one-rudder) |
| Honeycomb Bravo | 273 × 382 × 198 mm, 3,794 g | [Bravo](https://flyhoneycomb.com/products/bravo-throttle-quadrant) |
| Honeycomb Charlie | 498 × 457 × 210 mm, 7,300 g; materials aluminium, metal, rubber | [Charlie](https://flyhoneycomb.com/products/charlie-rudder-pedals) |
| Honeycomb Foxtrot stick | materials `metal` | [Foxtrot stick](https://flyhoneycomb.com/products/foxtrot-aviation-stick) |
| Honeycomb Alpha Lite | materials `steel shaft` | [Alpha Lite](https://flyhoneycomb.com/products/alpha-flight-controls-lite) |

## Controls corrected from official evidence

- **Honeycomb Bravo:** Xbox `supported` only "in addition to Alpha XPC & XBOX Hub". PS5 not mentioned.
- **Honeycomb Charlie:** same conditional Xbox statement.
- **X52 Pro stick:** product tour (manual p.3, visually checked) shows **three** backlit fire buttons on the joystick head. Previous count was 2. Rendered from the official PDF with PyMuPDF.
- **X52 Pro throttle:** product tour (manual p.4) shows **two** fire buttons on the throttle head. Added.
- **X56 stick:** the manual overview (p.3, visual) lists POV hat (A), mini analog stick (B), thumb HATs "Witches and Castle" (C), trigger with two head buttons (D), pinkie and flying pinkie (F). Removed unsourced trigger `stages: 2` and mini-stick `push`. Hat count now reflects POV (1) plus thumb hats (2). Pinkie type is not stated, so it is recorded as a generic count.
- **X56 throttle:** removed unsourced mini-stick `push` and base-toggle `ways: 3`. Overview lists 7 base toggles and 2 base rotaries.

## Platform evidence added

- **Logitech (X52 Pro, X56):** the official manuals document Windows setup (X52 Pro: "Windows control panel", X56: "Windows 7/8/10"). PC `supported`, sourced from the manuals. No Xbox or PS5 statement exists in the manual or SKU pages.
- **MFG Crosswind V3 base/combo:** page states Windows, Mac OS and Linux support for the plug-and-play HID pedals. PC `supported`. No Xbox or PS5 statement.
- **MFG footrests and damper, Slaw damper:** mechanical accessories with no USB. Platform `unknown` on all three, following the round-1 rule.
- **Slaw Rotor / Viper V2:** manufacturer provides rudder calibration software; OS not stated. PC `supported` retained; console `unknown`.

## Sources attempted and unresolved

- **Logitech SKU pages** (`logitechg.com/en-us/shop/p/...`) for X52 Pro (945-000022), X52 Space (945-000025), X56 (945-000058) and Extreme 3D Pro: the "Specs and Compatibility" and "In the Box" sections are empty in the fetched text; no dimensions, weights or USB statements. Left as-is.
- **Logitech console support:** no Xbox or PS5 statement in any fetched page or manual. Unknown across all Logitech records.
- **Logitech Extreme 3D Pro:** page says "12 programmable buttons", which is a marketing total. Not converted to physical buttons; no manual was checked this round.
- **Logitech X52 standard, X52 Space, Saitek yoke/pedals/throttle quadrant:** manuals not checked this round. Controls, hardware and physical records are unchanged from round 1.
- **X56 thumb hat direction count:** the overview lists "Thumb HATs, Witches and Castle" without ways per hat; `ways` left unset.
- **X56 base toggles:** overview says 7 toggles, and the diagram shows labels up to SW 5 and TGL 1–3 (count not reconciled). Recorded as 7 per the manual callout.
- **X52 Pro / X56 throttle rotary inset buttons:** the X56 overview labels "Throttle Rotaries with inset buttons" without a count; not added.
- **Turtle Beach Flightdeck:** official hardware list reads "Stick Module with Gear Lever, 3-Position Rotary Dial & 39 Buttons". Kept as the existing aggregate treatment (39 programmable functions, not physical buttons), because the product's own function count and button count are not reconciled on the page.
- **Turtle Beach Flight yoke price:** the fetched page says the only base-unit price shown is for the refurbished version ($329.99 sale / $399.99 full). The record's US price was not changed. Needs confirmation of the new-unit price.
- **Turtle Beach HOTAS and Flightstick II status (`announced`):** the catalog-refresh note cites preorder text, but the live pages fetched this round show "Add To Cart"/"Buy Now" with no preorder statement. Status not changed; needs confirmation.
- **Honeycomb Bravo and Foxtrot throttle sensor fields:** not stated in fetched text; left as they were.
- **Honeycomb Captain's bundle:** page title is "for PC", and it contains the non-XPC Alpha. Xbox left `unknown`, not `unsupported`.
- **Honeycomb Alpha original PS5:** not mentioned → `unknown`.

## Verification

- All 41 assigned records parse as YAML and validate against `src/lib/schema.ts` (Zod, run with Node 26 `--experimental-strip-types`).
- No shared code or schema edited. No commits made. No prices invented or converted.
