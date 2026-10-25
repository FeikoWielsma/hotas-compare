<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import BrandMark from './BrandMark.svelte';
  import { controlTypes, inventoryComplete } from '../lib/control-inventory';
  import type { CatalogItem } from '../lib/catalog';
  import { platforms } from '../lib/platforms';
  import { categoryLabels, detailHref, formatAmount, overallScore, productImageSrc, resolveItemRegion } from '../lib/catalog-ui';
  import { humanize, statusLabels } from '../lib/labels';
  import { vatLabel } from '../lib/derive';
  import Explain from './Explain.svelte';
  import { gimbalGlossaryKey, gimbalLabels } from '../lib/glossary';
  import { rankReasons } from '../lib/catalog-filter';
  import { regionStore } from '../lib/stores/region.svelte';
  import { compareStore, MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  /** `picker` renders under the name; CatalogCard uses it to switch between family and hand variants. */
  let { item, compact = false, row = false, rankInfo = false, picker }: { item: CatalogItem; compact?: boolean; row?: boolean; rankInfo?: boolean; picker?: Snippet } = $props();
  const review = $derived(item.latestReview);
  const tagLabels: Record<string, string> = { recommended: 'Recommended', mixed: 'Mixed', avoid: 'Avoid', neutral: 'Not yet rated' };
  const active = $derived(resolveItemRegion(item, regionStore.region));
  const selected = $derived(compareStore.hasItem(item.id));
  const full = $derived(!selected && compareStore.items.length >= MAX_COMPARE_ITEMS);
  const photo = $derived(productImageSrc(item.images[0]?.file));
  const complete = $derived(inventoryComplete(item.controlSections ?? []));
  const score = $derived(overallScore(item));
  const short: Partial<Record<string, string>> = { hat: 'Hats', analog_ministick: 'Ministicks', button: 'Buttons', trigger: 'Triggers', lever: 'Levers', slider: 'Sliders', encoder: 'Encoders', scroll_wheel: 'Wheels', rotary: 'Rotaries', toggle: 'Toggles', rocker: 'Rockers', switch: 'Switches' };
  const priority = ['Hats', 'Ministicks', 'Encoders', 'Toggles', 'Levers', 'Triggers', 'Rotaries', 'Sliders', 'Wheels', 'Rockers', 'Switches', 'Buttons'];
  /** Documented headline numbers first, then the most distinctive control families. Unknowns are left out. */
  const highlights = $derived.by(() => {
    const out: { label: string; value: string; title?: string }[] = [];
    const plus = complete ? '' : '+';
    if (item.totalAxes > 0 || item.axisCountKnown) out.push({ label: 'Axes', value: String(item.totalAxes) });
    if (item.category === 'pedals') {
      if (item.toeBrakeAxes != null) out.push({ label: 'Toe brakes', value: String(item.toeBrakeAxes), title: item.toeBrakeAxes > 0 ? 'Independent left and right toe-brake axes' : 'Rudder axis only (no physical toe brakes)' });
      if (item.throwDeg != null) out.push({ label: 'Throw', value: `${item.throwDeg}°`, title: 'Documented rudder travel' });
      return out;
    }
    if (item.totalLogicalButtons > 0) out.push({ label: 'Inputs', value: `${item.totalLogicalButtons}${plus}`, title: 'Estimated button inputs, including hat directions and switch positions' });
    const counts = controlTypes.filter((t) => short[t.type]).map((t) => ({
      label: short[t.type]!,
      n: (item.controlSections ?? []).reduce((sum, s) => sum + s.controls.filter((c) => c.type === t.type).reduce((m, c) => m + (c.count ?? 1), 0), 0),
    })).filter((c) => c.n > 0).sort((a, b) => priority.indexOf(a.label) - priority.indexOf(b.label));
    for (const c of counts) if (out.length < 4) out.push({ label: c.label, value: `${c.n}${plus}` });
    return out;
  });
  const supported = $derived(platforms.filter(({ key }) => item.platform_compatibility?.[key] === 'supported').map(({ label }) => label));
  const sensor = $derived(item.sensor && !/^none/i.test(item.sensor) ? humanize(item.sensor.split(', ')[0]) : null);
  const hand = $derived(item.handedness.map((h) => h === 'ambi' ? 'Ambidextrous' : `${h === 'right' ? 'Right' : 'Left'} hand`).join(' / '));
  const meta = $derived([hand, sensor && sensor.length <= 30 ? sensor : '', supported.join(' · ')].filter(Boolean));
  const hasPedalBadges = $derived(item.category === 'pedals' || Boolean(item.pedalBrakes) || Boolean(item.damper && item.damper !== 'none'));
  onMount(() => { regionStore.init(); compareStore.init(); });
</script>

<article class:selected class:compact class:row>
  <a class="photo" href={detailHref(item)} aria-label={`View ${item.name}`}>
    {#if photo}<img src={photo} alt={item.name} loading="lazy" />{:else}<span class="nophoto">No photo available</span>{/if}
    {#if item.status !== 'current'}<span class={`status ${item.status}`}>{statusLabels[item.status]}</span>{/if}
    {#if score != null}<span class="score" title="Verdict score"><b>{Number(score.toFixed(1))}</b>/5</span>{/if}
  </a>
  <div class="identity">
    <p class="brand"><BrandMark brand={item.brand} name={item.brandName} size={20} /><span>{item.brandName}</span><span class="category">{categoryLabels[item.category]}</span></p>
    <h3><a href={detailHref(item)}>{item.name}</a></h3>
    {@render picker?.()}
    <p class="meta">{meta.join(' · ')}</p>
    {#if review || item.gimbalType || item.needsPedals || item.usesPotentiometers || hasPedalBadges || item.placement === 'mount_only'}<div class="badges">
      {#if review}<a class={`review ${review.tag}`} href={review.url} rel="external noopener" title={review.summary}>{review.reviewerName}: {tagLabels[review.tag]}</a>{/if}
      {#if item.usesPotentiometers}<span class="potentiometer">Potentiometer<Explain title="Potentiometer axes" label={`Why ${item.name} uses potentiometers`} text="Potentiometers use physical contacts that can wear, causing jitter or drift over time. Hall and other contactless sensors avoid that contact and are generally preferred for long-term consistency." /></span>{/if}
      {#if item.gimbalType}<span class={`gimbal ${item.gimbalType}`}>{gimbalLabels[item.gimbalType]}<Explain term={gimbalGlossaryKey[item.gimbalType]} /></span>{/if}
      {#if item.placement === 'mount_only'}<span class="mount-only">Mount required<Explain term="mount_only" /></span>{/if}
      {#if item.needsPedals}<span class="pedals">No twist · add pedals<Explain term="pedals" /></span>{/if}
      {#if item.pedalBrakes}<span class={`brakes ${item.pedalBrakes}`}>{item.pedalBrakes === 'toe_brakes' ? 'Toe brakes' : item.pedalBrakes === 'rudder_only' ? 'Rudder only' : 'Brakes: unknown'}</span>{/if}
      {#if item.damper === 'built_in'}<span class="damper built_in">Damper: built-in</span>{:else if item.damper === 'optional'}{#if item.damperAddon?.href}<a class="damper optional" href={item.damperAddon.href} title={`Optional add-on: ${item.damperAddon.name}`}>Damper: optional</a>{:else}<span class="damper optional" title={item.damperAddon ? `Optional add-on: ${item.damperAddon.name}` : undefined}>Damper: optional</span>{/if}{:else if item.category === 'pedals' && !item.damper}<span class="damper unknown">Damper: unknown</span>{/if}
      {#if rankInfo && rankReasons(item).length}<span class="why">Why here<Explain title="Why it's ranked here" text={rankReasons(item)} label={`Why ${item.name} is ranked here`} /></span>{/if}
    </div>{/if}
  </div>
  <div class="specifications">
    {#if highlights.length}<dl>{#each highlights as h}<div title={h.title}><dt>{h.label}</dt><dd>{h.value}</dd></div>{/each}</dl>{:else}<p class="undocumented">Controls not yet documented</p>{/if}
  </div>
  <div class="purchase">
    <div class="price"><strong class:none={!active.resolvedPrice.price}>{active.resolvedPrice.price ? formatAmount(active) : `No ${regionStore.region} price listed`}</strong>{#if active.resolvedPrice.price}<span>{vatLabel(active.resolvedPrice.price)}</span>{/if}</div>
    {#if active.resolvedPrice.isStale}<p class="stale" title={`Last checked ${active.resolvedPrice.price?.verified}`}>Price over 90 days old</p>{/if}
    <div class="actions"><a href={detailHref(item)} aria-label={`View details for ${item.name}`}>Details →</a><span title={full ? 'Comparison is full. Remove an item to add another (maximum 4).' : undefined}><button type="button" aria-label={`${selected ? 'Remove' : 'Add'} ${item.name} ${selected ? 'from' : 'to'} comparison`} aria-pressed={selected} disabled={full} onclick={() => selected ? compareStore.removeItem(item.id) : compareStore.addItem(item.id)}>{selected ? '✓ Comparing' : '+ Compare'}</button></span></div>
  </div>
</article>

<style>
  article { display: flex; flex-direction: column; min-width: 0; padding: 1.1rem; color: var(--color-ink); font-family: var(--font-sans); background: var(--color-surface); border: 1px solid var(--color-rule); border-radius: 2px; transition: border-color .2s, box-shadow .2s; }
  article:hover { border-color: color-mix(in srgb, var(--color-accent) 60%, var(--color-rule)); box-shadow: 0 6px 18px #172e4212; }
  article.selected { border-color: var(--color-accent); box-shadow: inset 0 3px var(--color-accent); }
  .photo { position: relative; display: grid; place-items: center; aspect-ratio: 4 / 3; margin: -1.1rem -1.1rem 1rem; background: #fff; border-bottom: 1px solid var(--color-rule); overflow: hidden; text-decoration: none; }
  .photo img { width: 100%; height: 100%; object-fit: contain; padding: .75rem; transition: transform .3s; } article:hover .photo img { transform: scale(1.03); }
  .nophoto { color: #586875; font-size: .8125rem; padding: 1rem; }
  .status, .score { position: absolute; top: .6rem; font-size: .7rem; font-weight: 700; padding: .2rem .5rem; letter-spacing: .02em; }
  .status { left: .6rem; background: var(--color-navy); color: var(--color-on-navy); } .status.discontinued { background: #7a2a22; }
  .score { right: .6rem; background: #bf421f; color: #fff; font-weight: 500; } .score b { font-size: .85rem; }
  .brand { display: flex; align-items: center; gap: .45rem; margin: 0 0 .4rem; color: var(--color-accent); font-size: .8125rem; font-weight: 600; min-width: 0; }
  .category { margin-left: auto; color: var(--color-muted); font-weight: 500; font-size: .75rem; white-space: nowrap; }
  h3 { font: 600 1.075rem/1.35 var(--font-sans); letter-spacing: -.01em; margin: 0; overflow-wrap: anywhere; text-wrap: balance; } h3 a { color: inherit; text-decoration: none; } h3 a:hover { color: var(--color-accent); }
  .meta { color: var(--color-muted); font-size: .8rem; line-height: 1.5; margin: .4rem 0 .9rem; min-height: 1.2em; }
  .badges { display: flex; flex-wrap: wrap; gap: .35rem; margin: -.4rem 0 .9rem; font-size: .72rem; font-weight: 600; }
  .badges > * { display: inline-flex; align-items: center; padding: .15rem .45rem; border: 1px solid var(--color-rule); border-radius: 2px; color: var(--color-muted); text-decoration: none; }
  .review.recommended { color: #1d6b3a; border-color: #1d6b3a55; background: #1d6b3a0d; } .review.avoid { color: #9b2c1f; border-color: #9b2c1f55; background: #9b2c1f0d; } .review.mixed { color: #8a5a00; border-color: #8a5a0055; }
  .potentiometer { color: #8a5a00 !important; border-color: #8a5a0055 !important; background: #8a5a000d; }
  a.review:hover { text-decoration: underline; }
  .gimbal.ball_and_cup { color: #8a5a00; } .gimbal.pincer, .gimbal.cam_and_spring, .gimbal.force_feedback { color: var(--color-ink); }
  .brakes.toe_brakes, .damper.built_in { color: var(--color-ink); }
  .brakes.unknown, .damper.unknown { border-style: dashed; }
  a.damper:hover { color: var(--color-accent); border-color: var(--color-accent); text-decoration: underline; }
  .mount-only { color: #8a5a00; border-color: #8a5a0055; background: #8a5a000d; }
  .pedals { border-style: dashed; } .why { border: 0; padding-left: 0; }
  dl { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 0; overflow: hidden; border: 1px solid var(--color-rule); }
  dl > div { padding: .5rem .5rem .45rem; min-width: 0; margin: 0 -1px -1px 0; border-right: 1px solid var(--color-rule); border-bottom: 1px solid var(--color-rule); }
  dt { color: var(--color-muted); font-size: .7rem; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  dd { font: 600 1.05rem/1.3 var(--font-sans); font-variant-numeric: tabular-nums; margin: .1rem 0 0; }
  .undocumented { margin: 0; padding: .7rem .6rem; border: 1px dashed var(--color-rule); color: var(--color-muted); font-size: .8rem; }
  .purchase { margin-top: auto; padding-top: 1rem; }
  .price { display: flex; flex-wrap: wrap; align-items: baseline; gap: .5rem; } .price strong { font-size: 1.2rem; font-variant-numeric: tabular-nums; } .price strong.none { font-size: .875rem; font-weight: 500; color: var(--color-muted); } .price span { color: var(--color-muted); font-size: .75rem; }
  .stale { color: var(--color-danger); margin: .3rem 0 0; font-size: .75rem; }
  .actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem; border-top: 1px solid var(--color-rule); margin-top: .85rem; padding-top: .85rem; font-size: .875rem; }
  .actions a { text-decoration: none; color: var(--color-ink); font-weight: 500; padding-block: .5rem; } .actions a:hover { color: var(--color-accent); }
  button { border: 1px solid var(--color-rule); border-radius: 2px; padding: .55rem .8rem; background: transparent; color: var(--color-accent); font: 600 .8125rem var(--font-sans); cursor: pointer; min-height: 44px; }
  button:hover { border-color: var(--color-accent); } .selected button { border-color: var(--color-accent); background: var(--color-accent); color: var(--color-surface); } button:disabled { opacity: .55; cursor: not-allowed; }
  .compact { padding: .9rem; } .compact .photo { aspect-ratio: 16 / 10; margin: -.9rem -.9rem .8rem; } .compact h3 { font-size: .975rem; } .compact .meta { margin-bottom: .7rem; } .compact dd { font-size: .95rem; } .compact .actions { margin-top: .65rem; padding-top: .65rem; }
  .row { display: grid; grid-template-columns: 120px minmax(0, 1.2fr) minmax(0, 1fr) 190px; gap: 1.25rem; align-items: center; padding: 1rem; }
  .row .photo { margin: 0; border: 1px solid var(--color-rule); aspect-ratio: 1; } .row .photo img { padding: .4rem; }
  .row .status, .row .score { top: .3rem; font-size: .6rem; padding: .15rem .35rem; } .row .status { left: .3rem; } .row .score { right: .3rem; }
  .row .meta { margin-bottom: 0; } .row .purchase { padding-top: 0; } .row .actions { margin-top: .6rem; padding-top: .6rem; }
  :is(a, button):focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
  @media (max-width: 1200px) { .row { grid-template-columns: 110px minmax(0, 1fr) 190px; } .row .specifications { grid-column: 2; } .row .photo { grid-row: 1 / 3; } .row .purchase { grid-column: 3; grid-row: 1 / 3; } }
  @media (max-width: 600px) { .row { grid-template-columns: 85px minmax(0, 1fr); gap: 1rem; } .row .photo { grid-row: 1; } .row .specifications { grid-column: 1 / -1; } .row .purchase { grid-column: 1 / -1; grid-row: auto; } }
  @media (prefers-reduced-motion: reduce) { article, .photo img { transition: none; } article:hover .photo img { transform: none; } }
</style>
