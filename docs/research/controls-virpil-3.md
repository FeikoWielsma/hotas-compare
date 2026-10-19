# VIRPIL physical controls research (batch 3)

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.



Checked 2026-10-19 against official VIRPIL EU product listings. Counts are installed physical controls; alternative modules and logical/virtual bindings are excluded.



- **ACE Interceptor Pedals (VPC-302-001): complete.** Three pedal axes: rudder yaw and two toe-brake axes. The toe brakes are axes, not buttons. No standalone switches are shown or listed. [Product listing](https://virpil-controls.eu/vpc-ace-interceptor-pedals.html)

- **ACE-TORQ Pedals (VPC-304-001): complete.** The product is explicitly a single-axis pedal set; no separate toe-brake pedals or standalone switches are shown/listed. [Product listing](https://virpil-controls.eu/vpc-ace-torq-rudder-pedals.html)

- **Universal Control Panel #1 (VPC-401): complete.** Twelve RGB momentary buttons, six momentary ON-OFF-ON toggles, two latched ON-ON toggles, two flip-cover toggles, three pushable encoder dials, two axis dials. Electrical behavior and position counts of the flip-cover toggles are unspecified; axis dials have no stated positions. [Product listing](https://virpil-controls.eu/vpc-control-panel-1.html)

- **Universal Control Panel #2 (VPC-402): complete.** Ten RGB buttons, six momentary ON-OFF-ON toggles, two latched ON-ON toggles, two flip-cover toggles, three pushable encoder dials, and multi-position landing-gear lever with lift/spring return and contactless sensor. Flip-cover switch behavior is unspecified. Schema cannot record spring return or lever positions. [Product listing](https://virpil-controls.eu/vpc-control-panel-2.html), [official detailed input list](https://virpil-controls.eu/vpc-control-panel-2-b-stock.html)

- **FLNKR Grip (VPC-015-P): complete for the preinstalled layout.** Three triggers (primary single-stage, dual-stage weapon flip, front flip), eight momentary buttons, two 2-way push hats, one 4-way push hat, one pushable analog ministick, and analog brake lever. The alternate button/hat layout replaces modules; it is not additive. Two virtual buttons in the mapping are not physical switches. [Product listing](https://virpil-controls.eu/vpc-flnkr-grip.html)

- **Hawk-60 Collective Grip (VPC-012-001): complete.** One single-stage trigger, four installed 8-way push hats (configurable as 4-way), one 2-way push hat, one ON-OFF-ON toggle, and one RGB pushbutton. The manufacturer does not specify whether the toggle is maintained or momentary. [Product listing](https://virpil-controls.eu/vpc-hawk-60-collective-grip.html)

- **Rotor TCS Plus Base Upgraded (VPC-112-001): complete for the Plus variant.** One collective axis, one twist-throttle axis, one engine-idle button, and one side switch restricting twist travel. Switch action is functionally described, but its electrical momentary/maintained behavior is not. [Product listing](https://virpil-controls.eu/vpc-rotor-tcs-plus-base-upgraded.html)

- **VMAX Prime Throttle (VPC-203): complete for explicit installed electrical-input inventory.** Two throttle axes, auxiliary axis, two 4-way push hats, one 2-way push hat, pushable analog stick, pushable contactless dial axis, pushable digital axis dial, two pushable encoders, five momentary ON-OFF-ON toggles, one mode switch dial, and twelve momentary buttons. Manufacturer's 49 button-input total includes mode/shift expansion, not 49 physical pushbuttons. The manual confirms one Aerobatics detent plate set preinstalled and three alternate sets; these are mechanical configuration plates, not four installed detents. The flat input table does not establish locations on handle versus panel, so locations remain unknown. “Digital axis dial” rotation behavior is undefined and mode remains unknown. Swappable alternate button/hat modules are excluded. [Product listing](https://virpil-controls.eu/vpc-vmax-prime-throttle.html), [user manual](https://support.virpil.com/en/support/solutions/articles/47001263544-vmax-prime-throttle-user-manual)

- **WarBRD-D Base (VPC-106-001): complete bare-base inventory.** Base provides X/Y axes and accepts separately purchased grips; no installed grip buttons or switches. [Product listing](https://virpil-controls.eu/vpc-warbrd-d-base.html)



## Schema notes



The schema can store rotary selector positions and pressability, and can represent lever pressability. It cannot express a lever's spring-return behavior/positions or independently count dual push switches on an encoder without claiming sequential push stages. Pedal axes are kept under `hardware.axes`; toe-brake axes are not represented as buttons. No unsupported detent counts are asserted.

