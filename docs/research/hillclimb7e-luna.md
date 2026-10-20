# Hillclimb round 7e — luna7 — regional price freshness

Checked 2026-10-21. Scope: existing EU, UK, and US price entries in the WINCTRL, Honeycomb, Turtle Beach, Logitech, and VKB component and bundle folders. The repository contained 518 price-region entries. I rechecked 455 entries against exact product pages or WINCTRL regional listings and refreshed their `verified` dates. For WINCTRL I used each regional shop's Download Center catalog API (`/home/list/get`) and the live `price` field as the payable amount; `souPrice` is the regular amount when the API reports a discount. For Honeycomb, Turtle Beach, Logitech, and VKB, current shop/dealer product JSON-LD offers were checked against currency and product page. No currency conversions were used.

## Changed prices

| Product | Region | Previous | Current | Source |
|---|---|---:|---:|---|
| Orion 2 Joystick Base | US | $195.00 | $222.43 | [WINCTRL US listing](https://us.winwingsim.com/p/333.html) |
| Ursa Minor Fighter Joystick Right | UK | £75.00 | £116.70 | [WINCTRL UK listing](https://uk.winctrl.com/p/551.html) |
| Ursa Minor Fighter Joystick Right | US | $95.00 | $113.30 | [WINCTRL US listing](https://us.winwingsim.com/p/551.html) |
| Cyber Taurus E.B.29 ViperAce Joystick | UK | £645.66 | £592.66 | [WINCTRL UK listing](https://uk.winctrl.com/p/3185.html) |
| Cyber Taurus E.B.82 ViperAce Joystick | UK | £1,020.58 | £967.58 | [WINCTRL UK listing](https://uk.winctrl.com/p/3205.html) |
| Cyber Taurus E.D.16 ViperAce Joystick | UK | £1,020.58 | £967.58 | [WINCTRL UK listing](https://uk.winctrl.com/p/3225.html) |
| Orion 2 StrikeAce Throttle | EU | €204.33 | €253.72 | [WINCTRL EU listing](https://eu.winctrl.com/view/goods-details.html?id=385) |
| Orion 2 StrikeAce Throttle | UK | £272.45 | £248.05 | [WINCTRL UK listing](https://uk.winctrl.com/p/385.html) |
| Ursa Minor Combat HOTAS | EU | €229.28 | €278.67 | [WINCTRL EU listing](https://eu.winctrl.com/view/goods-details.html?id=6485) |
| Ursa Minor Combat HOTAS | UK | £246.00 | £298.98 | [WINCTRL UK listing](https://uk.winctrl.com/p/6485.html) |
| Ursa Minor Combat HOTAS | US | $238.83 | $290.27 | [WINCTRL US listing](https://us.winwingsim.com/p/6485.html) |
| Logitech Extreme 3D Pro | US | $39.99 | $34.99 | [Logitech G shop](https://www.logitechg.com/en-us/shop/p/extreme-3d-pro-joystick) |
| Logitech Flight Throttle Quadrant | US | $55.99 | $69.99 | [Logitech G shop](https://www.logitechg.com/en-us/shop/p/flight-simulator-throttle-quadrant.945-000032) |
| Gladiator NXT EVO F-14 Combat Edition | US | $175.00 | $149.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-f-14-combat-edition-us) |
| Gladiator NXT EVO WWII Combat Edition | US | $135.00 | $109.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-wwii-combat-edition-us) |
| GNX Dual THQ + FSM-GA Combo | US | $264.00 | $260.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gnx-dual-thq-fsm-ga-combo-us) |
| GNX Dual THQ + SEM + FSM-GA Combo | US | $347.00 | $325.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gnx-dual-thq-sem-fsm-ga-combo-us) |
| GNX Dual THQ + SEM-V Combo | US | $241.00 | $240.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gnx-dual-thq-sem-v-combo-us) |
| GNX Dual THQ + SEM-V + THQ-V Combo | US | $324.00 | $310.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gnx-dual-thq-sem-v-thq-v-combo-us) |
| GNX Triple THQ + FSM-GA Combo | US | $343.00 | $288.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gnx-triple-thq-fsm-ga-combo) |
| GNX Triple THQ + SEM-V Combo | US | $320.00 | $270.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gnx-triple-thq-sem-v-combo) |
| GNX WWII Throttle Combo | US | $115.00 | $173.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gnx-wwii-throttle-combo-us) |
| Gunfighter Mk.IV F-14 Combat Edition Tabletop | US | $335.00 | $359.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gunfighter-iv-wwii-combat-edition-tabletop-us-copy) |
| Gunfighter Mk.IV Modern Combat Edition Tabletop | US | $349.00 | $369.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gunfighter-iv-modern-combat-edition-tabletop-us) |
| Gunfighter Mk.IV Space Combat Edition Tabletop, left | US | $319.00 | $339.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gunfighter-iv-space-combat-edition-tabletop-left-hand-us) |
| Gunfighter Mk.IV Space Combat Edition Tabletop, right | US | $319.00 | $339.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gunfighter-iv-space-combat-edition-tabletop-right-hand-us) |
| Gunfighter Mk.IV WWII Combat Edition Tabletop | US | $279.00 | $299.00 | [VKB US shop](https://vkbsimcontrollers.com/products/gunfighter-iv-wwii-combat-edition-tabletop-us) |
| Logitech G Pro Flight Rudder Pedals | EU | €170.00 | €119.99 | [Logitech G shop](https://www.logitechg.com/de-de/shop/p/flight-simulator-rudder-pedals.945-000024) |
| Logitech G Pro Flight Rudder Pedals | UK | £146.00 | £99.99 | [Logitech G shop](https://www.logitechg.com/en-gb/shop/p/flight-simulator-rudder-pedals.945-000024) |
| Logitech G Pro Flight Throttle Quadrant | EU | €70.00 | €59.99 | [Logitech G shop](https://www.logitechg.com/de-de/shop/p/flight-simulator-throttle-quadrant.945-000032) |
| Logitech G Pro Flight Throttle Quadrant | UK | £60.00 | £54.99 | [Logitech G shop](https://www.logitechg.com/en-gb/shop/p/flight-simulator-throttle-quadrant.945-000032) |
| Logitech G Flight Yoke System | EU | €240.00 | €139.99 | [Logitech G shop](https://www.logitechg.com/de-de/shop/p/flight-simulator-yoke-system.945-000023) |
| Logitech G Flight Yoke System | UK | £206.00 | £119.99 | [Logitech G shop](https://www.logitechg.com/en-gb/shop/p/flight-simulator-yoke-system.945-000023) |
| Logitech G X56 HOTAS System | EU | €300.00 | €199.99 | [Logitech G shop](https://www.logitechg.com/de-de/shop/p/x56-space-flight-vr-simulator-controller.945-000058) |
| Logitech G X56 HOTAS System | UK | £258.00 | £179.99 | [Logitech G shop](https://www.logitechg.com/en-gb/shop/p/x56-space-flight-vr-simulator-controller.945-000058) |

The Extreme 3D Pro US product page showed $34.99 and “Not available”; the price is the shop-displayed amount, although it was not orderable during the check.

## Sale regular prices

WINCTRL currently reports these final prices with a 10% discount. The `amount` fields keep the live payable amounts; the regular amount is recorded here as requested.
Logitech G marks the regional offers below with regular prices as well; the price blocks contain the current payable amounts.

| Product | EU regular (sale) | UK regular (sale) | US regular (sale) |
|---|---|---|---|
| EFIS L | €84.00 (€75.60) | £90.13 (£81.12) | $87.50 ($78.75) |
| EFIS R | €84.00 (€75.60) | £90.13 (£81.12) | $87.50 ($78.75) |
| FCU Unit | €138.29 (€124.46) | £148.37 (£133.53) | $144.05 ($129.64) |
| MCDU-32 | €128.49 (€115.64) | £137.87 (£124.08) | $133.85 ($120.46) |
| PFP-3N | €128.49 (€115.64) | £137.87 (£124.08) | $133.85 ($120.46) |
| EFIS Combo | €168.00 (€151.20) | £180.26 (£162.24) | $175.00 ($157.50) |
| Logitech G Pro Flight Rudder Pedals | €129.99 (€119.99) | £109.99 (£99.99) | — |
| Logitech G Pro Flight Throttle Quadrant | €64.99 (€59.99) | — | — |
| Logitech G X56 HOTAS System | €249.99 (€199.99) | £219.99 (£179.99) | — |

## Exact dealer URLs added

These three UK listings returned exact product titles and the same listed prices as the prior regional entries; I added direct product URLs and refreshed their verification dates.

- Gladiator NXT EVO Base: £105.00 — [VKB FSC UK](https://flightsimcontrols.co.uk/product/gladiator-nxt-evo-base-only/)
- STECS Throttle System Max Mk.II: £369.00 — [VKB FSC UK](https://flightsimcontrols.co.uk/product/stecs-throttle-system-max-mk-ii/)
- STECS Throttle System Standard Mk.II: £319.00 — [VKB FSC UK](https://flightsimcontrols.co.uk/product/stecs-throttle-system-standard-mk-ii/)

## Removed or unresolved product pages

These exact VKB URLs returned HTTP 404 with a “Page not found” response. Their price blocks and verification dates were not changed.

- STECS Modern Throttle Grip Premium Combo, EU: [dealer page](https://flightsimcontrols.com/product/stecs-modern-throttle-grip-premium-combo/)
- STECS Modern Throttle Grip Standard Combo, EU and UK: [EU dealer page](https://flightsimcontrols.com/product/stecs-modern-throttle-grip-standard-combo/) and [UK dealer page](https://flightsimcontrols.co.uk/product/stecs-modern-throttle-grip-standard-combo/)
- STECS Space Throttle System Mini Right, UK: [dealer page](https://flightsimcontrols.co.uk/product/stecs-space-throttle-system-mini-right-hand/)

Other entries remain unchanged where the provided record had no exact product URL, the regional WINCTRL API had no active exact listing, the regional WINCTRL listing had no exact SKU, the dealer page did not expose an exact SKU price, or multiple shop variants could not be tied to the catalog record. Twenty-two suspended WINCTRL listings had their verification dates refreshed but their amounts retained because no purchase price was available. This includes Logitech marketplace prices for standalone stick/throttle component records where the official Logitech G pages only sell the combined system, and Honeycomb UK prices without an exact official product URL. A small number of VKB records pointed to a different product page; those price blocks were left unchanged. In total, 63 entries were not refreshed; see the exact page/API states above and the product `prices` blocks for their retained original values.

The automated page audit scratch files are under ignored `work/luna7/`; only price blocks and this research note were edited.
