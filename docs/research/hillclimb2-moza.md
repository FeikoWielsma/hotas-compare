# MOZA hillclimb2 — coverage and unknowns

Checked 2026-10-20. Scope: `src/content/components/moza/*.yaml`. Sources: MOZA US store (`us.mozaracing.com`) collection and product pages, plus `mozaracing.com/collections/flight-accessories` for the accessory list. Racing products (wheelbases, pedals for sim racing, shifters) are out of this catalog's scope and were not checked. Prices are USD from the US store. Rule as in round 4: a value is written only from an exact product page; unlabeled dimensions are not assigned to W/D/H; `Supported Platform: PC` alone leaves Xbox and PS5 `unknown`.

## Added this round

| Record | Basis | Notes |
| --- | --- | --- |
| `mtlp-panel.yaml` | [US page](https://us.mozaracing.com/products/mtlp-panel) | PC only. 25 switch signals (type not stated), 2 triggers, parking brake and tailhook levers with Hall sensors, 680 g. Dimensions 196.5 × 134.7 × 149 mm are unlabeled and not stored. USD 149. |
| `mfy-yoke-handle.yaml` | [US page](https://us.mozaracing.com/products/mfy-yoke) | Standalone MFY Yoke Handle, separate from `mfy-yoke-pro` (USD 299). Two 8-way switches, two Hall ministicks, two LB/RB buttons, two triggers, 1.3 kg. USD 129. Standalone-USB and USB type not stated. Platforms: not stated. |
| `ma3f-efcm.yaml` | [US page](https://us.mozaracing.com/products/ma3f-efcm) | Main Module only. Push-pull rotaries and segment displays are present but counts are not stated, so controls are unset. 542 g. USD 149. The EFIS L/R modules are separate SKUs (USD 99 each) and are not in this record. |
| `ma3f-fcd.yaml` | [US page](https://us.mozaracing.com/products/ma3f-fcd) | 5.1-inch display, key count not stated. 588 g. USB Type-C 2.0. USD 249. |
| `mb7f-fcd.yaml` | [US page](https://us.mozaracing.com/products/mb7f-fcd) | 737-style CDU panel, key count not stated. 646 g. USD 249. Customer reviews on add-on compatibility conflict and were not used. |
| `mgx1000.yaml` | [US page](https://us.mozaracing.com/products/mgx1000) | G1000-style panel. 7-way ALPS joystick and rotary encoders present, counts and joystick type not stated, so controls are unset. 1170 g. USD 449. |

## Coverage

Present and unchanged this round: AB6, AB9, AY210, AY90, MA3X, MFY Pro Yoke, MH16, MHG, MRP damper, MRP pedals, MTP, MTQ, TQA, TQB, Z-axis. Bundles: AB9+MH16 and AY210 bundles.

Not added:

- **AMPCD Display Panel** (USD 199, `us.mozaracing.com/products/ampcd`): the page gives name, price and warranty only. No platforms, controls, dimensions or weight.
- **FMP18 Panel Bundle** (USD 849, `us.mozaracing.com/products/fmp18`): a bundle of FPP front panel, two DDI displays and an AMPCD. It needs component records that do not exist. Stated totals (95 tactile buttons, 16 rotaries, 7 toggles) belong to the bundle and are not assigned to any component. Recommend adding FPP and DDI records first, then a bundle.
- **EFCM L and R** (USD 99 each): separate SKUs. Recorded in notes on `ma3f-efcm`. Add as records if you want SKU-level coverage.
- **E-Stop Switch** (USD 35, sale; `us.mozaracing.com/products/estop-switch`): "three modes" is not described. No dimensions, controls or connectivity. Not added.
- **Passive accessories**: MOZA Adjustable Desktop Clamp, Table Clamp For Yoke, Flight Base Table Clamp, Flight Base Mount Adapter. Excluded as passive, same rule as earlier rounds (the MRP damper is kept only because it is an existing record).
- **MB7F/MA3F/MGX1000 regional prices** (UK/EU): not searched this round. US only.

## Remaining unknowns and why

- **Control counts** on the partial records (AB6, AB9, AY90, MA3X, MFY Pro, MH16, MHG, MRP pedals, MTP, MTQ, TQA, TQB, Z-axis) carry over from round 4. The MOZA support articles give functional descriptions but usually no counts.
- **Platforms (Xbox and PS5)**: all MOZA flight records list "Supported Platform: PC" or equivalent only. Left `unknown` by the same rule as round 4.
- **Images**: no images added for the six new records. The MOZA public image folder has no files for them yet.
- **MFY weight conflict** (1.2 kg on the Pro page vs 1.3 kg in the Pro support article): unchanged. Note the standalone MFY Yoke Handle page gives 1.3 kg, which may be the source of the Pro support figure. Not resolved.
- **MA3F family**: the L/R EFIS modules and FCD/EFCM physical control counts need MOZA's own manuals or a physical inspection. Not available on the product pages.
