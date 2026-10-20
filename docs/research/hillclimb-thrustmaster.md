# Thrustmaster hillclimb — unknowns pass

Checked 2026-10-20. Scope: `src/content/components/thrustmaster/*.yaml` only. Sources: official Thrustmaster product pages (en-us, en-gb), official eshop pages (`eshop.thrustmaster.com/en_us`, `shop.thrustmaster.com/en_gb`), and retailer listings used only to test conflicts. Rule applied: a value is written only from an exact-product official page or manual; conflicts or silence leave the field unset.

## Filled

Physical (weight and dimensions, stored as `[width, depth, height]`):

| Record | Field | Value | Source |
| --- | --- | --- | --- |
| `tca-sky-yoke.yaml` | `physical.weight_g`, `dimensions_mm` | 2495 g; 344 × 440 × 180 mm | [TCA SKY YOKE (Xbox/PC), en-us](https://www.thrustmaster.com/en-us/products/tca-sky-yoke-xbox-pc/) "More details": Height 180 mm, Width 344 mm, Depth 440 mm; 5.5 lb / 2,495 g |
| `ava-base.yaml` | `physical.weight_g`, `dimensions_mm` | 1069 g; 108 × 170 × 72 mm | [AVA Base, en-us](https://www.thrustmaster.com/en-us/products/ava-base/) "More details" (bare base) |
| `t-flight-hotas-one-x.yaml` | `physical.weight_g`, `dimensions_mm` | 2060 g; 264 × 265 × 242 mm | [T.Flight Hotas One, en-us](https://www.thrustmaster.com/en-us/products/t-flight-hotas-one/): Width/Height/Depth 26.4 × 24.2 × 26.5 cm, 2060 g. Corroborated by retailer listings for weight (2.06 kg) and for W×H×D 264×242×265 (Currys, Teqex). Adorama's 350×200×235 mm is the HOTAS 5 size and was not used. |

Prices (official eshops only; the displayed amount is used, no conversion):

| Record | Region | Amount | Source |
| --- | --- | --- | --- |
| `sol-r-5-base.yaml` | US | $169.99 | [eshop en_us](https://eshop.thrustmaster.com/en_us/sol-r-5-base.html) |
| `sol-r-6-throttle.yaml` | US | $129.99 | [eshop en_us](https://eshop.thrustmaster.com/en_us/sol-r-6-throttle.html) |
| `sol-r-3-ava-add-on-grip.yaml` | US | $109.99 | [eshop en_us](https://eshop.thrustmaster.com/en_us/sol-r-3-ava-add-on-grip.html) |
| `airbus-add-on-grip.yaml` | US | $129.99 | [eshop en_us](https://eshop.thrustmaster.com/en_us/airbus-add-on-grip.html) |
| `omni-extension.yaml` | US | $44.99 | [eshop en_us](https://eshop.thrustmaster.com/en_us/omni-extension.html) |
| `t-flight-hotas-x.yaml` | US | $69.99 | [eshop en_us](https://eshop.thrustmaster.com/en_us/t-flight-hotas-x.html) |
| `warthog-mkii-base.yaml` | US | $119.99 | [eshop en_us](https://eshop.thrustmaster.com/en_us/hotas-warthog-mkii-base.html) |
| `warthog-mkii-base.yaml` | UK | £85.99 | [shop en_gb](https://shop.thrustmaster.com/en_gb/hotas-warthog-mkii-base.html) |
| `t-flight-hotas-neo-ace-combat-8-ps.yaml` | US | $149.99 | [eshop en_us](https://eshop.thrustmaster.com/en_us/t-flight-hotas-neo-ace-combat-8-playstation-pc.html) |
| `t-flight-hotas-neo-ace-combat-8-ps.yaml` | UK | £109.99 | [shop en_gb](https://shop.thrustmaster.com/en_gb/t-flight-hotas-neo-ace-combat-8-playstation-pc.html) |
| `t-flight-hotas-neo-ace-combat-8-xbox-pc.yaml` | US | $149.99 | [eshop en_us](https://eshop.thrustmaster.com/en_us/t-flight-hotas-neo-ace-combat-8-xbox-pc.html) — page shows an out-of-stock banner; price recorded as displayed |
| `t-flight-hotas-neo-ace-combat-8-xbox-pc.yaml` | UK | £109.99 | [shop en_gb](https://shop.thrustmaster.com/en_gb/t-flight-hotas-neo-ace-combat-8-xbox-pc.html) |

US and UK eshop pages show the currency symbol without a code; the US store is USD and the UK store is GBP. `incl_vat: false` for US (matching existing US entries), `true` for UK.

Sources: `tca-sky-yoke.yaml` gained the en-us product URL.

## Not filled — reason

- **Viper TQS (`viper-tqs-throttle.yaml`) weight/dimensions.** The [en-us TQS page](https://www.thrustmaster.com/en-us/products/viper-tqs/) gives 93 × 296 × 82 mm, 928 g. The [Viper Panel page](https://www.thrustmaster.com/en-us/products/viper-panel/) gives identical figures, although the panel is a different product. The [Mission Pack page](https://www.thrustmaster.com/en-us/products/viper-tqs-mission-pack/) (230 × 296 × 260 mm, 3338 g) is a different product and was not used. Identical figures on two products mean the values cannot be attributed; left unset. Written briefly then reverted during this pass.
- **Viper Mission Pack BAP Panel (`viper-bap-panel.yaml`) weight/dimensions.** Same identical 93 × 296 × 82 / 928 g figures on the [Viper Panel page](https://www.thrustmaster.com/en-us/products/viper-panel/); the tie to the copied TQS figures makes it unusable. Unset.
- **TPR Pendular Rudder (`tpr-pendular-rudder.yaml`) dimensions.** Conflict: the [TPR en-us page](https://www.thrustmaster.com/products/tpr-thrustmaster-pendular-rudder/) gives L 45.6 × W 33.6 × H 41.5 cm, while the [US eshop](https://eshop.thrustmaster.com/en_us/tpr-thrustmaster-pendular-rudder.html) gives 53 × 36 × 36 cm (W × D × H) for the product without packaging. Weight 7 kg on both is consistent with the existing 7300 g (manual). Dimensions unset.
- **TCA SKY YOKE EU/UK/US prices.** The eshop slugs `tca-sky-yoke-xbox-pc.html` return 404 for en_us, en_gb and en_eu. The en-us product page shows $199.99 only in its Resellers section and is not used.
- **T.Flight HOTAS 5 MSFS prices UK/US.** eshop/en_us and shop/en_gb slugs return 404. The en-us product page shows $109.99 in its Resellers section and is not used.
- **HOTAS Warthog Stick Grip weight/dimensions.** The en-us product slug returns 404. The [eshop "hotas-warthog-flight-stick" page](https://eshop.thrustmaster.com/en_us/hotas-warthog-flight-stick.html) describes a stand-alone stick, not the grip record, with no dimensions and contradictory weights (>14 lb; >6.6 lb / 3 kg; >6 lb). Unset.
- **T.Flight HOTAS 4 weight/dimensions and US price.** The en-us product page returns 404; earlier research found the support page states "Not stated" for physical values. Unset.
- **TCA Boeing Yoke weight.** Still conflicting (product page 6.7 kg; manual warning 3.8 kg). Unset.
- **Hardware (gimbal/damping/throw_deg/sensor) and control properties** (push, backlit, positions, ways, stages) were not re-researched in this pass. The prior round-3 manual passes already examined these; this pass found no new official evidence for them, and the page-level sources here (product pages) do not state them.

## Platform

No Thrustmaster component record in the audit lacks a platform entry, so nothing was changed there. Platform values were checked against the en-us and eshop pages where available and are consistent: e.g. Neo Ace PS page lists PC/PS4/PS5; Neo Ace Xbox page lists PC/Xbox One/Xbox Series X|S; Viper TQS and Viper Panel list PC only; HOTAS One lists PC and Xbox.

## Validation

- Every `src/content/components/thrustmaster/*.yaml` parsed with PyYAML: 0 failures.
- `pnpm check`: the schema and content run reports no errors for Thrustmaster files, but 234 type errors come from `work/hillclimb/*.js` (other agents' downloads, not part of this pass). The `src/lib/schema.ts` hints are the pre-existing Zod deprecation hints.
