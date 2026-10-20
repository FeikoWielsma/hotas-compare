# Turtle Beach new products — round 3 (Haiku pass)

Checked 2026-10-20. Scope: VelocityOne Flightstick II and VelocityOne Dual Throttle component records, plus the VelocityOne H.O.T.A.S. bundle (reviewed, not edited). The Flightdeck record, the yoke and the original Flightstick were not changed. The Flightdeck quick guide was used only as context.

## Official sources used

| Source | Used for |
|---|---|
| [Flightstick II Quick Start Guide article](https://support.turtlebeach.com/s/article/velocityone-flightstick-ii-quick-start-guide) | Numbered product tour (19 items), FMD navigation (H1 centre click), XBOX navigation, platform compatibility. Read from the article DOM. |
| [Flightstick II PC button chart (PDF)](https://acpv.prod.turtlebeach.com/support/v3/additional-files/en/43/VelocityOne-Flightstick-II-en.pdf) | Physical button groups and B-numbers. Rendered and visually inspected. |
| [Flightstick II XBOX button chart (PDF)](https://acpv.prod.turtlebeach.com/support/v3/additional-files/en/44/VelocityOne-Flightstick-II-en.pdf) | Text compared with the PC chart. Same groups; only labels differ (B27–B30 = A/B/X/Y, B31–B34 = view/share/menu/Xbox). |
| [Flightstick II Technical Specifications](https://support.turtlebeach.com/s/article/velocityone-flightstick-ii-technical-specifications) | 190 × 252 × 208 mm (W × H × D), 1400 g, 38 inputs, 8 axes. |
| [Dual Throttle Quick Start Guide (PDF)](https://cdn.turtlebeach.com/device/qig/velocityone--dual-throttle/velocityone--dual-throttle_457-5546-v1.pdf) | Product tour (17 items). Pages 2–3 rendered and visually inspected. WebFetch could not extract its text; extracted locally. |
| [Dual Throttle PC button chart (PDF)](https://acpv.prod.turtlebeach.com/support/v3/additional-files/en/45/VelocityOne-Dual-Throttle-en.pdf) | Physical button groups and B-numbers. Rendered and visually inspected. |
| [Dual Throttle XBOX button chart (PDF)](https://acpv.prod.turtlebeach.com/support/v3/additional-files/en/70/VelocityOne-Dual-Throttle-en.pdf) | Not used for counts. It uses different B-numbers (B56–B57 etc.). |
| [Dual Throttle Technical Specifications](https://support.turtlebeach.com/s/article/velocityone-dual-throttle-technical-specifications) | 35 inputs, 7 axes. Dimensions and weight conflict with the product page (see below). |
| Support topic pages: [Flightstick II](https://support.turtlebeach.com/s/topic/0TOUR0000003XfN4AU/velocityone-flightstick-ii), [Dual Throttle](https://support.turtlebeach.com/s/topic/0TOUR0000003Xdl4AE/velocityone-dual-throttle) | Confirmed the full list of additional files (button charts, screw sheets) and articles. |

Flightstick II PC chart: `work/fs2-files/pc-hi.png`. Dual Throttle tour: `work/qig-dt/dt-p3-tour-hi.png`. Dual Throttle PC chart: `work/dt-files/af-45-hi.png`.

## Flightstick II — physical controls applied

| YAML record | Count | Evidence |
|---|---|---|
| Dual analog levers (existing) | 2 | Tour item 1 |
| Lever detent buttons B05–B08 | 4 physical buttons | PC chart groups 3 and 10 (orange); tour item 1 "with detent buttons x2" |
| Analog POV1 with click press (B18) | 1, push | Tour item 3; PC chart group 1 |
| 4-way HAT1 (H1), centre click on the hat | 1, 4 ways, push | Tour item 4; PC chart group 7; QSG FMD text: press and hold centre of H1 for 1 second |
| Stick buttons B23–B25 | 3 physical buttons | Tour item 6; PC chart group 2 |
| Bumper B22 | 1 physical button | PC chart group 8 |
| Trigger B26 | 1 trigger | PC chart group 8; tour item 14 |
| Scroll wheel (analogue or digital) | 1 scroll_wheel | Tour item 7; PC chart group 9 |
| Dual encoder cockpit dial (existing) | 2 encoders | Product page; tour item 11 |
| Tri-position mode switch (existing) | 1, 3 positions | Product page |
| Base buttons B01–B04 and B27–B30 | 8 physical buttons | Tour item 10 "base buttons x8"; PC chart groups 4 and 12 |
| Menu buttons B31–B34 | 4 physical buttons | Tour item 12; PC chart group 5 |

Changes to existing records:
- "Precision thumbstick" is relabelled as the analog POV with click press. The product page names a thumbstick, and the tour and chart place the analog POV at that stick-head position. This identity is inferred, not stated by Turtle Beach.
- "Multi-function wheel" changed from `rotary` to `scroll_wheel`. The tour and chart both call it a scroll wheel with analogue and digital modes.

## Dual Throttle — physical controls applied

| YAML record | Count | Evidence |
|---|---|---|
| Lockable dual throttle levers (existing) | 2 analog | Tour item 1 |
| Lever-head L1/L2 buttons B24–B27 | Not added | PC chart groups 1 and 2 show these in cyan, which the chart legend defines as virtual outputs |
| Base lever (existing) | 1 analog | Tour item 11 |
| Base lever detent buttons B10, B11 | 2 physical buttons | PC chart group 10 (orange) |
| Analog POV1 with click press (B01) | 1, push | Tour item 3; PC chart group 8 |
| Rotary axis on lever head (product "textured wheel") | 1 rotary, mode analog | Tour item 2; PC chart group 7 WHEEL ↑↓ (green = axis). Identity inferred. |
| Rear scroll wheel (existing) | 1 scroll_wheel | Tour item 13; PC chart group 11 |
| 4-way HAT1 (H1, lever head) | 1, 4 ways | Tour item 4; PC chart group 7 |
| 4-way HAT2 (H2, rear handle) | 1, 4 ways | Tour item 12; PC chart group 6 |
| Thumb buttons B02–B04 | 3 physical buttons | Tour item 5; PC chart group 9 |
| Base buttons B12–B14 | 3 physical buttons | Tour item 9; PC chart group 3 |
| Toggle switches (B15–B20) | 3 toggles, no positions set | Tour item 8; PC chart group 4 shows two outputs per toggle |
| Rotary dial with centre click (B21–B23) | 1 rotary, push | Tour item 10; PC chart group 5 shows three outputs |
| Rear buttons B08, B09 | 2 physical buttons | Tour item 14; PC chart group 12 |

Throttle lock (tour item 15) and tension adjuster (17) are mechanical, not inputs, so they are not recorded. Detent cartridges and the RGB lightbars are not inputs.

## Aggregate counts not converted to physical buttons

- Flightstick II: "38 programmable inputs" and "8 axes" are not used for subtype inference. The dial's nine chart inputs (B09–B17) are grouped under the altitude, speed and heading modes unlocked by the tri-position switch. They are recorded as the existing encoder and switch, not as nine buttons.
- Dual Throttle: "35 programmable inputs" and "7 axes" are not used for subtype inference. Virtual outputs (B24–B27) are excluded.

## Conflicts — standalone values kept

- **Dual Throttle dimensions and weight.** Product page: 273 × 158 × 256 mm, 1.9 kg. Technical Specifications article: 190 × 140 × 208 mm, 1300 g. The standalone record keeps the product page values, per instruction. The article values match the pre-round-2 record.
- **Flightstick II dimensions.** Product page: 208 × 190 × 252 mm. Technical Specifications: 190 × 252 × 208 mm (W × H × D). Same three numbers, different order. The record is unchanged.
- **H.O.T.A.S. bundle Xbox platform (not edited).** The bundle page says "Xbox Series X|S & XBOX One USB connection through the Flightstick II pass-through". Both official support articles (Flightstick II and Dual Throttle) state Xbox Series X|S only. The bundle has no control data, and the store page and support articles disagree. This needs a decision.

## Still unavailable from official sources

- **Flightstick II standalone Quick Install Guide PDF.** The QSG article says a guide "can be downloaded here", but no PDF link appeared in the article DOM. Not located. The article tour and button charts were used instead.
- **Per-control technical facts.** Button and switch sensor type, click force, travel, backlight and debounce are not published for either product.
- **Trigger stages** (Flightstick II B26): not stated.
- **Click on the scroll wheels, the Dual Throttle hats and the Dual Throttle rotary dial**: not stated. Only the Flightstick II H1 centre click is documented (via FMD navigation).
- **Dual Throttle toggle positions**: not stated. The chart shows two outputs per toggle, which is not the same as the number of positions.
- **Dual Throttle rotary dial outputs**: which of B21–B23 is rotation and which is click is not stated.
- **Dual Throttle XBOX chart**: not compared with the PC chart.
- **H.O.T.A.S. bundle guide**: no bundle-specific quick guide was found. The bundle relies on the component guides.

## Verification

- Both component YAML files parse and pass `ComponentSchema` (`src/lib/schema.ts`), run with Node 26 `--experimental-strip-types` via `work/scripts/validate-tb.mts`. This is a schema check, not the project test suite.
- One label was quoted because it contained a colon-space, which broke the YAML parse.
- No commits, no shared code, no tests, no user questions. The Flightdeck record and the yoke and original Flightstick records were not touched.
