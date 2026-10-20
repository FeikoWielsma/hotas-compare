# Thrustmaster hillclimb3 — physical controls and missing SKUs

Checked 2026-10-20. Manuals were downloaded with a browser user agent and read with PyMuPDF. Diagram pages were rendered to PNG under `work/hillclimb3-tm/` and counted visually. A value is written only when the exact product's official manual or product page states it. Marketing "action buttons" totals are not physical counts. Virtual buttons and spare interchangeable modules are not counted as installed controls.

## New component records

| Record | Physical inventory | Coverage | Source |
| --- | --- | --- | --- |
| `tca-sidestick-x-airbus.yaml` | 1 trigger (mapping button 1), 1 hat, 20 buttons (2–16 and 18–22), 1 analog throttle lever, 1 twist axis, 2 two-position selectors (handedness, Xbox/PC). Four axes: X, Y, ZR, Slider 0. | complete | [Sidestick X manual](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_sidestick_X/TCA_Sidestick_X_AE_User_manual.pdf) PC map. Button 17 is the virtual throttle detent and is excluded. Spare head modules are excluded. Hat direction count is not stated. |
| `tca-quadrant-add-on-airbus.yaml` | Speed-brake lever with 4 detents and 6 action buttons; flaps lever with 4 detents and 4 action buttons. Axes ZR and Z. | partial | [Add-on manual](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_Quadrant/TCA_Quadrant_Add-On_Airbus_Edition_user_manual.pdf). Mapping title is "15 buttons and 2 axes"; five of those buttons are the speed-brake virtual detents and are excluded. The flaps legend calls the remaining controls action buttons without saying which are push buttons, switches, or wheels. |
| `f-16c-viper-hotas-add-on-grip.yaml` | 2-step trigger, one 8-way hat, two 4-way hats, one 4-way hat with push, 4 push buttons (2 plus 2 pinkie). | complete | [F-16C grip manual](https://ts.thrustmaster.com/download/accessories/Manuals/F16C/F-16C_Viper_Hotas_Add-On_Grip_user_manual.pdf) page 2/8. This list is not the A-10 Warthog grip. |
| `f-a-18c-hornet-hotas-add-on-grip.yaml` | 2-step trigger only. | partial | [Product page](https://www.thrustmaster.com/en-us/products/f-a-18c-hornet-hotas-add-on-grip/). "19 action buttons including a 2-step trigger" has no hat or button breakdown, and no grip manual was found. |
| `t-flight-hotas-one-msfs-edition.yaml` | 1 trigger, 1 hat, analog throttle, analog rudder tilt. Axis count 5 from the page. | partial | [Product page](https://www.thrustmaster.com/en-us/products/t-flight-hotas-one-microsoft-flight-simulator-edition/). Distinct from HOTAS 5 MSFS (that one is PC+PS5) and from the original HOTAS One. No edition-specific numbered diagram, so the page's "14 buttons" is not stored. |

## New bundles

| Record | Components | Platforms | US price |
| --- | --- | --- | --- |
| `tca-officer-pack-airbus.yaml` | Sidestick Airbus + Quadrant Airbus | PC | $199.99 |
| `tca-captain-pack-x-airbus.yaml` | Sidestick X + Quadrant Airbus + Quadrant Add-On (one SKU, both modules) | PC and Xbox | $329.99 |
| `t16000m-fcs-flight-pack.yaml` | T.16000M FCS + TWCS + TFRP | PC | $269.99 |
| `viper-tqs-mission-pack.yaml` | Viper TQS + Viper Panel | PC | not stored |

Official pages: [Officer Pack](https://www.thrustmaster.com/en-us/products/tca-officer-pack-airbus-edition/), [Captain Pack X](https://www.thrustmaster.com/en-us/products/tca-captain-pack-x-airbus-edition/), [Flight Pack](https://www.thrustmaster.com/en-us/products/t-16000m-fcs-flight-pack/), [Viper TQS Mission Pack](https://www.thrustmaster.com/en-us/products/viper-tqs-mission-pack/).

## Counts filled on existing records

- **T.Flight Stick X** — coverage complete. Manual features and the PC preset diagram number buttons 1–12, then separate PRESET and MAPPING buttons, a D-pad hat, Slider 0, X/Y/RZ, and a PC/PS3 USB selector. The fire trigger is one of the twelve; the manual does not say which number, so it is not a second trigger. "3 axes plus integrated throttle" is the same four axes the diagram draws. Hat ways unset. [Manual](https://ts.thrustmaster.com/download/accessories/pc/joysticks/manuals/tflightstickx/tfsx_user_manual.pdf).
- **T.Flight Hotas 5 MSFS Edition** — coverage complete from the Hotas 5 manual that its support page links. PC map numbers 1–16: button 1 is the trigger, 2–4 the head, 5–10 the throttle, 11–16 the base, plus a hat, throttle Z, twist RZ, and rudder rocker Slider 0. The optional TFRP axes on the same page are excluded. The product page's "14 buttons" does not match the numbered diagram. Hat ways unset. [Manual](https://ts.thrustmaster.com/download/accessories/Manuals/TFH5/T.Flight_Hotas_5_user_manual.pdf).

## SKUs checked and not added

- **TCA Quadrant X** — no separate product. Captain Pack X uses the standard TCA Quadrant Airbus Edition plus the Add-On.
- **TCA Yoke Pack Boeing** — already `tca-yoke-pack-boeing.yaml`.
- **Existing `tca-captain-pack-airbus.yaml`** — left unchanged. Its live product URL returns 404, and the record's image source is the Officer Pack page while its components are only sidestick plus quadrant. Officer Pack is the confirmed stick-plus-quadrant bundle. A historical Captain Pack that also included TFRP was not confirmed, so the old record was not renamed or deleted.
- **Viper Panel as a second record** — `viper-bap-panel.yaml` is the panel in the Mission Pack. No second panel record.

## Still partial, and why

- **TCA Sidestick Airbus** — manual lists a trigger, POV hat, left/right button modules, twist, and a throttle with virtual button 17. "15 action buttons" is an aggregate. The rendered diagram page did not number each body, so the hat and handedness selector stay unrecorded and coverage stays partial. [Manual](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_Sidestick/TCA_Sidestick_AE_User_Manual.pdf).
- **Airbus add-on grip** — the instruction sheet is a two-page diagram. Existing record keeps 5 buttons, a dual-mode trigger, a ministick, and axis count 4. [Sheet](https://ts.thrustmaster.com/download/accessories/manuals/Airbus_grip/AIRBUS_GRIP_Instruction_Manual.pdf).
- **T.Flight HOTAS 4, HOTAS X, HOTAS One** — feature diagrams group "action buttons" with several leader lines and do not number each body. Game-mapping posters label functions and leave some unassigned, so they do not establish a physical count. HOTAS One's manual draws a hat that the YAML still does not list. Hat ways are "multidirectional" without a number.
- **T.Flight Hotas NEO Ace Combat 8 (PS and Xbox/PC)** — feature pages name a hat, ministick, twist, throttle, rocker, and console buttons (labels differ by edition). The action-button callouts are unnumbered. Coverage stays partial. [PS manual](https://ts.thrustmaster.com/download/accessories/Manuals/TFHNEO/T-Flight_Hotas_NEO_PS_user_manual.pdf), [Xbox manual](https://ts.thrustmaster.com/download/accessories/Manuals/TFHNEO/T-Flight_Hotas_NEO_XBOX_user_manual.pdf).
- **TCA Sky Yoke, both editions** — support pages publish a warranty PDF only. The "24 action buttons" line is not stored.
- **TCA Boeing quadrant and yoke** — manuals give 17 and 18 action-button aggregates. Interchangeable lever types are not four simultaneous levers. Diagrams were not decomposed into push, switch, and rotary. Encoder push on the quadrant stays unknown. Yoke weight conflicts between page and manual, so weight stays unset.
- **Viper TQS and Viper Panel** — mode A maps exist (19 buttons and 5 axes; 32 buttons and 1 axis) with extra virtual buttons in other modes. Push versus switch was not classified, so the marketing 43 and 21 are not stored.
- **Warthog dual throttle** — detailed partial inventory from the classic manual. Remaining gaps are optional push, momentary, and position fields. The friction wheel is mechanical.
- **Warthog MKII base** — the system manual's technical features describe the grip, not extra base buttons. The record stays at the two stick axes. [Manual](https://ts.thrustmaster.com/download/accessories/Manuals/HOTAS_Warthog_MKII/Hotas_Warthog_MKII_user_manual.pdf).
- **OMNI extension** — support has a warranty PDF only. Existing note says the extension adds no electronic controls. Coverage stays partial because that is a product note, not a control diagram.

## Published figures stored with a caveat

- Sidestick X dimensions are the product page's own 195 × 195 × 225 mm and 787 g. The Captain Pack X page swaps height and depth for the same three numbers.
- Quadrant Add-On page says width 50 mm, depth 235 mm, height 130 mm, weight 530 g. The width matches one module while the SKU is two modules; it is stored as labeled.
- Flight Pack page weight of 1100 g is lighter than the T.16000M alone and is not stored. Bundles have no physical fields.
- Viper Mission Pack page shows $249.99 on the grip accessory, not an isolated pack price. No pack price is stored.
