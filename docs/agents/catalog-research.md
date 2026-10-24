# Catalog research workflow

## Bound the research

Select exact products and unresolved fields from current YAML and the relevant audit. For each task, define the SKU/revision, region where relevant, source to investigate, and expected output. Group related findings before assigning changes; use existing issues and the issue-tracker conventions to avoid duplicate work.

For an extended research run, finish each batch with supported corrections, remaining uncertainties, and the next distinct source worth investigating. Continue within the authorized scope while useful leads remain. When sources are exhausted, report that limit with evidence; repeated searches and lower unknown counts are not completion criteria.

## Preserve evidence and uncertainty

- Verify specifications and prices against exact manufacturer listings, manuals, or diagrams. Record source URLs, check dates, and the relevant page, section, or excerpt for non-obvious claims.
- Use reviews and transcripts for attributed opinions and research leads. Confirm prices and specifications against appropriate primary evidence before treating them as verified facts. Check consequential transcript ambiguities against the audio or another primary source.
- Preserve unknown, unsupported, and conflicting states distinctly. Missing evidence does not establish false, zero, or incompatibility. A complete physical inventory does not verify every optional property or the entire product record.
- Match product identity before transferring facts: handedness, Standard/Premium, hardware revision, standalone component versus bundle, and regional SKU can matter.
- Distinguish physical controls from electrical contacts and software mappings; installed controls from spare modules; and bare hardware dimensions/weight from packaged or bundle totals. Follow the current schema and control-inventory tests. The [integration review](../research/controls-integration-review.md) contains worked examples.
- For prices, preserve currency, region, VAT treatment, price basis, and exact listing. Separate deposits, sale/street prices, and full purchase prices. Treat blocked or JavaScript-only pages as unverifiable until inspected, rather than declaring their products unavailable.

## Integrate and verify

For each changed field, provide the previous value, proposed value, and evidence. Retain conflicts when the evidence cannot resolve them. Inspect affected bundle references, derived counts, regional displays, and images as applicable, using the [delivery workflow](delivery.md).

Research is complete when the assigned fields have supported corrections or explicit unresolved outcomes with reasons and useful next actions. The coordinating agent checks the evidence and combined result before reporting completion.

## Freshness and recurring audits

Prefer automated detection that produces a deduplicated report or proposed diff. Keep fast deterministic content checks separate from network checks. Classify blocked requests and ambiguous redirects separately from confirmed broken links.

Use existing tickets for integrity checks, link health, price refresh, and price history. Implement and validate the checks before scheduling them; introduce recurring work only when requested. Keep editorial verdicts and disputed evidence visible for maintainer judgment.
