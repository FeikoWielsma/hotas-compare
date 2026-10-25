import { isSuperseded } from './successors';
import type { CatalogItem } from './catalog';
import { contactless, overallScore } from './catalog-ui';
import type { Platform } from './platforms';
import type { UseCase } from './schema';

export interface CatalogFilters {
  showDiscontinued?: boolean;
  showIndividualParts?: boolean;
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
  /** The visitor's flying styles; `sort: 'match'` ranks by their average fit. */
  fits?: UseCase[];
}

/** Average fit across the chosen flying styles, or null when none are chosen. */
export function matchScore(item: Pick<CatalogItem, 'use_case_fit'>, fits: UseCase[]): number | null {
  return fits.length ? fits.reduce((sum, key) => sum + item.use_case_fit[key], 0) / fits.length : null;
}

/** Filter a regional catalog projection. Unknown counts cannot meet a positive minimum. */
const reviewTagWeight: Record<string, number> = { recommended: 60, mixed: 0, neutral: 0, avoid: -300 };

export function filterCatalog(items: CatalogItem[], filters: CatalogFilters = {}): CatalogItem[] {
  const query = (filters.search ?? '').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const meetsMinimum = (count: number, minimum?: number) => minimum == null || minimum <= 0 || (Number.isFinite(count) && count > 0 && count >= minimum);
  return items.filter((item) => {
    const text = [item.name, item.brandName, item.brand, ...item.formerBrandNames, item.category.replaceAll('_', ' '), item.yokePart ? `yoke ${item.yokePart}` : '', item.sensor ?? '', item.gimbal ?? '', item.item_type, item.hasMinistick ? 'ministick' : '', item.hasBrakeAxis ? 'brake' : ''].join(' ').toLocaleLowerCase();
    const amount = item.resolvedPrice.price?.amount;
    const fit = filters.fit === 'ga_airliner' ? Math.max(item.use_case_fit.ga, item.use_case_fit.airliner) : item.use_case_fit[filters.fit as keyof CatalogItem['use_case_fit']] ?? 0;
    return (filters.showDiscontinued || !isSuperseded(item))
      && (filters.showIndividualParts || item.item_type !== 'component' || (item.soldStandalone !== false && !item.soldMainlyInBundle))
      && query.every((word) => text.includes(word))
      && (!filters.categories?.length || filters.categories.includes(item.category) || (item.yokePart === 'base' && filters.categories.includes('yoke')))
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
    else if (filters.sort === 'match' && filters.fits?.length) result = matchScore(b, filters.fits)! - matchScore(a, filters.fits)! || featuredRank(b) - featuredRank(a);
    else if (filters.sort?.startsWith('fit:')) {
      const key = filters.sort.slice(4) as UseCase;
      result = (b.use_case_fit[key] ?? 0) - (a.use_case_fit[key] ?? 0) || featuredRank(b) - featuredRank(a);
    } else if (filters.sort === 'featured' || filters.sort === 'match') {
      // Shopping readiness and review signals first; card diversity follows grouping.
      result = featuredRank(b) - featuredRank(a);
    }
    return result || a.name.localeCompare(b.name);
  });
}

/** Shopping readiness, independent of whether the catalog stores a product as a bundle. */
function setupWeight(item: CatalogItem): number {
  if (['hotas_bundle', 'hosas_bundle', 'system', 'yoke_bundle'].includes(item.category)) return 80;
  if (['stick_fixed', 'stick_combo', 'throttle', 'yoke'].includes(item.category)) return 60;
  if (['pedals', 'quadrant'].includes(item.category)) return 20;
  return 0;
}

/** Review signals outweigh documentation bonuses; avoid remains below unreviewed setups. */
export function featuredRank(item: CatalogItem) {
  return setupWeight(item) + (overallScore(item) ?? 0) * 20 + (reviewTagWeight[item.reviewTag ?? ''] ?? 0)
    + (item.verification === 'verified' ? 5 : 0)
    + (item.status === 'current' ? 2 : 0) + (item.images.length ? 1 : 0) + (item.totalLogicalButtons > 0 ? 1 : 0);
}

/** Human-readable factors behind the base rank and the card diversity pass. */
export function rankReasons(item: CatalogItem): string[] {
  const out: string[] = [];
  const review = item.latestReview;
  if (review) out.push(`${review.reviewerName}: ${review.tag}${review.tag === 'avoid' ? ' (ranked lower)' : ''}`);
  const score = overallScore(item);
  if (score != null) out.push(`Our verdict ${Number(score.toFixed(1))}/5`);
  const setup = setupWeight(item);
  out.push(setup === 80 ? 'Complete setup bundle' : setup === 60 ? 'Main flight control' : setup === 20 ? 'Additional flight control' : 'Separate part or module (lower setup priority)');
  if (item.verification === 'verified') out.push('Specs verified');
  if (item.status === 'current') out.push('Currently sold');
  if (item.images.length) out.push('Product photo available');
  if (item.totalLogicalButtons > 0) out.push('Inputs documented');
  out.push('First 12 cards balance categories and brands; family variants share one place');
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

/** The hand a mirrored variant is for: its single documented handedness, else its name. */
export function handOf(item: Pick<CatalogItem, 'handedness' | 'name'>): 'left' | 'right' | null {
  const [only, ...rest] = item.handedness;
  if (!rest.length && (only === 'left' || only === 'right')) return only;
  return handVariant(item.name)?.hand ?? null;
}

export interface CatalogGroup {
  /** Stable across filter changes for a family, so a card keeps its picked variant. */
  key: string;
  family: NonNullable<CatalogItem['family']> | null;
  /** Picker options: family labels in family order (one unlabelled option otherwise), each with its hand twins, right hand first. */
  options: { label: string; variants: CatalogItem[] }[];
  /** The member placed first by the current sort; the card shows it until another is picked. */
  lead: CatalogItem;
}

/**
 * One grid entry per family (members collapsed under their labels) or per left/right twin pair.
 * Run after filtering: a group appears if any member matched and lists only matching members.
 * Groups keep the sort position of their best-placed member.
 */
export function groupCatalog(items: CatalogItem[], sort?: string): CatalogGroup[] {
  const position = new Map(items.map((item, index) => [item.id, index]));
  const families = new Map<string, CatalogItem[]>();
  const loose: CatalogItem[] = [];
  for (const item of items) {
    if (!item.family) { loose.push(item); continue; }
    const members = families.get(item.family.id);
    if (members) members.push(item); else families.set(item.family.id, [item]);
  }
  const handRank = (item: CatalogItem) => handOf(item) === 'right' ? 0 : 1;
  const groups: CatalogGroup[] = [...families.values()].map((members) => {
    const labels = new Map<string, CatalogItem[]>();
    for (const member of [...members].sort((a, b) => a.family!.tier - b.family!.tier)) {
      const twins = labels.get(member.family!.label);
      if (twins) twins.push(member); else labels.set(member.family!.label, [member]);
    }
    return {
      key: `family|${members[0].family!.id}`, family: members[0].family!, lead: members[0],
      options: [...labels].map(([label, variants]) => ({ label, variants: variants.sort((a, b) => handRank(a) - handRank(b)) })),
    };
  });
  for (const twins of groupHandVariants(loose)) groups.push({ key: `item|${twins[0].id}`, family: null, lead: twins[0], options: [{ label: '', variants: twins }] });
  const first = (group: CatalogGroup) => Math.min(...group.options.flatMap((option) => option.variants.map((item) => position.get(item.id)!)));
  const ordered = groups.sort((a, b) => first(a) - first(b));
  return sort === 'featured' ? diversifyFeatured(ordered) : ordered;
}

/** Soft repetition penalties applied to cards, never individual family members.
 * No quotas: a weak part cannot earn a place merely by being a new category.
 * After the first 12 cards the remaining results keep their base ranking.
 */
function diversifyFeatured(groups: CatalogGroup[]): CatalogGroup[] {
  const remaining = [...groups];
  const selected: CatalogGroup[] = [];
  const categories = new Map<string, number>();
  const brands = new Map<string, number>();
  const score = ({ lead }: CatalogGroup) => featuredRank(lead)
    - Math.min(80, 35 * (categories.get(lead.category) ?? 0) + 20 * (brands.get(lead.brand) ?? 0));
  while (remaining.length && selected.length < 12) {
    const eligible = remaining.filter((group) => group.lead.reviewTag !== 'avoid');
    const pool = eligible.length ? eligible : remaining;
    const best = pool.reduce((a, b) => score(b) > score(a) ? b : a);
    selected.push(best);
    remaining.splice(remaining.indexOf(best), 1);
    categories.set(best.lead.category, (categories.get(best.lead.category) ?? 0) + 1);
    brands.set(best.lead.brand, (brands.get(best.lead.brand) ?? 0) + 1);
  }
  return [...selected, ...remaining];
}
