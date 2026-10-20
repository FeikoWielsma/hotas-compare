# Thrustmaster hillclimb2 — coverage and unknowns

Checked 2026-10-20. Scope: `src/content/components/thrustmaster/*.yaml` and the Thrustmaster images. Rule: a value is written only from an exact-product official page, eshop, or manual. Retailer and reseller figures are not used. Button totals printed as marketing "action buttons" are not counted as physical buttons.

## Corrections to earlier notes

- **TCA SKY YOKE URLs were not 404.** These load: `https://www.thrustmaster.com/products/tca-sky-yoke-playstation-pc/` and `https://eshop.thrustmaster.com/en_us/tca-sky-yoke-ps.html`. The Xbox/PC page is `https://www.thrustmaster.com/en-us/products/tca-sky-yoke-xbox-pc/`, with eshop `https://eshop.thrustmaster.com/en_us/tca-sky-yoke-xbox.html`.
- **T.Flight HOTAS 5 MSFS eshop slug is** `eshop.thrustmaster.com/en_us/t-flight-hotas-5-microsoft-flight-simulator-edition.html`. The earlier `...-msfs...` guess was wrong. Found through search, not guessed.

## Added this round

| Record | Basis | Notes |
| --- | --- | --- |
| `tca-sky-yoke-ps-pc.yaml` (new) | PS/PC product page and eshop SKU 4160953 | Separate SKU from Xbox/PC. Platforms PC and PS5. Weight 2495 g and 344×440×180 mm match the Xbox edition's official page. US $199.99. Image from eshop 1000×1000 original, saved to `public/images/thrustmaster/tca-sky-yoke-ps-pc.webp`. |

## Filled on existing records

| Record | Field | Value | Source |
| --- | --- | --- | --- |
| `tca-sky-yoke.yaml` (Xbox/PC) | `prices` US | USD 199.99, incl_vat false | [eshop tca-sky-yoke-xbox.html](https://eshop.thrustmaster.com/en_us/tca-sky-yoke-xbox.html) |
| `t-flight-hotas-5-msfs-edition.yaml` | `prices` US | USD 109.99 (SKU 4160949) | [eshop en_us](https://eshop.thrustmaster.com/en_us/t-flight-hotas-5-microsoft-flight-simulator-edition.html) |
| `t-flight-hotas-4.yaml` | `prices` US | USD 99.99 (SKU 4169085) | [eshop en_us](https://eshop.thrustmaster.com/en_us/t-flight-hotas-4.html) |

## Product coverage

Present in catalog and not re-checked this round: TCA Yoke/Quadrant/Sidestick (Airbus and Boeing), T.16000M, TWCS, TPR, TFRP, Warthog base/grip/dual throttle/MKII, Viper TQS, Viper BAP panel, SOL-R 1/3/5/6, Neo Ace Combat 8 (PS and Xbox/PC), T.Flight HOTAS One/4/5/X, AVA base, OMNI extension, Airbus add-on grip.

Added this round: TCA Sky Yoke PS/PC, T.Flight Stick X (see below).

Not added:

- **T.Flight Stick X** — now added as `t-flight-stick-x.yaml`. See below.
- **Viper Panel standalone** (`thrustmaster.com/products/viper-panel/`) — not added. Its page gives the same dimensions and weight as the Viper TQS page (identical figures on two products, noted in round 1). The page's "43 action buttons (incl. 11 virtual)" is marketing and not counted. The catalog `viper-bap-panel.yaml` appears to be the same hardware; confirm before adding a second record.
- **TCA Sky Quadrant (3-axis)** — no official product page found. Mentioned only as a compatible accessory on the Sky Yoke page. Not added.
- **Viper TQS Mission Pack** (`thrustmaster.com/products/viper-tqs-mission-pack/`, eshop `viper-tqs-mission-pack.html`) — a bundle, not present in `bundles/thrustmaster/`. Not added this round; it needs TQS and Viper Panel component records (both present or aliased) and a verified price per region.
- **Sol-R / Warthog / Viper** exact-SKU variants and legacy Cougar, T.Flight Stick X variants — not searched this round.

### T.Flight Stick X (added)

- Official: `thrustmaster.com/en-us/products/t-flight-stick-x/`; eshop `en_us/t-flight-stick-x.html` (SKU 2960694, US $49.99, platforms PC and PS3).
- Weight 1303 g; dimensions 25.7 × 24 × 22 cm (page labels W/H/D), stored as 257 × 220 × 240 mm [W, D, H].
- Controls recorded: fire trigger (count 1, stages not stated), integrated throttle, twist rudder (axis count 1).
- **Unset:** axis count (conflict: 4 on eshop and product page, "3 axes and integrated throttle" elsewhere on the page), the POV button (not identified as hat or button), the 12 "action buttons" (marketing total).
- PS3 is listed but the schema has no PS3 field. PS5 and Xbox are `unknown`.

## Remaining unknowns and why

- **Button and hat counts** on partial records. Official pages give marketing totals only (HOTAS 4: no count; HOTAS 5: 14 "action buttons"; Sky Yoke: 24; Stick X: 12). Physical counts need the manual's diagrams. Manual PDFs must be rendered and read; not done this round.
- **HOTAS 4 manual** (`ts.thrustmaster.com/download/accessories/Manuals/TFH4/T-Flight_Hotas_4_Manual.pdf`, 171 pages, English section 1–8): technical-features callouts show action buttons (callout 9) with no count; POV hat (11). Button count stays unset.
- **Warthog stick grip en-us product slug** (404 earlier): not retried this round.
- **UK price for HOTAS 5 MSFS**: no en_gb product page found. The UK homepage shows £89.99, but that is not a product-page price and was not used.
- **Images** for the new Stick X record: not added. Only the Sky Yoke PS/PC record has an image.
- **Sky Yoke PS/PC status**: eshop shows In stock and a 2026-10-28 availability date with a Pre-Order button. Left as `current`; confirm once it ships.
- **Xbox/PC Sky Yoke SKU**: not shown on the page.
