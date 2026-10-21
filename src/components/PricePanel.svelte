<script lang="ts">
  import { onMount } from 'svelte';
  import AddCompare from './AddCompare.svelte';
  import { resolvePrice } from '../lib/derive';
  import { regionStore } from '../lib/stores/region.svelte';
  import type { Price, Region } from '../lib/schema';
  let { id, prices, notes = {} }: { id: string; prices: Price[]; notes?: Record<string, string> } = $props();
  const regions: Region[] = ['EU', 'UK', 'US'];
  const money = (p: Price) => new Intl.NumberFormat('en', { style: 'currency', currency: p.currency }).format(p.amount);
  const active = $derived(resolvePrice(prices, regionStore.region));
  const others = $derived(regions.filter((r) => r !== regionStore.region).map((region) => ({ region, price: prices.find((p) => p.region === region) })));
  onMount(() => regionStore.init());
</script>

<aside class="buy" aria-label="Price and comparison">
  <p class="label">Price in {regionStore.region}</p>
  {#if active.price}
    <p class="amount">{money(active.price)}</p>
    <p class="meta">{active.price.incl_vat ? 'Incl. VAT' : 'Excl. sales tax'} · checked {active.price.verified}{#if active.isStale}<span class="stale"> · over 90 days old</span>{/if}</p>
    {#if active.price.url}<a class="store" href={active.price.url} rel="external noopener">View at {active.price.store} <span aria-hidden="true">↗</span></a>{:else}<p class="meta">Listed by {active.price.store}</p>{/if}
  {:else}
    <p class="amount none">No {regionStore.region} price listed</p>
    <p class="meta">Try another region, or check the manufacturer’s store.</p>
  {/if}
  <div class="compare"><AddCompare {id} /></div>
  <dl class="others">{#each others as { region, price }}<div><dt>{region}</dt><dd>{#if price}{#if price.url}<a href={price.url} rel="external noopener">{money(price)}</a>{:else}{money(price)}{/if}{:else}—{/if}</dd></div>{/each}</dl>
  {#if notes[regionStore.region]}<p class="note"><b>Shipping to {regionStore.region}:</b> {notes[regionStore.region]}</p>{/if}
</aside>

<style>
  .buy { display: grid; gap: .35rem; padding: 1.25rem; border: 1px solid var(--color-rule); border-top: 3px solid var(--color-accent); background: var(--color-surface); color: var(--color-ink); font-family: var(--font-sans); }
  p { margin: 0; }
  .label { font-size: .75rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--color-muted); }
  .amount { font: 700 2.4rem/1.05 var(--font-display); font-variant-numeric: tabular-nums; } .amount.none { font-size: 1.5rem; color: var(--color-muted); }
  .meta { font-size: .8125rem; color: var(--color-muted); } .stale { color: var(--color-danger); }
  .store { margin-top: .35rem; font-size: .875rem; font-weight: 600; color: var(--color-accent); }
  .compare { margin-top: .75rem; } .compare :global(button) { width: 100%; }
  .others { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin: .75rem 0 0; padding-top: .75rem; border-top: 1px solid var(--color-rule); }
  .others div { display: flex; justify-content: space-between; gap: .5rem; font-size: .8125rem; } .others dt { color: var(--color-muted); } .others dd { margin: 0; font-variant-numeric: tabular-nums; } .others a { color: inherit; }
  .note { margin-top: .5rem; font-size: .75rem; line-height: 1.6; color: var(--color-muted); }
</style>
