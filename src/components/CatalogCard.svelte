<script lang="ts">
  import ProductCard from './ProductCard.svelte';
  import { handOf, type CatalogGroup } from '../lib/catalog-filter';
  import type { UseCase } from '../lib/schema';
  let { group, styles = [] }: { group: CatalogGroup; styles?: UseCase[] } = $props();
  /** The variant the visitor picked. When filters remove it, the card keeps its label if that still matches, else shows the group's lead. */
  let picked = $state<{ id: string; label: string } | null>(null);
  const items = $derived(group.options.flatMap((option) => option.variants));
  const item = $derived(items.find((variant) => variant.id === picked?.id) ?? group.options.find((candidate) => candidate.label === picked?.label)?.variants[0] ?? group.lead);
  const option = $derived(group.options.find((candidate) => candidate.variants.some((variant) => variant.id === item.id))!);
  /** Short label sets fit as a segmented switch; long ones (module layouts, editions) use a menu. */
  const segmented = $derived(group.options.length <= 4 && group.options.reduce((sum, { label }) => sum + label.length, 0) <= 28);
  /** Switching label keeps the current hand (the lead's, on catalog cards) where that label offers it. */
  const pick = (id: string, label = option.label) => { picked = { id, label }; };
  function chooseOption(label: string) {
    const target = group.options.find((candidate) => candidate.label === label);
    if (target) pick((target.variants.find((variant) => handOf(variant) === handOf(item)) ?? target.variants[0]).id, label);
  }
</script>

<ProductCard {item} {styles}>
  {#snippet picker()}
    {#if group.family && group.options.length > 1}
      {#if segmented}<div class="switch" role="group" aria-label={`${group.family.name} ${group.family.axis.toLocaleLowerCase()}`}>{#each group.options as candidate (candidate.label)}<button type="button" class:active={candidate === option} aria-pressed={candidate === option} onclick={() => chooseOption(candidate.label)}>{candidate.label}</button>{/each}</div>
      {:else}<label class="menu"><span>{group.family.axis}</span><select value={option.label} onchange={(event) => chooseOption(event.currentTarget.value)}>{#each group.options as candidate (candidate.label)}<option value={candidate.label}>{candidate.label}</option>{/each}</select></label>{/if}
    {/if}
  {/snippet}
</ProductCard>

<style>
  .switch { display: inline-flex; flex-wrap: wrap; max-width: 100%; margin: 0 .4rem 0 0; border: 1px solid var(--color-rule); border-radius: 2px; vertical-align: middle; }
  .switch button { padding: .2rem .6rem; min-height: 0; border: 0; border-radius: 0; background: transparent; color: var(--color-muted); font: 600 .72rem/1.4 var(--font-sans); cursor: pointer; }
  .switch button + button { border-left: 1px solid var(--color-rule); }
  .switch button.active { color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 8%, var(--color-surface)); }
  .menu { display: flex; align-items: center; gap: .45rem; color: var(--color-muted); font: 600 .72rem/1.4 var(--font-sans); }
  .menu span { white-space: nowrap; }
  .menu select { flex: 1; min-width: 0; max-width: 100%; padding: .25rem .4rem; border: 1px solid var(--color-rule); border-radius: 2px; background: var(--color-surface); color: var(--color-ink); font: .78rem/1.4 var(--font-sans); }
  :is(a, button, select):focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
</style>
