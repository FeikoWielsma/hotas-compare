<script lang="ts">
  import { onMount } from 'svelte';
  import BrandMark from './BrandMark.svelte';
  import { inventoryComplete, inventoryCount } from '../lib/control-inventory';
  import type { CatalogItem } from '../lib/catalog';
  import { categoryLabels, detailHref, formatAmount, productImageSrc, resolveItemRegion } from '../lib/catalog-ui';
  import { regionStore } from '../lib/stores/region.svelte';
  import { compareStore, MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  let { item, compact = false, row = false }: { item: CatalogItem; compact?: boolean; row?: boolean } = $props();
  const active = $derived(resolveItemRegion(item, regionStore.region));
  const selected = $derived(compareStore.hasItem(item.id));
  const full = $derived(!selected && compareStore.items.length >= MAX_COMPARE_ITEMS);
  const photo = $derived(productImageSrc(item.images[0]?.file));
  const countLabel = (type: 'hat' | 'analog_ministick') => inventoryCount(item.controlSections ?? [], type).replace('Not documented', '—').replace(' recorded', '+');
  const inputs = $derived(item.totalLogicalButtons === 0 && !inventoryComplete(item.controlSections ?? []) ? 'Unknown' : item.totalLogicalButtons);
  onMount(() => { regionStore.init(); compareStore.init(); });
</script>

<article class:selected class:compact class:row>
  <a class="photo" href={detailHref(item)} aria-label={`View ${item.name}`}>{#if photo}<img src={photo} alt={item.name} loading="lazy" />{:else}<span>No photo available</span>{/if}</a>
  <div class="identity">
    <p class="category">{categoryLabels[item.category]}{item.item_type === 'bundle' ? ' · Bundle' : ''}</p>
    <p class="brand"><BrandMark brand={item.brand} name={item.brandName} size={22} /><span>{item.brandName}</span></p>
    <h3><a href={detailHref(item)}>{item.name}</a></h3>
    <p class="hand">{item.handedness.map((hand) => hand === 'ambi' ? 'Ambidextrous' : `${hand === 'right' ? 'Right' : 'Left'} hand`).join(' / ') || 'Flight hardware'}</p>
  </div>
  <div class="specifications">
    <dl><div><dt title="Estimated button inputs, including hat directions and switch positions">Est. button inputs</dt><dd>{inputs}</dd></div><div><dt>Axes</dt><dd>{item.totalAxes === 0 ? 'Unknown' : item.totalAxes}</dd></div></dl>
    <p class="features">{item.sensor?.replaceAll('_', ' ') || 'Sensor unspecified'}{#if item.hasMinistick}<span> · Ministick</span>{/if}{#if item.hasBrakeAxis}<span> · Brake axis</span>{/if}</p>
    {#if !compact}<div class="control-preview" aria-label="Physical control highlights"><span>Hat switches <b>{countLabel('hat')}</b></span><span>Ministicks <b>{countLabel('analog_ministick')}</b></span></div>{/if}
  </div>
  <div class="purchase">
    <div class="price"><strong>{formatAmount(active)}</strong><span>{regionStore.region} {active.resolvedPrice.price ? active.resolvedPrice.price.incl_vat ? '· incl. VAT' : '· excl. tax' : ''}</span></div>
    {#if active.resolvedPrice.isStale}<p class="stale" title={`Last checked ${active.resolvedPrice.price?.verified}`}>Price over 90 days old</p>{/if}
    <div class="actions"><a href={detailHref(item)} aria-label={`View specs for ${item.name}`}>View specs</a><span title={full ? 'Comparison is full. Remove an item to add another (maximum 4).' : undefined}><button type="button" aria-label={`${selected ? 'Remove' : 'Add'} ${item.name} ${selected ? 'from' : 'to'} comparison`} aria-pressed={selected} disabled={full} onclick={() => selected ? compareStore.removeItem(item.id) : compareStore.addItem(item.id)}>{selected ? 'Comparing' : 'Compare'}</button></span></div>
  </div>
</article>

<style>
  article { display: flex; flex-direction: column; min-width: 0; padding: 1.25rem; color: var(--color-ink); font-family: var(--font-sans); background: var(--color-surface); border: 1px solid var(--color-rule); border-radius: 2px; transition: border-color .2s; }
  article:hover, article.selected { border-color: var(--color-accent); }
  .photo { display: grid; place-items: center; aspect-ratio: 4 / 3; margin: -1.25rem -1.25rem 1rem; background: var(--color-photo); border-bottom: 1px solid var(--color-rule); overflow: hidden; text-decoration: none; }
  .photo img { width: 100%; height: 100%; object-fit: contain; } .photo span { color: var(--color-muted); font-size: .8125rem; padding: 1rem; }
  .category, .hand, dt, .features, .price span, .stale { font-size: .8125rem; line-height: 1.5; }
  .category { color: var(--color-muted); margin: 0 0 .75rem; }
  .brand { display: flex; align-items: center; gap: .45rem; margin: 0 0 .5rem; color: var(--color-accent); font-size: .8125rem; font-weight: 600; }
  h3 { font: 600 1.125rem/1.4 var(--font-sans); letter-spacing: -.015em; margin: 0; overflow-wrap: anywhere; } h3 a { color: inherit; text-decoration: none; } h3 a:hover { color: var(--color-accent); }
  .hand { color: var(--color-muted); margin: .5rem 0 1rem; }
  dl { display: grid; grid-template-columns: 1.5fr 1fr; gap: .5rem; margin: 0; border-block: 1px solid var(--color-rule); padding: .85rem 0; } dt { color: var(--color-muted); } dd { font: 600 1.15rem/1.3 var(--font-sans); font-variant-numeric: tabular-nums; margin: .25rem 0 0; }
  .control-preview { display: grid; gap: .35rem; margin: .6rem 0 1rem; font-size: .8125rem; color: var(--color-muted); } .control-preview > span { display: flex; justify-content: space-between; gap: .5rem; } .control-preview b { font-weight: 500; color: var(--color-ink); text-align: right; }
  .features { margin: .75rem 0; color: var(--color-muted); text-transform: capitalize; }
  .purchase { margin-top: auto; } .price { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .4rem; } .price strong { font-size: 1.15rem; font-variant-numeric: tabular-nums; } .price span { color: var(--color-muted); } .stale { color: var(--color-accent); margin: .4rem 0 0; }
  .actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem; border-top: 1px solid var(--color-rule); margin-top: 1rem; padding-top: 1rem; font-size: .875rem; } .actions a { text-decoration: none; color: var(--color-ink); padding-block: .5rem; } .actions a:hover { color: var(--color-accent); } button { border: 1px solid var(--color-rule); border-radius: 2px; padding: .65rem .7rem; background: transparent; color: var(--color-accent); font: 600 .8125rem var(--font-sans); cursor: pointer; min-height: 44px; } button:hover, .selected button { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 7%, var(--color-surface)); } button:disabled { opacity: .55; cursor: not-allowed; }
  .compact { padding: 1rem; } .compact .photo { aspect-ratio: 16 / 9; margin: -1rem -1rem .85rem; } .compact h3 { font-size: 1rem; } .compact .hand { margin-bottom: .65rem; } .compact dl { padding: .6rem 0; } .compact .features { margin-bottom: 1rem; } .compact .actions { margin-top: .75rem; padding-top: .75rem; }
  .row { display: grid; grid-template-columns: 130px minmax(0, 1.2fr) minmax(0, 1fr) 175px; gap: 1.25rem; align-items: center; }
  .row .photo { margin: 0; border: 1px solid var(--color-rule); aspect-ratio: 1; } .row .category { margin-bottom: .5rem; } .row .hand { margin-bottom: 0; } .row dl { border-top: 0; padding-top: 0; } .row .control-preview { margin-bottom: 0; } .row .purchase { margin-top: 0; } .row .price { display: grid; } .row .actions { gap: .4rem; }
  :is(a, button):focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
  @media (max-width: 1200px) { .row { grid-template-columns: 110px minmax(0, 1fr) 175px; } .row .specifications { grid-column: 2; } .row .photo { grid-row: 1 / 3; } .row .purchase { grid-column: 3; grid-row: 1 / 3; } }
  @media (max-width: 600px) { .row { grid-template-columns: 85px minmax(0, 1fr); gap: 1rem; padding: 1rem; } .row .photo { grid-row: 1; } .row .specifications { grid-column: 1 / -1; } .row .purchase { grid-column: 1 / -1; grid-row: auto; } .row .price { display: flex; } .row .control-preview { grid-template-columns: 1fr 1fr; gap: 1rem; } }
  @media (prefers-reduced-motion: reduce) { article { transition: none; } }
</style>
