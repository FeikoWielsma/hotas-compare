<script lang="ts">
  import { glossary, type GlossaryKey } from '../lib/glossary';
  /** Small "?" button that opens a short explainer. Pass `term` for a glossary entry, or `title` + `text`. */
  let { term, title, text, label }: { term?: GlossaryKey; title?: string; text?: string | string[]; label?: string } = $props();
  const entry = $derived(term ? glossary[term] : null);
  const heading = $derived(title ?? entry?.term ?? '');
  const lines = $derived(text ? (Array.isArray(text) ? text : [text]) : entry ? [entry.text] : []);
  const id = `explain-${Math.random().toString(36).slice(2, 9)}`;
</script>

<button type="button" class="explain" popovertarget={id} aria-label={label ?? `What is ${heading}?`}>?</button>
<div {id} popover class="pop" role="note">
  <p class="heading">{heading}</p>
  {#each lines as line}<p>{line}</p>{/each}
</div>

<style>
  .explain { display: inline-grid; place-items: center; width: 1.15rem; height: 1.15rem; padding: 0; margin-left: .3rem; border: 1px solid currentColor; border-radius: 50%; background: transparent; color: var(--color-muted); font: 700 .65rem/1 var(--font-sans); cursor: help; vertical-align: middle; }
  .explain:hover, .explain:focus-visible { color: var(--color-accent); outline: none; }
  .pop { max-width: min(22rem, 90vw); margin: auto; padding: 1rem 1.1rem; border: 1px solid var(--color-rule); border-radius: 2px; background: var(--color-surface); color: var(--color-ink); box-shadow: 0 10px 30px #172e4230; font: .875rem/1.55 var(--font-sans); }
  .pop::backdrop { background: #172e4214; }
  .pop p { margin: 0 0 .4rem; } .pop p:last-child { margin: 0; } .heading { font-weight: 700; }
</style>
