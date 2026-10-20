# WINCTRL regional price gaps — hillclimb 7 (luna5)

Checked 2026-10-21. Scope: the WINCTRL component and bundle gaps listed in `work/price-gaps-r7.txt`. Prices were taken from the official regional catalog APIs (`POST https://eu.winctrl.com/home/list/get`, `https://uk.winctrl.com/home/list/get`, `https://us.winwingsim.com/home/list/get`, each with `all: 1`) and matched by goods ID. The corresponding exact shop product pages are linked per entry. EU and UK prices are VAT inclusive; US prices exclude VAT. No currency conversion.

## Component prices added

| Product | Region price | Official listing |
| --- | ---: | --- |
| `agp-32-metal` | 119.83 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/1585.html) |
| `carrierace-ufc-2` | 201.47 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/2085.html) |
| `cyber-taurus-32-rudder-pedals-eb192` | 559.08 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/2825.html) |
| `cyber-taurus-32-rudder-pedals-eb530` | 670.91 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/2945.html) |
| `cyber-taurus-base-eb82` | 882.71 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/5705.html) |
| `cyber-taurus-base-ed16` | 882.71 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/5765.html) |
| `cyber-taurus-base` | 507.79 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/5205.html) |
| `cyber-taurus-combat-rudder-pedals-eb192` | 559.08 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/2585.html) |
| `cyber-taurus-combat-rudder-pedals-eb530` | 670.91 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/2705.html) |
| `ecam-32` | 63.16 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/1565.html) |
| `mcdu-32` | 124.08 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/945.html) |
| `nws-handwheel-l` | 84.77 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/6245.html) |
| `nws-handwheel-r` | 84.77 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/6265.html) |
| `orion-32-rudder-pedals-damper` | 348.72 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/1845.html) |
| `orion-32-rudder-pedals` | 307.51 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/1705.html) |
| `orion-metal-rudder-pedals-damper` | 348.72 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/546.html) |
| `pac-32-metal` | 114.53 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/1405.html) |
| `pdc-3m` | 90.13 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/1245.html) |
| `pdc-3n` | 90.13 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/1265.html) |
| `pfp-3n` | 124.08 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/965.html) |
| `pfp-4` | 137.87 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/1005.html) |
| `pfp-7` | 137.87 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/985.html) |
| `rmp-32` | 79.83 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/2065.html) |
| `skywalker-rudder-pedals` | 307.51 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/543.html) |
| `strikeace-e-throttle-grip` | 145.29 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/476.html) |
| `strikeace-ex-ii-throttle-grip` | 176.06 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/471.html) |
| `tcas-32` | 79.83 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/1865.html) |
| `ursa-minor-combat-t-ex` | 52.99 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/1985.html) |
| `ursa-minor-combat-throttle` | 164.39 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/1965.html) |
| `usb-instrument-display` | 127.21 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/422.html) |
| `viperace-joystick-grip` | 84.87 GBP | [uk.winctrl.com](https://uk.winctrl.com/p/377.html) |

## Component gaps left unset

- **FA-18 Hornet grip (EU/UK/US):** its referenced goods ID 314 is a Super Taurus/Super Libra HOTAS combo, not the standalone grip record. No price was transferred from that mismatched listing. URLs checked: [EU](https://eu.winctrl.com/p/314.html), [UK](https://uk.winctrl.com/p/314.html), [US](https://us.winwingsim.com/p/314.html).
- **KA-50 collective grip (UK):** official regional listing 325 reports `suspend_sales=1`; skipped as suspended. [UK listing](https://uk.winctrl.com/p/325.html).
- **Super Libra joystick base (EU/UK/US):** official listing 307 is suspended and shows the 999,999.00 not-for-sale sentinel in all three stores; skipped. [EU](https://eu.winctrl.com/p/307.html), [UK](https://uk.winctrl.com/p/307.html), [US](https://us.winwingsim.com/p/307.html).
- **ViperAce EX throttle grip (UK):** official listing 339 reports `suspend_sales=1`; skipped as suspended. [UK listing](https://uk.winctrl.com/p/339.html).
## Bundle prices added

These bundle prices were taken from the official regional shop detail endpoint (`GET https://<store>/home/shop/get?id=<exact listing ID>`), cross-checked by returned product title and goods code where available.

Prices came from the official regional shop API (`GET https://<store>/home/shop/get?id=<exact listing ID>`), with listing identity cross-checked by returned title and, where useful, goods code. The API returned its `/p/<id>.html` product URL. UK amounts use GBP and `incl_vat: true`, following the existing WINCTRL catalog convention; US amounts use USD and `incl_vat: false`. All entries are verified 2026-10-21 and use the existing `source: manual` value.

| Bundle | Region | Amount | Official listing |
| --- | --- | ---: | --- |
| Cyber Taurus E.B.29 ViperAce Joystick | UK | £645.66 | [ID 3185](https://uk.winctrl.com/p/3185.html) |
| Cyber Taurus E.B.82 ViperAce Joystick | UK | £1,020.58 | [ID 3205](https://uk.winctrl.com/p/3205.html) |
| Cyber Taurus E.D.16 ViperAce Joystick | UK | £1,020.58 | [ID 3225](https://uk.winctrl.com/p/3225.html) |
| EFIS Combo | UK | £162.24 | [ID 885](https://uk.winctrl.com/p/885.html) |
| 3 Glareshield | UK | £339.34 | [ID 6125](https://uk.winctrl.com/p/6125.html) |
| Orion 2 CarrierAce HOTAS | UK | £521.39 | [ID 1805](https://uk.winctrl.com/p/1805.html) |
| Orion 2 CarrierAce Joystick | UK | £335.14 | [ID 1785](https://uk.winctrl.com/p/1785.html) |
| Orion 2 F-16 HOTAS | UK | £536.30 | [ID 340](https://uk.winctrl.com/p/340.html) |
| Orion 2 HOTAS MAX | UK | £505.48 | [ID 343](https://uk.winctrl.com/p/343.html) |
| Orion 2 HOTAS Metal Warthog | UK | £365.95 | [ID 324](https://uk.winctrl.com/p/324.html) |
| Orion 2 NavyAce Throttle | UK | £248.05 | [ID 375](https://uk.winctrl.com/p/375.html) |
| Orion 2 StrikeAce HOTAS | UK | £543.67 | [ID 1825](https://uk.winctrl.com/p/1825.html) |
| Orion 2 StrikeAce E Throttle | UK | £272.45 | [ID 385](https://uk.winctrl.com/p/385.html) |
| Orion 2 ViperAce Throttle | UK | £294.78 | [ID 342](https://uk.winctrl.com/p/342.html) |
| Orion 2 ViperAce Joystick | UK | £243.95 | [ID 374](https://uk.winctrl.com/p/374.html) |
| 3 PDC Combo | UK | £180.26 | [ID 1645](https://uk.winctrl.com/p/1645.html) |
| URSA MINOR 32 Throttle and 32 PAC | UK | £250.27 | [ID 1665](https://uk.winctrl.com/p/1665.html) |
| URSA MINOR Combat HOTAS | UK | £246.00 | [ID 6485](https://uk.winctrl.com/p/6485.html) |
| URSA MINOR Combat HOTAS | US | $238.83 | [ID 6485](https://us.winwingsim.com/p/6485.html) |
| URSA MINOR Combat Throttle Metal EX | UK | £217.38 | [ID 2005](https://uk.winctrl.com/p/2005.html) |
| Ursa Minor Space HOSAS | UK | £243.96 | [ID 725](https://uk.winctrl.com/p/725.html) |


## Bundle gaps left unset

- **UK Orion 2 Black Shark Collective Combo** (ID 344), **Orion 2 NavyAce HOTAS** (ID 369), **Orion 2 NavyAce Joystick** (ID 332), and **Super Libra 3X0 Joystick Combo** (ID 336): official UK API responses returned a displayed price but `suspend_sales: 1`; treated as unavailable in the UK and left unset. [Official listing 344](https://uk.winctrl.com/p/344.html), [369](https://uk.winctrl.com/p/369.html), [332](https://uk.winctrl.com/p/332.html), [336](https://uk.winctrl.com/p/336.html).
- **Super Libra NavyAce Joystick Combo** (ID 317), UK and US: YAML already marks the bundle discontinued, and the official UK API also returned `suspend_sales: 1`. Left both gaps unset. [Official UK listing 317](https://uk.winctrl.com/p/317.html); US price endpoint was queried during the batch, but no status was needed to apply the catalog's discontinued state.

No not-for-sale sentinel was added. Other current UK gaps had normal amounts, active (`suspend_sales: 0`) listings, and stock or preorder availability.


## Bundle source limitations

A batch of repeat US API reads briefly returned HTTP 502. The needed current US listing for ID 6485 was retried successfully and showed $238.83, stock 4, and `suspend_sales: 0`. The other US gap is the discontinued ID 317 and was skipped. No other gaps were researched.

