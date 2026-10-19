# Logitech / Saitek physical control inventory research (2026-10-19)

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.

Research uses Logitech product pages and Logitech-hosted manuals, plus an official Saitek-hosted product article for legacy Pro Flight units. Coverage is about the physical controls, not firmware binding totals.

## Findings

- **Extreme 3D Pro** — Partial. Logitech [product page](https://www.logitechg.com/en-us/shop/p/extreme-3d-pro-joystick) lists 12 programmable buttons, an 8-way hat, rapid-fire trigger, and twist rudder. It does not clarify whether the trigger is included in 12 or expose a reliable physical split. YAML records the trigger and hat, and omits an unsupported standalone button count; the marketing aggregate is explained in evidence notes.
- **G Pro Flight Rudder Pedals** — Complete. Logitech [product page](https://www.logitechg.com/en-us/shop/p/flight-simulator-rudder-pedals.945-000024) identifies rudder and independently controlled left/right toe brakes, represented as axes.
- **G Pro Flight Throttle Quadrant** — Complete from product-specific [official Saitek documentation](https://origin-saitek2.logitech.com/uk/blog/wp-content/uploads/2014/08/07-14.pdf). Three detachable analog levers each have a bottom detent/button action, represented with lever `push: true` and detents; six base buttons are separately listed.
- **G Flight Yoke System — Yoke component** — Complete from the same [official Saitek documentation](https://origin-saitek2.logitech.com/uk/blog/wp-content/uploads/2014/08/07-14.pdf): 8-way POV, three two-way rocker controls, two buttons, three-position mode selector.
- **X52 Pro Flight Stick / X52 Space Flight Stick** — Partial. Logitech [X52 Pro manual](https://www.logitech.com/assets/65327/x52-professional-hotas.pdf) shows trigger, hats, pinkie and mode controls. Exact standard model revisions and a complete physical split remain unclear.
- **X52 Pro Throttle / X52 Throttle** — Partial. The same manual documents throttle detents, scroll wheel with integrated press, thumb slider, rotary axes, hat, mouse controller, left mouse button and clutch. Standard variant differences and alternate mouse-controller mode remain caveated.
- **X56 Rhino Stick** — Complete for mapped physical input families from [Logitech X56 manual](https://www.logitech.com/assets/65324/x56-hotas.pdf), including trigger, controls, two hats and pressable ministick.
- **X56 Rhino Throttle** — Complete for established input families from [Logitech X56 manual](https://www.logitech.com/assets/65324/x56-hotas.pdf): dual throttles, hats, button, pressable ministick, slider, toggles and four analog rotary axes. Manual depiction of inset rotary buttons is ambiguous, so button count remains omitted. Schema supports rotary push when evidence establishes it; it is not claimed here.

## Schema notes and unresolved details

The schema can represent lever-coupled button actions with lever `push: true` and rotary push actions with `push: true`; claims that these cannot be represented were incorrect and have been removed. Extreme 3D Pro's 12 programmable-button aggregate does not establish its standalone physical button count or trigger inclusion, so no count is entered. X52 variant and X56 inset-button uncertainties remain explicit. No schema extension is required for these cases.
