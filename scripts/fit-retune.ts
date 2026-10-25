/**
 * Turn fit duel votes into proposed use-case fit scores.
 *
 *   pnpm fit:retune                 report proposed changes
 *   pnpm fit:retune --write         apply them to the component YAML files
 *   --min-votes=<n>   only propose a change for items with at least n votes in that use case (default 3)
 *   --report=<file.md>
 *
 * Each stored score is the prior; votes move it (Bradley–Terry, see src/lib/fit-duel.ts).
 * Comparisons are relative, so a pool where everything was overrated only drops through "Both poor" votes.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { products, readContent } from './content.ts';
import { readVotes } from './fit-votes.ts';
import { PRIOR_SD, rate, setFitInYaml, toFitScore } from '../src/lib/fit-duel.ts';
import { UseCaseEnum, type Component, type UseCaseFit } from '../src/lib/schema.ts';

const args = process.argv.slice(2);
const option = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const write = args.includes('--write');
const minVotes = Number(option('min-votes') ?? 3);

const components = products().filter((p) => p.collection === 'components').map((p) => ({
  ...p, data: p.data as Component, explicit: Boolean(readContent(p.file).use_case_fit),
}));
const votes = readVotes();
const proposed = new Map(components.map((c) => [c.id, { ...c.data.use_case_fit } as UseCaseFit]));
const rows: string[] = [];

for (const useCase of UseCaseEnum.options) {
  const caseVotes = votes.filter((v) => v.use_case === useCase);
  if (!caseVotes.length) continue;
  const priors = new Map(components.map((c) => [c.id, { mean: c.data.use_case_fit[useCase], sd: c.explicit ? PRIOR_SD.explicit : PRIOR_SD.defaulted }]));
  const ratings = rate(caseVotes, priors);
  for (const c of components) {
    const r = ratings.get(c.id)!, current = c.data.use_case_fit[useCase], next = toFitScore(r.score);
    if (r.votes < minVotes || next === current) continue;
    proposed.get(c.id)![useCase] = next;
    rows.push(`| ${useCase} | ${c.id} | ${current}${c.explicit ? '' : ' (default)'} | ${next} | ${r.score.toFixed(2)} ± ${r.sd.toFixed(2)} | ${r.votes} |`);
  }
}

const counted = votes.filter((v) => v.result !== 'skip');
const report = [
  `# Fit retune — ${counted.length} votes, min ${minVotes} per item`,
  '',
  ...UseCaseEnum.options.map((u) => `- ${u}: ${counted.filter((v) => v.use_case === u).length} votes`),
  '',
  rows.length ? '| Use case | Component | Current | Proposed | Estimate | Votes |\n|---|---|---|---|---|---|\n' + rows.join('\n') : 'No changes proposed yet.',
].join('\n');
console.log(report);
if (option('report')) writeFileSync(option('report')!, report + '\n');

if (write) {
  let changed = 0;
  for (const c of components) {
    const fit = proposed.get(c.id)!;
    if (UseCaseEnum.options.every((u) => fit[u] === c.data.use_case_fit[u])) continue;
    writeFileSync(c.file, setFitInYaml(readFileSync(c.file, 'utf8'), fit));
    changed++;
  }
  console.log(`\nWrote ${changed} component files.`);
}
