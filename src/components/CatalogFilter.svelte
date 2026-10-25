<script lang="ts">
  import Explain from './Explain.svelte';
  import { gimbalGlossaryKey, gimbalLabels, gimbalOrder } from '../lib/glossary';
  import { onMount } from 'svelte';
  import CatalogCard from './CatalogCard.svelte';
  import CatalogTable from './CatalogTable.svelte';
  import HardwareIcon from './HardwareIcon.svelte';
  import BrandMark from './BrandMark.svelte';
  import type { CatalogItem } from '../lib/catalog';
  import type { UseCase } from '../lib/schema';
  import { catalogCategories, resolveItemRegion } from '../lib/catalog-ui';
  import { flyingStyles } from '../lib/catalog-columns';
  import { filterCatalog, groupCatalog } from '../lib/catalog-filter';
  import { platforms, type Platform } from '../lib/platforms';
  import { regionStore } from '../lib/stores/region.svelte';
  let { initialItems, brandCount }: { initialItems: CatalogItem[]; brandCount: number } = $props();
  let showIndividualParts = $state(false);
  let showDiscontinued = $state(false);
  let urlReady = $state(false);
  let search = $state('');
  let category = $state('All');
  let brands = $state<string[]>([]);
  let minimum = $state<number | undefined>();
  let maximum = $state<number | undefined>();
  let ministick = $state(false);
  let brake = $state(false);
  let sensors = $state(false);
  let styles = $state<UseCase[]>([]);
  let sort = $state('featured');
  let handedness = $state('');
  let minimumAxes = $state<number | undefined>();
  let minimumInputs = $state<number | undefined>();
  let itemType = $state('');
  let priceAvailability = $state('');
  let platform = $state<Platform | ''>('');
  let gimbalTypes = $state<string[]>([]);
  type Layout = 'grid' | 'table';
  let layout = $state<Layout>('grid');
  const styleKeys = flyingStyles.map(({ key }) => key);
  function chooseLayout(value: Layout) {
    layout = value;
    try { localStorage.setItem('catalog-layout', value); } catch { /* Storage can be unavailable. */ }
  }
  function toggleStyle(key: UseCase) {
    styles = styles.includes(key) ? styles.filter((style) => style !== key) : styleKeys.filter((style) => style === key || styles.includes(style));
  }
  /** Picking flying styles ranks by match; clearing them falls back to the recommended order. */
  const effectiveSort = $derived(sort === 'featured' && styles.length ? 'match' : sort === 'match' && !styles.length ? 'featured' : sort);
  const fitSortLabel = $derived(sort.startsWith('fit:') ? flyingStyles.find(({ key }) => `fit:${key}` === sort)?.label : null);
  const toggle = <T,>(list: T[], value: T) => list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
  const chips = {
    gimbal: ['All', 'Sticks & Combos', 'Bases'], hand: ['All', 'Sticks & Combos', 'Grips'], features: ['All', 'Sticks & Combos', 'Throttles', 'Grips'],
  };
  const shows = (chip: keyof typeof chips) => chips[chip].includes(category);
  const brandOptions = $derived([...new Map(initialItems.map((item) => [item.brand, item.brandName])).entries()].sort((a, b) => a[1].localeCompare(b[1])));
  const brandSummary = $derived(brands.length === 1 ? brandOptions.find(([id]) => id === brands[0])?.[1] : brands.length ? `${brands.length} brands` : '');
  const priceSummary = $derived(minimum != null && maximum != null ? `${minimum}–${maximum}` : maximum != null ? `≤ ${maximum}` : minimum != null ? `≥ ${minimum}` : '');
  const moreCount = $derived([!!itemType, (minimumAxes ?? 0) > 0, (minimumInputs ?? 0) > 0, !!priceAvailability, showIndividualParts, showDiscontinued].filter(Boolean).length);
  const featureCount = $derived([ministick, brake].filter(Boolean).length);
  const activeCount = $derived([
    search.trim().length > 0, category !== 'All', ...brands.map(() => true),
    minimum != null, maximum != null, ministick, brake, sensors, styles.length > 0,
    !!handedness, (minimumAxes ?? 0) > 0, (minimumInputs ?? 0) > 0,
    showIndividualParts, showDiscontinued, !!itemType, !!priceAvailability, !!platform, ...gimbalTypes.map(() => true),
  ].filter(Boolean).length);
  const items = $derived(initialItems.map((item) => resolveItemRegion(item, regionStore.region)));
  const filtered = $derived(filterCatalog(items, {
    showIndividualParts, showDiscontinued, search, categories: catalogCategories[category].categories, brands, minimum, maximum, ministick, brake, sensors,
    handedness, minimumAxes, minimumInputs, itemType, priceAvailability, sort: effectiveSort, platform, gimbalTypes, fits: styles,
  }));
  const grouped = $derived(groupCatalog(filtered, effectiveSort));
  const rankingNote = $derived(effectiveSort === 'match' ? (styles.length > 1 ? 'best match first' : `best for ${flyingStyles.find(({ key }) => key === styles[0])?.label} first`) : fitSortLabel ? `best for ${fitSortLabel} first` : '');
  function reset() {
    search = ''; category = 'All'; brands = []; minimum = undefined; maximum = undefined;
    ministick = false; brake = false; sensors = false; styles = []; sort = 'featured';
    handedness = ''; minimumAxes = undefined; minimumInputs = undefined; itemType = ''; priceAvailability = '';
    platform = ''; gimbalTypes = []; showDiscontinued = false; showIndividualParts = false;
  }
  let chipBar: HTMLElement;
  onMount(() => {
    regionStore.init();
    const restore = () => {
      const params = new URL(location.href).searchParams;
      showIndividualParts = params.get('showIndividualParts') === '1';
      showDiscontinued = params.get('showDiscontinued') === '1';
      const fly = (params.get('fly') ?? '').split(',');
      styles = styleKeys.filter((key) => fly.includes(key));
    };
    restore();
    urlReady = true;
    window.addEventListener('popstate', restore);
    try {
      const stored = localStorage.getItem('catalog-layout');
      if (stored === 'table' || stored === 'rows') layout = 'table';
    } catch { /* Keep the server-rendered grid default. */ }
    /** Filter menus close when the visitor clicks elsewhere. */
    const closeMenus = (event: MouseEvent) => {
      for (const menu of chipBar?.querySelectorAll('details[open]') ?? []) if (!menu.contains(event.target as Node)) menu.removeAttribute('open');
    };
    document.addEventListener('click', closeMenus);
    return () => { window.removeEventListener('popstate', restore); document.removeEventListener('click', closeMenus); };
  });
  $effect(() => {
    if (!urlReady) return;
    const url = new URL(location.href);
    const set = (key: string, value: string) => value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
    set('showDiscontinued', showDiscontinued ? '1' : '');
    set('showIndividualParts', showIndividualParts ? '1' : '');
    set('fly', styles.join(','));
    history.replaceState(history.state, '', url);
  });
</script>

<section class="hero" aria-labelledby="catalog-title">
  <div class="hero-inner">
    <div class="hero-copy">
      <h1 id="catalog-title">Flight sim hardware, <span>compared.</span></h1>
      <p>Specs, fit and local prices side by side, from <a href="/brands">{brandCount} specialist brands</a>.</p>
    </div>
    <div class="hero-search">
      <label class="search"><span class="sr-only">Search catalog</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg><input type="search" bind:value={search} placeholder="Search hardware, brands, sensors…" /></label>
      <a class="wizard" href="/wizard">Help me choose →</a>
    </div>
  </div>
  <div class="hero-inner styles" role="group" aria-labelledby="fly-label">
    <span id="fly-label" class="fly-label">I fly <span>· pick any</span></span>
    <button type="button" class="style" class:on={!styles.length} aria-pressed={!styles.length} onclick={() => styles = []}>Anything</button>
    {#each flyingStyles as style (style.key)}<button type="button" class="style" class:on={styles.includes(style.key)} aria-pressed={styles.includes(style.key)} onclick={() => toggleStyle(style.key)}>{#if styles.includes(style.key)}<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m2 6.5 2.5 2.5L10 3.5"></path></svg>{/if}{style.label}</button>{/each}
  </div>
</section>

<section id="hardware" class="catalog" aria-label="Hardware catalog">
  <nav class="categories" aria-label="Hardware category">{#each Object.entries(catalogCategories) as [name, { icon }] (name)}<button type="button" class:active={category === name} aria-pressed={category === name} onclick={() => category = name}><HardwareIcon name={icon} size={22} /><span>{name}</span></button>{/each}</nav>

  <div class="toolbar">
    <div class="chips" bind:this={chipBar}>
      <details name="catalog-filter" class:active={!!priceSummary}><summary>Price{priceSummary ? ` · ${regionStore.currency} ${priceSummary}` : ''}</summary><div class="menu">
        <div class="range"><label>Min<input type="number" min="0" step="any" bind:value={minimum} placeholder="0" /></label><span>—</span><label>Max<input type="number" min="0" step="any" bind:value={maximum} placeholder="Any" /></label></div>
        <p class="note">{regionStore.region} prices in {regionStore.currency}.</p>
      </div></details>
      <details name="catalog-filter" class:active={brands.length > 0}><summary>Brand{brandSummary ? ` · ${brandSummary}` : ''}</summary><div class="menu wide"><div class="pills">{#each brandOptions as [id, name] (id)}<button type="button" class:active={brands.includes(id)} aria-pressed={brands.includes(id)} onclick={() => brands = toggle(brands, id)}><BrandMark brand={id} name={name} size={20} />{name}</button>{/each}</div></div></details>
      {#if shows('gimbal')}<details name="catalog-filter" class:active={gimbalTypes.length > 0}><summary>Gimbal{gimbalTypes.length ? ` · ${gimbalTypes.length === 1 ? gimbalLabels[gimbalTypes[0] as keyof typeof gimbalLabels] : gimbalTypes.length}` : ''}</summary><div class="menu">
        <div class="stack">{#each gimbalOrder as type (type)}<span class="option"><label><input type="checkbox" checked={gimbalTypes.includes(type)} onchange={() => gimbalTypes = toggle(gimbalTypes, type)} /> {gimbalLabels[type]}</label><Explain term={gimbalGlossaryKey[type]} /></span>{/each}</div>
        <p class="note">Sticks and bases only.</p>
      </div></details>{/if}
      <button type="button" class="toggle" class:active={sensors} aria-pressed={sensors} onclick={() => sensors = !sensors}>Contactless sensors</button>
      <details name="catalog-filter" class:active={!!platform}><summary>Platform{platform ? ` · ${platforms.find(({ key }) => key === platform)?.label}` : ''}</summary><div class="menu">
        <div class="stack"><label><input type="radio" name="platform" checked={!platform} onchange={() => platform = ''} /> All platforms</label>{#each platforms as { key, label } (key)}<label><input type="radio" name="platform" checked={platform === key} onchange={() => platform = key} /> {label}</label>{/each}</div>
        <p class="note">Confirmed support only. Check product notes for accessories and console generations.</p>
      </div></details>
      {#if shows('hand')}<details name="catalog-filter" class:active={!!handedness}><summary>Hand{handedness ? ` · ${handedness === 'ambi' ? 'Ambi' : handedness === 'left' ? 'Left' : 'Right'}` : ''}</summary><div class="menu"><div class="stack">{#each [['', 'Any hand'], ['right', 'Right hand'], ['left', 'Left hand'], ['ambi', 'Ambidextrous']] as [value, label] (value)}<label><input type="radio" name="hand" checked={handedness === value} onchange={() => handedness = value} /> {label}</label>{/each}</div></div></details>{/if}
      {#if shows('features')}<details name="catalog-filter" class:active={featureCount > 0}><summary>Features{featureCount ? ` · ${featureCount}` : ''}</summary><div class="menu"><div class="stack"><label><input type="checkbox" bind:checked={ministick} /> Has ministick</label><label><input type="checkbox" bind:checked={brake} /> Has brake axis</label></div></div></details>{/if}
      <details name="catalog-filter" class:active={moreCount > 0}><summary>More{moreCount ? ` · ${moreCount}` : ''}</summary><div class="menu">
        <label class="field">Item type<select bind:value={itemType}><option value="">Components & bundles</option><option value="component">Component</option><option value="bundle">Bundle</option></select></label>
        <label class="field">Minimum axes<input type="number" min="0" step="1" bind:value={minimumAxes} placeholder="Any" /></label>
        <label class="field" title="Estimated button inputs, including hat directions and switch positions">Minimum est. button inputs<input type="number" min="0" step="1" bind:value={minimumInputs} placeholder="Any" /></label>
        <label class="field">Price availability<select bind:value={priceAvailability}><option value="">All hardware</option><option value="available">Price listed in {regionStore.region}</option><option value="unavailable">No {regionStore.region} price listed</option></select></label>
        <div class="stack"><label><input type="checkbox" bind:checked={showIndividualParts} /> Show individual parts</label><label><input type="checkbox" bind:checked={showDiscontinued} /> Show discontinued</label></div>
        <p class="note">Individual parts are usually bought in combos. Discontinued products are hidden when a successor exists.</p>
      </div></details>
      {#if activeCount}<button type="button" class="reset" onclick={reset}>Reset all ({activeCount})</button>{/if}
    </div>
    <div class="results-meta">
      <p class="counter" role="status"><strong>{grouped.length}</strong> {grouped.length === 1 ? 'product' : 'products'}{rankingNote ? ` · ${rankingNote}` : ''}</p>
      <label class="sort"><span class="sr-only">Sort by</span><select bind:value={sort}>
        <option value="featured">{styles.length ? 'Best match' : 'Recommended'}</option>
        {#if fitSortLabel}<option value={sort}>Best for {fitSortLabel}</option>{/if}
        <option value="price-low">Price: low–high</option><option value="price-high">Price: high–low</option><option value="name">Name A–Z</option><option value="buttons">Most inputs</option><option value="axes">Most axes</option>
      </select></label>
      <div class="layouts" role="group" aria-label="Catalog layout">
        <button type="button" class:active={layout === 'grid'} aria-pressed={layout === 'grid'} aria-label="Grid" title="Grid" onclick={() => chooseLayout('grid')}><HardwareIcon name="grid" size={18} /></button>
        <button type="button" class:active={layout === 'table'} aria-pressed={layout === 'table'} aria-label="Table" title="Table" onclick={() => chooseLayout('table')}><HardwareIcon name="list" size={18} /></button>
      </div>
    </div>
  </div>

  {#if !filtered.length}<div class="empty"><h2>No hardware matches your filters.</h2><p>{activeCount} active {activeCount === 1 ? 'filter is' : 'filters are'} narrowing the catalog. Try fewer requirements or a broader search. Price filters use {regionStore.region} listings only.</p><button type="button" onclick={reset}>Reset all filters</button></div>
  {:else if layout === 'table'}<CatalogTable groups={grouped} {category} {styles} sort={effectiveSort} onsort={(value) => sort = value === 'match' ? 'featured' : value} />
    <p class="fit-note">{styles.length ? 'Showing fit for your flying styles only. Pick Anything to see all seven.' : 'Fit is 1–5 per flying style. Pick what you fly to narrow these columns and rank by match.'}</p>
  {:else}<div class="grid">{#each grouped as group (group.key)}<CatalogCard {group} {styles} />{/each}</div>{/if}
</section>

<style>
  /* Full-bleed navy without 100vw (which overflows next to a scrollbar). */
  .hero { position: relative; margin-top: -2rem; background: var(--color-navy); color: var(--color-on-navy); box-shadow: 0 0 0 100vmax var(--color-navy); clip-path: inset(-4px -100vmax 0); }
  /* border-image outset paints the stripe edge to edge without adding scrollable overflow. */
  .hero::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 6px; border-image: repeating-linear-gradient(120deg, var(--color-highlight) 0 28px, #f5f2e9 28px 33px, var(--color-navy) 33px 45px) fill 0 / 0 / 0 100vmax; }
  .hero-inner { display: flex; flex-wrap: wrap; align-items: end; gap: 1.25rem 2.5rem; padding-top: 1.75rem; }
  .hero-copy { flex: 1 1 26rem; min-width: 0; }
  h1 { margin: 0; font: 700 clamp(2.5rem, 4.4vw, 3.4rem)/.95 var(--font-display); text-transform: uppercase; letter-spacing: -.01em; } h1 span { color: #f69b70; }
  .hero-copy p { margin: .6rem 0 0; font-size: .95rem; color: #d0d9df; } .hero-copy a { color: inherit; text-underline-offset: .25em; }
  .hero-search { flex: 1 1 28rem; display: flex; gap: .6rem; min-width: 0; }
  .search { flex: 1; display: flex; align-items: center; gap: .6rem; min-width: 0; height: 48px; padding: 0 .9rem; background: #fffdf7; color: #586875; }
  .search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: #172e42; font: .95rem var(--font-sans); }
  .search:focus-within { outline: 2px solid var(--color-highlight); outline-offset: 2px; }
  .wizard { display: inline-flex; align-items: center; height: 48px; padding: 0 1.1rem; background: var(--color-highlight); color: #172e42; font-weight: 600; font-size: .875rem; text-decoration: none; white-space: nowrap; } .wizard:hover { background: #f69b70; }
  .styles { align-items: center; gap: .5rem .4rem; padding: 1.25rem 0 1.6rem; }
  .fly-label { margin-right: .5rem; color: #c9d3da; font-size: .8125rem; } .fly-label span { color: #8fa1ae; }
  .style { display: inline-flex; align-items: center; gap: .35rem; min-height: 36px; padding: 0 .85rem; border: 1px solid #36506a; border-radius: 2px; background: transparent; color: var(--color-on-navy); font: 600 .8125rem var(--font-sans); cursor: pointer; }
  .style:hover { border-color: var(--color-highlight); } .style.on { background: var(--color-highlight); border-color: var(--color-highlight); color: #172e42; }
  .catalog { color: var(--color-ink); font-family: var(--font-sans); scroll-margin-top: 1.5rem; }
  .categories { display: flex; flex-wrap: wrap; gap: .25rem 1.4rem; border-bottom: 1px solid var(--color-rule); padding-top: .5rem; }
  .categories button { display: flex; align-items: center; gap: .45rem; min-height: 48px; padding: 0 .1rem; border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--color-ink); font: 500 .875rem var(--font-sans); cursor: pointer; }
  .categories button:hover { color: var(--color-accent); } .categories button.active { color: var(--color-accent); border-bottom-color: var(--color-accent); font-weight: 700; }
  .toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem 1rem; padding: .9rem 0 1rem; }
  .chips { display: flex; flex-wrap: wrap; align-items: center; gap: .45rem; }
  details { position: relative; }
  summary, .toggle { display: inline-flex; align-items: center; gap: .45rem; min-height: 36px; padding: 0 .75rem; border: 1px solid var(--color-rule); border-radius: 2px; background: var(--color-surface); color: var(--color-ink); font: 500 .8125rem var(--font-sans); cursor: pointer; list-style: none; white-space: nowrap; }
  summary::-webkit-details-marker { display: none; }
  summary::after { content: ''; width: .4rem; height: .4rem; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: translateY(-2px) rotate(45deg); }
  details[open] summary::after { transform: translateY(1px) rotate(-135deg); }
  summary:hover, .toggle:hover { border-color: var(--color-accent); }
  details.active summary, .toggle.active { border-color: var(--color-accent); background: var(--color-accent-soft); color: var(--color-accent); font-weight: 600; }
  .menu { position: absolute; z-index: 20; top: calc(100% + .35rem); left: 0; display: grid; gap: .75rem; width: max-content; min-width: 14rem; max-width: min(24rem, calc(100vw - 2rem)); padding: .9rem; background: var(--color-surface); border: 1px solid var(--color-rule); box-shadow: 0 10px 30px #172e4226; font-size: .8125rem; }
  .menu.wide { max-width: min(30rem, calc(100vw - 2rem)); }
  .stack { display: grid; gap: .55rem; } .stack label, .option { display: flex; align-items: center; gap: .5rem; } .option label { flex: 1; }
  .menu input:not([type=checkbox], [type=radio]), .menu select, .sort select { display: block; width: 100%; box-sizing: border-box; border: 1px solid var(--color-rule); border-radius: 2px; padding: .55rem .6rem; background: var(--color-surface); color: var(--color-ink); font: .8125rem var(--font-sans); }
  .menu input[type=checkbox], .menu input[type=radio] { accent-color: var(--color-accent); width: 1rem; height: 1rem; margin: 0; }
  .field { display: grid; gap: .3rem; color: var(--color-muted); }
  .range { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: .4rem; color: var(--color-muted); } .range label { display: grid; gap: .3rem; } .range span { padding-bottom: .55rem; }
  .note { margin: 0; color: var(--color-muted); font-size: .75rem; line-height: 1.5; }
  .pills { display: flex; flex-wrap: wrap; gap: .4rem; }
  .pills button { display: inline-flex; align-items: center; gap: .4rem; padding: .45rem .6rem; border: 1px solid var(--color-rule); border-radius: 2px; background: var(--color-surface); color: var(--color-ink); font: .8125rem var(--font-sans); cursor: pointer; }
  .pills button:hover { border-color: var(--color-accent); } .pills button.active { color: var(--color-accent); border-color: var(--color-accent); background: var(--color-accent-soft); }
  .reset { border: 0; background: none; color: var(--color-accent); font: 600 .8125rem var(--font-sans); cursor: pointer; padding: .4rem .2rem; }
  .results-meta { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem 1rem; margin-left: auto; }
  .counter { margin: 0; color: var(--color-muted); font-size: .8125rem; } .counter strong { color: var(--color-ink); }
  .sort select { width: auto; min-height: 36px; padding: 0 .5rem; }
  .layouts { display: flex; border: 1px solid var(--color-rule); border-radius: 2px; background: var(--color-surface); }
  .layouts button { display: grid; place-items: center; width: 40px; height: 36px; border: 0; background: transparent; color: var(--color-muted); cursor: pointer; } .layouts button + button { border-left: 1px solid var(--color-rule); }
  .layouts button.active { background: var(--color-accent-soft); color: var(--color-accent); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: .9rem; }
  .fit-note { margin: .6rem 0 0; color: var(--color-muted); font-size: .75rem; }
  .empty { padding: 3rem 1rem; text-align: center; background: var(--color-surface); border: 1px solid var(--color-rule); } .empty h2 { font: 600 2rem/1.15 var(--font-display); } .empty p { color: var(--color-muted); }
  .empty button { border: 1px solid var(--color-rule); border-radius: 2px; background: var(--color-surface); color: var(--color-ink); font: .875rem var(--font-sans); padding: .65rem .8rem; cursor: pointer; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  :is(button, input, select, summary, a):focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  .hero :is(button, a):focus-visible { outline-color: var(--color-highlight); }
  @media (max-width: 640px) { .hero { margin-top: -1.4rem; } }
  @media (max-width: 700px) {
    .hero-inner { padding-top: 1.25rem; } .hero-search { flex-wrap: wrap; } .wizard { flex: 1; justify-content: center; }
    .styles { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 1.4rem; scrollbar-width: none; } .style, .fly-label { flex: none; }
    .categories { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; } .categories button { flex: none; }
    .chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; width: 100%; } .chips > * { flex: none; }
    .results-meta { margin-left: 0; width: 100%; } .counter { flex: 1; }
    .menu { position: fixed; left: 1rem; right: 1rem; top: auto; bottom: 1rem; width: auto; max-width: none; max-height: 70vh; overflow: auto; }
    .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; }
  }
  @media (max-width: 380px) { .grid { grid-template-columns: minmax(0, 1fr); } }
</style>
