# VIRPIL controls correction review (batches 2 and 3)

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.



Checked 2026-10-19. I reread the assigned YAML, both earlier research notes, the component/control schemas, and official VIRPIL product listings and support pages. Counts refer to installed physical controls, not firmware-expanded bindings. Complete means the manufacturer's exact variant inventory or directly visible bare-device layout was checked; properties absent from source remain unknown.



## Batch 2



- **CDT-VMAX Throttle (VPC-202-001) — complete.** Four momentary buttons; three 4-way push hats; one pushable analog ministick; two pushable analog axis dials; two throttle axes; one auxiliary axis. Manufacturer page’s input table covers these; no physical location split is provided, so location is unset. The page describes preinstalled idle and afterburner detents and an alternate CosmoSim central detent; YAML counts the two installed detent points and excludes the alternative. [Official listing](https://virpil-controls.eu/vpc-cdt-vmax-throttle.html)

- **Constellation ALPHA Left/Right (VPC-009-L/R) — complete.** The reachable right-hand listing explicitly supports dedicated left/right variants and gives matching inventory: dual-stage main trigger; flip trigger with tactile trigger and raised-position button; three 4-way push hats; one 2-way push hat; pushable analog stick; three momentary buttons; brake lever plus momentary button; scroll encoder with dual push. The two scroll pushes are not specified as sequential. YAML records `push: true` without `push_stages`. The legacy L URL now returns 404, so its controls cite the active R listing, which documents the same L/R layout. [Official ALPHA listing](https://virpil-controls.eu/vpc-constellation-alpha-r.html)

- **Constellation ALPHA Prime Left/Right (VPC-009-01-L/R) — complete.** Each live variant listing confirms the same inventory as ALPHA, including the manufacturer’s “dual push” scroll encoder; the source does not clarify whether these are separate switches or sequential stages. [Prime L](https://virpil-controls.eu/vpc-constellation-alpha-prime-l.html), [Prime R](https://virpil-controls.eu/vpc-constellation-alpha-prime-r.html)

- **MongoosT-50CM3 Base — complete bare-base inventory.** The exact base page covers the two-axis base mechanism and treats grips as separate compatible products; no grip controls are installed with this base. [Official listing](https://virpil-controls.eu/vpc-mongoost-50cm3-base.html)

- **MongoosT-50CM3 Throttle (VPC-201-003) — complete for this generation.** Evidence is VIRPIL's VPC-201-003-B B-stock page, which describes the same CM3 model/generation: six RGB momentary panel buttons, four handle buttons; three momentary ON-OFF-ON and four latched ON-ON toggles; a 5-position mode dial; two pushable panel encoders; handle hats (one 8-way, three 4-way, one 2-way), pushable ministick, one non-push encoder and one pushable encoder; slider axis; two throttle axes; auxiliary axis. Its B-stock SKU suffix is not the original model's SKU. [Official CM3 B-stock listing](https://virpil-controls.eu/vpc-mongoost-50cm3-throttle-b-stock.html)

- **MongoosT-50CM4 Throttle (VPC-204) — complete against its explicit inventory.** Six RGB buttons and one additional momentary button, two momentary ON-OFF-ON toggles, two pushable panel encoders, two throttle axes, auxiliary axis; handle has three 4-way push hats, two center-push rotary dials (rotation mode unknown), four momentary buttons, and one pushable analog ministick. The page's generic CM3-era 5-way mode-dial prose is omitted because the CM4 input list does not include it. [Official listing](https://virpil-controls.eu/mongoost-50cm4-throttle.html)



## Batch 3



- **ACE Interceptor Pedals (VPC-302-001) — complete.** Three axes: rudder yaw and two toe brakes; brake axes are not buttons. No separate switches are shown/listed. [Official listing](https://virpil-controls.eu/vpc-ace-interceptor-pedals.html)

- **ACE-TORQ Pedals (VPC-304-001) — complete.** One rudder axis, with no toe-brake axes or separate switches shown/listed. [Official listing](https://virpil-controls.eu/vpc-ace-torq-rudder-pedals.html)

- **Universal Control Panel #1 (VPC-401) — complete.** Twelve RGB momentary buttons; six momentary ON-OFF-ON toggles; two latched ON-ON toggles; two flip-cover toggles; three pushable encoders; two axis dials. Flip-cover electrical behavior and axis-dial positions are unspecified. [Official listing](https://virpil-controls.eu/vpc-control-panel-1.html)

- **Universal Control Panel #2 (VPC-402) — complete.** Ten RGB momentary buttons; same ten-toggle split; three pushable encoders; one multi-position landing-gear lever, with lift/spring-return and contactless position sensor. The source doesn't state flip-cover electrical behavior or exact lever positions. [Official listing](https://virpil-controls.eu/vpc-control-panel-2.html), [detailed input list](https://virpil-controls.eu/vpc-control-panel-2-b-stock.html)

- **FLNKR Grip (VPC-015-P) — complete for preinstalled layout.** Primary single-stage trigger, dual-stage weapon flip trigger, front flip trigger; eight momentary buttons; two 2-way push hats; one 4-way push hat; pushable analog ministick; analog brake lever. Alternative modules replace installed button/hat layout. Two mapping virtual buttons are not physical controls. [Official listing](https://virpil-controls.eu/vpc-flnkr-grip.html)

- **Hawk-60 Collective Grip (VPC-012-001) — complete.** One single-stage trigger; four 8-way hats with push, configurable to 4-way; one 2-way push hat; one ON-OFF-ON toggle; one RGB button. Toggle latching/momentary behavior is unknown and omitted. [Official listing](https://virpil-controls.eu/vpc-hawk-60-collective-grip.html)

- **Rotor TCS Plus Base Upgraded (VPC-112-001) — complete for Plus upgraded variant.** Collective axis, twist-throttle axis, engine-idle button, and side switch restricting twist rotation. The switch action is described but electrical latching/momentary behavior is not. [Official listing](https://virpil-controls.eu/vpc-rotor-tcs-plus-base-upgraded.html)

- **VMAX Prime Throttle (VPC-203) — complete for listed installed inputs.** Two throttle axes; auxiliary axis; two 4-way push hats; one 2-way push hat; pushable analog stick; pushable contactless dial axis; pushable digital axis dial; two pushable encoders; five momentary ON-OFF-ON toggles; mode switch dial; twelve momentary buttons. Locations remain unknown because the official list is flattened and does not map groups to handle or panel. The dial called “digital axis dial” is not defined as analog or a fixed-position selector, so mode is unknown. VIRPIL says 49 button inputs, including mode/shift expansion; this is not 49 standalone buttons. Manual confirms one Aerobatics detent plate set preinstalled and three alternate styles supplied; YAML records only the one installed set, not four detents. [Official listing](https://virpil-controls.eu/vpc-vmax-prime-throttle.html), [official manual](https://support.virpil.com/en/support/solutions/articles/47001263544-vmax-prime-throttle-user-manual)

- **WarBRD-D Base (VPC-106-001) — complete bare-base inventory.** X/Y base axes; compatible grips are separate. No standalone grip buttons or switches are installed on the bare base. [Official listing](https://virpil-controls.eu/vpc-warbrd-d-base.html)



## Schema limits and remaining unknowns



The existing schema supports rotary `positions` and `push`, lever `push`, trigger flip/bidirectional actions, hats, axes, and customizable detent records. Previous notes incorrectly said rotary position counts or rotary-axis-plus-push could not be represented. It does not distinguish two independent encoder push switches from sequential push stages; YAML therefore keeps `push: true` and documents the manufacturer's dual-push wording without inventing sequential stages. It cannot encode spring-return behavior or positions on the Control Panel #2 landing-gear lever. Pedal axes remain in `hardware.axes`; the control schema has no dedicated pedal-axis type. Unresolved product facts are the VMAX Prime handle/panel locations and digital-axis-dial rotation behavior, CM4 rotary mode, panel flip-cover toggle behavior, Hawk-60 toggle action, and several unspecified selector positions.

