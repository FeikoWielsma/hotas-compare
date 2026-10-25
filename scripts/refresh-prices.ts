/**
 * Check stored prices against store feeds (VKB US, flightsimcontrols, WINCTRL, VIRPIL).
 *
 *   pnpm prices:refresh                   report only
 *   pnpm prices:refresh --write           apply changed amounts and retain previous observations (last 10, newest last)
 *   pnpm prices:refresh --write --touch   also bump `verified` on prices that are unchanged
 *   --store=<host>  --brand=<id>  --report=<file.md>
 *   --force         also write big moves (> 25%) and announced products, normally held for review
 *
 * One request at a time per store, with a pause between requests.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { products } from './content.ts';
import { MAX_AUTO_CHANGE, feedRequest, parseFeed, updatePriceText, type FeedRequest, type FeedResult } from '../src/lib/price-feeds.ts';

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const write = flag('write'), touch = flag('touch'), force = flag('force');
const today = new Date().toISOString().slice(0, 10);
const USER_AGENT = 'hotas-compare price check (+https://hotas.razortek.nl; contact via GitHub FeikoWielsma/hotas-compare)';
const PAUSE_MS = 900, TIMEOUT_MS = 20000;
const BLOCKED = 'blocked by store bot protection';

interface Entry { file: string; id: string; region: string; currency: string; stored: number; url: string; announced: boolean; request: FeedRequest }
interface Checked extends Entry { result: FeedResult }

const entries: Entry[] = products()
  .filter(({ data }) => !option('brand') || data.brand === option('brand'))
  .flatMap(({ file, id, data }) => data.prices.flatMap((price) => {
    if (!price.url || price.kind === 'street') return [];
    const request = feedRequest(price.url);
    if (!request || (option('store') && new URL(price.url).hostname !== option('store'))) return [];
    return [{ file, id, region: price.region, currency: price.currency, stored: price.amount, url: price.url, announced: data.status === 'announced', request }];
  }));

const amountOf = (c: { result: FeedResult }) => (c.result as { amount: number }).amount;
const reasonOf = (c: { result: FeedResult }) => (c.result as { reason: string }).reason;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
/** Retry temporary server trouble (5xx, 429, timeouts) with back-off; anything else is final. */
async function fetchFeed(request: FeedRequest): Promise<FeedResult> {
  for (const wait of [5000, 15000]) {
    const result = await fetchOnce(request);
    if (result.ok || !/^HTTP (5\d\d|429)$|timed out/.test(result.reason)) return result;
    await sleep(wait);
  }
  return fetchOnce(request);
}
async function fetchOnce(request: FeedRequest): Promise<FeedResult> {
  try {
    const response = await fetch(request.url, {
      method: request.method, body: request.body, signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json', ...request.headers },
    });
    if (!response.ok) {
      // Respect bot challenges (e.g. Cloudflare "Just a moment"); never try to get around them.
      const blocked = response.status === 403 && /just a moment|cf-chl|challenge/i.test(await response.text());
      return { ok: false, reason: blocked ? BLOCKED : `HTTP ${response.status}` };
    }
    return parseFeed(request, await response.json());
  } catch (error) {
    return { ok: false, reason: (error as Error).name === 'TimeoutError' ? 'timed out' : (error as Error).message };
  }
}

// Same API URL (e.g. a shared EU listing for left and right variants) is fetched once.
const cache = new Map<string, Promise<FeedResult>>();
const byHost = Map.groupBy(entries, (entry) => new URL(entry.request.url).hostname);
const checked: Checked[] = (await Promise.all([...byHost.values()].map(async (group) => {
  const out: Checked[] = [];
  let hostBlocked = false;
  for (const entry of group) {
    // Once a store challenges us, stop asking it for anything else this run.
    if (hostBlocked) { out.push({ ...entry, result: { ok: false, reason: BLOCKED } }); continue; }
    const key = `${entry.request.method} ${entry.request.url} ${entry.request.body ?? ''}`;
    if (!cache.has(key)) { cache.set(key, fetchFeed(entry.request)); await sleep(PAUSE_MS); }
    const result = await cache.get(key)!;
    if (!result.ok && result.reason === BLOCKED) hostBlocked = true;
    out.push({ ...entry, result: result.ok && result.currency && result.currency !== entry.currency ? { ok: false, reason: `store returned ${result.currency}, entry is ${entry.currency}` } : result });
  }
  return out;
}))).flat();

const moved = checked.filter((c) => c.result.ok && c.result.amount !== c.stored);
// Large moves usually mean a wrong product link or a pre-order deposit, not a price change.
const suspicious = (c: Checked) => c.announced || Math.abs(amountOf(c) / c.stored - 1) > MAX_AUTO_CHANGE;
const review = force ? [] : moved.filter(suspicious);
const changed = moved.filter((c) => !review.includes(c));
const same = checked.filter((c) => c.result.ok && c.result.amount === c.stored);
const ambiguous = checked.filter((c) => !c.result.ok && c.result.ambiguous);
const blocked = checked.filter((c) => !c.result.ok && c.result.reason === BLOCKED);
const failed = checked.filter((c) => !c.result.ok && !c.result.ambiguous && c.result.reason !== BLOCKED);

if (write) {
  const updates = Map.groupBy([...changed, ...(touch ? same : [])], (c) => c.file);
  for (const [file, list] of updates) {
    let text = readFileSync(file, 'utf8');
    for (const c of list) {
      const next = updatePriceText(text, c.region, c.url, amountOf(c), today);
      if (next == null) console.warn(`! could not locate ${c.region} price for ${c.url} in ${file}`);
      else text = next;
    }
    writeFileSync(file, text);
  }
}

const pct = (c: Checked) => `${amountOf(c) > c.stored ? '+' : ''}${(((amountOf(c) - c.stored) / c.stored) * 100).toFixed(1)}%`;
const lines = [
  `# Price refresh ${today}`,
  '',
  `Checked ${checked.length} prices (${cache.size} store requests): ${changed.length} changed, ${review.length} held for review, ${same.length} unchanged, ${ambiguous.length} ambiguous, ${failed.length} failed, ${blocked.length} blocked.${write ? ' Changes written.' : ''}`,
  '',
  ...(changed.length ? ['## Changed', '', '| Item | Region | Was | Now | Δ |', '|---|---|---:|---:|---:|',
    ...changed.sort((a, b) => Math.abs(amountOf(b) / b.stored - 1) - Math.abs(amountOf(a) / a.stored - 1))
      .map((c) => `| [${c.id}](${c.url}) | ${c.region} | ${c.stored} | ${amountOf(c)} | ${pct(c)} |`), ''] : []),
  ...(review.length ? ['## Held for review (not written)', '', 'Moves over 25% or announced products: check the link, or rerun with `--force`.', '', '| Item | Region | Was | Store | Δ |', '|---|---|---:|---:|---:|',
    ...review.map((c) => `| [${c.id}](${c.url}) | ${c.region} | ${c.stored} | ${amountOf(c)} | ${pct(c)}${c.announced ? ' (announced)' : ''} |`), ''] : []),
  ...(ambiguous.length ? ['## Ambiguous (not written)', '', ...ambiguous.map((c) => `- ${c.id} ${c.region}: ${reasonOf(c)} — ${c.url}`), ''] : []),
  ...(blocked.length ? ['## Blocked by store bot protection (not checked)', '', ...Object.entries(Object.groupBy(blocked, (c) => new URL(c.url).hostname)).map(([host, list]) => `- ${host}: ${list!.length} prices`), ''] : []),
  ...(failed.length ? ['## Failed', '', ...failed.map((c) => `- ${c.id} ${c.region}: ${reasonOf(c)} — ${c.url}`), ''] : []),
];
const report = lines.join('\n');
if (option('report')) writeFileSync(option('report')!, report);
console.log(report);
