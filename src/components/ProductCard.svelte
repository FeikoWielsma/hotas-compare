<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import BrandMark from './BrandMark.svelte';
  import Explain from './Explain.svelte';
  import type { CatalogItem } from '../lib/catalog';
  import type { UseCase } from '../lib/schema';
  import { itemCategoryLabel, detailHref, formatAmount, overallScore, productImageSrc, resolveItemRegion } from '../lib/catalog-ui';
  import { bestFits, cardFacts, flyingStyles, gimbalRank } from '../lib/catalog-columns';
  import { matchScore } from '../lib/catalog-filter';
  import { statusLabels } from '../lib/labels';
  import { vatLabel } from '../lib/derive';
  import { glossary, gimbalGlossaryKey, gimbalLabels } from '../lib/glossary';
  import { regionStore } from '../lib/stores/region.svelte';
  import { compareStore, MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  /** `styles` are the visitor's flying styles; without them the card shows the item's two strongest. `picker` renders under the name (family and hand variants). */
  let { item, styles = [], picker }: { item: CatalogItem; styles?: UseCase[]; picker?: Snippet } = $props();
  const review = $derived(item.latestReview);
  const tagLabels: Record<string, string> = { recommended: 'Recommended', mixed: 'Mixed', avoid: 'Avoid', neutral: 'Not yet rated' };
  const active = $derived(resolveItemRegion(item, regionStore.region));
  const selected = $derived(compareStore.hasItem(item.id));
  const full = $derived(!selected && compareStore.items.length >= MAX_COMPARE_ITEMS);
  const photo = $derived(productImageSrc(item.images[0]?.file));
  const score = $derived(overallScore(item));
  const facts = $derived(cardFacts(item));
  const shown = $derived(styles.length ? styles : bestFits(item));
  const meters = $derived(shown.map((key) => {
    const style = flyingStyles.find((s) => s.key === key)!;
    const value = item.use_case_fit[key];
    return { key, label: style.short, title: `${style.label} fit: ${Number(value.toFixed(1))}/5`, value: Number(value.toFixed(1)), filled: Math.round(value) };
  }));
  const match = $derived(styles.length > 1 ? matchScore(item, styles) : null);
  const rank = $derived(item.gimbalType ? gimbalRank[item.gimbalType] ?? 0 : 0);
  const caveats = $derived(item.placement === 'mount_only' || item.needsPedals);
  onMount(() => { regionStore.init(); compareStore.init(); });
</script>

<article class:selected>
  <div class="photo">
    <a href={detailHref(item)} aria-label={`View ${item.name}`} tabindex="-1">{#if photo}<img src={photo} alt={item.name} loading="lazy" />{:else}<span class="nophoto">No photo available</span>{/if}</a>
    <div class="flags">
      {#if item.status !== 'current'}<span class={`status ${item.status}`}>{statusLabels[item.status]}</span>{/if}
      {#if match != null}<span class="match" class:high={match >= 4.5} class:good={match >= 3.5 && match < 4.5} title="Average fit across your flying styles">{Number(match.toFixed(1))} match</span>{/if}
    </div>
    <span class="compare" title={full ? 'Comparison is full. Remove an item to add another (maximum 4).' : undefined}><button type="button" aria-label={`${selected ? 'Remove' : 'Add'} ${item.name} ${selected ? 'from' : 'to'} comparison`} aria-pressed={selected} disabled={full} onclick={() => selected ? compareStore.removeItem(item.id) : compareStore.addItem(item.id)}><span class="box" aria-hidden="true">{selected ? '✓' : ''}</span>Compare</button></span>
    {#if item.gimbalType}<span class={`gimbal ${item.gimbalType}`} title={glossary[gimbalGlossaryKey[item.gimbalType]].text}><strong>{gimbalLabels[item.gimbalType]}</strong>{#if rank}<span class="ladder" aria-label={`Gimbal level ${rank} of 4`}>{#each [1, 2, 3, 4] as step}<i class:on={step <= rank}></i>{/each}</span>{/if}</span>{/if}
  </div>
  <div class="body">
    <p class="brand"><BrandMark brand={item.brand} name={item.brandName} size={18} /><span>{item.brandName}</span><span class="category">{itemCategoryLabel(item)}</span></p>
    <h3><a href={detailHref(item)}>{item.name}</a></h3>
    {@render picker?.()}
    {#if facts}<p class="facts">{facts}</p>{/if}
    {#if review || score != null || caveats}<div class="signals">
      {#if review}<a class={`review ${review.tag}`} href={review.url} rel="external noopener" title={review.summary}>{review.reviewerName}: {tagLabels[review.tag]}</a>{/if}
      {#if score != null}<span title="Our verdict score">Verdict {Number(score.toFixed(1))}/5</span>{/if}
      {#if item.placement === 'mount_only'}<span class="caveat">Mount required<Explain term="mount_only" /></span>{/if}
      {#if item.needsPedals}<span class="caveat">Add pedals<Explain term="pedals" /></span>{/if}
    </div>{/if}
    <div class="fits">
      {#if !styles.length}<span class="best">Best for</span>{/if}
      {#each meters as meter (meter.key)}<div class="meter" title={meter.title}><span>{meter.label}</span><span class="segments" aria-hidden="true">{#each [1, 2, 3, 4, 5] as step}<i class:on={step <= meter.filled} class:strong={meter.value >= 4}></i>{/each}</span><b>{meter.value}/5</b></div>{/each}
    </div>
    <div class="purchase">
      <span class="price" title={active.resolvedPrice.price ? vatLabel(active.resolvedPrice.price) : undefined}><strong class:none={!active.resolvedPrice.price}>{active.resolvedPrice.price ? formatAmount(active) : `No ${regionStore.region} price`}</strong>{#if active.resolvedPrice.isStale}<span class="stale" title={`Last checked ${active.resolvedPrice.price?.verified}`}>Old price</span>{/if}</span>
      <a href={detailHref(item)} aria-label={`View details for ${item.name}`}>Details →</a>
    </div>
  </div>
</article>

<style>
  article { display: flex; flex-direction: column; min-width: 0; color: var(--color-ink); font-family: var(--font-sans); background: var(--color-surface); border: 1px solid var(--color-rule); border-radius: 2px; transition: border-color .2s, box-shadow .2s; }
  article:hover { border-color: color-mix(in srgb, var(--color-accent) 50%, var(--color-rule)); box-shadow: 0 6px 18px #172e4212; }
  article.selected { border-color: var(--color-accent); box-shadow: inset 0 3px var(--color-accent); }
  .photo { position: relative; aspect-ratio: 4 / 3; background: #fff; border-bottom: 1px solid var(--color-rule); overflow: hidden; }
  .photo > a { display: grid; place-items: center; width: 100%; height: 100%; text-decoration: none; }
  .photo img { width: 100%; height: 100%; object-fit: contain; padding: .65rem; transition: transform .3s; } article:hover .photo img { transform: scale(1.03); }
  .nophoto { color: #586875; font-size: .8125rem; padding: 1rem; }
  .flags { position: absolute; top: .5rem; left: .5rem; display: flex; flex-direction: column; align-items: flex-start; gap: .25rem; pointer-events: none; }
  .flags span { font-size: .7rem; font-weight: 700; padding: .15rem .45rem; color: #fff; background: #586875; }
  .status { background: #192f43 !important; } .status.discontinued { background: #7a2a22 !important; }
  .match.good { background: #b4532f; } .match.high { background: #bf421f; }
  .compare { position: absolute; top: .4rem; right: .4rem; }
  .compare button { display: inline-flex; align-items: center; gap: .35rem; min-height: 32px; padding: .2rem .5rem; border: 1px solid var(--color-rule); border-radius: 2px; background: #fffdf7e6; color: #172e42; font: 600 .7rem/1 var(--font-sans); cursor: pointer; }
  .compare button:hover { border-color: var(--color-accent); } .compare button:disabled { opacity: .55; cursor: not-allowed; }
  .box { display: inline-grid; place-items: center; width: .85rem; height: .85rem; border: 1.5px solid #586875; border-radius: 2px; font-size: .6rem; color: #fff; }
  .selected .compare button { border-color: #bf421f; } .selected .box { background: #bf421f; border-color: #bf421f; }
  .gimbal { position: absolute; left: .5rem; bottom: .5rem; display: inline-flex; align-items: center; gap: .45rem; padding: .2rem .45rem; background: #fffdf7; border: 1px solid #d6d8d2; font-size: .72rem; color: #586875; }
  .gimbal strong { color: inherit; }
  .gimbal.pincer { color: #172e42; } .gimbal.cam_and_spring { color: #bf421f; } .gimbal.force_feedback { color: #192f43; }
  .ladder { display: inline-flex; gap: 2px; } .ladder i { width: 9px; height: 4px; background: #d6d8d2; } .ladder i.on { background: currentColor; }
  .body { display: flex; flex-direction: column; gap: .4rem; flex: 1; padding: .7rem .8rem .8rem; }
  .brand { display: flex; align-items: center; gap: .4rem; margin: 0; color: var(--color-accent); font-size: .75rem; font-weight: 600; min-width: 0; }
  .category { margin-left: auto; color: var(--color-muted); font-weight: 500; white-space: nowrap; }
  h3 { font: 600 .95rem/1.3 var(--font-sans); margin: 0; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; } h3 a { color: inherit; text-decoration: none; } h3 a:hover { color: var(--color-accent); }
  .facts { margin: 0; color: var(--color-muted); font-size: .75rem; line-height: 1.45; }
  .signals { display: flex; flex-wrap: wrap; gap: .3rem; font-size: .68rem; font-weight: 600; }
  .signals > * { display: inline-flex; align-items: center; padding: .1rem .4rem; border: 1px solid var(--color-rule); border-radius: 2px; color: var(--color-muted); text-decoration: none; }
  .review.recommended { color: #1d6b3a; border-color: #1d6b3a55; } .review.avoid { color: #9b2c1f; border-color: #9b2c1f55; } .review.mixed { color: #8a5a00; border-color: #8a5a0055; } a.review:hover { text-decoration: underline; }
  .caveat { color: #8a5a00 !important; border-color: #8a5a0055 !important; }
  .fits { display: flex; flex-direction: column; gap: .25rem; margin-top: .1rem; }
  .best { font-size: .62rem; letter-spacing: .06em; text-transform: uppercase; color: var(--color-muted); }
  .meter { display: grid; grid-template-columns: 4.2rem minmax(0, 1fr) 2.2rem; align-items: center; gap: .5rem; font-size: .7rem; color: var(--color-muted); }
  .meter b { color: var(--color-ink); text-align: right; font-variant-numeric: tabular-nums; }
  .segments { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 2px; } .segments i { height: 6px; background: var(--color-photo); } .segments i.on { background: #7d8a93; } .segments i.on.strong { background: var(--color-accent); }
  .purchase { margin-top: auto; padding-top: .5rem; display: flex; align-items: baseline; justify-content: space-between; gap: .5rem; flex-wrap: wrap; }
  .price { display: inline-flex; align-items: baseline; gap: .4rem; } .price strong { font-size: 1.1rem; font-variant-numeric: tabular-nums; } .price strong.none { font-size: .8rem; font-weight: 500; color: var(--color-muted); }
  .stale { color: var(--color-danger); font-size: .7rem; }
  .purchase a { color: var(--color-accent); font-size: .8125rem; font-weight: 600; text-decoration: none; padding-block: .35rem; } .purchase a:hover { text-decoration: underline; }
  :is(a, button):focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { article, .photo img { transition: none; } article:hover .photo img { transform: none; } }
</style>
