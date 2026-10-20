# Hillclimb round 7c — luna6 — Logitech

Research date: 2026-10-21. Scope: Logitech. Sources were fetched from Logitech G product pages, Logitech Support specification articles/API, and Logitech-hosted manuals. Values below were restored only where a fetched first-party source states them. No Wayback claims are used.

## Restored or corrected catalog fields

| Product | Field change | Evidence |
| --- | --- | --- |
| Flight Instrument Panel | `physical.weight_g: 118`; `dimensions_mm: [94, 26, 84]` | Logitech Support gives 84 mm height, 94 mm width, 26 mm depth, and 118 g without bracket: [Technical Specifications](https://support.logi.com/hc/en-us/articles/360023302894-Flight-Instrument-Panel-Technical-Specifications). |
| Flight Multi Panel | `physical.weight_g: 392`; `dimensions_mm: [282, 57, 84]` | Logitech Support gives 282 mm width, 57 mm depth, 84 mm height, and 392 g without bracket: [Technical Specifications](https://support.logi.com/hc/en-001/articles/360023303134-Flight-Multi-Panel-Technical-Specifications). The page also explicitly reports no backlighting, but this was not converted into per-control button properties. |
| Flight Radio Panel | `physical.weight_g: 420`; `dimensions_mm: [282, 55, 84]` | Logitech Support gives 282 mm width, 55 mm depth, 84 mm height, and 420 g without bracket: [Technical Specifications](https://support.logi.com/hc/en-001/articles/360023462933-Flight-Radio-Panel-Technical-Specifications). This official figure is 420 g; a previous third-party figure of 419 g was not retained. |
| Flight Switch Panel | `physical.weight_g: 369`; `dimensions_mm: [282, 63, 84]` | Logitech Support gives 282 mm width, 63 mm depth, 84 mm height, and 369 g without bracket: [Technical Specifications](https://support.logi.com/hc/en-001/articles/360023462953-Flight-Switch-Panel-Technical-Specifications). |
| Flight Radio Panel | Corrected selector count to 1 and ACT/STBY switch count to 1; selector has 7 named modes | The [official Radio Panel guide](https://www.logitech.com/assets/65157/2/flight-radio-panel.pdf) describes a singular radio-mode selector, lists COM1, COM2, NAV1, NAV2, ADF, DME, and XPDR, names outer and inner frequency rotaries, and calls the transfer control one ACT/STBY switch. This replaces the earlier unsupported counts of two selectors and two transfer buttons. |
| Flight Switch Panel | Removed unverified `count: 13`; retained one five-position selector and one landing-gear lever | The fetched English [official Switch Panel guide](https://www.logitech.com/assets/65149/2/flight-switch-panel.pdf) labels engine-start, system ON/OFF, cowl OPEN/CLOSE and gear UP/DOWN controls, but does not state a count of 13 switches or their momentary/latching behavior. The [official product page](https://www.logitechg.com/en-us/shop/p/flight-simulator-switch-panel) explicitly says one five-setting rotary switch and a landing-gear lever. The 13 count stays unset. |
| X52 Pro Flight Stick | X/Y `sensor: contactless`; removed `hall` and unsupported Twist potentiometer assignments | The [official Pro product page](https://www.logitechg.com/en-us/shop/p/x52-pro-space-flight-simulator-controller.945-000022) and [official product tour](https://www.logitech.com/assets/65327/x52-professional-hotas.pdf) say non-contact technology applies to X and Y. Neither source identifies Hall effect or the Twist sensor type. |
| X52 Space Flight Stick | X/Y `sensor: contactless` | The [official X52 product page](https://www.logitechg.com/en-us/shop/p/x52-space-flight-simulator-controller.945-000025) states non-contact technology on X and Y. It does not name a specific sensor design. |
| X52 Pro HOTAS | Confirmed the existing stick/throttle weights and dimensions | Logitech Support’s [X52 Professional Technical Specifications](https://support.logi.com/hc/en-001/articles/360023462793-X52-Professional-Space-Flight-H-O-T-A-S-Technical-Specifications) states stick 278 × 170 × 170 mm / 905 g and throttle 190 × 170 × 170 mm / 728 g. The same article lists aggregate 7 axes, 3 hats, and 19 buttons for the full system; these totals were not redistributed among component records. |
| Pro Flight Yoke, Throttle Quadrant, Rudder Pedals | Removed unsupported potentiometer sensor assignments; retained measured fields and supported axis counts | The official [Yoke specs](https://support.logi.com/hc/en-us/articles/360023462873-Flight-Yoke-System-Technical-Specifications) list yoke 185 × 464 × 310 mm / 1,775 g, throttle quadrant 90 × 175 × 175 mm / 501 g, and system totals of 5 axes, 1 hat, 17 buttons. [Standalone quadrant specs](https://support.logi.com/hc/en-us/articles/360023462893-Flight-Throttle-Quadrant-Technical-Specifications) list 3 axes, 9 buttons, 90 × 175 × 175 mm, 501 g. [Rudder specs](https://support.logi.com/hc/en-us/articles/360023302934-Flight-Rudder-Pedals-Technical-Specifications) list 3 axes and 168 × 310 × 403 mm / 2,350 g without heel rests. These spec pages do not name sensor types. |
| Extreme 3D Pro | Removed the unconfirmed sensor assignments and 800 g weight; physical block is unset | Logitech’s [product page](https://www.logitechg.com/en-us/shop/p/extreme-3d-pro-joystick) states 12 programmable buttons and an 8-way hat but no sensor or weight. The official [Support specifications page](https://support.logi.com/hc/en-my/articles/360024728254--Specifications-Extreme-3D-Pro) reports no technical specifications. |
| Extreme 3D Pro | Consolidated inventory to the supported 12-button total and removed unsupported trigger/location/throttle details | The official product page states 12 programmable buttons and an 8-way hat, but no button placement, trigger stages, or throttle control. Same sources as above. |

## Prices and VAT

The Logitech store pages do not individually mark each EU/UK product price as VAT-inclusive. Logitech’s [Order FAQs](https://www.logitechg.com/en-ca/order-faqs), under “Do I have to pay VAT?”, states that online-store pricing includes VAT unless stated otherwise. Therefore existing EU/UK `incl_vat: true` flags remain valid for Logitech online-store prices, except where a product offer explicitly says otherwise. This policy does not establish VAT treatment for Amazon or other retailer prices. EU VAT-registered business checkout can be zero-rated after validation, as the FAQ explains.

## Still unset

- X52/X52 Pro sensor specifics beyond the stated non-contact X/Y technology: no Hall or magnetic type is named; throttle and twist sensors are not specified by the fetched product page, manual, or support spec.
- Yoke, throttle quadrant, and rudder pedal sensor types: the Support specifications give axes/counts and dimensions, not sensor types.
- Flight Switch Panel rocker count (including 13), switch latching/momentary behavior, and push behavior: the fetched manual and product page do not state these details.
- Radio Panel backlighting and push properties: its four LED displays and controls are described, but per-control illumination or push behavior is not established by the fetched sources.
- Panel enclosure materials: no manufacturer material statement found in the fetched specs.
- Extreme 3D Pro weight, dimensions, sensor technology, and official button-to-location breakdown: not stated in the fetched Logitech page/specifications.
- X52 Pro throttle sensor: not named in the Support spec or official product tour.

The X52 stick and throttle records also no longer claim unsupported negative push/backlight/momentary states; the manuals do not establish those per-control properties.

## Retrieval notes

- Logitech Support’s public Help Center search endpoint (`support.logi.com/api/v2/help_center/articles/search.json`) exposed technical-spec articles whose content was missed by earlier summary-only page reads. Canonical article URLs are cited above.
- The earlier X52 Pro user-guide PDF route was retried via the official Logitech assets path `https://www.logitech.com/assets/65327/x52-professional-hotas.pdf`; product-tour content confirms only the wording described above.
- The earlier Switch Panel manual URL returned an error, but a different official PDF variant was fetched successfully at `https://www.logitech.com/assets/65149/2/flight-switch-panel.pdf`. It still does not explicitly state the number 13.
- Wayback Machine requests were not accessible through the retrieval path in this round; no archive copy was used.
- No control or sensor property was inferred from product imagery. No YAML outside the Logitech brand folders was edited.
