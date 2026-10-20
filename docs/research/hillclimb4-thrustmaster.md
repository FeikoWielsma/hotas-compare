# Thrustmaster hillclimb4 — physical counts from numbered official diagrams

Checked 2026-10-20. Manuals and sheets came from the Thrustmaster support PDFs already downloaded in `work/hillclimb3-tm/`. Pages were rendered at 220 dpi with PyMuPDF into `work/hc4-tm/`, cropped and upscaled, then read visually. A value is written only when a numbered official diagram, feature list or mapping states it for that exact SKU. Marketing "action buttons" totals are used only when the numbered mapping matches them. Virtual buttons and interchangeable spare modules are excluded.

## Changed records

| Record | Change | Source (page) |
| --- | --- | --- |
| `tca-sidestick-airbus.yaml` | Added hat (1), handle-side buttons (2), base module buttons (12), handedness switch (1). Replaced nothing else. Notes give the map count. | Sidestick Airbus manual p.2 (PC map 1-17) and p.4 (features 1-9) |
| `tca-quadrant-boeing.yaml` | Replaced "17 action buttons" with 6 lever buttons, 3 base push buttons, 2 two-position switches. Encoder now has push. | Quadrant Boeing manual p.5-6 (PC map, 17 buttons and 3 axes) and p.2 (feature 4) |
| `tca-yoke-boeing.yaml` | Added 18 buttons (Xbox map names counted one by one). Notes now say the count is verified. | Yoke Boeing manual p.7 (Xbox map, 18 buttons and 6 axes) and p.2 (feature 3) |
| `viper-tqs-throttle.yaml` | Added 7 buttons (7, 8, 13-17). Analog rotaries changed from 2 to 3 (6, 9-10, 11). | Viper TQS manual p.8 (Mode A map, 19 buttons and 5 axes) |
| `viper-bap-panel.yaml` | Added round push (1). Replaced the two named selectors with three detent knobs: 5, 4 and 3 positions. Four square buttons kept. | Viper Panel manual p.8 (Mode A map, 32 buttons and 1 axis) |

## Counts substantiated this pass (summary)

- **TCA Sidestick Airbus:** 1 digital trigger, 1 hat, 14 buttons (3-16), 1 two-position handedness switch, 1 analog throttle, axes X, Y, RZ. The feature list says 15 action buttons; the numbered map gives 14, so the map is used and the discrepancy is recorded.
- **TCA Quadrant Boeing:** 9 buttons, 2 two-position switches, 1 push encoder, 3 analog levers. Mode labels 12-14 are not counted as physical controls.
- **TCA Yoke Boeing:** 18 buttons (Xbox map), 8-way hat, pushable mini-stick, 2 pitch/roll axes. PC map not checked.
- **Viper TQS:** 4-way hat with push, 7 buttons (7, 8, 13-17), 2 detent stops, 1 cut-off trigger, 3 analog rotaries, XY slew. The map shows 19 numbered inputs without virtual ones; 18-19 are stop switches covered by the existing detent and trigger records.
- **Viper Panel:** 1 round push, 4 square pushbuttons, 3 detent knobs (5, 4, 3 positions), trim wheel axis. The map lists 32 numbered inputs; the rest are not classified.

## Still unresolved (leave unset)

- **T.Flight HOTAS 4 and HOTAS X** — the feature diagrams group "action buttons" (callouts 9 and 11) with several leader lines that end on the same bodies from two angles. Diagram endpoints are 8 (HOTAS 4) and about 7 (HOTAS X); this cannot be turned into a body count. The HOTAS X PC automatic-preset diagram (p.5 of `tfhx.pdf`) numbers 1-12, with 12 as the HOME button. It is a PC mapping that numbers the handle and base controls, so it is the next source to check; it was not used for a count here because 1-10 are not labelled by type.
- **T.Flight HOTAS One (original, XBOX/PC)** — callout 9 action buttons, endpoints about 8, same ambiguity as above. Not changed.
- **T.Flight HOTAS One MSFS Edition** — no edition-specific numbered diagram. The product page's 14 buttons is marketing. Not changed.
- **T.Flight Hotas NEO Ace Combat 8 (PS and Xbox/PC)** — callouts 3 (handle top), 11 (grip rear) and 16 (throttle) are unnumbered. The handle top shows two pads under callout 3; callout 11 shows two more pads on the rear of the grip, and it is not clear whether they are the same bodies. Throttle callout 16 covers 3 slots on the top front edge, 1 side oval and 2 base ovals, plus a MODE button (callout 18). Not changed; leave unset.
- **TCA Sky Yoke (PS/PC and Xbox/PC)** — no manual was downloaded and no numbered diagram was found. The 24 action buttons is a marketing aggregate. Not changed.
- **F/A-18C Hornet HOTAS Add-On Grip** — no Thrustmaster grip manual was found. The PDFs in `work/` labelled as F/A-18 are WINCTRL CarrierAce and carrier-grip documents, not this product. Not changed.
- **Airbus Add-On Grip** — the instruction sheet is assembly-only (no control callouts). The existing 5 buttons, dual-mode trigger and ministick stay as they were.
- **TCA Quadrant Add-On Airbus** — the probed page 6 is installation text; the mapping page was not found in this pass. Existing 10 action buttons remain.
- **Warthog MKII base, OMNI extension, Warthog dual throttle** — not re-verified this pass. The MKII manual's numbered features (1-30+) describe the grip and throttle; no extra base controls were identified. OMNI is a mechanical extension with no electronic controls per its product note.

## Ambiguous groups

- Viper TQS input 17 (top-mounted round) is counted as a button. It is the least certain count in the batch.
- Viper Panel numbered inputs 2-3, 17 and 21-32 are not typed as push, switch or rotary.
- Quadrant Boeing mode labels 12-14 may be a selector or a set of press targets; not classified.
- Sidestick Airbus: map 14 buttons versus feature list 15 action buttons.
- Yoke Boeing: count is from the Xbox map; PC map not checked.

## Sources

- `work/hillclimb3-tm/tca-sidestick.pdf` (Sidestick Airbus manual, PC map p.2, features p.4)
- `work/hillclimb3-tm/tca-q-boeing.pdf` (Quadrant Boeing manual, features p.2, PC map p.5-6)
- `work/hillclimb3-tm/tca-yoke-boeing.pdf` (Yoke Boeing manual, features p.2-3, Xbox map p.7)
- `work/hillclimb3-tm/viper-tqs.pdf` (Viper TQS manual, Mode A map p.8)
- `work/hillclimb3-tm/viper-panel.pdf` (Viper Panel manual, Mode A map p.8)
- `work/hillclimb3-tm/tfh4.pdf`, `tfhx.pdf`, `tfhone.pdf` (feature diagrams; HOTAS X preset diagram p.5)
- `work/hillclimb3-tm/neo-ps.pdf` (NEO PS manual, features p.7-9)
- `work/hillclimb3-tm/airbus-grip.pdf` (Airbus Add-On Grip sheet, assembly only)
