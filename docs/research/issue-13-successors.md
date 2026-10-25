# Discontinued successor audit

Checked 2026-10-25. Audited all five records with `status: discontinued`.

- `virpil/mongoost-50cm3-throttle`: added `virpil/mongoost-50cm4-throttle`. The [manufacturer's CM4 listing](https://virpil-controls.eu/mongoost-50cm4-throttle.html), Details section, describes the updated MongoosT-50 throttle with new handles on the familiar base. This is the successor requested in #13. The separate CM3 **flightstick base** remains current and unchanged.
- `slaw/viper-v2-rudder-pedals`: added `slaw/rx-viper-v3-rudder-pedals`. The [V3 manufacturer listing](https://slawdevice.com/en/glowna/45-pre-order-rx-viper-v3-rudder-pedals-dark-metalic.html), assembly paragraph, explicitly calls RX Viper V2 the previous generation. V3 is `current` in the catalog; the store currently says unavailable, which does not establish discontinuation.
- `logitech/extreme-3d-pro` and `logitech/flight-instrument-panel`: no unambiguous current successor identified in this catalog. Left without successor, visible by default.
- `winctrl/super-libra-navyace-joystick`: no unambiguous current replacement bundle identified. Left without successor rather than treating a different grip/base combination as a confirmed replacement.

`successor` uses the globally unique catalog ID across both collections. Runtime catalog loading and the offline content integrity test reject missing, self-referencing, and non-current targets. Discontinued items with no successor stay visible; the toggle specifically restores superseded discontinued items.
