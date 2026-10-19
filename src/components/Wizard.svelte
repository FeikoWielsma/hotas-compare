<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type { CatalogItem } from '../lib/catalog';
  import { detailHref, productImageSrc, useCases } from '../lib/catalog-ui';
  import { regionStore, isRegion } from '../lib/stores/region.svelte';
  import { MAX_COMPARE_ITEMS } from '../lib/stores/compare.svelte';
  import { defaultPieces, deserializeWizardState, matchCuratedSetups, normalizeWizardAnswers, recommendLoadout, serializeWizardState, PIECES } from '../lib/wizard';
  import type { WizardAnswers, WizardPiece, WizardSetup } from '../lib/wizard';
  import type { UseCase } from '../lib/schema';

  let { items, setups }: { items: CatalogItem[]; setups: WizardSetup[] } = $props();
  let answers = $state<WizardAnswers>(normalizeWizardAnswers());
  let step = $state(0);
  let visited = $state(0);
  let ready = $state(false);
  let shareStatus = $state('');
  let shareFallback = $state('');
  let heading: HTMLHeadingElement;
  const steps = ['Discipline', 'Controls', 'Budget', 'Ergonomics', 'Mission results'];
  const labels: Record<WizardPiece, string> = { stick: 'Primary stick', second_stick: 'Secondary stick', throttle: 'Throttle', pedals: 'Rudder pedals', yoke: 'Flight yoke', quadrant: 'Throttle quadrant' };
  const descriptions: Record<UseCase, string> = {
    modern_jet: 'Precision, avionics and combat systems.', space_hosas: 'Two sticks. Six degrees of freedom.',
    space_hotas: 'Classic throttle control beyond the atmosphere.', heli: 'Cyclic control and anti-torque precision.',
    ga: 'From the traffic pattern to cross-country.', airliner: 'Multi-engine control for the flight deck.', ww2: 'Warbird handling and taildragger authority.',
  };
  const sims = [{ id: 'dcs', label: 'DCS World' }, { id: 'star_citizen', label: 'Star Citizen' }, { id: 'msfs', label: 'Microsoft Flight Simulator' }, { id: 'elite', label: 'Elite Dangerous' }, { id: 'il2', label: 'IL-2 Sturmovik' }, { id: 'xplane', label: 'X-Plane' }];
  const normalized = $derived(normalizeWizardAnswers(answers));
  const validBudget = $derived(Number.isFinite(answers.budgetMax) && answers.budgetMax > 0 && answers.budgetMax <= 100000);
  const canContinue = $derived(step === 1 ? answers.piecesNeeded.length > 0 : step === 2 ? validBudget : step === 3 ? validBudget && answers.piecesNeeded.length > 0 : true);
  const curated = $derived(step === 4 ? matchCuratedSetups(setups, items, normalized, regionStore.region) : []);
  const loadout = $derived(step === 4 ? recommendLoadout(items, normalized, regionStore.region) : null);
  const compareIds = $derived([...new Set(loadout?.items.map((item) => item.id) ?? [])]);
  function money(amount: number) { return new Intl.NumberFormat('en', { style: 'currency', currency: regionStore.currency, maximumFractionDigits: 2 }).format(amount); }
  function chooseDiscipline(useCase: UseCase) {
    if (answers.useCase !== useCase) answers = normalizeWizardAnswers({ ...answers, useCase, piecesNeeded: defaultPieces(useCase) });
  }
  function togglePiece(piece: WizardPiece) {
    answers = normalizeWizardAnswers({ ...answers, ...(piece === 'pedals' ? { hasExistingPedals: false } : {}), piecesNeeded: answers.piecesNeeded.includes(piece) ? answers.piecesNeeded.filter((p) => p !== piece) : [...answers.piecesNeeded, piece] });
  }
  async function goTo(next: number) {
    if (next > step && !canContinue) return;
    step = next; visited = Math.max(visited, next); shareStatus = '';
    await tick(); heading?.focus();
  }
  onMount(() => {
    regionStore.init();
    const restore = () => {
      const params = new URLSearchParams(location.search);
      if (isRegion(params.get('region'))) regionStore.setRegion(params.get('region') as 'EU' | 'UK' | 'US');
      answers = deserializeWizardState(params);
      step = params.has('useCase') && answers.piecesNeeded.length > 0 ? 4 : 0;
      visited = step;
    };
    restore(); ready = true;
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  });
  $effect(() => {
    if (!ready || !validBudget) return;
    const params = new URLSearchParams(serializeWizardState(normalized));
    params.set('region', regionStore.region);
    history.replaceState(history.state, '', `${location.pathname}?${params}${location.hash}`);
  });
  async function copyShareLink() {
    const url = new URL('/wizard', location.origin);
    url.search = serializeWizardState(normalized);
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
      <div class="screen-bar"><span>CONFIGURATION / {String(step + 1).padStart(2, '0')}</span><span class="live">● {step === 4 ? 'MISSION READY' : 'AWAITING INPUT'}</span></div>
      <div class="screen-content">
        <p class="eyebrow">{step === 4 ? 'YOUR FLIGHT PLAN' : `STEP ${step + 1} OF 5`}</p>
        <h2 id="step-heading" bind:this={heading} tabindex="-1">{['What do you fly?', 'Build around your needs.', 'Set your mission budget.', 'Make room for your cockpit.', 'Your next cockpit.'][step]}</h2>
        {#if step === 0}
          <p class="intro">Choose your primary flying style. We’ll tailor the controls and explain every recommendation.</p>
          <div class="choice-grid">
            {#each useCases as discipline}
              <button class="choice" class:chosen={answers.useCase === discipline.key} aria-pressed={answers.useCase === discipline.key} onclick={() => chooseDiscipline(discipline.key)}>
                <span class="choice-top"><strong>{discipline.label === 'WWII' ? 'Warbird WWII' : discipline.label}</strong><span aria-hidden="true">{answers.useCase === discipline.key ? '◉' : '○'}</span></span>
                <span class="description">{descriptions[discipline.key]}</span>
              </button>
            {/each}
          </div>
          <label class="field" for="sim">Target simulation <span>OPTIONAL</span></label>
          <select id="sim" bind:value={answers.targetSim}><option value="">Any simulation</option>{#each sims as sim}<option value={sim.id}>{sim.label}</option>{/each}{#if answers.targetSim && !sims.some((sim) => sim.id === answers.targetSim)}<option value={answers.targetSim}>{answers.targetSim}</option>{/if}</select>
          <p class="hint">Recommendations use flying style and hardware specifications; the sim choice is saved with your flight plan.</p>
        {:else if step === 1}
          <p class="intro">Select only the controls you need to buy. Leave out equipment you already own.</p>
          <div class="choice-grid">
            {#each PIECES as piece}
              <button class="choice" class:chosen={answers.piecesNeeded.includes(piece)} aria-pressed={answers.piecesNeeded.includes(piece)} onclick={() => togglePiece(piece)}><span class="choice-top"><strong>{labels[piece]}</strong><span aria-hidden="true">{answers.piecesNeeded.includes(piece) ? '☑' : '□'}</span></span><span class="description">{piece === 'second_stick' ? 'Left-hand strafe control for HOSAS' : piece === 'pedals' ? 'Dedicated yaw and optional toe brakes' : 'Add to your recommended package'}</span></button>
            {/each}
          </div>
          {#if !answers.piecesNeeded.length}<p class="notice">Choose at least one control to continue.</p>{/if}
          {#if normalized.needsTwist}<p class="notice">Yaw assist: a twist-capable stick is required without pedals. You can declare existing pedals in the ergonomics step.</p>{/if}
        {:else if step === 2}
          <p class="intro">Your total hardware budget in {regionStore.currency}. Change region in the navigation to use local prices.</p>
          <label class="field" for="budget">Total budget · {regionStore.currency}</label>
          <div class="budget-input"><span>{regionStore.currency}</span><input id="budget" type="number" min="1" max="100000" step="any" bind:value={answers.budgetMax} aria-invalid={!validBudget} /></div>
          <div class="presets">{#each [150, 350, 750, 1500] as preset}<button class:chosen={answers.budgetMax === preset} onclick={() => answers.budgetMax = preset}>{money(preset)}{preset === 1500 ? '+' : ''}</button>{/each}</div>
          {#if !validBudget}<p class="notice">Enter a budget between 1 and 100,000.</p>{/if}
          <p class="hint">Use the field for budgets above 1,500. Totals use listed regional prices; shipping, import charges and separate mounts are excluded. Tax treatment follows each store’s listing.</p>
        {:else if step === 3}
          <p class="intro">Pick where your controls will live. Mount fit is flagged for verification against your desk or cockpit.</p>
          <div class="mounts">
            {#each [{ key: 'desk', title: 'Desktop flat base', detail: 'Controls sit on the desk. Check base plates and stability.' }, { key: 'clamp', title: 'Desk clamp mounts', detail: 'Controls sit at desk height or below. Allow for brackets.' }, { key: 'chair_pit', title: 'Chair / sim cockpit', detail: 'A dedicated flying position. Check plates and bolt patterns.' }] as mount}
              <button class="choice" class:chosen={answers.mountType === mount.key} aria-pressed={answers.mountType === mount.key} onclick={() => answers.mountType = mount.key as WizardAnswers['mountType']}><span class="choice-top"><strong>{mount.title}</strong><span aria-hidden="true">{answers.mountType === mount.key ? '◉' : '○'}</span></span><span class="description">{mount.detail}</span></button>
            {/each}
          </div>
          <label class="pedal-toggle"><input type="checkbox" checked={answers.piecesNeeded.includes('pedals')} onchange={() => togglePiece('pedals')} /><span><strong>Include rudder pedals in this purchase</strong><small>Dedicated yaw control; their price is included in the budget.</small></span></label>
          <label class="pedal-toggle"><input type="checkbox" checked={answers.hasExistingPedals ?? false} onchange={(event) => answers = normalizeWizardAnswers({ ...answers, hasExistingPedals: event.currentTarget.checked, piecesNeeded: event.currentTarget.checked ? answers.piecesNeeded.filter((piece) => piece !== 'pedals') : answers.piecesNeeded })} /><span><strong>I already own pedals</strong><small>Keep their yaw control without spending this budget on another set.</small></span></label>
          <p class="notice">{normalized.needsTwist ? 'No pedals selected → a stick must provide twist yaw.' : answers.piecesNeeded.includes('pedals') || answers.hasExistingPedals ? 'Pedal yaw available → a twist axis is optional.' : 'Yoke-only configurations may need existing pedals or another yaw input.'}</p>
          {#if !answers.piecesNeeded.length}<p class="notice">No new controls selected. Return to Controls to choose the equipment you want to buy.</p>{/if}
        {:else}
          <p class="intro">Editorial reference first. Then a custom package scored against your selected controls and regional budget.</p>
          <div class="result-title"><span>01 / CURATED REFERENCE SETUP</span><button class="text-button" onclick={() => goTo(2)}>Tweak budget ↗</button></div>
          {#each curated as setup}
            <article class="reference">
              <p class="eyebrow">{setup.data.budget_tier.replaceAll('_', ' ')} / {regionStore.region}</p><h3>{setup.data.title}</h3><p>{setup.data.description}</p><p class="reason">{setup.data.reasoning}</p>
              <ul>{#each setup.included as included}<li>{#if included.item}{@const photo = productImageSrc(included.item.images[0]?.file)}<span class="gear">{#if photo}<img src={photo} alt="" />{/if}<span><a href={detailHref(included.item)}>{included.item.name}</a><small>{included.role}</small></span></span>{:else}{included.id} (not in catalog)<small>{included.role}</small>{/if}</li>{/each}</ul>
              <p class="reference-price">{setup.totalPrice === null ? 'Regional total unavailable' : money(setup.totalPrice)} <span>{setup.totalPrice === null ? '· One or more prices missing' : setup.withinBudget ? '· Listed items within budget' : '· Above selected budget'}</span></p>
              {#each setup.warnings as warning}<p class="notice">{warning}</p>{/each}
              <p class="hint">Reference setups may include different controls from your selection. Check completeness, yaw control and mount requirements before buying.</p>
              {#if setup.data.notes}<p class="hint">{setup.data.notes}</p>{/if}
            </article>
          {:else}
            <div class="empty">No curated reference is published for this discipline and budget tier yet. Your custom match is below.</div>
          {/each}
          <div class="result-title"><span>02 / SCORED CUSTOM ALTERNATIVE</span><span>EXACT CONTROL SELECTION</span></div>
          {#if loadout}
            {#if loadout.complete}
              <p class="success">+ Complete control selection fits within your regional budget limit.</p>
              {#each loadout.pieces as piece, index}
                <article class="piece"><div class="piece-heading"><span class="eyebrow">{String(index + 1).padStart(2, '0')} / {piece.roles.map((role) => labels[role]).join(' + ')}</span><strong>{money(piece.price)}</strong></div>
                  {#each piece.items as item}{@const photo = productImageSrc(item.images[0]?.file)}<div class="piece-product">{#if photo}<img src={photo} alt="" />{/if}<h3><a href={detailHref(item)}>{item.name} ↗</a></h3></div>{/each}
                  <ul class="pills">{#each piece.explanations as explanation}<li>{explanation}</li>{/each}</ul>
                </article>
              {/each}
              <dl class="totals"><div><dt>PACKAGE TOTAL</dt><dd>{money(loadout.totalPrice)}</dd></div><div><dt>EST. LOGICAL INPUTS</dt><dd>{loadout.totalLogicalButtons}</dd></div><div><dt>ANALOG AXES</dt><dd>{loadout.totalAxes}</dd></div></dl>
              <p class="hint">Listed {regionStore.region} prices; tax treatment varies by store. Shipping and separate mounts excluded. Two copies of the same ambidextrous stick count twice in totals and once in compare.</p>
              {#if compareIds.length <= MAX_COMPARE_ITEMS}<a class="primary action-link" href={`/compare?${new URLSearchParams({ items: compareIds.join(',') })}`}>Compare this loadout ↗</a>{:else}<p class="notice">This package has {compareIds.length} distinct products. Compare supports four at a time:</p><div class="presets">{#each Array.from({ length: Math.ceil(compareIds.length / MAX_COMPARE_ITEMS) }, (_, index) => index) as batch}<a href={`/compare?${new URLSearchParams({ items: compareIds.slice(batch * MAX_COMPARE_ITEMS, (batch + 1) * MAX_COMPARE_ITEMS).join(',') })}`}>Compare loadout · part {batch + 1} ↗</a>{/each}</div>{/if}
            {/if}
            {#each loadout.warnings as warning}<p class="notice">{warning}</p>{/each}
          {/if}
          <div class="result-actions"><button class="primary" onclick={copyShareLink}>Copy share link</button><button onclick={() => goTo(0)}>Tweak answers</button></div>
          <p role="status" class="hint">{shareStatus}</p>{#if shareFallback}<label class="field" for="share-url">Share URL</label><input id="share-url" readonly value={shareFallback} onclick={(event) => event.currentTarget.select()} />{/if}
        {/if}
      </div>
      {#if step < 4}<div class="screen-footer"><button disabled={step === 0} onclick={() => goTo(step - 1)}>← Back</button><span>{String(step + 1).padStart(2, '0')} / 05</span><button class="primary" disabled={!canContinue} onclick={() => goTo(step + 1)}>{step === 3 ? 'Generate flight plan' : 'Continue'} →</button></div>{/if}
    </section>
    <aside class="manifest" aria-label="Live configuration summary"><p class="eyebrow">MISSION MANIFEST</p><div class="scope" aria-hidden="true"><span>+</span></div><h3>{useCases.find((useCase) => useCase.key === answers.useCase)?.label}</h3><p class="hint">{answers.targetSim ? sims.find((sim) => sim.id === answers.targetSim)?.label ?? answers.targetSim : 'Simulation independent'}</p><dl><div><dt>Controls to acquire</dt><dd>{answers.piecesNeeded.map((piece) => labels[piece]).join(' / ') || 'None selected'}</dd></div><div><dt>Budget ceiling</dt><dd>{validBudget ? money(answers.budgetMax) : 'Set a budget'} <small>{regionStore.region}</small></dd></div><div><dt>Station</dt><dd>{answers.mountType === 'desk' ? 'Desktop' : answers.mountType === 'clamp' ? 'Desk mounts' : 'Chair / cockpit'}</dd></div><div><dt>Yaw control</dt><dd>{answers.hasExistingPedals ? 'Existing pedals' : answers.piecesNeeded.includes('pedals') ? 'Dedicated pedals' : normalized.needsTwist ? 'Stick twist required' : 'Existing / external input'}</dd></div></dl><p class="manifest-note">Transparent rules.<br />Regional prices.<br />Your flight plan.</p></aside>
  </div>
</div>

<style>
  .wizard { margin-block: 2rem; } button, select, input, .presets a { font: inherit; color: var(--text-primary); background: var(--bg-cockpit); border: 1px solid var(--border-cockpit); border-radius: 4px; } button, .presets a { cursor: pointer; padding: .75rem 1rem; } button:hover, .presets a:hover { border-color: var(--accent-amber); } button:disabled { cursor: not-allowed; opacity: .45; } button.chosen, .choice.chosen { border-color: var(--accent-amber); background: var(--accent-amber-glow); } .primary { background: var(--accent-amber); color: var(--bg-cockpit); border-color: var(--accent-amber); font-weight: 700; } .primary:hover { background: var(--accent-amber-light); } .stepper { display: grid; grid-template-columns: repeat(5, 1fr); margin-bottom: 1.5rem; border: 1px solid var(--border-cockpit); border-radius: 4px; overflow: hidden; } .stepper button { display: flex; align-items: center; gap: .75rem; text-align: left; border: 0; border-right: 1px solid var(--border-cockpit); border-radius: 0; padding: 1.1rem; font-size: .75rem; } .stepper button:last-child { border: 0; } .number { font: .8rem var(--font-mono); color: var(--text-secondary); } .stepper .active { background: var(--accent-amber-glow); box-shadow: inset 0 -2px var(--accent-amber); color: var(--accent-amber-light); } .active .number, .done .number { color: var(--accent-amber); } .workspace { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 1.5rem; align-items: start; } .screen, .manifest { background: var(--bg-panel); border: 1px solid var(--border-cockpit); border-radius: 5px; overflow: hidden; } .screen-bar { display: flex; justify-content: space-between; gap: 1rem; padding: .8rem 1.5rem; border-bottom: 1px solid var(--border-cockpit); font: .6rem var(--font-mono); letter-spacing: .08em; color: var(--text-secondary); } .live { color: var(--accent-amber); } .screen-content { padding: 2rem; min-height: 510px; } .eyebrow { color: var(--hud-cyan); font: .65rem var(--font-mono); letter-spacing: .12em; text-transform: uppercase; } h2 { font-size: clamp(1.5rem, 3vw, 2.1rem); margin: .5rem 0 1rem; letter-spacing: -.03em; } h2:focus { outline: none; } .intro { color: var(--text-secondary); font-size: .9rem; margin-bottom: 1.75rem; max-width: 65ch; } .choice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; } .choice { padding: 1.15rem; text-align: left; background: var(--bg-panel-elevated); } .choice-top { display: flex; justify-content: space-between; align-items: center; gap: .75rem; } .choice-top strong { font-size: .9rem; } .chosen .choice-top > span { color: var(--accent-amber); } .description { display: block; color: var(--text-secondary); font-size: .75rem; margin-top: .5rem; line-height: 1.6; } .field { display: block; margin: 1.75rem 0 .6rem; font-size: .8rem; } .field span { font: .6rem var(--font-mono); color: var(--text-secondary); margin-left: .5rem; } select, input:not([type='checkbox']) { padding: .9rem; width: 100%; min-width: 0; } .hint { font-size: .75rem; color: var(--text-secondary); line-height: 1.7; } .notice { border-left: 2px solid var(--accent-amber); padding: .75rem 1rem; background: var(--accent-amber-glow); font-size: .78rem; line-height: 1.65; margin-block: 1rem; } .budget-input { display: flex; align-items: center; border-bottom: 2px solid var(--accent-amber); background: var(--bg-cockpit); } .budget-input span { padding-left: 1rem; color: var(--accent-amber); font-family: var(--font-mono); } .budget-input input { font: 2.2rem var(--font-mono); border: 0; background: transparent; } .presets { display: flex; flex-wrap: wrap; gap: .6rem; margin-block: 1.25rem; } .presets button, .presets a { font: .75rem var(--font-mono); text-decoration: none; } .mounts { display: grid; gap: .75rem; } .pedal-toggle { display: flex; gap: .8rem; padding: 1.2rem 0 .5rem; align-items: center; font-size: .85rem; cursor: pointer; } input[type='checkbox'] { accent-color: var(--accent-amber); width: 1.1rem; height: 1.1rem; } .pedal-toggle small { display: block; color: var(--text-secondary); margin-top: .35rem; } .screen-footer { border-top: 1px solid var(--border-cockpit); padding: 1.25rem 2rem; display: flex; justify-content: space-between; align-items: center; gap: .75rem; } .screen-footer > span { font: .7rem var(--font-mono); color: var(--text-secondary); } .screen-footer button { font-size: .8rem; } .manifest { padding: 1.5rem; } .scope { position: relative; width: 110px; height: 110px; margin: 1.7rem auto; border: 1px solid var(--border-cockpit-glow); border-radius: 50%; display: grid; place-items: center; background: repeating-radial-gradient(circle, transparent 0 17px, var(--accent-amber-glow) 18px 19px); } .scope span { color: var(--accent-amber); font: 2rem var(--font-mono); } .scope::before, .scope::after { content: ''; position: absolute; background: var(--border-cockpit-glow); } .scope::before { width: 130px; height: 1px; } .scope::after { height: 130px; width: 1px; } h3 { margin: .7rem 0; font-size: 1.1rem; } .manifest dl > div { border-top: 1px solid var(--border-cockpit); padding-block: .9rem; } dt { color: var(--text-secondary); font-size: .7rem; } dd { margin: .3rem 0 0; font-size: .8rem; } dd small { color: var(--accent-amber); } .manifest-note { font: .65rem/1.9 var(--font-mono); color: var(--text-secondary); border-top: 1px solid var(--border-cockpit); padding-top: 1rem; } .result-title { display: flex; justify-content: space-between; gap: .75rem; align-items: center; color: var(--text-secondary); font: .62rem var(--font-mono); margin: 2rem 0 1rem; letter-spacing: .05em; } .text-button { padding: .2rem; font: inherit; border: 0; color: var(--accent-amber); background: transparent; } .reference { padding: 1.5rem; border: 1px solid var(--accent-amber); border-radius: 4px; background: linear-gradient(135deg, var(--accent-amber-glow), transparent 70%); } .reference p, .reference ul { font-size: .8rem; } .reference .reason { color: var(--text-primary); line-height: 1.8; } .reference ul { padding-left: 0; list-style: none; } .reference li { margin: .75rem 0; } .gear, .piece-product { display: flex; align-items: center; gap: .75rem; } .gear img, .piece-product img { width: 64px; height: 64px; object-fit: contain; background: #f4f1ea; border-radius: 3px; flex: none; } .reference li small { display: block; color: var(--text-secondary); margin-top: .25rem; } .reference-price { font-family: var(--font-mono); color: var(--accent-amber); } .reference-price span { color: var(--text-secondary); font-size: .7rem; } .empty { padding: 1.25rem; border: 1px dashed var(--border-cockpit); font-size: .8rem; color: var(--text-secondary); } .piece { border: 1px solid var(--border-cockpit); border-radius: 4px; padding: 1.2rem; margin-bottom: .85rem; background: var(--bg-panel-elevated); } .piece-heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; } .piece-heading > strong { font: .9rem var(--font-mono); white-space: nowrap; } .piece h3 { font-size: .95rem; margin: 0; } .piece h3 a { text-decoration: none; } .piece h3 a:hover { color: var(--accent-amber); } .pills { display: flex; flex-wrap: wrap; list-style: none; gap: .4rem; padding: 0; margin: 1rem 0 0; } .pills li { background: var(--bg-cockpit); border: 1px solid var(--border-cockpit); border-radius: 3px; padding: .4rem .6rem; font-size: .65rem; line-height: 1.6; color: var(--text-secondary); } .success { color: var(--hud-green); font-size: .8rem; } .totals { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 1rem; padding-block: 1.25rem; border-block: 1px solid var(--border-cockpit); margin-block: 1.5rem; } .totals dt { font: .6rem var(--font-mono); } .totals dd { font: 1.4rem var(--font-mono); margin-top: .5rem; } .totals > div:first-child dd { color: var(--accent-amber); } .action-link { display: inline-block; text-decoration: none; padding: .8rem 1rem; border-radius: 3px; font-size: .8rem; } .result-actions { display: flex; gap: .75rem; margin-top: 1.5rem; flex-wrap: wrap; font-size: .8rem; }
  @media (max-width: 1000px) { .workspace { grid-template-columns: minmax(0, 1fr) 220px; gap: 1rem; } .screen-content { padding: 1.5rem; } .stepper button { flex-direction: column; align-items: start; padding: .9rem; } }
  @media (max-width: 760px) { .workspace { grid-template-columns: minmax(0, 1fr); } .manifest { display: none; } .stepper button { font-size: .6rem; gap: .5rem; padding: .65rem .4rem; } .screen-content { padding: 1.25rem; min-height: 400px; } .screen-bar { padding: .75rem 1rem; font-size: .5rem; } .screen-footer { padding: 1rem; } .screen-footer > span { display: none; } .totals { gap: .6rem; } .totals dd { font-size: 1.1rem; } }
  @media (max-width: 430px) { .choice-grid { grid-template-columns: 1fr; } .result-title { flex-wrap: wrap; } .piece-heading { align-items: start; } .totals { grid-template-columns: 1fr 1fr; } .totals > div:first-child { grid-column: 1 / -1; } }
</style>
