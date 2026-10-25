<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import HardwareIcon from './HardwareIcon.svelte';
  import type { CatalogItem } from '../lib/catalog';
  import { detailHref, itemCategoryLabel, productImageSrc, useCases } from '../lib/catalog-ui';
  import { regionStore, isRegion } from '../lib/stores/region.svelte';
  import { MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  import { budgetStops, budgetTier, defaultPieces, deserializePicks, deserializeWizardState, matchCuratedSetups, nearestBudgetStop, normalizeWizardAnswers, picksOf, recommendLoadout, serializeWizardState, DRAFT_SPECS_WARNING, PIECES, STALE_PRICE_WARNING } from '../lib/wizard';
  import type { WizardAnswers, WizardLoadout, WizardPick, WizardPiece, WizardSetup } from '../lib/wizard';
  import type { Region, UseCase } from '../lib/schema';

  let { items, setups }: { items: CatalogItem[]; setups: WizardSetup[] } = $props();
  let answers = $state<WizardAnswers>(normalizeWizardAnswers());
  let ready = $state(false);
  let shareStatus = $state('');
  let shareFallback = $state('');
  /** Picks the user pinned; every other pick re-optimises with the settings. */
  let pinned = $state<WizardPick[]>([]);
  /** Picks on screen, used only to break exact ties so equal alternatives do not churn. */
  let previous: WizardPick[] = [];
  /** Pieces that differ from the result before the last live edit. */
  let changed = $state<string[]>([]);
  let loadout = $state<WizardLoadout | null>(null);
  let curated = $state<ReturnType<typeof matchCuratedSetups>>([]);
  let updating = $state(false);
  let edited = $state(false);
  let liveStatus = $state('');
  let tab = $state<'match' | 'curated'>('match');
  let setupPanel = $state<HTMLElement>();
  /** On narrow screens a bottom bar links to the setup until the setup itself is in view. */
  let setupVisible = $state(false);
  const LIVE_DELAY = 300;
  const labels: Record<WizardPiece, string> = { stick: 'Primary stick', second_stick: 'Secondary stick', throttle: 'Throttle', collective: 'Collective', pedals: 'Rudder pedals', yoke: 'Flight yoke', quadrant: 'Throttle quadrant' };
  const label = (piece: WizardPiece) => answers.useCase === 'heli' && piece === 'stick' ? 'Cyclic stick' : labels[piece];
  const aircraftIcons: Record<UseCase, string> = { modern_jet: 'jet', space_hosas: 'hosas', space_hotas: 'space', heli: 'heli', ga: 'ga', airliner: 'airliner', ww2: 'warbird' };
  const pieceIcons: Record<WizardPiece, string> = { stick: 'stick', second_stick: 'grip', throttle: 'throttle', collective: 'control-lever', pedals: 'pedals', yoke: 'yoke', quadrant: 'quadrant' };
  const mounts = [{ key: 'desk', label: 'On the desk', icon: 'desk', detail: 'Controls sit on the desk; check base plates and stability.' }, { key: 'clamp', label: 'Desk clamp mounts', icon: 'clamp', detail: 'Controls sit at desk height or below; allow for brackets.' }, { key: 'chair_pit', label: 'Chair or cockpit', icon: 'cockpit', detail: 'A dedicated flying position; check plates and bolt patterns.' }] as const;
  const presets = [150, 350, 750, 1500];
  const normalized = $derived(normalizeWizardAnswers(answers));
  const validBudget = $derived(Number.isFinite(answers.budgetMax) && answers.budgetMax > 0 && answers.budgetMax <= 100000);
  const hasPieces = $derived(answers.piecesNeeded.length > 0);
  const stops = $derived(budgetStops(regionStore.currency));
  const tierLabels = { budget: 'Entry level', mid: 'Mid range', high_end: 'High end', enthusiast: 'Enthusiast' } as const;
  const compareIds = $derived([...new Set(loadout?.items.map((item) => item.id) ?? [])]);
  const showSetup = $derived(hasPieces && validBudget && !!loadout?.complete);
  const flightDeck = $derived(answers.useCase === 'ga' || answers.useCase === 'airliner');
  const yawNote = $derived(!hasPieces ? 'Choose at least one control.' : answers.hasExistingPedals ? 'Your pedals handle yaw.' : answers.piecesNeeded.includes('pedals') ? 'Pedals handle yaw.' : normalized.needsTwist ? 'No pedals, so the stick must twist for yaw.' : 'Without pedals, yoke rudder triggers or another yaw input stand in.');
  /** One line of guidance under the controls for the styles whose choice is not obvious. */
  const controlNote = $derived(answers.useCase === 'airliner' ? 'Boeing and most regional airliners use a yoke, the Airbus family a sidestick; we favour matching replica quadrants.'
    : answers.useCase === 'ga' ? 'Yoke for Cessna, Piper twins and most tourers; stick for Cubs, Diamonds, Cirrus, gliders and aerobatics.'
    : answers.useCase === 'heli' && answers.piecesNeeded.includes('collective') ? 'A throttle, left-hand stick or stick throttle axis can stand in for a collective.' : '');
  /** Per-item warnings collapse to one line each; setup-wide warnings pass through. */
  const checks = $derived.by(() => {
    if (!loadout?.complete) return [];
    const count = (warning: string) => loadout!.pieces.filter((piece) => piece.warnings.includes(warning)).length;
    const plural = (n: number) => `${n} pick${n === 1 ? '' : 's'}`;
    const draft = count(DRAFT_SPECS_WARNING), stale = count(STALE_PRICE_WARNING);
    return [
      ...(draft ? [`Specifications for ${plural(draft)} are not editor-verified yet.`] : []),
      ...(stale ? [`Prices for ${plural(stale)} are over 90 days old.`] : []),
      ...loadout.warnings.filter((warning) => warning !== DRAFT_SPECS_WARNING && warning !== STALE_PRICE_WARNING),
      ...(compareIds.length < loadout.items.length ? ['Two copies of the same stick count twice in the total and once in compare.'] : []),
    ];
  });
  function money(amount: number) { return new Intl.NumberFormat('en', { style: 'currency', currency: regionStore.currency, maximumFractionDigits: 2 }).format(amount); }
  /** Budget figures are whole amounts; item prices keep cents. */
  function budgetMoney(amount: number) { return new Intl.NumberFormat('en', { style: 'currency', currency: regionStore.currency, maximumFractionDigits: 0 }).format(amount); }
  const styleLabel = (label: string) => label === 'WWII' ? 'Warbird WWII' : label;
  /**
   * Specific reasons first, then fit and review scores in short form (a range when a pick has several parts).
   * The budget-fit reason holds for every pick, so it is left out.
   */
  function reasons(explanations: string[]) {
    const fits: number[] = [], verdicts: number[] = [];
    let unreviewed = false;
    const specific = explanations.flatMap((explanation) => {
      const fit = explanation.match(/Use-case fit for \w+: ([\d.]+)\/5$/), verdict = explanation.match(/Editorial verdict average: ([\d.]+)\/5$/);
      if (fit) fits.push(Number(fit[1]));
      else if (verdict) verdicts.push(Number(verdict[1]));
      else if (/No editorial review yet/.test(explanation)) unreviewed = true;
      else if (!explanation.includes('fits within the total budget')) return [explanation.replace(/^[+-]\s*/, '')];
      return [];
    });
    const span = (values: number[]) => Math.min(...values) === Math.max(...values) ? `${values[0]}` : `${Math.min(...values)}–${Math.max(...values)}`;
    return [...new Set(specific), ...(fits.length ? [`Fit ${span(fits)}/5`] : []), ...(verdicts.length ? [`Reviews ${span(verdicts)}/5`] : unreviewed ? ['No review yet'] : [])].join(' · ');
  }
  function chooseDiscipline(useCase: UseCase) {
    if (answers.useCase !== useCase) answers = normalizeWizardAnswers({ ...answers, useCase, piecesNeeded: defaultPieces(useCase) });
  }
  function togglePiece(piece: WizardPiece) {
    answers = normalizeWizardAnswers({ ...answers, ...(piece === 'pedals' ? { hasExistingPedals: false } : {}), piecesNeeded: answers.piecesNeeded.includes(piece) ? answers.piecesNeeded.filter((p) => p !== piece) : [...answers.piecesNeeded, piece] });
  }
  /** GA and airliner pilots fly either a yoke or a (side)stick; swapping keeps the other selected pieces. */
  function choosePrimary(primary: 'yoke' | 'stick') {
    const other = primary === 'yoke' ? 'stick' : 'yoke';
    answers = normalizeWizardAnswers({ ...answers, piecesNeeded: [...answers.piecesNeeded.filter((piece) => piece !== other && piece !== primary), primary] });
  }
  function setOwnPedals(owned: boolean) {
    answers = normalizeWizardAnswers({ ...answers, hasExistingPedals: owned, piecesNeeded: owned ? answers.piecesNeeded.filter((piece) => piece !== 'pedals') : answers.piecesNeeded });
  }
  const pickKey = (ids: WizardPick) => ids.join('~');
  const isPinned = (ids: WizardPick) => pinned.some((pin) => pickKey(pin) === pickKey(ids));
  function recompute(next: WizardAnswers, region: Region) {
    const result = recommendLoadout(items, next, region, { pinned, prefer: previous });
    loadout = result;
    curated = matchCuratedSetups(setups, items, next, region);
    if (result.complete) {
      const before = new Set(previous.map(pickKey));
      changed = previous.length ? picksOf(result).map(pickKey).filter((key) => !before.has(key)) : [];
      previous = picksOf(result);
    }
    return result;
  }
  /** Recommendations follow the answers, debounced so a slider drag recomputes once it settles. */
  $effect(() => {
    if (!ready || !validBudget) { updating = false; return; }
    const next = normalized;
    const region = regionStore.region;
    if (!untrack(() => loadout)) { untrack(() => recompute(next, region)); return; }
    updating = true;
    const timer = setTimeout(() => {
      const result = recompute(next, region);
      updating = false; edited = true;
      liveStatus = result.complete ? `Setup updated · ${money(result.totalPrice)}${changed.length ? ` · ${changed.length} pick${changed.length === 1 ? '' : 's'} changed` : ''}` : 'No complete setup fits these answers.';
    }, LIVE_DELAY);
    return () => clearTimeout(timer);
  });
  function togglePin(ids: WizardPick) {
    pinned = isPinned(ids) ? pinned.filter((pin) => pickKey(pin) !== pickKey(ids)) : [...pinned, ids];
    if (validBudget) recompute(normalized, regionStore.region);
  }
  function unpinAll() {
    pinned = [];
    const result = recompute(normalized, regionStore.region);
    liveStatus = result.complete ? `Best match for these answers · ${money(result.totalPrice)}` : 'No complete setup fits these answers.';
  }
  function setBudgetStop(index: number) { answers.budgetMax = stops[index]; }
  function clearResults() { loadout = null; previous = []; edited = false; changed = []; liveStatus = ''; }
  function startOver() {
    answers = normalizeWizardAnswers(); pinned = []; tab = 'match'; shareStatus = ''; shareFallback = '';
    clearResults();
  }
  onMount(() => {
    regionStore.init();
    const restore = () => {
      const params = new URLSearchParams(location.search);
      if (isRegion(params.get('region'))) regionStore.setRegion(params.get('region') as 'EU' | 'UK' | 'US');
      answers = deserializeWizardState(params);
      pinned = deserializePicks(params.get('pinned'));
      clearResults();
      // Links from before pinning carried every pick; use them only to break ties.
      previous = deserializePicks(params.get('picks'));
    };
    restore(); ready = true;
    window.addEventListener('popstate', restore);
    const observer = new IntersectionObserver(([entry]) => { setupVisible = entry.isIntersecting; }, { threshold: 0.15 });
    if (setupPanel) observer.observe(setupPanel);
    return () => { window.removeEventListener('popstate', restore); observer.disconnect(); };
  });
  $effect(() => {
    if (!ready || !validBudget) return;
    const params = new URLSearchParams(serializeWizardState(normalized, pinned));
    params.set('region', regionStore.region);
    history.replaceState(history.state, '', `${location.pathname}?${params}${location.hash}`);
  });
  async function copyShareLink() {
    if (updating && validBudget) { recompute(normalized, regionStore.region); updating = false; }
    const url = new URL('/wizard', location.origin);
    url.search = serializeWizardState(normalized, pinned);
    url.searchParams.set('region', regionStore.region);
    try { await navigator.clipboard.writeText(url.href); shareStatus = 'Share link copied.'; shareFallback = ''; }
    catch { shareStatus = 'Copy the link below.'; shareFallback = url.href; }
  }
</script>

<div class="wizard">
  <section class="answers" aria-label="Your answers">
    <div class="row">
      <h2 class="label" id="q-style"><span>01</span>What you fly</h2>
      <div class="control tiles" role="group" aria-labelledby="q-style">
        {#each useCases as discipline}
          <button class="tile" aria-pressed={answers.useCase === discipline.key} onclick={() => chooseDiscipline(discipline.key)}><HardwareIcon name={aircraftIcons[discipline.key]} size={30} /><span>{styleLabel(discipline.label)}</span></button>
        {/each}
      </div>
    </div>

    <div class="row">
      <h2 class="label" id="q-controls"><span>02</span>Controls to buy</h2>
      <div class="control">
        {#if flightDeck}
          <div class="primary-control" role="group" aria-label="Main flight control">
            <span>Main control</span>
            <button class="chip" aria-pressed={answers.piecesNeeded.includes('yoke')} onclick={() => choosePrimary('yoke')}>{answers.useCase === 'airliner' ? 'Yoke · Boeing' : 'Yoke'}</button>
            <button class="chip" aria-pressed={answers.piecesNeeded.includes('stick') && !answers.piecesNeeded.includes('yoke')} onclick={() => choosePrimary('stick')}>{answers.useCase === 'airliner' ? 'Sidestick · Airbus' : 'Stick'}</button>
          </div>
        {/if}
        <div class="toggles" role="group" aria-labelledby="q-controls">
          {#each PIECES as piece}
            <button class="toggle" aria-pressed={answers.piecesNeeded.includes(piece)} onclick={() => togglePiece(piece)}><HardwareIcon name={pieceIcons[piece]} size={24} /><span>{label(piece)}</span><span class="box" aria-hidden="true"></span></button>
          {/each}
        </div>
        {#if controlNote}<p class="line">{controlNote}</p>{/if}
        <div class="line">
          <label class="check"><input type="checkbox" checked={answers.hasExistingPedals ?? false} onchange={(event) => setOwnPedals(event.currentTarget.checked)} />I already own pedals</label>
          <span class:alert={!hasPieces}>{yawNote}</span>
        </div>
      </div>
    </div>

    <div class="row">
      <h2 class="label" id="q-budget"><span>03</span>Budget</h2>
      <div class="control">
        <div class="budget">
          <p class="readout"><strong>{validBudget ? budgetMoney(answers.budgetMax) : '–'}</strong><span class:alert={!validBudget}>{validBudget ? tierLabels[budgetTier(answers.budgetMax)] : 'Enter 1 to 100,000'}</span></p>
          <input class="slider" type="range" min="0" max={stops.length - 1} step="1" aria-labelledby="q-budget"
            value={nearestBudgetStop(stops, validBudget ? answers.budgetMax : stops[0])} aria-valuetext={validBudget ? `${budgetMoney(answers.budgetMax)}, ${tierLabels[budgetTier(answers.budgetMax)]}` : 'No budget set'}
            oninput={(event) => setBudgetStop(Number(event.currentTarget.value))} />
          <label class="exact">Exact <span class="exact-field"><span>{regionStore.currency}</span><input type="number" min="1" max="100000" step="any" bind:value={answers.budgetMax} aria-invalid={!validBudget} /></span></label>
        </div>
        <div class="line">
          {#each presets as preset}<button class="chip" aria-pressed={answers.budgetMax === preset} onclick={() => answers.budgetMax = preset}>{budgetMoney(preset)}</button>{/each}
          <span>Listed {regionStore.region} prices; shipping and mounts not included.</span>
        </div>
      </div>
    </div>

    <div class="row">
      <h2 class="label" id="q-space"><span>04</span>Your space</h2>
      <div class="control">
        <div class="mounts" role="group" aria-labelledby="q-space">
          {#each mounts as mount}
            <button class="mount" aria-pressed={answers.mountType === mount.key} onclick={() => answers.mountType = mount.key}><HardwareIcon name={mount.icon} size={24} /><span>{mount.label}</span></button>
          {/each}
        </div>
        <p class="line">{mounts.find((mount) => mount.key === answers.mountType)?.detail}</p>
      </div>
    </div>
  </section>

  <aside class="setup" id="setup" aria-labelledby="setup-heading" bind:this={setupPanel}>
    <h2 id="setup-heading" class="visually-hidden">Your setup</h2>
    <div class="tabs" role="tablist" aria-label="Setup source">
      <button role="tab" id="tab-match" aria-selected={tab === 'match'} aria-controls="panel-match" onclick={() => tab = 'match'}>Best match</button>
      <button role="tab" id="tab-curated" aria-selected={tab === 'curated'} aria-controls="panel-curated" onclick={() => tab = 'curated'}>Editor's pick{curated.length ? ` (${curated.length})` : ''}</button>
    </div>
    <p class="visually-hidden" role="status" aria-live="polite">{updating ? 'Updating your setup…' : liveStatus}</p>

    {#if tab === 'match'}
      <div id="panel-match" role="tabpanel" aria-labelledby="tab-match" class="panel" class:updating>
        {#if loadout?.dropped.length}
          <div class="dropped" role="note"><strong>Pinned picks that no longer fit</strong>
            <ul>{#each loadout.dropped as pick}<li><span>{pick.items.map((item) => item.name).join(' + ') || pick.ids.join(' + ')}</span> <small>{pick.reason} It comes back if your answers allow it again.</small> <button class="text-button" onclick={() => togglePin(pick.ids)}>Unpin</button></li>{/each}</ul>
          </div>
        {/if}
        {#if !hasPieces}
          <p class="empty">Choose at least one control to see a setup.</p>
        {:else if !validBudget}
          <p class="empty">Enter a budget to see a setup.</p>
        {:else if loadout?.complete}
          {#if loadout.overBudget !== undefined}
            <p class="over-budget"><strong>{money(loadout.overBudget)} over your budget.</strong> Nothing we recommend for these controls fits {budgetMoney(answers.budgetMax)}; this is the setup to stretch for.</p>
          {/if}
          <ul class="picks">
            {#each loadout.pieces as piece}
              {@const ids = piece.items.map((item) => item.id)}
              {@const photo = productImageSrc(piece.items[0]?.images[0]?.file)}
              <li class="pick" class:pinned={piece.pinned}>
                <span class="thumb">{#if photo}<img src={photo} alt="" />{:else}<HardwareIcon name={pieceIcons[piece.roles[0]]} size={26} />{/if}</span>
                <div class="pick-body">
                  <p class="role">{piece.roles.map((role) => label(role) + (piece.standIns.includes(role) ? ' (stand-in)' : '')).join(' + ')}{#if piece.items.length > 1}<span class="badge">{piece.items.length} parts, bought separately</span>{/if}{#if edited && changed.includes(pickKey(ids))}<span class="badge">Changed</span>{/if}</p>
                  {#each piece.items as item}<a class="name" href={detailHref(item)}>{#if piece.items.length > 1}<span class="part">{itemCategoryLabel(item)}</span>{/if}{item.name}</a>{/each}
                  {#if reasons(piece.explanations)}<p class="why">{reasons(piece.explanations)}</p>{/if}
                </div>
                <div class="pick-side">
                  <strong>{money(piece.price)}</strong>
                  <button class="pin" aria-pressed={!!piece.pinned} aria-label={`${piece.pinned ? 'Unpin' : 'Pin'} ${piece.items.map((item) => item.name).join(' + ')}`} title={piece.pinned ? 'Unpin: let this pick change with your answers' : 'Pin: keep this pick while it fits your answers'} onclick={() => togglePin(ids)}>{piece.pinned ? 'Pinned' : 'Pin'}</button>
                </div>
              </li>
            {/each}
          </ul>
          <div class="total">
            <p><span>Setup total</span><strong>{money(loadout.totalPrice)}</strong></p>
            <div class="meter" class:over={loadout.overBudget !== undefined} aria-hidden="true"><span style:width={`${Math.min(100, loadout.totalPrice / answers.budgetMax * 100)}%`}></span></div>
            <p class="budget-line"><span>{loadout.overBudget !== undefined ? `${budgetMoney(loadout.overBudget)} over ${budgetMoney(answers.budgetMax)}` : `${budgetMoney(answers.budgetMax - loadout.totalPrice)} left of ${budgetMoney(answers.budgetMax)}`}</span><span>≈ {loadout.totalLogicalButtons} inputs · {loadout.totalAxes} axes</span></p>
            {#if compareIds.length <= MAX_COMPARE_ITEMS}
              <a class="primary" href={`/compare?${new URLSearchParams({ items: compareIds.join(',') })}`}>Compare {compareIds.length === 1 ? 'this pick' : `these ${compareIds.length}`} side by side</a>
            {:else}
              <div class="compare-parts">{#each Array.from({ length: Math.ceil(compareIds.length / MAX_COMPARE_ITEMS) }, (_, index) => index) as batch}<a class="primary" href={`/compare?${new URLSearchParams({ items: compareIds.slice(batch * MAX_COMPARE_ITEMS, (batch + 1) * MAX_COMPARE_ITEMS).join(',') })}`}>Compare part {batch + 1}</a>{/each}</div>
            {/if}
            {#if pinned.length}<button class="text-button" onclick={unpinAll} disabled={updating}>Unpin all ({pinned.length})</button>{/if}
          </div>
          {#if checks.length}
            <details class="checks">
              <summary>{checks.length} thing{checks.length === 1 ? '' : 's'} to check before buying</summary>
              <ul>{#each checks as check}<li>{check}</li>{/each}</ul>
            </details>
          {/if}
        {:else if loadout}
          {#each loadout.warnings.slice(0, 1) as warning}<p class="empty alert">{warning}</p>{/each}
        {/if}
      </div>
    {:else}
      <div id="panel-curated" role="tabpanel" aria-labelledby="tab-curated" class="panel">
        {#each curated as setup}
          <article class="reference">
            <p class="role">{#if setup.data.pick}<strong>Our pick</strong> · {/if}{tierLabels[setup.data.budget_tier]}</p>
            <h3>{setup.data.title}</h3>
            <p class="why">{setup.data.description}</p>
            <ul class="picks">{#each setup.included as included}{@const photo = included.item ? productImageSrc(included.item.images[0]?.file) : null}<li class="pick"><span class="thumb">{#if photo}<img src={photo} alt="" />{/if}</span><div class="pick-body"><p class="role">{included.role}</p>{#if included.item}<a class="name" href={detailHref(included.item)}>{included.item.name}</a>{:else}<span class="name">{included.id} (not in catalog)</span>{/if}</div></li>{/each}</ul>
            <p class="reference-total"><span>{setup.totalPrice === null ? 'Total unavailable: a price is missing' : setup.withinBudget ? 'Within your budget' : 'Above your budget'}</span>{#if setup.totalPrice !== null}<strong>{money(setup.totalPrice)}</strong>{/if}</p>
            <p class="note">{setup.data.reasoning}{setup.data.notes ? ` ${setup.data.notes}` : ''}</p>
            {#each setup.warnings as warning}<p class="note alert">{warning}</p>{/each}
          </article>
        {:else}
          <p class="empty">No editor's pick for this flying style at this budget yet. Best match builds one from your answers.</p>
        {/each}
        {#if curated.length}<p class="note">Editor's picks may include different controls from the ones you chose.</p>{/if}
      </div>
    {/if}

    <div class="share">
      <button onclick={copyShareLink}>Copy share link</button>
      <button class="text-button" onclick={startOver}>Start over</button>
      <p role="status" class="note">{shareStatus}</p>
      {#if shareFallback}<input aria-label="Share URL" readonly value={shareFallback} onclick={(event) => event.currentTarget.select()} />{/if}
    </div>
  </aside>

  {#if showSetup && loadout}
    <a class="setup-bar" class:hidden={setupVisible} href="#setup"><span><strong>{money(loadout.totalPrice)}</strong><small>{loadout.pieces.length} pick{loadout.pieces.length === 1 ? '' : 's'} · {loadout.overBudget !== undefined ? `${budgetMoney(loadout.overBudget)} over budget` : `${budgetMoney(answers.budgetMax - loadout.totalPrice)} left`}</small></span><span class="go">See setup</span></a>
  {/if}
</div>

<style>
  .wizard { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 1.25rem; margin-block: 1.25rem 3rem; color: var(--color-ink); font: .9375rem/1.5 var(--font-sans); }
  button, input { font: inherit; color: var(--color-ink); background: var(--color-surface); border: 1px solid var(--color-rule); border-radius: 3px; }
  button { cursor: pointer; }
  button:hover { border-color: var(--color-accent); }
  button:disabled { cursor: not-allowed; opacity: .55; }
  button:focus-visible, a:focus-visible, input:focus-visible, summary:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 2px; }
  [aria-pressed='true'] { border-color: var(--color-accent); background: var(--color-accent-soft); }
  .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .alert { color: var(--color-accent); font-weight: 600; }

  .answers, .setup { min-width: 0; background: var(--color-surface); border: 1px solid var(--color-rule); border-radius: 4px; }
  .answers { flex: 999 1 600px; }
  .row { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; padding: 1rem 1.25rem; }
  .row + .row { border-top: 1px solid var(--color-rule); }
  .label { flex: 0 0 8.5rem; margin: 0; padding-top: .2rem; font: 700 .9375rem/1.3 var(--font-sans); }
  .label span { display: block; color: var(--color-accent); font-size: .75rem; }
  .control { flex: 999 1 420px; min-width: 0; }
  .line { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem 1.25rem; min-height: 1.5rem; margin: .6rem 0 0; font-size: .8125rem; color: var(--color-muted); }

  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: .5rem; }
  .tile { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .35rem; min-height: 76px; padding: .6rem .25rem; font-size: .8125rem; font-weight: 600; line-height: 1.2; text-align: center; }
  .tile[aria-pressed='true'] { box-shadow: inset 0 -3px var(--color-accent); }
  .tile[aria-pressed='true'] :global(svg), .toggle[aria-pressed='true'] :global(svg), .mount[aria-pressed='true'] :global(svg) { color: var(--color-accent); }
  .toggles { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: .5rem; }
  .toggle { display: flex; align-items: center; gap: .6rem; min-height: 52px; padding: .5rem .65rem; font-size: .8125rem; font-weight: 600; line-height: 1.2; text-align: left; }
  .box { position: relative; flex: none; width: 18px; height: 18px; margin-left: auto; border: 1.5px solid var(--color-muted); border-radius: 3px; }
  .toggle[aria-pressed='true'] .box { background: var(--color-accent); border-color: var(--color-accent); }
  .toggle[aria-pressed='true'] .box::after { content: ''; position: absolute; left: 5px; top: 1px; width: 5px; height: 10px; border: solid var(--color-surface); border-width: 0 2px 2px 0; transform: rotate(45deg); }
  .check { display: inline-flex; align-items: center; gap: .5rem; font-weight: 600; color: var(--color-ink); cursor: pointer; }
  input[type='checkbox'] { accent-color: var(--color-accent); width: 18px; height: 18px; margin: 0; }

  .budget { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem 1.1rem; }
  .readout { display: flex; flex-direction: column; min-width: 7.5rem; margin: 0; }
  .readout strong { font: 700 1.875rem/1 var(--font-display); color: var(--color-accent); }
  .readout span { font-size: .75rem; color: var(--color-muted); }
  .readout span.alert { color: var(--color-accent); }
  .slider { flex: 1 1 200px; min-width: 150px; min-height: 36px; padding: 0; border: 0; background: transparent; accent-color: var(--color-accent); cursor: pointer; }
  .exact { display: inline-flex; align-items: center; gap: .4rem; font-size: .8125rem; color: var(--color-muted); }
  .exact-field { display: inline-flex; align-items: center; border: 1px solid var(--color-rule); border-radius: 3px; background: var(--color-paper); padding-left: .5rem; color: var(--color-ink); font-weight: 600; }
  .exact-field input { width: 5.5rem; min-height: 34px; padding: 0 .5rem; border: 0; background: transparent; }
  .chip { min-height: 36px; padding: 0 .9rem; border-radius: 18px; font-size: .8125rem; font-weight: 600; color: var(--color-ink); }

  .mounts { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: .5rem; }
  .mount { display: flex; align-items: center; gap: .6rem; min-height: 48px; padding: 0 .8rem; font-size: .875rem; font-weight: 600; text-align: left; }
  .mount[aria-pressed='true'] { box-shadow: inset 0 -3px var(--color-accent); }

  .setup { flex: 1 1 360px; position: sticky; top: 1rem; border-top: 4px solid var(--color-accent); }
  .tabs { display: flex; padding: 0 .75rem; border-bottom: 1px solid var(--color-rule); }
  .tabs button { flex: 1; min-height: 44px; border: 0; border-bottom: 3px solid transparent; border-radius: 0; background: transparent; font-size: .875rem; font-weight: 600; color: var(--color-muted); }
  .tabs [aria-selected='true'] { color: var(--color-ink); border-bottom-color: var(--color-accent); }
  .panel { transition: opacity .15s; }
  .panel.updating { opacity: .6; }
  .empty { margin: 0; padding: 1.25rem 1rem; font-size: .875rem; color: var(--color-muted); }
  .picks { list-style: none; margin: 0; padding: 0; }
  .pick { display: flex; align-items: center; gap: .75rem; padding: .75rem 1rem; border-bottom: 1px solid var(--color-rule); }
  .pick.pinned { background: var(--color-accent-soft); }
  .thumb { display: grid; place-items: center; flex: none; width: 52px; height: 52px; background: var(--color-photo); border-radius: 3px; color: var(--color-muted); overflow: hidden; }
  .thumb img { width: 100%; height: 100%; object-fit: contain; }
  .pick-body { flex: 1; min-width: 0; }
  .role { margin: 0; font-size: .6875rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-muted); }
  .role strong { color: var(--color-accent); }
  .name { display: block; font-size: .875rem; font-weight: 600; line-height: 1.3; text-decoration: none; overflow-wrap: anywhere; }
  .name:hover { color: var(--color-accent); text-decoration: underline; }
  .why { margin: .15rem 0 0; font-size: .75rem; line-height: 1.4; color: var(--color-muted); display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .badge { margin-left: .5rem; padding: 0 .35rem; border: 1px solid var(--color-accent); border-radius: 2px; color: var(--color-accent); letter-spacing: 0; text-transform: none; }
  .pick-side { display: flex; flex-direction: column; align-items: flex-end; gap: .3rem; flex: none; }
  .pick-side strong { font-size: .9375rem; font-variant-numeric: tabular-nums; }
  .pin { min-height: 32px; padding: 0 .55rem; font-size: .75rem; font-weight: 600; color: var(--color-muted); }
  .pin[aria-pressed='true'] { color: var(--color-accent); }
  .total { padding: .9rem 1rem 1rem; }
  .total > p:first-child { display: flex; align-items: baseline; justify-content: space-between; gap: .75rem; margin: 0; font-size: .8125rem; font-weight: 600; color: var(--color-muted); }
  .total > p:first-child strong { font: 700 2rem/1 var(--font-display); color: var(--color-accent); font-variant-numeric: tabular-nums; }
  .meter { height: 6px; margin-top: .6rem; background: var(--color-photo); border-radius: 3px; overflow: hidden; }
  .meter span { display: block; height: 100%; background: var(--color-accent); }
  .meter.over span { background: repeating-linear-gradient(135deg, var(--color-accent) 0 6px, color-mix(in srgb, var(--color-accent) 60%, var(--color-ink)) 6px 12px); }
  .over-budget { margin: .75rem 1rem 0; padding: .6rem .8rem; border-left: 3px solid var(--color-accent); background: var(--color-paper); font-size: .8125rem; line-height: 1.5; }
  .part { display: block; font-size: .75rem; font-weight: 400; color: var(--color-muted); }
  .primary-control { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; margin-bottom: .6rem; font-size: .8125rem; font-weight: 600; }
  .budget-line { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .25rem 1rem; margin: .35rem 0 0; font-size: .75rem; color: var(--color-muted); }
  .primary { display: flex; align-items: center; justify-content: center; min-height: 44px; margin-top: .85rem; padding: 0 1rem; background: var(--color-accent); color: var(--color-paper); border-radius: 3px; font-size: .875rem; font-weight: 700; text-decoration: none; }
  .primary:hover { color: var(--color-paper); background: color-mix(in srgb, var(--color-accent) 88%, var(--color-ink)); }
  .compare-parts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; }
  .text-button { min-height: 36px; padding: 0 .25rem; border: 0; background: transparent; font-size: .8125rem; color: var(--color-accent); text-decoration: underline; text-underline-offset: .2em; }
  .total .text-button { margin-top: .4rem; }
  .checks { margin: 0 1rem; border-top: 1px solid var(--color-rule); font-size: .8125rem; }
  .checks summary { display: flex; align-items: center; min-height: 40px; font-weight: 600; cursor: pointer; }
  .checks ul { margin: 0 0 .5rem; padding-left: 1.1rem; color: var(--color-muted); }
  .checks li + li { margin-top: .25rem; }
  .dropped { margin: .75rem 1rem 0; padding: .6rem .8rem; border-left: 3px solid var(--color-accent); background: var(--color-paper); font-size: .8125rem; }
  .dropped ul { margin: .3rem 0 0; padding-left: 1rem; }
  .dropped small { color: var(--color-muted); }
  .dropped .text-button { min-height: 0; padding: 0; }
  .reference { padding: .9rem 1rem 0; }
  .reference h3 { margin: .15rem 0 .25rem; font: 700 1.5rem/1.05 var(--font-display); text-transform: uppercase; letter-spacing: .01em; }
  .reference .why { -webkit-line-clamp: unset; line-clamp: unset; display: block; font-size: .8125rem; }
  .reference .picks { margin-top: .5rem; border-top: 1px solid var(--color-rule); }
  .reference .pick { padding-inline: 0; }
  .reference-total { display: flex; align-items: baseline; justify-content: space-between; gap: .75rem; margin: .6rem 0 0; font-size: .8125rem; font-weight: 600; color: var(--color-muted); }
  .reference-total strong { font: 700 1.625rem/1 var(--font-display); color: var(--color-accent); }
  .note { margin: .5rem 0 0; font-size: .75rem; line-height: 1.5; color: var(--color-muted); }
  #panel-curated > .note, #panel-curated > .empty { padding-inline: 1rem; }
  .share { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; margin-top: .75rem; padding: .75rem 1rem 1rem; border-top: 1px solid var(--color-rule); }
  .share > button:first-child { min-height: 40px; padding: 0 .9rem; font-size: .8125rem; font-weight: 600; }
  .share .note { flex-basis: 100%; margin: 0; }
  .share .note:empty { display: none; }
  .share input { flex-basis: 100%; padding: .5rem; font-size: .8125rem; }
  .setup-bar { display: none; }

  @media (max-width: 1000px) {
    .setup { position: static; }
  }
  @media (max-width: 640px) {
    .wizard { padding-bottom: 4.5rem; }
    .row { padding: .9rem 1rem; }
    .label { flex-basis: 100%; display: flex; align-items: baseline; gap: .5rem; padding: 0; }
    .label span { display: inline; }
    .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .tile { flex-direction: row; justify-content: flex-start; gap: .5rem; min-height: 48px; padding: .4rem .6rem; text-align: left; }
    .toggles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .setup-bar { position: fixed; inset: auto 0 0; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .75rem 1rem calc(.75rem + env(safe-area-inset-bottom)); background: var(--color-surface); border-top: 1px solid var(--color-rule); box-shadow: 0 -6px 16px color-mix(in srgb, var(--color-ink) 10%, transparent); color: var(--color-ink); text-decoration: none; }
    .setup-bar.hidden { display: none; }
    .setup-bar strong { display: block; font: 700 1.625rem/1 var(--font-display); color: var(--color-accent); }
    .setup-bar small { font-size: .75rem; color: var(--color-muted); }
    .setup-bar .go { display: inline-flex; align-items: center; min-height: 44px; padding: 0 1.1rem; background: var(--color-accent); color: var(--color-paper); border-radius: 3px; font-size: .875rem; font-weight: 700; }
  }
</style>
