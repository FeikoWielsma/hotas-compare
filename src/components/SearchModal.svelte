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
      <header><div><p class="telemetry">DATABASE UPLINK // QUICK SEARCH</p><h2 id="search-title">Acquire a new target.</h2></div><button type="button" class="close" aria-label="Close search" onclick={close}>Esc ×</button></header>
      <label for="search-query">Search hardware, brands and cockpit guides</label>
      <input bind:this={input} bind:value={query} id="search-query" type="search" placeholder="Try Gladiator, throttle, VKB…" autocomplete="off" aria-controls="search-results" />
      <p class="readout" role="status">{busy ? 'SCANNING DATABASE…' : `${results.length} CONTACTS${results.length === 12 ? ' / TOP RESULTS' : ''}`} <span>{regionStore.region} PRICING</span></p>
      <ul id="search-results" aria-busy={busy}>
        {#each results as result (result.url)}
          <li><a href={result.url}>{#if result.item}{@const photo = productImageSrc(result.item.image)}{#if photo}<img class="thumb" src={photo} alt="" />{/if}{/if}<span class="result-copy"><span class="category">{result.item ? categoryLabels[result.item.category] : 'Guide / page'}</span><strong>{result.title}</strong><span class="brand">{result.item?.brandName ?? 'HOTAS // COMPARE'}</span></span>{#if result.item}{@const price = resolvePrice(result.item.prices, regionStore.region)}<span class="price">{price.formatted ?? 'Price unavailable'}{#if price.isStale}<small>Verify store price</small>{/if}</span>{/if}<span class="arrow" aria-hidden="true">↗</span></a></li>
        {:else}
          <li class="empty">{busy ? 'Searching the flight control database…' : 'No contacts found. Try a product name, brand or category.'}</li>
        {/each}
      </ul>
      <footer>Tab to navigate <span>Enter to select // Esc to close</span></footer>
    </div>
  {/if}
</dialog>

<style>
  .search-trigger,.close{border:1px solid var(--border-cockpit);background:transparent;color:var(--text-secondary);border-radius:3px;padding:.65rem;font:.7rem var(--font-mono);cursor:pointer}.search-trigger:hover,.close:hover{color:var(--accent-amber);border-color:var(--accent-amber)}kbd{margin-left:.5rem;font:inherit;color:var(--accent-amber)}
  dialog{padding:0;border:0;background:transparent;color:var(--text-primary);width:min(720px,calc(100% - 2rem));max-height:85dvh;margin:8dvh auto;overflow:visible}dialog::backdrop{background:rgb(3 7 14 / .82);backdrop-filter:blur(5px)}
  .search-panel{border:1px solid var(--accent-amber);border-radius:4px;background:var(--bg-panel);box-shadow:0 0 70px var(--accent-amber-glow);padding:1.5rem;max-height:84dvh;display:flex;flex-direction:column}header{display:flex;justify-content:space-between;gap:1rem;align-items:start}h2{font-size:1.45rem;margin:.4rem 0 1.25rem}.telemetry,.readout,footer{font:.65rem var(--font-mono);letter-spacing:.06em}.telemetry{margin:0;color:var(--accent-amber)}label{font-size:.8rem;color:var(--text-secondary);margin-bottom:.5rem}input{background:var(--bg-cockpit);color:var(--text-primary);border:1px solid var(--border-cockpit);padding:1rem;width:100%;border-radius:3px;font:inherit}.readout,footer{display:flex;justify-content:space-between;gap:.5rem;color:var(--text-secondary)}.readout{padding:.4rem 0}ul{list-style:none;padding:0;margin:0;overflow:auto;overscroll-behavior:contain;min-height:80px}li+li{border-top:1px solid var(--border-cockpit)}.thumb{width:52px;height:52px;object-fit:contain;background:#f4f1ea;border-radius:3px;flex:none}li a{display:flex;align-items:center;gap:1rem;padding:.85rem .5rem;text-decoration:none}li a:hover,li a:focus-visible{background:var(--bg-panel-elevated)}.result-copy{display:flex;flex-direction:column;gap:.3rem;flex:1}.category{border:1px solid var(--border-cockpit);padding:.1rem .4rem;width:fit-content;font:.6rem var(--font-mono);text-transform:uppercase;color:var(--accent-amber)}strong{font-size:.9rem}.brand,.price{font-size:.75rem;color:var(--text-secondary)}.price{text-align:right;max-width:170px;font-family:var(--font-mono)}small{display:block;font-size:.6rem;color:var(--accent-amber);margin-top:.3rem}.arrow{color:var(--accent-amber)}.empty{padding:2rem .5rem;color:var(--text-secondary)}footer{border-top:1px solid var(--border-cockpit);padding-top:1rem;margin-top:.5rem;font-size:.58rem}
  @media(max-width:480px){.search-panel{padding:1rem}.search-trigger kbd{display:none}.price{max-width:110px;font-size:.65rem}footer{flex-wrap:wrap}.telemetry{font-size:.55rem}}
  @media(prefers-reduced-motion:reduce){.search-panel{transform:none!important;transition:none!important;animation-duration:0s!important}}
</style>
