# Hillclimb 6b source audit — Luna

Audited 2026-10-21 against `git show 8bf73e9 -- src` and the exact product pages below. The requested field families were treated as unsupported when the official page was silent; silence does not establish `false` or `null`.

## Virpil control fields

| Product / field | Decision | Evidence |
|---|---|---|
| Constellation VEGA Yoke Handle, lever `push: false` | Removed `push`; the page explicitly says each analogue trigger has an additional button input when fully depressed. | [Official VEGA product page](https://virpil-controls.eu/constellation-vega-yoke-handle.html) |
| Constellation VEGA Yoke Handle, two ordinary push buttons `backlit: false` | Removed `backlit`; the page distinguishes these two buttons from six programmable RGB push buttons, but says nothing about illumination of the two ordinary buttons. | [Official VEGA product page](https://virpil-controls.eu/constellation-vega-yoke-handle.html) |
| Vector Engine MCP, starter dial `positions: 5` | Kept; the source calls it a “5-way Starter Dial.” | [Official Vector Engine MCP page](https://virpil-controls.eu/vector-emc-panel.html) |
| Vector Engine MCP, starter dial `push: false` | Removed `push`; the page describes the five-way dial and a spring-loaded START position, but does not specify a push action. | [Official Vector Engine MCP page](https://virpil-controls.eu/vector-emc-panel.html) |
| Vector Engine MCP, three toggles `momentary: false` | Kept; the page explicitly identifies three “3-Way Latched Toggles.” | [Official Vector Engine MCP page](https://virpil-controls.eu/vector-emc-panel.html) |
| Vector Engine MCP, three toggles `push: false` | Removed `push`; the page says “latched” and gives no push action. | [Official Vector Engine MCP page](https://virpil-controls.eu/vector-emc-panel.html) |
| Vector Gear MCP, landing lever `push: false` | Removed `push`; the page names an adjustable landing gear lever and does not specify a push action. | [Official Vector Gear MCP page](https://virpil-controls.eu/vector-gmc-panel.html) |
| Vector Gear MCP, button `backlit: false` | Removed `backlit`; the page lists one push button and programmable RGB lighting, without saying the push button is or is not illuminated. | [Official Vector Gear MCP page](https://virpil-controls.eu/vector-gmc-panel.html) |
| Vector Lighting MCP, six toggles `momentary: false` | Kept; the source explicitly calls them “3-Way Latched Toggles.” | [Official Vector Lighting MCP page](https://virpil-controls.eu/vector-lmc-panel.html) |
| Vector Lighting MCP, six toggles `push: false` | Removed `push`; no push behavior is stated. | [Official Vector Lighting MCP page](https://virpil-controls.eu/vector-lmc-panel.html) |

The `backlit: false` key for the eight STEM buttons was only moved in the textual diff for the Max/Standard package records, rather than changing its value. I removed it from those touched records anyway: the [VKB US STEM page](https://vkbsimcontrollers.com/products/stecs-stem-standard-throttle-extension-module-us) lists eight buttons but does not call them non-illuminated. The product page is silent, so the flag is unset. No other `positions`, `momentary`, `action`, or `center_detent` values were added or changed in this commit.

## VKB hardware fields

Removed the newly added unsupported keys below. The STECS pages enumerate axes, bearings, grip gimbal, and included components, but do not state the negative hardware properties in these fields. `throw_deg: null` and other explicit nulls were removed rather than encoding source silence.

| Records | Removed fields | Official product pages checked |
|---|---|---|
| STECS Space Throttle System Max, Standard, Mini Plus, and Mini, both hands (8 records) | `cams_swappable: false`, `extension_support: false`, `throw_deg: null` | [Max LH](https://flightsimcontrols.com/product/stecs-space-throttle-system-max-left-handed/), [Max RH](https://flightsimcontrols.com/product/stecs-space-throttle-system-max-right-handed/), [Standard LH](https://flightsimcontrols.com/product/stecs-space-throttle-system-standard-left-hand/), [Standard RH](https://flightsimcontrols.com/product/stecs-space-throttle-system-standard-right-hand/), [Mini Plus LH](https://flightsimcontrols.com/product/stecs-space-throttle-system-mini-plus-left-handed/), [Mini Plus RH](https://flightsimcontrols.com/product/stecs-space-throttle-system-mini-plus-right-handed/), [Mini LH](https://flightsimcontrols.com/product/stecs-space-throttle-system-mini-left-hand/), [Mini RH](https://flightsimcontrols.com/product/stecs-space-throttle-system-mini-right-hand/) |
| STECS Modern Throttle Grip Premium/Standard combo and STECS STG add-on grip L/R (4 records) | `force_adjustable: false`, `cams_swappable: false`, `damping: null`, `extension_support: false`, `throw_deg: null` | [MTG Standard](https://flightsimcontrols.com/product/stecs-mtg-grip-standard/), [MTG Premium listing](https://flightsimcontrols.com/product-tag/stecs-grip/), [STG add-on grip](https://flightsimcontrols.com/product/stecs-space-throttle-add-on-grip-stg-left-hand/) |
| STECS STEM and WWII GNX THQ add-on grip | Restored `hardware: null`; the newly added `axis_count: 0`, null hardware properties, empty axes list, and false properties were not stated by the sources. | [Official VKB STEM page](https://vkbsimcontrollers.com/products/stecs-stem-standard-throttle-extension-module-us), [Official VKB WWII grip page](https://vkbsimcontrollers.com/products/wwii-gnx-thq-add-on-grip-us) |

For the detached STG grip, the product page explicitly lists a built-in X/Y gimbal and two analog axes, which remain in the record. It does not make the newly added force, cam, damping, extension, or throw claims. The MTG listings enumerate the included grip halves and controls but do not state those hardware properties. The WWII and STEM listings enumerate physical controls, but do not specify a zero-axis count or the added hardware negatives.

## VKB price entries

Kept all 21 newly added regional price entries. VKB FSC Europe and VKB FSC UK identify themselves as VKB's regional partner stores and their product/category listings state the exact prices below, including VAT treatment. No conversion or adjacent SKU price was used.

| Exact record(s) | Kept prices | Source |
|---|---|---|
| STECS Modern Throttle Grip Premium combo | EU €158 incl. VAT | [VKB FSC Europe product listing](https://flightsimcontrols.com/product-tag/stecs-grip/) |
| STECS Modern Throttle Grip Standard combo | EU €112 incl. VAT; UK £112 incl. VAT | [VKB FSC Europe product page](https://flightsimcontrols.com/product/stecs-mtg-grip-standard/), [VKB FSC UK accessory listings](https://flightsimcontrols.co.uk/product-category/accessories/stecs-accessories/) |
| STECS Space Throttle System Max, left and right | EU €339 incl. VAT; UK £320 incl. VAT | [VKB FSC Europe Max LH](https://flightsimcontrols.com/product/stecs-space-throttle-system-max-left-handed/), [VKB FSC Europe Max RH](https://flightsimcontrols.com/product/stecs-space-throttle-system-max-right-handed/), [VKB FSC UK Max LH](https://flightsimcontrols.co.uk/product/stecs-space-throttle-system-max-left-handed/), [VKB FSC UK Max RH](https://flightsimcontrols.co.uk/product/stecs-space-throttle-system-max-right-handed/) |
| STECS Space Throttle System Mini Plus, left and right | EU €258 incl. VAT; UK £249 incl. VAT | [VKB FSC Europe Mini Plus LH](https://flightsimcontrols.com/product/stecs-space-throttle-system-mini-plus-left-handed/), [VKB FSC Europe Mini Plus RH](https://flightsimcontrols.com/product/stecs-space-throttle-system-mini-plus-right-handed/), [VKB FSC UK Mini Plus listings](https://flightsimcontrols.co.uk/product-category/controllers/stecs-controllers/) |
| STECS Space Throttle System Mini, left and right | EU €237 incl. VAT; UK £235 incl. VAT | [VKB FSC Europe Mini LH](https://flightsimcontrols.com/product/stecs-space-throttle-system-mini-left-hand/), [VKB FSC Europe Mini RH](https://flightsimcontrols.com/product/stecs-space-throttle-system-mini-right-hand/), [VKB FSC UK Mini LH](https://flightsimcontrols.co.uk/product/stecs-space-throttle-system-mini-left-hand/), [VKB FSC UK Mini RH](https://flightsimcontrols.co.uk/product-category/controllers/stecs-controllers/) |
| STECS Space Throttle System Standard, left and right | EU €297 incl. VAT; UK £285 incl. VAT | [VKB FSC Europe Standard LH](https://flightsimcontrols.com/product/stecs-space-throttle-system-standard-left-hand/), [VKB FSC Europe Standard RH](https://flightsimcontrols.com/product/stecs-space-throttle-system-standard-right-hand/), [VKB FSC UK Standard LH](https://flightsimcontrols.co.uk/product/stecs-space-throttle-system-standard-left-handed/), [VKB FSC UK Standard RH](https://flightsimcontrols.co.uk/product/stecs-space-throttle-system-standard-right-handed/) |
| STECS STEM | EU €75 incl. VAT; UK £69 incl. VAT | [VKB FSC Europe STECS listing](https://flightsimcontrols.com/product-tag/stecs/), [VKB FSC UK STEM product page](https://flightsimcontrols.co.uk/product/stecs-stem-standard-throttle-extension-module/) |

## Commit scope notes

`git show 8bf73e9 -- src` lists 18 files, all under VKB or Virpil. It contains no Logitech file, no Rotor TCS base file, and no changed `cams_swappable`/`throw_deg` keys on a Rotor TCS base. Those records were not edited as part of this commit audit. Similarly, this diff adds no `action: sequential` or `center_detent: false` values. The VKB prices are the only retained new values outside the verified Virpil control facts above.
