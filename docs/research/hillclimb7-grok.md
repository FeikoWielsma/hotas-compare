# Hillclimb 7 — grok (prices)

Checked 2026-10-21. Scope was the round 7 gaps in `work/price-gaps-r7.txt` for Thrustmaster, Honeycomb, MOZA, VIRPIL, and Logitech components and bundles. A price was written only when the official regional shop and the matching first-party product page stated the same amount for that SKU. `honeycombaerospace.com` does not resolve. Honeycomb prices below are from the live Honeycomb Aeronautical shops `eu.flyhoneycomb.com` (EUR) and `flyhoneycomb.com` (USD).

## Changed

| Product | Field | Value | Source |
| --- | --- | --- | --- |
| Echo Aviation Controller | prices.EU / prices.US | EUR 149.99, USD 149.99. One variant, SKU HC003981, no compare-at price. The shop product JSON is the product page. | [EU shop](https://eu.flyhoneycomb.com/products/echo-aviation-controller), [US shop](https://flyhoneycomb.com/products/echo-aviation-controller) |
| VPC VMAX Prime Throttle | prices.UK / prices.US | GBP 449.95, USD 499.95. SKU VPC-203. `product:price:amount` matches the displayed final price on each shop. | [UK shop](https://virpil-controls.co.uk/vpc-vmax-prime-throttle.html), [US shop](https://virpil-controls.us.com/vpc-vmax-prime-throttle.html) |
| Viper TQS Mission Pack | prices.EU / prices.UK / prices.US | EUR 499.99, GBP 449.99, USD 599.99. SKU 4060254. NL, UK, and US product-page sticky prices match the shop `product:price:amount`. The NL buy button opens the NL shop, which is the same EUR 499.99 as the EU shop. `shop.thrustmaster.com/en_us` 404s; the US product buy button opens the US eshop. | [EU shop](https://shop.thrustmaster.com/en_eu/viper-tqs-mission-pack.html), [NL shop](https://shop.thrustmaster.com/nl_nl/viper-tqs-mission-pack.html), [UK shop](https://shop.thrustmaster.com/en_gb/viper-tqs-mission-pack.html), [US eshop](https://eshop.thrustmaster.com/en_us/viper-tqs-mission-pack.html) |

## Stays unset

- **Honeycomb UK prices** (Alpha Lite, Bravo Lite, Echo, Foxtrot stick, Sierra, Captain's Bundle, Foxtrot Takeoff Kit). `honeycombaerospace.com` and `uk.flyhoneycomb.com` do not resolve. `eu.flyhoneycomb.com` lists United Kingdom in the country selector with currency EUR, the same EUR amounts as the EU shop. That is not a GBP price, so it was not copied. `flyhoneycomb.com` is USD only.
- **Captain's Bundle prices.US.** `flyhoneycomb.com/products/captains-bundle` is 404, and the US product index has no Captain's Bundle. The EU shop still lists SKU HC004148 at EUR 799.99, which matches the price already stored.
- **Foxtrot Throttle Box, all regions.** `foxtrot-throttle-box` is 404 on both Honeycomb shops, and the US product index has no standalone throttle box. The Takeoff Kit price (SKU HC004018, EUR/USD 179.99) was not copied onto the throttle.
- **MOZA AB6 Force Feedback Base, all regions.** Shop search on `mozaracing.com`, `eu.mozaracing.com`, `uk.mozaracing.com`, and `us.mozaracing.com` returns `ab6-bundle` (MOZA AB6 Flight Simulator, which includes the MHG grip) and no base-only SKU. Bundle prices were not copied.
- **AB9 + MH16 Flight Combo, all regions.** The same shops return `ab9-base` and `mh16-flightstick` as separate products. No combo SKU.
- **TCA Sidestick X prices.UK.** UK product sticky price is GBP 99.99. The UK shop `product:price:amount` is GBP 89.99 (SKU 4460219). Left unset. [UK product](https://www.thrustmaster.com/en-gb/products/tca-sidestick-x-airbus-edition/), [UK shop](https://shop.thrustmaster.com/en_gb/tca-sidestick-x-airbus-edition.html).
- **Sol-R 2 HOSAS prices.UK.** UK product sticky price is GBP 299.99. The UK shop amount is GBP 269.99 (SKU 2960939). Left unset. [UK product](https://www.thrustmaster.com/en-gb/products/sol-r-2-hosas-space-sim-duo/), [UK shop](https://shop.thrustmaster.com/en_gb/sol-r-2-hosas.html).
- **TCA Captain Pack X prices.UK.** UK product sticky price is GBP 249.99. The UK shop amount is GBP 199.99 (SKU 4460217). Left unset. [UK product](https://www.thrustmaster.com/en-gb/products/tca-captain-pack-x-airbus-edition/), [UK shop](https://shop.thrustmaster.com/en_gb/tca-captain-pack-x-airbus-edition.html).
- **Logitech Extreme 3D Pro prices.EU / prices.UK.** Shop PDPs 404 on `en-gb`, `de-de`, `en-eu`, and `fr-fr`. The GB and DE flight-gear collections do not list it, and site search does not return it. The US shop still sells SKU 963290-0403, so the product was not marked discontinued. [US shop](https://www.logitechg.com/en-us/shop/p/extreme-3d-pro-joystick), [GB flight gear](https://www.logitechg.com/en-gb/shop/sim/flight-gear).

## Skipped

- **VPC MongoosT-50CM3 Throttle.** Catalog status is `discontinued`. `vpc-mongoost-50cm3-throttle.html` is 404 on `virpil-controls.eu`, `.co.uk`, and `.us.com`. The B-stock page still resolves and was not used.
- **Constellation Alpha Prime and WarBRD-D HOTAS.** No shop SKU. `alpha-prime-warbrd-d-hotas` is 404 on all three VIRPIL shops. EU search returns the CADET HOTAS bundle and the HOSAS bundle, which are different component sets. Prices stay empty.

## Not in the gap list

- **VMAX Prime prices.EU.** The stored amount is EUR 399.95 (verified 2026-10-19). The EU shop `product:price:amount` for SKU VPC-203 is now EUR 429.95. Left unchanged because EU was not a gap for this product. [EU shop](https://virpil-controls.eu/vpc-vmax-prime-throttle.html).
