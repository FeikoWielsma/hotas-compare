<script lang="ts">
  import { onMount } from 'svelte';
  import { regionStore } from '../lib/stores/region.svelte';
  import type { Region } from '../lib/schema';
  let { initialRegion }: { initialRegion?: Region } = $props();
  const options = [{ region: 'EU', label: 'EU €' }, { region: 'UK', label: 'UK £' }, { region: 'US', label: 'US $' }] as const;
  onMount(() => regionStore.init(initialRegion));
</script>

<div class="region-switcher" role="group" aria-label="Price region">
  {#each options as option}
    <button type="button" aria-pressed={regionStore.region === option.region} onclick={() => regionStore.setRegion(option.region)}>{option.label}</button>
  {/each}
</div>

<style>
  .region-switcher { display: inline-flex; padding: 3px; gap: 2px; border: 1px solid var(--color-rule); background: var(--color-paper); border-radius: 2px; }
  button { border: 0; border-radius: 2px; padding: .5rem .6rem; background: transparent; color: var(--color-muted); font: 600 .75rem var(--font-sans); cursor: pointer; white-space: nowrap; }
  button:hover { color: var(--color-ink); background: var(--color-surface); }
  button[aria-pressed='true'] { color: var(--color-accent); background: var(--color-accent-soft); box-shadow: inset 0 -2px var(--color-accent); }
</style>
