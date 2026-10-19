<script lang="ts">
  import { onMount } from 'svelte';
  import { controlTypes, inventoryCount, inventoryDetail, inventoryComplete } from '../lib/control-inventory';
  import type { CatalogItem } from '../lib/catalog';
  import { categoryLabels, detailHref, formatAmount, productImageSrc, useCases, resolveItemRegion } from '../lib/catalog-ui';
  import { compareStore, MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  import { regionStore } from '../lib/stores/region.svelte';
  let { initialItems }: { initialItems: CatalogItem[] } = $props();
  let highlight = $state(false);
  let message = $state('');
  const selected = $derived(compareStore.items.map((id) => {
    const item = initialItems.find((entry) => entry.id === id);
    return { id, item: item ? resolveItemRegion(item, regionStore.region) : null };
  }));
  const available = $derived(initialItems.filter((item) => !compareStore.hasItem(item.id)));
  const emptySlots = $derived(MAX_COMPARE_ITEMS - selected.length);
  type Row = { label: string; value: (item: CatalogItem) => string | number };
  const rating = (value: number | undefined) => value == null ? 'Not reviewed' : `${Number(value.toFixed(1))} / 5`;
  const groups: { title: string; rows: Row[] }[] = [
    { title: 'Overview', rows: [
      { label: 'Brand', value: (i) => i.brandName }, { label: 'Name', value: (i) => i.name },
      { label: 'Category', value: (i) => categoryLabels[i.category] }, { label: 'Verification', value: (i) => i.verification === 'verified' ? 'Verified' : 'Draft' },
      { label: 'Handedness', value: (i) => i.handedness.join(' / ') || 'Not applicable' },
    ] },
    { title: 'Pricing in active region', rows: [
      { label: 'Amount', value: formatAmount }, { label: 'Currency', value: (i) => i.resolvedPrice.price?.currency ?? 'Unavailable' },
      { label: 'Tax', value: (i) => i.resolvedPrice.price ? i.resolvedPrice.price.incl_vat ? 'Includes VAT' : 'Excludes tax' : 'Unknown' },
      { label: 'Freshness', value: (i) => i.resolvedPrice.price ? `${i.resolvedPrice.isStale ? 'Stale (>90 days)' : 'Current'} · ${i.resolvedPrice.price.verified}` : 'No regional price' },
    ] },
    { title: 'Hardware & Mechanics', rows: [
      { label: 'Gimbal', value: (i) => i.gimbal?.replaceAll('_', ' ') ?? 'Unknown' },
      { label: 'Primary Sensor', value: (i) => i.sensor?.replaceAll('_', ' ') ?? 'Unknown' },
      { label: 'Axes', value: (i) => i.totalAxes }, { label: 'Force Adjustable', value: (i) => i.mechanics.forceAdjustable },
      { label: 'Swappable Cams', value: (i) => i.mechanics.cams }, { label: 'Clutches / Damping', value: (i) => i.mechanics.damping },
    ] },
    { title: 'Physical controls · counts & locations', rows: [
      { label: 'Inventory coverage', value: (i) => inventoryComplete(i.controlSections ?? []) ? 'Checked inventory' : 'Partial · missing does not mean absent' },
      { label: 'Estimated logical inputs', value: (i) => i.totalLogicalButtons === 0 && !inventoryComplete(i.controlSections ?? []) ? 'Not documented' : `${i.totalLogicalButtons} · software mapping may vary` },
      { label: 'Grip push buttons', value: (i) => inventoryCount(i.controlSections ?? [], 'button', 'grip') },
      { label: 'Base push buttons', value: (i) => inventoryCount(i.controlSections ?? [], 'button', 'base') },
      { label: 'Handle push buttons', value: (i) => inventoryCount(i.controlSections ?? [], 'button', 'handle') },
      { label: 'Panel push buttons', value: (i) => inventoryCount(i.controlSections ?? [], 'button', 'panel') },
      ...controlTypes.map(({ type, label }) => ({ label, value: (i: CatalogItem) => inventoryCount(i.controlSections ?? [], type) })),
    ] },
    { title: 'Every input · directions, pressability & behavior', rows: controlTypes.map(({ type, label }) => ({ label, value: (i: CatalogItem) => inventoryDetail(i.controlSections ?? [], type) })) },
    { title: 'Use Case Fit', rows: useCases.map(({ key, label }) => ({ label, value: (i: CatalogItem) => rating(i.use_case_fit[key]) })) },
    { title: 'Editorial Verdict & Scores', rows: [
      { label: 'Verdict', value: (i) => i.verdict?.take ?? 'Not reviewed' },
      ...(['build', 'feel', 'value', 'software', 'qc_support'] as const).map((key) => ({ label: key === 'qc_support' ? 'QC Support' : key[0].toUpperCase() + key.slice(1), value: (i: CatalogItem) => rating(i.scores?.[key]) })),
    ] },
  ];
  function differs(row: Row) {
    const values = selected.flatMap(({ item }) => item ? [row.value(item)] : []);
    return values.length > 1 && new Set(values).size > 1;
  }
  async function copyLink() {
    const url = new URL('/compare', location.origin);
    url.searchParams.set('items', compareStore.items.join(','));
    try { await navigator.clipboard.writeText(url.href); message = 'Share link copied.'; }
    catch { message = `Copy this share link: ${url.href}`; }
  }
  onMount(() => { regionStore.init(); compareStore.init(); });
</script>

<div class="toolbar"><button type="button" class:active={highlight} aria-pressed={highlight} onclick={() => highlight = !highlight}>◈ Highlight differences</button><button type="button" onclick={copyLink}>↗ Copy share link</button><span>{regionStore.region} / {regionStore.currency} · {selected.length} OF 4 SLOTS</span></div>
{#if message}<p class="message" role="status">{message}</p>{/if}
{#if !selected.length}<div class="empty"><h2>Your comparison starts here.</h2><p>Add hardware below, or <a href="/">explore the catalog</a> and select “+ Compare”.</p></div>{/if}
<div class="matrix" role="region" aria-label="Hardware comparison matrix, scroll horizontally to see all four slots" tabindex="0">
  <table><caption class="sr-only">Hardware comparison in {regionStore.region}. Unknown specifications are not confirmed. Use case and editorial ratings are out of five.</caption>
    <thead><tr><th scope="col" class="corner"><span>SPECIFICATION</span><p>Flight hardware<br />at a glance.</p></th>
      {#each selected as { id, item } (id)}<th scope="col"><div class="column-head"><span class="brand">{item?.brandName ?? 'Unavailable item'}</span><button type="button" class="remove" aria-label={`Remove ${item?.name ?? id} from comparison`} onclick={() => compareStore.removeItem(id)}>×</button></div>{#if item}{@const photo = productImageSrc(item.images[0]?.file)}{#if photo}<img class="column-photo" src={photo} alt="" />{/if}<a class="product" href={detailHref(item)}>{item.name} ↗</a><span class="badge">{categoryLabels[item.category]}</span>{:else}<p class="unknown">This item is no longer in the catalog: {id}</p>{/if}</th>{/each}
      {#each Array(emptySlots) as _, index}<th scope="col" class="slot"><label for={`slot-${index}`}>+ ADD HARDWARE<select id={`slot-${index}`} value="" onchange={(event) => { const id = event.currentTarget.value; if (id) compareStore.addItem(id); event.currentTarget.value = ''; }}><option value="">Choose an item…</option>{#each available as item}<option value={item.id}>{item.brandName} · {item.name}</option>{/each}</select></label><p>Slot {selected.length + index + 1} / 4</p></th>{/each}
    </tr></thead>
    {#each groups as group}<tbody><tr class="group"><th colspan="5" scope="colgroup">{group.title}</th></tr>{#each group.rows as row}<tr class:different={highlight && differs(row)}><th scope="row">{row.label}{#if highlight && differs(row)}<span class="difference-mark" aria-label="Different values"> ●</span>{/if}</th>{#each selected as { id, item } (id)}<td>{item ? row.value(item) : 'Unavailable'}</td>{/each}{#each Array(emptySlots) as _}<td class="placeholder">—</td>{/each}</tr>{/each}</tbody>{/each}
  </table>
</div>
<p class="footnote">Control counts cover recorded physical hardware. Undocumented controls and unknown pressability are unconfirmed. Logical inputs are estimates, not manufacturer binding totals. Ratings: 1 = limited fit, 5 = excellent fit. Bundle fit averages its components. Unknown means unconfirmed; editorial scores appear only when reviewed. Prices over 90 days old are marked stale.</p>

<style>
  .toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; margin-bottom: 1rem; } button { cursor: pointer; background: var(--bg-panel); border: 1px solid var(--border-cockpit); color: var(--text-primary); padding: .75rem 1rem; border-radius: 3px; font: .75rem var(--font-mono); } button:hover, button.active { border-color: var(--accent-amber); color: var(--accent-amber); } button.active { background: var(--accent-amber-glow); } .toolbar > span { margin-left: auto; font: .65rem var(--font-mono); color: var(--hud-cyan); letter-spacing: .08em; }
  .message { overflow-wrap: anywhere; color: var(--accent-amber); font-size: .8rem; } .matrix { overflow: auto; border: 1px solid var(--border-cockpit); border-radius: 4px; } table { width: 100%; min-width: 1050px; table-layout: fixed; border-collapse: separate; border-spacing: 0; background: var(--bg-panel); } th, td { padding: .9rem 1rem; text-align: left; vertical-align: top; border-bottom: 1px solid var(--border-cockpit); border-right: 1px solid var(--border-cockpit); overflow-wrap: anywhere; white-space: pre-line; } th:last-child, td:last-child { border-right: 0; } thead th { height: auto; background: var(--bg-panel-elevated); } thead th:first-child { width: 200px; } tbody th { font-size: .75rem; font-weight: 500; color: var(--text-secondary); position: sticky; left: 0; background: var(--bg-panel); z-index: 1; } td { font: .75rem/1.7 var(--font-mono); font-variant-numeric: tabular-nums; } .group th { position: static; background: var(--bg-cockpit); color: var(--accent-amber); font: .7rem var(--font-mono); text-transform: uppercase; letter-spacing: .1em; padding-block: 1rem; } .different td, .different th { background: var(--accent-amber-glow); } .difference-mark { color: var(--accent-amber); }
  .column-photo { display: block; width: 100%; height: 96px; object-fit: contain; background: #f4f1ea; border-radius: 3px; margin-bottom: .35rem; } .column-head { display: flex; align-items: center; justify-content: space-between; gap: .5rem; } .brand, .corner > span { color: var(--accent-amber); font: .65rem var(--font-mono); letter-spacing: .07em; text-transform: uppercase; } .remove { padding: .15rem .4rem; font-size: 1.25rem; border: 0; background: none; color: var(--text-secondary); } .product { display: block; font-size: 1rem; text-decoration: none; line-height: 1.5; margin: .7rem 0; } .product:hover { color: var(--accent-amber); } .badge { color: var(--hud-cyan); font: .6rem var(--font-mono); text-transform: uppercase; } .corner p { color: var(--text-secondary); font-size: .9rem; line-height: 1.7; font-weight: 400; } .slot label { display: grid; gap: .9rem; font: .65rem var(--font-mono); color: var(--text-secondary); } select { width: 100%; min-width: 0; background: var(--bg-cockpit); color: var(--text-primary); border: 1px solid var(--border-cockpit); padding: .6rem; font: .75rem var(--font-sans); } .slot p { color: var(--text-secondary); font: .6rem var(--font-mono); font-weight: 400; } .placeholder { color: var(--text-muted); } .empty { border: 1px dashed var(--border-cockpit); padding: 1rem 1.5rem; margin-bottom: 1.5rem; } .empty h2 { font-size: 1.2rem; margin-top: .5rem; } .empty p, .footnote, .unknown { color: var(--text-secondary); font-size: .8rem; line-height: 1.7; } .footnote { max-width: 850px; } .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  @media (max-width: 640px) { .toolbar > span { width: 100%; margin-top: .5rem; } thead th:first-child { width: 150px; } table { min-width: 1000px; } }
</style>
