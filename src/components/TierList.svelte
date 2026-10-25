<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fitGroupIds, fitGroupLabels, toFitScore, type FitGroup } from '../lib/fit-groups';
  import { TIERS, parseTierList, serializeTierList, tierLabels, tierListText, type Tier, type TierItem } from '../lib/fit-tiers';
  import { useCases } from '../lib/catalog-ui';
  import type { UseCase } from '../lib/schema';

  let { items }: { items: TierItem[] } = $props();

  const NAME_KEY = 'hotas-tier-name';
  const ids = items.map((item) => item.id);
  const caseLabel = (u: UseCase) => useCases.find((c) => c.key === u)!.label;
  const groupsWithItems = fitGroupIds.filter((g) => items.filter((i) => i.group === g).length >= 2);

  let useCase = $state<UseCase>('airliner');
  let group = $state<FitGroup>('sticks');
  let tiers = $state(new Map<string, Tier>());
  let by = $state('');
  let sharedBy = $state<string | null>(null);
  let selected = $state<string | null>(null);
  let dragging = $state<string | null>(null);
  let showSite = $state(false);
  let filter = $state('');
  let status = $state('');
  let fallback = $state('');
  let ready = false;

  const groupItems = $derived(items.filter((item) => item.group === group).toSorted((a, b) => `${a.brandName} ${a.name}`.localeCompare(`${b.brandName} ${b.name}`)));
  const inTier = (tier: Tier | null) => groupItems.filter((item) => (tiers.get(item.id) ?? null) === tier);
  const unranked = $derived(inTier(null).filter((item) => !filter || `${item.brandName} ${item.name}`.toLowerCase().includes(filter.toLowerCase())));
  const rankedCount = $derived(groupItems.filter((item) => tiers.has(item.id)).length);
  const title = $derived(`${fitGroupLabels[group].plural} for ${caseLabel(useCase)}`);

  /** Site scores (or the spec baseline for unreviewed parts) as a starting point; half points round to a tier. */
  function fromSite() {
    tiers = new Map(groupItems.filter((item) => item.scored).map((item) => [item.id, toFitScore(item.fit[useCase]) as Tier]));
  }
  function choose(nextCase: UseCase, nextGroup: FitGroup) {
    useCase = nextCase; group = nextGroup; sharedBy = null; selected = null; filter = ''; status = '';
    fromSite();
  }
  function move(id: string, tier: Tier | null) {
    const next = new Map(tiers);
    if (tier) next.set(id, tier); else next.delete(id);
    tiers = next; status = ''; sharedBy = null;
  }
  async function place(tier: Tier | null) {
    if (!selected) return;
    const id = selected;
    // Keep the keyboard flow going: move on to the next unranked part.
    const queue = unranked.filter((item) => item.id !== id);
    move(id, tier);
    selected = tier && queue.length ? queue[0].id : null;
    await tick();
    if (selected) document.querySelector<HTMLButtonElement>(`[data-id="${CSS.escape(selected)}"]`)?.focus();
  }
  function onKey(event: KeyboardEvent) {
    if (!selected || (event.target instanceof Element && event.target.matches('input, select, textarea'))) return;
    if (/^[1-5]$/.test(event.key)) { event.preventDefault(); place(Number(event.key) as Tier); }
    else if (event.key === '0' || event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); place(null); }
    else if (event.key === 'Escape') selected = null;
  }
  function drop(event: DragEvent, tier: Tier | null) {
    event.preventDefault();
    const id = event.dataTransfer?.getData('text/plain') || dragging;
    if (id) move(id, tier);
    dragging = null;
  }

  function shareUrl() {
    // An unedited shared list is passed on as-is, keeping its author.
    if (sharedBy) return location.href;
    const url = new URL('/tiers', location.origin);
    url.search = serializeTierList({ useCase, group, by, tiers }).toString();
    return url.href;
  }
  async function copy(text: string, done: string) {
    try { await navigator.clipboard.writeText(text); status = done; fallback = ''; }
    catch { status = 'Copy the text below.'; fallback = text; }
  }
  const names = $derived(new Map(groupItems.map((item) => [item.id, `${item.brandName} ${item.name}`])));
  const shareText = () => `${tierListText({ useCase, group, tiers }, names, `${title}${by ? ` — by ${by}` : ''}`)}\n${shareUrl()}`;

  function submitOnGitHub() {
    const query = new URLSearchParams({ title: `Tier list: ${title}`, body: `${shareText()}\n\nNotes:\n` });
    window.open(`https://github.com/FeikoWielsma/hotas-compare/issues/new?${query}`, '_blank', 'noopener');
  }

  onMount(() => {
    by = localStorage.getItem(NAME_KEY) ?? '';
    const restore = () => {
      const shared = parseTierList(location.search, ids);
      if (shared && groupsWithItems.includes(shared.group)) {
        useCase = shared.useCase; group = shared.group; selected = null;
        if (new URLSearchParams(location.search).has('r')) { tiers = shared.tiers; sharedBy = shared.by ?? 'someone'; }
        else { sharedBy = null; fromSite(); }
      } else fromSite();
    };
    restore(); ready = true;
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  });
  $effect(() => {
    if (!ready) return;
    // While viewing someone's list, keep their link intact until it is edited.
    if (sharedBy) return;
    history.replaceState(history.state, '', `${location.pathname}?${serializeTierList({ useCase, group, by, tiers })}`);
  });
  $effect(() => { if (ready) localStorage.setItem(NAME_KEY, by); });
</script>

<svelte:window onkeydown={onKey} />

<div class="tiers">
  <div class="setup">
    <label>Flying style
      <select value={useCase} onchange={(e) => choose(e.currentTarget.value as UseCase, group)}>
        {#each useCases as u (u.key)}<option value={u.key}>{u.label}</option>{/each}
      </select>
    </label>
    <div class="groups" role="group" aria-label="Hardware group">
      {#each groupsWithItems as g (g)}
        <button type="button" class:active={g === group} aria-pressed={g === group} onclick={() => choose(useCase, g)}>{fitGroupLabels[g].plural}</button>
      {/each}
    </div>
  </div>

  {#if sharedBy}
    <p class="banner">You're looking at <b>{sharedBy}</b>'s list. Move anything to turn it into your own.</p>
  {/if}

  <div class="toolbar">
    <h2>{title}</h2>
    <span class="count">{rankedCount} of {groupItems.length} ranked</span>
    <label class="check"><input type="checkbox" bind:checked={showSite} /> Show starting scores</label>
    <button type="button" class="link" onclick={() => { fromSite(); sharedBy = null; }}>Reset to starting scores</button>
    <button type="button" class="link" onclick={() => { tiers = new Map(); sharedBy = null; }}>Start blank</button>
  </div>

  <p class="hint">Click a part, then click a tier, or press <kbd>5</kbd>–<kbd>1</kbd> (<kbd>0</kbd> to unrank). You can also drag. Leave parts you don't know unranked.</p>

  <div class="board">
    {#each TIERS as tier (tier)}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="row t{tier}" class:target={!!selected} role="listitem" ondragover={(e) => e.preventDefault()} ondrop={(e) => drop(e, tier)} onclick={(e) => { if (e.target === e.currentTarget) place(tier); }}>
        <button type="button" class="label" onclick={() => place(tier)} disabled={!selected} aria-label={`Move to ${tier} ${tierLabels[tier]}`}><b>{tier}</b><span>{tierLabels[tier]}</span></button>
        <div class="tiles">
          {#each inTier(tier) as item (item.id)}{@render tile(item)}{/each}
        </div>
      </div>
    {/each}
  </div>

  <section class="pool" ondragover={(e) => e.preventDefault()} ondrop={(e) => drop(e, null)} aria-label="Not ranked">
    <div class="pool-head">
      <h3>Not ranked <span class="count">{inTier(null).length}</span></h3>
      <input type="search" placeholder="Filter by name" bind:value={filter} aria-label="Filter unranked parts" />
      {#if selected && tiers.has(selected)}<button type="button" class="link" onclick={() => place(null)}>Unrank selected</button>{/if}
    </div>
    <div class="tiles">
      {#each unranked as item (item.id)}{@render tile(item)}{/each}
      {#if !unranked.length}<p class="empty">{inTier(null).length ? 'No matches.' : 'Everything is ranked.'}</p>{/if}
    </div>
  </section>

  <section class="share">
    <label>Your name or handle (optional)<input type="text" maxlength="40" bind:value={by} placeholder="e.g. Reddit or Discord name" /></label>
    <div class="share-buttons">
      <button type="button" class="primary" onclick={() => copy(shareUrl(), 'Link copied. Post it wherever you discuss sims, or send it to us.')}>Copy share link</button>
      <button type="button" onclick={() => copy(shareText(), 'List copied as text, with the link.')}>Copy as text</button>
      <button type="button" onclick={submitOnGitHub}>Submit on GitHub</button>
    </div>
    <p class="status" role="status">{status}</p>
    {#if fallback}<textarea readonly rows="4">{fallback}</textarea>{/if}
  </section>
</div>

{#snippet tile(item: TierItem)}
  <button type="button" class="tile" class:selected={selected === item.id} class:dragging={dragging === item.id} data-id={item.id}
    draggable="true" title={`${item.brandName} ${item.name}`}
    ondragstart={(e) => { dragging = item.id; e.dataTransfer?.setData('text/plain', item.id); }} ondragend={() => (dragging = null)}
    onclick={() => (selected = selected === item.id ? null : item.id)} aria-pressed={selected === item.id}>
    <span class="img">{#if item.image}<img src={item.image} alt="" loading="lazy" />{/if}</span>
    <span class="brand">{item.brandName}</span>
    <span class="name">{item.name}</span>
    {#if showSite}<span class="site">{item.scored ? `${item.estimated ? 'estimate' : 'site'} ${item.fit[useCase]}` : 'unscored'}</span>{/if}
  </button>
{/snippet}

<style>
  .tiers { display: grid; gap: 1.25rem; margin: 1.5rem 0 3rem; }
  label { display: grid; gap: .4rem; font-size: .875rem; color: var(--color-muted); }
  select, input[type=text], input[type=search], textarea { border: 1px solid var(--color-rule); border-radius: 2px; padding: .65rem .75rem; background: var(--color-surface); color: var(--color-ink); font: .875rem/1.4 var(--font-sans); min-width: 0; }
  button { cursor: pointer; font: .875rem/1.4 var(--font-sans); color: var(--color-ink); border: 1px solid var(--color-rule); border-radius: 2px; background: var(--color-surface); padding: .6rem .8rem; text-decoration: none; }
  button:hover:not(:disabled) { border-color: var(--color-accent); }
  button.active { color: var(--color-accent); border-color: var(--color-accent); font-weight: 700; }
  .primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-surface); font-weight: 600; }
  .link { border: 0; background: none; color: var(--color-accent); padding: .25rem 0; }
  .setup { display: flex; flex-wrap: wrap; gap: 1rem 1.5rem; align-items: end; }
  .setup label { min-width: 13rem; }
  .groups { display: flex; flex-wrap: wrap; gap: .4rem; }
  .banner { margin: 0; padding: .75rem 1rem; background: var(--color-accent-soft); border-left: 3px solid var(--color-accent); }
  .toolbar { display: flex; flex-wrap: wrap; align-items: baseline; gap: .5rem 1.25rem; border-top: 1px solid var(--color-rule); padding-top: 1rem; }
  h2 { margin: 0; font: 700 clamp(1.5rem, 3vw, 2.1rem)/1.1 var(--font-display); text-transform: uppercase; }
  h3 { margin: 0; font-size: 1rem; }
  .count { color: var(--color-muted); font-size: .875rem; font-weight: 400; }
  .check { display: flex; align-items: center; gap: .45rem; }
  .check input { accent-color: var(--color-accent); }
  .hint { margin: 0; color: var(--color-muted); font-size: .875rem; }
  kbd { border: 1px solid var(--color-rule); border-radius: 3px; padding: 0 .3rem; font: inherit; font-size: .8em; }
  .board { display: grid; gap: 2px; background: var(--color-rule); border: 1px solid var(--color-rule); }
  .row { display: grid; grid-template-columns: 6.5rem minmax(0, 1fr); min-height: 7.5rem; background: var(--color-surface); }
  .row.target { cursor: pointer; }
  .row.target:hover { background: color-mix(in srgb, var(--color-accent) 6%, var(--color-surface)); }
  .label { display: grid; place-content: center; text-align: center; gap: .1rem; border: 0; border-radius: 0; color: var(--color-navy); }
  .label:disabled { cursor: default; opacity: 1; }
  .label b { font: 700 2rem/1 var(--font-display); }
  .label span { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
  .t5 .label { background: #7fbf7f; } .t4 .label { background: #bfdf7f; } .t3 .label { background: #f5df80; } .t2 .label { background: #f5bf7f; } .t1 .label { background: #f08f7f; }
  .tiles { display: flex; flex-wrap: wrap; gap: .4rem; padding: .4rem; align-content: flex-start; min-width: 0; }
  .tile { display: grid; grid-template-rows: 4.5rem auto auto auto; width: 7.25rem; padding: .3rem; gap: .1rem; text-align: left; font-size: .75rem; line-height: 1.25; background: var(--color-paper); }
  .tile.selected { border-color: var(--color-accent); box-shadow: 0 0 0 2px var(--color-accent); }
  .tile.dragging { opacity: .4; }
  .img { display: grid; place-items: center; background: #fff; border-radius: 2px; overflow: hidden; }
  .img img { max-width: 100%; max-height: 4.5rem; object-fit: contain; }
  .brand { color: var(--color-muted); font-size: .6875rem; text-transform: uppercase; letter-spacing: .03em; }
  .name { font-weight: 600; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
  .site { color: var(--color-accent); font-weight: 600; }
  .pool { border: 1px dashed var(--color-rule); padding: .75rem; display: grid; gap: .5rem; }
  .pool-head { display: flex; flex-wrap: wrap; gap: .5rem 1rem; align-items: center; }
  .pool-head input { flex: 0 1 16rem; }
  .empty { color: var(--color-muted); margin: .5rem; font-size: .875rem; }
  .share { display: grid; gap: .75rem; max-width: 40rem; }
  .share-buttons { display: flex; flex-wrap: wrap; gap: .5rem; }
  .status { margin: 0; min-height: 1.4em; color: var(--color-muted); font-size: .875rem; }
  textarea { width: 100%; }
  @media (max-width: 640px) {
    .row { grid-template-columns: 3.25rem minmax(0, 1fr); }
    .label span { display: none; }
    .tile { width: calc(33.33% - .3rem); grid-template-rows: 3.5rem auto auto auto; }
    .img img { max-height: 3.5rem; }
  }
</style>
