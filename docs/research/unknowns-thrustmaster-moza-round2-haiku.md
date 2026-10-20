# Thrustmaster and MOZA catalog unknowns — round 2 (Haiku)

Checked 2026-10-20. Scope: Thrustmaster and MOZA component and bundle records. This round covers the T.Flight HOTAS 4 and HOTAS X split records, the MOZA AB9 sensor claim, and regional Thrustmaster price gaps. Sources are first-party manuals, product and support pages, and official Thrustmaster shop pages. Retailer listings were used only to flag conflicts, never as values.

Method notes: the Thrustmaster shop pages (`shop.thrustmaster.com/en_gb`, `en_eu`) were read from the Magento `product:price:amount` tag, which is the displayed final price. `en_us` shop slugs returned 404 for these products.

## Records changed

| Record | Change | Primary source |
|---|---|---|
| `components/thrustmaster/t-flight-hotas-4.yaml` | Inventory added: throttle lever, rudder via twisting handle, rudder rocker on throttle, POV hat, PS button with LED. `hardware.force_adjustable: true` (handle resistance dial). USB and RJ12 rudder connector noted. Official photo added. EU and UK prices added. | [HOTAS 4 manual](https://ts.thrustmaster.com/download/accessories/Manuals/TFH4/T-Flight_Hotas_4_Manual.pdf), [support page](https://support.thrustmaster.com/en/product/tflighthotas4-en/) |
| `components/thrustmaster/t-flight-hotas-x.yaml` | Inventory added: throttle lever, rudder via twisting handle, rudder rocker (analog, 5th axis in 5-axis mode), POV hat, 12 action buttons (official total), PRESET, MAPPING, HOME (LED), USB selector switch. Axes named X, Y, Z, RZ, Slider 0 from the PC automatic-preset diagram. `force_adjustable: true`. USB noted as PC. Platform note corrected to the manual's "Compatible: PC". Official photo added. EU and UK prices added. | [HOTAS X manual](https://ts.thrustmaster.com/download/accessories/Manuals/TFHX/t-flight_hotas_X_manual.pdf), [product page](https://www.thrustmaster.com/products/t-flight-hotas-x/) |
| `components/moza/ab9-force-feedback-base.yaml` | `hardware.sensor` changed from `magnetic_encoder` to `encoder`. Source added. | [MOZA EU product page](https://eu.mozaracing.com/products/ab9-base), [MOZA support](https://support.mozaracing.com/en/support/solutions/articles/70000668982-moza-ab9-base-support) |
| `components/thrustmaster/airbus-add-on-grip.yaml` | `prices` added: EU EUR 99.99, UK GBP 89.99. | shop pages (en_eu, en_gb) |
| `components/thrustmaster/omni-extension.yaml` | `prices` added: EU EUR 39.99, UK GBP 39.99. | shop pages (en_eu, en_gb) |
| `components/thrustmaster/sol-r-3-ava-add-on-grip.yaml` | UK GBP 89.99 added. | en_gb shop page |
| `components/thrustmaster/sol-r-5-base.yaml` | UK GBP 109.99 added. | en_gb shop page |
| `components/thrustmaster/sol-r-6-throttle.yaml` | UK GBP 89.99 added. | en_gb shop page |
| `bundles/thrustmaster/sol-r-4-hotas.yaml` | UK GBP 199.99 added (see conflict note below). | en_gb shop page |
| `bundles/thrustmaster/hotas-warthog-mkii.yaml` | UK GBP 449.99 added. | en_gb shop page |
| `bundles/thrustmaster/hotas-warthog-ava-edition.yaml` | UK GBP 519.99 added. | en_gb shop page |

Existing EU prices on the Dutch (nl-nl) pages match the `en_eu` shop pages for SOL-R 5, SOL-R 6, SOL-R 3 AVA, SOL-R 4 HOTAS, Warthog MKII and Warthog AVA. Those were left unchanged.

Asset: `public/images/thrustmaster/t-flight-hotas-4.webp` (800×710, converted from the official support JPEG) and `public/images/thrustmaster/t-flight-hotas-x.webp` (768×768, official product-listing WebP).

All 11 edited records were parsed with PyYAML and validated against the actual `ComponentSchema` and `BundleSchema` from `src/lib/schema.ts` with zod 4.6.7. All passed.

## Resolved facts (primary sources)

**T.Flight HOTAS 4 (manual, English pp. 2–6)**
- Technical features list: throttle (detachable), USB connector, rudder RJ12 connector (TFRP pedals sold separately), rudder via twisting handle, rudder locking screw, Allen key, handle resistance adjustment dial, rudder rocking button on throttle, action buttons, PS button with LED, multidirectional POV hat.
- The manual states handle resistance is adjustable with the dial under the base. That confirms `force_adjustable: true`.
- Platforms: PS5 and PS4 (Flight Stick mode), and PC. The support page lists the manual for PC, PS4 and PS5.
- Firmware updates are on PC only.

**T.Flight HOTAS X (manual, English pp. 2–9)**
- Technical features list: throttle, USB connector, USB selector (set to PC), rudder via twisting handle, rudder locking screw, PRESET button (LED), MAPPING button, Allen key, handle resistance dial, rudder rocking button (or 5th axis), action buttons, HOME button with LED, POV hat.
- Cover: "Compatible: PC".
- The automatic-preset PC diagram labels the axes X, Y, Z (throttle), RZ (twist, 4-axis mode), and Slider 0 (rocker, 5-axis mode).
- The HOME button switches between red LED (4-axis) and green LED (5-axis).
- Official product page: 12 action buttons, 5 axes, 2165 g, 24.2 × 26.5 × 26.4 cm (W × H × D). Stored as W × D × H `[242, 264, 265]`, matching the existing convention (for example, HOTAS 5 `[350, 200, 235]`).

**MOZA AB9**
- The MOZA support page says "dual servo motors" with segmented winding, and "PC only". It doesn't mention an encoder, sensor, or Hall element.
- The EU product page describes "dual servo motors delivering a peak torque of 12Nm" and "a high-resolution encoder". It does not name the encoder type.
- Decision: `sensor: encoder`. The magnetic claim was not supported. Servo motors are actuators, not sensors.

**Thrustmaster shop prices (current displayed price)**

| Product | EU | UK |
|---|---|---|
| T.Flight HOTAS 4 | EUR 89.99 | GBP 79.99 |
| T.Flight HOTAS X | EUR 79.99 | GBP 69.99 |
| Airbus Add-On Grip | EUR 99.99 | GBP 89.99 |
| Omni Extension | EUR 39.99 | GBP 39.99 |
| SOL-R 3 AVA Add-On Grip | EUR 99.99 | GBP 89.99 |
| SOL-R 5 Base | EUR 129.99 | GBP 109.99 |
| SOL-R 6 Throttle | EUR 99.99 | GBP 89.99 |
| SOL-R 4 HOTAS | EUR 279.99 | GBP 199.99 (special) |
| HOTAS Warthog MKII | EUR 549.99 | GBP 449.99 |
| HOTAS Warthog AVA Edition | EUR 599.99 | GBP 519.99 |

All prices are direct regional shop prices. No conversion was applied. The shop pages do not state VAT wording, so `incl_vat: true` is recorded for EU and UK consumer prices, matching the existing EU entries.

## Conflicts and corrections

- **SOL-R 4 HOTAS (UK):** The en_gb page displays "Special Price £199.99 was £249.99" in the header and add-to-cart, while the spec table says "Price £249.99". The record stores the displayed selling price, GBP 199.99. This matches how AB9 EU stores its sale price. If the special ends, the UK price becomes GBP 249.99.
- **T.Flight HOTAS 4 product page:** `thrustmaster.com/products/t-flight-hotas-4/` and the en-gb and en-us variants now redirect to the HOTAS 5 MSFS page. The HOTAS 4 record therefore uses the support page and manual, not a product page.
- **HOTAS 4 action buttons:** Retailer listings say 12. These are not official, so no count is recorded. The manual diagram shows a group of action buttons (callout 9) without a number, so the group is not itemised and coverage stays partial.
- **HOTAS 4 weight and dimensions:** Retailer listings give 2060 g and 242 × 264 × 265 mm. These are not primary and were not used. Values are the same as the HOTAS 5 page, which suggests copied listing data.
- **HOTAS X platform:** The product page lists PC and legacy PS3. The manual says PC only. PS3 is not representable in the schema, so `ps5` and `xbox` stay `unsupported`.
- **HOTAS 5 MSFS:** `shop.thrustmaster.com/en_gb` returned 404 for its slug. The US price shown on the product page ($109.99) was not added because the product URL redirects to a different slug.

## Remaining unknowns (source limits)

- **HOTAS 4 physical values:** No official weight, dimensions, or materials were found. The support page states "Not stated" for all of them.
- **HOTAS 4 action buttons:** The official count is not published in the manual or the support page. Coverage stays partial.
- **HOTAS X per-button layout:** The manual does not diagram each action button, so coverage stays partial.
- **AB9 throw_deg:** The "±20° range" on the support page is ambiguous (per side or total), so it is not recorded.
- **AB9 physical values:** Weight, dimensions and USB detail are not on the support or EU product pages.
- **Other Thrustmaster and MOZA records:** Not researched in this round. Records still missing platform, physical, or price data include the Warthog base and grip, the TCA range, the T16000M, the VIPER items, the TFRP pedals, the MOZA MH16, MHG, MA3X, MTP/MTQ, TQA/TQB, and the MOZA bundles. Only the regional Thrustmaster price gaps listed above were targeted.
- **Thrustmaster US prices:** `en_us` shop slugs are not available for these products. US coverage is unchanged.
