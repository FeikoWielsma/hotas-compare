# VKB controls review corrections (2026-10-19)

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.

Reviewed against first-party VKB US product listings and the VKB FSC Europe SCG Premium listing. Counts below are installed physical controls for the named variant; logical firmware mappings, replacement modules, and interchangeable detent profiles are not simultaneous controls.

## SCG Space Combat Grip Premium (left and right)

The [VKB FSC Europe Premium listing](https://flightsimcontrols.com/product/scg-kosmosima-premium-stand-alone-grip-gladiator/) states dual-action main trigger, rapid-fire trigger, three center-push hats, three buttons, and one center-push analog ministick. It lists C1 button and A1 hat modules as extra contents; therefore neither adds an installed control, and current YAML button count is 3. Prior note/YAML count 4 incorrectly counted the spare C1 module. The page does not define rapid-fire trigger stages or analog-stick directional emulation; no logical 8-way count is asserted. Complete for listed grip controls. Product variant is Premium L/R, grip only; the United States SKU may have different configuration/marketing, so this inventory follows the exact FSC Europe variant source.

## GNX SEM Side Extension Module

The [VKB US GNX SEM listing](https://vkbsimcontrollers.com/products/gnx-sem-side-extension-module-us) identifies one rotary switch, two multifunction axes, two K-switches each with central push, and seven push buttons. Corrected standalone button count is 7; K-switch pushes remain integrated with their parent switches and are not counted as standalone buttons. I visually inspected the first-party [SEM product photo](https://vkbsimcontrollers.com/cdn/shop/files/14_SEM_4SH_750_1_2.webp?v=1769865326&width=416): it shows two installed K-switch heads with central push caps, but does not establish their electrical position count or momentary/latching behavior. Those properties remain unknown. The page distinguishes configurable outputs of 24 logical buttons or 17 buttons plus two analog axes from physical inventory. Multifunction axis functions and rotary position count are unspecified. Partial. The schema cannot express a K-switch integrated push or a multi-function axis cleanly.

## STECS Modern Throttle System Mk.II Mini

The [VKB US Mk.II Mini listing](https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-mini-us) enumerates MTG-L (two buttons, two triggers, two wheel encoders), MTG-R (four buttons, two triggers, two center-push 4-way hats, a 2-axis center-push ministick, analog wheel axis), and base (two analog axes, two buttons, five-position rotary switch). It ships one detent frame and several alternative profiles. One main throttle lever is recorded, but the page does not clearly reconcile the two base analog axes with the lever and separately listed grip wheel; coverage is partial and allocation remains unresolved. No detent count is asserted. Exact Mk.II; legacy STECS product names can refer to a different layout.

## STECS Modern Throttle System Mk.II Standard

The [VKB US Mk.II Standard listing](https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-standard-us) confirms two main levers; MTG-L/R grip inputs and two wheel encoders; base controls; and STEM inventory. STEM is specifically eight standalone buttons, two K-switches with central pushes, two encoders with central pushes, one self-centering three-position flip switch, and one other three-position flip switch. YAML now keeps the two flip-switch families separate, records two main levers, and counts eight STEM standalone buttons (not ten). Detent frames and interchangeable profiles are configuration parts; previous count five incorrectly treated spare frames as installed detents and has been removed. Complete for enumerated physical controls; unspecified switch behavior and encoder behavior remain unknown.

## STECS Modern Throttle System Mk.II Max

The [VKB US Mk.II Max listing](https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-max-us) describes Standard inventory plus ATEM. Saved entry now explicitly names Mk.II and counts two main levers; STEM eight standalone buttons and K-switch integrated pushes are distinguished; replacement modules/detent profiles are not extra installed controls. ATEM has four ordinary buttons, two safety-lid protected buttons, and one 4-way directional rotary encoder with central push. Complete for listed physical inventory; unspecified grip encoder push and flip-switch behavior stay unknown. No detent count is asserted.

## T-Rudder Mk.V

The [VKB US Mk.V listing](https://vkbsimcontrollers.com/products/t-rudders-mk-v-rudder-pedals-us) and [VKB FSC Europe Mk.V listing](https://flightsimcontrols.com/product/vkb-sim-t-rudder-pedals-mk-v/) support one analog rudder/Z axis and explicitly no toe brakes. No separate buttons or switches are documented. Complete. Schema currently represents the pedal axis with a generic analog lever because it has no pedal-axis control type.

## Schema and residual limitations

Toggle controls have no integrated-push field, so SEM/STECS K-switch center pushes are explained in labels/notes but not separately countable in structured control facts. Multifunction SEM axes cannot be expressed as such. Generic lever represents the pedal axis. The generic encoder cannot encode directional count for ATEM's 4-way encoder. STECS Mini's advertised two base axes remain unallocated because the primary page does not resolve their relation to named controls. No unsupported fields were added.
