<script lang="ts">
  import { onMount } from 'svelte';
  import { compareStore, MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  let { id }: { id: string } = $props();
  const selected = $derived(compareStore.hasItem(id));
  const full = $derived(!selected && compareStore.items.length >= MAX_COMPARE_ITEMS);
  onMount(() => compareStore.init());
</script>
<span title={full ? 'Comparison is full. Remove a product to add another (maximum 4).' : undefined}>
  <button type="button" aria-pressed={selected} disabled={full} onclick={() => selected ? compareStore.removeItem(id) : compareStore.addItem(id)}>{selected ? '✓ Comparing' : '+ Compare'}</button>
</span>
<style>
  button { padding: .8rem 1rem; min-height: 44px; border: 1px solid var(--color-accent); border-radius: 2px; background: var(--color-accent); color: var(--color-surface); font: 600 .875rem/1.4 var(--font-sans); cursor: pointer; }
  button[aria-pressed=true] { background: var(--color-surface); color: var(--color-accent); }
  button:hover { filter: brightness(.95); } button:disabled { opacity: .55; cursor: not-allowed; }
  button:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
</style>
