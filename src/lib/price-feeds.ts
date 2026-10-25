import { parse, stringify } from 'yaml';
import { PriceHistorySchema } from './schema.ts';

/**
 * Store price feeds: turn a stored price URL into a machine-readable request, and read the
 * current price back out. Pure functions; the network lives in scripts/refresh-prices.ts.
 *
 * Supported: Shopify product JSON (VKB US), WooCommerce Store API (flightsimcontrols EU/UK),
 * the WINCTRL shop API (EU/UK/US) and Magento GraphQL (VIRPIL EU/UK/US).
 */

export type FeedKind = 'shopify' | 'woocommerce' | 'winctrl' | 'magento';
/** Price moves bigger than this are reported for review instead of written (likely a wrong link or a deposit). */
export const MAX_AUTO_CHANGE = 0.25;

export interface FeedRequest { kind: FeedKind; url: string; method: 'GET' | 'POST'; body?: string; headers?: Record<string, string> }
export type FeedResult =
  | { ok: true; amount: number; currency?: string; inStock?: boolean; note?: string }
  | { ok: false; reason: string; ambiguous?: boolean };

const shopifyHosts = new Set(['vkbsimcontrollers.com']);
const wooHosts = new Set(['flightsimcontrols.com', 'flightsimcontrols.co.uk']);
// us.winwingsim.com redirects to winctrl.com, which serves the US prices.
const winctrlApiHost: Record<string, string> = { 'eu.winctrl.com': 'eu.winctrl.com', 'uk.winctrl.com': 'uk.winctrl.com', 'winctrl.com': 'winctrl.com', 'us.winwingsim.com': 'winctrl.com' };
const magentoHosts = new Set(['virpil-controls.eu', 'virpil-controls.co.uk', 'virpil-controls.us.com']);

const magentoQuery = (urlKey: string) =>
  `{products(filter:{url_key:{eq:${JSON.stringify(urlKey)}}}){items{sku name stock_status price_range{minimum_price{final_price{value currency}}maximum_price{final_price{value currency}}}}}}`;

export function feedRequest(priceUrl: string): FeedRequest | null {
  let url: URL;
  try { url = new URL(priceUrl); } catch { return null; }
  const host = url.hostname.replace(/^www\./, '');
  if (shopifyHosts.has(host)) {
    const handle = url.pathname.match(/^\/products\/([^/]+)\/?$/)?.[1];
    if (!handle) return null;
    const variant = url.searchParams.get('variant');
    return { kind: 'shopify', method: 'GET', url: `https://${host}/products/${handle}.json${variant ? `?variant=${variant}` : ''}` };
  }
  if (wooHosts.has(host)) {
    const slug = url.pathname.match(/^\/product\/([^/]+)\/?$/)?.[1];
    return slug ? { kind: 'woocommerce', method: 'GET', url: `https://${host}/wp-json/wc/store/v1/products?slug=${encodeURIComponent(slug)}` } : null;
  }
  if (host in winctrlApiHost) {
    const id = url.pathname.match(/^\/p\/(\d+)\.html$/)?.[1] ?? url.searchParams.get('id');
    if (!id || !/^\d+$/.test(id)) return null;
    const sku = url.searchParams.get('sku_id');
    return { kind: 'winctrl', method: 'GET', url: `https://${winctrlApiHost[host]}/home/shop/get?id=${id}${sku ? `&sku_id=${sku}` : ''}`, headers: { 'X-Requested-With': 'XMLHttpRequest' } };
  }
  if (magentoHosts.has(host)) {
    const key = url.pathname.match(/^\/([^/]+)\.html$/)?.[1];
    // GET: the UK and US stores' firewalls reject GraphQL POSTs from scripts.
    return key ? { kind: 'magento', method: 'GET', url: `https://${host}/graphql?query=${encodeURIComponent(magentoQuery(key))}` } : null;
  }
  return null;
}

const round = (n: number) => Math.round(n * 100) / 100;

export function parseFeed(request: FeedRequest, body: unknown): FeedResult {
  try {
    if (request.kind === 'shopify') {
      const variants: { id: number; price: string; available?: boolean }[] = (body as any)?.product?.variants ?? [];
      if (!variants.length) return { ok: false, reason: 'no variants in product JSON' };
      const wanted = new URL(request.url).searchParams.get('variant');
      const pick = wanted ? variants.find((v) => String(v.id) === wanted) : undefined;
      if (wanted && !pick) return { ok: false, reason: `variant ${wanted} not found` };
      const prices = [...new Set(variants.map((v) => Number(v.price)))];
      if (!pick && prices.length > 1) return { ok: false, ambiguous: true, reason: `${variants.length} variants priced ${Math.min(...prices)}-${Math.max(...prices)}; add ?variant= to the URL` };
      const chosen = pick ?? variants[0];
      return { ok: true, amount: round(Number(chosen.price)), ...(chosen.available != null ? { inStock: chosen.available } : {}) };
    }
    if (request.kind === 'woocommerce') {
      const product = Array.isArray(body) ? body[0] : undefined;
      if (!product) return { ok: false, reason: 'product slug not found' };
      const p = product.prices, unit = 10 ** (p?.currency_minor_unit ?? 2);
      const min = Number(p?.price_range?.min_amount ?? p?.price), max = Number(p?.price_range?.max_amount ?? p?.price);
      if (min !== max) return { ok: false, ambiguous: true, reason: `variable product priced ${min / unit}-${max / unit} ${p.currency_code}` };
      return { ok: true, amount: round(Number(p.price) / unit), currency: p.currency_code, inStock: product.is_in_stock };
    }
    if (request.kind === 'winctrl') {
      const data = (body as any)?.data;
      if (!data || data.price == null) return { ok: false, reason: 'no price in shop API response' };
      const wanted = new URL(request.url).searchParams.get('sku_id');
      if (wanted && String(data.now_sku?.id) !== wanted) return { ok: false, reason: `SKU ${wanted} not returned` };
      return { ok: true, amount: round(Number(data.price)), inStock: Number(data.total_stock) > 0 };
    }
    const items = (body as any)?.data?.products?.items ?? [];
    if (items.length !== 1) return { ok: false, reason: items.length ? `${items.length} products match the URL key` : 'product not found' };
    const range = items[0].price_range, min = range.minimum_price.final_price, max = range.maximum_price.final_price;
    if (min.value !== max.value) return { ok: false, ambiguous: true, reason: `configurable product priced ${min.value}-${max.value} ${min.currency}` };
    return { ok: true, amount: round(min.value), currency: min.currency, inStock: items[0].stock_status === 'IN_STOCK' };
  } catch (error) {
    return { ok: false, reason: `unreadable response: ${(error as Error).message}` };
  }
}

/**
 * Update one price entry in a YAML file's text without reformatting the rest of the file.
 * Finds the `- region: <region>` list item whose `url:` matches, then rewrites its amount,
 * verified date and source lines. Returns null when no such entry exists.
 */
export function updatePriceText(text: string, region: string, url: string, amount: number, verified: string): string | null {
  const lines = text.split(/\r?\n/);
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  for (let start = 0; start < lines.length; start++) {
    const head = lines[start].match(/^(\s*)- region: (\S+)\s*$/);
    if (!head || head[2] !== region) continue;
    const indent = head[1] + '  ';
    let end = start + 1;
    while (end < lines.length && lines[end].startsWith(indent) && !lines[end].startsWith(`${head[1]}- `)) end++;
    const block = lines.slice(start, end);
    const field = (key: string) => block.findIndex((line, i) => (i === 0 ? line.replace(/^(\s*)- /, '$1  ') : line).startsWith(`${indent}${key}:`));
    const urlAt = field('url');
    if (urlAt < 0 || block[urlAt].split('url:')[1].trim().replace(/^['"]|['"]$/g, '') !== url) continue;
    const set = (key: string, value: string) => {
      const at = field(key);
      if (at > 0) block[at] = `${indent}${key}: ${value}`;
      else block.push(`${indent}${key}: ${value}`);
    };
    // Parse the matching entry so nested history fields cannot shadow current values.
    const previous = parse(block.join('\n'))[0];
    if (previous.amount !== amount) {
      const history = [...PriceHistorySchema.parse(previous.history ?? []), { amount: previous.amount, verified: previous.verified }];
      const unique = history.filter((entry, index) => !history.slice(index + 1).some(
        (later) => later.amount === entry.amount && later.verified === entry.verified,
      ));
      const nextHistory = PriceHistorySchema.parse(unique.slice(-10));
      const historyAt = block.findIndex((line) => line.startsWith(`${indent}history:`));
      if (historyAt >= 0) {
        let historyEnd = historyAt + 1;
        while (historyEnd < block.length && (block[historyEnd].startsWith(`${indent}  `) || block[historyEnd].startsWith(`${indent}- `))) historyEnd++;
        block.splice(historyAt, historyEnd - historyAt);
      }
      block.push(...stringify({ history: nextHistory }).trimEnd().split('\n').map((line) => indent + line));
    }
    set('amount', String(amount));
    set('verified', `'${verified}'`);
    set('source', 'feed');
    lines.splice(start, end - start, ...block);
    return lines.join(eol);
  }
  return null;
}
