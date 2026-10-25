import { isSuperseded } from './successors';
import type { CatalogItem } from './catalog';
import { contactless, overallScore } from './catalog-ui';
import type { Platform } from './platforms';

export interface CatalogFilters {
  showDiscontinued?: boolean;
  search?: string;
  categories?: string[];
  brands?: string[];
  minimum?: number;
  maximum?: number;
  ministick?: boolean;
  brake?: boolean;
  sensors?: boolean;
  fit?: string;
  minimumFit?: number;
  handedness?: string;
  minimumAxes?: number;
  minimumInputs?: number;
  itemType?: string;
  priceAvailability?: string;
  sort?: string;
  platform?: Platform | '';
  gimbalTypes?: string[];
}

/** Filter a regional catalog projection. Unknown counts cannot meet a positive minimum. */
const reviewTagWeight: Record<string, number> = { recommended: 30, mixed: 0, neutral: 0, avoid: -40 };

export function filterCatalog(items: CatalogItem[], filters: CatalogFilters = {}): CatalogItem[] {
  const query = (filters.search ?? '').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const meetsMinimum = (count: number, minimum?: number) => minimum == null || minimum <= 0 || (Number.isFinite(count) && count > 0 && count >= minimum);
  return items.filter((item) => {
    const text = [item.name, item.brandName, item.brand, ...item.formerBrandNames, item.category.replaceAll('_', ' '), item.sensor ?? '', item.gimbal ?? '', item.item_type, item.hasMinistick ? 'ministick' : '', item.hasBrakeAxis ? 'brake' : ''].join(' ').toLocaleLowerCase();
    const amount = item.resolvedPrice.price?.amount;
    const fit = filters.fit === 'ga_airliner' ? Math.max(item.use_case_fit.ga, item.use_case_fit.airliner) : item.use_case_fit[filters.fit as keyof CatalogItem['use_case_fit']] ?? 0;
    return (filters.showDiscontinued || !isSuperseded(item))
      && query.every((word) => text.includes(word))
      && (!filters.categories?.length || filters.categories.includes(item.category))
      && (!filters.gimbalTypes?.length || (item.gimbalType != null && filters.gimbalTypes.includes(item.gimbalType)))
      && (!filters.brands?.length || filters.brands.includes(item.brand))
      && (filters.minimum == null || (amount != null && amount >= filters.minimum))
      && (filters.maximum == null || (amount != null && amount <= filters.maximum))
      && (!filters.ministick || item.hasMinistick) && (!filters.brake || item.hasBrakeAxis)
      && (!filters.sensors || contactless(item)) && (!filters.fit || fit >= (filters.minimumFit ?? 4))
      && (!filters.handedness || item.handedness.includes(filters.handedness))
      && meetsMinimum(item.totalAxes, filters.minimumAxes) && meetsMinimum(item.totalLogicalButtons, filters.minimumInputs)
      && (!filters.itemType || item.item_type === filters.itemType)
      && (!filters.platform || item.platform_compatibility?.[filters.platform] === 'supported')
      && (!filters.priceAvailability || (filters.priceAvailability === 'available' ? amount != null : amount == null));
  }).sort((a, b) => {
    let result = 0;
    if (filters.sort?.startsWith('price')) {
      const ap = a.resolvedPrice.price?.amount, bp = b.resolvedPrice.price?.amount;
      result = ap == null ? bp == null ? 0 : 1 : bp == null ? -1 : filters.sort === 'price-low' ? ap - bp : bp - ap;
    } else if (filters.sort === 'buttons') result = b.totalLogicalButtons - a.totalLogicalButtons;
    else if (filters.sort === 'axes') result = b.totalAxes - a.totalAxes;
    else if (filters.sort === 'score') result = (overallScore(b) ?? -1) - (overallScore(a) ?? -1);
    else if (filters.sort === 'featured') {
      // Known-good hardware first: our own verdict scores plus the latest external review tag
      // (recommended lifts, avoid sinks below unreviewed items); then verified, current, documented.
      result = featuredRank(b) - featuredRank(a);
    }
    return result || a.name.localeCompare(b.name);
  });
}

/** Recommended-sort weight: our verdict scores, the latest review tag, then data quality. */
export function featuredRank(item: CatalogItem) {
  return (overallScore(item) ?? 0) * 10 + (reviewTagWeight[item.reviewTag ?? ''] ?? 0)
    + (item.verification === 'verified' ? 5 : 0)
    + (item.status === 'current' ? 2 : 0) + (item.images.length ? 1 : 0) + (item.totalLogicalButtons > 0 ? 1 : 0);
}

/** Human-readable reasons behind featuredRank, strongest first. */
export function rankReasons(item: CatalogItem): string[] {
  const out: string[] = [];
  const review = item.latestReview;
  if (review) out.push(`${review.reviewerName}: ${review.tag}${review.tag === 'avoid' ? ' (ranked lower)' : ''}`);
  const score = overallScore(item);
  if (score != null) out.push(`Our verdict ${Number(score.toFixed(1))}/5`);
  if (item.verification === 'verified') out.push('Specs verified');
  if (item.status === 'current') out.push('Currently sold');
  return out;
}

const handPatterns: [RegExp, string][] = [
  [/\s*\((left|right)(?:[- ]hand(?:ed)?)?\)/i, ''], [/\s*-\s*(left|right)[- ]hand(?:ed)?$/i, ''],
  [/\s+(left|right)[- ]hand(?:ed)?$/i, ''], [/\s+(left|right)$/i, ''], [/\[(l|r)(z?)\]/i, '[$2]'],
];

/** The handedness of a mirrored product variant and the name it shares with its twin, if any. */
export function handVariant(name: string): { key: string; hand: 'left' | 'right' } | null {
  for (const [pattern, replacement] of handPatterns) {
    const match = name.match(pattern);
    if (!match) continue;
    const hand = match[1].toLowerCase().startsWith('l') ? 'left' : 'right';
    return { key: name.replace(pattern, replacement).replace(/\[\]\s*/, '').trim().toLocaleLowerCase(), hand };
  }
  return null;
}

/** Collapse left/right twins (same brand, category and base name) into one entry, keeping sort order; right hand first. */
export function groupHandVariants(items: CatalogItem[]): CatalogItem[][] {
  const groups = new Map<string, CatalogItem[]>();
  for (const item of items) {
    const variant = handVariant(item.name);
    const key = variant ? `${item.brand}|${item.category}|${variant.key}` : `id|${item.id}`;
    const group = groups.get(key);
    if (group) group.push(item); else groups.set(key, [item]);
  }
  return [...groups.values()].map((group) => group.sort((a, b) => (handVariant(a.name)?.hand === 'right' ? 0 : 1) - (handVariant(b.name)?.hand === 'right' ? 0 : 1)));
}
