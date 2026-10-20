# Hillclimb 7b — grok (price freshness)

Checked 2026-10-21. Scope: every stored EU, UK, and US price on Virpil, Thrustmaster, and MOZA components and bundles (331 prices on 112 products). A price was changed only when the official shop page for that region showed a SKU and a different final price. The amount written is the displayed final price (`product:price:amount` on Virpil and Thrustmaster; the Shopify variant price on MOZA). Sale regular prices are recorded here; the price schema has no notes field.

258 stored prices already matched the shop and were left as they were, including the verified date. Atlas deposit pages and removed pages were not edited.

## Changed

| Product | Field | Value | Source |
| --- | --- | --- | --- |
| VPC VMAX Prime Throttle | prices.EU | EUR 429.95. Was 399.95. SKU VPC-203. No sale price. | [EU shop](https://virpil-controls.eu/vpc-vmax-prime-throttle.html) |
| VPC CDT-Aeromax Throttle Lever Module | prices.UK / prices.US | GBP 14.95, USD 19.95. Were 16 and 15, with no URL. SKU VPC-632. Store set to the regional shop. | [UK](https://virpil-controls.co.uk/cdt-aeromax-throttle-module.html), [US](https://virpil-controls.us.com/cdt-aeromax-throttle-module.html) |
| VPC MongoosT-50CM3 Base | prices.UK / prices.US | GBP 349.95, USD 369.95. Were 282 and 346. SKU VPC-109-001. | [UK](https://virpil-controls.co.uk/vpc-mongoost-50cm3-base.html), [US](https://virpil-controls.us.com/vpc-mongoost-50cm3-base.html) |
| VPC ACE Interceptor Pedals | prices.UK | GBP 339.95. Was 334. SKU VPC-302-001. EU 299.95 still matches. | [UK](https://virpil-controls.co.uk/vpc-ace-interceptor-pedals.html) |
| VPC Universal Control Panel #1 | prices.UK / prices.US | GBP 259.95, USD 269.95. Were 202 and 248. SKU VPC-401. | [UK](https://virpil-controls.co.uk/vpc-control-panel-1.html), [US](https://virpil-controls.us.com/vpc-control-panel-1.html) |
| VPC Universal Control Panel #2 | prices.UK / prices.US | GBP 269.95, USD 279.95. Were 211 and 259. SKU VPC-402. | [UK](https://virpil-controls.co.uk/vpc-control-panel-2.html), [US](https://virpil-controls.us.com/vpc-control-panel-2.html) |
| VPC Rotor TCS Plus Base | prices.UK / prices.US | GBP 329.95, USD 349.95. Were 264 and 324. SKU VPC-112-001. | [UK](https://virpil-controls.co.uk/vpc-rotor-tcs-plus-base-upgraded.html), [US](https://virpil-controls.us.com/vpc-rotor-tcs-plus-base-upgraded.html) |
| VPC WarBRD-D Base | prices.UK / prices.US | GBP 239.95, USD 259.95. Were 210 and 249. SKU VPC-106-001. | [UK](https://virpil-controls.co.uk/vpc-warbrd-d-base.html), [US](https://virpil-controls.us.com/vpc-warbrd-d-base.html) |
| Constellation Alpha Prime HOSAS Bundle | prices.UK / prices.US | GBP 1062.16, USD 1096.16. Were 1012 and 1242. SKU VPC-106-001_009-01-HOSAS. Sale: regular GBP 1249.60 and USD 1289.60. EU stays 934.66, which is already the sale price (regular EUR 1099.60). | [UK](https://virpil-controls.co.uk/warbrd-d-hosas-bundle-alpha-prime-edition.html), [US](https://virpil-controls.us.com/warbrd-d-hosas-bundle-alpha-prime-edition.html), [EU](https://virpil-controls.eu/warbrd-d-hosas-bundle-alpha-prime-edition.html) |
| WarBRD-D CADET HOTAS Bundle – Alpha Prime Edition | prices.EU / prices.UK / prices.US | EUR 594.87, GBP 645.87, USD 679.87. Were the regular prices 699.85, 759.85, and 799.85. SKU VPC-106-001_009-01_202-001-HOTAS. The shop shows those regular prices as the old price. | [EU](https://virpil-controls.eu/warbrd-d-cadet-hotas-bundle-alpha-prime-edition.html), [UK](https://virpil-controls.co.uk/warbrd-d-cadet-hotas-bundle-alpha-prime-edition.html), [US](https://virpil-controls.us.com/warbrd-d-cadet-hotas-bundle-alpha-prime-edition.html) |
| AVA Base | prices.UK | GBP 249.99. Was 241. SKU 2960882. | [UK shop](https://shop.thrustmaster.com/en_gb/ava-base.html) |
| T.Flight Rudder Pedals (TFRP) | prices.EU / prices.UK | EUR 109.99, GBP 99.99. Were 120 and 103. SKU 2960764. | [EU](https://shop.thrustmaster.com/en_eu/t-flight-rudder-pedals.html), [UK](https://shop.thrustmaster.com/en_gb/t-flight-rudder-pedals.html) |
| TCA Quadrant Airbus Edition | prices.EU / prices.UK | EUR 109.99, GBP 99.99. Were 100 and 86. SKU 2960840. | [EU](https://shop.thrustmaster.com/en_eu/tca-quadrant-airbus-edition.html), [UK](https://shop.thrustmaster.com/en_gb/tca-quadrant-airbus-edition.html) |
| TCA Quadrant Boeing Edition | prices.EU / prices.UK | EUR 169.99, GBP 149.99. Were 150 and 129. SKU 4060219. | [EU](https://shop.thrustmaster.com/en_eu/tca-quadrant-boeing-edition.html), [UK](https://shop.thrustmaster.com/en_gb/tca-quadrant-boeing-edition.html) |
| TCA Sidestick Airbus Edition | prices.EU / prices.UK | EUR 69.99, GBP 44.99. Were 80 and 69. SKU 2960844. UK is on sale; regular price GBP 59.99. | [EU](https://shop.thrustmaster.com/en_eu/tca-sidestick-airbus-edition.html), [UK](https://shop.thrustmaster.com/en_gb/tca-sidestick-airbus-edition.html) |
| TCA Yoke Boeing Edition | prices.UK | GBP 349.99. Was 344. SKU 4460209. | [UK](https://shop.thrustmaster.com/en_gb/tca-yoke-boeing-edition.html) |
| TPR PENDUL_R Rudder Pedals | prices.UK | GBP 399.99. Was 473. SKU 2960809. On sale; regular price GBP 469.99. | [UK](https://shop.thrustmaster.com/en_gb/tpr-thrustmaster-pendular-rudder.html) |
| Viper Mission Pack BAP Panel | prices.UK | GBP 199.99. Was 198. SKU 4060255. | [UK](https://shop.thrustmaster.com/en_gb/viper-panel.html) |
| Viper TQS | prices.UK | GBP 299.99. Was 284. SKU 4060252. | [UK](https://shop.thrustmaster.com/en_gb/viper-tqs.html) |
| HOTAS Warthog Magnetic Flight Base | prices.EU / prices.UK | EUR 149.99, GBP 129.99. Were 120 and 103. SKU 2960846. | [EU](https://shop.thrustmaster.com/en_eu/hotas-magnetic-base.html), [UK](https://shop.thrustmaster.com/en_gb/hotas-magnetic-base.html) |
| HOTAS Warthog Dual Throttle | prices.EU / prices.UK | EUR 269.99, GBP 229.99. Were 250 and 215. SKU 2960739. | [EU](https://shop.thrustmaster.com/en_eu/hotas-warthog-dual-throttle.html), [UK](https://shop.thrustmaster.com/en_gb/hotas-warthog-dual-throttle.html) |
| HOTAS Warthog A-10C Flight Stick Grip | prices.EU / prices.UK | EUR 329.99, GBP 269.99. Were 180 and 155. SKU 2960738. The shop title is HOTAS WARTHOG FLIGHT STICK, the same page already used for the US price (USD 299.99, unchanged). | [EU](https://shop.thrustmaster.com/en_eu/hotas-warthog-flight-stick.html), [UK](https://shop.thrustmaster.com/en_gb/hotas-warthog-flight-stick.html) |
| T.16000M FCS HOTAS | prices.EU / prices.UK | EUR 149.99, GBP 99.99. Were 149 and 129. SKU 2960778. UK is on sale; regular price GBP 129.99. | [EU](https://shop.thrustmaster.com/en_eu/t-16000m-fcs-hotas.html), [UK](https://shop.thrustmaster.com/en_gb/t-16000m-fcs-hotas.html) |
| T.16000M FCS Space Sim Duo | prices.EU / prices.UK | EUR 114.99, GBP 109.99. Were 130 and 112. SKU 2960815. | [EU](https://shop.thrustmaster.com/en_eu/t-16000m-fcs-space-sim-duo.html), [UK](https://shop.thrustmaster.com/en_gb/t-16000m-fcs-space-sim-duo.html) |
| Sol-R 1 Flightstick | prices.UK / prices.US | GBP 129.99, USD 199.99. Were 112 and 140. SKU 2960920. The shop slug is `sol-r-1-flighstick` (no second t). UK is on sale; regular price GBP 159.99. EU stays EUR 179.99, which matches the EU shop. | [UK](https://shop.thrustmaster.com/en_gb/sol-r-1-flighstick.html), [US](https://eshop.thrustmaster.com/en_us/sol-r-1-flighstick.html), [EU](https://shop.thrustmaster.com/en_eu/sol-r-1-flighstick.html) |
| T.Flight HOTAS One | prices.EU / prices.UK / prices.US | EUR 99.99, GBP 74.99, USD 99.99. Were 90, 77, and 97. SKU 4460168. UK is on sale; regular price GBP 89.99. | [EU](https://shop.thrustmaster.com/en_eu/t-flight-hotas-one.html), [UK](https://shop.thrustmaster.com/en_gb/t-flight-hotas-one.html), [US](https://eshop.thrustmaster.com/en_us/t-flight-hotas-one.html) |
| T.16000M FCS Flight Stick | prices.EU / prices.UK | EUR 69.99, GBP 59.99. Were 69 and 59. SKU 2960773. US 79.99 still matches. | [EU](https://shop.thrustmaster.com/en_eu/t-16000m-fcs.html), [UK](https://shop.thrustmaster.com/en_gb/t-16000m-fcs.html) |
| TCA Yoke Pack Boeing Edition | prices.EU / prices.UK / prices.US url | EUR 499.99, GBP 429.99. Were 500 and 430. SKU 4460210. US amount stays 499.99. The stored US path `products-joysticks/yoke-pack-boeing-edition.html` is 404; the live page is `tca-yoke-pack-boeing-edition.html`. | [EU](https://shop.thrustmaster.com/en_eu/tca-yoke-pack-boeing-edition.html), [UK](https://shop.thrustmaster.com/en_gb/tca-yoke-pack-boeing-edition.html), [US](https://eshop.thrustmaster.com/en_us/tca-yoke-pack-boeing-edition.html) |

Where a UK or US Virpil price had no URL and the store was `virpil-controls.eu` or `virpil-controls.us`, the store and URL were set to the regional shop that showed the SKU. Amazon prices that moved were pointed at the shop page instead of Amazon.

## Sale notes where the current price already matched

These amounts were already the shop's final price, so the YAML was not rewritten. The shop also shows a higher regular or compare-at price.

| Product | Current price | Regular / compare-at | SKU |
| --- | --- | --- | --- |
| Archer-SF Cyclic Grip | EUR 119.96, GBP 127.96, USD 143.96 | EUR 149.95, GBP 159.95, USD 179.95 | VPC-024 |
| MOZA AB9 Force Feedback Base | EUR 529, GBP 479, USD 499 | EUR 599, GBP 549, USD 549 | T12BA00001A |
| MOZA MFY Yoke Handle | EUR 139, GBP 129 | EUR 159, GBP 149 | T12J040001A |
| MOZA MH16 Flightstick Grip | EUR 159, GBP 139, USD 149 | EUR 189, GBP 169, USD 169 | T12J000001A |
| MOZA MTP Flight Throttle | EUR 319, GBP 289, USD 299 | EUR 359, GBP 329, USD 329 | T12T000001A |
| Sol-R 4 HOTAS | GBP 199.99 | GBP 249.99 | 2960945 |
| Constellation Alpha Prime HOSAS Bundle | EUR 934.66 | EUR 1099.60 | VPC-106-001_009-01-HOSAS |

## Not changed

- **VPC ATLAS FFB Base and ATLAS PRO, all regions.** The cart `product:price:amount` is a 50% pre-order deposit (ATLAS EUR 300, GBP 315, USD 360; ATLAS PRO EUR 375, GBP 395, USD 445). The same pages state the pre-order price, and that price still matches the stored amount: ATLAS EUR 599.95, GBP 629.95, USD 719.95 (RRP 699.95 / 729.95 / 819.95); ATLAS PRO EUR 749.95, GBP 789.95, USD 889.95 (RRP 849.95 / 889.95 / 989.95). SKUs VPC-115-001 and VPC-115-002. The deposit was not written over the product price. [ATLAS EU](https://virpil-controls.eu/atlas-ffb-base.html), [ATLAS PRO EU](https://virpil-controls.eu/atlas-pro-ffb-base.html).
- **MOZA AY210 Force Feedback Yoke Bundle.** Shopify prices match the stored amounts (EUR 908, GBP 828, USD 828) but the variant SKU is empty, so nothing was written. EU and UK have compare-at prices of EUR 948 and GBP 868. US compare-at equals the current price. [EU product JSON](https://eu.mozaracing.com/products/ay210-ffb-yoke-bundle.js).

## Removed pages, left untouched

- **VPC MongoosT-50CM3 Throttle.** `vpc-mongoost-50cm3-throttle.html` is 404. The UK sitemap lists only the B-stock page, which was not used. Stored EU EUR 369.95 has no URL and was left. [B-stock](https://virpil-controls.co.uk/vpc-mongoost-50cm3-throttle-b-stock.html).
- **VPC ACE Interceptor Pedals, US.** `https://virpil-controls.us.com/vpc-ace-interceptor-pedals.html` is 404. Stored USD 410 left. The UK page is live and was updated.
- **VPC ACE-TORQ Pedals, UK and US.** `vpc-ace-torq-rudder-pedals.html` is 404 on `.co.uk` and `.us.com`, and it is not in the UK sitemap. Stored GBP 246 and USD 302 left. The EU page is live and the stored EUR 269.95 still matches.
- **TWCS Throttle, EU and UK.** `twcs-throttle.html` is not in the EU or UK shop sitemaps (those URLs 404). Stored EUR 89 and GBP 79 left. The US eshop page is live and USD 129.99 still matches. [US](https://eshop.thrustmaster.com/en_us/twcs-throttle.html).
- **HOTAS Warthog System, EU and UK.** `hotas-warthog.html` is not in the EU or UK shop sitemaps. Stored EUR 550 and GBP 473 left. The US eshop page is live at USD 599.99, SKU 2960720, which matches. [US](https://eshop.thrustmaster.com/en_us/hotas-warthog.html).
- **TCA Captain Pack Airbus Edition, all regions.** `tca-captain-pack-airbus-edition.html` is 404 on the EU shop, the UK shop, and the US eshop. The sitemaps list Captain Pack X only. That SKU was not copied onto this pack. Stored EUR 180, GBP 155, and USD 189 left.
