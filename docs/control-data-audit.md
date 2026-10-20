# Control data audit

Audited 2026-10-19. All 110 component records have received a manufacturer-source research pass and include inventory-specific evidence. This does not mean every property or product inventory is fully resolved. Exact SKU/handedness, installed options, conflicting documentation and inaccessible primary details are recorded in the YAML evidence notes.

Current coverage: **55 complete physical inventories; 55 partial inventories**. Complete refers to physical types/counts, not confirmation of every optional property. Some complete empty inventories are mechanical accessories or bare bases. Partial empty inventories are unconfirmed, never verified zeros.

The WINCTRL rendered-page follow-up is complete. It recovered exact-handed manuals and additional inventories; unresolved SKU identities and unclassified controls remain explicitly partial.

Catalog update 2026-10-20: the original Constellation Alpha Left/Right records were removed at the owner’s request because they are no longer sold. Their historical research notes remain below; the current additions are documented in [Thrustmaster](research/catalog-refresh-thrustmaster.md), [SOL-R](research/catalog-refresh-solr.md) and [Turtle Beach](research/catalog-refresh-turtle-beach.md).

## Evidence and display rules

- Physical push buttons exclude contacts belonging to hats, trigger stages, switch positions, lever detents, and encoder clicks.
- Unknown directions, switch positions, pressability and axis behavior remain Unknown. They do not receive silent defaults.
- Generic switches retain known physical counts without claiming a mechanism. Pedal axes are distinct from hand-operated levers and electrical rocker switches.
- Physical locations are stated only when sourced; integrated devices are not assigned grip/base locations by guesswork.
- Replacement modules, spare detent frames, optional accessories and firmware bindings are not counted as simultaneously installed controls.
- Logical inputs are estimates of recorded behavior and may differ from firmware totals. A partial inventory with no documented inputs shows a dash rather than zero.
- Bundles preserve component inventories and inherit partial coverage if any included component remains partial.

## Research and corrections

See [the parent integration review](research/controls-integration-review.md) for final source reconciliation and diagram checks. Earlier notes preserve preliminary research and subsequent corrections.

| Research group | Initial findings | Correction review |
| --- | --- | --- |
| honeycomb-1 | [Sources](research/controls-honeycomb-1.md) | [Review](research/controls-review-honeycomb-logitech.md) |
| logitech-1 | [Sources](research/controls-logitech-1.md) | [Review](research/controls-review-honeycomb-logitech.md) |
| moza-1 | [Sources](research/controls-moza-1.md) | [Review](research/controls-review-moza1.md) |
| moza-2 | [Sources](research/controls-moza-2.md) | [Review](research/controls-review-moza2-vkb1.md) |
| thrustmaster-1 | [Sources](research/controls-thrustmaster-1.md) | [Review](research/controls-review-thrustmaster-all.md) |
| thrustmaster-2 | [Sources](research/controls-thrustmaster-2.md) | [Review](research/controls-review-thrustmaster-all.md) |
| virpil-1 | [Sources](research/controls-virpil-1.md) | See integration review / source caveats |
| virpil-2 | [Sources](research/controls-virpil-2.md) | [Review](research/controls-review-virpil23.md) |
| virpil-3 | [Sources](research/controls-virpil-3.md) | [Review](research/controls-review-virpil23.md) |
| vkb-1 | [Sources](research/controls-vkb-1.md) | [Review](research/controls-review-moza2-vkb1.md) |
| vkb-2 | [Sources](research/controls-vkb-2.md) | [Review](research/controls-review-vkb2.md) |
| winctrl-1 | [Sources](research/controls-winctrl-1.md) | [Rendered-page follow-up](research/controls-winctrl-browser-followup.md) |
| pedals-and-turtle-beach | [Sources](research/controls-pedals-and-turtle-beach.md) | See integration review / source caveats |

## Current inventory by product

Known unresolved facts and revision caveats are stored in each linked data file. Undocumented control types are not automatically absent.

| Component | Coverage | Recorded physical groups | Unknown pressability groups | Groups without confirmed location | Inventory source |
| --- | --- | ---: | ---: | ---: | --- |
| [Alpha Flight Controls Lite](../src/content/components/honeycomb/alpha-flight-controls-lite.yaml) | complete | 3 | 2 | 0 | [Manufacturer](https://flyhoneycomb.com/products/alpha-flight-controls-lite) |
| [Alpha Flight Controls XPC](../src/content/components/honeycomb/alpha-flight-controls-xpc.yaml) | partial | 4 | 3 | 0 | [Manufacturer](https://flyhoneycomb.com/products/alpha-flight-controls-xpc) |
| [Alpha Flight Controls Yoke](../src/content/components/honeycomb/alpha-flight-controls-yoke.yaml) | partial | 4 | 3 | 0 | [Manufacturer](https://flyhoneycomb.com/products/alpha-flight-controls) |
| [Bravo Throttle Quadrant Lite](../src/content/components/honeycomb/bravo-throttle-quadrant-lite.yaml) | partial | 5 | 1 | 0 | [Manufacturer](https://flyhoneycomb.com/products/bravo-throttle-quadrant-lite) |
| [Bravo Throttle Quadrant](../src/content/components/honeycomb/bravo-throttle-quadrant.yaml) | partial | 6 | 2 | 0 | [Manufacturer](https://flyhoneycomb.com/products/bravo-throttle-quadrant) |
| [Charlie Rudder Pedals](../src/content/components/honeycomb/charlie-rudder-pedals.yaml) | complete | 2 | 0 | 0 | [Manufacturer](https://flyhoneycomb.com/products/charlie-rudder-pedals) |
| [Foxtrot Aviation Stick](../src/content/components/honeycomb/foxtrot-aviation-stick.yaml) | partial | 10 | 8 | 0 | [Manufacturer](https://flyhoneycomb.com/products/foxtrot-aviation-stick) |
| [Foxtrot Throttle Box](../src/content/components/honeycomb/foxtrot-throttle-box.yaml) | partial | 3 | 0 | 0 | [Manufacturer](https://flyhoneycomb.com/products/foxtrot-takeoff-kit) |
| [Sierra TPM Module](../src/content/components/honeycomb/sierra-tpm-module.yaml) | partial | 5 | 1 | 0 | [Manufacturer](https://flyhoneycomb.com/products/sierra-tpm-module) |
| [Logitech Extreme 3D Pro](../src/content/components/logitech/extreme-3d-pro.yaml) | partial | 3 | 0 | 0 | [Manufacturer](https://www.logitechg.com/en-us/shop/p/extreme-3d-pro-joystick) |
| [Logitech G Pro Flight Rudder Pedals](../src/content/components/logitech/g-saitek-pro-flight-rudder-pedals.yaml) | complete | 2 | 0 | 0 | [Manufacturer](https://www.logitechg.com/en-us/shop/p/flight-simulator-rudder-pedals.945-000024) |
| [Logitech G Pro Flight Throttle Quadrant](../src/content/components/logitech/g-saitek-pro-flight-throttle-quadrant.yaml) | complete | 3 | 0 | 2 | [Manufacturer](https://origin-saitek2.logitech.com/uk/blog/wp-content/uploads/2014/08/07-14.pdf) |
| [Logitech G Flight Yoke System - Yoke](../src/content/components/logitech/g-saitek-pro-flight-yoke.yaml) | complete | 4 | 2 | 0 | [Manufacturer](https://origin-saitek2.logitech.com/uk/blog/wp-content/uploads/2014/08/07-14.pdf) |
| [X52 Pro Flight Stick](../src/content/components/logitech/x52-pro-flight-stick.yaml) | partial | 7 | 2 | 0 | [Manufacturer](https://www.logitech.com/assets/65327/x52-professional-hotas.pdf) |
| [X52 Pro Throttle](../src/content/components/logitech/x52-pro-throttle.yaml) | partial | 9 | 3 | 9 | [Manufacturer](https://www.logitech.com/assets/65327/x52-professional-hotas.pdf) |
| [X52 Space Flight Stick](../src/content/components/logitech/x52-space-flight-stick.yaml) | partial | 7 | 2 | 0 | [Manufacturer](https://www.logitech.com/assets/65327/x52-professional-hotas.pdf) |
| [X52 Throttle](../src/content/components/logitech/x52-throttle.yaml) | partial | 9 | 3 | 9 | [Manufacturer](https://www.logitech.com/assets/65327/x52-professional-hotas.pdf) |
| [X56 Rhino Stick](../src/content/components/logitech/x56-rhino-stick.yaml) | complete | 4 | 1 | 0 | [Manufacturer](https://www.logitech.com/assets/65324/x56-hotas.pdf) |
| [X56 Rhino Throttle](../src/content/components/logitech/x56-rhino-throttle.yaml) | complete | 9 | 5 | 3 | [Manufacturer](https://www.logitech.com/assets/65324/x56-hotas.pdf) |
| [Crosswind Cessna Footrests](../src/content/components/mfg/crosswind-cessna-footrests.yaml) | complete | 0 | 0 | 0 | [Manufacturer](https://mfg-sim.com/rudder-acessories/footrest-kit-for-mfg-rudder-pedals.html) |
| [Crosswind ME-109 Combat Footrests](../src/content/components/mfg/crosswind-combat-footrests.yaml) | complete | 0 | 0 | 0 | [Manufacturer](https://mfg-sim.com/rudder-acessories/footrest-kit-for-mfg-rudder-pedals.html) |
| [Crosswind Hydraulic Damper](../src/content/components/mfg/crosswind-hydraulic-damper.yaml) | complete | 0 | 0 | 0 | [Manufacturer](https://mfg-sim.com/rudder-acessories/hydraulic-damper-universal-kit-for-v1-3-pedals.html) |
| [Crosswind V3 Graphite Rudder Pedals](../src/content/components/mfg/crosswind-v3-graphite-pedals.yaml) | complete | 2 | 0 | 0 | [Manufacturer](https://mfg-sim.com/rudders/mfg-crosswind-v3-base.html) |
| [MOZA AB6 Force Feedback Base](../src/content/components/moza/ab6-force-feedback-base.yaml) | partial | 2 | 0 | 0 | [Manufacturer](https://support.mozaracing.com/en/support/solutions/articles/70000684201-ab6-force-feedback-base) |
| [MOZA AB9 Force Feedback Base](../src/content/components/moza/ab9-force-feedback-base.yaml) | partial | 0 | 0 | 0 | [Manufacturer](https://support.mozaracing.com/en/support/solutions/articles/70000668982-moza-ab9-base-support) |
| [MOZA AY210 Yoke Base](../src/content/components/moza/ay210-yoke-base.yaml) | partial | 1 | 1 | 0 | [Manufacturer](https://support.mozaracing.com/en/support/solutions/articles/70000679586-moza-ay210-yoke-base-support) |
| [MOZA AY90 Yoke Base](../src/content/components/moza/ay90-yoke-base.yaml) | partial | 3 | 2 | 0 | [Manufacturer](https://us.mozaracing.com/pages/ay90-yoke-base) |
| [MOZA J04 Yoke](../src/content/components/moza/j04-yoke.yaml) | partial | 4 | 2 | 0 | [Manufacturer](https://back.mozaracing.com/wordpress/wp-content/uploads/2025/manual/AY210-FFB-Yoke-Base-Manual-EN.pdf) |
| [MOZA MA3X Side Stick](../src/content/components/moza/ma3x-side-stick.yaml) | partial | 3 | 2 | 0 | [Manufacturer](https://support.mozaracing.com/en/support/solutions/articles/70000679588-moza-ma3x-side-stick-support) |
| [MOZA MFY Yoke Pro](../src/content/components/moza/mfy-yoke-pro.yaml) | partial | 4 | 2 | 0 | [Manufacturer](https://us.mozaracing.com/pages/mfy-pro-yoke) |
| [MOZA MH16 Flightstick Grip](../src/content/components/moza/mh16-flight-grip.yaml) | partial | 3 | 1 | 0 | [Manufacturer](https://support.mozaracing.com/en/support/solutions/articles/70000679587-moza-mh16-flightstick-support) |
| [MOZA MHG Flight Grip](../src/content/components/moza/mhg-flight-grip.yaml) | partial | 5 | 3 | 0 | [Manufacturer](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_mhg_flightsticks_manual.pdf?v=1779866649) |
| [MOZA MRP Adjustable Damper](../src/content/components/moza/mrp-adjustable-damper.yaml) | complete | 0 | 0 | 0 | [Manufacturer](https://eu.mozaracing.com/products/mrp-damper) |
| [MOZA MRP Flight Rudder Pedals](../src/content/components/moza/mrp-rudder-pedals.yaml) | partial | 2 | 0 | 0 | [Manufacturer](https://support.mozaracing.com/en/support/solutions/articles/70000684204-mrp-rudder-pedals) |
| [MOZA MTP Flight Throttle](../src/content/components/moza/mtp-throttle.yaml) | partial | 3 | 1 | 0 | [Manufacturer](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_mtp_throttle_panel_manual.pdf?v=1779863093) |
| [MOZA MTQ Throttle](../src/content/components/moza/mtq-throttle.yaml) | partial | 6 | 1 | 0 | [Manufacturer](https://mozaracing.com/products/mtq-throttle) |
| [MOZA TQA Throttle Module](../src/content/components/moza/tqa-throttle-module.yaml) | partial | 1 | 0 | 0 | [Manufacturer](https://eu.mozaracing.com/products/tqa-mod) |
| [MOZA TQB Throttle Module](../src/content/components/moza/tqb-throttle-module.yaml) | partial | 3 | 0 | 0 | [Manufacturer](https://mozaracing.com/products/mtq-throttle) |
| [MOZA Z-Axis Twist Module](../src/content/components/moza/z-axis-twist-module.yaml) | partial | 1 | 0 | 0 | [Manufacturer](https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_z_axis_manual.pdf?v=1779863078) |
| [RH Rotor Pedals](../src/content/components/slaw/rotor-pedals.yaml) | complete | 2 | 0 | 0 | [Manufacturer](https://slawdevice.com/en/rudder-pedals/48-pre-order-rh-rotor-v2-rudder-pedals.html) |
| [Slaw Device Damper Kit](../src/content/components/slaw/slaw-damper-kit.yaml) | complete | 0 | 0 | 0 | [Manufacturer](https://slawdevice.com/en/rudder-pedals/48-pre-order-rh-rotor-v2-rudder-pedals.html) |
| [Viper V2 Rudder Pedals](../src/content/components/slaw/viper-v2-rudder-pedals.yaml) | partial | 1 | 0 | 0 | [Manufacturer](https://slawdevice.com/en/blog/post/7-Announcement-RX-Viper-V2-rudder-pedals.html) |
| [AVA - Advanced Versatile Aviation Base](../src/content/components/thrustmaster/ava-base.yaml) | complete | 1 | 0 | 0 | [Manufacturer](https://www.thrustmaster.com/products/ava-base/) |
| [Sol-R Space Flight Stick](../src/content/components/thrustmaster/sol-r-stick.yaml) | partial | 6 | 3 | 0 | [Manufacturer](https://www.thrustmaster.com/en-us/products/sol-r-1-flightstick/) |
| [T.Flight HOTAS One / 4 / X](../src/content/components/thrustmaster/t-flight-hotas-one-x.yaml) | partial | 3 | 1 | 0 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/Manuals/TFHOne/T-Flight_HO_Manual.pdf) |
| [T.Flight Rudder Pedals (TFRP)](../src/content/components/thrustmaster/t-flight-rudder-pedals-tfrp.yaml) | complete | 2 | 0 | 0 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/Manuals/TFRP/TFRP_User_Manual.pdf) |
| [T.16000M FCS Flight Stick](../src/content/components/thrustmaster/t16000m-fcs-stick.yaml) | complete | 5 | 1 | 0 | [Manufacturer](https://www.thrustmaster.com/en-us/products/t-16000m-fcs/) |
| [TCA Quadrant Airbus Edition](../src/content/components/thrustmaster/tca-quadrant-airbus.yaml) | complete | 7 | 3 | 0 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_Quadrant/TCA_Quadrant_Airbus_Edition_user_manual.pdf) |
| [TCA Quadrant Boeing Edition](../src/content/components/thrustmaster/tca-quadrant-boeing.yaml) | partial | 4 | 1 | 0 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_Quadrant_Boeing/TCA_Quadrant_Boeing_Edition_user_manual.pdf) |
| [TCA Sidestick Airbus Edition](../src/content/components/thrustmaster/tca-sidestick-airbus.yaml) | partial | 2 | 0 | 0 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_Sidestick/TCA_Sidestick_AE_User_Manual.pdf) |
| [TCA Yoke Boeing Edition](../src/content/components/thrustmaster/tca-yoke-boeing.yaml) | partial | 3 | 1 | 2 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_Yoke_Boeing/TCA_Yoke_Boeing_Edition_user_manual.pdf) |
| [TPR PENDUL_R Rudder Pedals](../src/content/components/thrustmaster/tpr-pendular-rudder.yaml) | complete | 2 | 0 | 0 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/Manuals/TPR/TPR_Rudder_User_Manual.pdf) |
| [TWCS Throttle](../src/content/components/thrustmaster/twcs-throttle.yaml) | complete | 8 | 5 | 0 | [Manufacturer](https://ts.thrustmaster.com/download/pictures/PCMAC/TWCS/TWCS_PC_Generic_Mapping.pdf) |
| [Viper Mission Pack BAP Panel](../src/content/components/thrustmaster/viper-bap-panel.yaml) | partial | 3 | 2 | 0 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/Manuals/Viper/Viper_Mission_Pack_User_Manual.pdf) |
| [Viper TQS](../src/content/components/thrustmaster/viper-tqs-throttle.yaml) | partial | 6 | 1 | 0 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/Manuals/Viper/Viper_Mission_Pack_User_Manual.pdf) |
| [HOTAS Warthog Magnetic Flight Base](../src/content/components/thrustmaster/warthog-base.yaml) | complete | 0 | 0 | 0 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/pc/hotas/manual/HOTAS_Warthog/HOTAS_Warthog_Manual.pdf) |
| [HOTAS Warthog Dual Throttle](../src/content/components/thrustmaster/warthog-dual-throttle.yaml) | partial | 14 | 7 | 2 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/pc/hotas/manual/HOTAS_Warthog/HOTAS_Warthog_Manual.pdf) |
| [HOTAS Warthog A-10C Flight Stick Grip](../src/content/components/thrustmaster/warthog-stick-grip.yaml) | complete | 5 | 0 | 0 | [Manufacturer](https://ts.thrustmaster.com/download/accessories/pc/hotas/manual/HOTAS_Warthog/HOTAS_Warthog_Manual.pdf) |
| [VelocityOne Flight Yoke System](../src/content/components/turtle-beach/velocityone-flight-yoke-system.yaml) | partial | 10 | 3 | 1 | [Manufacturer](https://support.turtlebeach.com/articles/en_US/Knowledge/4409140258715-VelocityOne-Flight-Features-And-Controls) |
| [VelocityOne Flightstick](../src/content/components/turtle-beach/velocityone-flightstick.yaml) | partial | 9 | 2 | 9 | [Manufacturer](https://cdn.turtlebeach.com/device/qig/velocityone--flightstick/velocityone--flightstick_367-6703-v1.pdf) |
| [VelocityOne Rudder Pedals](../src/content/components/turtle-beach/velocityone-rudder-pedals.yaml) | complete | 2 | 0 | 0 | [Manufacturer](https://www.turtlebeach.com/products/velocity-one-rudder) |
| [Archer-SF Cyclic Grip](../src/content/components/virpil/archer-sf-cyclic-grip.yaml) | complete | 4 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/archer-sf-cyclic-grip.html) |
| [CDT-AERO-L Grip](../src/content/components/virpil/cdt-aero-l-grip.yaml) | complete | 8 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/cdt-aero-l-grip.html) |
| [CDT-AERO-R Grip](../src/content/components/virpil/cdt-aero-r-grip.yaml) | complete | 8 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/cdt-aero-r-grip.html) |
| [VPC CDT-Aeromax [L] Flightstick](../src/content/components/virpil/cdt-aeromax-l-flightstick.yaml) | partial | 8 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/cdt-aeromax-l-flightstick.html) |
| [VPC CDT-Aeromax [LZ] Flightstick](../src/content/components/virpil/cdt-aeromax-lz-flightstick.yaml) | partial | 8 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/cdt-aeromax-lz-flightstick-omnithrottle.html) |
| [VPC CDT-Aeromax [R] Flightstick](../src/content/components/virpil/cdt-aeromax-r-flightstick.yaml) | partial | 8 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/cdt-aeromax-r-flightstick.html) |
| [VPC CDT-Aeromax [RZ] Flightstick](../src/content/components/virpil/cdt-aeromax-rz-flightstick.yaml) | partial | 8 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/cdt-aeromax-rz-flightstick-omnithrottle.html) |
| [VPC CDT-Aeromax Throttle Lever Module](../src/content/components/virpil/cdt-aeromax-throttle-lever-module.yaml) | complete | 1 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/cdt-aeromax-throttle-module.html) |
| [CDT-VMAX Throttle](../src/content/components/virpil/cdt-vmax-throttle.yaml) | complete | 7 | 0 | 7 | [Manufacturer](https://virpil-controls.eu/vpc-cdt-vmax-throttle.html) |
| [Constellation Alpha Prime (Left)](../src/content/components/virpil/constellation-alpha-prime-l.yaml) | complete | 8 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-constellation-alpha-prime-l.html) |
| [Constellation Alpha Prime (Right)](../src/content/components/virpil/constellation-alpha-prime-r.yaml) | complete | 8 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-constellation-alpha-prime-r.html) |
| [VPC MongoosT-50CM3 Base](../src/content/components/virpil/mongoost-50cm3-base.yaml) | complete | 0 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-mongoost-50cm3-base.html) |
| [VPC MongoosT-50CM3 Throttle](../src/content/components/virpil/mongoost-50cm3-throttle.yaml) | complete | 16 | 4 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-mongoost-50cm3-throttle-b-stock.html) |
| [MongoosT-50CM4 Throttle](../src/content/components/virpil/mongoost-50cm4-throttle.yaml) | complete | 11 | 1 | 0 | [Manufacturer](https://virpil-controls.eu/mongoost-50cm4-throttle.html) |
| [VPC ACE Interceptor Pedals](../src/content/components/virpil/vpc-ace-interceptor-pedals.yaml) | complete | 2 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-ace-interceptor-pedals.html) |
| [VPC ACE-TORQ Pedals](../src/content/components/virpil/vpc-ace-torq-pedals.yaml) | complete | 1 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-ace-torq-rudder-pedals.html) |
| [VPC Universal Control Panel #1](../src/content/components/virpil/vpc-control-panel-1.yaml) | complete | 6 | 4 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-control-panel-1.html) |
| [VPC Universal Control Panel #2](../src/content/components/virpil/vpc-control-panel-2.yaml) | complete | 6 | 3 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-control-panel-2.html) |
| [VPC FLNKR Grip](../src/content/components/virpil/vpc-flanker-grip.yaml) | complete | 8 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-flnkr-grip.html) |
| [VPC Hawk-60 Collective Grip](../src/content/components/virpil/vpc-hawk-60-grip.yaml) | complete | 5 | 1 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-hawk-60-collective-grip.html) |
| [VPC Rotor TCS Plus Base](../src/content/components/virpil/vpc-rotor-tcs-base.yaml) | complete | 4 | 1 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-rotor-tcs-plus-base-upgraded.html) |
| [VPC VMAX Prime Throttle](../src/content/components/virpil/vpc-vmax-prime-throttle.yaml) | complete | 12 | 2 | 12 | [Manufacturer](https://virpil-controls.eu/vpc-vmax-prime-throttle.html) |
| [VPC WarBRD-D Base](../src/content/components/virpil/warbrd-d-base.yaml) | complete | 0 | 0 | 0 | [Manufacturer](https://virpil-controls.eu/vpc-warbrd-d-base.html) |
| [F-14 Combat Grip](../src/content/components/vkb/f14-combat-grip.yaml) | partial | 5 | 0 | 0 | [Manufacturer](https://vkbsimcontrollers.com/products/gnx-f-14-add-on-grip-us) |
| [Gladiator NXT EVO Base](../src/content/components/vkb/gladiator-nxt-evo-base.yaml) | complete | 4 | 3 | 0 | [Manufacturer](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-base-only-us) |
| [Gladiator NXT EVO Omni-Throttle (Left)](../src/content/components/vkb/gladiator-nxt-evo-omni-throttle-l.yaml) | partial | 10 | 3 | 0 | [Manufacturer](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-omni-throttle-left-hand-us) |
| [Gunfighter Mk.IV Base](../src/content/components/vkb/gunfighter-iv-base.yaml) | complete | 0 | 0 | 0 | [Manufacturer](https://vkbsimcontrollers.com/products/gunfighter-mk-iv-base-only-us) |
| [KG12 WWII Grip](../src/content/components/vkb/kg12-wwii-grip.yaml) | complete | 5 | 1 | 0 | [Manufacturer](https://vkbsimcontrollers.com/products/gnx-kg12-add-on-grip-us) |
| [Modern Combat Grip Ultimate](../src/content/components/vkb/mcg-ultimate-grip.yaml) | partial | 4 | 1 | 0 | [Manufacturer](https://vkbsimcontrollers.com/products/mcg-ultimate-add-on-grip-for-gunfighter-mk-iv-us) |
| [Space Combat Grip (SCG) Premium (Left)](../src/content/components/vkb/scg-space-combat-grip-l.yaml) | complete | 5 | 0 | 0 | [Manufacturer](https://flightsimcontrols.com/product/scg-kosmosima-premium-stand-alone-grip-gladiator/) |
| [Space Combat Grip (SCG) Premium (Right)](../src/content/components/vkb/scg-space-combat-grip-r.yaml) | complete | 5 | 0 | 0 | [Manufacturer](https://flightsimcontrols.com/product/scg-kosmosima-premium-stand-alone-grip-gladiator/) |
| [GNX SEM Side Extension Module](../src/content/components/vkb/sem-side-extension-module.yaml) | partial | 4 | 1 | 0 | [Manufacturer](https://vkbsimcontrollers.com/products/gnx-sem-side-extension-module-us) |
| [STECS Modern Throttle System Mk.II Max](../src/content/components/vkb/stecs-throttle-max.yaml) | complete | 17 | 5 | 0 | [Manufacturer](https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-max-us) |
| [STECS Modern Throttle System Mk.II Mini](../src/content/components/vkb/stecs-throttle-mini.yaml) | partial | 8 | 3 | 0 | [Manufacturer](https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-mini-us) |
| [STECS Modern Throttle System Mk.II Standard](../src/content/components/vkb/stecs-throttle-standard.yaml) | complete | 15 | 5 | 0 | [Manufacturer](https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-standard-us) |
| [T-Rudder Mk.V Pedals](../src/content/components/vkb/t-rudder-mk5.yaml) | complete | 1 | 0 | 0 | [Manufacturer](https://vkbsimcontrollers.com/products/t-rudders-mk-v-rudder-pedals-us) |
| [Cyber Taurus Force Feedback Flight Stick Base](../src/content/components/winctrl/cyber-taurus-base.yaml) | complete | 1 | 0 | 0 | [Manufacturer](https://eu.winctrl.com/static/download/QmPeEHsVbPU2BfDBwXPwzQwoVGrafx6ZsvGdxBVS5WGF8b?filename=WINCTRL+Cyber+Taurus+Joystick+Base+User+Manual+20260430.pdf) |
| [F-16EX Viper Grip](../src/content/components/winctrl/f16-ex-viper-grip.yaml) | partial | 6 | 3 | 0 | [Manufacturer](https://eu.winctrl.com/view/goods-details.html?id=341) |
| [F-16 Integrated Control Panel Module](../src/content/components/winctrl/f16-icp-module.yaml) | complete | 5 | 4 | 0 | [Manufacturer](https://eu.winctrl.com/view/goods-details.html?id=544) |
| [WinCtrl FA-18 Hornet Replica Grip](../src/content/components/winctrl/f18-hornet-grip.yaml) | partial | 5 | 0 | 0 | [Manufacturer](https://eu.winctrl.com/view/goods-details.html?id=314) |
| [Orion 2 Joystick Base](../src/content/components/winctrl/orion-2-base.yaml) | partial | 0 | 0 | 0 | [Manufacturer](https://eu.winctrl.com/view/goods-details.html?id=333) |
| [Orion 2 F-16 Viper Throttle](../src/content/components/winctrl/orion-2-f16-throttle.yaml) | partial | 7 | 2 | 0 | [Manufacturer](https://eu.winctrl.com/view/goods-details.html?id=1765) |
| [Orion 2 FA-18 Dual Throttle Handles](../src/content/components/winctrl/orion-2-f18-throttle.yaml) | partial | 0 | 0 | 0 | [Manufacturer](https://eu.winctrl.com/view/goods-details.html?id=375) |
| [PFP3 Programmable Flight Panel Module](../src/content/components/winctrl/pfp3-cockpit-module.yaml) | partial | 0 | 0 | 0 | [Manufacturer](https://eu.winctrl.com/view/goods-details.html?id=1065) |
| [Skywalker Rudder Pedals](../src/content/components/winctrl/skywalker-rudder-pedals.yaml) | complete | 2 | 0 | 0 | [Manufacturer](https://eu.winctrl.com/view/goods-details.html?id=543) |
| [Ursa Minor Airline Joystick Left](../src/content/components/winctrl/ursa-minor-airline-joystick-l.yaml) | partial | 4 | 2 | 0 | [Manufacturer](https://eu.winctrl.com/static/download/QmTNG9wYC7V5h4a5U4m2ZbYY55uag2c3wQc2MUw9m7KXHK?filename=URSA+MINOR-Airlines-Joystick+L-User+Manual-V1.3.pdf) |
| [Ursa Minor Fighter Joystick Right](../src/content/components/winctrl/ursa-minor-fighter-joystick-r.yaml) | partial | 5 | 2 | 0 | [Manufacturer](https://eu.winctrl.com/static/download/QmTvHcYNoR17Ro8AHmA7j6jpqwnHHbaYWS8dXGxM8QbTgh?filename=URSA+MINOR-Fighter-Joystick+R-User+Manual+V1.3+20250708.pdf) |
