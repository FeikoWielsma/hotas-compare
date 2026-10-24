<script lang="ts">
  import Explain from './Explain.svelte';
  import { gimbalGlossaryKey, gimbalLabels, gimbalOrder } from '../lib/glossary';
  import { onMount } from 'svelte';
  import ProductCard from './ProductCard.svelte';
  import HardwareIcon from './HardwareIcon.svelte';
  import BrandMark from './BrandMark.svelte';
  import type { CatalogItem } from '../lib/catalog';
  import { resolveItemRegion } from '../lib/catalog-ui';
  import { filterCatalog, groupHandVariants } from '../lib/catalog-filter';
  import { platforms, type Platform } from '../lib/platforms';
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
  let sort = $state('featured');
  let handedness = $state('');
  let minimumAxes = $state<number | undefined>();
  let minimumInputs = $state<number | undefined>();
  let itemType = $state('');
  let priceAvailability = $state('');
  let platform = $state<Platform | ''>('');
  let gimbalTypes = $state<string[]>([]);
  let filtersOpen = $state(false);
  type Layout = 'cards' | 'compact' | 'rows';
  let layout = $state<Layout>('cards');
  const layouts: { value: Layout; label: string; icon: string }[] = [
    { value: 'cards', label: 'Cards', icon: 'grid' },
    { value: 'compact', label: 'Compact cards', icon: 'compact' },
    { value: 'rows', label: 'Detailed rows', icon: 'list' },
  ];
  function chooseLayout(value: Layout) {
    layout = value;
    try { localStorage.setItem('catalog-layout', value); } catch { /* Storage can be unavailable. */ }
  }
  const activeCount = $derived([
    search.trim().length > 0, category !== 'All', ...brands.map(() => true),
    minimum != null, maximum != null, ministick, brake, sensors, !!fit,
    !!handedness, (minimumAxes ?? 0) > 0, (minimumInputs ?? 0) > 0,
    !!itemType, !!priceAvailability, !!platform, ...gimbalTypes.map(() => true),
  ].filter(Boolean).length);
  const categories: Record<string, string[]> = { All: [], 'Sticks & Combos': ['stick_fixed', 'stick_combo', 'hotas_bundle', 'hosas_bundle', 'system'], Throttles: ['throttle'], Bases: ['base'], Grips: ['grip'], Pedals: ['pedals'], Yokes: ['yoke', 'yoke_bundle'], Quadrants: ['quadrant'], Modules: ['module'] };
  const categoryIcons: Record<string, string> = { All: 'all', 'Sticks & Combos': 'stick', Throttles: 'throttle', Bases: 'base', Grips: 'grip', Pedals: 'pedals', Yokes: 'yoke', Quadrants: 'quadrant', Modules: 'module' };
  const brandOptions = $derived([...new Map(initialItems.map((item) => [item.brand, item.brandName])).entries()].sort((a, b) => a[1].localeCompare(b[1])));
  const items = $derived(initialItems.map((item) => resolveItemRegion(item, regionStore.region)));
  const filtered = $derived(filterCatalog(items, {
    search, categories: categories[category], brands, minimum, maximum, ministick, brake, sensors,
    fit, minimumFit, handedness, minimumAxes, minimumInputs, itemType, priceAvailability, sort, platform, gimbalTypes,
  }));
  const grouped = $derived(groupHandVariants(filtered));
  function reset() {
    search = ''; category = 'All'; brands = []; minimum = undefined; maximum = undefined;
    ministick = false; brake = false; sensors = false; fit = ''; minimumFit = 4; sort = 'featured';
    handedness = ''; minimumAxes = undefined; minimumInputs = undefined; itemType = ''; priceAvailability = '';
    platform = ''; gimbalTypes = [];
  }
  onMount(() => {
    regionStore.init();
    try {
      const stored = localStorage.getItem('catalog-layout');
      if (stored === 'cards' || stored === 'compact' || stored === 'rows') layout = stored;
    } catch { /* Keep the server-rendered cards default. */ }
  });
</script>

<section aria-label="Hardware catalog">
  <div class="search-bar"><label class="search">Search catalog<input type="search" bind:value={search} placeholder="Search hardware, brands, sensors…" /></label><label>Sort by<select bind:value={sort}><option value="featured">Recommended</option><option value="name">Name A–Z</option><option value="price-low">Price: Low–High</option><option value="price-high">Price: High–Low</option><option value="buttons">Estimated button inputs</option><option value="axes">Axes</option><option value="score">Overall Score</option></select></label></div>
  <fieldset class="categories"><legend>Hardware category</legend><div class="pills">{#each Object.keys(categories) as name}<button type="button" class:active={category === name} aria-pressed={category === name} onclick={() => category = name}><HardwareIcon name={categoryIcons[name]} size={30} /><span>{name}</span></button>{/each}</div></fieldset>
  <div class="filter-toolbar"><button type="button" class="filter-toggle" aria-expanded={filtersOpen} aria-controls="catalog-filters" onclick={() => filtersOpen = !filtersOpen}>{filtersOpen ? 'Hide filters' : 'Show filters'}{activeCount ? ` (${activeCount} active)` : ''}</button><p class="active-count">{activeCount ? `${activeCount} active ${activeCount === 1 ? 'filter' : 'filters'}` : ''}</p>{#if activeCount}<button type="button" class="reset" onclick={reset}>Reset all</button>{/if}</div>
  <div class="workspace"><aside id="catalog-filters" class:filters-open={filtersOpen} aria-label="Catalog filters">
    <div class="filter-heading"><span>Refine the catalog</span><span class="filter-note">Find the right controls for your setup.</span></div>
    <fieldset><legend>Gimbal type<Explain term="gimbal" /></legend><div class="pills gimbals">{#each gimbalOrder as type}<span class="gimbal-pill"><button type="button" class:active={gimbalTypes.includes(type)} aria-pressed={gimbalTypes.includes(type)} onclick={() => gimbalTypes = gimbalTypes.includes(type) ? gimbalTypes.filter((t) => t !== type) : [...gimbalTypes, type]}>{gimbalLabels[type]}</button><Explain term={gimbalGlossaryKey[type]} /></span>{/each}</div><p class="note">Sticks and bases only. Pincer and up is where Mysh's recommendations start.</p></fieldset>
    <fieldset><legend>Brand <small>· multi-select</small></legend><div class="pills brands">{#each brandOptions as [id, name]}<button type="button" class:active={brands.includes(id)} aria-pressed={brands.includes(id)} onclick={() => brands = brands.includes(id) ? brands.filter((brand) => brand !== id) : [...brands, id]}><BrandMark brand={id} name={name} size={23} />{name}</button>{/each}</div></fieldset>
    <fieldset><legend>Price / {regionStore.currency}</legend><div class="range"><label>Min<input type="number" min="0" step="any" bind:value={minimum} placeholder="0" /></label><span>—</span><label>Max<input type="number" min="0" step="any" bind:value={maximum} placeholder="Any" /></label></div><label class="fit-label">Price availability<select bind:value={priceAvailability}><option value="">All hardware</option><option value="available">Price listed in {regionStore.region}</option><option value="unavailable">No {regionStore.region} price listed</option></select></label></fieldset>
    <fieldset><legend>Hardware & controls</legend><label class="fit-label">Item type<select bind:value={itemType}><option value="">Components & bundles</option><option value="component">Component</option><option value="bundle">Bundle</option></select></label><label class="fit-label">Handedness<select bind:value={handedness}><option value="">Any handedness</option><option value="right">Right hand</option><option value="left">Left hand</option><option value="ambi">Ambidextrous</option></select></label><label class="fit-label">Minimum axes<input type="number" min="0" step="1" bind:value={minimumAxes} placeholder="Any" /></label><label class="fit-label" title="Estimated button inputs, including hat directions and switch positions">Minimum est. button inputs<input type="number" min="0" step="1" bind:value={minimumInputs} placeholder="Any" /></label></fieldset>
    <fieldset><legend>Platform compatibility</legend><label class="fit-label">Platform<select bind:value={platform}><option value="">All platforms</option>{#each platforms as {key, label}}<option value={key}>{label}</option>{/each}</select></label><p class="note">Shows confirmed support. Check product notes for required accessories and supported console generations.</p></fieldset>
    <fieldset class="checks"><legend>Features</legend><label><input type="checkbox" bind:checked={ministick} /> Has ministick</label><label><input type="checkbox" bind:checked={brake} /> Has brake axis</label><label><input type="checkbox" bind:checked={sensors} /> Contactless sensors</label></fieldset>
    <fieldset><legend>Primary fit</legend><label class="fit-label">Use case<select bind:value={fit}><option value="">Any flying style</option><option value="modern_jet">Modern Jet</option><option value="space_hosas">Space HOSAS</option><option value="space_hotas">Space HOTAS</option><option value="heli">Helicopter</option><option value="ga_airliner">GA / Airliner</option><option value="ww2">WWII</option></select></label><label class="fit-label">Minimum fit<select bind:value={minimumFit} disabled={!fit}>{#each [1, 2, 3, 4, 5] as score}<option value={score}>{score} / 5</option>{/each}</select></label></fieldset>
  </aside><div class="results"><div class="results-toolbar"><p class="counter" role="status">Showing <strong>{grouped.length}</strong> {grouped.length === 1 ? 'product' : 'products'}{grouped.length !== filtered.length ? ` (${filtered.length} variants)` : ''} of {initialItems.length} items <span>{regionStore.region} prices</span></p><div class="layouts" role="group" aria-label="Catalog layout">{#each layouts as view}<button type="button" class:active={layout === view.value} aria-pressed={layout === view.value} onclick={() => chooseLayout(view.value)}><HardwareIcon name={view.icon} size={19} /><span>{view.label}</span></button>{/each}</div></div>
    {#if filtered.length}<div class="grid" class:compact-grid={layout === 'compact'} class:rows={layout === 'rows'}>{#each grouped as group (group[0].id)}<ProductCard item={group[0]} variants={group} compact={layout === 'compact'} row={layout === 'rows'} rankInfo={sort === 'featured'} />{/each}</div>{:else}<div class="empty"><h2>No hardware matches your filters.</h2><p>{activeCount} active {activeCount === 1 ? 'filter is' : 'filters are'} narrowing the catalog. Try fewer requirements or a broader search. Price filters use {regionStore.region} listings only.</p><button type="button" onclick={reset}>Reset all filters</button></div>{/if}
  </div></div>
</section>

<style>
  section { color: var(--color-ink); font-family: var(--font-sans); }
  label, legend, .filter-heading, .counter { font: .875rem/1.5 var(--font-sans); color: var(--color-muted); }
  legend { color: var(--color-ink); font-weight: 600; margin-bottom: .85rem; } small { font-size: .75rem; font-weight: 400; color: var(--color-muted); }
  .search-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: end; } .search { flex: 1; } .search-bar label { display: grid; gap: .55rem; }
  input:not([type=checkbox]), select { display: block; width: 100%; border: 1px solid var(--color-rule); border-radius: 2px; padding: .8rem; background: var(--color-surface); color: var(--color-ink); font: .875rem/1.4 var(--font-sans); min-width: 0; } input::placeholder { color: var(--color-muted); }
  fieldset { border: 0; margin: 0 0 1.7rem; padding: 0; min-width: 0; } .categories { padding-bottom: 1.25rem; border-bottom: 1px solid var(--color-rule); }
  .pills { display: flex; flex-wrap: wrap; gap: .45rem; } button { cursor: pointer; font: .875rem/1.4 var(--font-sans); color: var(--color-ink); border: 1px solid var(--color-rule); border-radius: 2px; background: var(--color-surface); padding: .65rem .8rem; } button:hover { border-color: var(--color-accent); } button.active { color: var(--color-accent); border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 7%, var(--color-surface)); }
  .categories .pills { gap: .35rem 1rem; } .categories button { display: flex; align-items: center; justify-content: center; gap: .5rem; min-height: 48px; padding: .65rem .2rem; border: 0; border-bottom: 2px solid transparent; background: transparent; border-radius: 0; } .categories button.active { border-bottom-color: var(--color-accent); font-weight: 700; } .categories button:hover { color: var(--color-accent); }
  .workspace { display: grid; grid-template-columns: 235px minmax(0, 1fr); gap: 2rem; } aside { border-right: 1px solid var(--color-rule); padding-right: 1.5rem; } .filter-heading { display: grid; gap: .5rem; margin-bottom: 1.75rem; } .filter-heading > span { color: var(--color-ink); font-weight: 700; } .reset { border: 0; background: none; padding: .25rem 0; text-align: left; color: var(--color-accent); }
  .gimbals { flex-direction: column; align-items: flex-start; } .gimbal-pill { display: inline-flex; align-items: center; } .gimbals button { font-size: .8125rem; padding: .5rem .65rem; }
  .brands button { display: inline-flex; align-items: center; gap: .4rem; font-size: .8125rem; padding: .55rem .65rem; } .range { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: .4rem; } .range label { min-width: 0; } .range input { margin-top: .4rem; padding: .65rem; } .range span { padding-bottom: .65rem; color: var(--color-muted); } .note { color: var(--color-muted); font-size: .75rem; line-height: 1.6; }
  .checks label { display: flex; gap: .6rem; align-items: center; margin: .8rem 0; } input[type=checkbox] { accent-color: var(--color-accent); width: 1.1rem; height: 1.1rem; } .fit-label { display: grid; gap: .4rem; margin-bottom: .85rem; } select:disabled { opacity: .6; }
  .results { min-width: 0; } .counter { margin: 0 0 1rem; display: flex; gap: .4rem; flex-wrap: wrap; } .counter strong { color: var(--color-ink); } .counter span { margin-left: auto; font-size: .8125rem; } .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; } .empty { padding: 3rem 1rem; text-align: center; background: var(--color-surface); border: 1px solid var(--color-rule); } .empty h2 { font: 600 2rem/1.15 var(--font-display); } .empty p { color: var(--color-muted); }
  :is(button, input, select):focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
  .filter-toolbar { display: flex; align-items: center; gap: 1rem; margin: 0 0 1.25rem; } .active-count { margin: 0; color: var(--color-muted); font-size: .8125rem; } .filter-toolbar .reset { margin-left: auto; } .filter-toggle { display: none; } .filter-heading > .filter-note { font-size: .8125rem; font-weight: 400; color: var(--color-muted); }
  .results-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; } .results-toolbar .counter { margin: 0; gap: .35rem; } .counter span { margin-left: .5rem; }
  .layouts { display: flex; flex-wrap: wrap; gap: .25rem; } .layouts button { display: flex; align-items: center; gap: .35rem; font-size: .75rem; min-height: 44px; padding: .5rem; }
  .grid.compact-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; } .grid.rows { grid-template-columns: minmax(0, 1fr); }
  @media (max-width: 1200px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 800px) { .filter-toggle { display: block; } .filter-toolbar .active-count { display: none; } aside:not(.filters-open) { display: none; } .workspace { grid-template-columns: 1fr; } aside { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; padding: 0 0 1rem; border: 0; border-bottom: 1px solid var(--color-rule); } .filter-heading { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; margin: 0; } fieldset { margin-bottom: .75rem; } }
  @media (max-width: 1050px) { .grid.compact-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 520px) { .grid.compact-grid { grid-template-columns: minmax(0, 1fr); } .layouts { width: 100%; } .layouts button { flex: 1; justify-content: center; } .search-bar { flex-direction: column; align-items: stretch; } .grid, aside { grid-template-columns: 1fr; } .categories .pills { gap: .25rem .75rem; } }
</style>
