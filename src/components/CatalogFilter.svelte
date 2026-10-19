<script lang="ts">
  import { onMount } from 'svelte';
  import ProductCard from './ProductCard.svelte';
  import type { CatalogItem } from '../lib/catalog';
  import { contactless, overallScore, resolveItemRegion } from '../lib/catalog-ui';
  import { regionStore } from '../lib/stores/region.svelte';
  let { initialItems }: { initialItems: CatalogItem[] } = $props();
  let search = $state('');
  let category = $state('All');
  let brands = $state<string[]>([]);
  let minimum = $state<number | undefined>();
  let maximum = $state<number | undefined>();
  let ministick = $state(false);
  let brake = $state(false);
  let sensors = $state(false);
  let fit = $state('');
  let minimumFit = $state(4);
  let sort = $state('name');
  const categories: Record<string, string[]> = { All: [], 'Sticks & Combos': ['stick_fixed', 'stick_combo', 'hotas_bundle', 'hosas_bundle', 'system'], Throttles: ['throttle'], Bases: ['base'], Grips: ['grip'], Pedals: ['pedals'], Yokes: ['yoke', 'yoke_bundle'], Quadrants: ['quadrant'], Modules: ['module'] };
  const brandOptions = $derived([...new Map(initialItems.map((item) => [item.brand, item.brandName])).entries()].sort((a, b) => a[1].localeCompare(b[1])));
  const items = $derived(initialItems.map((item) => resolveItemRegion(item, regionStore.region)));
  function fitScore(item: CatalogItem) {
    if (fit === 'ga_airliner') return Math.max(item.use_case_fit.ga, item.use_case_fit.airliner);
    return item.use_case_fit[fit as keyof CatalogItem['use_case_fit']] ?? 0;
  }
  const filtered = $derived.by(() => {
    const query = search.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      const text = [item.name, item.brandName, item.brand, ...item.formerBrandNames, item.category.replaceAll('_', ' '), item.sensor ?? '', item.gimbal ?? '', item.item_type, item.hasMinistick ? 'ministick' : '', item.hasBrakeAxis ? 'brake' : ''].join(' ').toLocaleLowerCase();
      const amount = item.resolvedPrice.price?.amount;
      return query.every((word) => text.includes(word)) && (!categories[category].length || categories[category].includes(item.category))
        && (!brands.length || brands.includes(item.brand))
        && (minimum == null || (amount != null && amount >= minimum)) && (maximum == null || (amount != null && amount <= maximum))
        && (!ministick || item.hasMinistick) && (!brake || item.hasBrakeAxis) && (!sensors || contactless(item)) && (!fit || fitScore(item) >= minimumFit);
    }).sort((a, b) => {
      let result = 0;
      if (sort.startsWith('price')) {
        const ap = a.resolvedPrice.price?.amount, bp = b.resolvedPrice.price?.amount;
        result = ap == null ? bp == null ? 0 : 1 : bp == null ? -1 : sort === 'price-low' ? ap - bp : bp - ap;
      } else if (sort === 'buttons') result = b.totalLogicalButtons - a.totalLogicalButtons;
      else if (sort === 'axes') result = b.totalAxes - a.totalAxes;
      else if (sort === 'score') result = (overallScore(b) ?? -1) - (overallScore(a) ?? -1);
      return result || a.name.localeCompare(b.name);
    });
  });
  function reset() { search = ''; category = 'All'; brands = []; minimum = undefined; maximum = undefined; ministick = false; brake = false; sensors = false; fit = ''; minimumFit = 4; sort = 'name'; }
  onMount(() => regionStore.init());
</script>

<section aria-label="Hardware catalog">
  <div class="search-bar"><label class="search">SEARCH CATALOG<input type="search" bind:value={search} placeholder="Search hardware, brands, sensors…" /></label><label>SORT BY<select bind:value={sort}><option value="name">Name A–Z</option><option value="price-low">Price: Low–High</option><option value="price-high">Price: High–Low</option><option value="buttons">Estimated logical inputs</option><option value="axes">Axes</option><option value="score">Overall Score</option></select></label></div>
  <fieldset class="categories"><legend>Hardware category</legend><div class="pills">{#each Object.keys(categories) as name}<button type="button" class:active={category === name} aria-pressed={category === name} onclick={() => category = name}>{name}</button>{/each}</div></fieldset>
  <div class="workspace"><aside aria-label="Catalog filters">
    <div class="filter-heading"><span>REFINE YOUR LOADOUT</span><button type="button" class="reset" onclick={reset}>Reset filters</button></div>
    <fieldset><legend>Brand <small>· multi-select</small></legend><div class="pills brands">{#each brandOptions as [id, name]}<button type="button" class:active={brands.includes(id)} aria-pressed={brands.includes(id)} onclick={() => brands = brands.includes(id) ? brands.filter((brand) => brand !== id) : [...brands, id]}>{name}</button>{/each}</div></fieldset>
    <fieldset><legend>Price / {regionStore.currency}</legend><div class="range"><label>Min<input type="number" min="0" step="any" bind:value={minimum} placeholder="0" /></label><span>—</span><label>Max<input type="number" min="0" step="any" bind:value={maximum} placeholder="Any" /></label></div><p class="note">Regional prices; no currency conversion.</p></fieldset>
    <fieldset class="checks"><legend>Features</legend><label><input type="checkbox" bind:checked={ministick} /> Has Ministick</label><label><input type="checkbox" bind:checked={brake} /> Has Brake Axis</label><label><input type="checkbox" bind:checked={sensors} /> Contactless Sensors</label></fieldset>
    <fieldset><legend>Primary fit</legend><label class="fit-label">Use case<select bind:value={fit}><option value="">Any mission</option><option value="modern_jet">Modern Jet</option><option value="space_hosas">Space HOSAS</option><option value="space_hotas">Space HOTAS</option><option value="heli">Helicopter</option><option value="ga_airliner">GA / Airliner</option><option value="ww2">WWII</option></select></label><label class="fit-label">Minimum fit<select bind:value={minimumFit} disabled={!fit}>{#each [1, 2, 3, 4, 5] as score}<option value={score}>{score} / 5</option>{/each}</select></label></fieldset>
  </aside><div class="results"><p class="counter" role="status">Showing <strong>{filtered.length}</strong> of {initialItems.length} items <span>// {regionStore.region} CATALOG</span></p>
    {#if filtered.length}<div class="grid">{#each filtered as item (item.id)}<ProductCard {item} />{/each}</div>{:else}<div class="empty"><h2>No hardware matches this mission.</h2><p>Try a broader search or remove a filter.</p><button type="button" onclick={reset}>Reset filters</button></div>{/if}
  </div></div>
</section>

<style>
  label, legend, .filter-heading, .counter { font: .7rem var(--font-mono); color: var(--text-secondary); } legend { text-transform: uppercase; letter-spacing: .08em; margin-bottom: .85rem; } small { text-transform: none; letter-spacing: 0; }
  .search-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: end; } .search { flex: 1; } .search-bar label { display: grid; gap: .55rem; }
  input:not([type=checkbox]), select { display: block; width: 100%; border: 1px solid var(--border-cockpit); border-radius: 3px; padding: .8rem; background: var(--bg-panel); color: var(--text-primary); font: .85rem var(--font-sans); min-width: 0; } input::placeholder { color: var(--text-secondary); }
  fieldset { border: 0; margin: 0 0 1.7rem; padding: 0; min-width: 0; } .categories { padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-cockpit); }
  .pills { display: flex; flex-wrap: wrap; gap: .45rem; } button { cursor: pointer; font: .75rem var(--font-mono); color: var(--text-secondary); border: 1px solid var(--border-cockpit); border-radius: 3px; background: var(--bg-panel); padding: .6rem .8rem; } button:hover { border-color: var(--accent-amber); color: var(--text-primary); } button.active { color: var(--accent-amber); background: var(--accent-amber-glow); border-color: var(--accent-amber); }
  .workspace { display: grid; grid-template-columns: 235px minmax(0, 1fr); gap: 2rem; } aside { border-right: 1px solid var(--border-cockpit); padding-right: 1.5rem; } .filter-heading { display: grid; gap: .5rem; margin-bottom: 1.75rem; letter-spacing: .05em; } .reset { border: 0; background: none; padding: 0; text-align: left; color: var(--accent-amber); font-size: .7rem; }
  .brands button { font-size: .65rem; padding: .5rem .6rem; } .range { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: .4rem; } .range label { min-width: 0; } .range input { margin-top: .4rem; padding: .65rem; } .range span { padding-bottom: .65rem; color: var(--text-secondary); } .note { color: var(--text-secondary); font-size: .65rem; }
  .checks label { display: flex; gap: .6rem; align-items: center; font: .8rem var(--font-sans); margin: .8rem 0; } input[type=checkbox] { accent-color: var(--accent-amber); width: 1rem; height: 1rem; } .fit-label { display: grid; gap: .4rem; margin-bottom: .85rem; } select:disabled { opacity: .5; }
  .counter { margin: 0 0 1rem; display: flex; gap: .4rem; flex-wrap: wrap; } .counter strong { color: var(--text-primary); } .counter span { margin-left: auto; color: var(--hud-cyan); font-size: .6rem; letter-spacing: .1em; } .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; } .empty { padding: 3rem 1rem; text-align: center; background: var(--bg-panel); } .empty h2 { font-size: 1.2rem; } .empty p { color: var(--text-secondary); }
  @media (max-width: 1200px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } } @media (max-width: 800px) { .workspace { grid-template-columns: 1fr; } aside { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; padding: 0; border: 0; } .filter-heading { grid-column: 1 / -1; display: flex; justify-content: space-between; margin: 0; } fieldset { margin-bottom: .75rem; } } @media (max-width: 520px) { .search-bar { flex-direction: column; align-items: stretch; } .grid { grid-template-columns: 1fr; } aside { grid-template-columns: 1fr; } }
</style>
