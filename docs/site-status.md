# Site status — 2026-10-21

The public catalog, product and brand pages, comparison, regional pricing,
search and setup guide are implemented. Remaining work is primarily content
validation, production editing and release automation. This is a usable
catalog, but editorial and specification data is not fully signed off.

## Current inventory

Counted from current YAML after the rounds 6–7 refresh. These figures
supersede older handover and unknowns-report totals.

| Measure | Current state |
| --- | ---: |
| Products | 320 |
| Components / bundles | 247 / 73 |
| Brands / curated setups | 10 / 10 |
| Products marked verified / draft | 18 / 302 |
| Complete / partial component control inventories | 196 / 51 |
| Recorded regional prices | 856 of 960 product-region slots |
| Missing EU / UK / US price slots | 21 / 64 / 19 |
| Products with no price in any region | 9 |
| Recorded prices older than 90 days | 0 |
| Products with / without a verdict | 66 / 254 |
| Verdicts marked hands-on | 18 |
| Products with external reviews | 20 |
| Literal placeholder review URLs containing `sample` | 13 |

Missing prices include discontinued items, historical bundles and unavailable
regions. Do not fill them with currency conversions or related-product prices.
Fresh verification dates do not replace a source-quality review.

## Next priorities

1. **Validate editorial claims and review links.** Replace or remove the 13
   literal `sample-*` video links. Confirm the 18 hands-on labels and ownership
   hours with the author; manufacturer research cannot establish personal
   testing. Review specification-based verdicts and scores before treating
   them as independent recommendations. Write owner-approved verdicts for the
   most important buying choices first; all 254 missing verdicts need not
   block a useful launch. Revalidate the 10 curated setups against the expanded
   catalog: the live modern-jet mid-budget reference warns about an unpaired
   base/grip and lacks documented yaw control, even though the custom
   recommendation can produce a complete, budgeted setup.

2. **Finish important physical control inventories.** There are 51 partial
   component inventories. Start with MOZA MTP/MTQ/AY210, Honeycomb Bravo lever
   contacts and Echo, WINCTRL HUD/KA-50/ViperAce EX, Logitech panels, and
   Thrustmaster hat ways, SKY YOKE, Boeing yoke and Warthog switch behavior.
   Exact unresolved fields and evidence are in product YAML and the
   [rounds 6–7 handover](handover-hillclimb.md). Keep conflicting or unpublished
   facts unknown. Review the 302 draft products for sign-off, especially VKB;
   a complete physical inventory does not verify every product field.

3. **Make production editing work safely.** `/keystatic` returned HTTP 404 on
   the existing public deployment during this audit. The repository builds
   server routes, while the observed deployment is Cloudflare Pages.
   Reconcile the Pages and Worker paths, verify server routes and the GitHub
   app configuration, then test an authenticated editor save. Change nullable
   boolean editor controls to preserve unknown values; checkboxes currently
   collapse unknown and false, including standalone USB. Do this before
   relying on the CMS for editing.

4. **Add automated release gates.** No GitHub Actions workflows or runs are
   present. The Cloudflare Pages build check exists, but type checks, Vitest,
   image/reference integrity and stale-price/draft reports need an explicit
   automated gate. Record Pages build settings and production routing
   alongside the existing Wrangler configuration.

5. **Reduce public page payloads.** The existing catalog, compare and wizard
   returned roughly 2.7–3.5 MB of uncompressed HTML. The rebuilt catalog API is
   about 1.54 MB uncompressed. Share a compact client projection, avoid
   repeating full inventories in island props, and measure mobile performance.
   The 2.78 MB Keystatic JavaScript chunk is an editor concern, not a
   public-page download.

6. **Close scope and evidence gaps deliberately.** Decide which passive
   accessories belong in the catalog and add an accessory category if needed;
   the handover lists roughly 70 VKB accessories plus MOZA AMPCD/FMP18 and
   other omissions for review. Resolve exact SKU identities before adding
   records. Fill useful platform and regional-sales gaps from exact sources;
   keep dimensions and weights behind physical controls in priority.

## Other source-data gaps

The existing unknowns-audit collector, run read-only against current YAML,
counts 290 unknown platform fields, 978 optional control behavior/location
fields, 1,159 hardware fields, 328 physical fields, 64 software names,
58 USB-connector fields and 8 standalone-USB fields.

These are raw missing keys, not independent research tasks. Some optional
properties and mechanical-accessory fields do not apply. The historical
[per-product unknowns report](catalog-unknowns.md) predates the latest refresh;
use current YAML and recent research notes when choosing a task.

## Release validation

- `pnpm check`: passed, zero errors/warnings, four existing Zod hints.
- `pnpm test`: all 45 tests across seven files passed.
- `pnpm build`: passed; Pagefind indexed 334 pages. The existing large-chunk
  warning remains.
- Static asset audit found two missing VIRPIL image targets. This release
  restores the official CM3 throttle photograph and corrects the VMAX Prime
  reference to the existing PNG. The rebuilt 335 HTML files have no missing
  internal link or asset targets (dynamic CMS/image routes excluded).
- Existing public home, compare, wizard, brands, Flightstick II detail,
  sitemap, robots and Pagefind endpoints returned HTTP 200; an unknown page
  returned HTTP 404. Production CMS access remains the separate issue above.
- Live browser checks confirmed search results, shared comparison selection
  and restored wizard recommendations. The sampled compare and wizard pages
  had no page-level horizontal overflow at the desktop viewport.

The Cloudflare Pages GitHub integration starts a deployment on a push to
`main`. A successful check and verification of the custom domain's catalog
confirm a release is live; a local build alone does not establish deployment.
