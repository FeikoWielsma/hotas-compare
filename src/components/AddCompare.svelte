<script lang="ts">
  import { compareStore } from '../lib/stores/compare.svelte';
  let { id }: { id: string } = $props();
  let added = $state(false);
  function add() { added = compareStore.addItem(id); }
</script>
<button type="button" onclick={add}>{added ? 'Added to compare' : '+ Compare'}</button>
<style>button{padding:.7rem 1rem;border:1px solid var(--accent-amber);border-radius:3px;background:var(--accent-amber);color:#0b0e14;font:600 .8rem var(--font-mono);cursor:pointer}</style>
