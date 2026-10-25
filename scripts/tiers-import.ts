/**
 * Combine community tier lists into proposed use-case fit scores.
 *
 *   pnpm tiers:import                     report from research-tools/tier-lists/submissions.txt
 *   pnpm tiers:import <url> <url>…        also include these share links
 *   pnpm tiers:import --github            also read GitHub issues titled "Tier list: …" (needs `gh`)
 *   pnpm tiers:import --write             apply proposed scores to the component YAML files
 *   --min-lists=<n>   only propose a change once n lists ranked the part for that use case (default 2)
 *   --report=<file.md>
 *
 * submissions.txt holds one share link per line; text after the link and `#` comment lines are ignored.
 * Each part's proposal is the median of its fine score (tier plus position within the tier) in the lists that
 * ranked it; the latest list per author counts. A GitHub issue's author is the list's author, whatever the link says.
 * Proposals never exceed a part's hard cap (fitCap). With --write, a ranked part whose fit was unreviewed takes
 * the spec baseline for the use cases no list covered, so its whole fit can be marked `community`.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { products } from './content.ts';
import { baselineFit, fitCap } from '../src/lib/fit-baseline.ts';
import { isUnreviewedFit, setFitInYaml } from '../src/lib/fit-groups.ts';
import { combineTierLists, findTierLinks, parseTierList, type TierList } from '../src/lib/fit-tiers.ts';
import type { Component, UseCaseFit } from '../src/lib/schema.ts';

const SUBMISSIONS = 'research-tools/tier-lists/submissions.txt';
const args = process.argv.slice(2);
const option = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const write = args.includes('--write');
const minLists = Number(option('min-lists') ?? 2);

const sources: { link: string; by?: string }[] = args.filter((a) => /^https?:/.test(a)).map((link) => ({ link }));
if (existsSync(SUBMISSIONS)) {
  for (const line of readFileSync(SUBMISSIONS, 'utf8').split(/\r?\n/)) if (!line.trim().startsWith('#')) sources.push(...findTierLinks(line).map((link) => ({ link })));
}
if (args.includes('--github')) {
  const issues = JSON.parse(execFileSync('gh', ['issue', 'list', '--repo', 'FeikoWielsma/hotas-compare', '--state', 'all', '--search', 'in:title "Tier list:"', '--limit', '500', '--json', 'number,body,createdAt,author'], { encoding: 'utf8' })) as { body: string; createdAt: string; author: { login: string } }[];
  // Oldest first, so a later list by the same author replaces an earlier one.
  for (const issue of issues.toSorted((a, b) => a.createdAt.localeCompare(b.createdAt))) sources.push(...findTierLinks(issue.body).map((link) => ({ link, by: `@${issue.author.login}` })));
}

const components = products().filter((p) => p.collection === 'components') as { file: string; id: string; data: Component }[];
const byId = new Map(components.map((c) => [c.id, c]));
const lists: TierList[] = [];
let rejected = 0;
for (const source of sources) {
  const list = parseTierList(source.link, [...byId.keys()]);
  if (list?.tiers.size) lists.push(source.by ? { ...list, by: source.by } : list); else rejected++;
}

const verdicts = combineTierLists(lists).filter((v) => v.scores.length >= minLists);
const proposed = new Map<string, UseCaseFit>();
const rows: string[] = [];
const startingFit = (data: Component) => (isUnreviewedFit(data.use_case_fit, data.use_case_fit_source) ? baselineFit(data).fit : data.use_case_fit);
for (const v of verdicts.toSorted((a, b) => a.useCase.localeCompare(b.useCase) || a.id.localeCompare(b.id))) {
  const { data } = byId.get(v.id)!;
  const current = data.use_case_fit[v.useCase];
  const { cap, reasons } = fitCap(data);
  const score = Math.min(v.proposed, cap);
  proposed.set(v.id, { ...(proposed.get(v.id) ?? startingFit(data)), [v.useCase]: score });
  if (current === score) continue;
  rows.push(`| ${v.useCase} | ${v.id} | ${current} | ${score}${score < v.proposed ? ` (capped: ${reasons.join(', ')})` : ''} | ${v.scores.join(' ')} |`);
}

const authors = new Set(lists.map((l) => l.by?.toLowerCase()).filter(Boolean));
const report = [
  `# Tier list import — ${lists.length} lists (${authors.size} named authors), min ${minLists} per part`,
  rejected ? `\n${rejected} links could not be read.` : '',
  '',
  rows.length ? '| Use case | Component | Current | Proposed | Scores given |\n|---|---|---|---|---|\n' + rows.join('\n') : 'No changes proposed yet.',
].join('\n');
console.log(report);
if (option('report')) writeFileSync(option('report')!, report + '\n');

if (write) {
  let written = 0;
  for (const [id, fit] of proposed) {
    const { file, data } = byId.get(id)!;
    // Keep the clamp for unranked use cases too: the hard caps bind every score.
    const { cap } = fitCap(data);
    for (const u of Object.keys(fit) as (keyof UseCaseFit)[]) fit[u] = Math.min(fit[u], cap);
    if (data.use_case_fit_source === 'community' && Object.entries(fit).every(([u, s]) => data.use_case_fit[u as keyof UseCaseFit] === s)) continue;
    writeFileSync(file, setFitInYaml(readFileSync(file, 'utf8'), fit, 'community'));
    written++;
  }
  console.log(`\nWrote ${written} component files.`);
}
