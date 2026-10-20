# VIRPIL hillclimb — lineup and control inventories

Checked 2026-10-20 against [virpil-controls.eu](https://virpil-controls.eu/) category listings and the exact product pages and support articles cited below. Weights, dimensions, and prices were not the goal. A value was written only when the exact product's official page, diagram, or manual stated it. Shared page-builder text that names a different product was ignored. Variant data was not copied onto a different SKU.

## Lineup

Current shop categories (flightsticks, collectives, yokes, throttles, control panels, rudder pedals, force feedback) were listed with `product_list_limit=100`. Accessories, desk mounts, cables, cams, springs, dust covers, and merch were recorded as out of catalog scope.

### Added

| Record | SKU | Why it is complete enough to add |
| --- | --- | --- |
| `atlas-ffb-base.yaml` | VPC-115-001 | Two gimbal axes plus the included remote emergency stop. [ATLAS](https://virpil-controls.eu/atlas-ffb-base.html) |
| `atlas-pro-ffb-base.yaml` | VPC-115-002 | Same control set; Pro motor rating is 45 nm / 22 kg versus ATLAS 25 nm / 12 kg. [ATLAS PRO](https://virpil-controls.eu/atlas-pro-ffb-base.html) |
| `b-jet-yoke-handle.yaml` | VPC-020 | Page lists two rocker triggers, two trimmer switches, one 8-way hat with push, one 4-way hat with push, two push buttons. [B-JET](https://virpil-controls.eu/b-jet-yoke-handle.html) |
| `b-jet-ministick-module.yaml` | VPC-633-03 | One 4-way hat with push and one contactless analogue ministick. [Module](https://virpil-controls.eu/b-jet-ministick-module.html) |
| `constellation-vega-yoke-handle.yaml` | VPC-018 | Page's "Extensive Control Set". Trigger-end presses are lever contacts. [VEGA](https://virpil-controls.eu/constellation-vega-yoke-handle.html) |
| `vector-flight-yoke-base.yaml` | VPC-114 | Pitch and roll only. Handles and plates are separate. [Vector base](https://virpil-controls.eu/vector-flight-yoke-base.html) |
| `vector-lighting-mcp.yaml` | VPC-414-001 | Six 3-way latched toggles. [Lighting MCP](https://virpil-controls.eu/vector-lmc-panel.html) |
| `vector-gear-mcp.yaml` | VPC-414-002 | One landing-gear lever and one push button. Analog versus discrete is not stated. [Gear MCP](https://virpil-controls.eu/vector-gmc-panel.html) |
| `vector-engine-mcp.yaml` | VPC-414-003 | 5-way starter dial with a spring-loaded START position, plus three 3-way latched toggles. [Engine MCP](https://virpil-controls.eu/vector-emc-panel.html) |
| `prm-hat-module.yaml` | VPC-633-05 | One 4-way hat with locking push. [PRM-HAT](https://virpil-controls.eu/prm-hat-module.html) |
| `prm-hes-module.yaml` | VPC-633-04 | One contactless Hall-effect ministick. No center push is stated. [PRM-HES](https://virpil-controls.eu/prm-hes-module.html) |
| `vpc-dual-sf-collective-grip.yaml` | VPC-014 | Dual-SF column of the on-page comparison table. [Dual-SF](https://virpil-controls.eu/vpc-dual-sf-collective-grip.html) |
| `vpc-sharka-50-collective-grip.yaml` | VPC-011 | Page input list. [SharKa-50](https://virpil-controls.eu/vpc-sharka-50-collective-grip.html) |
| `vpc-rotor-tcs-base-upgraded.yaml` | VPC-111-200 | Non-Plus upgraded base. Manual shows one collective axis and no Plus twist controls. [Base](https://virpil-controls.eu/vpc-rotor-tcs-base-upgraded.html), [manual](https://support.virpil.com/en/support/solutions/articles/47001258804-rotor-tcs-base-upgraded-user-manual) |
| `vpc-control-panel-3.yaml` | VPC-403-001 | Titled input list on the product page, plus the mapping diagram for the dial push and lever axis names. [Panel #3](https://virpil-controls.eu/vpc-universal-control-panel-3.html), [mapping](https://support.virpil.com/en/support/solutions/articles/47001264833-vpc-control-panel-3) |
| `r1-falcon-rudder-pedals.yaml` | VPC-305-001 | Three axes, yaw and two toe brakes. [Falcon](https://virpil-controls.eu/r1-falcon-rudder-pedals.html) |
| `r1-legend-rudder-pedals.yaml` | VPC-305-002 | Same three axes. The page's stated difference is the full-foot plate. [Legend](https://virpil-controls.eu/r1-legend-rudder-pedals.html) |

EU prices on those pages were stored when the displayed product price was the cart price. ATLAS and ATLAS PRO cart amounts are 50 percent deposits (€300 and €375) of the stated pre-order prices (€599.95 and €749.95), so no price was stored for them.

The EU store serves identical image bytes for the ATLAS and ATLAS PRO gallery files (`ffb_atlas.3705.png` and `ffb_atlas.3705_1.png`). Each record points at the file from its own product page.

### Already in the catalog

Grips: Archer-SF, CDT-AERO L/R, Alpha Prime L/R, FLNKR, Hawk-60. Bases: WarBRD-D, MongoosT-50CM3, Rotor TCS Plus (`vpc-rotor-tcs-base.yaml`, SKU on that record is the Plus). Sticks: AEROMAX L/LZ/R/RZ. Throttles: CDT-VMAX, CM4, VMAX Prime, AEROMAX throttle module. Panels: Universal Control Panel #1 and #2. Pedals: ACE Interceptor and ACE-TORQ.

### Not added

- **P-JET yoke handle.** PRM module pages name it as a compatible handle. It is not in [Yoke grips](https://virpil-controls.eu/shop/yokes/grips). No separate product page was found, so no record.
- **SharKa-50 Control Panel.** Panel #3's page says it is based on that panel. It is not in [Control panels](https://virpil-controls.eu/shop/control-panels). No current listing, so no record.
- **R1 footplates** VPC-6305-001 and VPC-6305-002, **UCP #3 axis handles** VPC-693-P, damper kits, the Rotor counter-balance kit, springs, cams, extensions, desk mounts, cables, and dust covers. These are accessories. Footplates and axis handles do not add their own axes or buttons. They are outside the component categories used for controls.
- **Shop bundles** [WarBRD-D HOSAS Alpha Prime](https://virpil-controls.eu/warbrd-d-hosas-bundle-alpha-prime-edition.html) and [WarBRD-D CADET HOTAS Alpha Prime](https://virpil-controls.eu/warbrd-d-cadet-hotas-bundle-alpha-prime-edition.html). This pass could edit component files only. Existing bundle records are a different collection and were not changed.
- **ACE Interceptor** VPC-302-001 still resolves, and the page is marked out of stock. It is not in the current rudder category. The catalog already has it.
- **ACE-TORQ** VPC-304-001 still resolves at [vpc-ace-torq-rudder-pedals.html](https://virpil-controls.eu/vpc-ace-torq-rudder-pedals.html) and is out of stock. It is not in the current rudder category. The catalog already has it. `vpc-ace-torq-pedals.html` returns 404.
- **MongoosT-50CM3 throttle.** [vpc-mongoost-50cm3-throttle.html](https://virpil-controls.eu/vpc-mongoost-50cm3-throttle.html) returns 404. [B-stock VPC-201-003-B](https://virpil-controls.eu/vpc-mongoost-50cm3-throttle-b-stock.html) still resolves. The catalog record is already discontinued and points at the B-stock page.

## AEROMAX inventories

The four fixed sticks were `coverage: partial` because their controls had been taken from the separate CDT-AERO grip pages. Each exact AEROMAX page now embeds its own labeled grip diagram:

- L and LZ: [AEROMAX_LEFT_GRIPFEATURES.jpg](https://virpil-controls.eu/media/wysiwyg/virpil/productpages/AEROMAX_LEFT_GRIPFEATURES.jpg)
- R and RZ: [AEROMAX_GRIPFEATURES.jpg](https://virpil-controls.eu/media/wysiwyg/virpil/productpages/AEROMAX_GRIPFEATURES.jpg)

Both diagrams label the same set: dual-stage trigger, flip trigger, three 4-way hats with push, three push buttons, analogue ministick, 2-way slider, paddle switch, brake lever axis, lockable twist. Two programmable LEDs are indicators.

The product pages link the [AEROMAX mapping sheet](https://support.virpil.com/en/support/solutions/articles/47001275883-cdt-aeromax-r-flightstick), titled VPC CDT-AEROMAX FLIGHTSTICK. It names X/Y, twist Z, brake RZ, ministick RX/RY with a center push, and slider axis SL. That is the exact-product basis for ministick push and for treating the slider as an analog axis. Coverage is now complete on all four records.

The same sheet draws two side levers, one marked DL. The product pages sell the throttle module separately (SKU VPC-632) and say it is optional. Those levers are not in the bare-stick inventory.

L and R verdict text that said those sticks have no twist was corrected. The diagrams and the "Lockable Twist Axis" line are on the straight L and R pages. LZ and RZ are the omnithrottle listings with a built-in Z-extension.

## Left unset

- **ATLAS throw.** The page says an axis range of 18 degrees and does not say whether that is total travel or travel each side of center. [ATLAS](https://virpil-controls.eu/atlas-ffb-base.html)
- **ATLAS USB connector.** The page says it is a USB device and does not name the connector.
- **Vector roll throw.** Selectable 90 or 180 degrees, and pitch is given as 160 mm, so one `throw_deg` is not set. [Vector base](https://virpil-controls.eu/vector-flight-yoke-base.html)
- **Vector Gear lever.** "Landing gear lever" with an adjustable mechanism. Analog versus discrete is not stated. [Gear MCP](https://virpil-controls.eu/vector-gmc-panel.html)
- **B-JET rockers and trimmer switches.** Counts are stated. Analog versus digital, and the trimmer mechanism, are not. [B-JET](https://virpil-controls.eu/b-jet-yoke-handle.html)
- **VEGA scroll wheel.** The page says "Scroll Wheel w/ 2 x Push" without defining a two-stage click versus two presses. Ministick center push is not stated. [VEGA](https://virpil-controls.eu/constellation-vega-yoke-handle.html)
- **SharKa-50 2-way switch and ON-OFF-ON toggles.** The page does not identify the 2-way mechanism or whether the toggles are momentary. Overview says enhanced PU plastic; the description says a metal handle with a rubberised grip. Materials left unset. [SharKa-50](https://virpil-controls.eu/vpc-sharka-50-collective-grip.html)
- **Panel #3 latching toggles.** The list says both "Latching" and "([ON]-OFF-[ON])". Momentary is unset. The seven ON-OFF-ON toggles are also not described as momentary or maintained. [Panel #3](https://virpil-controls.eu/vpc-universal-control-panel-3.html)
- **Rotor TCS (non-Plus) sensor.** The manual does not name the sensor technology. Plus twist, idle button, and restrictor were not copied. [Manual](https://support.virpil.com/en/support/solutions/articles/47001258804-rotor-tcs-base-upgraded-user-manual)
- **Dual-SF engine idle.** The mapping article title says "with Engine Idle Button". The product-page table does not list an idle control beyond the six momentary buttons, so it was not added a second time. MongoosT-50CM3 detent and throttle paragraphs on that page were ignored. [Dual-SF](https://virpil-controls.eu/vpc-dual-sf-collective-grip.html)
- **R1 USB connector.** The Falcon manual includes "1 x USB Cable" and does not name the connector. The damper kit is optional and not part of the pedal inventory.

Existing VIRPIL records that were already `coverage: complete` were not rewritten. Their remaining gaps are optional properties (push, backlight, momentary) or unpublished hardware fields, not missing control counts.
