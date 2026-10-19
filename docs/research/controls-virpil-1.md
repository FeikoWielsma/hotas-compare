# VIRPIL controls inventory research

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.

Checked 2026-10-19 against VIRPIL EU product pages and support-center materials. Counts below are physical controls; RGB lighting and firmware binding capacity are excluded.

## Archer-SF Cyclic Grip — complete

The product page specifies one dual-stage trigger, one safety-guarded button input, three momentary push buttons, and five gated four-way hats with center push. The guard is not a second button. RGB button-label lighting is not an input. [Official product page](https://virpil-controls.eu/archer-sf-cyclic-grip.html). Exact model is SKU VPC-024, a grip without a base.

## CDT-AERO-L Grip (VPC-017-L) and CDT-AERO-R Grip (VPC-017-R) — complete

Both exact hand variants have the same manufacturer-listed input set: dual-stage trigger; flip trigger; three four-way hats with push; grip paddle switch; three push buttons; analog ministick with push; brake lever axis; two-way mode slider; and lockable twist axis. The product page makes the L/R SKU distinction and lists the physical controls. [L product page](https://virpil-controls.eu/cdt-aero-l-grip.html), [R product page](https://virpil-controls.eu/cdt-aero-r-grip.html).

The official mapping sheets are linked from the [L support article](https://support.virpil.com/en/support/solutions/articles/47001285225-vpc-cdt-aero-l-grip) and [R support article](https://support.virpil.com/en/support/solutions/articles/47001285226-vpc-cdt-aero-r-grip). They depict the SLDR input ranging continuously from 0 to 100. This conflicts with the product-page phrase “2-Way Mode Slider”; the data therefore records an analog slider and preserves the wording caveat. The sheets also show separate ministick X/Y and grip twist axes. The two RGB LEDs are indicators, not controls.

## CDT-AEROMAX L, LZ, R, and RZ Flightsticks — partial

Exact product pages/SKUs were checked for [L (VPC-120-L)](https://virpil-controls.eu/cdt-aeromax-l-flightstick.html), [LZ (VPC-120-LZ)](https://virpil-controls.eu/cdt-aeromax-lz-flightstick-omnithrottle.html), [R (VPC-120-R)](https://virpil-controls.eu/cdt-aeromax-r-flightstick.html), and [RZ (VPC-120-RZ)](https://virpil-controls.eu/cdt-aeromax-rz-flightstick-omnithrottle.html). These identify the L/R handedness, Z omnithrottle variants, lockable twist axis, and optional throttle module. The common grip is described as the AEROMAX design. Separately, the CDT-AERO pages describe that same grip design and enumerate one dual-stage trigger, one flip trigger, three four-way push hats, a paddle switch, three push buttons, analog ministick with push, brake lever axis, and mode slider; its official mapping sheets establish the slider's continuous range.

Those grip controls are recorded for each AEROMAX variant, but evidence coverage remains partial because VIRPIL's exact AEROMAX product pages do not publish a physical input-by-input list or an AEROMAX-specific control-layout sheet. No optional throttle modules are counted as installed. The product pages establish a twist axis across the listed variants; the Z suffix identifies the omnithrottle configuration, not a separately fitted throttle lever module. The AEROMAX user's manual documents optional module installation and permits a second module on the standard stick, but the module is an accessory rather than part of the default inventory. [Official AEROMAX manual](https://support.virpil.com/en/support/solutions/articles/47001275968-cdt-aeromax-flightstick-user-manual).

## CDT-AEROMAX Throttle Module (VPC-632) — complete

The [official module page](https://virpil-controls.eu/cdt-aeromax-throttle-module.html) identifies a single adjustable-tension, contactless throttle lever and states that the module requires an AEROMAX flightstick and cannot operate standalone. No independent buttons, switches, selector, or detent inputs are listed or shown. The inventory records one analog throttle axis at the module location.

## Schema limitations and unresolved facts

- The schema has no dedicated flip-trigger “input while raised” property; `action: flip` and one stage describe the manufacturer's flip trigger without adding a fictitious separate button.
- The schema cannot express the adjustable/rotatable lockout behavior of the twist axis as a control item. It remains in `hardware.axes` where present.
- It cannot model the two-way mode slider's selectable mode semantics alongside its analog 0–100 electrical axis. The YAML records the documented analog axis and notes the product-page terminology.
- VIRPIL does not give an exact control list for the AEROMAX assembled SKUs; their inventories remain partial pending that publication. The evidence source is an official product page describing the AEROMAX grip design plus the official CDT-AERO list and mapping sheets, not an exact AEROMAX mapping sheet.
- The module page describes lever force adjustment but no detent mechanism. No detent is inferred.
