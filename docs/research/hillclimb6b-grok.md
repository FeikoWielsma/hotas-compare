# Hillclimb 6b — grok2 (Thrustmaster, Turtle Beach)

Checked 2026-10-21. Continued the partial items in `docs/research/hillclimb6-grok.md`. Manual diagrams were traced from the official PDFs under `work/grok/`, with crops in `work/grok2/`. A value was written only when the same official drawing or shop page stated it. Where a product-page sticky price and the shop `product:price:amount` disagreed, the price stayed unset.

## Changed

| Product | Field | Value | Source |
| --- | --- | --- | --- |
| TCA Quadrant Add-On Airbus | speed-brake controls | Replaced the 6-button aggregate with a thumbwheel (map 21) and one switch (map 22-26, positions unset) | [Add-on manual](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_Quadrant/TCA_Quadrant_Add-On_Airbus_Edition_user_manual.pdf), mapping printed p.6. Leader geometry: 21 ends at the thumbwheel, 22-26 ends on the adjacent lever. |
| T.Flight HOTAS NEO Ace Combat 8, both editions | rocker | Analog rudder rocker, PC map Slider 0 | [PS manual](https://ts.thrustmaster.com/download/accessories/Manuals/TFHNEO/T-Flight_Hotas_NEO_PS_user_manual.pdf) callout 17 and PC map printed p.23; [Xbox manual](https://ts.thrustmaster.com/download/accessories/Manuals/TFHNEO/T-Flight_Hotas_NEO_XBOX_user_manual.pdf) callout 18 and the same PC map |
| Viper Panel | landing-gear lever | One lever, mechanism otherwise unset | [Mission Pack manual](https://ts.thrustmaster.com/download/accessories/Manuals/Viper/Viper_Mission_Pack_User_Manual.pdf), features printed p.6 |
| Viper Panel | button 44 | One push button | Same manual, backlight section printed p.28 ("press buttons 37 and 44") |
| T.16000M FCS Flight Pack | prices.EU / prices.UK | EUR 239.99, GBP 199.99. Product-page sticky prices match the shop | [EU shop](https://shop.thrustmaster.com/en_eu/t-16000m-fcs-flight-pack.html), [UK shop](https://shop.thrustmaster.com/en_gb/t-16000m-fcs-flight-pack.html) |
| TCA Officer Pack Airbus | prices.EU / prices.UK | EUR 179.99, GBP 159.99. Sticky prices match the shop | [EU shop](https://shop.thrustmaster.com/en_eu/tca-officer-pack-airbus-edition.html), [UK shop](https://shop.thrustmaster.com/en_gb/tca-officer-pack-airbus-edition.html) |
| TCA Captain Pack X Airbus | prices.EU | EUR 299.99. NL sticky price matches the EU shop | [EU shop](https://shop.thrustmaster.com/en_eu/tca-captain-pack-x-airbus-edition.html) |
| HOTAS Warthog MKII | prices.US | USD 599.99. US product-page sticky price matches the eshop | [US eshop](https://eshop.thrustmaster.com/en_us/hotas-warthog-mkii.html) |
| HOTAS Warthog AVA Edition | prices.US | USD 659.99. Sticky price matches the eshop | [US eshop](https://eshop.thrustmaster.com/en_us/hotas-warthog-ava-edition.html) |
| Sol-R 4 HOTAS | prices.US | USD 349.99. Sticky price matches the eshop | [US eshop](https://eshop.thrustmaster.com/en_us/sol-r-4-hotas.html) |
| Sol-R 2 HOSAS | prices.US | USD 399.99. Sticky price matches the eshop | [US eshop](https://eshop.thrustmaster.com/en_us/sol-r-2-hosas.html) |
| VelocityOne H.O.T.A.S. | prices.EU / prices.UK | EUR 249.99, GBP 229.99 | [EU store](https://eu.turtlebeach.com/products/velocity-one-hotas), [UK store](https://uk.turtlebeach.com/products/velocity-one-hotas) |

## Stays unset

- **Quadrant Add-On switch 22-26 positions.** Five map numbers share one leader onto one drawn lever. The drawing does not show five detents, and a toggle in this catalog only goes to three positions, so the position count stays unset. Virtual buttons 27-31 stay off the physical list. Coverage stays partial.
- **Viper Panel 42-43 and 45-53.** On the Mode A raster, 42 and 43 are a pair of curved arrows, and 46-47, 50-51, and 52-53 are bracketed pairs. Leader endpoints moved between crops of the same drawing, so those bodies were not typed. Button 38 still meets the trim wheel. Panel backlighting is stated for the panel, not for each button. Programmable LEDs stay a display.
- **T.Flight HOTAS 4, HOTAS X, HOTAS One, HOTAS One MSFS.** English feature lists still say "multidirectional" hat and an action-button group. The HOTAS X PC preset diagram numbers buttons 1-12 and labels the hat "D-Pad" without a way count. Hat ways and the push-versus-switch split stay unset.
- **Both NEO editions, hat ways and the 16 buttons.** The PC map draws a four-arrow POV symbol and does not say 4-way or 8-way. Mini-stick center push is not numbered. Buttons 1-16 are not split into push versus switch. Console callouts differ by edition (PS CREATE/OPTIONS versus Xbox VIEW/MENU) and were not copied across. The map also names stick X/Y, mini-stick Rx/Ry, throttle Z, and twist RZ. The existing Hall-effect axis is already recorded as "Z (twist rudder)", which does not match that RZ label, so the axis names were not rewritten.
- **Both SKY YOKEs.** The Xbox/PC and PlayStation/PC product pages still have no control-manual PDF. Hat push, mini-stick click, and trim-wheel mechanism stay unset.
- **AIRBUS Add-On Grip.** The instruction sheet is an assembly diagram (drivers, USB, mounting), not a numbered control map. Trigger stages and the five button mechanisms stay unset. [Sheet](https://ts.thrustmaster.com/download/accessories/manuals/Airbus_grip/AIRBUS_GRIP_Instruction_Manual.pdf).
- **Warthog Dual Throttle panel switches.** Pages 3-4 still say two of the five panel 2-position switches are permanent, without naming which two. The numbered panel drawing and the function drawing (MIC, speedbrake, boat, China hat, pinky, and the others) do not mark momentary versus permanent. Momentary stays unset.
- **TCA Yoke Boeing 18 buttons.** The Xbox map (printed p.7) still names 18 buttons on separate leaders, and the feature drawing keeps them under callout 3. Push versus switch is not stated, so they stay one button count. Callout 10 is the landing-gear lever on the side of the base. The map's "Axis 1" leader meets a front-center slot, not that side lever, so the landing gear was not retyped as Axis 1. The manual's heavy-product mark says 3.8 kg, and the product page weight is still the conflicting figure, so weight stays unset.
- **TCA Sidestick and Sidestick X hat ways.** Both English feature lists say "multidirectional point of view" hat. The Sidestick map numbers the hat as a single input (2) and draws concentric rings, with no direction count and no center push.
- **TCA Sidestick X prices.UK.** UK product-page sticky price is GBP 99.99. The UK shop `product:price:amount` is GBP 89.99. Left unset. [UK product](https://www.thrustmaster.com/en-gb/products/tca-sidestick-x-airbus-edition/), [UK shop](https://shop.thrustmaster.com/en_gb/tca-sidestick-x-airbus-edition.html).
- **TCA Captain Pack X prices.UK.** UK product-page sticky price is GBP 249.99. The UK shop amount is GBP 199.99. Left unset.
- **Sol-R 2 prices.UK.** UK product-page sticky price is GBP 299.99. The UK shop amount is GBP 269.99. Left unset.
- **T.Flight Stick X platforms.** Still PC and PS3 on the eshop table. PS5 and Xbox stay `unknown`.
- **Turtle Beach PS5.** EU and UK VelocityOne H.O.T.A.S. tags are Flight Sim, PC, Wired, and Xbox. PlayStation on those pages is the headset navigation, so PS5 stays `unknown`.
- **Sensors.** The add-on manual, the T.Flight feature pages, and the Viper panel page do not name a sensor for the controls that were still blank. Those fields stay unset. No sensor was copied from a related SKU.
