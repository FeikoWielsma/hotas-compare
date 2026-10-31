<script lang="ts">
  import { onMount } from 'svelte';
  import AddCompare from './AddCompare.svelte';
  import { resolvePrice } from '../lib/derive';
  import { regionStore } from '../lib/stores/region.svelte';
  import type { Price } from '../lib/schema';
  /** One-row price and Compare control for narrow screens, where the full panel falls below the specs. */
  let { id, prices }: { id: string; prices: Price[] } = $props();
  const price = $derived(resolvePrice(prices, regionStore.region).price);
  onMount(() => regionStore.init());
</script>

<div class="summary">
  {#if price}<strong>{new Intl.NumberFormat('en', { style: 'currency', currency: price.currency }).format(price.amount)}</strong>{:else}<span class="none">No {regionStore.region} price</span>{/if}
  <a href="#pricing">All prices</a>
  <AddCompare {id} />
</div>

<style>
  .summary { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem .9rem; font-family: var(--font-sans); }
  strong { font: 700 1.75rem/1 var(--font-display); font-variant-numeric: tabular-nums; } .none { color: var(--color-muted); font-size: .875rem; }
  a { color: var(--color-accent); font-size: .8125rem; font-weight: 600; } .summary > :global(:last-child) { margin-left: auto; }
</style>
