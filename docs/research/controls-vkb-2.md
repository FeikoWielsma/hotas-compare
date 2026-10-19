# VKB physical control inventory research (2026-10-19)

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.

Sources below are VKB product pages or VKB FSC Europe, VKB's European distributor. Counts describe installed physical controls for the named configuration; included replacement caps/modules and firmware-generated logical inputs are not additional hardware.

## SCG Space Combat Grip (Premium, left and right)

Both handed variants use the same Premium inventory: dual-action main trigger (two sequential stages), separate rapid-fire trigger (stage count not specified by source), three 4-way center-push hats, one 8-way analog ministick with center push, and four programmable buttons. The spare C1 button and A1 hat modules in the box are replacements for installed modules. The initial inventory omitted the fourth button and assigned unsupported detail to the secondary trigger; those are corrected. [VKB FSC Europe SCG Premium listing](https://flightsimcontrols.com/product/scg-kosmosima-premium-stand-alone-grip-gladiator/). Complete for the grip's stated physical controls; grip-only, not a base inventory.

## GNX SEM Side Extension Module

The official page lists one rotary switch, two multifunction axes, two K-switches each with a central push button, and seven push buttons. Recorded two analog levers, two 3-position toggles (K-switch action/positions are unclear), nine push buttons including the central pushes, and one discrete selector with unknown positions. The 24 logical button / 17 logical button plus two axis modes are configuration-dependent outputs, not physical control counts. Exact axis functions and K-switch momentary/latching behavior remain unclear, so coverage is partial. [VKB SEM product listing](https://vkbsimcontrollers.com/products/gnx-sem-side-extension-module-us).

## STECS Modern Throttle System Mk.II Mini

The bundle has MTG-L and MTG-R grips and the base. The sources enumerate two MTG-L wheel encoders, two MTG-L buttons, two MTG-L triggers; MTG-R has four buttons, two 4-way center-push hats, a 2-axis center-push ministick, one analog wheel axis, two triggers, plus a spare replacement ministick. The base specifies two analog axes, two buttons, and a five-position rotary switch; one detent frame and several interchangeable detent pieces ship in the box. Main lever is represented as one throttle lever. The listing does not allocate its stated two base axes against the explicitly listed analog wheel, so axis allocation is unresolved; coverage is partial. [VKB STECS Mini Mk.II listing](https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-mini-us).

## STECS Modern Throttle System Mk.II Standard

Includes dual throttle axes, MTG-L/R grips, base, and STEM. The right grip has 3 four-way center-push hats, one 2-axis center-push ministick, one analog wheel axis, one 2-way rocker with center push, two triggers and two buttons; its supplied three button/hat modules and OTS ministick are replacements, not simultaneous extras. Left grip has two triggers, two buttons, and two wheel encoders (push not specified). Base has two buttons and a five-position selector. STEM has eight buttons, two K-switches with central pushes, two push encoders, one self-centering three-position flip switch and one three-position flip switch. Five detent frames and interchangeable inserts ship with this Standard edition. Coverage complete for listed included hardware, with unspecified encoder push behavior and final switch latching behavior left unknown. [VKB STECS Standard Mk.II listing](https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-standard-us).

## STECS Modern Throttle System Mk.II Max

Includes the Standard grips/base plus STEM and ATEM. The right grip uses the Mk.II Max's three hats and one ministick as above. ATEM adds four buttons, two safety-lid protected buttons and one 4-way directional rotary encoder with central push. STEM and base match the Standard listing. The product package includes replacement button/hat/ministick modules and five detent frames; replacement modules are not double counted. Coverage complete for listed included hardware. Encoder action/push details for the two MTG-L wheel encoders remain unspecified. [VKB STECS Max Mk.II listing](https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-max-us).

## T-Rudder Mk.V

The exact Mk.V set provides one analog Z/rudder axis, and VKB explicitly states the pedals have no toe brakes. No buttons or switches are documented; the moving pedals are an axis, not separate switches. Complete. [VKB T-Rudder Mk.V listing](https://vkbsimcontrollers.com/products/t-rudders-mk-v-rudder-pedals-us); [VKB FSC Europe Mk.V listing](https://flightsimcontrols.com/product/vkb-sim-t-rudder-pedals-mk-v/).

## Schema limitations

The schema cannot directly express a multifunction two-axis SEM control, a pedal axis (the T-Rudder is represented with the generic analog lever type), a 4-way directional rotary encoder (the generic encoder type lacks direction count), or center push on a rocker/toggle without representing that press as an additional button. These cases are described in labels/notes and ambiguous properties are left unknown where possible.
