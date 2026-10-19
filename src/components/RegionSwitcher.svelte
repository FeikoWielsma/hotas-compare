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
  .region-switcher { display: inline-flex; padding: 3px; gap: 2px; border: 1px solid var(--border-cockpit); background: var(--bg-cockpit); border-radius: 4px; }
  button { border: 0; border-radius: 2px; padding: .5rem .6rem; background: transparent; color: var(--text-secondary); font: 600 .75rem var(--font-mono); cursor: pointer; white-space: nowrap; }
  button:hover { color: var(--text-primary); background: var(--bg-panel-elevated); }
  button[aria-pressed='true'] { color: var(--accent-amber-light); background: var(--accent-amber-glow); box-shadow: inset 0 -2px var(--accent-amber); }
</style>
