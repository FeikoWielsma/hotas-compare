# VKB physical control inventory research

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.

Rechecked 2026-10-19 against exact official VKB product listings. Counts describe physical installed controls, not programmable button totals.

## F-14 Combat Grip — partial

The exact [GNX F-14 listing](https://vkbsimcontrollers.com/products/gnx-f-14-add-on-grip-us) confirms a center-push hat but does not state its direction count, a dual-stage trigger, four programmable buttons, a spring-loaded DLC maneuver wheel, and a four-stage ammo selector with safety lock and push. It also names an Emergency Autopilot Disable trigger separately, but does not state its stages. The selector is represented with four positions and integral push; whether the safety lock creates another input is unknown. The hat's ways value is omitted from structured controls because schema defaults omitted ways to 4; coverage is partial. Twist is an axis. Do not transfer compatibility details from the separate Gunfighter Mk.III F-14 listing.

## Gladiator NXT EVO Base — complete

The exact [base-only listing](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-base-only-us) enumerates one auto-centering three-position switch, throttle wheel, rotary encoder and three buttons. Encoder push is unspecified; LEDs are indicators, not controls. Duplicate evidence metadata was removed. Complete for the bare EVO base.

## Gladiator NXT EVO Omni-Throttle Left — partial

The exact [US LH bundle listing](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-omni-throttle-left-hand-us) says the box includes SCG GNX Premium Grip, preinstalled OTA and EVO base. It itemizes three center-push 4-way hats, four programmable buttons, center-push 8-way analog ministick, rapid-fire trigger, C1 button module and A1 hat module. The C1 module is recorded as a separate button in addition to the four buttons. The extra A1 hat is documented but omitted from structured controls because no direction count is given and schema defaults omitted ways to 4. The [base-only listing](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-base-only-us) supports the base controls. Rapid-fire trigger input count and encoder push remain unknown; overall coverage is partial.

## Gunfighter Mk.IV Base — complete

The [base-only package listing](https://vkbsimcontrollers.com/products/gunfighter-mk-iv-base-only-us) excludes a grip and contains no standalone control input hardware. The empty controls list is complete for the bare base; grip controls belong to separately purchased grips.

## KG12 WWII Grip (GNX) — complete

The exact [GNX KG12 add-on listing](https://vkbsimcontrollers.com/products/gnx-kg12-add-on-grip-us), also matching the database image source, identifies one folding metal trigger, one pinky metal lever/button, one bomb-release button, one 8-way hat and one side button. Trigger stages and hat center-push are unspecified. The product's built-in twist adapter is an axis rather than a standalone discrete control. This exact GNX SKU is distinct from the older Gunfighter KG12 Gen.1 and the Gen.2 for Gunfighter Mk.III; those listings must not be used as its evidence.

## Modern Combat Grip Ultimate (RevC for Mk.IV) — partial

The exact [Mk.IV RevC listing](https://vkbsimcontrollers.com/products/mcg-ultimate-add-on-grip-for-gunfighter-mk-iv-us) specifies two slew ministick axes, two trimmer ministick axes, brake-lever axis, dual-stage main trigger, and a metal folding trigger with two-position sensor. It lists interchangeable mini-stick and hat modules and says 24–32 programmable buttons depending on installed hat module. Two ministick functions remain represented; the alternative hat module is not double-counted simultaneously, and no hat direction/push or standalone button count is inferred from a firmware total. The twist adapter is a selectable separate variant, not intrinsic to the base grip SKU. Coverage remains partial.

## Schema and remaining unknowns

Unknown hat direction counts cannot be represented because `ways` defaults to 4; these hats are described in notes and excluded from guessed structured mappings. The schema supports rotary selectors with position counts and push, lever push, trigger flip/bidirectional actions, and separate button/axis-like control types; no unsupported schema limitation is claimed. Remaining unknowns: F-14 hat ways and secondary-trigger stages/safety-lock semantics; Omni-Throttle A1 hat direction count, rapid-fire trigger inputs and encoder push; KG12 trigger stages and hat push; MCG exact installed hat module/button inventory and ministick push behavior.
