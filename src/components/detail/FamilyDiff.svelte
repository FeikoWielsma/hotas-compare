<script lang="ts">
  import { onMount } from 'svelte';
  import type { FamilyView } from '../../lib/families';
  import type { CatalogItem } from '../../lib/catalog';
  import { familyDiffRows, type DeskSpecs } from '../../lib/family-detail';
  import { detailHref } from '../../lib/catalog-ui';
  import { regionStore } from '../../lib/stores/region.svelte';
  let { family, mountNames, physical }: { family: FamilyView<CatalogItem>; mountNames: Record<string, string>; physical: DeskSpecs } = $props();
  const rows = $derived(familyDiffRows(family.lineup.map(member => member.item), regionStore.region, mountNames, physical));
  onMount(() => regionStore.init());
</script>

<section id="family" aria-labelledby="family-title">
  <p class="kicker">{family.name}</p>
  <h2 id="family-title">What changes between versions</h2>
  <p class="note">Only documented differences are shown. Missing data does not mean a feature is absent. Dimensions and weight help compare desk space and stability; desk suitability is not rated. Prices follow your selected region.</p>
  {#if rows.length}
    <p class="hint">Scroll across to compare every version.</p>
    <div class="scroll" tabindex="0" role="region" aria-label={`${family.name} differences`}>
      <table>
        <caption>{family.name} — differences in {regionStore.region}</caption>
        <thead><tr><th scope="col">Specification</th>{#each family.lineup as member}<th scope="col" class:current={member.id === family.current.id}><a href={detailHref(member.item)} aria-current={member.id === family.current.id ? 'page' : undefined}>{member.label}</a>{#if member.id === family.current.id}<small>Current version</small>{/if}{#if member.item.status === 'discontinued'}<small>Discontinued</small>{/if}</th>{/each}</tr></thead>
        <tbody>{#each rows as row}<tr><th scope="row">{row.label}</th>{#each row.values as value, index}<td class:current={family.lineup[index].id === family.current.id}>{value}</td>{/each}</tr>{/each}</tbody>
      </table>
    </div>
  {:else}<p>No differences documented for these versions in {regionStore.region}.</p>{/if}
</section>

<style>
  section { padding-top: 1.5rem; border-top: 1px solid var(--color-rule); scroll-margin-top: 4rem; }
  .kicker { margin: 0; color: var(--color-accent); font-size: .8rem; font-weight: 600; }
  h2 { margin: .25rem 0 1rem; font-size: clamp(1.9rem, 3vw, 2.5rem); text-transform: uppercase; }
  .note, .hint { color: var(--color-muted); font-size: .85rem; max-width: 85ch; line-height: 1.6; }
  .hint { margin-bottom: .5rem; }
  .scroll { max-width: 100%; overflow-x: auto; border: 1px solid var(--color-rule); }
  table { border-collapse: collapse; width: 100%; font-size: .875rem; }
  caption { text-align: left; padding: .75rem; color: var(--color-muted); }
  th, td { min-width: 10rem; padding: .85rem; text-align: left; vertical-align: top; border-top: 1px solid var(--color-rule); }
  th { background: var(--color-surface); font-weight: 600; }
  tbody th, thead th:first-child { position: sticky; left: 0; min-width: 9rem; max-width: 12rem; z-index: 1; }
  .current { background: color-mix(in srgb, var(--color-accent) 10%, var(--color-paper)); }
  a { color: var(--color-accent); } small { display: block; color: var(--color-muted); font-weight: 400; margin-top: .25rem; }
</style>
