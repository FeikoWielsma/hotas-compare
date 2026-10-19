<script lang="ts">
  let { name, size = 24 }: { name: string; size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><use href={`/icons/cockpit.svg#${name}`} /></svg>

<style>svg { display: inline-block; flex: none; vertical-align: middle; }</style>
