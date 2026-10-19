<script lang="ts">
  import { onMount } from 'svelte';
  import { productImageSrc } from '../lib/catalog-ui';
  import { compareStore } from '../lib/stores/compare.svelte';
  import type { CatalogItem } from '../lib/catalog';
  let { items = [] }: { items?: CatalogItem[] } = $props();
  let catalog = $state<CatalogItem[]>([]);
  let failed = $state(false);
  const selected = $derived(compareStore.items.map((id) => (items.length ? items : catalog).find((item) => item.id === id) ?? { id, name: id, category: 'unavailable', images: [] }));
  onMount(() => {
    compareStore.init();
    if (items.length) return;
    const controller = new AbortController();
    fetch('/api/catalog.json', { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error('Catalog unavailable');
      return response.json();
    }).then((data: CatalogItem[]) => { catalog = data; }).catch((error) => { if (error.name !== 'AbortError') failed = true; });
    return () => controller.abort();
  });
</script>

{#if selected.length > 0}
  <aside class="compare-tray" aria-label="Selected comparison items">
    <div class="tray-heading"><span class="tray-title">Your comparison</span><span aria-live="polite">{selected.length} of 4 products</span></div>
    <div class="tray-content">
      <ul>
        {#each selected as item (item.id)}
          {@const photo = productImageSrc(item.images[0]?.file)}
          <li>
            {#if photo}<img src={photo} alt="" onerror={(event) => { event.currentTarget.hidden = true; }} />{/if}
            <div><span class="item-name">{item.name}</span><span class="badge">{item.category.replaceAll('_', ' ')}</span></div>
            <button type="button" class="remove" aria-label={`Remove ${item.name} from comparison`} onclick={() => compareStore.removeItem(item.id)}>×</button>
          </li>
        {/each}
      </ul>
      <div class="actions"><a class="compare-link" href={compareStore.href}>Compare {selected.length} <span aria-hidden="true">↗</span></a><button type="button" onclick={() => compareStore.clear()}>Clear all</button></div>
    </div>
    {#if failed}<p role="status">Product names could not be loaded. Your selection is saved.</p>{/if}
  </aside>
{/if}

<style>
  .compare-tray { position: fixed; z-index: 40; bottom: max(1rem, env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%); width: min(1100px, calc(100% - 2rem)); max-height: calc(100dvh - 2rem); overflow-y: auto; padding: 1rem; border: 1px solid var(--color-rule); border-top: 2px solid var(--color-ink); border-radius: 2px; background: var(--color-surface); color: var(--color-ink); font-family: var(--font-sans); box-shadow: 0 8px 28px #172e421f; }
  .tray-heading { display: flex; justify-content: space-between; flex-wrap: wrap; gap: .5rem; font-size: .8125rem; color: var(--color-muted); margin-bottom: .75rem; } .tray-title { color: var(--color-ink); font-size: .875rem; font-weight: 700; }
  .tray-content { display: flex; align-items: center; gap: 1rem; }
  ul { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); flex: 1; gap: .5rem; list-style: none; margin: 0; padding: 0; min-width: 0; }
  li { display: flex; align-items: center; gap: .5rem; min-width: 0; padding: .5rem; background: var(--color-paper); border: 1px solid var(--color-rule); }
  li div { flex: 1; min-width: 0; } img { width: 40px; height: 40px; flex-shrink: 0; object-fit: contain; background: var(--color-photo); }
  .item-name { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font: 500 .875rem/1.4 var(--font-sans); } .badge { display: block; margin-top: .25rem; color: var(--color-muted); font-size: .75rem; }
  button { background: none; border: 0; color: var(--color-muted); cursor: pointer; padding: .5rem; min-height: 44px; font: .875rem var(--font-sans); } button:hover { color: var(--color-accent); } .remove { font-size: 1.25rem; min-width: 44px; }
  .actions { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; } .compare-link { display: inline-flex; justify-content: center; gap: .75rem; padding: .8rem 1rem; background: var(--color-accent); color: var(--color-surface); font: 700 .875rem var(--font-sans); text-decoration: none; border-radius: 2px; }
  p { font-size: .8125rem; color: var(--color-muted); } :is(a, button):focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
  @media (max-width: 640px) { .compare-tray { width: calc(100% - 1rem); bottom: max(.5rem, env(safe-area-inset-bottom)); padding: .75rem; } .tray-content { flex-direction: column; align-items: stretch; gap: .75rem; } ul { grid-template-columns: 1fr; max-height: 144px; overflow-y: auto; } .actions { flex-direction: row; justify-content: space-between; gap: .5rem; } .compare-link { flex: 1; } }
</style>
