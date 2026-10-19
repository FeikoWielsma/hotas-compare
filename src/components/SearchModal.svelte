<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import type { CatalogItem } from '../lib/catalog';
  import { categoryLabels, productImageSrc } from '../lib/catalog-ui';
  import { resolvePrice } from '../lib/derive';
  import { regionStore } from '../lib/stores/region.svelte';
  import type { Region } from '../lib/schema';

  type SearchItem = Pick<CatalogItem, 'name' | 'brandName' | 'category' | 'prices' | 'formerBrandNames'> & { url: string; image?: string };
  type Result = { url: string; title: string; item?: SearchItem };
  type Pagefind = { search: (query: string) => Promise<{ results: { data: () => Promise<{ url: string; meta: { title?: string } }> }[] }> };
  let { initialItems = [], initialRegion }: { initialItems?: SearchItem[]; initialRegion?: Region } = $props();
  let dialog: HTMLDialogElement;
  let searchButton: HTMLButtonElement;
  let input = $state<HTMLInputElement>();
  let open = $state(false);
  let query = $state('');
  let results = $state<Result[]>([]);
  let busy = $state(false);
  let pagefind: Promise<Pagefind | null> | undefined;
  let generation = 0;
  let trigger: HTMLElement | null = null;
  const path = (url: string) => new URL(url, 'https://hotas.razortek.nl').pathname.replace(/\/$/, '');

  function fallback(term: string): Result[] {
    const words = term.toLowerCase().split(/\s+/).filter(Boolean);
    return initialItems.filter(item => words.every(word => `${item.name} ${item.brandName} ${item.formerBrandNames.join(' ')} ${categoryLabels[item.category]}`.toLowerCase().includes(word)))
      .slice(0, 12).map(item => ({ url: item.url, title: item.name, item }));
  }
  async function search(term: string, version: number) {
    const local = fallback(term);
    try {
      // Pagefind is generated after the production build; Vite must leave this URL intact.
      const moduleUrl = '/pagefind/pagefind.js';
      pagefind ??= import(/* @vite-ignore */ moduleUrl).catch(() => null);
      const api = await pagefind;
      let found = local;
      if (api) {
        const response = await api.search(term);
        const pages = await Promise.all(response.results.slice(0, 12).map(result => result.data()));
        found = pages.map(page => {
          const item = initialItems.find(item => path(item.url) === path(page.url));
          return { url: page.url, title: item?.name ?? page.meta.title ?? 'View page', item };
        });
      }
      if (version === generation) results = found;
    } catch {
      if (version === generation) results = local;
    } finally {
      if (version === generation) busy = false;
    }
  }
  $effect(() => {
    const term = query.trim();
    const version = ++generation;
    if (!open) return;
    busy = !!term;
    results = term ? [] : fallback('');
    if (!term) return;
    const timer = window.setTimeout(() => void search(term, version), 180);
    return () => window.clearTimeout(timer);
  });
  async function show() {
    if (dialog.open) return;
    trigger = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : searchButton;
    dialog.showModal();
    open = true;
    await tick();
    input?.focus();
  }
  function close() { open = false; }
  function finishClose() {
    if (open) return;
    dialog.close();
    query = '';
    trigger?.focus();
  }
  onMount(() => {
    regionStore.init(initialRegion);
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (dialog.open) close(); else void show();
      }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  });
</script>

<button bind:this={searchButton} class="search-trigger" type="button" aria-haspopup="dialog" aria-controls="quick-search" onclick={show}>Search <kbd>Ctrl+K</kbd></button>
<dialog bind:this={dialog} id="quick-search" aria-labelledby="search-title" oncancel={(event) => { event.preventDefault(); close(); }} onclick={(event) => { if (event.target === dialog) close(); }} onkeydown={(event) => { if (event.key === 'Escape') { event.preventDefault(); close(); } }}>
  {#if open}
    <div class="search-panel" in:fly={{ y: -12, duration: 160 }} out:fade={{ duration: 120 }} onoutroend={finishClose}>
      <header><div><h2 id="search-title">Find your next upgrade.</h2></div><button type="button" class="close" aria-label="Close search" onclick={close}>Esc ×</button></header>
      <label for="search-query">Search hardware, brands and guides</label>
      <input bind:this={input} bind:value={query} id="search-query" type="search" placeholder="Try Gladiator, throttle, VKB…" autocomplete="off" aria-controls="search-results" />
      <p class="readout" role="status">{busy ? 'Searching…' : `${results.length} results${results.length === 12 ? ' · top matches' : ''}`} <span>{regionStore.region} prices</span></p>
      <ul id="search-results" aria-busy={busy}>
        {#each results as result (result.url)}
          <li><a href={result.url}>{#if result.item}{@const photo = productImageSrc(result.item.image)}{#if photo}<img class="thumb" src={photo} alt="" />{/if}{/if}<span class="result-copy"><span class="category">{result.item ? categoryLabels[result.item.category] : 'Guide / page'}</span><strong>{result.title}</strong><span class="brand">{result.item?.brandName ?? 'HOTAS Compare'}</span></span>{#if result.item}{@const price = resolvePrice(result.item.prices, regionStore.region)}<span class="price">{price.formatted ?? 'Price unavailable'}{#if price.isStale}<small>Verify store price</small>{/if}</span>{/if}<span class="arrow" aria-hidden="true">↗</span></a></li>
        {:else}
          <li class="empty">{busy ? 'Searching the catalog…' : 'No results found. Try a product name, brand or category.'}</li>
        {/each}
      </ul>
      <footer>Tab to navigate <span>Enter to select · Esc to close</span></footer>
    </div>
  {/if}
</dialog>

<style>
  .search-trigger,.close{border:1px solid var(--color-rule);background:transparent;color:var(--color-muted);border-radius:2px;padding:.6rem .7rem;font:.75rem var(--font-sans);cursor:pointer;min-height:38px}.search-trigger:hover,.close:hover{color:var(--color-accent);border-color:var(--color-accent)}kbd{margin-left:.5rem;font:inherit;color:var(--color-muted)}
  dialog{padding:0;border:0;background:transparent;color:var(--color-ink);width:min(740px,calc(100% - 2rem));max-height:85dvh;margin:7dvh auto;overflow:visible}dialog::backdrop{background:rgb(15 33 47 / .65)}
  .search-panel{border:1px solid var(--color-rule);border-top:4px solid var(--color-accent);background:var(--color-surface);box-shadow:0 18px 60px #12263830;padding:1.75rem;max-height:84dvh;display:flex;flex-direction:column}header{display:flex;justify-content:space-between;gap:1rem;align-items:start}h2{font:600 2.75rem/1 var(--font-display);margin:.4rem 0 1.25rem}label{font-size:.9rem;color:var(--color-muted);margin-bottom:.6rem}input{background:var(--color-paper);color:var(--color-ink);border:1px solid var(--color-rule);padding:1rem;width:100%;border-radius:2px;font:inherit}.readout,footer{font-size:.8rem;display:flex;justify-content:space-between;gap:.5rem;color:var(--color-muted)}.readout{padding:.4rem 0}ul{list-style:none;padding:0;margin:0;overflow:auto;overscroll-behavior:contain;min-height:80px}li+li{border-top:1px solid var(--color-rule)}.thumb{width:60px;height:60px;object-fit:contain;background:var(--color-photo);flex:none}li a{display:flex;align-items:center;gap:1rem;padding:1rem .5rem;text-decoration:none}li a:hover,li a:focus-visible{background:var(--color-paper)}.result-copy{display:flex;flex-direction:column;gap:.3rem;flex:1;min-width:0}.category{font-size:.75rem;color:var(--color-muted)}strong{font-size:.95rem;font-weight:600}.brand,.price{font-size:.8rem;color:var(--color-muted)}.price{text-align:right;max-width:150px;font-variant-numeric:tabular-nums}small{display:block;font-size:.75rem;color:var(--color-accent);margin-top:.3rem}.arrow{color:var(--color-accent)}.empty{padding:2rem .5rem;color:var(--color-muted)}footer{border-top:1px solid var(--color-rule);padding-top:1rem;margin-top:.5rem}
  @media(max-width:480px){.search-panel{padding:1rem}.search-trigger kbd{display:none}.price{max-width:90px;font-size:.75rem}footer{flex-wrap:wrap}.thumb{width:44px;height:44px}li a{gap:.65rem}.arrow{display:none}h2{font-size:2.2rem}}
  @media(prefers-reduced-motion:reduce){.search-panel{transform:none!important;transition:none!important;animation-duration:0s!important}}
</style>
