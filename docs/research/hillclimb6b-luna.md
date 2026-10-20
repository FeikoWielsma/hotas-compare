# WINCTRL catalog gaps — hillclimb 6b (luna2)

Checked 2026-10-21. Scope: WINCTRL components and bundles. Per the Round 6 brief, I regenerated the relevant gap view by checking the current WINCTRL YAML against the `controls.inventory` rows in `docs/catalog-unknowns.md`. The audit is stale for several records: the YAML already contains complete inventory evidence for MFD, PTO2, PFP 3N/4/7, ICP and HUD, among others. Those established inventories were not re-researched.

## Changes

- **Panel of Auto Pilot 3** (`goods 1065`): changed `controls_evidence.coverage` from `partial` to `complete`. The official listing itemizes 17 pushbuttons, five 360° rotary knobs, one separate five-position rotary knob, one encoder wheel and one two-position toggle. Unknown rotary axis/contact behavior remains unset. [Official product listing](https://eu.winctrl.com/view/goods-details.html?id=1065).
- **UK prices added or refreshed** from the exact WINCTRL UK listings below. Twenty-two missing GBP values were added; the Orion 2 Joystick Base's older `winwing.cn` value was refreshed to the current UK listing. Each is stored with `incl_vat: true`, the exact `/p/<id>.html` listing URL, and verification date 2026-10-21. Prices were taken from the official UK catalog response at `POST https://uk.winctrl.com/home/list/get` (`all: 1`); product identity was cross-checked by listing ID and goods code/title.

| Product | UK price | Official UK listing |
| --- | ---: | --- |
| 3X0 Joystick Grip | £288.35 | [335](https://uk.winctrl.com/p/335.html) |
| CarrierAce Joystick Grip Right | £229.10 | [1685](https://uk.winctrl.com/p/1685.html) |
| Gemini Throttle/Collective Base | £137.87 | [326](https://uk.winctrl.com/p/326.html) |
| EFIS L / EFIS R | £81.12 each | [845](https://uk.winctrl.com/p/845.html), [865](https://uk.winctrl.com/p/865.html) |
| FCU Unit | £133.53 | [550](https://uk.winctrl.com/p/550.html) |
| F-16 ICP Module | £207.88 | [544](https://uk.winctrl.com/p/544.html) |
| NavyAce HUD | £58.25 | [412](https://uk.winctrl.com/p/412.html) |
| NavyAce UFC | £201.47 | [6625](https://uk.winctrl.com/p/6625.html) |
| MFD Unit | £58.25 | [402](https://uk.winctrl.com/p/402.html) |
| PCR Panel | £140.03 | [322](https://uk.winctrl.com/p/322.html) |
| Panel of Auto Pilot 3 | £159.08 | [1065](https://uk.winctrl.com/p/1065.html) |
| PTO 2 Panel | £122.57 | [542](https://uk.winctrl.com/p/542.html) |
| Orion 2 Joystick Base | £229.10 | [333](https://uk.winctrl.com/p/333.html) |
| Orion 2 Throttle Base | £229.10 | [334](https://uk.winctrl.com/p/334.html) |
| Orion 2 ViperAce Throttle Grip | £251.38 | [1765](https://uk.winctrl.com/p/1765.html) |
| NavyAce Metal Throttle Grip | £145.29 | [306](https://uk.winctrl.com/p/306.html) |
| URSA MINOR 32 Throttle Metal | £135.74 | [1385](https://uk.winctrl.com/p/1385.html) |
| Ursa Minor Airline Joystick Left / Right | £64.27 each | [556](https://uk.winctrl.com/p/556.html), [555](https://uk.winctrl.com/p/555.html) |
| Ursa Minor Fighter Joystick Left | £116.70 | [554](https://uk.winctrl.com/p/554.html) |
| Ursa Minor Space Joystick Left / Right | £127.26 each | [553](https://uk.winctrl.com/p/553.html), [552](https://uk.winctrl.com/p/552.html) |

## Inventory gaps retained

The following remain `partial` because the first-party material still leaves physical controls or behavior uncounted, conflicting, or ambiguous. These were not filled from output numbers or related SKUs:

- **Panels:** EFIS L/R do not count or position their selectors or enumerate all panel keys; FCU does not count the other keys; PCR's function text does not map every action to a unique control; NavyAce UFC does not state discrete contact counts; `pfp3-cockpit-module` rotary axis/contact behavior is not stated (the itemized physical inventory itself is now complete).
- **Grips:** 3X0's removable hat and mini-joystick are alternatives and the trigger/center-push behavior is unspecified; CarrierAce diagram descriptions do not resolve all secondary properties; the F-16EX, Hornet/NavyAce, KA-50, StrikeAce, and ViperAce records retain their previously documented SKU or control-map ambiguity. KA-50 has conflicting push-button totals in its official page.
- **Bases:** Gemini, Orion 2 joystick/throttle, and Super Libra manuals do not establish a complete base-mounted input inventory. The Orion 2 joystick base has its documented three axes; that does not establish whether other physical controls are absent.
- **Ursa Minor:** Airline L/R and Space L/R retain unresolved trigger stage, hat way/press, slider or subtype details. Fighter L remains partial; Fighter R already has complete right-hand-manual evidence. 32 Throttle has a short-travel button group without a stated physical count.
- **Super Libra base price:** EU and UK listings use `999999.00` / `999,999.00`, the store's not-for-sale sentinel; no price added. No UK price was found for every applicable exact SKU outside the UK listings added above.

## Platforms and regional prices

The inspected official sources establish PC use for these USB/SimApp Pro products, which is already recorded in YAML. They do not establish Xbox or PS5 compatibility or incompatibility, so those values remain `unknown`. Existing EU prices were retained. UK prices were added only where the exact product listing yielded a normal GBP price; no currency conversion or related-variant substitution was used.
