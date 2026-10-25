/**
 * Community tier lists for use-case fit: one list ranks one group of parts for one use case.
 * A list travels as a share link (/tiers?uc=…&g=…&r=…), so the site needs no backend;
 * scripts/tiers-import.ts combines collected links into proposed fit scores.
 */
import { baselineFit } from './fit-baseline.ts';
import { fitGroupIds, groupOf, isPlaceholderFit, isUnreviewedFit, tierLineName, toFitScore, type FitGroup } from './fit-groups.ts';
import { UseCaseEnum, type Component, type UseCase, type UseCaseFit } from './schema.ts';

export const TIERS = [5, 4, 3, 2, 1] as const;
export type Tier = (typeof TIERS)[number];
export const tierLabels: Record<Tier, string> = { 5: 'Excellent', 4: 'Good', 3: 'Fine', 2: 'Weak', 1: 'Poor' };

const CODE_LENGTH = 5;
/** Short, stable item code for links: FNV-1a of the component id. Unlike list positions, it survives catalog changes. */
export function itemCode(id: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) hash = Math.imul(hash ^ id.charCodeAt(i), 0x01000193) >>> 0;
  return hash.toString(36).padStart(CODE_LENGTH, '0').slice(-CODE_LENGTH);
}

/**
 * One tile on the tier list page: a part, or several parts ranked as one (see tierLineName). `id` is the first
 * member's id. `fit` is the editorial score, or the spec baseline when `estimated`; `scored` is false when even
 * that is an uninformative placeholder, so the entry starts unranked.
 */
export interface TierItem { id: string; members: string[]; name: string; brandName: string; image: string | null; group: FitGroup; fit: UseCaseFit; estimated: boolean; scored: boolean }

export interface TierPart { id: string; brandName: string; image: string | null; data: Component; familyName?: string }

const median = (values: number[]) => {
  const sorted = values.toSorted((a, b) => a - b), mid = sorted.length / 2;
  return sorted.length % 2 ? sorted[Math.floor(mid)] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * Tier list tiles: parts of one brand and group that share a tier line become one entry. Its starting fit is
 * the median of the members' editorial scores, or of their spec baselines when none is reviewed.
 */
export function buildTierItems(parts: TierPart[]): TierItem[] {
  const entries = Map.groupBy(parts, (p) => `${groupOf(p.data.category, p.data.name)}|${p.data.brand}|${tierLineName(p.data, p.familyName)}`);
  return [...entries.values()].map((members) => {
    const first = members[0];
    const reviewed = members.filter((m) => !isUnreviewedFit(m.data.use_case_fit, m.data.use_case_fit_source));
    const fits = reviewed.length ? reviewed.map((m) => m.data.use_case_fit) : members.map((m) => baselineFit(m.data).fit);
    const fit = Object.fromEntries(UseCaseEnum.options.map((u) => [u, median(fits.map((f) => f[u]))])) as UseCaseFit;
    return {
      id: first.id, members: members.map((m) => m.id), name: members.length > 1 ? tierLineName(first.data, first.familyName) : first.data.name,
      brandName: first.brandName, image: members.find((m) => m.image)?.image ?? null,
      group: groupOf(first.data.category, first.data.name), fit, estimated: !reviewed.length, scored: !isPlaceholderFit(fit),
    };
  });
}

/** Links store every member, so combining lists and later regrouping both keep working per part. */
export function expandTiers(items: TierItem[], tiers: Map<string, Tier>): Map<string, Tier> {
  return new Map(items.flatMap((item) => (tiers.has(item.id) ? item.members.map((id) => [id, tiers.get(item.id)!] as const) : [])));
}

/** Entry tiers from a link's per-part tiers; an entry takes the tier of its first ranked member. */
export function collapseTiers(items: TierItem[], memberTiers: Map<string, Tier>): Map<string, Tier> {
  return new Map(items.flatMap((item) => {
    const tier = item.members.map((id) => memberTiers.get(id)).find((t) => t != null);
    return tier ? [[item.id, tier] as const] : [];
  }));
}

export interface TierList { useCase: UseCase; group: FitGroup; by?: string; tiers: Map<string, Tier> }

/** `r` lists each tier as its digit followed by item codes, tiers separated by `.`: `5abcdefghij.3klmno`. */
export function serializeTierList(list: TierList): URLSearchParams {
  const params = new URLSearchParams({ uc: list.useCase, g: list.group });
  const r = TIERS.map((tier) => {
    const codes = [...list.tiers].filter(([, t]) => t === tier).map(([id]) => itemCode(id)).sort();
    return codes.length ? tier + codes.join('') : '';
  }).filter(Boolean).join('.');
  if (r) params.set('r', r);
  if (list.by?.trim()) params.set('by', list.by.trim().slice(0, 40));
  return params;
}

/** Reads a share link (or its query); unknown codes are dropped, so links outlive removed products. */
export function parseTierList(input: URLSearchParams | string, itemIds: string[]): TierList | null {
  const params = typeof input === 'string' ? new URL(input, 'https://x.invalid').searchParams : input;
  const useCase = UseCaseEnum.safeParse(params.get('uc'));
  const group = params.get('g') as FitGroup;
  if (!useCase.success || !fitGroupIds.includes(group)) return null;
  const byCode = new Map(itemIds.map((id) => [itemCode(id), id]));
  const tiers = new Map<string, Tier>();
  for (const part of (params.get('r') ?? '').split('.')) {
    const tier = Number(part[0]) as Tier;
    if (!TIERS.includes(tier)) continue;
    for (let i = 1; i + CODE_LENGTH <= part.length; i += CODE_LENGTH) {
      const id = byCode.get(part.slice(i, i + CODE_LENGTH));
      if (id) tiers.set(id, tier);
    }
  }
  return { useCase: useCase.data, group, by: params.get('by') ?? undefined, tiers };
}

/** Every tier list link in free text (a forum post, issue body or notes file), without trailing punctuation. */
export function findTierLinks(text: string): string[] {
  return (text.match(/https?:\/\/[^\s<>()]*\/tiers\/?\?[^\s<>()]+/g) ?? []).map((link) => link.replace(/[.,;:!?\]'"]+$/, ''));
}

/** Plain-text version for forum and Discord posts. */
export function tierListText(list: TierList, names: Map<string, string>, title: string): string {
  const rows = TIERS.map((tier) => {
    const items = [...list.tiers].filter(([, t]) => t === tier).map(([id]) => names.get(id) ?? id).sort();
    return `${tier} ${tierLabels[tier]}: ${items.join(', ') || '—'}`;
  });
  return [title, ...rows].join('\n');
}

export interface TierVerdict { id: string; useCase: UseCase; scores: number[]; median: number; proposed: number }

/**
 * Combine lists: each item's score is the median of every list that ranked it, which keeps one
 * outlier from moving a score. The latest list per author and topic wins; unsigned lists all count.
 */
export function combineTierLists(lists: TierList[]): TierVerdict[] {
  const latest = new Map<string, TierList>();
  lists.forEach((list, i) => latest.set(list.by ? `${list.by.toLowerCase()}|${list.useCase}|${list.group}` : `#${i}`, list));
  const scores = new Map<string, number[]>();
  for (const list of latest.values()) {
    for (const [id, tier] of list.tiers) {
      const key = `${list.useCase}|${id}`;
      scores.set(key, [...(scores.get(key) ?? []), tier]);
    }
  }
  return [...scores].map(([key, values]) => {
    const [useCase, id] = key.split('|') as [UseCase, string];
    const sorted = values.toSorted((a, b) => a - b), mid = sorted.length / 2;
    const median = sorted.length % 2 ? sorted[Math.floor(mid)] : (sorted[mid - 1] + sorted[mid]) / 2;
    return { id, useCase, scores: sorted, median, proposed: toFitScore(median) };
  });
}
