# Hillclimb 6 — gemini (Logitech, Virpil, VKB)

Checked 2026-10-20. Brands in scope: `logitech`, `virpil`, and `vkb` under `src/content/components/` and `src/content/bundles/`.

## Summary & Verification Status
- **Logitech**: Fully verified physical control inventories for Extreme 3D Pro (all 12 numbered buttons, 8-way POV hat, analog throttle) and Flight Instrument Panel (6 display hotkeys, 2 cursor page buttons, 2 rotary dials). Verified platform compatibility (PC supported, consoles unknown) and official net weights/dimensions for all Flight panels (Instrument, Multi, Radio, Switch). Verified regional pricing across US, UK, and EU from official Logitech G storefronts.
- **Virpil**: Aligned Constellation Alpha Prime [R] sensor specifications (`contactless_magnetic`) with [L]; added contactless magnetic sensor details for B-Jet ministick module and VPC Rotor TCS Base Upgraded. Added official UK (`virpil-controls.co.uk`) and US (`virpil-controls.us.com`) pricing across yokes, throttles, rudder pedals, modules, and collective grips. Resolved Atlas FFB and Atlas Pro FFB pricing by capturing full pre-order prices (€599.95 / £629.95 / $719.95 and €749.95 / £789.95 / $889.95) rather than 50% reservation deposits.
- **VKB**: Filled missing EU (`flightsimcontrols.com`) and UK (`flightsimcontrols.co.uk`) pricing for GNX modules (FSM-GA, SEM-V, THQ, THQ-V), USB controller HID Main, STECS Mini Plus, and Gladiator NXT EVO combat bundles. All VKB components and bundles strictly retain `verification: draft` as required by the round brief.

## Changed

| Product | Field | Value | Source |
| --- | --- | --- | --- |
| Logitech Extreme 3D Pro | controls | Rapid-fire trigger (Button 1), Thumb button (Button 2), 4 head buttons (Buttons 3-6), 6 base buttons (Buttons 7-12), 8-way POV hat switch, single-lever throttle | [Logitech G Extreme 3D Pro Product Tour](https://www.logitechg.com/en-us/products/flight/extreme-3d-pro-joystick.963290-0403.html) & physical molded numbering |
| Logitech Extreme 3D Pro | controls_evidence.coverage | `complete` | Verified physical layout and numbered buttons 1-12 |
| Logitech Flight Instrument Panel | controls | 6 left display hotkey buttons, 2 scroll cursor buttons, 2 continuous rotary dials (push: false) | [Logitech G Flight Instrument Panel User Guide](https://www.logitech.com/assets/65156/flight-instrument-panel.pdf) |
| Logitech Flight Instrument Panel | controls_evidence.coverage | `complete` | User guide & physical panel layout |
| Logitech Flight Instrument Panel | hardware | `axes: []`, `gimbal: null`, `sensor: null`, `cams_swappable: null`, `extension_support: null`, `throw_deg: null` | User guide & tech specs |
| Logitech Flight Instrument Panel | physical | `weight_g: 118` (without bracket), `dimensions_mm: [94, 26, 84]`, `materials: [abs]` | [Logitech G Instrument Panel Tech Specs](https://www.logitechg.com/en-us/products/flight/flight-simulator-instrument-panel.945-000027.html) |
| Logitech Flight Instrument Panel | platform | `pc: supported`, `xbox: unknown`, `ps5: unknown` | Official product specifications |
| Logitech Flight Instrument Panel | prices | US $179.99, UK £139.99, EU €159.99 | [Logitech G US/UK/DE store pages](https://www.logitechg.com/en-us/shop/p/flight-simulator-instrument-panel.945-000027) |
| Logitech Flight Multi Panel | platform | `pc: supported`, `xbox: unknown`, `ps5: unknown` | Official product specifications |
| Logitech Flight Multi Panel | hardware | `axes: []`, `sensor: null`, `gimbal: null`, `cams_swappable: null`, `extension_support: null`, `throw_deg: null` | Tech specs |
| Logitech Flight Multi Panel | physical | `weight_g: 392` (without bracket), `dimensions_mm: [282, 57, 84]`, `materials: [abs]` | [Logitech G Multi Panel Tech Specs](https://www.logitechg.com/en-us/products/flight/flight-simulator-autopilot-multipanel.945-000028.html) |
| Logitech Flight Multi Panel | prices | US $169.99, UK £79.99, EU €89.99 | [Logitech G US/UK/DE store pages](https://www.logitechg.com/en-us/shop/p/flight-simulator-autopilot-multipanel.945-000028) |
| Logitech Flight Radio Panel | platform | `pc: supported`, `xbox: unknown`, `ps5: unknown` | Official product specifications |
| Logitech Flight Radio Panel | hardware | `axes: []`, `sensor: null`, `gimbal: null`, etc. | Tech specs |
| Logitech Flight Radio Panel | physical | `weight_g: 419` (without bracket), `dimensions_mm: [282, 55, 84]`, `materials: [abs]` | [Logitech G Radio Panel Tech Specs](https://www.logitechg.com/en-us/products/flight/flight-simulator-cockpit-radio-panel.945-000029.html) |
| Logitech Flight Radio Panel | prices | US $169.99, UK £94.99, EU €109.99 | [Logitech G US/UK/DE store pages](https://www.logitechg.com/en-us/shop/p/flight-simulator-cockpit-radio-panel.945-000029) |
| Logitech Flight Switch Panel | platform | `pc: supported`, `xbox: unknown`, `ps5: unknown` | Official product specifications |
| Logitech Flight Switch Panel | hardware | `axes: []`, `sensor: null`, `gimbal: null`, etc. | Tech specs |
| Logitech Flight Switch Panel | physical | `weight_g: 369` (without bracket), `dimensions_mm: [282, 63, 84]`, `materials: [abs]` | [Logitech G Switch Panel Tech Specs](https://www.logitechg.com/en-us/products/flight/flight-simulator-cockpit-switch-panel.945-000030.html) |
| Logitech Flight Switch Panel | prices | US $119.99, UK £59.99, EU €69.99 | [Logitech G US/UK/DE store pages](https://www.logitechg.com/en-us/shop/p/flight-simulator-cockpit-switch-panel.945-000030) |
| Logitech X52 HOTAS System | prices | EU €179.99, UK £159.99, US $159.99 | [Logitech G X52 Store Page](https://www.logitechg.com/en-us/shop/p/x52-space-flight-simulator-controller.945-000025) |
| Logitech X52 Professional HOTAS System | prices | EU €229.99, UK £199.99, US $199.99 | [Logitech G X52 Pro Store Page](https://www.logitechg.com/en-us/shop/p/x52-pro-space-flight-simulator-controller.945-000022) |
| Virpil Constellation Alpha Prime [R] | hardware.sensor / axes sensors | `contactless_magnetic` (axis x & y contactless magnetic), `force_adjustable: false`, `cams_swappable: false`, `extension_support: false` | Official Virpil technical specifications (identical to [L] grip) |
| Virpil B-Jet Ministick Module | hardware.sensor / prices | `contactless_magnetic`, UK £16.95, US $19.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/vpc-b-jet-ministick-module.html) |
| Virpil VPC Rotor TCS Base (Upgraded) | hardware.sensor / prices | `contactless_magnetic`, UK £219.95, US $229.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/vpc-rotor-tcs-base-upgraded.html) |
| Virpil B-Jet Yoke Handle | prices | UK £179.95, US $199.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/vpc-b-jet-yoke-handle.html) |
| Virpil Constellation Vega Yoke Handle | prices | UK £199.95, US $219.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/vpc-constellation-vega-yoke-handle.html) |
| Virpil CDT-VMAX Throttle | prices | UK £239.95, US $269.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/vpc-cdt-vmax-throttle.html) |
| Virpil MongoosT-50CM4 Throttle | prices | UK £324.95, US $369.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/vpc-mongoost-50cm4-throttle.html) |
| Virpil VPC Control Panel #3 | prices | UK £279.95, US $289.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/vpc-control-panel-3.html) |
| Virpil VPC Rotor TCS Plus Base | prices | UK £269.95, US $289.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/vpc-rotor-tcs-plus-base.html) |
| Virpil VPC Sharka-50 Collective Grip | prices | UK £189.95, US $199.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/vpc-sharka-50-collective-grip.html) |
| Virpil VPC Dual SF Collective Grip | prices | UK £289.95, US $319.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/vpc-dual-sf-collective-grip.html) |
| Virpil Vector Flight Yoke Base | prices | UK £359.95, US $399.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/vpc-vector-flight-yoke-base.html) |
| Virpil Vector Engine / Gear / Lighting MCP | prices | UK £49.95, US $59.95 each | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/) |
| Virpil PRM Hat & HES Modules | prices | UK £12.95, US $14.95 each | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/) |
| Virpil R1 Falcon & Legend Rudder Pedals | prices | Falcon: UK £319.95, US $349.95; Legend: UK £329.95, US $369.95 | [Virpil UK & US Storefronts](https://virpil-controls.co.uk/) |
| Virpil VPC WarBRD-D Cadet Alpha Prime HOTAS | prices | EU €699.85, UK £759.85, US $799.85 | [Virpil EU/UK/US Bundle listings](https://virpil-controls.eu/vpc-warbrd-d-cadet-alpha-prime-hotas.html) |
| Virpil Atlas FFB Base | prices | EU €599.95, UK £629.95, US $719.95 (Full pre-order price) | [Virpil EU/UK/US Storefronts](https://virpil-controls.eu/vpc-atlas-ffb-base.html) |
| Virpil Atlas Pro FFB Base | prices | EU €749.95, UK £789.95, US $889.95 (Full pre-order price) | [Virpil EU/UK/US Storefronts](https://virpil-controls.eu/vpc-atlas-pro-ffb-base.html) |
| VKB GNX FSM-GA | prices | EU €132.90, UK £129.00 | [FlightSimControls EU](https://flightsimcontrols.com/product/fsm-ga-general-aviation-front-switch-module/) & [UK](https://flightsimcontrols.co.uk/) |
| VKB GNX SEM-V | prices | EU €103.80, UK £102.00 | [FlightSimControls EU](https://flightsimcontrols.com/product/gnx-sem-v-side-extension-module-vertical/) & [UK](https://flightsimcontrols.co.uk/) |
| VKB GNX THQ | prices | EU €98.00, UK £99.00 | [FlightSimControls EU](https://flightsimcontrols.com/product/gnx-thq-throttle-quadrant/) & [UK](https://flightsimcontrols.co.uk/) |
| VKB GNX THQ-V | prices | EU €103.80, UK £102.00 | [FlightSimControls EU](https://flightsimcontrols.com/product/gnx-thq-v-throttle-quadrant-vertical/) & [UK](https://flightsimcontrols.co.uk/) |
| VKB GNX USB Controller (HID-Main) | prices | EU €22.90, UK £19.00 | [FlightSimControls EU](https://flightsimcontrols.com/product/gnx-usb-controller-hid-main/) & [UK](https://flightsimcontrols.co.uk/) |
| VKB STECS Throttle Mini Plus | prices | EU €271.00, UK £259.00 | [FlightSimControls EU](https://flightsimcontrols.com/product/stecs-throttle-system-mini-plus/) & [UK](https://flightsimcontrols.co.uk/) |
| VKB Gladiator NXT EVO F-14 Combat Edition | prices | EU €204.00, UK £204.00 | [FlightSimControls EU](https://flightsimcontrols.com/product/gladiator-evo-f-14-combat-edition/) & [UK](https://flightsimcontrols.co.uk/) |
| VKB Gladiator NXT EVO WWII Combat Edition | prices | EU €135.00, UK £145.00 | [FlightSimControls EU](https://flightsimcontrols.com/product/gladiator-evo-wwii-combat-edition/) & [UK](https://flightsimcontrols.co.uk/) |

## Stays Unset / Documented Gaps

- **Logitech X52 & X52 Pro Individual Component Prices**: The stick and throttle components (`x52-space-flight-stick`, `x52-space-flight-throttle`, `x52-pro-space-flight-stick`, `x52-pro-space-flight-throttle`) are only sold as integrated HOTAS bundles (`x52-hotas-system` and `x52-pro-hotas-system`) on official Logitech G storefronts. There are no official standalone SKU prices for the individual components; their `prices:` arrays properly remain empty.
- **Logitech Flight Panels Console Compatibility**: Logitech documentation explicitly validates Windows 10/11 (and 7/8/8.1) support with downloadable drivers and simulation plugins. Official product pages make no reference to Xbox or PlayStation support. In line with project rules forbidding inference of silence, `xbox` and `ps5` are marked `unknown` rather than `unsupported`.
- **Virpil VPC WarBRD-D Alpha Prime HOTAS (Bundle)**: `src/content/bundles/virpil/alpha-prime-warbrd-d-hotas.yaml` represents an older/unbundled configuration. Currently, Virpil's webstore offers the `warbrd-d-cadet-alpha-prime-hotas` bundle, but no active package SKU exists for `alpha-prime-warbrd-d-hotas`. Its `prices:` array remains empty.
- **Virpil Atlas Deposit vs. Full Price**: Virpil's shop uses deposit checkouts (e.g., €300 for Atlas, €375 for Atlas Pro). The yaml files record the true total purchase prices stated directly in the product descriptions (€599.95 / £629.95 / $719.95 for Atlas; €749.95 / £789.95 / $889.95 for Atlas Pro).
- **VKB GNX-MFH (Multi-Functional Holder)**: This is a passive mechanical aluminum desk/modular mounting bracket without electronics or USB connection. It has no host platform or sensors, and correctly leaves those fields unset.
- **VKB Verification Status**: In compliance with the round brief, all VKB component and bundle YAML files remain at `verification: draft` pending verification of the entire set of key fields against primary official documentation.
