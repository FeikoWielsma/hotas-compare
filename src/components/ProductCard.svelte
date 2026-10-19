<script lang="ts">
  import { onMount } from 'svelte';
  import { inventoryComplete, inventoryCount } from '../lib/control-inventory';
  import type { CatalogItem } from '../lib/catalog';
  import { categoryLabels, detailHref, formatAmount, productImageSrc, resolveItemRegion } from '../lib/catalog-ui';
  import { regionStore } from '../lib/stores/region.svelte';
  import { compareStore, MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  let { item }: { item: CatalogItem } = $props();
  const active = $derived(resolveItemRegion(item, regionStore.region));
  const selected = $derived(compareStore.hasItem(item.id));
  const full = $derived(!selected && compareStore.items.length >= MAX_COMPARE_ITEMS);
  const photo = $derived(productImageSrc(item.images[0]?.file));
  onMount(() => { regionStore.init(); compareStore.init(); });
</script>

<article class:selected>
  <a class="photo" href={detailHref(item)}>{#if photo}<img src={photo} alt={item.name} />{:else}<span>No photo</span>{/if}</a>
  <div class="badges"><span class="category">{categoryLabels[item.category]}</span><span class:verified={item.verification === 'verified'}>{item.verification === 'verified' ? '● Verified' : '○ Draft'}</span></div>
  <p class="brand">{item.brandName}</p>
  <h3><a href={detailHref(item)}>{item.name}</a></h3>
  <p class="hand">{item.handedness.map((hand) => hand === 'ambi' ? 'Ambidextrous' : `${hand} hand`).join(' / ') || 'Flight hardware'}</p>
  <dl><div><dt>Est. logical inputs</dt><dd>{item.totalLogicalButtons === 0 && !inventoryComplete(item.controlSections ?? []) ? '—' : String(item.totalLogicalButtons).padStart(2, '0')}</dd></div><div><dt>Total axes</dt><dd>{item.totalAxes === 0 ? '—' : String(item.totalAxes).padStart(2, '0')}</dd></div></dl>
  <div class="control-preview" aria-label="Physical control highlights"><span>Hats <b>{inventoryCount(item.controlSections ?? [], 'hat')}</b></span><span>Ministicks <b>{inventoryCount(item.controlSections ?? [], 'analog_ministick')}</b></span><span class="inventory-status">{inventoryComplete(item.controlSections ?? []) ? 'Inventory checked' : 'Partial control data'}</span></div>
  <div class="features"><span>{item.sensor?.replaceAll('_', ' ') || 'Sensor unspecified'}</span>{#if item.hasMinistick}<span class="ministick">↔ Ministick</span>{/if}</div>
  <div class="price"><strong>{formatAmount(active)}</strong><span>{regionStore.region} {active.resolvedPrice.price ? active.resolvedPrice.price.incl_vat ? '· incl. VAT' : '· excl. tax' : ''}</span></div>
  {#if active.resolvedPrice.isStale}<p class="stale" title={`Last checked ${active.resolvedPrice.price?.verified}`}>◷ Price over 90 days old</p>{/if}
  <div class="actions"><a href={detailHref(item)} aria-label={`View ${item.name}`}>View specs ↗</a><span title={full ? 'Comparison is full. Remove an item to add another (maximum 4).' : undefined}><button type="button" aria-pressed={selected} disabled={full} onclick={() => selected ? compareStore.removeItem(item.id) : compareStore.addItem(item.id)}>{selected ? '✓ Comparing' : '+ Compare'}</button></span></div>
</article>

<style>
  article { display: flex; flex-direction: column; min-width: 0; padding: 1.3rem; background: linear-gradient(145deg, var(--bg-panel-elevated), var(--bg-panel) 60%); border: 1px solid var(--border-cockpit); border-radius: 4px; transition: border-color .2s, box-shadow .2s; }
  article:hover, article.selected { border-color: var(--border-cockpit-glow); box-shadow: 0 0 24px var(--accent-amber-glow); }
  .photo { display: grid; place-items: center; aspect-ratio: 4 / 3; margin: -1.3rem -1.3rem 1.1rem; background: #f4f1ea; border-bottom: 1px solid var(--border-cockpit); overflow: hidden; text-decoration: none; }
  .photo img { width: 100%; height: 100%; object-fit: contain; }
  .photo span { color: #6b675e; font: .7rem var(--font-mono); letter-spacing: .08em; text-transform: uppercase; }
  .badges, .actions, .price { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
  .badges, .brand, .hand, dt, .features, .price span, .stale, .actions { font-size: .7rem; }
  .badges, .brand, dd, .price strong, .actions { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
  .badges { color: var(--text-secondary); } .category { color: var(--hud-cyan); text-transform: uppercase; letter-spacing: .07em; } .verified { color: var(--hud-green); }
  .brand { margin: 1.5rem 0 .4rem; color: var(--accent-amber); text-transform: uppercase; letter-spacing: .12em; }
  h3 { margin: 0; font-size: 1.15rem; line-height: 1.4; } h3 a { text-decoration: none; } h3 a:hover { color: var(--accent-amber); }
  .hand { color: var(--text-secondary); margin: .5rem 0 1.25rem; text-transform: capitalize; }
  dl { display: grid; grid-template-columns: 1fr 1fr; margin: 0; border-block: 1px solid var(--border-cockpit); padding: .85rem 0; } dt { color: var(--text-secondary); } dd { font-size: 1.7rem; margin: .25rem 0 0; line-height: 1; }
  .control-preview { display: grid; gap: .35rem; margin-top: .85rem; font-size: .7rem; color: var(--text-secondary); } .control-preview > span { display: flex; justify-content: space-between; gap: .5rem; } .control-preview b { font-weight: 500; color: var(--text-primary); } .control-preview .inventory-status { color: var(--hud-cyan); font: .6rem var(--font-mono); margin-top: .2rem; }
  .features { display: flex; flex-wrap: wrap; gap: .5rem; padding: .85rem 0 1.4rem; color: var(--text-secondary); text-transform: capitalize; } .ministick { color: var(--hud-cyan); }
  .price { margin-top: auto; flex-wrap: wrap; } .price strong { font-size: 1.15rem; } .price span { color: var(--text-secondary); } .stale { color: var(--accent-amber); margin: .4rem 0 0; }
  .actions { border-top: 1px solid var(--border-cockpit); margin-top: 1rem; padding-top: 1rem; } .actions a { text-decoration: none; color: var(--text-secondary); } button { border: 1px solid var(--border-cockpit); border-radius: 3px; padding: .55rem .65rem; background: var(--bg-cockpit); color: var(--text-primary); font: inherit; cursor: pointer; } .selected button { border-color: var(--accent-amber); color: var(--accent-amber); background: var(--accent-amber-glow); } button:disabled { opacity: .45; cursor: not-allowed; }
  @media (prefers-reduced-motion: reduce) { article { transition: none; } }
</style>
