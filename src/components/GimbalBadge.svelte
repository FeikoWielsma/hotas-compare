<script lang="ts">
  import type { GimbalType } from '../lib/schema';
  import { gimbalRank } from '../lib/catalog-columns';
  import { glossary, gimbalGlossaryKey, gimbalLabels } from '../lib/glossary';
  /** Gimbal type as a button that opens an explainer placing it on the quality ladder. `pill` is the table variant. */
  let { type, variant = 'badge' }: { type: GimbalType; variant?: 'badge' | 'pill' } = $props();
  const ladder: { type: GimbalType; note: string }[] = [
    { type: 'ball_and_cup', note: 'Budget sticks; centre bump and friction' },
    { type: 'pincer', note: 'Smooth and durable; usually mid-priced' },
    { type: 'cam_and_spring', note: 'Swappable cams and tunable feel; high end' },
    { type: 'force_feedback', note: 'Motors push back; game support varies' },
  ];
  const rank = $derived(gimbalRank[type] ?? 0);
  const entry = $derived(glossary[gimbalGlossaryKey[type]]);
  const id = `gimbal-${Math.random().toString(36).slice(2, 9)}`;
</script>

<button type="button" class={`trigger ${variant} ${type}`} popovertarget={id} aria-label={`${gimbalLabels[type]} gimbal: what does this mean?`}>
  <strong>{gimbalLabels[type]}</strong>
  {#if variant === 'badge' && rank}<span class="steps" aria-hidden="true">{#each [1, 2, 3, 4] as step}<i class:on={step <= rank}></i>{/each}</span>{/if}
</button>
<div {id} popover class="pop" role="dialog" aria-label={entry.term}>
  <p class="kicker">Gimbal</p>
  <p class="title">{entry.term}</p>
  <p class="text">{entry.text}</p>
  {#if rank}
    <ol class="ladder">
      {#each ladder as rung (rung.type)}
        <li class:current={rung.type === type}>
          <span class="steps" aria-hidden="true">{#each [1, 2, 3, 4] as step}<i class:on={step <= gimbalRank[rung.type]!}></i>{/each}</span>
          <span><b>{gimbalLabels[rung.type]}</b>{#if rung.type === type}<em>&nbsp;· this product</em>{/if}<br /><small>{rung.note}</small></span>
        </li>
      {/each}
    </ol>
  {/if}
  <button type="button" class="close" popovertarget={id} popovertargetaction="hide">Close</button>
</div>

<style>
  .trigger { display: inline-flex; align-items: center; gap: .45rem; border: 1px solid #d6d8d2; border-radius: 2px; background: #fffdf7; color: #586875; font: .72rem/1.2 var(--font-sans); cursor: pointer; }
  .trigger strong { color: inherit; text-decoration: underline dotted; text-underline-offset: .2em; }
  .trigger:hover { border-color: currentColor; }
  .badge { padding: .25rem .45rem; min-height: 26px; }
  .pill { padding: .15rem .5rem; border-color: currentColor; font-size: .75rem; font-weight: 700; background: #fff; }
  .pincer { color: #172e42; } .cam_and_spring { color: #bf421f; } .force_feedback { color: #192f43; }
  .pill.cam_and_spring { color: #fff; background: #bf421f; border-color: #bf421f; } .pill.force_feedback { color: #fff; background: #192f43; border-color: #192f43; }
  .pill strong { text-decoration: none; }
  .steps { display: inline-flex; gap: 2px; } .steps i { width: 9px; height: 4px; background: #d6d8d2; } .steps i.on { background: currentColor; }
  .pop { width: min(25rem, calc(100vw - 2rem)); margin: auto; padding: 1.2rem 1.25rem 1rem; border: 1px solid var(--color-rule); border-top: 4px solid var(--color-accent); border-radius: 2px; background: var(--color-surface); color: var(--color-ink); box-shadow: 0 18px 50px #172e4238; font: .875rem/1.5 var(--font-sans); }
  .pop::backdrop { background: #172e4226; }
  .kicker { margin: 0; font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--color-accent); }
  .title { margin: .15rem 0 .5rem; font: 700 1.6rem/1.05 var(--font-display); text-transform: uppercase; }
  .text { margin: 0 0 .9rem; color: var(--color-muted); }
  .ladder { list-style: none; margin: 0 0 .9rem; padding: 0; border-top: 1px solid var(--color-rule); }
  .ladder li { display: flex; align-items: flex-start; gap: .75rem; padding: .55rem .5rem; border-bottom: 1px solid var(--color-rule); color: var(--color-muted); }
  .ladder li .steps { margin-top: .4rem; color: #7d8a93; }
  .ladder li.current { background: var(--color-accent-soft); color: var(--color-ink); } .ladder li.current .steps { color: var(--color-accent); }
  .ladder b { color: var(--color-ink); } .ladder em { font-style: normal; color: var(--color-accent); font-weight: 600; } .ladder small { font-size: .75rem; }
  .close { display: block; margin-left: auto; padding: .5rem .8rem; min-height: 36px; border: 1px solid var(--color-rule); border-radius: 2px; background: transparent; color: var(--color-ink); font: 600 .8rem var(--font-sans); cursor: pointer; }
  .close:hover { border-color: var(--color-accent); color: var(--color-accent); }
  :is(.trigger, .close):focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
</style>
