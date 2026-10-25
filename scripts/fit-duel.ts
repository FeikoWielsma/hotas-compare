/**
 * Local "this or that" game for tuning use-case fit scores. Not part of the site build.
 *
 *   pnpm fit:duel              then open http://localhost:4329
 *   --port=<n>
 *
 * Votes are appended to research-tools/fit-duel/votes.jsonl; `pnpm fit:retune` turns them into scores.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { products, readContent } from './content.ts';
import { readVotes, VOTES_DIR, VOTES_FILE } from './fit-votes.ts';
import { duelPools, pickDuel, poolOf, type DuelPool, type DuelVote } from '../src/lib/fit-duel.ts';
import { UseCaseEnum, type UseCase } from '../src/lib/schema.ts';

const port = Number(process.argv.find((a) => a.startsWith('--port='))?.split('=')[1] ?? 4329);
const RESULTS = new Set(['a', 'b', 'tie', 'both_good', 'both_bad', 'skip']);

function items() {
  return products().filter((p) => p.collection === 'components').map(({ file, id, data }) => {
    const c = data as Extract<typeof data, { category: unknown; controls: unknown }>;
    const controls = new Map<string, number>();
    for (const control of c.controls) controls.set(control.type, (controls.get(control.type) ?? 0) + ('count' in control ? control.count ?? 1 : 1));
    const price = c.prices.find((p) => p.region === 'EU') ?? c.prices[0];
    const hw = c.hardware;
    const facts = [
      hw?.gimbal_type?.replaceAll('_', ' '), hw?.sensor, hw?.throw_deg ? `${hw.throw_deg}° throw` : null,
      hw?.force_adjustable ? 'adjustable force' : null, hw?.damper ? `damper: ${hw.damper}` : null,
      c.mount?.provides ? `mount: ${c.mount.provides}` : null,
    ].filter(Boolean);
    return {
      id, pool: poolOf(c.category, c.name), category: c.category, brand: c.brand, name: c.name, status: c.status,
      image: c.images[0]?.file ? (c.images[0].file.startsWith('/') ? c.images[0].file : `/images/${c.images[0].file}`) : null,
      price: price ? new Intl.NumberFormat('en', { style: 'currency', currency: price.currency, maximumFractionDigits: 0 }).format(price.amount) : null,
      controls: Object.fromEntries(controls), facts,
      fit: c.use_case_fit, fit_explicit: Boolean(readContent(file).use_case_fit),
    };
  });
}

const TYPES: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.avif': 'image/avif' };
const all = items();
const catalog = JSON.stringify(all);
const listParam = <T extends string>(url: URL, name: string, allowed: readonly T[]) => {
  const values = url.searchParams.get(name)?.split(',').filter((v): v is T => (allowed as readonly string[]).includes(v));
  return values?.length ? values : [...allowed];
};

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const send = (status: number, body: string | Buffer, type = 'application/json; charset=utf-8') => {
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' }).end(body);
  };
  try {
    if (url.pathname === '/') return send(200, readFileSync('scripts/fit-duel.html'), 'text/html; charset=utf-8');
    if (url.pathname === '/api/items') return send(200, catalog);
    if (url.pathname === '/api/votes' && req.method === 'GET') return send(200, JSON.stringify(readVotes()));
    if (url.pathname === '/api/next') {
      const pools = listParam(url, 'pools', Object.keys(duelPools) as DuelPool[]);
      const useCases = listParam<UseCase>(url, 'use_cases', UseCaseEnum.options);
      const pool = url.searchParams.has('include_discontinued') ? all : all.filter((item) => item.status !== 'discontinued');
      return send(200, JSON.stringify(pickDuel(pool, readVotes(), useCases, pools)));
    }
    if (url.pathname === '/api/votes' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        const v = JSON.parse(body);
        if (!UseCaseEnum.safeParse(v.use_case).success || !RESULTS.has(v.result) || typeof v.a !== 'string' || typeof v.b !== 'string') return send(400, '{"error":"bad vote"}');
        const vote: DuelVote = { t: new Date().toISOString(), use_case: v.use_case, a: v.a, b: v.b, result: v.result };
        mkdirSync(VOTES_DIR, { recursive: true });
        appendFileSync(VOTES_FILE, JSON.stringify(vote) + '\n');
        send(200, JSON.stringify(vote));
      });
      return;
    }
    if (url.pathname === '/api/votes/last' && req.method === 'DELETE') {
      const votes = readVotes();
      const removed = votes.pop();
      writeFileSync(VOTES_FILE, votes.map((v) => JSON.stringify(v) + '\n').join(''));
      return send(200, JSON.stringify(removed ?? null));
    }
    if (url.pathname.startsWith('/images/')) {
      const file = normalize(join('public', decodeURIComponent(url.pathname)));
      if (!file.startsWith(normalize('public/images')) || !existsSync(file)) return send(404, 'not found', 'text/plain');
      return send(200, readFileSync(file), TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream');
    }
    send(404, 'not found', 'text/plain');
  } catch (error) {
    send(500, JSON.stringify({ error: String(error) }));
  }
}).listen(port, '127.0.0.1', () => console.log(`Fit duel on http://localhost:${port}  (votes → ${VOTES_FILE})`));
