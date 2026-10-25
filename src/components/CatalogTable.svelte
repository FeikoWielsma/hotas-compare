<script lang="ts">
  import type { CatalogGroup } from '../lib/catalog-filter';
  import { matchScore } from '../lib/catalog-filter';
  import type { UseCase } from '../lib/schema';
  import { detailHref, formatAmount, productImageSrc } from '../lib/catalog-ui';
  import { flyingStyles, tableColumns } from '../lib/catalog-columns';
  import GimbalBadge from './GimbalBadge.svelte';
  import { regionStore } from '../lib/stores/region.svelte';
  import { compareStore, MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  /** One row per catalog card (its lead variant). Spec columns follow the category tab; fit columns follow the visitor's flying styles. */
  let { groups, category, styles, sort, onsort }: { groups: CatalogGroup[]; category: string; styles: UseCase[]; sort: string; onsort: (sort: string) => void } = $props();
  const columns = $derived(tableColumns[category] ?? tableColumns.All);
  const fitColumns = $derived(flyingStyles.filter(({ key }) => !styles.length || styles.includes(key)));
  const showMatch = $derived(styles.length > 1);
  const heat = (value: number) => `h${Math.max(0, Math.min(5, Math.round(value)))}`;
  const round = (value: number) => Number(value.toFixed(1));
  const versions = (group: CatalogGroup) => group.options.reduce((sum, option) => sum + option.variants.length, 0);
</script>

<div class="scroller">
  <table>
    <thead>
      <tr>
        <th scope="col" class="check"><span class="sr-only">Compare</span></th>
        <th scope="col" class="product">Product</th>
        {#each columns as column (column.label)}<th scope="col">{column.label}</th>{/each}
        {#if showMatch}<th scope="col" class="fit" aria-sort={sort === 'match' ? 'descending' : 'none'}><button type="button" class:active={sort === 'match'} title="Rank by average fit across your flying styles" onclick={() => onsort('match')}>Match{sort === 'match' ? ' ▾' : ''}</button></th>{/if}
        {#each fitColumns as style (style.key)}<th scope="col" class="fit" aria-sort={sort === `fit:${style.key}` ? 'descending' : 'none'}><button type="button" class:active={sort === `fit:${style.key}`} title={`Rank by ${style.label} fit`} onclick={() => onsort(`fit:${style.key}`)}>{styles.length ? style.label : style.short}{sort === `fit:${style.key}` ? ' ▾' : ''}</button></th>{/each}
        <th scope="col" class="price" aria-sort={sort === 'price-low' ? 'ascending' : 'none'}><button type="button" class:active={sort === 'price-low'} title="Cheapest first" onclick={() => onsort('price-low')}>Price{sort === 'price-low' ? ' ▴' : ''}</button></th>
      </tr>
    </thead>
    <tbody>
      {#each groups as group (group.key)}
        {@const item = group.lead}
        {@const photo = productImageSrc(item.images[0]?.file)}
        {@const selected = compareStore.hasItem(item.id)}
        {@const full = !selected && compareStore.items.length >= MAX_COMPARE_ITEMS}
        <tr class:selected>
          <td class="check"><input type="checkbox" checked={selected} disabled={full} title={full ? 'Comparison is full (maximum 4).' : undefined} aria-label={`Compare ${item.name}`} onchange={() => selected ? compareStore.removeItem(item.id) : compareStore.addItem(item.id)} /></td>
          <td class="product">
            <div class="identity">
              {#if photo}<img src={photo} alt="" loading="lazy" />{:else}<span class="nophoto" aria-hidden="true"></span>{/if}
              <div>
                <a href={detailHref(item)}>{item.name}</a>
                <span class="brand">{item.brandName}{#if versions(group) > 1}<span class="versions">&nbsp;· {versions(group)} versions</span>{/if}</span>
              </div>
            </div>
          </td>
          {#each columns as column (column.label)}
            {@const value = column.value(item)}
            <td class:unknown={value == null || value === 'No' || value === 'None'}>{#if column.gimbal && item.gimbalType}<GimbalBadge type={item.gimbalType} variant="pill" />{:else}{value ?? '—'}{/if}</td>
          {/each}
          {#if showMatch}{@const match = matchScore(item, styles)!}<td class="fit"><span class={`heat ${heat(match)}`} class:ring={sort === 'match'} title="Average fit across your flying styles">{round(match)}</span></td>{/if}
          {#each fitColumns as style (style.key)}
            {@const value = item.use_case_fit[style.key]}
            <td class="fit"><span class={`heat ${heat(value)}`} class:ring={sort === `fit:${style.key}`} title={`${style.label} fit: ${round(value)}/5`}>{round(value)}</span></td>
          {/each}
          <td class="price">{item.resolvedPrice.price ? formatAmount(item) : `No ${regionStore.region} price`}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .scroller { overflow-x: auto; background: var(--color-surface); border: 1px solid var(--color-rule); }
  table { width: 100%; min-width: 900px; border-collapse: collapse; font: .8125rem/1.35 var(--font-sans); color: var(--color-ink); }
  thead th { position: sticky; top: 0; z-index: 1; background: var(--color-navy); color: var(--color-on-navy); font-size: .75rem; font-weight: 600; text-align: left; padding: .6rem .5rem; white-space: nowrap; }
  th button { border: 0; background: transparent; color: inherit; font: inherit; cursor: pointer; padding: .25rem .1rem; white-space: nowrap; }
  th button:hover, th button.active { color: #f69b70; } th button.active { font-weight: 700; }
  th.fit, td.fit { text-align: center; padding-inline: .2rem; } th.price, td.price { text-align: right; padding-right: .8rem; }
  td { padding: .35rem .5rem; border-top: 1px solid var(--color-rule); white-space: nowrap; }
  tbody tr:hover { background: color-mix(in srgb, var(--color-accent) 4%, var(--color-surface)); } tr.selected { background: color-mix(in srgb, var(--color-accent) 7%, var(--color-surface)); }
  .check { width: 2.25rem; padding-left: .8rem; } .check input { width: 1rem; height: 1rem; accent-color: var(--color-accent); }
  td.product { white-space: normal; min-width: 15rem; }
  .identity { display: flex; align-items: center; gap: .65rem; }
  .identity img, .nophoto { flex: none; width: 52px; height: 40px; object-fit: contain; background: #fff; border: 1px solid var(--color-rule); }
  .identity a { display: block; color: var(--color-ink); font-weight: 600; text-decoration: none; } .identity a:hover { color: var(--color-accent); }
  .brand { color: var(--color-accent); font-size: .75rem; font-weight: 600; } .versions { color: var(--color-muted); font-weight: 400; }
  td.unknown { color: var(--color-muted); }
  td.price { font-weight: 700; font-variant-numeric: tabular-nums; }
  .heat { display: inline-grid; place-items: center; min-width: 2.1rem; height: 1.6rem; font-weight: 700; font-variant-numeric: tabular-nums; }
  .h0, .h1 { background: #f3f1ea; color: #586875; } .h2 { background: #ebe7dc; color: #586875; } .h3 { background: #f2e2d7; color: #8f2f15; } .h4 { background: #e9a98b; color: #4d1a0b; } .h5 { background: #bf421f; color: #fff; }
  .ring { box-shadow: 0 0 0 2px var(--color-navy); }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  :is(a, button, input):focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
</style>
