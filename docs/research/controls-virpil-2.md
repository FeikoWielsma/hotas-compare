# VIRPIL control inventory research (batch 2)

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.



Checked 2026-10-19 against official VIRPIL EU product listings and support documentation. Counts describe physical installed inputs; logical binding totals and optional modules are excluded.



- **CDT-VMAX Throttle (VPC-202-001): complete.** Official list: four momentary pushbuttons, three 4-way push hats, one pushable analog ministick, two pushable axis dials, two throttle axes, and one auxiliary axis. The source calls the dials “axis dials,” supporting analog axes; it does not list mechanical detents as electrical controls. [Product listing](https://virpil-controls.eu/vpc-cdt-vmax-throttle.html)

- **Constellation ALPHA L/R (VPC-009-01-L/R): complete.** The live R listing explicitly says there are dedicated left/right variants and enumerates one dual-stage trigger, flip trigger with tactile and raised-position inputs, three 4-way push hats, one 2-way push hat, analog push ministick, three momentary buttons, brake lever plus separate momentary button, and scroll encoder with dual push. Locations are all on the grip. The flip and brake buttons are represented on their controls rather than repeated in button totals. The dual push on the scroll encoder is not documented as sequential stages; the schema records `push: true` but cannot count its two separate push switches. [Official ALPHA listing](https://virpil-controls.eu/vpc-constellation-alpha-r.html)

- **Constellation ALPHA Prime L/R (VPC-009-01-L/R): complete.** Both live variant pages provide the same inventory as the original ALPHA. The scroll encoder has two push inputs, not stated sequential stages; YAML does not use `push_stages`. [Prime L](https://virpil-controls.eu/vpc-constellation-alpha-prime-l.html), [Prime R](https://virpil-controls.eu/vpc-constellation-alpha-prime-r.html)

- **MongoosT-50CM3 Base: complete bare-base inventory.** The base listing describes a gimbal with X/Y axes and separately sold grips, with no installed grip controls. [Product listing](https://virpil-controls.eu/vpc-mongoost-50cm3-base.html)

- **MongoosT-50CM3 Throttle (VPC-201-003): complete for this generation.** The detailed official B-stock page identifies VPC-201-003-B and describes the same CM3 throttle generation. It separates the base panel and handle inventory: six RGB momentary buttons, four handle buttons, three momentary ON-OFF-ON and four latched ON-ON toggles, five-position mode dial, two pushable panel encoders, handle hats (one 8-way, three 4-way, one 2-way), pushable ministick, one encoder without push and one with push, one slider axis, two throttle axes, and one auxiliary axis. The B-stock suffix is the only SKU difference in the evidence. Detent plates are selectable mechanical configurations, not electrical controls. [Official CM3 B-stock listing](https://virpil-controls.eu/vpc-mongoost-50cm3-throttle-b-stock.html)

- **MongoosT-50CM4 Throttle (VPC-204): complete for the explicit installed input list.** The page separates the panel and grip: six RGB panel buttons, one additional panel button, two momentary ON-OFF-ON toggles, two pushable panel encoders, two throttle axes, auxiliary axis; grip has three 4-way push hats, two rotary dials with center push, four momentary buttons, and pushable analog ministick. The reused CM3 “5-way mode dial” prose is not in the CM4 input list and is excluded. The rotary mode of the handle dials is unspecified and omitted in YAML. [Product listing](https://virpil-controls.eu/mongoost-50cm4-throttle.html)



## Schema notes



The schema supports rotary selector position counts, rotary `push`, and lever `push`; earlier notes incorrectly claimed it could not. It cannot represent the ALPHA encoder's two independent push switches without implying sequential stages, nor spring-return behavior or position count on a lever. Mechanical detent plates have no per-axis/style representation, so no alternative plate sets are counted as installed electrical controls.

