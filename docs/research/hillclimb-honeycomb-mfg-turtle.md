# Hillclimb: Honeycomb, MFG, Turtle Beach

Checked 2026-10-20. Scope was the component records for those three brands. Values below come from the current official product page, downloads page, or product photograph for the exact SKU. Silence, a related variant, or a currency conversion was not used to fill a field.

## Filled

| Product | Field | Value | Source |
| --- | --- | --- | --- |
| Alpha Flight Controls | `hardware.gimbal` | dual linear ball bearings | [Alpha](https://flyhoneycomb.com/products/alpha-flight-controls) states a steel shaft with dual linear ball bearings. Sensor technology is still not named. |
| Charlie Rudder Pedals | `hardware.force_adjustable` | true | [Charlie](https://flyhoneycomb.com/products/charlie-rudder-pedals) states an integrated tension knob for the rudder axis. |
| Bravo Throttle Quadrant Lite | `software` | Landing-gear LED driver | Listed on the [Lite product page](https://flyhoneycomb.com/products/bravo-throttle-quadrant-lite) downloads. |
| Sierra TPM Module | `software` | Landing-gear LED driver | Listed on the [Sierra product page](https://flyhoneycomb.com/products/sierra-tpm-module) downloads. |
| Foxtrot Aviation Stick | `software` | Foxtrot Aviation Stick firmware update | [Downloads](https://flyhoneycomb.com/pages/downloads), Foxtrot Aviation Stick section. |
| Foxtrot Throttle Box | `software` | Throttle Box firmware update | Same downloads page, named under Foxtrot Takeoff Kit. |
| Crosswind V3 Graphite | `hardware.force_adjustable` | true | [V3 base](https://mfg-sim.com/rudders/mfg-crosswind-v3-base.html) return-to-center tension knob. The graphite/Bf109 set is that base plus footrests. |
| Crosswind V3 Graphite | `hardware.cams_swappable` | true | Same page: CAM4 and CAM6 are included; further cams are separate. |
| Crosswind V3 Graphite | `connectivity.usb` | `b` | Same page: “2m USB A/B cable”. The previous `c` value is not on this page. |
| Crosswind V3 Graphite | `software` | MFG software package v2.17 | [Downloads](https://mfg-sim.com/downloads/) labels the package for Crosswind V1, V2 and V3 rudder pedals. |
| VelocityOne Rudder | `hardware.force_adjustable` | true | [UK rudder page](https://uk.turtlebeach.com/products/velocity-one-rudder): swappable rudder springs. |
| VelocityOne Dual Throttle | `hardware.force_adjustable` | true | [UK Dual Throttle page](https://uk.turtlebeach.com/products/velocity-one-dual-throttle): adjustable throttle tension. |
| VelocityOne Flightstick | `software` | Flightstick Companion App (iOS and Android) | [UK Flightstick page](https://uk.turtlebeach.com/products/velocity-one-flight-stick). |
| VelocityOne Flight | `software` | SIP Connect | [UK yoke page](https://uk.turtlebeach.com/products/velocity-one-flight). |
| Flightstick II | `prices.EU`, `prices.UK` | €139.99, £129.99 | [de.turtlebeach.com](https://de.turtlebeach.com/products/velocity-one-flight-stick-ii), [uk.turtlebeach.com](https://uk.turtlebeach.com/products/velocity-one-flight-stick-ii). Each page shows that single price. |
| Dual Throttle | `prices.EU`, `prices.UK` | €139.99, £129.99 | [DE](https://de.turtlebeach.com/products/velocity-one-dual-throttle), [UK](https://uk.turtlebeach.com/products/velocity-one-dual-throttle). |
| Flightdeck | `prices.EU`, `prices.UK` | €399.99, £379.99 | [DE](https://de.turtlebeach.com/products/velocity-one-flight-deck), [UK](https://uk.turtlebeach.com/products/velocity-one-flight-deck). |

`incl_vat: true` on the new EU and UK prices follows the existing catalog treatment of `de.turtlebeach.com` and `uk.turtlebeach.com`. Those pages show one consumer price and do not print a separate ex-VAT figure.

## Bravo lever reconciliation

The [Bravo page](https://flyhoneycomb.com/products/bravo-throttle-quadrant) and its current photographs support this and no further contact map:

- Six levers are installed slots. Box contents list both commercial and general-aviation lever sets, so those are alternate caps, not twelve installed levers.
- Official photographs show a 0–100 scale, a FLIGHT DETENT mark, a REVERSE region below zero, and a Go Around push button on a lever head. They do not identify an electrical contact at the detent or in the reverse region.
- A separate lever is labeled UP/DOWN. The gear panel is labeled N, L and R. The photograph does not say whether N/L/R are lever positions or indicator legends, so no position count was added.
- The [Flap Kit](https://flyhoneycomb.com/products/flap-kit-for-bravo) is a different SKU with 5-, 7- and 9-detent plates. It is not in the Bravo box and is explicitly not for Bravo Lite. Those plates are not installed contacts.
- [Downloads](https://flyhoneycomb.com/pages/downloads) publishes the landing-gear LED driver for Bravo, not a button or detent map. The quick-start guide named in the box is not linked. Per-lever `button_contacts` stay unset. Coverage stays partial.

Bravo Lite’s [page](https://flyhoneycomb.com/products/bravo-throttle-quadrant-lite) both calls flap detents optional and says the detent inlays are included. The box-contents list names the lever sets and does not name the inlays. Inlay count and electrical behavior stay unset.

## Left unset, and why

- **Original Alpha `hardware.sensor`.** The product page describes bearings and a damped self-centering mechanism. It does not name the sensor. XPC’s Hall-effect wording is an upgrade claim for XPC only.
- **Alpha and XPC handle `push`, rocker `analog`/`push`, button `backlit`, toggle `ways`/`momentary`/`push`.** The owner diagram and product pages identify the controls. They do not state center clicks, momentary return, or handle-button lighting. Both full-size pages do state red LED backlighting for the switch panel. Toggle records have no backlight field, so that fact is noted and not written onto the handle-button group.
- **Alpha Lite sensor, gimbal, damping, UK price.** The Lite page states 180° self-centering travel and does not say Hall, bearings, or damping. Honeycomb’s EU store prices this product in euros. There is no official GBP product page; UK delivery from the EU store may add duties. Reseller prices were not used.
- **Bravo and Bravo Lite** gimbal, damping, throw, axis names, materials, and lever `push` contacts. Not stated. The unlabeled side knob in a Bravo photograph was not treated as a tension control.
- **Charlie** cams, damping, extension, throw, and software. Tension is stated. No damper, swappable cam, extension, travel angle, or named configuration utility is stated. PS5 is not mentioned.
- **Foxtrot stick** trigger action, rocker analog/push, button backlight, switch momentary/push, autopilot positions, damping, throw, UK price. The page says both “5 two-way switches” and a 3-way starter plus a 5-way autopilot switch with an encoder. “5-way” was not converted into `positions: 5` because it can mean a directional switch rather than five selector positions. No official GBP page.
- **Foxtrot Throttle Box** weight, prices, sensor, and lever contacts. `foxtrot-throttle-box` returns 404 on flyhoneycomb.com. The Takeoff Kit price and any combined weight were not copied onto the throttle.
- **Sierra** sensor and lever `push`. The page names the verniers, trim wheel, parking brake, flap lever, and gear lever. It does not name a sensor or end contacts. No official GBP page.
- **MFG V3** weight, dimensions, damping, throw, Xbox, PS5. The base page says standard width was reduced by 5 mm and does not give the resulting width. Its linked [Specifications.pdf](https://mfg-sim.com/download/Specifications.pdf) includes a drawing labeled Crosswind V1.7, so those millimeter callouts were not assigned to V3. Footrest angle (21° to 61°, Bf109 max 52°) and toe-brake motion (20°) are different measures, not one `throw_deg`. Hydraulic damping is the separate damper SKU. The page names Windows, Mac, and Linux only.
- **MFG footrests and damper** platform, weight, dimensions, and inapplicable mechanism fields. These remain passive accessories. The accessory pages do not publish mass or a labeled dimension triple. Cam, extension, and throw do not apply to the footrests or the damper body; they were left unset rather than marked with a guessed false.
- **Turtle Beach control `push`, `backlit`, `ways`, `momentary`, trigger stages, and toggle positions.** Prior official charts and tours still do not state those properties. This pass did not reopen counts that those charts already settled.
- **Flightdeck Xbox and PS5, and assembled dimensions.** The [UK page](https://uk.turtlebeach.com/products/velocity-one-flight-deck) lists Windows 10/11 PCs and does not mention consoles. Absence was not recorded as an exclusion. No single assembled dimension is published.
- **Yoke weight and rudder weight/dimensions.** The current UK specification blocks publish yoke dimensions and do not publish yoke mass, rudder mass, or rudder dimensions.
- **PS5** on Honeycomb and Turtle Beach products that do not name it. Left `unknown`.
