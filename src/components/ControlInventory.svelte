<script lang="ts">
  import HardwareIcon from './HardwareIcon.svelte';
  import { controlTypes, controlCount, controlFacts, controlLocation, inventoryComplete, inventoryCount } from '../lib/control-inventory';
  import type { ControlSection } from '../lib/control-inventory';
  let { sections }: { sections: ControlSection[] } = $props();
  const featured = controlTypes.filter(t => ['hat', 'analog_ministick', 'button', 'slider', 'encoder', 'scroll_wheel'].includes(t.type));
  const icons: Record<string, string> = { hat: 'control-hat', analog_ministick: 'control-ministick', button: 'control-button', trigger: 'control-trigger', lever: 'control-lever', slider: 'control-slider', encoder: 'control-encoder', scroll_wheel: 'control-wheel', rotary: 'control-rotary', toggle: 'control-toggle', rocker: 'control-rocker', detent: 'control-detent', switch: 'control-switch', axis: 'control-axis' };
  const hasPartialCounts = $derived(!inventoryComplete(sections));
  function countLabel(type: Parameters<typeof inventoryCount>[1]) {
    const value = inventoryCount(sections, type);
    const number = value.match(/^\d+/)?.[0];
    return number ? `${number}${hasPartialCounts && Number(number) > 0 ? '+' : ''}` : '—';
  }
</script>

<section class="inventory" aria-label="Physical controls">
  <header class="inventory-heading"><div><p class="eyebrow">A closer look</p><h2>Everything within reach.</h2><p class="intro">The buttons, hats and axes that bring your flying to life.</p></div><HardwareIcon name="control-ministick" size={48} /></header>
  <div class="overview">{#each featured as family}<div class="overview-item"><span class="symbol"><HardwareIcon name={icons[family.type]} size={32} /></span><strong aria-label={`${family.label}: ${countLabel(family.type) === '—' ? 'not specified' : countLabel(family.type)}`}>{countLabel(family.type)}</strong><span>{family.label}</span></div>{/each}</div>
  <p class="legend">Physical controls, not software bindings.{hasPartialCounts ? ' + indicates a minimum count; — means not specified.' : ''}</p>
  {#each sections as section}
    <div class="component-section">
      {#if sections.length > 1}<div class="component-heading"><h3>{section.name}</h3><span>{section.category.replaceAll('_', ' ')}</span></div>{/if}
      {#if section.controls.length}
        <div class="control-grid">{#each controlTypes as family}{@const entries = section.controls.filter(c => c.type === family.type)}{#if entries.length}
          <section class="family"><header><span class="family-icon"><HardwareIcon name={icons[family.type]} size={25} /></span><h4>{family.label}</h4><span class="family-count">{entries.reduce((n, c) => n + controlCount(c), 0)}</span></header>
            {#each entries as control}{@const location = controlLocation(control, section)}<div class="control"><div class="control-title"><strong>{controlCount(control)} × {control.label ?? family.label}</strong>{#if location !== 'unknown'}<span class="location">{location}</span>{/if}</div><dl>{#each controlFacts(control) as fact}<div><dt>{fact.label}</dt><dd class:positive={fact.value === 'Yes'}>{fact.value === 'Unknown' ? 'Not specified' : fact.value}</dd></div>{/each}</dl></div>{/each}
          </section>
        {/if}{/each}</div>
      {:else}<p class="empty">The control breakdown is not available for this product yet.</p>{/if}
    </div>
  {/each}
</section>

<style>
  .inventory { margin: 1rem 0 2.5rem; color: var(--color-ink); }
  .inventory-heading { display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; padding: 1.5rem 0; border-top: 2px solid var(--color-ink); }
  .inventory-heading > :global(svg) { color: var(--color-accent); flex: none; }
  .eyebrow { color: var(--color-accent); font-size: .8rem; font-weight: 600; margin: 0 0 .6rem; }
  h2 { font: 600 clamp(2rem, 4vw, 3rem)/1.05 var(--font-display); text-transform: uppercase; margin: 0; }
  .intro { font-size: .9375rem; color: var(--color-muted); margin: .65rem 0 0; }
  .overview { display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); border: 1px solid var(--color-rule); background: var(--color-photo); }
  .overview-item { display: grid; gap: .55rem; min-width: 0; padding: 1.2rem 1rem; align-content: start; }
  .overview-item + .overview-item { border-left: 1px solid var(--color-rule); }
  .symbol { color: var(--color-accent); margin-bottom: .4rem; display: flex; }
  .overview strong { font-size: 1.7rem; line-height: 1.15; font-weight: 600; }
  .overview-item > span:last-child { font-size: .8125rem; color: var(--color-muted); }
  .legend { color: var(--color-muted); font-size: .8rem; line-height: 1.7; margin: .9rem 0 1.5rem; }
  .component-section + .component-section { border-top: 1px solid var(--color-rule); margin-top: 1.75rem; padding-top: 1.75rem; }
  .component-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; margin-bottom: 1rem; }
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
  @media(max-width:1000px) { .control-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } .overview { grid-template-columns: repeat(3,minmax(0,1fr)); } .overview-item:nth-child(4) { border-left: 0; } .overview-item:nth-child(n+4) { border-top: 1px solid var(--color-rule); } }
  @media(max-width:600px) { .control-grid { grid-template-columns: 1fr; } .overview-item { padding: 1rem .65rem; } .overview-item > span:last-child { font-size: .75rem; } .component-heading { flex-direction: column; gap: .3rem; } .inventory-heading > :global(svg) { display: none; } }
</style>
