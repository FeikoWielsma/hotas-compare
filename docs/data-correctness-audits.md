# Data correctness checks and audits

Run `pnpm test` for offline validation: schema parsing, normalized product names, shared manufacturer product pages, store/region VAT consistency, placeholder URLs across all collections, public images, bundle component ids, and reviewer ids. Shared manuals, homepages, category pages, and explicitly different Left/Right/Standard/Premium versions are not duplicate products. `src/lib/fixtures/shared-product-pages.json` records exact existing shared system/part source exceptions; new products do not inherit them. Store VAT is checked within each region because US sales tax and European VAT conventions differ.

`pnpm audit:bundles` compares the lowest displayed regional bundle price with the sum of the lowest displayed component prices, including EU/UK VAT estimates. It reports every positive difference and discounts of at least 20%, without failing. Missing regional prices and mixed currencies are skipped. Component references are counted as listed (repeated ids count repeatedly); no quantities, mounting extras, shipping, import charges, or simultaneous stock availability are inferred. Recorded prices may be stale.

`pnpm audit:links` checks unique price URLs, product sources, image sources, external review URLs, and reviewer profile URLs. It uses HEAD and falls back to GET for errors or homepage redirects, with a custom user agent, two workers per host, 250ms pacing, 12 global requests, and a 12-second timeout per attempt. Reports are grouped by content file. Access restrictions (401/403/429), transport errors, and successful WINCTRL/Winwing responses needing manual verification are unverifiable. This deliberately conservative host classification also includes their static downloads. Other non-2xx responses and product-to-homepage redirects are reported broken. The script is independent of the normal test suite and does not edit content.

## Run on 2026-10-24

- Offline checks: no confirmed existing data errors. Existing shared source pages describe system parts, bundle contents, variants, or related ecosystem evidence; these are explicitly retained rather than deleting products or evidence.
- Price migrations: `src/content/components/turtle-beach/velocityone-flightstick.yaml` (Tweakers Pricewatch), `src/content/components/turtle-beach/velocityone-flightdeck.yaml` (Street price (fluctuates)), and `src/content/bundles/thrustmaster/t16000m-fcs-hotas.yaml` (Street price) now declare `kind: street`. Other entries default to `official`.
- Bundle audit: 176 bundle/region comparisons; 37 above parts; 50 discounts >=20%; 17 skipped. Some differences are only 0.01–0.02. Large apparent premiums include VKB triple-THQ combinations; their component lists may omit quantities or extras, so these are review signals, not verified savings opportunities. No bundle data was changed from this report.
- Link audit: 1,044 unique URLs on 41 hosts; 642 OK, 16 broken (all HTTP 404), 386 unverifiable. No data was changed from this report. Unverifiable responses require manual checking; a successful request does not verify the page's price or stock.

### Broken links

- `src/content/bundles/virpil/alpha-prime-hosas-bundle.yaml`: https://virpil-controls.eu/products/alpha-prime-hosas-bundle (HTTP 404).
- `src/content/bundles/virpil/alpha-prime-warbrd-d-hotas.yaml`: https://virpil-controls.eu/products/alpha-prime-warbrd-d-hotas (HTTP 404).
- `src/content/bundles/vkb/gnx-triple-thq-sem-v-combo.yaml`: https://flightsimcontrols.com/product/gnx-triple-thq-sem-v-combo/ (HTTP 404).
- `src/content/components/thrustmaster/tpr-pendular-rudder.yaml`: https://www.thrustmaster.com/en-us/products/tpr-pendular-rudder/ (HTTP 404).
- `src/content/components/thrustmaster/warthog-base.yaml`: https://www.thrustmaster.com/en-us/products/hotas-warthog-mk-ii-base/ (HTTP 404).
- `src/content/components/thrustmaster/warthog-stick-grip.yaml`: https://www.thrustmaster.com/en-us/products/hotas-warthog-mk-ii/ (HTTP 404).
- `src/content/components/virpil/constellation-alpha-prime-l.yaml`: https://virpil-controls.eu/products/vpc-constellation-alpha-prime-l (HTTP 404).
- `src/content/components/virpil/mongoost-50cm3-base.yaml`: https://virpil-controls.eu/products/vpc-mongoost-50cm3-base (HTTP 404).
- `src/content/components/virpil/mongoost-50cm3-throttle.yaml`: https://virpil-controls.eu/vpc-mongoost-50cm3-throttle.html (HTTP 404).
- `src/content/components/virpil/vpc-ace-interceptor-pedals.yaml`: https://virpil-controls.eu/products/vpc-ace-interceptor-pedals (HTTP 404).
- `src/content/components/virpil/vpc-ace-torq-pedals.yaml`: https://virpil-controls.eu/products/vpc-ace-torq-pedals (HTTP 404).
- `src/content/components/virpil/vpc-control-panel-1.yaml`: https://virpil-controls.eu/products/vpc-universal-control-panel-1 (HTTP 404).
- `src/content/components/vkb/stecs-modern-throttle-grip-premium-combo.yaml`: https://flightsimcontrols.com/product/stecs-modern-throttle-grip-premium-combo/ (HTTP 404).
- `src/content/components/vkb/stecs-modern-throttle-grip-standard-combo.yaml`: https://flightsimcontrols.co.uk/product/stecs-modern-throttle-grip-standard-combo/ (HTTP 404).
- `src/content/components/vkb/stecs-modern-throttle-grip-standard-combo.yaml`: https://flightsimcontrols.com/product/stecs-modern-throttle-grip-standard-combo/ (HTTP 404).
- `src/content/components/vkb/stecs-space-throttle-system-mini-r.yaml`: https://flightsimcontrols.co.uk/product/stecs-space-throttle-system-mini-right-hand/ (HTTP 404).
