<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fitGroupIds, fitGroupLabels, type FitGroup } from '../lib/fit-groups';
  import { TIERS, collapseTiers, expandOrder, expandTiers, parseTierList, serializeTierList, tierBadge, tierLabels, tierListText, tierOfFit, type Tier, type TierItem } from '../lib/fit-tiers';
  import { useCases } from '../lib/catalog-ui';
  import type { UseCase } from '../lib/schema';

  let { items }: { items: TierItem[] } = $props();

  const NAME_KEY = 'hotas-tier-name';
  const ids = items.flatMap((item) => item.members);
  const itemById = new Map(items.map((item) => [item.id, item]));
  const caseLabel = (u: UseCase) => useCases.find((c) => c.key === u)!.label;
  const groupsWithItems = fitGroupIds.filter((g) => items.filter((i) => i.group === g).length >= 2);

  let useCase = $state<UseCase>('airliner');
  let group = $state<FitGroup>('sticks');
  /** Ranked entries; insertion order is the order within each tier, best first. */
  let tiers = $state(new Map<string, Tier>());
  let by = $state('');
  let sharedBy = $state<string | null>(null);
  let selected = $state<string | null>(null);
  /** A part being dragged, where the pointer is, and where it would land. */
  let drag = $state<{ id: string; x: number; y: number; target: DropTarget | null } | null>(null);
  let barHeight = $state(0);
  let root: HTMLDivElement;
  let showSite = $state(false);
  let filter = $state('');
  let status = $state('');
  let fallback = $state('');
  let ready = false;

  const groupItems = $derived(items.filter((item) => item.group === group).toSorted((a, b) => `${a.brandName} ${a.name}`.localeCompare(`${b.brandName} ${b.name}`)));
  const inTier = (tier: Tier | null) => tier == null
    ? groupItems.filter((item) => !tiers.has(item.id))
    : [...tiers].flatMap(([id, t]) => { const item = itemById.get(id); return t === tier && item?.group === group ? [item] : []; });
  const unranked = $derived(inTier(null).filter((item) => !filter || `${item.brandName} ${item.name}`.toLowerCase().includes(filter.toLowerCase())));
  const rankedCount = $derived(groupItems.filter((item) => tiers.has(item.id)).length);
  const selectedItem = $derived(selected ? itemById.get(selected) : undefined);
  const selectedTier = $derived(selected ? tiers.get(selected) : undefined);
  const selectedPeers = $derived(selectedTier ? inTier(selectedTier).map((item) => item.id) : []);
  const title = $derived(`${fitGroupLabels[group].plural} for ${caseLabel(useCase)}`);

  /** Site scores (or the spec baseline for unreviewed parts) as a starting point, best first within each tier. */
  function fromSite() {
    const scored = groupItems.filter((item) => item.scored).toSorted((a, b) => b.fit[useCase] - a.fit[useCase]);
    tiers = new Map(scored.map((item) => [item.id, tierOfFit(item.fit[useCase])]));
  }
  function choose(nextCase: UseCase, nextGroup: FitGroup) {
    useCase = nextCase; group = nextGroup; sharedBy = null; selected = null; filter = ''; status = '';
    fromSite();
  }
  /** Put a part at the end of a tier, or just before another ranked part. */
  function move(id: string, tier: Tier | null, before: string | null = null) {
    const entries = [...tiers].filter(([key]) => key !== id);
    if (tier) {
      const at = before ? entries.findIndex(([key]) => key === before) : -1;
      entries.splice(at < 0 ? entries.length : at, 0, [id, tier]);
    }
    tiers = new Map(entries); status = ''; sharedBy = null;
  }
  /** Move a ranked part one place up (-1) or down (1) within its tier. */
  function nudge(id: string, step: -1 | 1) {
    const tier = tiers.get(id);
    if (!tier) return;
    const same = [...tiers].filter(([, t]) => t === tier).map(([key]) => key);
    const target = same[same.indexOf(id) + step];
    if (!target) return;
    const entries = [...tiers];
    const a = entries.findIndex(([key]) => key === id), b = entries.findIndex(([key]) => key === target);
    [entries[a], entries[b]] = [entries[b], entries[a]];
    tiers = new Map(entries); status = ''; sharedBy = null;
  }
  async function place(tier: Tier | null) {
    if (!selected) return;
    const id = selected;
    // Keep the ranking flow going: after placing an unranked part, move on to the next one.
    // A part that was already ranked stays selected so it can be nudged into position.
    const fromPool = !tiers.has(id);
    const queue = unranked.filter((item) => item.id !== id);
    move(id, tier);
    if (!tier) selected = null;
    else if (fromPool) selected = queue[0]?.id ?? null;
    await tick();
    if (selected && selected !== id) document.querySelector<HTMLButtonElement>(`[data-id="${CSS.escape(selected)}"]`)?.focus();
  }
  function onKey(event: KeyboardEvent) {
    if (!selected || (event.target instanceof Element && event.target.matches('input, select, textarea'))) return;
    if (/^[1-6]$/.test(event.key)) { event.preventDefault(); place(Number(event.key) as Tier); }
    else if (event.key === 's' || event.key === 'S') { event.preventDefault(); place(6); }
    else if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && tiers.has(selected)) { event.preventDefault(); nudge(selected, event.key === 'ArrowLeft' ? -1 : 1); }
    else if (event.key === '0' || event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); place(null); }
    else if (event.key === 'Escape') selected = null;
  }
  // Dragging uses pointer events rather than native drag and drop, which touch browsers handle poorly:
  // a mouse drag starts after a short move, a touch drag after holding still, so swipes still scroll.
  type DropTarget = { tier: Tier | null; over: string | null; after: boolean; before: string | null };
  const HOLD_MS = 300, SLOP = 8, EDGE = 72;
  let pending: { id: string; pointerId: number; x: number; y: number; touch: boolean; timer?: number } | null = null;
  let suppressClick = false;
  let frame = 0;

  function pointerDown(event: PointerEvent, id: string) {
    if (event.button !== 0 || pending || drag) return;
    const touch = event.pointerType !== 'mouse';
    pending = { id, pointerId: event.pointerId, x: event.clientX, y: event.clientY, touch };
    if (touch) pending.timer = window.setTimeout(() => pending && startDrag(pending.x, pending.y), HOLD_MS);
    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointercancel', endDrag);
  }
  function pointerMove(event: PointerEvent) {
    if (!pending || event.pointerId !== pending.pointerId) return;
    if (!drag) {
      if (Math.hypot(event.clientX - pending.x, event.clientY - pending.y) <= SLOP) return;
      // A touch that moves before the hold is a scroll, not a drag.
      if (pending.touch) return endDrag();
      startDrag(event.clientX, event.clientY);
    }
    drag!.x = event.clientX; drag!.y = event.clientY;
    drag!.target = dropTarget(event.clientX, event.clientY);
  }
  function startDrag(x: number, y: number) {
    if (!pending) return;
    clearTimeout(pending.timer);
    if (pending.touch) navigator.vibrate?.(10);
    selected = null; suppressClick = true;
    drag = { id: pending.id, x, y, target: dropTarget(x, y) };
    frame = requestAnimationFrame(autoScroll);
  }
  function pointerUp(event: PointerEvent) {
    if (pending && event.pointerId !== pending.pointerId) return;
    const target = drag?.target;
    if (drag && target && target.before !== drag.id) move(drag.id, target.tier, target.before);
    endDrag();
  }
  function endDrag() {
    clearTimeout(pending?.timer);
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', pointerMove);
    window.removeEventListener('pointerup', pointerUp);
    window.removeEventListener('pointercancel', endDrag);
    pending = null; drag = null;
    // The click that follows a drag's pointerup should not toggle selection.
    setTimeout(() => (suppressClick = false));
  }
  /** The tier (or the pool) under the pointer, and the ranked part to land in front of. */
  function dropTarget(x: number, y: number): DropTarget | null {
    const el = document.elementFromPoint(x, y);
    const zone = el?.closest<HTMLElement>('[data-tier]');
    if (!drag && !pending || !zone || !root.contains(zone)) return null;
    const id = (drag ?? pending)!.id;
    const tier = zone.dataset.tier ? Number(zone.dataset.tier) as Tier : null;
    const over = el!.closest<HTMLElement>('[data-id]')?.dataset.id;
    if (!tier || !over || over === id || !tiers.has(over)) return { tier, over: null, after: false, before: null };
    const rect = document.querySelector(`[data-id="${CSS.escape(over)}"]`)!.getBoundingClientRect();
    const after = x > rect.left + rect.width / 2;
    const peers = inTier(tier).map((item) => item.id).filter((key) => key !== id);
    return { tier, over, after, before: after ? peers[peers.indexOf(over) + 1] ?? null : over };
  }
  /** Scroll while the pointer is near the top of the screen or just above the sticky pool. */
  function autoScroll() {
    if (!drag) return;
    const pool = root.querySelector<HTMLElement>('.pool')!;
    const poolTop = pool.getBoundingClientRect().top;
    const bottom = getComputedStyle(pool).position === 'sticky' && poolTop < innerHeight ? poolTop : innerHeight;
    const step = drag.y < EDGE ? drag.y - EDGE : drag.y > bottom - EDGE && drag.y < bottom ? drag.y - bottom + EDGE : 0;
    if (step) { scrollBy(0, step / 4); drag.target = dropTarget(drag.x, drag.y); }
    frame = requestAnimationFrame(autoScroll);
  }

  const memberList = () => ({ useCase, group, by, tiers: expandTiers(items, tiers), order: expandOrder(items, tiers) });
  function shareUrl() {
    // An unedited shared list is passed on as-is, keeping its author.
    if (sharedBy) return location.href;
    const url = new URL('/tiers', location.origin);
    url.search = serializeTierList(memberList()).toString();
    return url.href;
  }
  async function copy(text: string, done: string) {
    try { await navigator.clipboard.writeText(text); status = done; fallback = ''; }
    catch { status = 'Copy the text below.'; fallback = text; }
  }
  const names = $derived(new Map(groupItems.map((item) => [item.id, `${item.brandName} ${item.name}`])));
  const shareText = () => `${tierListText({ useCase, group, tiers, order: expandOrder(items, tiers) }, names, `${title}${by ? ` — by ${by}` : ''}`)}\n${shareUrl()}`;

  function submitOnGitHub() {
    const query = new URLSearchParams({ title: `Tier list: ${title}`, body: `${shareText()}\n\nNotes:\n` });
    window.open(`https://github.com/FeikoWielsma/hotas-compare/issues/new?${query}`, '_blank', 'noopener');
  }

  onMount(() => {
    // Registered by hand because it must be able to cancel scrolling once a touch drag has started.
    const holdScroll = (event: TouchEvent) => { if (drag) event.preventDefault(); };
    root.addEventListener('touchmove', holdScroll, { passive: false });
    by = localStorage.getItem(NAME_KEY) ?? '';
    const restore = () => {
      const shared = parseTierList(location.search, ids);
      if (shared && groupsWithItems.includes(shared.group)) {
        useCase = shared.useCase; group = shared.group; selected = null;
        if (new URLSearchParams(location.search).has('r')) { tiers = collapseTiers(items, shared.tiers, shared.order); sharedBy = shared.by ?? 'someone'; }
        else { sharedBy = null; fromSite(); }
      } else fromSite();
    };
    restore(); ready = true;
    window.addEventListener('popstate', restore);
    return () => { window.removeEventListener('popstate', restore); root.removeEventListener('touchmove', holdScroll); endDrag(); };
  });
  $effect(() => {
    if (!ready) return;
    // While viewing someone's list, keep their link intact until it is edited.
    if (sharedBy) return;
    history.replaceState(history.state, '', `${location.pathname}?${serializeTierList(memberList())}`);
  });
  $effect(() => { if (ready) localStorage.setItem(NAME_KEY, by); });
</script>

<svelte:window onkeydown={onKey} />

<div class="tiers" bind:this={root} class:is-dragging={!!drag} style:--bar="{selectedItem ? barHeight : 0}px">
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

  <p class="hint">Tap a part, then pick its tier in the bar that appears, or press <kbd>S</kbd> or <kbd>5</kbd>–<kbd>1</kbd> (<kbd>0</kbd> to unrank). Order counts: best first within a tier. Drag a part before or after another (on a touch screen, hold it first), or use ◀ ▶ in the bar or <kbd>←</kbd> <kbd>→</kbd>. Leave parts you don't know unranked.</p>

  <div class="board">
    {#each TIERS as tier (tier)}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="row t{tier}" class:target={!!selected} class:drop={drag?.target?.tier === tier} data-tier={tier} role="listitem" onclick={(e) => { if (e.target === e.currentTarget) place(tier); }}>
        <button type="button" class="label" onclick={() => place(tier)} disabled={!selected} aria-label={`Move to ${tierBadge(tier)} ${tierLabels[tier]}`}><b>{tierBadge(tier)}</b><span>{tierLabels[tier]}</span></button>
        <div class="tiles">
          {#each inTier(tier) as item (item.id)}{@render tile(item)}{/each}
        </div>
      </div>
    {/each}
  </div>

  <section class="pool" class:drop={!!drag?.target && drag.target.tier === null} data-tier="" aria-label="Not ranked">
    <div class="pool-head">
      <h3>Not ranked <span class="count">{inTier(null).length}</span></h3>
      <input type="search" placeholder="Filter by name" bind:value={filter} aria-label="Filter unranked parts" />
    </div>
    <div class="tiles">
      {#each unranked as item (item.id)}{@render tile(item)}{/each}
      {#if !unranked.length}<p class="empty">{inTier(null).length ? 'No matches.' : 'Everything is ranked.'}</p>{/if}
    </div>
  </section>

  {#if selectedItem}
    <div class="bar" bind:offsetHeight={barHeight} role="toolbar" aria-label="Move the selected part">
      <div class="bar-head">
        <span class="bar-name"><span class="brand">{selectedItem.brandName}</span> {selectedItem.name}</span>
        {#if selectedTier}
          <button type="button" onclick={() => nudge(selectedItem.id, -1)} disabled={selectedPeers[0] === selectedItem.id} aria-label="Move earlier in tier">◀</button>
          <button type="button" onclick={() => nudge(selectedItem.id, 1)} disabled={selectedPeers.at(-1) === selectedItem.id} aria-label="Move later in tier">▶</button>
        {/if}
        <button type="button" onclick={() => (selected = null)} aria-label="Deselect">✕</button>
      </div>
      <div class="bar-tiers">
        {#each TIERS as tier (tier)}
          <button type="button" class="t{tier}" class:current={selectedTier === tier} aria-pressed={selectedTier === tier} onclick={() => place(tier)} aria-label={`Move to ${tierBadge(tier)} ${tierLabels[tier]}`}>{tierBadge(tier)}</button>
        {/each}
        {#if selectedTier}<button type="button" class="unrank" onclick={() => place(null)}>Unrank</button>{/if}
      </div>
    </div>
  {/if}

  {#if drag}
    {@const item = itemById.get(drag.id)!}
    <div class="ghost" style:left="{drag.x}px" style:top="{drag.y}px" aria-hidden="true">
      <span class="img">{#if item.image}<img src={item.image} alt="" />{/if}</span>
      <span class="name">{item.name}</span>
    </div>
  {/if}

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
  <button type="button" class="tile" class:selected={selected === item.id} class:dragging={drag?.id === item.id}
    class:drop-before={drag?.target?.over === item.id && !drag.target.after} class:drop-after={drag?.target?.over === item.id && drag.target.after}
    data-id={item.id} title={`${item.brandName} ${item.name}`}
    onpointerdown={(e) => pointerDown(e, item.id)} oncontextmenu={(e) => { if (pending || drag) e.preventDefault(); }}
    onclick={() => { if (!suppressClick) selected = selected === item.id ? null : item.id; }} aria-pressed={selected === item.id}>
    <span class="img">{#if item.image}<img src={item.image} alt="" loading="lazy" draggable="false" />{/if}</span>
    <span class="brand">{item.brandName}</span>
    <span class="name">{item.name}</span>
    {#if item.members.length > 1}<span class="variants">{item.members.length} variants</span>{/if}
    {#if showSite}<span class="site">{item.scored ? `${item.estimated ? 'estimate' : 'site'} ${Number(item.fit[useCase].toFixed(1))}` : 'unscored'}</span>{/if}
  </button>
{/snippet}

<style>
  .tiers { display: grid; gap: 1.25rem; margin: 1.5rem 0 3rem; padding-bottom: var(--bar); }
  .tiers.is-dragging { cursor: grabbing; user-select: none; -webkit-user-select: none; }
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
  .row.target:hover, .row.drop { background: color-mix(in srgb, var(--color-accent) 6%, var(--color-surface)); }
  .label { display: grid; place-content: center; text-align: center; gap: .1rem; border: 0; border-radius: 0; color: var(--color-navy); }
  .label:disabled { cursor: default; opacity: 1; }
  .label b { font: 700 2rem/1 var(--font-display); }
  .label span { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
  .t6 .label { background: #b9a4e0; } .t5 .label { background: #7fbf7f; } .t4 .label { background: #bfdf7f; } .t3 .label { background: #f5df80; } .t2 .label { background: #f5bf7f; } .t1 .label { background: #f08f7f; }
  .tiles { display: flex; flex-wrap: wrap; gap: .4rem; padding: .4rem; align-content: flex-start; min-width: 0; }
  .tile { display: grid; grid-template-rows: 4.5rem auto auto auto; align-content: start; width: 7.25rem; padding: .3rem; gap: .1rem; text-align: left; font-size: .75rem; line-height: 1.25; background: var(--color-paper); }
  .tile.selected { border-color: var(--color-accent); box-shadow: 0 0 0 2px var(--color-accent); }
  .tile { touch-action: manipulation; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
  .tile.dragging { opacity: .4; }
  .tile.drop-before { box-shadow: -4px 0 0 var(--color-accent); }
  .tile.drop-after { box-shadow: 4px 0 0 var(--color-accent); }
  .img { display: grid; place-items: center; background: #fff; border-radius: 2px; overflow: hidden; }
  .img img { max-width: 100%; max-height: 4.5rem; object-fit: contain; }
  .brand { color: var(--color-muted); font-size: .6875rem; text-transform: uppercase; letter-spacing: .03em; }
  .name { font-weight: 600; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
  .site { color: var(--color-accent); font-weight: 600; }
  .variants { color: var(--color-muted); font-size: .6875rem; }
  .pool { border: 1px dashed var(--color-rule); padding: .75rem; display: grid; gap: .5rem; background: var(--color-surface); }
  .pool.drop { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 6%, var(--color-surface)); }
  .pool-head { display: flex; flex-wrap: wrap; gap: .5rem 1rem; align-items: center; }
  .pool-head input { flex: 0 1 16rem; }
  .empty { color: var(--color-muted); margin: .5rem; font-size: .875rem; }
  .share { display: grid; gap: .75rem; max-width: 40rem; }
  .share-buttons { display: flex; flex-wrap: wrap; gap: .5rem; }
  .status { margin: 0; min-height: 1.4em; color: var(--color-muted); font-size: .875rem; }
  textarea { width: 100%; }
  .bar { box-sizing: border-box; position: fixed; z-index: 20; inset: auto 0 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: .5rem; width: min(100%, 40rem); margin: 0 auto; padding: .6rem .75rem calc(.6rem + env(safe-area-inset-bottom)); background: var(--color-surface); border: 1px solid var(--color-rule); border-bottom: 0; box-shadow: 0 -4px 16px rgb(0 0 0 / .12); }
  .bar-head { display: flex; align-items: center; gap: .4rem; }
  .bar-name { flex: 1; min-width: 0; font-size: .875rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar-head button { padding: .4rem .7rem; }
  .bar-head button:disabled { opacity: .35; cursor: default; }
  .bar-tiers { display: flex; gap: .3rem; }
  .bar-tiers button { flex: 1; min-width: 0; min-height: 2.75rem; padding: .3rem; font: 700 1.25rem/1 var(--font-display); color: var(--color-navy); border-color: transparent; }
  .bar-tiers .current { box-shadow: inset 0 0 0 3px var(--color-navy); }
  .bar-tiers .unrank { flex: 1.6; font: 600 .8125rem/1 var(--font-sans); color: var(--color-ink); border-color: var(--color-rule); }
  .bar-tiers .t6 { background: #b9a4e0; } .bar-tiers .t5 { background: #7fbf7f; } .bar-tiers .t4 { background: #bfdf7f; } .bar-tiers .t3 { background: #f5df80; } .bar-tiers .t2 { background: #f5bf7f; } .bar-tiers .t1 { background: #f08f7f; }
  .ghost { position: fixed; z-index: 30; display: grid; grid-template-rows: 3rem auto; width: 5.5rem; padding: .3rem; gap: .15rem; font-size: .6875rem; line-height: 1.2; background: var(--color-paper); border: 1px solid var(--color-accent); border-radius: 2px; box-shadow: 0 6px 18px rgb(0 0 0 / .2); pointer-events: none; transform: translate(-50%, calc(-100% - 12px)); }
  .ghost .img img { max-height: 3rem; }
  /* Phones: compact tiles so more of the board fits, and the pool as a strip that stays on screen. */
  @media (max-width: 640px) {
    .row { grid-template-columns: 2.5rem minmax(0, 1fr); min-height: 4.25rem; }
    .label span { display: none; }
    .label b { font-size: 1.5rem; }
    .tiles { gap: .3rem; padding: .3rem; }
    .tile { width: calc((100% - .9rem) / 4); grid-template-rows: 2.5rem auto auto auto; padding: .2rem; font-size: .6875rem; line-height: 1.2; }
    .tile .brand { font-size: .5625rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .img img { max-height: 2.5rem; }
    .pool { position: sticky; z-index: 10; bottom: var(--bar); padding: .5rem; gap: .35rem; border-style: solid; box-shadow: 0 -4px 12px rgb(0 0 0 / .08); }
    .pool-head { flex-wrap: nowrap; }
    .pool-head h3 { white-space: nowrap; font-size: .875rem; }
    .pool-head input { flex: 1 1 auto; padding: .4rem .5rem; }
    .pool .tiles { flex-wrap: nowrap; overflow-x: auto; padding: .1rem; overscroll-behavior-x: contain; }
    .pool .empty { margin: .25rem; }
    .pool .tile { flex: none; width: calc((100% - .9rem) / 4.4); }
    .bar { border-inline: 0; }
  }
</style>
