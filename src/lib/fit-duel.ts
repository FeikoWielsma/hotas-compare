/**
 * Pairwise "which do you prefer for X" votes, turned back into 1–5 use-case fit scores.
 * Used by the local fit duel tool (scripts/fit-duel.ts) and the retune report (scripts/fit-retune.ts).
 */
import type { UseCase, UseCaseFit } from './schema.ts';

export { groupOf as poolOf, fitGroups as duelPools, toFitScore, setFitInYaml, type FitGroup as DuelPool } from './fit-groups.ts';
import type { FitGroup as DuelPool } from './fit-groups.ts';

/** `both_good` / `both_bad` say something absolute: both items beat (or lose to) a fixed anchor. `skip` is "don't know". */
export type DuelResult = 'a' | 'b' | 'tie' | 'both_good' | 'both_bad' | 'skip';
export interface DuelVote { t: string; use_case: UseCase; a: string; b: string; result: DuelResult }

/** Logistic slope per fit point: a 1-point gap means ~77% preference, 2 points ~92%. */
export const SLOPE = 1.2;
export const GOOD_ANCHOR = 4;
export const BAD_ANCHOR = 2;
/** Prior spread around the stored score; looser when the score is only the schema default. */
export const PRIOR_SD = { explicit: 1, defaulted: 1.6 };

export interface Prior { mean: number; sd: number }
export interface Rating { score: number; sd: number; votes: number }

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

/**
 * Bradley–Terry MAP estimate for one use case, on the 1–5 fit scale.
 * Each item starts from its stored score (the prior); votes pull it from there.
 */
export function rate(votes: DuelVote[], priors: Map<string, Prior>, slope = SLOPE): Map<string, Rating> {
  // Observations: [item, opponent item or fixed anchor, outcome for item in 0..1]
  type Obs = { i: string; j: string | number; y: number };
  const obs: Obs[] = [];
  const counts = new Map<string, number>();
  const bump = (id: string) => counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const v of votes) {
    if (!priors.has(v.a) || !priors.has(v.b) || v.result === 'skip') continue;
    bump(v.a); bump(v.b);
    if (v.result === 'both_good' || v.result === 'both_bad') {
      const [anchor, y] = v.result === 'both_good' ? [GOOD_ANCHOR, 1] : [BAD_ANCHOR, 0];
      obs.push({ i: v.a, j: anchor, y }, { i: v.b, j: anchor, y });
    } else {
      obs.push({ i: v.a, j: v.b, y: v.result === 'a' ? 1 : v.result === 'b' ? 0 : 0.5 });
    }
  }

  const s = new Map([...priors].map(([id, p]) => [id, p.mean]));
  const value = (x: string | number) => (typeof x === 'number' ? x : s.get(x)!);
  // Newton steps on each coordinate; the objective is concave so this converges quickly.
  for (let iter = 0; iter < 200; iter++) {
    const grad = new Map<string, number>(), hess = new Map<string, number>();
    for (const [id, p] of priors) {
      grad.set(id, -(s.get(id)! - p.mean) / p.sd ** 2);
      hess.set(id, 1 / p.sd ** 2);
    }
    for (const { i, j, y } of obs) {
      const p = sigmoid(slope * (value(i) - value(j)));
      const g = slope * (y - p), h = slope ** 2 * p * (1 - p);
      grad.set(i, grad.get(i)! + g); hess.set(i, hess.get(i)! + h);
      if (typeof j === 'string') { grad.set(j, grad.get(j)! - g); hess.set(j, hess.get(j)! + h); }
    }
    let moved = 0;
    for (const id of priors.keys()) {
      const step = grad.get(id)! / hess.get(id)!;
      s.set(id, s.get(id)! + step * 0.5);
      moved = Math.max(moved, Math.abs(step));
    }
    if (moved < 1e-6) break;
  }

  const ratings = new Map<string, Rating>();
  for (const [id, p] of priors) {
    let h = 1 / p.sd ** 2;
    for (const { i, j } of obs) {
      if (i !== id && j !== id) continue;
      const q = sigmoid(slope * (value(i) - value(j)));
      h += slope ** 2 * q * (1 - q);
    }
    ratings.set(id, { score: s.get(id)!, sd: 1 / Math.sqrt(h), votes: counts.get(id) ?? 0 });
  }
  return ratings;
}

export interface DuelItem { id: string; pool: DuelPool; fit: UseCaseFit }

const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

/**
 * Next matchup: the least-voted use case and items, paired with a similarly rated rival
 * (close calls carry the most information). `random` is injectable for tests.
 */
export function pickDuel(
  items: DuelItem[], votes: DuelVote[], useCases: UseCase[], pools: DuelPool[], random = Math.random,
): { use_case: UseCase; a: string; b: string } | null {
  const eligible = items.filter((item) => pools.includes(item.pool));
  const byPool = Map.groupBy(eligible, (item) => item.pool);
  const usable = [...byPool.values()].filter((group) => group.length >= 2).flat();
  if (!usable.length || !useCases.length) return null;

  const seen = new Set<string>(), itemVotes = new Map<string, number>(), caseVotes = new Map<UseCase, number>();
  for (const v of votes) {
    seen.add(`${v.use_case}:${pairKey(v.a, v.b)}`);
    caseVotes.set(v.use_case, (caseVotes.get(v.use_case) ?? 0) + 1);
    for (const id of [v.a, v.b]) itemVotes.set(`${v.use_case}:${id}`, (itemVotes.get(`${v.use_case}:${id}`) ?? 0) + 1);
  }
  const weighted = <T>(options: T[], weight: (o: T) => number): T => {
    const weights = options.map(weight), total = weights.reduce((a, b) => a + b, 0);
    let roll = random() * total;
    for (let k = 0; k < options.length; k++) if ((roll -= weights[k]) <= 0) return options[k];
    return options.at(-1)!;
  };

  const use_case = weighted(useCases, (u) => 1 / (1 + (caseVotes.get(u) ?? 0)) ** 2);
  const count = (id: string) => itemVotes.get(`${use_case}:${id}`) ?? 0;
  const a = weighted(usable, (item) => 1 / (1 + count(item.id)) ** 2);
  const rivals = byPool.get(a.pool)!.filter((item) => item.id !== a.id);
  const fresh = rivals.filter((item) => !seen.has(`${use_case}:${pairKey(a.id, item.id)}`));
  const b = weighted(fresh.length ? fresh : rivals, (item) =>
    Math.exp(-Math.abs(item.fit[use_case] - a.fit[use_case])) / (1 + count(item.id)));
  return random() < 0.5 ? { use_case, a: a.id, b: b.id } : { use_case, a: b.id, b: a.id };
}
