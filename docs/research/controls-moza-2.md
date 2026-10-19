# MOZA physical control research

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.

Rechecked 2026-10-19 against official MOZA pages, support documentation and manuals. Counts refer to installed physical controls; configurable firmware modes are not counted twice.

## MHG Flight Grip — partial

The [MHG manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_mhg_flightsticks_manual.pdf?v=1779866649) diagrams a mini stick, launch button, warning button/light, mode-cycle button, nosewheel lock button, dual-stage trigger, and four management switches labeled target, countermeasure, sensor and navigation. It also calibrates the mini stick on X/Y axes. The [product page](https://uk.mozaracing.com/products/mhg-flightstick) identifies one Hall-effect hat/mini stick configurable as axis or button input, four dedicated buttons, three “5-way” switches, and one 3-way switch. The mini stick and configurable hat are the same physical device, counted once as an analog ministick. The three “5-way” switches have no clear direction/contact definition in the manual or page, so their mapping was removed rather than guessed. Only the explicitly stated 3-way switch remains structured. Marketing's “over 25” is a virtual-input total, not a count of independent physical buttons. The file calls it “Flight Grip”; the manufacturer calls it “MHG Flightstick.”

## MRP Adjustable Damper — complete

The [official product listing](https://eu.mozaracing.com/products/mrp-damper) and [MRP support guide](https://support.mozaracing.com/en/support/solutions/articles/70000684204-mrp-rudder-pedals) describe a passive adjustable mechanical damper accessory that adds resistance to MRP pedals. It has no electrical controls; the empty control list applies to the damper accessory only, not the pedal set.

## MRP Rudder Pedals — partial

The [official support guide](https://support.mozaracing.com/en/support/solutions/articles/70000684204-mrp-rudder-pedals) describes Hall-effect sensing for yaw and differential braking; the [manual](https://image.mozaracing.com/mrp-rudder/user-manuals/MOZA%20MRP%20Rudder%20Pedals%20User%20Manual.pdf) covers setup and connection. The physical inventory represents one yaw pedal input and two toe-brake pedals as separate physical controls. Official sources reviewed do not resolve whether the brake signals are exposed as two separate axes or combined in some configuration. No standalone switches are documented. Axis wiring uncertainty remains; the existing three hardware-axis labels are not changed by this review.

## MTP Flight Throttle — partial

The [official support article](https://support.mozaracing.com/en/support/solutions/articles/70000679591-moza-mtp-throttle-support) specifies a Hall-effect thumb joystick with analog-axis and 4-way button modes, plus a 15-bit magnetic throttle-axis encoder. The joystick is now represented once as an analog ministick; its digital mode is an alternative and not an additional hat. The [manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_mtp_throttle_panel_manual.pdf?v=1779863093) confirms adjustable afterburner, idle and center detents. Official support and product pages both say 27 programmable physical switches but do not itemize standalone buttons, rotaries and toggles, so those counts remain unknown. Joystick center-push is also unspecified.

## MTQ Throttle Quadrant, default TQF setup — partial

The [official MTQ page](https://mozaracing.com/products/mtq-throttle) says TQF fighter grips are included by default and identifies the optional TQA/TQB replacement modules. Its specific control list supports ten multifunction buttons, three rotary knobs, three toggle switches and one landing-gear lever; six RGB-backlit buttons are a subset/description and were not added again. The same page conflicts between 23 physical controls and a specification of 17 physical toggle switches. Thus panel coverage stays partial; switch position/action and rotary electrical modes remain unknown. The [manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_mtq_throttle_panel_manual.pdf?v=1779862954) supports the default TQF four-axis arrangement: two throttle axes, flap and speedbrake; detents are not extra controls.

## TQA Throttle Module — partial

The [official TQA page](https://eu.mozaracing.com/products/tqa-mod) describes Airbus-style detents and reverse-thrust behavior. Its paired throttle grips are represented as two levers based on the module product layout, but the official text does not itemize grip-level switches, buttons or reverse-thrust signal behavior. TQA replaces TQF grips; it is not installed concurrently with them.

## TQB Throttle Module — partial

The [official TQB page](https://eu.mozaracing.com/products/tqb-mod) explicitly identifies an extended-travel Boeing module, lift-to-arm reverse-thrust lever and TO/GA button; the [MTQ page](https://mozaracing.com/products/mtq-throttle) also lists the TO/GA feature. Two throttle grips, the named lift-to-arm reverse-thrust lever and the TO/GA button are represented. The lever’s exact electrical mapping and any other module controls are not itemized. It replaces the default TQF grips.

## Z-Axis Twist Module — partial

The [official product page](https://mozaracing.com/products/z-axis-module) states a ±20° yaw range and 16-bit Hall sensor. The [manual](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_z_axis_manual.pdf?v=1779863078) describes the mechanical twist module. One analog twist input is represented using the closest available generic analog lever type; no discrete controls are documented. The control schema has no axis-only item, so this representation is imperfect. Hardware resolution is corrected from 15 to 16 bits based on the product page.

## Remaining limits

The schema's hat `ways` field defaults to 4, so an unknown hat direction count cannot be represented faithfully; omit it from structured counts and describe it in evidence notes. Other unresolved facts are MHG “5-way” switch behavior, MRP brake output encoding, MTP/MTQ unitemized marketing totals, TQA details, and TQB reverse-thrust signal behavior. No optional boolean was set false without explicit evidence.
