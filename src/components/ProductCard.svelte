<script lang="ts">
  import { onMount } from 'svelte';
  import type { CatalogItem } from '../lib/catalog';
  import { categoryLabels, detailHref, formatAmount, resolveItemRegion } from '../lib/catalog-ui';
  import { regionStore } from '../lib/stores/region.svelte';
  import { compareStore, MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  let { item }: { item: CatalogItem } = $props();
  const active = $derived(resolveItemRegion(item, regionStore.region));
  const selected = $derived(compareStore.hasItem(item.id));
  const full = $derived(!selected && compareStore.items.length >= MAX_COMPARE_ITEMS);
  onMount(() => { regionStore.init(); compareStore.init(); });
</script>

<article class:selected>
  <div class="badges"><span class="category">{categoryLabels[item.category]}</span><span class:verified={item.verification === 'verified'}>{item.verification === 'verified' ? '● Verified' : '○ Draft'}</span></div>
  <p class="brand">{item.brandName}</p>
  <h3><a href={detailHref(item)}>{item.name}</a></h3>
  <p class="hand">{item.handedness.map((hand) => hand === 'ambi' ? 'Ambidextrous' : `${hand} hand`).join(' / ') || 'Flight hardware'}</p>
  <dl><div><dt>Logical buttons</dt><dd>{String(item.totalLogicalButtons).padStart(2, '0')}</dd></div><div><dt>Total axes</dt><dd>{String(item.totalAxes).padStart(2, '0')}</dd></div></dl>
  <div class="features"><span>{item.sensor?.replaceAll('_', ' ') || 'Sensor unspecified'}</span>{#if item.hasMinistick}<span class="ministick">↔ Ministick</span>{/if}</div>
  <div class="price"><strong>{formatAmount(active)}</strong><span>{regionStore.region} {active.resolvedPrice.price ? active.resolvedPrice.price.incl_vat ? '· incl. VAT' : '· excl. tax' : ''}</span></div>
  {#if active.resolvedPrice.isStale}<p class="stale" title={`Last checked ${active.resolvedPrice.price?.verified}`}>◷ Price over 90 days old</p>{/if}
  <div class="actions"><a href={detailHref(item)} aria-label={`View ${item.name}`}>View specs ↗</a><span title={full ? 'Comparison is full. Remove an item to add another (maximum 4).' : undefined}><button type="button" aria-pressed={selected} disabled={full} onclick={() => selected ? compareStore.removeItem(item.id) : compareStore.addItem(item.id)}>{selected ? '✓ Comparing' : '+ Compare'}</button></span></div>
</article>

<style>
  article { display: flex; flex-direction: column; min-width: 0; padding: 1.3rem; background: linear-gradient(145deg, var(--bg-panel-elevated), var(--bg-panel) 60%); border: 1px solid var(--border-cockpit); border-radius: 4px; transition: border-color .2s, box-shadow .2s; }
  article:hover, article.selected { border-color: var(--border-cockpit-glow); box-shadow: 0 0 24px var(--accent-amber-glow); }
  .badges, .actions, .price { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
  .badges, .brand, .hand, dt, .features, .price span, .stale, .actions { font-size: .7rem; }
  .badges, .brand, dd, .price strong, .actions { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
  .badges { color: var(--text-secondary); } .category { color: var(--hud-cyan); text-transform: uppercase; letter-spacing: .07em; } .verified { color: var(--hud-green); }
  .brand { margin: 1.5rem 0 .4rem; color: var(--accent-amber); text-transform: uppercase; letter-spacing: .12em; }
  h3 { margin: 0; font-size: 1.15rem; line-height: 1.4; } h3 a { text-decoration: none; } h3 a:hover { color: var(--accent-amber); }
  .hand { color: var(--text-secondary); margin: .5rem 0 1.25rem; text-transform: capitalize; }
  dl { display: grid; grid-template-columns: 1fr 1fr; margin: 0; border-block: 1px solid var(--border-cockpit); padding: .85rem 0; } dt { color: var(--text-secondary); } dd { font-size: 1.7rem; margin: .25rem 0 0; line-height: 1; }
  .features { display: flex; flex-wrap: wrap; gap: .5rem; padding: .85rem 0 1.4rem; color: var(--text-secondary); text-transform: capitalize; } .ministick { color: var(--hud-cyan); }
  .price { margin-top: auto; flex-wrap: wrap; } .price strong { font-size: 1.15rem; } .price span { color: var(--text-secondary); } .stale { color: var(--accent-amber); margin: .4rem 0 0; }
  .actions { border-top: 1px solid var(--border-cockpit); margin-top: 1rem; padding-top: 1rem; } .actions a { text-decoration: none; color: var(--text-secondary); } button { border: 1px solid var(--border-cockpit); border-radius: 3px; padding: .55rem .65rem; background: var(--bg-cockpit); color: var(--text-primary); font: inherit; cursor: pointer; } .selected button { border-color: var(--accent-amber); color: var(--accent-amber); background: var(--accent-amber-glow); } button:disabled { opacity: .45; cursor: not-allowed; }
  @media (prefers-reduced-motion: reduce) { article { transition: none; } }
</style>
