<script lang="ts">
  import HardwareIcon from './HardwareIcon.svelte';
  import { controlTypes, controlCount, controlFacts, controlLocation, inventoryComplete, inventoryCount } from '../lib/control-inventory';
  import { humanize } from '../lib/labels';
  import type { ControlSection } from '../lib/control-inventory';
  let { sections }: { sections: ControlSection[] } = $props();
  const total = (type: string) => sections.reduce((n, s) => n + s.controls.filter(c => c.type === type).reduce((m, c) => m + controlCount(c), 0), 0);
  // Show the families this hardware actually has; zero-count tiles are noise on panels and pedals.
  const featured = $derived(controlTypes.filter(t => total(t.type) > 0));
  const evidence = $derived(sections.filter(s => s.controls_evidence).map(s => ({ name: s.name, ...s.controls_evidence! })));
  const icons: Record<string, string> = { hat: 'control-hat', analog_ministick: 'control-ministick', button: 'control-button', trigger: 'control-trigger', lever: 'control-lever', slider: 'control-slider', encoder: 'control-encoder', scroll_wheel: 'control-wheel', rotary: 'control-rotary', toggle: 'control-toggle', rocker: 'control-rocker', detent: 'control-detent', switch: 'control-switch', axis: 'control-axis' };
  const hasPartialCounts = $derived(!inventoryComplete(sections));
  function countLabel(type: Parameters<typeof inventoryCount>[1]) {
    const value = inventoryCount(sections, type);
    const number = value.match(/^\d+/)?.[0];
    return number ? `${number}${hasPartialCounts && Number(number) > 0 ? '+' : ''}` : '—';
  }
</script>

<section class="inventory" aria-label="Physical controls">
  <header class="inventory-heading"><div><p class="eyebrow">Physical controls</p><h2>Everything within reach</h2><p class="intro">Every hat, button and axis, counted from manufacturer documentation.</p></div><span class="coverage" class:partial={hasPartialCounts}>{hasPartialCounts ? 'Partial inventory' : 'Complete inventory'}</span></header>
  {#if featured.length}<div class="overview">{#each featured as family}<div class="overview-item"><span class="symbol"><HardwareIcon name={icons[family.type]} size={32} /></span><strong aria-label={`${family.label}: ${countLabel(family.type) === '—' ? 'not specified' : countLabel(family.type)}`}>{countLabel(family.type)}</strong><span>{family.label}</span></div>{/each}</div>{/if}
  <p class="legend">Physical controls, not software bindings.{hasPartialCounts ? ' Some controls are not yet documented, so + marks a minimum count.' : ''}</p>
  {#snippet breakdown(section: ControlSection)}
      {#if section.controls.length}
        <div class="control-grid">{#each controlTypes as family}{@const entries = section.controls.filter(c => c.type === family.type)}{#if entries.length}
          <section class="family"><header><span class="family-icon"><HardwareIcon name={icons[family.type]} size={25} /></span><h4>{family.label}</h4><span class="family-count">{entries.reduce((n, c) => n + controlCount(c), 0)}</span></header>
            {#each entries as control}{@const location = controlLocation(control, section)}<div class="control"><div class="control-title"><strong>{controlCount(control)} × {control.label ?? family.label}</strong>{#if location !== 'unknown'}<span class="location">{humanize(location)}</span>{/if}</div><dl>{#each controlFacts(control) as fact}<div><dt>{fact.label}</dt><dd class:positive={fact.value === 'Yes'} class:unknown={fact.value === 'Unknown'}>{fact.value === 'Unknown' ? 'Not specified' : humanize(fact.value)}</dd></div>{/each}</dl></div>{/each}
          </section>
        {/if}{/each}</div>
      {:else}<p class="empty">The control breakdown is not available for this product yet.</p>{/if}
  {/snippet}
  {#each sections as section}
    {#if sections.length > 1}
      <details class="component-section" open={section.controls.length > 0 && sections.length <= 2}><summary class="component-heading"><h3>{section.name}</h3><span>{humanize(section.category)} · {section.controls.reduce((n, c) => n + controlCount(c), 0)} controls</span></summary>{@render breakdown(section)}</details>
    {:else}<div class="component-section">{@render breakdown(section)}</div>{/if}
  {/each}
  {#if evidence.length}<details class="evidence"><summary>How these controls were counted</summary><ul>{#each evidence as e}<li>{#if sections.length > 1}<b>{e.name}:</b> {/if}{e.coverage === 'complete' ? 'Complete' : 'Partial'} inventory, checked {e.checked} against <a href={e.source} rel="external noopener">{new URL(e.source).hostname.replace(/^www\./, '')}</a>.{#if e.notes} {e.notes}{/if}</li>{/each}</ul></details>{/if}
</section>

<style>
  .inventory { margin: 1rem 0 2.5rem; color: var(--color-ink); }
  .inventory-heading { display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; padding: 1.5rem 0; border-top: 2px solid var(--color-ink); }
  .coverage { flex: none; padding: .3rem .65rem; font-size: .75rem; font-weight: 600; color: var(--color-success); border: 1px solid color-mix(in srgb, var(--color-success) 40%, transparent); }
  .coverage.partial { color: var(--color-muted); border-color: var(--color-rule); }
  .evidence { margin-top: 1.25rem; font-size: .8125rem; color: var(--color-muted); } .evidence summary { cursor: pointer; color: var(--color-accent); } .evidence ul { padding-left: 1.1rem; line-height: 1.7; } .evidence a { color: var(--color-accent); } dd.unknown { color: var(--color-muted); }
  .eyebrow { color: var(--color-accent); font-size: .8rem; font-weight: 600; margin: 0 0 .6rem; }
  h2 { font: 600 clamp(2rem, 4vw, 3rem)/1.05 var(--font-display); text-transform: uppercase; margin: 0; }
  .intro { font-size: .9375rem; color: var(--color-muted); margin: .65rem 0 0; }
  .overview { display: grid; grid-template-columns: repeat(auto-fill,minmax(140px,1fr)); overflow: hidden; border: 1px solid var(--color-rule); background: var(--color-photo); }
  .overview-item { display: grid; gap: .4rem; min-width: 0; padding: 1.1rem 1rem; align-content: start; margin: 0 -1px -1px 0; border-right: 1px solid var(--color-rule); border-bottom: 1px solid var(--color-rule); }
  .symbol { color: var(--color-accent); margin-bottom: .4rem; display: flex; }
  .overview strong { font-size: 1.7rem; line-height: 1.15; font-weight: 600; }
  .overview-item > span:last-child { font-size: .8125rem; color: var(--color-muted); }
  .legend { color: var(--color-muted); font-size: .8rem; line-height: 1.7; margin: .9rem 0 1.5rem; }
  .component-section + .component-section { border-top: 1px solid var(--color-rule); margin-top: 1.25rem; padding-top: 1.25rem; }
  .component-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; cursor: pointer; list-style: none; padding: .25rem 0; }
  .component-heading::-webkit-details-marker { display: none; }
  .component-heading h3::before { content: '▸'; display: inline-block; width: 1.1rem; color: var(--color-accent); transition: transform .15s; }
  details[open] > .component-heading { margin-bottom: 1rem; } details[open] > .component-heading h3::before { transform: rotate(90deg); }
  .component-heading h3 { font: 600 1.125rem/1.5 var(--font-sans); margin: 0; }
  .component-heading > span { color: var(--color-muted); font-size: .8rem; }
  .control-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 1rem; }
  .family { min-width: 0; border: 1px solid var(--color-rule); align-self: start; background: var(--color-surface); }
  .family > header { display: flex; gap: .65rem; align-items: center; padding: .9rem 1rem; border-bottom: 1px solid var(--color-rule); }
  .family-icon { color: var(--color-accent); display: flex; }
  .family h4 { font-size: .9375rem; font-weight: 600; margin: 0; }
  .family-count { margin-left: auto; font-size: .875rem; color: var(--color-muted); }
  .control { padding: 1rem; min-width: 0; }
  .control + .control { border-top: 1px solid var(--color-rule); }
  .control-title { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; margin-bottom: .85rem; }
  .control-title strong { font-size: .9rem; font-weight: 600; overflow-wrap: anywhere; }
  .location { background: var(--color-paper); color: var(--color-muted); padding: .2rem .4rem; font-size: .75rem; }
  dl { display: grid; gap: .45rem; margin: 0; }
  dl > div { display: flex; justify-content: space-between; gap: 1rem; font-size: .875rem; }
  dt { color: var(--color-muted); } dd { margin: 0; text-align: right; overflow-wrap: anywhere; } dd.positive { color: var(--color-success); }
  .empty { font-size: .875rem; color: var(--color-muted); line-height: 1.75; margin: .8rem 0 0; }
  @media(max-width:1000px) { .control-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
  @media(max-width:600px) { .control-grid { grid-template-columns: 1fr; } .overview { grid-template-columns: repeat(2,minmax(0,1fr)); } .overview-item { padding: 1rem .65rem; } .overview-item > span:last-child { font-size: .75rem; } .component-heading { flex-direction: column; gap: .3rem; } .inventory-heading { flex-wrap: wrap; } }
</style>
