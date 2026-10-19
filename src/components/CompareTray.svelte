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
    <div class="tray-heading"><span class="telemetry">COMPARE BUFFER</span><span aria-live="polite">{selected.length} / 4 slots</span></div>
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
      <div class="actions"><a class="compare-link" href={compareStore.href}>Compare {selected.length}/4 <span aria-hidden="true">↗</span></a><button type="button" onclick={() => compareStore.clear()}>Clear all</button></div>
    </div>
    {#if failed}<p role="status">Product names could not be loaded. Your selection is saved.</p>{/if}
  </aside>
{/if}

<style>
  .compare-tray { position: fixed; z-index: 40; bottom: max(1rem, env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%); width: min(1100px, calc(100% - 2rem)); padding: 1rem; border: 1px solid var(--border-cockpit-glow); border-top: 2px solid var(--accent-amber); border-radius: 5px; background: var(--bg-panel); box-shadow: 0 12px 48px #0006; }
  .tray-heading { display: flex; justify-content: space-between; gap: 1rem; font: .65rem var(--font-mono); color: var(--text-secondary); margin-bottom: .75rem; }
  .telemetry { color: var(--accent-amber); letter-spacing: .13em; }
  .tray-content { display: flex; align-items: center; gap: 1rem; }
  ul { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); flex: 1; gap: .5rem; list-style: none; margin: 0; padding: 0; min-width: 0; }
  li { display: flex; align-items: center; gap: .5rem; min-width: 0; padding: .6rem; background: var(--bg-cockpit); border: 1px solid var(--border-cockpit); }
  li div { flex: 1; min-width: 0; } img { width: 40px; height: 40px; object-fit: contain; background: #f4f1ea; border-radius: 3px; }
  .item-name { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: .75rem; }
  .badge { display: block; margin-top: .25rem; color: var(--text-secondary); font: .6rem var(--font-mono); text-transform: uppercase; }
  button { background: none; border: 0; color: var(--text-secondary); cursor: pointer; padding: .5rem; font: .75rem var(--font-mono); }
  button:hover { color: var(--accent-amber); } .remove { font-size: 1.25rem; }
  .actions { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .compare-link { padding: .7rem 1rem; background: var(--accent-amber); color: #0b0e14; font: 700 .8rem var(--font-mono); text-decoration: none; border-radius: 2px; }
  p { font-size: .75rem; color: var(--text-secondary); }
  @media (max-width: 640px) { .tray-content { align-items: stretch; } ul { grid-template-columns: 1fr; max-height: 145px; overflow-y: auto; } .actions { justify-content: center; } }
</style>
