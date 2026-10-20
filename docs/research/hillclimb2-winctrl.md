# WINCTRL hillclimb — catalog expansion

Checked 2026-10-20. Scope: `src/content/components/winctrl/*.yaml`, `src/content/bundles/winctrl/*.yaml`, and `public/images/winctrl/`.

Sources: EU store `https://eu.winctrl.com/home/list/get` and `https://eu.winctrl.com/home/shop/get` (including `all=1` for the default bill of materials), the download-center POST `https://eu.winctrl.com/home/download/selectProductDownload` with `typeId` 4, and the manuals those calls return. The US store host that resolves is `us.winwingsim.com`. `us.winctrl.com` did not resolve. A list price of 999999.00 is treated as not for sale and is not stored.

A value is written only when an official page, bill of materials, or manual states it. Diagram index numbers were not turned into control counts.

## Identity decisions

- `winctrl/pfp3-cockpit-module` is goods 1065, Panel of Auto Pilot 3. PFP-3N is goods 965 and is a separate record, as are PFP-4 (1005) and PFP-7 (985). Those three manuals give size and mass but no key counts, so their control lists stay empty.
- `winctrl/cyber-taurus-base` is now chassis CT.JB.E.B.29.MET.1 (goods 5205). E.B.82 and E.D.16 are separate files. The GB listing of E.B.29 uses the same goods code and is not a second chassis. The dimension table on manual page 9 is length × width × height: E.D.16 320×166×342 mm, 17.5 kg; E.B.29 267×166×342 mm, 11.5 kg; E.B.82 320×166×342 mm, 18.5 kg. Pitch and roll are ±15° on all three.
- `winctrl/orion-2-f18-throttle` is the NavyAce Metal Throttle Grip (goods 306, TGRIP-18). Goods 375 is the NavyAce throttle combo, stored as a bundle. The grip inventory is the product-page bullet list. The page says the box contains a left and a right grip.
- `winctrl/orion-2-f16-throttle` remains ViperAce Throttle Grip Metal 2.0. The older ViperAce EX throttle grip (goods 339) is `viperace-ex-throttle-grip`. The ViperAce EX throttle combo (goods 342) defaults to the 2.0 grip plus the Orion 2 throttle base, so the bundle uses those two components.
- `winctrl/skywalker-rudder-pedals` remains the file id for goods 543, Orion Metal Flight Rudder Pedals (Standard Edition), goods code R1X1, €286.61. Orion 32 (O.32.R.MET.1, goods 1705) is a different pedal: different manual, travel, and size.
- Damper versus standard is separate hardware for both Orion families. Orion 32 with damper is goods 1845 (O.32.R.MET.DAM.1). R1 with damper is goods 546. The damper kit sold alone stays out of the catalog.
- Combat Throttle Metal.EX (goods 2005) is a bundle of the Metal 1.0 throttle and the EX panel. The listed price equals the sum of those two goods, and the download center attaches both manuals. The goods code is a single code, U.COMBAT.T.MET.EX.1, not an ampersand bill of materials.
- Configurable listings get one bundle for the default `goods_no` from `shop/get?all=1`. Selectable grips, finger lifts, and the 10th-anniversary throttle base are not exploded into extra bundles. The 10th-anniversary base uses the same Throttle Base II manual; no hardware difference is stated.
- Combat HOTAS goods 6485 is recorded as the shop default, SKU 4961: Fighter R plus Combat Throttle Metal 1.0 at €229.28. SKU 4981 is the same joystick plus the EX throttle at €278.67 EU / $290.27 US. That US figure is the EX configuration, so it is not stored on the default bundle.

## Rudder pedals

| Record | Goods | EU price | Axes | Sensor | Size / mass |
| --- | --- | --- | --- | --- | --- |
| `cyber-taurus-32-rudder-pedals-eb192` | 2825, CT.32.R.E.B.192.MET.E.1 | €521.09 | rudder + two toe brakes | not stated | 438×546×320 mm, 12 kg |
| `cyber-taurus-32-rudder-pedals-eb530` | 2945, CT.32.R.E.B.530.MET.E.1 | €625.31 | same | not stated | same size, 15.5 kg |
| `cyber-taurus-combat-rudder-pedals-eb192` | 2585, CT.F.R.E.B.192.MET.E.1 | €521.09 | same | not stated | 438×544×227 mm, 12 kg |
| `cyber-taurus-combat-rudder-pedals-eb530` | 2705, CT.F.R.E.B.530.MET.E.1 | €625.31 | same | not stated | same size, 15.5 kg |
| `skywalker-rudder-pedals` | 543, R1X1 | €286.61 | yaw 38° + two pedal-pitch axes | Hall | 542×320×224 mm, 8.4 kg from the shared R1+DAMPER1 manual |
| `orion-metal-rudder-pedals-damper` | 546 | €325.02 | yaw 38° + two 30° pedal-pitch axes | not restated beyond the shared manual | same published size and 8.4 kg |
| `orion-32-rudder-pedals` | 1705, O.32.R.MET.1 | €286.61 | main shaft 76° + two 15° brakes | Hall on both pedals and the main axis | drawing 546×333×318 mm, 8.0 kg |
| `orion-32-rudder-pedals-damper` | 1845, O.32.R.MET.DAM.1 | €325.02 | same | Hall | same drawing size; 8.0 kg is not copied onto the damper SKU |

All four Cyber listings showed `total_stock` 0 on 2026-10-20. Their pages include a generic pre-order FAQ. The saved page text does not print an ETA, so none is stored.

Cyber 32 and Combat differ in height and in the bearing mix (32-series 12 rolling + 8 sliding + 4 spherical; Combat 16 rolling + 4 sliding + 4 spherical). Within each family, 192 and 530 share geometry and differ in motor force and mass (main-shaft force 19 kg versus 53 kg). All four share one manual. The drawing shows ±38° spindle travel; a table cell prints "38 mm". Degrees are used. Hall is not stated for the Cyber pedals. USB-B, 48 V DC, HID, SimApp Pro, and one power button are stated.

The Orion 32 caption prints 54 mm on the long side and the page header says "3M.PDC 1". The drawing's 546 mm is used. The standard Orion 32 manual says a damper can be bought separately.

## Conflicts left unresolved in the data

- URSA MINOR 32 throttle manual prints weight "1.3kg(1.1lb)". Weight is unset. Extra buttons at 0.3 mm have no count, so they are omitted and coverage stays partial.
- EFIS R prints length 15 mm next to width 103.2 mm. Dimensions are unset. EFIS L uses 158×103.2×75 mm.
- PFP-3N, PFP-4, PFP-7, and MCDU 32 publish 228×146×28.5 mm and 0.47 kg, and different travel for line-select keys versus the keypad, but no key counts.
- ViperAce EX throttle grip button positions are a drawing without a counted legend.
- StrikeAce E versus EX II counts come from the product pages. The shared 15E/15EX manual drawing does not separate the two.
- Fighter, Space, and Airline stick hat way-counts and trigger stages are on drawings. Those records stay partial and do not copy the right-hand Fighter inventory onto the other hands.
- Goods 314's current list title is "Super Taurus/Super Libra HOTAS" while `goods_no` is JGRIP-F18. The existing F/A-18 grip inventory was not replaced. Listing 6605, "NavyAce Metal Joystick Grip", also uses JGRIP-F18 at €164.09 and has an empty description, so that price was not attached.

## Not cataloged

Desk mounts, panel mounts, finger lifts, extension rods, the dual-throttle connector (goods 381), the damper kit, the ViperAce EX shaker kit, and quantity packs (MFD x3, display x3) are accessories or packs, not distinct components. Listings priced 999999.00, including Super Libra, the Super Taurus throttle base, and the original PTO, were not given records. Gemini, KA-50, the 3X0 grip, and PCR have manuals but no new records in this pass. Console support is left unknown wherever a page only establishes USB or SimApp Pro on a computer.
