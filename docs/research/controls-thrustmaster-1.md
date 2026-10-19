# Thrustmaster physical control inventory (batch 1)

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.

Checked 2026-10-19 against official Thrustmaster product pages, support manuals, and official eShop pages. “Complete” means the physical input inventory was checked for the exact product variant; unknown optional properties such as a hat’s push capability remain omitted. Physical action totals are kept separate from firmware bindings and virtual events.

## AVA - Advanced Versatile Aviation Base — complete

The bare AVA Base is a two-axis base sold without a grip. Its rear button is a calibration/service control, not a flight button; the former two-button inventory was corrected to one calibration button. The official [AVA Base product page](https://www.thrustmaster.com/products/ava-base/) describes the base and its two axes; the [AVA user manual](https://ts.thrustmaster.com/download/accessories/Manuals/AVA_Base/AVA_Base_User_Manual.pdf) illustrates the rear calibration button. No grip controls are included in the inventory.

## Sol-R Space Flight Stick — partial

The [Sol-R 1 Flightstick product page](https://www.thrustmaster.com/en-us/products/sol-r-1-flightstick/) confirms a removable grip/base, two triggers (one dual-position), two hats, a ministick, thumbwheel and base throttle; it also advertises 44 assignable actions across grip and base. The grip controls and central throttle are recorded, but the 44-action figure is not treated as physical buttons. The official text does not specify hat directions or push behavior, the wheel’s analog/digital character, or the base’s standalone button-by-button count. Those remain unresolved; hat items are omitted because the schema silently defaults an unknown hat to four-way.

## T.Flight HOTAS One / 4 / X — partial; merged variants

The [HOTAS One manual](https://ts.thrustmaster.com/download/accessories/Manuals/TFHOne/T-Flight_HO_Manual.pdf) identifies a detachable throttle, a multidirectional hat, trigger, and tilting rudder control; the [official HOTAS One eShop page](https://shop.thrustmaster.com/en_gb/t-flight-hotas-one.html) lists 14 action buttons plus a rapid-fire trigger. The YAML groups One, 4 and X, which have differing button layouts and console controls; the One manual cannot establish a single exact count for the merged record. Hat direction/push behavior and button counts by location remain unknown. The stick twist and tilting rudder are alternate ways to control rudder. Inventory is partial for this combined record.

## T.Flight Rudder Pedals (TFRP) — complete

The [TFRP manual](https://ts.thrustmaster.com/download/accessories/Manuals/TFRP/TFRP_User_Manual.pdf) confirms three calibrated axes: one rudder axis and two differential toe-brake axes. No buttons, hats, or hand-operated levers are described; the pedals themselves are foot-operated analog controls. The schema lacks a pedal control type, so the rudder is represented as an analog rocker and the two toe brakes as brake controls. Inventory is complete.

## T.16000M FCS Flight Stick — complete

The [official product page](https://www.thrustmaster.com/en-us/products/t-16000m-fcs/) confirms four axes, 16 action buttons, an 8-way PoV hat and ergonomic trigger. Its button total is represented physically as three grip buttons plus twelve base buttons plus the trigger; the previously listed base throttle slider is retained as an analog slider. Hat push behavior is not specified. The official page’s physical inventory is sufficient for complete coverage while leaving that property unknown.

## TCA Quadrant Airbus Edition — complete

The [quadrant manual](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_Quadrant/TCA_Quadrant_Airbus_Edition_user_manual.pdf) identifies two throttle axes, eight physical action buttons, engine selector, and four detents per axis. The [product page](https://www.thrustmaster.com/products/tca-quadrant-airbus-edition/) separately explains the eight physical plus eight virtual buttons. YAML records eight buttons and eight detents, not 16 physical buttons. Optional add-on modules are excluded. Inventory is complete for the standard quadrant.

## TCA Quadrant Boeing Edition — partial

The [official eShop page](https://shop.thrustmaster.com/en_eu/tca-quadrant-boeing-edition.html) specifies 17 action buttons and three magnetic axes; the [user manual](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_Quadrant_Boeing/TCA_Quadrant_Boeing_Edition_user_manual.pdf) diagrams the control panel and selectable engine pairing. Thrustmaster says four lever types are swappable across the three axes, so they are not four simultaneous levers. The [official Boeing launch article](https://www.thrustmaster.com/news/thrustmaster-teams-up-with-boeing-to-innovate-and-create-new-tca-peripherals-a-unique-experience-where-dreams-meet-reality/) confirms an autopilot encoder. Official accessible text does not settle encoder push behavior or the exact physical selector/encoder decomposition; coverage is partial.

## TCA Sidestick Airbus Edition — partial

The [official manual](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_Sidestick/TCA_Sidestick_AE_User_Manual.pdf) identifies a digital trigger, multidirectional PoV hat, twist rudder and built-in throttle; its diagram calls out 15 action buttons and a virtual button at the throttle’s first 20% for reverser. The [product page](https://www.thrustmaster.com/en-us/products/tca-sidestick-airbus-edition/) describes four swappable head button modules and claims 17 action buttons. These totals disagree and do not resolve standalone physical buttons by installed module; the four included modules are configuration alternatives, not four simultaneously installed controls. Hat direction/push and discrete button count remain unresolved. The virtual reverser event is not counted as a physical button. Coverage is partial.

## Schema limitations

- There is no pedal-specific type; the TFRP brake pedals use the `lever` brake category, with a note explaining they are foot pedals.
- Hat direction count has a default of four, so unknown direction counts cannot be represented as Unknown; undocumented hats are omitted and called out in evidence notes.
- There is no explicit calibration/service control type. The AVA rear calibration button is represented as a button with a note that it is not a flight-binding input.
- The schema cannot express alternative fitted lever modules or separate virtual binding events from physical actions beyond notes. Research notes preserve these distinctions.
