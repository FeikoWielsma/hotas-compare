/**
 * Community tier lists for use-case fit: one list ranks one group of parts for one use case.
 * A list travels as a share link (/tiers?uc=…&g=…&r=…&o=1), so the site needs no backend;
 * scripts/tiers-import.ts combines collected links into proposed fit scores. The order within a tier
 * is part of the ranking: it becomes the decimals of the fit score (see fineScores).
 */
import { baselineFit } from './fit-baseline.ts';
import { fitGroupIds, groupOf, isPlaceholderFit, isUnreviewedFit, tierLineName, toFitScore, type FitGroup } from './fit-groups.ts';
import { UseCaseEnum, type Component, type UseCase, type UseCaseFit } from './schema.ts';

/** Tier 6 is S, above Excellent: both count as 5 on the 1–5 fit scale, S at the top of it. */
export const TIERS = [6, 5, 4, 3, 2, 1] as const;
export type Tier = (typeof TIERS)[number];
export const tierLabels: Record<Tier, string> = { 6: 'Best', 5: 'Excellent', 4: 'Good', 3: 'Fine', 2: 'Weak', 1: 'Poor' };
export const tierBadge = (tier: Tier) => (tier === 6 ? 'S' : String(tier));

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
  const byId = new Map(items.map((item) => [item.id, item]));
  return new Map([...tiers].flatMap(([id, tier]) => (byId.get(id)?.members ?? []).map((member) => [member, tier] as const)));
}

/** Each member's position within its tier (0 is best), from the entry order of `tiers`; members of one entry share it. */
export function expandOrder(items: TierItem[], tiers: Map<string, Tier>): Map<string, number> {
  const byId = new Map(items.map((item) => [item.id, item]));
  const seen = new Map<Tier, number>();
  return new Map([...tiers].flatMap(([id, tier]) => {
    const position = seen.get(tier) ?? 0;
    seen.set(tier, position + 1);
    return (byId.get(id)?.members ?? []).map((member) => [member, position] as const);
  }));
}

/**
 * Entry tiers from a link's per-part tiers; an entry takes the tier of its first ranked member. The map's
 * insertion order is the ranking: by tier, then by position when the link carries an order.
 */
export function collapseTiers(items: TierItem[], memberTiers: Map<string, Tier>, order?: Map<string, number>): Map<string, Tier> {
  const ranked = items.flatMap((item) => {
    const member = item.members.find((id) => memberTiers.has(id));
    return member ? [{ id: item.id, tier: memberTiers.get(member)!, position: order?.get(member) ?? 0 }] : [];
  });
  return new Map(ranked.toSorted((a, b) => b.tier - a.tier || a.position - b.position).map((r) => [r.id, r.tier]));
}

/** `order` holds each part's position within its tier (0 is best); lists made before ordering existed have none. */
export interface TierList { useCase: UseCase; group: FitGroup; by?: string; tiers: Map<string, Tier>; order?: Map<string, number> }

const positionsInTier = (list: TierList, tier: Tier) => {
  const ids = [...list.tiers].filter(([, t]) => t === tier).map(([id]) => id);
  return Map.groupBy(ids, (id) => list.order?.get(id) ?? 0);
};

/**
 * `r` lists each tier as its digit (6 is S) followed by item codes, tiers separated by `.`. With `o=1` the codes
 * are in ranked order and `-` separates entries, so `5abcdefghij-klmno` puts the entry abcde+fghij above klmno.
 */
export function serializeTierList(list: TierList): URLSearchParams {
  const params = new URLSearchParams({ uc: list.useCase, g: list.group });
  const r = TIERS.map((tier) => {
    const entries = list.order
      ? [...positionsInTier(list, tier)].toSorted(([a], [b]) => a - b).map(([, ids]) => ids.map(itemCode).join(''))
      : [...list.tiers].filter(([, t]) => t === tier).map(([id]) => itemCode(id)).sort();
    return entries.length ? tier + entries.join(list.order ? '-' : '') : '';
  }).filter(Boolean).join('.');
  if (r) params.set('r', r);
  if (r && list.order) params.set('o', '1');
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
  const ordered = params.get('o') === '1';
  const tiers = new Map<string, Tier>();
  const order = new Map<string, number>();
  for (const part of (params.get('r') ?? '').split('.')) {
    const tier = Number(part[0]) as Tier;
    if (!TIERS.includes(tier)) continue;
    let position = 0;
    for (const entry of ordered ? part.slice(1).split('-') : [part.slice(1)]) {
      let found = false;
      for (let i = 0; i + CODE_LENGTH <= entry.length; i += CODE_LENGTH) {
        const id = byCode.get(entry.slice(i, i + CODE_LENGTH));
        if (id) { tiers.set(id, tier); order.set(id, position); found = true; }
      }
      if (found) position++;
    }
  }
  return { useCase: useCase.data, group, by: params.get('by') ?? undefined, tiers, ...(ordered ? { order } : {}) };
}

/** Every tier list link in free text (a forum post, issue body or notes file), without trailing punctuation. */
export function findTierLinks(text: string): string[] {
  return (text.match(/https?:\/\/[^\s<>()]*\/tiers\/?\?[^\s<>()]+/g) ?? []).map((link) => link.replace(/[.,;:!?\]'"]+$/, ''));
}

/** Plain-text version for forum and Discord posts, best first. */
export function tierListText(list: TierList, names: Map<string, string>, title: string): string {
  const rows = TIERS.map((tier) => {
    const entries = list.order
      ? [...positionsInTier(list, tier)].toSorted(([a], [b]) => a - b).map(([, ids]) => [...new Set(ids.map((id) => names.get(id) ?? id))].join(' / '))
      : [...list.tiers].filter(([, t]) => t === tier).map(([id]) => names.get(id) ?? id).sort();
    return `${tierBadge(tier)} ${tierLabels[tier]}: ${entries.join(', ') || '—'}`;
  });
  return [title, ...rows].join('\n');
}

/**
 * Each tier covers a band of the 1–5 fit scale that rounds back to its whole score; S and Excellent split
 * the 5 band. Within a band, entries are spread evenly from the top by their position.
 */
const BANDS: Record<Tier, [number, number]> = { 6: [4.75, 5], 5: [4.5, 4.75], 4: [3.5, 4.5], 3: [2.5, 3.5], 2: [1.5, 2.5], 1: [1, 1.5] };
const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Fine scores for one list. An ordered list spreads each tier across its band, so position within a tier
 * breaks ties; a list without order (made before S and ordering existed) gives every part its whole tier score.
 */
export function fineScores(list: TierList): Map<string, number> {
  const scores = new Map<string, number>();
  for (const tier of TIERS) {
    const positions = [...positionsInTier(list, tier)].toSorted(([a], [b]) => a - b);
    const [lo, hi] = BANDS[tier];
    positions.forEach(([, ids], index) => {
      const score = list.order ? round2(hi - ((index + 0.5) / positions.length) * (hi - lo)) : Math.min(tier, 5);
      for (const id of ids) scores.set(id, score);
    });
  }
  return scores;
}

/** Starting tier for a fit score: the top of the 5 band is S. A whole 5 predates S, so it stays Excellent. */
export const tierOfFit = (fit: number): Tier => (fit >= BANDS[6][0] && fit < 5 ? 6 : toFitScore(fit) as Tier);

export interface TierVerdict { id: string; useCase: UseCase; scores: number[]; median: number; proposed: number }

/**
 * Combine lists: each item's score is the median of its fine score in every list that ranked it, which keeps one
 * outlier from moving a score. The latest list per author and topic wins; unsigned lists all count.
 */
export function combineTierLists(lists: TierList[]): TierVerdict[] {
  const latest = new Map<string, TierList>();
  lists.forEach((list, i) => latest.set(list.by ? `${list.by.toLowerCase()}|${list.useCase}|${list.group}` : `#${i}`, list));
  const scores = new Map<string, number[]>();
  for (const list of latest.values()) {
    for (const [id, score] of fineScores(list)) {
      const key = `${list.useCase}|${id}`;
      scores.set(key, [...(scores.get(key) ?? []), score]);
    }
  }
  return [...scores].map(([key, values]) => {
    const [useCase, id] = key.split('|') as [UseCase, string];
    const m = median(values);
    return { id, useCase, scores: values.toSorted((a, b) => a - b), median: m, proposed: round2(m) };
  });
}
