# Honeycomb control inventory research

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.

Checked 2026-10-19 against Honeycomb product pages and official downloads. Coverage describes installed physical controls; any aggregate binding total is excluded from physical counts.

| Product / exact variant | Verified inventory and caveats | Coverage |
|---|---|---|
| Alpha Flight Controls Lite (HC003851) | [Official Lite page](https://eu.flyhoneycomb.com/products/alpha-flight-controls-lite) specifies a hat, two rockers, and four programmable buttons. | Complete for enumerated inputs |
| Alpha Flight Controls XPC (HC003653) | [Official XPC page](https://flyhoneycomb.com/products/alpha-flight-controls-xpc) specific left/right callouts show one left 8-way hat, four 2-way rockers, and two buttons on each handle. Broad prose instead says both handles have hats and three buttons plus PTT per handle. YAML follows specific callouts; PTT/button discrepancy remains unresolved. Page names master, alternator, avionics, light switches but does not enumerate individual panel switch count or mechanism. Ignition is a five-position selector represented as `rotary: selector`, `positions: 5`. Partial. |
| Alpha Flight Controls Yoke (SB003011) | [Official Alpha page](https://flyhoneycomb.com/products/alpha-flight-controls) provides the same detailed callouts and conflicting broad prose as XPC. YAML records one hat, four rockers, four detailed-callout buttons, and the five-position rotary selector. Panel switch count and PTT inclusion remain unresolved. Partial. |
| Bravo Throttle Quadrant Lite (HC003790) | [Official Lite page](https://flyhoneycomb.com/products/bravo-throttle-quadrant-lite) confirms four installed levers, trim wheel, parking brake, gear lever and interchangeable flap detent inserts; inserts are not extra controls. Trim is represented as encoder. Partial for unspecified electrical details. |
| Bravo Throttle Quadrant (HC003042) | [Official Bravo page](https://flyhoneycomb.com/products/bravo-throttle-quadrant) confirms six lever positions, seven assignable AP switches, TOGA, gear lever and trim wheel. Fourteen lamps are outputs. Optional flap kit is not installed inventory. Partial where mechanism/detent details are unspecified. |
| Charlie Rudder Pedals (HC003073) | [Official Charlie page](https://flyhoneycomb.com/products/charlie-rudder-pedals) identifies rudder and independent left/right toe brakes, represented as axes. No physical switches are listed. Complete. |
| Foxtrot Aviation Stick (HC003363) | [Official stick page](https://flyhoneycomb.com/products/foxtrot-aviation-stick) documents the grip and base input families including 3-position starter, 4-way radio switch with encoder, 5-way AP switch with encoder. Partial for ambiguous details. |
| Foxtrot Throttle Box / Takeoff Kit (HC004018) | [Official Takeoff Kit page](https://flyhoneycomb.com/products/foxtrot-takeoff-kit) confirms levers, reverse-thrust detents, parking brake, gear lever and engine switches, but not engine switch count/positions. Partial. |
| Sierra TPM Module (HC003998) | [Official Sierra page](https://flyhoneycomb.com/products/sierra-tpm-module) confirms three push-pull verniers, trim wheel, parking brake, flap lever and gear lever. LEDs are outputs. Partial for switch behavior. |

## Schema notes and unresolved details

The schema supports selector rotary position counts, rotary push actions, and lever push actions. The ignition selector is therefore recorded as a five-position rotary; coupled lever-end buttons are recorded with `push: true` rather than described as unrepresentable. The Alpha full-size handle prose conflicts with its specific left/right callouts, and the panel text lists switch functions without a physical count. Neither is resolved by the official text, so coverage remains partial and unverified counts are omitted. No extra schema fields were added.
