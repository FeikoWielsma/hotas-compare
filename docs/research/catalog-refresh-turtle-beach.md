# Turtle Beach catalog refresh (2026-10-20)

Checked first-party Turtle Beach product and support pages on 2026-10-20. Prices below are the live US storefront prices shown on that date; existing EU and UK observations retain their original verification dates.

## Added catalog entries

- [VelocityOne Flightstick II](https://www.turtlebeach.com/products/velocity-one-flight-stick-ii?Platform=Xbox): product page identifies Xbox Series X|S and Windows 10/11 compatibility, and separately states Xbox One compatibility in additional features. Listed at $149.99. The listing says preorder with anticipated shipment September 21, 2026; therefore status is recorded as `announced` even though the expected ship date is past. Its PC product page identifies dual analog levers, a thumbstick, a multi-function wheel, and a dual-encoder cockpit dial with a tri-position switch. The 38 programmable-input and 8-axis totals are not treated as physical subtype counts.
- [VelocityOne Dual Throttle](https://www.turtlebeach.com/products/velocity-one-dual-throttle): Windows PC direct USB support; Xbox use requires VelocityOne Flightstick II and its pass-through connection. Not compatible with Xbox Cloud streaming. Listed at $149.99. The page identifies two lockable throttle levers, a base lever, thumbstick, textured wheel, and rear scroll wheel. Its totals of 7 axes and 35 programmable inputs are not treated as physical subtype counts.
- [VelocityOne H.O.T.A.S.](https://www.turtlebeach.com/products/velocity-one-hotas?Platform=Xbox): official listing describes Xbox Series X|S and Windows 10/11 support, 73 programmable inputs and 15 axes, split as 38 inputs/8 axes for Flightstick II and 35 inputs/7 axes for Dual Throttle. Xbox connection uses throttle pass-through. Listed at $279.99 and marked preorder with anticipated shipment September 21, 2026, so status is `announced`.
- [VelocityOne Flightdeck](https://www.turtlebeach.com/products/velocity-one-flight-deck): Windows 10/11 PC compatibility; official page lists no console support. Listed at $429.99. The page identifies a stick-module gear lever, 3-position rotary dial, 39 stick-module buttons, and two lockable throttle levers. The [official Hangar customization guide](https://support.turtlebeach.com/articles/en_US/Knowledge/VelocityOne-Flightdeck-Customize-Controls-With-VelocityOne-Hangar-App) says the Flight Touch Display can have up to 13 configurable touch-button cells per page; these are not fixed physical button counts. The 139 programmable-function and 15-axis totals are not used to infer physical subtypes.

## Existing Turtle Beach entries

- [VelocityOne Flight](https://www.turtlebeach.com/products/velocity-one-flight): official page says Xbox and PC compatible; current US storefront price is $329.99 sale price (with $399.99 full price shown). Its product image was replaced with the actual Flight Universal Control System image from Turtle Beach's CDN, visually checked to show the yoke and throttle quadrant.
- [VelocityOne Rudder](https://www.turtlebeach.com/products/velocity-one-rudder): Windows 10/11 PC and Xbox One/Series X|S support. The page explicitly says Xbox use requires the Flight Universal Control System host. Current US price is $319.99.
- [VelocityOne Flightstick](https://www.turtlebeach.com/products/velocity-one-flight-stick): existing listing says Xbox/PC; the Turtle Beach product page remains source. Current US price retained as $139.99 and verification date refreshed.
- [VelocityOne Flight + Rudder bundle](https://www.turtlebeach.com/products/velocityone-flight-velocityone-rudder-bundle): Xbox and PC support is explicitly shown; Xbox rudder support runs through the Flight system. Current US bundle price is $647.99.

All console claims are limited to platforms explicitly named by Turtle Beach. PS5 is `unknown` for these products because the cited manufacturer pages do not establish PS5 compatibility. New product image files use official Turtle Beach Shopify CDN assets.

## Notes and uncertainties

- The preorder pages' anticipated ship date (September 21, 2026) precedes this research date. Since Turtle Beach still labels both items preorder, catalog status follows the live page state (`announced`) rather than inferring that shipment occurred.
- The Dual Throttle is a standalone USB peripheral for direct Windows PC connection. Xbox operation requires the explicitly named Flightstick II host device and pass-through; it is not compatible with Xbox Cloud streaming. Rudder-pedal Xbox operation likewise requires the Flight Universal Control System host.
- Physical controls were recorded only where first-party pages identify a control and count. Aggregate programmable-input/function totals were not converted into physical button, switch, or axis subtype counts.
- The schema file in the checkout at time of inspection did not include `platform_compatibility`; the parent task owner indicated they are adding that optional field. No shared schema/code was changed here.

Final integration: Published axis totals (Flightstick II 8, Dual Throttle 7, Flightdeck 15) use hardware.axis_count without inventing missing names. Flightdeck's 39 stick-module button functions are an aggregate and are not recorded as 39 grip push buttons. Gear lever analog behavior remains unknown.
