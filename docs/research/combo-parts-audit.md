# Combo-part catalog audit (#15)

Checked 2026-10-25. This is a curated catalog preference, not a claim about measured sales share. Manufacturer bundle contents establish which parts constitute the normal complete product; they do not establish that a part cannot be bought separately. `sold_standalone: false` remains the separate strict restriction.

## Changes

Previous `sold_mainly_in_bundle`: absent for all five records. New value: `true` for:

- `vkb/gladiator-nxt-evo-base`
- `vkb/scg-space-combat-grip-r`
- `vkb/scg-space-combat-grip-l`
- `vkb/scg-standard-grip-gladiator-r`
- `vkb/scg-standard-grip-gladiator-l`

Evidence: [VKB Europe Space Combat Edition](https://flightsimcontrols.com/product/gladiator-evo-space-combat-edition/), Description / Includes and Additional information: package contains one GNX SCG grip and one GNX EVO base; options are Standard/Premium, Left/Right. These correspond to the four existing catalog combos and their component references. The two Premium SCG records are also reused by existing Gunfighter combos; this flag follows the current shared record, so it also hides those shared grip entries by default. It does not assert that all Gunfighter-specific SCG upgrade SKUs are usually bundled. Treating the complete joystick as the default browsing unit follows issue #15's editorial decision. The same listing links a Base Only SKU under Gladiator Accessories; standalone availability is preserved. No price or compatibility facts changed.

## Other audited candidates

- **VKB Gunfighter IV base and Gunfighter grips** (SCG Standard Mk III/IV L/R, MCG Pro Mk III/IV, MCG Ultimate and Mk III add-on, F-14 Mk III/IV add-ons, KG12 Mk III/IV add-ons): retain absent flag. They are separately identified upgrade SKUs; bundle membership alone is insufficient. [VKB stand-alone SCG Gunfighter grip](https://flightsimcontrols.com/product/scg-kosmosima-premium-right-handed/) and the Space Combat Edition's related-products section explicitly distinguish a stand-alone Gunfighter grip from the GNX package. No sales-share evidence supports hiding the modular range.
- **VKB F-14 Combat Grip, KG12 WWII Grip, GNX SCG Premium with OTA L/R**: retain absent flag pending exact revision evidence. Do not extrapolate the SCG decision to a different grip/adapter SKU. Next source: exact regional grip and Omni Throttle listings and their included parts. The complete Omni Throttle records are complete sticks, not bare components to hide.
- **VIRPIL WarBRD-D, MongoosT-50CM3, Constellation ALPHA Prime L/R**: retain absent flag. [WarBRD-D official listing](https://virpil-controls.eu/vpc-warbrd-d-base.html), Details / What's in the Box / Compatibility: base-only package supports numerous VPC and Thrustmaster grips. [ALPHA Prime R listing](https://virpil-controls.eu/vpc-constellation-alpha-prime-r.html), product summary: requires a separately sold base. This supports keeping modular purchase choices visible even when catalog HOTAS/HOSAS bundles include them. Left/right share the same product range; no measured majority-bundle claim is made.
- **VIRPIL other bases/grips** (ATLAS/ATLAS Pro, Rotor TCS/upgraded, CDT Aero L/R, Archer SF, Flanker, Hawk-60, Dual-SF, Sharka-50, VECTOR yoke base, B-Jet and Constellation Vega handles): no flag added. Existing catalog has no containing combo for these exact IDs, so hiding them would remove their only main-catalog discovery path. Their purchasing pattern remains unresolved; next source is exact official SKU/package contents, not another brand's bundle policy.
- **MOZA AB9, MH16**: retain absent flag. [AB9 official EU listing](https://eu.mozaracing.com/products/ab9-base), Recommended for Full Compatibility: MHG, MH16 and MA3X are separately selectable additions; Open Ecosystem Compatibility supports other makers' grips. [MH16 official support](https://support.mozaracing.com/en/support/solutions/articles/70000679587-moza-mh16-flightstick-support), In the Box and compatibility: grip package, usable with AB9 and other bases. Bundle existence does not justify hiding either.
- **MOZA AB6, MHG, MA3X**: retain absent flag. [AB6 official support](https://support.mozaracing.com/en/support/solutions/articles/70000684201-ab6-force-feedback-base), compatible grips / package: base supports multiple grips and third-party interfaces; [grip setup guide](https://support.mozaracing.com/en/support/solutions/articles/70000684207-flight-stick-grip-setup-guide) identifies multiple compatible grip choices. Frequency of complete-bundle purchases remains unresolved, so no preference is inferred.
- **MOZA AY210 and MFY handle**: retain absent flag pending exact bundle-versus-upgrade evidence. Catalog bundle membership identifies a candidate, not sales predominance. **AY90, MFY Pro**: no containing catalog combo for those exact IDs; retain. Next source: exact AY210 bundle contents and separately offered handle/base listings.

The seven existing Logitech `sold_standalone: false` records are also hidden under the toggle without any data changes. Parts remain in the catalog API, compare selection, and detail routes; only the main catalog filter changes. Non-core panels/accessories stay excluded by the existing visibility policy. Reverse combo links include only listed bundles.
