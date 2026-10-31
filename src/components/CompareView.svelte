<script lang="ts">
  import { onMount } from 'svelte';
  import { controlTypes, inventoryCount, inventoryDetail } from '../lib/control-inventory';
  import type { CatalogItem } from '../lib/catalog';
  import { platforms, platformSupport } from '../lib/platforms';
  import { itemCategoryLabel, detailHref, formatAmount, productImageSrc, useCases, resolveItemRegion } from '../lib/catalog-ui';
  import { compareStore, MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  import { regionStore } from '../lib/stores/region.svelte';
  import { humanize, placementLabels, statusLabels } from '../lib/labels';
  import { gimbalLabels } from '../lib/glossary';
  let { initialItems }: { initialItems: CatalogItem[] } = $props();
  let highlight = $state(false);
  let onlyDifferences = $state(false);
  let message = $state('');
  const selected = $derived(compareStore.items.map((id) => {
    const item = initialItems.find((entry) => entry.id === id);
    return { id, item: item ? resolveItemRegion(item, regionStore.region) : null };
  }));
  const available = $derived(initialItems.filter((item) => !compareStore.hasItem(item.id)));
  const emptySlots = $derived(MAX_COMPARE_ITEMS - selected.length);
  type Row = { label: string; value: (item: CatalogItem) => string | number };
  const rating = (value: number | undefined) => value == null ? 'Not rated' : `${Number(value.toFixed(1))} / 5`;
  const addFrom = (event: Event & { currentTarget: HTMLSelectElement }) => { const id = event.currentTarget.value; if (id) compareStore.addItem(id); event.currentTarget.value = ''; };
  const groups: { title: string; rows: Row[] }[] = [
    { title: 'Price', rows: [
      { label: 'Amount', value: formatAmount },
      { label: 'Tax', value: (i) => i.resolvedPrice.price ? i.resolvedPrice.price.vatEstimated ? 'Includes VAT (estimated)' : i.resolvedPrice.price.incl_vat ? 'Includes VAT' : 'Excludes tax' : 'Unknown' },
      { label: 'Price checked', value: (i) => i.resolvedPrice.price ? `${i.resolvedPrice.price.verified}${i.resolvedPrice.isStale ? ' · over 90 days old' : ''}` : 'No regional price' },
    ] },
    { title: 'Flying-style fit', rows: useCases.map(({ key, label }) => ({ label, value: (i: CatalogItem) => rating(i.use_case_fit[key]) })) },
    { title: 'Overview', rows: [
      { label: 'Category', value: (i) => itemCategoryLabel(i) },
      { label: 'Handedness', value: (i) => i.handedness.map(humanize).join(' / ') || 'Not applicable' },
      { label: 'Availability', value: (i) => statusLabels[i.status] },
      { label: 'Data status', value: (i) => i.verification === 'verified' ? 'Editor verified' : 'Draft specifications' },
      { label: 'Latest review', value: (i) => i.latestReview ? `${i.latestReview.reviewerName}: ${i.latestReview.tag}
${i.latestReview.summary}` : 'Not reviewed' },
    ] },
    { title: 'Platform compatibility', rows: [
      ...platforms.map(({ key, label }) => ({ label, value: (i: CatalogItem) => platformSupport(i.platform_compatibility, key) })),
      { label: 'Compatibility notes', value: (i) => i.platform_compatibility?.notes ?? 'No additional notes' },
    ] },
    { title: 'Hardware & Mechanics', rows: [
      { label: 'Placement', value: (i) => i.placement ? placementLabels[i.placement] : 'Unknown' },
      { label: 'Gimbal type', value: (i) => i.gimbalType ? gimbalLabels[i.gimbalType] : 'Unknown' },
      { label: 'Gimbal', value: (i) => i.gimbal?.split(', ').map(humanize).join(', ') ?? 'Unknown' },
      { label: 'Rudder', value: (i) => i.needsPedals ? 'No twist axis · needs pedals' : 'Twist or rudder axis, or not a complete stick' },
      { label: 'Primary Sensor', value: (i) => i.sensor?.split(', ').map(humanize).join(', ') ?? 'Unknown' },
      { label: 'Axes', value: (i) => i.totalAxes === 0 && !i.axisCountKnown ? 'Unknown' : i.totalAxes }, { label: 'Force Adjustable', value: (i) => i.mechanics.forceAdjustable },
      { label: 'Swappable Cams', value: (i) => i.mechanics.cams }, { label: 'Clutches / Damping', value: (i) => i.mechanics.damping },
    ] },
    { title: 'Physical controls · counts & locations', rows: [
      { label: 'Estimated logical inputs', value: (i) => `${i.totalLogicalButtons} · software mapping may vary` },
      { label: 'Grip push buttons', value: (i) => inventoryCount(i.controlSections ?? [], 'button', 'grip') },
      { label: 'Base push buttons', value: (i) => inventoryCount(i.controlSections ?? [], 'button', 'base') },
      { label: 'Handle push buttons', value: (i) => inventoryCount(i.controlSections ?? [], 'button', 'handle') },
      { label: 'Panel push buttons', value: (i) => inventoryCount(i.controlSections ?? [], 'button', 'panel') },
      ...controlTypes.map(({ type, label }) => ({ label, value: (i: CatalogItem) => inventoryCount(i.controlSections ?? [], type) })),
    ] },
    { title: 'Controls · directions & behavior', rows: controlTypes.map(({ type, label }) => ({ label, value: (i: CatalogItem) => inventoryDetail(i.controlSections ?? [], type) })) },
  ];
  function differs(row: Row) {
    const values = selected.flatMap(({ item }) => item ? [row.value(item)] : []);
    return values.length > 1 && new Set(values).size > 1;
  }
  /** With "Only differences" on, drop rows where every compared item has the same value, and empty groups. */
  const visibleGroups = $derived(onlyDifferences && selected.length > 1
    ? groups.map((group) => ({ ...group, rows: group.rows.filter(differs) })).filter((group) => group.rows.length)
    : groups);
  async function copyLink() {
    const url = new URL('/compare', location.origin);
    url.searchParams.set('items', compareStore.items.join(','));
    try { await navigator.clipboard.writeText(url.href); message = 'Share link copied.'; }
    catch { message = `Copy this share link: ${url.href}`; }
  }
  onMount(() => { regionStore.init(); compareStore.init(); });
</script>

<div class="toolbar"><button type="button" class:active={highlight} aria-pressed={highlight} onclick={() => highlight = !highlight}>Highlight differences</button><button type="button" class:active={onlyDifferences} aria-pressed={onlyDifferences} disabled={selected.length < 2} onclick={() => onlyDifferences = !onlyDifferences}>Only differences</button><button type="button" onclick={copyLink}>↗ Copy share link</button><span>{regionStore.region} / {regionStore.currency} · {selected.length} of 4 products</span></div>
{#if message}<p class="message" role="status">{message}</p>{/if}
{#if !selected.length}<div class="empty"><h2>Your comparison starts here.</h2><p>Add hardware below, or <a href="/">explore the catalog</a> and select “+ Compare”.</p></div>{/if}
{#if emptySlots > 0 && selected.length}<label class="phone-add">Add hardware<select value="" onchange={addFrom}><option value="">Choose an item…</option>{#each available as item}<option value={item.id}>{item.brandName} · {item.name}</option>{/each}</select></label>{/if}
<div class="matrix" class:unused={!selected.length} role="region" aria-label="Hardware comparison matrix, scroll horizontally to see all four slots" tabindex="0">
  <table class:single={selected.length === 1} style={`--cols: ${selected.length}`}><caption class="sr-only">Hardware comparison in {regionStore.region}. Unknown specifications are not confirmed. Flying-style fit is rated out of five.</caption>
    <thead><tr><th scope="col" class="corner"><span>Specifications</span></th>
      {#each selected as { id, item } (id)}<th scope="col"><div class="column-head"><span class="brand">{item?.brandName ?? 'Unavailable item'}</span><button type="button" class="remove" aria-label={`Remove ${item?.name ?? id} from comparison`} onclick={() => compareStore.removeItem(id)}>×</button></div>{#if item}{@const photo = productImageSrc(item.images[0]?.file)}{#if photo}<img class="column-photo" src={photo} alt="" />{/if}<a class="product" href={detailHref(item)}>{item.name} ↗</a><span class="badge">{itemCategoryLabel(item)}</span><strong class="head-price">{formatAmount(item)}</strong>{:else}<p class="unknown">This item is no longer in the catalog: {id}</p>{/if}</th>{/each}
      {#each Array(emptySlots) as _, index}<th scope="col" class="slot"><label for={`slot-${index}`}>Add hardware<select id={`slot-${index}`} value="" onchange={addFrom}><option value="">Choose an item…</option>{#each available as item}<option value={item.id}>{item.brandName} · {item.name}</option>{/each}</select></label><p>Product {selected.length + index + 1} of 4</p></th>{/each}
    </tr></thead>
    {#each visibleGroups as group}<tbody><tr class="group"><th colspan="5" scope="colgroup">{group.title}</th></tr>{#each group.rows as row}<tr class:different={highlight && differs(row)}><th scope="row"><span class="row-label">{row.label}{#if highlight && differs(row)}<span class="difference-mark" aria-label="Different values"> ●</span>{/if}</span></th>{#each selected as { id, item } (id)}<td>{item ? row.value(item) : 'Unavailable'}</td>{/each}{#each Array(emptySlots) as _}<td class="placeholder">—</td>{/each}</tr>{/each}</tbody>{/each}
  </table>
</div>
<p class="footnote">Control counts reflect documented hardware; missing details may be unlisted. Logical inputs are estimates, and software mappings vary. Ratings run from 1 (limited fit) to 5 (excellent fit); bundle fit averages its components. Prices last checked over 90 days ago are marked.</p>

<style>
  .toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; margin-bottom: 1rem; font-family: var(--font-sans); } button { cursor: pointer; background: var(--color-surface); border: 1px solid var(--color-rule); color: var(--color-ink); padding: .75rem 1rem; min-height: 44px; border-radius: 2px; font: .875rem var(--font-sans); } button:hover, button.active { border-color: var(--color-accent); color: var(--color-accent); } button.active { background: color-mix(in srgb, var(--color-accent) 7%, var(--color-surface)); } .toolbar > span { margin-left: auto; font-size: .8125rem; color: var(--color-muted); }
  .message { overflow-wrap: anywhere; color: var(--color-accent); font-size: .875rem; } .matrix { overflow: auto; max-height: calc(100dvh - 1rem); border: 1px solid var(--color-rule); border-radius: 2px; color: var(--color-ink); } table { width: 100%; min-width: 1150px; table-layout: fixed; border-collapse: separate; border-spacing: 0; background: var(--color-surface); font-family: var(--font-sans); } th, td { padding: 1rem; text-align: left; vertical-align: top; border-bottom: 1px solid var(--color-rule); border-right: 1px solid var(--color-rule); overflow-wrap: anywhere; white-space: pre-line; } th:last-child, td:last-child { border-right: 0; } thead th { position: sticky; top: 0; z-index: 2; height: auto; padding-block: .5rem; background: var(--color-surface); box-shadow: 0 1px var(--color-rule); } thead .corner { left: 0; z-index: 3; } .head-price { display: block; margin-top: .25rem; font-size: .9375rem; font-variant-numeric: tabular-nums; } thead th:first-child { width: 200px; } tbody th { font-size: .875rem; line-height: 1.6; font-weight: 500; color: var(--color-muted); position: sticky; left: 0; background: var(--color-surface); z-index: 1; } td { font: .875rem/1.7 var(--font-sans); font-variant-numeric: tabular-nums; } .group th { position: static; background: var(--color-paper); color: var(--color-ink); font: 600 1.5rem/1.2 var(--font-display); padding-block: 1rem; } .different td, .different th { background: color-mix(in srgb, var(--color-accent) 9%, var(--color-surface)); } .difference-mark { color: var(--color-accent); }
  .column-photo { display: block; width: 100%; height: 64px; object-fit: contain; background: #fff; margin-bottom: .35rem; } .column-head { display: flex; align-items: center; justify-content: space-between; gap: .5rem; } .brand, .corner > span { color: var(--color-accent); font: 600 .875rem var(--font-sans); } .remove { padding: .15rem .4rem; min-width: 44px; font-size: 1.25rem; border: 0; background: none; color: var(--color-muted); } .product { display: block; font: 600 .9375rem/1.3 var(--font-sans); text-decoration: none; margin: .25rem 0; color: var(--color-ink); } .product:hover { color: var(--color-accent); } .badge { color: var(--color-muted); font: 400 .8125rem var(--font-sans); } .slot label { display: grid; gap: .9rem; font: 500 .875rem var(--font-sans); color: var(--color-ink); } select { width: 100%; min-width: 0; background: var(--color-paper); color: var(--color-ink); border: 1px solid var(--color-rule); padding: .65rem; font: .875rem var(--font-sans); } .slot p { color: var(--color-muted); font: 400 .8125rem var(--font-sans); } .placeholder { color: var(--color-muted); } .empty { border: 1px solid var(--color-rule); border-left: 3px solid var(--color-accent); background: var(--color-surface); padding: 1rem 1.5rem; margin-bottom: 1.5rem; } .empty h2 { font: 600 2rem/1.15 var(--font-display); margin-top: .5rem; color: var(--color-ink); } .empty p, .footnote, .unknown { color: var(--color-muted); font: .875rem/1.7 var(--font-sans); } .footnote { max-width: 850px; } .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  :is(button, select, a, .matrix):focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
  .phone-add { display: none; }
  /* Phones: the row label sits above its values, so two products fit side by side; three or four scroll. */
  @media (max-width: 640px) {
    .toolbar { gap: .5rem; } .toolbar button { flex: 1 1 auto; padding: .5rem .6rem; font-size: .8125rem; } .toolbar > span { width: 100%; margin: 0; } .column-photo { height: 48px; }
    .phone-add { display: grid; gap: .35rem; margin-bottom: .75rem; font: 500 .875rem var(--font-sans); color: var(--color-ink); } .phone-add select { min-height: 44px; }
    .matrix.unused, thead .corner, .slot, .placeholder { display: none; }
    table { display: block; width: max-content; min-width: 100%; } tbody { display: block; } thead { display: block; position: sticky; top: 0; z-index: 2; } thead th { position: static; box-shadow: none; }
    tr { display: grid; grid-template-columns: repeat(var(--cols), calc(50vw - 1.1rem)); } .single { width: 100%; } .single tr { grid-template-columns: 1fr; }
    tbody th { grid-column: 1 / -1; position: static; padding: .5rem .75rem 0; border: 0; } .group th { padding-block: .6rem; font-size: 1.15rem; border-bottom: 1px solid var(--color-rule); }
    .row-label { position: sticky; left: .75rem; display: inline-block; } td { padding: .15rem .75rem .6rem; } th, td { min-width: 0; }
  }
</style>
