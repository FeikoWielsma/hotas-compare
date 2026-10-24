import { contentFiles, readContent } from './content.ts';

type Result = { status: 'ok' | 'broken' | 'unverifiable'; detail: string };
const userAgent = 'HOTASCompare-LinkAudit/1.0 (+https://github.com/FeikoWielsma/hotas-compare)';

function auditUrls(data: any): string[] {
  return [...(data.prices ?? []).map((p: any) => p.url), ...(data.sources ?? []), ...(data.images ?? []).map((i: any) => i.source), ...(data.external_reviews ?? []).map((r: any) => r.url), ...(data.platform && data.url ? [data.url] : [])].filter((url): url is string => typeof url === 'string' && /^https?:\/\//i.test(url));
}

export function homepageRedirect(original: string, final: string): boolean {
  const from = new URL(original);
  const to = new URL(final);
  const home = (url: URL) => /^\/(?:[a-z]{2}(?:[-_][a-z]{2})?\/?)?$/i.test(url.pathname) && !url.search;
  return !home(from) && home(to);
}

export function classify(url: string, final: string, status: number): Result {
  if ([401, 403, 429].includes(status)) return { status: 'unverifiable', detail: `HTTP ${status} (access restriction / bot protection)` };
  if (status < 200 || status >= 300) return { status: 'broken', detail: `HTTP ${status}` };
  if (homepageRedirect(url, final)) return { status: 'broken', detail: `redirects to homepage: ${final}` };
  if (/(^|\.)(winctrl\.com|winwing\.cn)$/.test(new URL(final).hostname)) return { status: 'unverifiable', detail: 'HTTP 2xx; JS storefront needs manual verification' };
  return { status: 'ok', detail: `HTTP ${status}` };
}

async function main() {
  const references = new Map<string, Set<string>>();
  for (const file of contentFiles()) for (const url of auditUrls(readContent(file))) {
    const files = references.get(url) ?? new Set();
    files.add(file);
    references.set(url, files);
  }
  const hosts = new Map<string, string[]>();
  for (const url of references.keys()) {
    const host = new URL(url).host;
    const queue = hosts.get(host) ?? [];
    queue.push(url);
    hosts.set(host, queue);
  }
  const results = new Map<string, Result>();
  const pending: (() => void)[] = [];
  let active = 0;
  async function request(url: string, method: string, throttle: () => Promise<void>) {
    await throttle();
    if (active >= 12) await new Promise<void>(resolve => pending.push(resolve));
    else active++;
    try {
      const response = await fetch(url, { method, headers: { 'User-Agent': userAgent }, redirect: 'follow', signal: AbortSignal.timeout(12000) });
      const result = { status: response.status, url: response.url };
      await response.body?.cancel();
      return result;
    } finally {
      const next = pending.shift();
      if (next) next(); else active--;
    }
  }
  console.log(`Checking ${references.size} unique URLs across ${hosts.size} hosts (HEAD, GET fallback; 2 workers/host, 250ms between starts; 12 requests globally).`);
  await Promise.all([...hosts.entries()].map(async ([host, queue]) => {
    let nextStart = 0;
    async function throttle() {
      const start = Math.max(Date.now(), nextStart);
      nextStart = start + 250;
      await new Promise(resolve => setTimeout(resolve, Math.max(0, start - Date.now())));
    }
    async function worker() {
      let url: string | undefined;
      while ((url = queue.shift())) {
        try {
          let response;
          try { response = await request(url, 'HEAD', throttle); } catch { /* Retry with GET below. */ }
          if (!response || response.status < 200 || response.status >= 300 || homepageRedirect(url, response.url)) response = await request(url, 'GET', throttle);
          results.set(url, classify(url, response.url, response.status));
        } catch (error) {
          results.set(url, { status: 'unverifiable', detail: error instanceof Error ? `${error.name}: ${error.message}` : String(error) });
        }
      }
    }
    await Promise.all([worker(), worker()]);
    console.log(`Finished ${host}`);
  }));
  const grouped = new Map<string, string[]>();
  const totals = { ok: 0, broken: 0, unverifiable: 0 };
  for (const [url, result] of results) {
    totals[result.status]++;
    if (result.status === 'ok') continue;
    for (const file of references.get(url)!) {
      const lines = grouped.get(file) ?? [];
      lines.push(`  ${result.status}: ${url}\n    ${result.detail}`);
      grouped.set(file, lines);
    }
  }
  for (const [file, lines] of [...grouped].sort(([a], [b]) => a.localeCompare(b))) console.log(`${file}\n${lines.join('\n')}`);
  console.log(`Summary (unique URLs): ${totals.ok} ok; ${totals.broken} broken; ${totals.unverifiable} unverifiable.`);
}

if (import.meta.main) await main();
