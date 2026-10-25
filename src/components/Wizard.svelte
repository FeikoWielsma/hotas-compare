<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';
  import HardwareIcon from './HardwareIcon.svelte';
  import type { CatalogItem } from '../lib/catalog';
  import { detailHref, productImageSrc, useCases } from '../lib/catalog-ui';
  import { regionStore, isRegion } from '../lib/stores/region.svelte';
  import { MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  import { budgetStops, budgetTier, defaultPieces, deserializePicks, deserializeWizardState, matchCuratedSetups, nearestBudgetStop, normalizeWizardAnswers, picksOf, recommendLoadout, serializeWizardState, PIECES } from '../lib/wizard';
  import type { WizardAnswers, WizardLoadout, WizardPick, WizardPiece, WizardSetup } from '../lib/wizard';
  import type { Region, UseCase } from '../lib/schema';

  let { items, setups }: { items: CatalogItem[]; setups: WizardSetup[] } = $props();
  let answers = $state<WizardAnswers>(normalizeWizardAnswers());
  let step = $state(0);
  let visited = $state(0);
  let ready = $state(false);
  let shareStatus = $state('');
  let shareFallback = $state('');
  let heading: HTMLHeadingElement;
  let budgetSlider = $state<HTMLInputElement>();
  /** Picks currently on screen; kept across live edits while they still fit. */
  let picks = $state<WizardPick[]>([]);
  let loadout = $state<WizardLoadout | null>(null);
  let curated = $state<ReturnType<typeof matchCuratedSetups>>([]);
  let updating = $state(false);
  let edited = $state(false);
  let liveStatus = $state('');
  const LIVE_DELAY = 300;
  const steps = ['Flying style', 'Controls', 'Budget', 'Your space', 'Recommendations'];
  const labels: Record<WizardPiece, string> = { stick: 'Primary stick', second_stick: 'Secondary stick', throttle: 'Throttle', pedals: 'Rudder pedals', yoke: 'Flight yoke', quadrant: 'Throttle quadrant' };
  const aircraftIcons: Record<UseCase, string> = { modern_jet: 'jet', space_hosas: 'hosas', space_hotas: 'space', heli: 'heli', ga: 'ga', airliner: 'airliner', ww2: 'warbird' };
  const pieceIcons: Record<WizardPiece, string> = { stick: 'stick', second_stick: 'grip', throttle: 'throttle', pedals: 'pedals', yoke: 'yoke', quadrant: 'quadrant' };
  const mountIcons: Record<string, string> = { desk: 'desk', clamp: 'clamp', chair_pit: 'cockpit' };
  const descriptions: Record<UseCase, string> = {
    modern_jet: 'Precision, avionics and combat systems.', space_hosas: 'Two sticks. Six degrees of freedom.',
    space_hotas: 'Classic throttle control beyond the atmosphere.', heli: 'Cyclic control and anti-torque precision.',
    ga: 'From the traffic pattern to cross-country.', airliner: 'Multi-engine control for the flight deck.', ww2: 'Warbird handling and taildragger authority.',
  };
  const sims = [{ id: 'dcs', label: 'DCS World' }, { id: 'star_citizen', label: 'Star Citizen' }, { id: 'msfs', label: 'Microsoft Flight Simulator' }, { id: 'elite', label: 'Elite Dangerous' }, { id: 'il2', label: 'IL-2 Sturmovik' }, { id: 'xplane', label: 'X-Plane' }];
  const normalized = $derived(normalizeWizardAnswers(answers));
  const validBudget = $derived(Number.isFinite(answers.budgetMax) && answers.budgetMax > 0 && answers.budgetMax <= 100000);
  const canContinue = $derived(step === 1 ? answers.piecesNeeded.length > 0 : step === 2 ? validBudget : step === 3 ? validBudget && answers.piecesNeeded.length > 0 : true);
  const stops = $derived(budgetStops(regionStore.currency));
  const tierLabels = { budget: 'Entry level', mid: 'Mid range', high_end: 'High end', enthusiast: 'Enthusiast' } as const;
  const mounts = [{ key: 'desk', label: 'Desktop flat base' }, { key: 'clamp', label: 'Desk clamp mounts' }, { key: 'chair_pit', label: 'Chair / sim cockpit' }] as const;
  const compareIds = $derived([...new Set(loadout?.items.map((item) => item.id) ?? [])]);
  function money(amount: number) { return new Intl.NumberFormat('en', { style: 'currency', currency: regionStore.currency, maximumFractionDigits: 2 }).format(amount); }
  /** Budget figures are whole amounts; item prices keep cents. */
  function budgetMoney(amount: number) { return new Intl.NumberFormat('en', { style: 'currency', currency: regionStore.currency, maximumFractionDigits: 0 }).format(amount); }
  function chooseDiscipline(useCase: UseCase) {
    if (answers.useCase !== useCase) answers = normalizeWizardAnswers({ ...answers, useCase, piecesNeeded: defaultPieces(useCase) });
  }
  function togglePiece(piece: WizardPiece) {
    answers = normalizeWizardAnswers({ ...answers, ...(piece === 'pedals' ? { hasExistingPedals: false } : {}), piecesNeeded: answers.piecesNeeded.includes(piece) ? answers.piecesNeeded.filter((p) => p !== piece) : [...answers.piecesNeeded, piece] });
  }
  function recompute(next: WizardAnswers, region: Region) {
    const result = recommendLoadout(items, next, region, { keep: picks });
    loadout = result;
    curated = matchCuratedSetups(setups, items, next, region);
    // An infeasible edit keeps the old picks, so undoing it restores the same setup.
    if (result.complete) picks = picksOf(result);
    return result;
  }
  /** Recommendations follow the live settings, debounced so a slider drag recomputes once it settles. */
  $effect(() => {
    if (step !== 4 || !validBudget) { updating = false; return; }
    const next = normalized;
    const region = regionStore.region;
    if (!untrack(() => loadout)) { untrack(() => recompute(next, region)); return; }
    updating = true;
    const timer = setTimeout(() => {
      const result = recompute(next, region);
      updating = false; edited = true;
      liveStatus = result.complete ? `Recommendations updated · ${money(result.totalPrice)}${result.dropped.length ? ` · ${result.dropped.length} earlier pick${result.dropped.length === 1 ? '' : 's'} replaced` : ''}` : 'No complete setup fits these settings.';
    }, LIVE_DELAY);
    return () => clearTimeout(timer);
  });
  function findBestMatch() {
    picks = []; edited = false;
    const result = recompute(normalized, regionStore.region);
    liveStatus = result.complete ? `Best match for these settings · ${money(result.totalPrice)}` : 'No complete setup fits these settings.';
  }
  function setBudgetStop(index: number) { answers.budgetMax = stops[index]; }
  /** On narrow screens the settings collapse to a summary bar above the results. */
  let settingsOpen = $state(false);
  async function focusBudget() { settingsOpen = true; await tick(); budgetSlider?.focus(); }
  async function goTo(next: number) {
    if (next > step && !canContinue) return;
    if (next === 4 && step !== 4) { loadout = null; liveStatus = ''; }
    step = next; visited = Math.max(visited, next); shareStatus = '';
    await tick(); heading?.focus();
  }
  onMount(() => {
    regionStore.init();
    const restore = () => {
      const params = new URLSearchParams(location.search);
      if (isRegion(params.get('region'))) regionStore.setRegion(params.get('region') as 'EU' | 'UK' | 'US');
      answers = deserializeWizardState(params);
      picks = deserializePicks(params.get('picks'));
      loadout = null; edited = false; liveStatus = '';
      step = params.has('useCase') && answers.piecesNeeded.length > 0 ? 4 : 0;
      visited = step;
    };
    restore(); ready = true;
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  });
  $effect(() => {
    if (!ready || !validBudget) return;
    const params = new URLSearchParams(serializeWizardState(normalized, step === 4 ? picks : []));
    params.set('region', regionStore.region);
    history.replaceState(history.state, '', `${location.pathname}?${params}${location.hash}`);
  });
  async function copyShareLink() {
    if (updating && validBudget) { recompute(normalized, regionStore.region); updating = false; }
    const url = new URL('/wizard', location.origin);
    url.search = serializeWizardState(normalized, picks);
    url.searchParams.set('region', regionStore.region);
    try { await navigator.clipboard.writeText(url.href); shareStatus = 'Share link copied.'; shareFallback = ''; }
    catch { shareStatus = 'Copy the link below.'; shareFallback = url.href; }
  }
</script>

<div class="wizard">
  <nav class="stepper" aria-label="Wizard steps">
    {#each steps as label, index}
      <button class:active={step === index} class:done={index < step} disabled={index > visited || (index > step && (!validBudget || answers.piecesNeeded.length === 0))} aria-current={step === index ? 'step' : undefined} onclick={() => goTo(index)}>
        <span class="number">{String(index + 1).padStart(2, '0')}</span><span>{label}</span>
      </button>
    {/each}
  </nav>

  <div class="workspace">
    <section class="screen" aria-labelledby="step-heading">
      <div class="screen-bar"><span>Your setup guide</span><span>{step === 4 ? 'Recommendations ready' : `Step ${step + 1} of 5`}</span></div>
      <div class="screen-content">
        <p class="eyebrow">{step === 4 ? 'Made for your kind of flying' : 'A little about your setup'}</p>
        <h2 id="step-heading" bind:this={heading} tabindex="-1">{['What do you fly?', 'Which controls do you need?', 'What’s your budget?', 'Make room for your setup.', 'Your next setup.'][step]}</h2>
        {#if step === 0}
          <p class="intro">Choose your primary flying style. We’ll tailor the controls and explain every recommendation.</p>
          <div class="choice-grid">
            {#each useCases as discipline}
              <button class="choice" class:chosen={answers.useCase === discipline.key} aria-pressed={answers.useCase === discipline.key} onclick={() => chooseDiscipline(discipline.key)}>
                <span class="choice-art"><HardwareIcon name={aircraftIcons[discipline.key]} size={38} /></span><span class="choice-top"><strong>{discipline.label === 'WWII' ? 'Warbird WWII' : discipline.label}</strong><span aria-hidden="true">{answers.useCase === discipline.key ? '◉' : '○'}</span></span>
                <span class="description">{descriptions[discipline.key]}</span>
              </button>
            {/each}
          </div>
          <label class="field" for="sim">Your simulator <span>Optional</span></label>
          <select id="sim" bind:value={answers.targetSim}><option value="">Any simulation</option>{#each sims as sim}<option value={sim.id}>{sim.label}</option>{/each}{#if answers.targetSim && !sims.some((sim) => sim.id === answers.targetSim)}<option value={answers.targetSim}>{answers.targetSim}</option>{/if}</select>
          <p class="hint">Recommendations use flying style and hardware specifications; the sim choice is saved with your setup.</p>
        {:else if step === 1}
          <p class="intro">Select only the controls you need to buy. Leave out equipment you already own.</p>
          <div class="choice-grid">
            {#each PIECES as piece}
              <button class="choice" class:chosen={answers.piecesNeeded.includes(piece)} aria-pressed={answers.piecesNeeded.includes(piece)} onclick={() => togglePiece(piece)}><span class="choice-art"><HardwareIcon name={pieceIcons[piece]} size={38} /></span><span class="choice-top"><strong>{labels[piece]}</strong><span aria-hidden="true">{answers.piecesNeeded.includes(piece) ? '☑' : '□'}</span></span><span class="description">{piece === 'second_stick' ? 'Left-hand strafe control for HOSAS' : piece === 'pedals' ? 'Dedicated yaw and optional toe brakes' : 'Add to your recommended package'}</span></button>
            {/each}
          </div>
          {#if !answers.piecesNeeded.length}<p class="notice">Choose at least one control to continue.</p>{/if}
          {#if normalized.needsTwist}<p class="notice">Without pedals, you’ll need a stick with twist for yaw control. Tell us about pedals you already own in the Your space step.</p>{/if}
        {:else if step === 2}
          <p class="intro">Your total hardware budget in {regionStore.currency}. Change region in the navigation to use local prices.</p>
          <label class="field" for="budget">Total budget · {regionStore.currency}</label>
          <div class="budget-input"><span>{regionStore.currency}</span><input id="budget" type="number" min="1" max="100000" step="any" bind:value={answers.budgetMax} aria-invalid={!validBudget} /></div>
          <div class="presets">{#each [150, 350, 750, 1500] as preset}<button class:chosen={answers.budgetMax === preset} onclick={() => answers.budgetMax = preset}>{money(preset)}{preset === 1500 ? '+' : ''}</button>{/each}</div>
          {#if !validBudget}<p class="notice">Enter a budget between 1 and 100,000.</p>{/if}
          <p class="hint">Use the field for budgets above 1,500. Totals use listed regional prices; shipping, import charges and separate mounts are excluded. Tax treatment follows each store’s listing.</p>
        {:else if step === 3}
          <p class="intro">Pick where your controls will live. Allow room for mounts and check that they fit your desk or cockpit.</p>
          <div class="mounts">
            {#each [{ key: 'desk', title: 'Desktop flat base', detail: 'Controls sit on the desk. Check base plates and stability.' }, { key: 'clamp', title: 'Desk clamp mounts', detail: 'Controls sit at desk height or below. Allow for brackets.' }, { key: 'chair_pit', title: 'Chair / sim cockpit', detail: 'A dedicated flying position. Check plates and bolt patterns.' }] as mount}
              <button class="choice" class:chosen={answers.mountType === mount.key} aria-pressed={answers.mountType === mount.key} onclick={() => answers.mountType = mount.key as WizardAnswers['mountType']}><span class="choice-art"><HardwareIcon name={mountIcons[mount.key]} size={38} /></span><span class="choice-top"><strong>{mount.title}</strong><span aria-hidden="true">{answers.mountType === mount.key ? '◉' : '○'}</span></span><span class="description">{mount.detail}</span></button>
            {/each}
          </div>
          <label class="pedal-toggle"><input type="checkbox" checked={answers.piecesNeeded.includes('pedals')} onchange={() => togglePiece('pedals')} /><span><strong>Include rudder pedals in this purchase</strong><small>Dedicated yaw control; their price is included in the budget.</small></span></label>
          <label class="pedal-toggle"><input type="checkbox" checked={answers.hasExistingPedals ?? false} onchange={(event) => answers = normalizeWizardAnswers({ ...answers, hasExistingPedals: event.currentTarget.checked, piecesNeeded: event.currentTarget.checked ? answers.piecesNeeded.filter((piece) => piece !== 'pedals') : answers.piecesNeeded })} /><span><strong>I already own pedals</strong><small>Keep their yaw control without spending this budget on another set.</small></span></label>
          <p class="notice">{normalized.needsTwist ? 'No pedals selected → a stick must provide twist yaw.' : answers.piecesNeeded.includes('pedals') || answers.hasExistingPedals ? 'Pedal yaw available → a twist axis is optional.' : 'Yoke-only configurations may need existing pedals or another yaw input.'}</p>
          {#if !answers.piecesNeeded.length}<p class="notice">No new controls selected. Return to Controls to choose the equipment you want to buy.</p>{/if}
        {:else}
          <p class="intro">Start with a curated reference setup, then explore a custom recommendation based on the controls you chose and your regional budget.</p>
          <div class="result-title"><h3>Curated reference setup</h3><button class="text-button" onclick={focusBudget}>Adjust budget</button></div>
          {#each curated as setup}
            <article class="reference">
              <p class="eyebrow">{#if setup.data.pick}<strong class="pick">Our pick</strong> · {/if}{setup.data.budget_tier.replaceAll('_', ' ')} / {regionStore.region}</p><h3>{setup.data.title}</h3><p>{setup.data.description}</p><p class="reason">{setup.data.reasoning}</p>
              <ul>{#each setup.included as included}<li>{#if included.item}{@const photo = productImageSrc(included.item.images[0]?.file)}<span class="gear">{#if photo}<img src={photo} alt="" />{/if}<span><a href={detailHref(included.item)}>{included.item.name}</a><small>{included.role}</small></span></span>{:else}{included.id} (not in catalog)<small>{included.role}</small>{/if}</li>{/each}</ul>
              <p class="reference-price">{setup.totalPrice === null ? 'Regional total unavailable' : money(setup.totalPrice)} <span>{setup.totalPrice === null ? '· One or more prices missing' : setup.withinBudget ? '· Listed items within budget' : '· Above selected budget'}</span></p>
              {#each setup.warnings as warning}<p class="notice">{warning}</p>{/each}
              <p class="hint">Reference setups may include different controls from your selection. Check completeness, yaw control and mount requirements before buying.</p>
              {#if setup.data.notes}<p class="hint">{setup.data.notes}</p>{/if}
            </article>
          {:else}
            <div class="empty">No curated reference is published for this flying style and budget tier yet. Your custom match is below.</div>
          {/each}
          <div class="result-title"><h3>Your custom recommendation</h3><span>Based on your control selection</span></div>
          {#if loadout?.dropped.length}
            <div class="notice dropped" role="note"><strong>Earlier picks that no longer fit</strong>
              <ul>{#each loadout.dropped as pick}<li><span>{pick.items.map((item) => item.name).join(' + ') || pick.ids.join(' + ')}</span> <small>{pick.reason}</small></li>{/each}</ul>
            </div>
          {/if}
          {#if loadout}
            {#if loadout.complete}
              <p class="success">All selected controls fit within your regional budget.</p>
              {#each loadout.pieces as piece, index}
                <article class="piece" class:kept={edited && piece.kept}><div class="piece-heading"><span class="eyebrow">{String(index + 1).padStart(2, '0')} / {piece.roles.map((role) => labels[role]).join(' + ')}{#if edited && piece.kept}<span class="kept-badge">Kept</span>{/if}</span><strong>{money(piece.price)}</strong></div>
                  {#each piece.items as item}{@const photo = productImageSrc(item.images[0]?.file)}<div class="piece-product">{#if photo}<img src={photo} alt="" />{/if}<h3><a href={detailHref(item)}>{item.name} ↗</a></h3></div>{/each}
                  <ul class="pills">{#each piece.explanations as explanation}<li>{explanation}</li>{/each}</ul>
                </article>
              {/each}
              <dl class="totals"><div><dt>Setup total</dt><dd>{money(loadout.totalPrice)}</dd></div><div><dt>Estimated logical inputs</dt><dd>{loadout.totalLogicalButtons}</dd></div><div><dt>Analog axes</dt><dd>{loadout.totalAxes}</dd></div></dl>
              <p class="hint">Listed {regionStore.region} prices; tax treatment varies by store. Shipping and separate mounts excluded. Two copies of the same ambidextrous stick count twice in totals and once in compare.</p>
              {#if compareIds.length <= MAX_COMPARE_ITEMS}<a class="primary action-link" href={`/compare?${new URLSearchParams({ items: compareIds.join(',') })}`}>Compare this setup ↗</a>{:else}<p class="notice">This package has {compareIds.length} distinct products. Compare supports four at a time:</p><div class="presets">{#each Array.from({ length: Math.ceil(compareIds.length / MAX_COMPARE_ITEMS) }, (_, index) => index) as batch}<a href={`/compare?${new URLSearchParams({ items: compareIds.slice(batch * MAX_COMPARE_ITEMS, (batch + 1) * MAX_COMPARE_ITEMS).join(',') })}`}>Compare setup · part {batch + 1} ↗</a>{/each}</div>{/if}
            {/if}
            {#each loadout.warnings as warning}<p class="notice">{warning}</p>{/each}
          {/if}
          <div class="result-actions"><button class="primary" onclick={copyShareLink}>Copy share link</button><button onclick={() => goTo(0)}>Walk through the steps again</button></div>
          <p role="status" class="hint">{shareStatus}</p>{#if shareFallback}<label class="field" for="share-url">Share URL</label><input id="share-url" readonly value={shareFallback} onclick={(event) => event.currentTarget.select()} />{/if}
        {/if}
      </div>
      {#if step < 4}<div class="screen-footer"><button disabled={step === 0} onclick={() => goTo(step - 1)}>← Back</button><span>{String(step + 1).padStart(2, '0')} / 05</span><button class="primary" disabled={!canContinue} onclick={() => goTo(step + 1)}>{step === 3 ? 'See recommendations' : 'Continue'} →</button></div>{/if}
    </section>
    {#if step === 4}
      <aside class="manifest settings" class:open={settingsOpen} aria-labelledby="settings-heading">
        <button class="settings-toggle" aria-expanded={settingsOpen} aria-controls="settings-body" onclick={() => settingsOpen = !settingsOpen}>
          <span><strong>Adjust your setup</strong><small>{validBudget ? budgetMoney(answers.budgetMax) : 'No budget'} · {useCases.find((useCase) => useCase.key === answers.useCase)?.label} · {answers.piecesNeeded.length} control{answers.piecesNeeded.length === 1 ? '' : 's'}</small></span><span aria-hidden="true">{settingsOpen ? '▴' : '▾'}</span>
        </button>
        <div id="settings-body" class="settings-body">
        <p class="eyebrow">Live settings</p>
        <h3 id="settings-heading">Adjust your setup</h3>
        <p class="setting-note">Results update as you change these. Picks that still fit are kept.</p>
        <div class="setting">
          <label for="budget-slider" class="setting-label">Total budget <span>{regionStore.currency}</span></label>
          <p class="budget-readout"><strong>{validBudget ? budgetMoney(answers.budgetMax) : 'Set a budget'}</strong>{#if validBudget}<span>{tierLabels[budgetTier(answers.budgetMax)]}</span>{/if}</p>
          <input id="budget-slider" class="slider" type="range" min="0" max={stops.length - 1} step="1" bind:this={budgetSlider}
            value={nearestBudgetStop(stops, validBudget ? answers.budgetMax : stops[0])} aria-valuetext={validBudget ? `${budgetMoney(answers.budgetMax)}, ${tierLabels[budgetTier(answers.budgetMax)]}` : 'No budget set'}
            oninput={(event) => setBudgetStop(Number(event.currentTarget.value))} />
          <div class="slider-scale" aria-hidden="true"><span>{budgetMoney(stops[0])}</span><span>{budgetMoney(stops[stops.length - 1])}+</span></div>
          <label class="exact" for="budget-exact">Exact amount<input id="budget-exact" type="number" min="1" max="100000" step="any" bind:value={answers.budgetMax} aria-invalid={!validBudget} /></label>
          {#if !validBudget}<p class="notice">Enter a budget between 1 and 100,000.</p>{/if}
        </div>
        <div class="setting">
          <label for="setting-style" class="setting-label">Flying style</label>
          <select id="setting-style" value={answers.useCase} onchange={(event) => chooseDiscipline(event.currentTarget.value as UseCase)}>{#each useCases as discipline}<option value={discipline.key}>{discipline.label === 'WWII' ? 'Warbird WWII' : discipline.label}</option>{/each}</select>
          <p class="setting-note">Resets controls to the usual set for that style.</p>
        </div>
        <fieldset class="setting">
          <legend class="setting-label">Controls to buy</legend>
          <div class="piece-toggles">{#each PIECES as piece}<label><input type="checkbox" checked={answers.piecesNeeded.includes(piece)} onchange={() => togglePiece(piece)} />{labels[piece]}</label>{/each}</div>
          <label class="owned"><input type="checkbox" checked={answers.hasExistingPedals ?? false} onchange={(event) => answers = normalizeWizardAnswers({ ...answers, hasExistingPedals: event.currentTarget.checked, piecesNeeded: event.currentTarget.checked ? answers.piecesNeeded.filter((piece) => piece !== 'pedals') : answers.piecesNeeded })} />I already own pedals</label>
          {#if !answers.piecesNeeded.length}<p class="notice">Choose at least one control.</p>{:else if normalized.needsTwist}<p class="setting-note">No pedals, so the stick must provide twist yaw.</p>{/if}
        </fieldset>
        <div class="setting">
          <label for="setting-mount" class="setting-label">Your space</label>
          <select id="setting-mount" bind:value={answers.mountType}>{#each mounts as mount}<option value={mount.key}>{mount.label}</option>{/each}</select>
        </div>
        <button class="reset" onclick={findBestMatch} disabled={updating || !validBudget || !answers.piecesNeeded.length}>Find the best match again</button>
        <p class="setting-note">Replaces kept picks with the top match for these settings.</p>
        </div>
        <p class="live-status" role="status" aria-live="polite">{updating ? 'Updating recommendations…' : liveStatus}</p>
      </aside>
    {:else}
    <aside class="manifest" aria-label="Your setup summary"><p class="eyebrow">Your setup at a glance</p><div class="summary-art" aria-hidden="true"><HardwareIcon name={aircraftIcons[answers.useCase]} size={58} /></div><h3>{useCases.find((useCase) => useCase.key === answers.useCase)?.label}</h3><p class="hint">{answers.targetSim ? sims.find((sim) => sim.id === answers.targetSim)?.label ?? answers.targetSim : 'Simulation independent'}</p><dl><div><dt>Controls to buy</dt><dd>{answers.piecesNeeded.map((piece) => labels[piece]).join(' / ') || 'None selected'}</dd></div><div><dt>Your budget</dt><dd>{validBudget ? money(answers.budgetMax) : 'Set a budget'} <small>{regionStore.region}</small></dd></div><div><dt>Your space</dt><dd>{answers.mountType === 'desk' ? 'Desktop' : answers.mountType === 'clamp' ? 'Desk mounts' : 'Chair / cockpit'}</dd></div><div><dt>Yaw control</dt><dd>{answers.hasExistingPedals ? 'Existing pedals' : answers.piecesNeeded.includes('pedals') ? 'Dedicated pedals' : normalized.needsTwist ? 'Stick twist required' : 'Existing / external input'}</dd></div></dl><p class="manifest-note">Recommendations explained.<br />Prices for your region.<br />A setup that fits you.</p></aside>
    {/if}
  </div>
</div>

<style>
  .wizard { margin-block: 2rem 3rem; color: var(--color-ink); font: 1rem/1.6 var(--font-sans); }
  button, select, input, .presets a { font: inherit; color: var(--color-ink); background: var(--color-surface); border: 1px solid var(--color-rule); border-radius: 3px; }
  button, .presets a { cursor: pointer; padding: .75rem 1rem; min-height: 44px; }
  button:hover, .presets a:hover { border-color: var(--color-accent); }
  button:disabled { cursor: not-allowed; opacity: .55; }
  button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 3px; }
  button.chosen, .choice.chosen { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 7%, var(--color-surface)); box-shadow: inset 3px 0 var(--color-accent); }
  .primary { background: var(--color-accent); color: var(--color-paper); border-color: var(--color-accent); font-weight: 700; }
  .primary:hover { background: color-mix(in srgb, var(--color-accent) 88%, var(--color-ink)); }
  .stepper { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); margin-bottom: 1.5rem; border-block: 1px solid var(--color-rule); }
  .stepper button { display: flex; align-items: center; gap: .65rem; text-align: left; border: 0; border-bottom: 3px solid transparent; border-radius: 0; padding: 1rem .8rem; font-size: .875rem; background: transparent; overflow-wrap: anywhere; }
  .number { color: var(--color-muted); font-size: .875rem; }
  .stepper .active { border-bottom-color: var(--color-accent); color: var(--color-accent); font-weight: 700; }
  .active .number, .done .number { color: var(--color-accent); }
  .workspace { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 1.5rem; align-items: start; }
  .screen, .manifest { min-width: 0; background: var(--color-surface); border: 1px solid var(--color-rule); border-radius: 3px; }
  .screen-bar { display: flex; justify-content: space-between; flex-wrap: wrap; gap: .5rem 1rem; padding: .85rem 2rem; border-bottom: 1px solid var(--color-rule); font-size: .8125rem; color: var(--color-muted); }
  .screen-content { padding: 2rem; min-height: 510px; }
  .eyebrow { color: var(--color-accent); font-size: .8125rem; font-weight: 600; margin: 0 0 .6rem; }
  h2 { font: 600 clamp(2rem, 4vw, 3rem)/1.05 var(--font-display); text-transform: uppercase; margin: .5rem 0 1rem; letter-spacing: .01em; }
  h2:focus { outline: none; }
  .intro { color: var(--color-muted); font-size: 1rem; margin-bottom: 1.75rem; max-width: 65ch; }
  .choice-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .85rem; }
  .choice { padding: 1.2rem; text-align: left; min-width: 0; }
  .choice-art { display: flex; align-items: center; margin-bottom: 1rem; color: var(--color-ink); }
  .chosen .choice-art, .choice:hover .choice-art { color: var(--color-accent); }
  .choice-top { display: flex; justify-content: space-between; align-items: start; gap: .75rem; }
  .choice-top strong { font-size: 1rem; font-weight: 700; }
  .chosen .choice-top > span { color: var(--color-accent); }
  .description { display: block; color: var(--color-muted); font-size: .875rem; margin-top: .5rem; line-height: 1.6; }
  .field { display: block; margin: 1.75rem 0 .6rem; font-size: .9375rem; font-weight: 600; }
  .field span { font-size: .8125rem; color: var(--color-muted); margin-left: .5rem; font-weight: 400; }
  select, input:not([type='checkbox']) { padding: .9rem; width: 100%; min-width: 0; }
  .hint { font-size: .875rem; color: var(--color-muted); line-height: 1.7; }
  .notice { border-left: 3px solid var(--color-accent); padding: .85rem 1rem; background: var(--color-paper); font-size: .875rem; line-height: 1.65; margin-block: 1rem; }
  .budget-input { display: flex; align-items: center; border: 1px solid var(--color-rule); border-bottom: 2px solid var(--color-accent); background: var(--color-paper); }
  .budget-input span { padding-left: 1rem; color: var(--color-accent); font-weight: 600; }
  .budget-input input { font-size: 2rem; border: 0; background: transparent; }
  .presets { display: flex; flex-wrap: wrap; gap: .6rem; margin-block: 1.25rem; }
  .presets button, .presets a { font-size: .875rem; text-decoration: none; }
  .mounts { display: grid; gap: .85rem; }
  .pedal-toggle { display: flex; gap: .8rem; padding: 1.2rem 0 .5rem; align-items: start; font-size: .9375rem; cursor: pointer; }
  input[type='checkbox'] { accent-color: var(--color-accent); width: 1.2rem; height: 1.2rem; flex: none; margin-top: .2rem; }
  .pedal-toggle small { display: block; font-size: .875rem; color: var(--color-muted); margin-top: .35rem; }
  .screen-footer { border-top: 1px solid var(--color-rule); padding: 1.25rem 2rem; display: flex; justify-content: space-between; align-items: center; gap: .75rem; }
  .screen-footer > span { font-size: .8125rem; color: var(--color-muted); white-space: nowrap; }
  .screen-footer button { font-size: .9375rem; }
  .manifest { padding: 1.5rem; border-top: 4px solid var(--color-accent); }
  .summary-art { margin: 1.25rem 0; padding: 1.5rem; display: grid; place-items: center; background: var(--color-photo); color: var(--color-ink); border: 6px solid var(--color-paper); outline: 1px solid var(--color-rule); }
  h3 { margin: .7rem 0; font: 600 1.125rem/1.4 var(--font-sans); }
  .manifest h3, .reference > h3, .result-title h3 { font: 600 1.75rem/1.1 var(--font-display); text-transform: uppercase; letter-spacing: .01em; }
  .manifest dl > div { border-top: 1px solid var(--color-rule); padding-block: .9rem; }
  dt { color: var(--color-muted); font-size: .8125rem; }
  dd { margin: .3rem 0 0; font-size: .9375rem; overflow-wrap: anywhere; }
  dd small { color: var(--color-accent); font-size: .8125rem; }
  .manifest-note { font-size: .875rem; line-height: 1.9; color: var(--color-muted); border-top: 1px solid var(--color-rule); padding-top: 1rem; }
  .result-title { display: flex; justify-content: space-between; flex-wrap: wrap; gap: .75rem; align-items: center; margin: 2rem 0 1rem; }
  .result-title h3 { margin: 0; }
  .result-title > span { font-size: .8125rem; color: var(--color-muted); }
  .text-button { padding: .4rem 0; font-size: .875rem; border: 0; color: var(--color-accent); background: transparent; text-decoration: underline; text-underline-offset: .2em; }
  .reference { padding: 1.5rem; border: 1px solid var(--color-rule); border-top: 3px solid var(--color-accent); background: var(--color-paper); }
  .reference p, .reference ul { font-size: .9375rem; }
  .reference .reason { color: var(--color-muted); line-height: 1.8; }
  .reference ul { padding-left: 0; list-style: none; }
  .reference li { margin: .85rem 0; }
  .gear, .piece-product { display: flex; align-items: center; gap: 1rem; min-width: 0; }
  .gear > span { min-width: 0; }
  .gear a, .piece h3 a { overflow-wrap: anywhere; }
  .gear img, .piece-product img { width: 76px; height: 76px; object-fit: contain; background: var(--color-photo); border: 4px solid var(--color-surface); flex: none; }
  .reference li small { display: block; color: var(--color-muted); margin-top: .25rem; font-size: .8125rem; }
  .reference-price { color: var(--color-accent); font-weight: 700; }
  .reference-price span { color: var(--color-muted); font-size: .875rem; font-weight: 400; }
  .empty { padding: 1.25rem; border: 1px dashed var(--color-rule); font-size: .9375rem; color: var(--color-muted); }
  .piece { border: 1px solid var(--color-rule); padding: 1.25rem; margin-bottom: 1rem; background: var(--color-surface); }
  .piece-heading { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: .5rem 1rem; margin-bottom: .8rem; }
  .piece-heading .eyebrow { margin: 0; }
  .piece-heading > strong { font-size: 1rem; white-space: nowrap; }
  .piece h3 { font-size: 1rem; margin: 0; }
  .piece-product + .piece-product { margin-top: .75rem; }
  .piece h3 a { text-decoration: none; }
  .piece h3 a:hover { color: var(--color-accent); text-decoration: underline; }
  .pills { display: flex; flex-wrap: wrap; list-style: none; gap: .5rem; padding: 0; margin: 1rem 0 0; }
  .pills li { background: var(--color-paper); border: 1px solid var(--color-rule); border-radius: 2px; padding: .4rem .6rem; font-size: .8125rem; line-height: 1.6; color: var(--color-muted); }
  .success { color: var(--color-ink); padding: .9rem 1rem; background: var(--color-paper); border-left: 3px solid var(--color-accent); font-size: .9375rem; }
  .totals { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 1rem; padding-block: 1.25rem; border-block: 1px solid var(--color-rule); margin-block: 1.5rem; }
  .totals dd { font-size: 1.5rem; font-weight: 600; margin-top: .5rem; }
  .totals > div:first-child dd { color: var(--color-accent); }
  .action-link { display: inline-block; text-decoration: none; padding: .8rem 1rem; border-radius: 3px; font-size: .9375rem; }
  .result-actions { display: flex; gap: .75rem; margin-top: 1.5rem; flex-wrap: wrap; font-size: .9375rem; }
  .settings { position: sticky; top: 1rem; max-height: calc(100vh - 2rem); overflow-y: auto; }
  .settings h3 { margin: 0 0 .25rem; }
  .settings > .setting-note:first-of-type { margin-bottom: .75rem; }
  .setting { border: 0; border-top: 1px solid var(--color-rule); margin: 0; padding: 1rem 0; min-width: 0; }
  .setting-label { display: flex; justify-content: space-between; font-size: .875rem; font-weight: 600; padding: 0; margin-bottom: .5rem; }
  .setting-label span { color: var(--color-muted); font-weight: 400; }
  .setting select { padding: .6rem; }
  .setting-note { font-size: .8125rem; color: var(--color-muted); margin: .5rem 0 0; line-height: 1.5; }
  .budget-readout { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem; flex-wrap: wrap; margin: 0 0 .4rem; }
  .budget-readout strong { font-size: 1.5rem; color: var(--color-accent); }
  .budget-readout span { font-size: .8125rem; color: var(--color-muted); }
  .slider { width: 100%; padding: 0; border: 0; background: transparent; accent-color: var(--color-accent); min-height: 44px; cursor: pointer; }
  .slider-scale { display: flex; justify-content: space-between; font-size: .75rem; color: var(--color-muted); margin-top: -.4rem; }
  .exact { display: flex; align-items: center; justify-content: space-between; gap: .75rem; font-size: .8125rem; color: var(--color-muted); margin-top: .75rem; }
  .settings .exact input { width: 8rem; padding: .45rem .6rem; }
  fieldset.setting legend { float: left; width: 100%; }
  .piece-toggles { display: grid; gap: .1rem; clear: both; }
  .piece-toggles label, .owned { display: flex; align-items: center; gap: .6rem; font-size: .875rem; min-height: 32px; cursor: pointer; }
  .piece-toggles input, .owned input { margin-top: 0; }
  .owned { border-top: 1px dashed var(--color-rule); margin-top: .4rem; padding-top: .4rem; }
  .live-status { font-size: .8125rem; color: var(--color-muted); min-height: 1.5em; margin: .5rem 0; }
  .reset { width: 100%; font-size: .875rem; margin-top: .5rem; }
  .settings-toggle { display: none; }
  .kept-badge { margin-left: .6rem; padding: .05rem .4rem; border: 1px solid var(--color-accent); border-radius: 2px; font-size: .75rem; font-weight: 600; }
  .dropped strong { display: block; }
  .dropped ul { margin: .4rem 0 0; padding-left: 1.1rem; }
  .dropped li { margin-block: .25rem; }
  .dropped small { display: block; color: var(--color-muted); font-size: .8125rem; }
  @media (max-width: 1080px) {
    .workspace { grid-template-columns: minmax(0, 1fr) 240px; gap: 1rem; }
    .screen-content { padding: 1.5rem; }
    .stepper button { flex-direction: column; align-items: start; padding: .9rem .6rem; gap: .3rem; }
  }
  @media (max-width: 800px) {
    .workspace { grid-template-columns: minmax(0, 1fr); }
    .settings { order: -1; position: static; max-height: none; overflow: visible; padding-block: .75rem; }
    .settings-toggle { display: flex; width: 100%; justify-content: space-between; align-items: center; gap: 1rem; text-align: left; border: 0; padding: .25rem 0; background: transparent; }
    .settings-toggle strong, .settings-toggle small { display: block; }
    .settings-toggle small { color: var(--color-muted); font-size: .8125rem; }
    .settings:not(.open) .settings-body { display: none; }
    .settings.open .settings-body { margin-top: .75rem; }
    .settings-body > .eyebrow { display: none; }
    .settings-body > h3 { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
    .settings .live-status { margin-bottom: 0; }
    .settings .live-status:empty { display: none; }
    .settings .piece-toggles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .manifest dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 1.5rem; }
    .summary-art { width: 120px; padding: 1rem; }
    .screen-content { min-height: 400px; }
  }
  @media (max-width: 540px) {
    .stepper { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .stepper button { flex-direction: row; align-items: center; padding: .8rem .5rem; gap: .5rem; }
    .stepper button:last-child { grid-column: 1 / -1; }
    .choice-grid { grid-template-columns: 1fr; }
    .screen-content, .manifest { padding: 1.25rem; }
    .screen-bar { padding: .75rem 1.25rem; }
    .screen-footer { padding: 1rem; flex-wrap: wrap; }
    .screen-footer > span { display: none; }
    .screen-footer button { padding-inline: .75rem; font-size: .875rem; }
    .reference, .piece { padding: 1rem; }
    .gear img, .piece-product img { width: 60px; height: 60px; }
    .totals { grid-template-columns: 1fr 1fr; }
    .totals > div:first-child { grid-column: 1 / -1; }
    .manifest dl { grid-template-columns: 1fr; }
  }
  .pick { color: var(--color-accent); }
</style>
