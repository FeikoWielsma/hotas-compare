/**
 * Propose use-case fit scores from recorded specs (rules in src/lib/fit-baseline.ts).
 *
 *   pnpm fit:baseline                 report: agreement with hand scores, and proposals for unscored parts
 *   pnpm fit:baseline --write         fill placeholder fits and refresh earlier baseline fits (marked
 *                                     `use_case_fit_source: baseline`); editorial and community scores are left alone
 *   --group=<sticks|bases|…>  --verbose (list every part)  --report=<file.md>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { products } from './content.ts';
import { baselineFit } from '../src/lib/fit-baseline.ts';
import { groupOf, isPlaceholderFit, setFitInYaml } from '../src/lib/fit-groups.ts';
import { UseCaseEnum, type Component } from '../src/lib/schema.ts';
import { isListed } from '../src/lib/visibility.ts';

const args = process.argv.slice(2);
const option = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const write = args.includes('--write'), verbose = args.includes('--verbose');
const short = { modern_jet: 'jet', heli: 'heli', ww2: 'ww2', ga: 'ga', airliner: 'air', space_hotas: 'spT', space_hosas: 'spS' } as const;
const fmt = (fit: Component['use_case_fit']) => UseCaseEnum.options.map((u) => fit[u]).join('');

const parts = products()
  .filter((p) => p.collection === 'components')
  .map((p) => ({ ...p, data: p.data as Component }))
  .filter((p) => isListed(p.data) && (!option('group') || groupOf(p.data.category, p.data.name) === option('group')))
  .map((p) => ({ ...p, group: groupOf(p.data.category, p.data.name), placeholder: isPlaceholderFit(p.data.use_case_fit) || p.data.use_case_fit_source === 'baseline', baseline: baselineFit(p.data) }));

const scored = parts.filter((p) => !p.placeholder);
const lines: string[] = [`# Fit baseline — ${parts.length} listed parts, ${scored.length} scored by hand or community, ${parts.length - scored.length} placeholder or baseline`, ''];

// Agreement with hand scores: mean absolute difference per use case and share within one point.
lines.push('## Agreement with hand scores', '', '| Use case | Mean abs. diff | Within 1 |', '|---|---|---|');
for (const u of UseCaseEnum.options) {
  const diffs = scored.map((p) => Math.abs(p.baseline.fit[u] - p.data.use_case_fit[u]));
  const mae = diffs.reduce((a, b) => a + b, 0) / (diffs.length || 1);
  lines.push(`| ${u} | ${mae.toFixed(2)} | ${Math.round((100 * diffs.filter((d) => d <= 1).length) / (diffs.length || 1))}% |`);
}

const gap = (p: (typeof parts)[number]) => UseCaseEnum.options.reduce((n, u) => n + Math.abs(p.baseline.fit[u] - p.data.use_case_fit[u]), 0);
lines.push('', '## Biggest disagreements (hand → baseline, order jet heli ww2 ga air spT spS)', '');
for (const p of scored.toSorted((a, b) => gap(b) - gap(a)).slice(0, verbose ? scored.length : 15)) {
  lines.push(`- ${p.id} (${p.group}): ${fmt(p.data.use_case_fit)} → ${fmt(p.baseline.fit)} — ${p.baseline.reasons.join(', ') || 'no rules'}`);
}

lines.push('', '## Proposals for placeholder and baseline parts', '');
for (const p of parts.filter((x) => x.placeholder).toSorted((a, b) => a.group.localeCompare(b.group) || a.id.localeCompare(b.id))) {
  lines.push(`- ${p.id} (${p.group}): ${fmt(p.data.use_case_fit)} → ${fmt(p.baseline.fit)} — ${p.baseline.reasons.join(', ') || 'group default'}`);
}
lines.push('', `Columns: ${UseCaseEnum.options.map((u) => short[u]).join(' ')}`);

const report = lines.join('\n');
console.log(report);
if (option('report')) writeFileSync(option('report')!, report + '\n');

if (write) {
  const targets = parts.filter((p) => p.placeholder && (fmt(p.baseline.fit) !== fmt(p.data.use_case_fit) || p.data.use_case_fit_source !== 'baseline'));
  for (const p of targets) writeFileSync(p.file, setFitInYaml(readFileSync(p.file, 'utf8'), p.baseline.fit, 'baseline'));
  console.log(`\nWrote ${targets.length} component files.`);
}
