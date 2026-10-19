# Honeycomb and Logitech control inventory correction review

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.

Checked 2026-10-19. This review addresses saved control data and prior research-note claims against product-specific first-party source pages/manuals and the current control schema.

## Corrections

- **Extreme 3D Pro:** Removed the unsupported group claiming 12 standalone grip buttons, including a separately listed trigger. The [Logitech product page](https://www.logitechg.com/en-us/shop/p/extreme-3d-pro-joystick) separately mentions “12 programmable buttons” and a rapid-fire trigger but does not resolve whether trigger is included in the aggregate or show a count/split in accessible text. YAML records the trigger separately and notes the uncertainty; coverage is partial.
- **Alpha full-size and XPC:** Replaced the two-hat/eight-button interpretation with the exact left/right callouts on Honeycomb’s [Alpha page](https://flyhoneycomb.com/products/alpha-flight-controls) and [XPC page](https://flyhoneycomb.com/products/alpha-flight-controls-xpc): one left POV hat, four rockers, two buttons per handle. The same pages' general prose contradicts those callouts by saying each handle has a hat and three buttons plus PTT. That conflict and PTT inclusion remain unresolved. Removed the fabricated four-toggle panel count: product text names four switch functions but provides no reliable physical count/mechanism. Coverage remains partial.
- **Ignition selector:** Encoded the five-position ignition as `type: rotary`, `mode: selector`, `positions: 5`, matching available schema.
- **Coupled button inputs:** G Pro Flight throttle lever actions are represented with `push: true`; prior notes incorrectly claimed this was not expressible. Rotary push is also supported by schema where documented, though no new rotary push assertion was added without conclusive product evidence.

## Remaining uncertainty

The Alpha detailed callouts are more specific than broad prose, but the official source does not reconcile their disagreement. Button counts therefore follow the specific handle callouts, with the PTT ambiguity stated in `controls_evidence`. Alpha panel switch counts and mechanisms are omitted because names of functions alone do not establish their physical implementation. Logitech does not clarify the Extreme 3D Pro trigger's relationship to its 12-button marketing total or full physical button split. The relevant products remain partial where those unresolved points affect inventory completeness.

Schema review confirmed support for selector rotary position counts, rotary push, and lever push. These cases need no new schema fields.
