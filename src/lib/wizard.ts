import type { CatalogItem } from './catalog';
import { resolvePrice, scoreItemForUseCase } from './derive';
import type { BudgetTier, Currency, Region, Setup, UseCase } from './schema';

export const PIECES = ['stick', 'second_stick', 'throttle', 'pedals', 'yoke', 'quadrant'] as const;
export type WizardPiece = typeof PIECES[number];
export interface WizardAnswers {
  useCase: UseCase;
  targetSim?: string;
  piecesNeeded: WizardPiece[];
  budgetMax: number;
  mountType: 'desk' | 'clamp' | 'chair_pit';
  needsTwist: boolean;
  /** Pedals already owned are kept, without charging them to the new-hardware budget. */
  hasExistingPedals?: boolean;
}
export interface WizardSetup { id: string; data: Setup }
export interface RecommendedPiece {
  items: CatalogItem[];
  roles: WizardPiece[];
  price: number;
  score: number;
  explanations: string[];
  warnings: string[];
  /** Carried over from the previous recommendation because it still fits. */
  kept?: boolean;
}
/** Item ids of one recommended piece, as shown to the user (base before handle). */
export type WizardPick = string[];
export interface DroppedPick { ids: WizardPick; items: CatalogItem[]; reason: string }
export interface RecommendOptions {
  /** The user's current picks; each is kept while it still fits the new answers. */
  keep?: WizardPick[];
}
export interface WizardLoadout {
  pieces: RecommendedPiece[];
  items: CatalogItem[];
  totalPrice: number;
  currency: Currency;
  totalLogicalButtons: number;
  totalAxes: number;
  complete: boolean;
  warnings: string[];
  /** Previous picks that no longer fit, with the constraint each one breaks. */
  dropped: DroppedPick[];
}
const currencies: Record<Region, Currency> = { EU: 'EUR', UK: 'GBP', US: 'USD' };
const disciplines: UseCase[] = ['modern_jet', 'space_hosas', 'space_hotas', 'heli', 'ga', 'airliner', 'ww2'];
export function defaultPieces(useCase: UseCase): WizardPiece[] {
  if (useCase === 'space_hosas') return ['stick', 'second_stick'];
  if (useCase === 'ga' || useCase === 'airliner') return ['yoke', 'quadrant', 'pedals'];
  if (useCase === 'heli') return ['stick', 'pedals'];
  return ['stick', 'throttle', ...(useCase === 'ww2' ? ['pedals' as const] : [])];
}
export function normalizeWizardAnswers(value: Partial<WizardAnswers> = {}): WizardAnswers {
  const useCase = disciplines.includes(value.useCase!) ? value.useCase! : 'modern_jet';
  const piecesNeeded = value.piecesNeeded ? PIECES.filter((piece) => value.piecesNeeded!.includes(piece)) : defaultPieces(useCase);
  return {
    useCase, piecesNeeded,
    targetSim: value.targetSim?.trim().slice(0, 80) || undefined,
    budgetMax: Number.isFinite(value.budgetMax) && value.budgetMax! > 0 ? Math.min(value.budgetMax!, 100000) : 750,
    mountType: value.mountType === 'clamp' || value.mountType === 'chair_pit' ? value.mountType : 'desk',
    needsTwist: !value.hasExistingPedals && !piecesNeeded.includes('pedals') && (piecesNeeded.includes('stick') || piecesNeeded.includes('second_stick')),
    ...(value.hasExistingPedals ? { hasExistingPedals: true } : {}),
  };
}
const pickId = /^[a-z0-9][a-z0-9/_.-]{0,120}$/i;
/** Picks travel as `a~b,c`: pieces separated by commas, items within a piece by `~`. */
export function serializePicks(picks: WizardPick[]): string {
  return picks.filter((pick) => pick.length).map((pick) => pick.join('~')).join(',');
}
export function deserializePicks(value: string | null | undefined): WizardPick[] {
  if (!value) return [];
  return value.split(',').slice(0, PIECES.length).map((pick) => pick.split('~').slice(0, 2))
    .filter((pick) => pick.every((id) => pickId.test(id)));
}
export function picksOf(loadout: Pick<WizardLoadout, 'pieces'>): WizardPick[] {
  return loadout.pieces.map((piece) => piece.items.map((item) => item.id));
}
export function serializeWizardState(answers: WizardAnswers, picks: WizardPick[] = []): string {
  const a = normalizeWizardAnswers(answers);
  const params = new URLSearchParams({ useCase: a.useCase, piecesNeeded: a.piecesNeeded.join(','), budgetMax: String(a.budgetMax), mountType: a.mountType, needsTwist: String(a.needsTwist) });
  if (a.targetSim) params.set('targetSim', a.targetSim);
  if (a.hasExistingPedals) params.set('hasExistingPedals', 'true');
  if (picks.length) params.set('picks', serializePicks(picks));
  return params.toString();
}
export function deserializeWizardState(searchParams: URLSearchParams | string): WizardAnswers {
  const p = typeof searchParams === 'string' ? new URLSearchParams(searchParams) : searchParams;
  return normalizeWizardAnswers({ useCase: p.get('useCase') as UseCase, targetSim: p.get('targetSim') ?? undefined,
    piecesNeeded: p.has('piecesNeeded') ? p.get('piecesNeeded')!.split(',') as WizardPiece[] : undefined,
    budgetMax: Number(p.get('budgetMax')), mountType: p.get('mountType') as WizardAnswers['mountType'], hasExistingPedals: p.get('hasExistingPedals') === 'true' });
}
/** Slider range per currency: an entry-level single stick up to a full high-end cockpit. */
export const BUDGET_RANGES: Record<Currency, { min: number; max: number }> = {
  EUR: { min: 50, max: 5000 }, USD: { min: 50, max: 5000 }, GBP: { min: 40, max: 4500 },
};
function niceBudget(value: number) {
  const step = value < 200 ? 10 : value < 1000 ? 25 : value < 2000 ? 50 : 100;
  return Math.round(value / step) * step;
}
/** Rounded, log-spaced slider stops so each notch is a similar relative change in budget. */
export function budgetStops(currency: Currency, count = 80): number[] {
  const { min, max } = BUDGET_RANGES[currency];
  return [...new Set(Array.from({ length: count + 1 }, (_, index) => index === 0 ? min : index === count ? max : niceBudget(min * (max / min) ** (index / count))))];
}
/** Index of the stop closest to a budget on a log scale; typed budgets outside the range clamp to an end. */
export function nearestBudgetStop(stops: number[], budget: number): number {
  let best = 0;
  for (let index = 1; index < stops.length; index++) {
    if (Math.abs(Math.log(stops[index] / budget)) < Math.abs(Math.log(stops[best] / budget))) best = index;
  }
  return best;
}
/** Numeric tiers refer to the selected currency, never an implicit FX conversion. */
export function budgetTier(budget: number): BudgetTier {
  return budget <= 350 ? 'budget' : budget <= 750 ? 'mid' : budget <= 1500 ? 'high_end' : 'enthusiast';
}
function priceOf(item: CatalogItem, region: Region): number | undefined {
  const price = resolvePrice(item.prices, region).price;
  return price?.currency === currencies[region] ? price.amount : undefined;
}
function hasTwist(item: CatalogItem) {
  return item.axes?.some((axis) => /twist|(^|[ _-])r?z($|[ _-])/i.test(axis.name)) ?? false;
}
export function scoreWizardItem(item: CatalogItem, answers: WizardAnswers, region: Region) {
  const fit = scoreItemForUseCase(item.use_case_fit, item.verdict, answers.useCase);
  let score = fit.score;
  const explanations = [...fit.breakdown];
  const warnings: string[] = [];
  const price = priceOf(item, region);
  if (price !== undefined && price <= answers.budgetMax) {
    score += 5 * (1 - price / answers.budgetMax);
    explanations.push('+ Regional price fits within the total budget; package cost checked separately');
  }
  if (hasTwist(item) && answers.needsTwist) {
    score += 12;
    const twist = item.axes?.find((axis) => /twist|(^|[ _-])r?z($|[ _-])/i.test(axis.name));
    explanations.push(/hall|magnetic|contactless|tmr/i.test(twist?.sensor ?? '')
      ? '+ Contactless twist axis provides yaw without dedicated pedals'
      : '+ Twist axis provides yaw without dedicated pedals');
  }
  if (answers.useCase.startsWith('space') && item.hasMinistick) {
    score += 7; explanations.push('+ Analog ministick adds translational strafe inputs');
  }
  if (answers.useCase === 'heli' && /dry.clutch/i.test(item.mechanics.damping)) {
    score += 10; explanations.push('+ Dry clutch damping supports a cyclic setup; check spring removal instructions');
  }
  if (answers.useCase === 'ww2' && item.category === 'pedals' && item.totalAxes >= 3) {
    score += 6; explanations.push('+ Rudder and toe-brake axes support taildragger ground handling');
  }
  if (item.verification !== 'verified') warnings.push('Draft specifications: verify before buying.');
  if (resolvePrice(item.prices, region).isStale) warnings.push('Regional price is over 90 days old.');
  return { score, explanations, warnings };
}

/** Only complete sticks (fixed, SKU bundles, or direct-compatible base + grip pairs) enter the search. */
/** Grips and yoke handles that mount onto a base; never a complete control on their own. */
function needsBase(item: CatalogItem) {
  return item.category === 'grip' || (item.category === 'yoke' && !!item.mount?.provides && item.mount.provides !== 'desk');
}
function candidates(items: CatalogItem[], answers: WizardAnswers, region: Region): RecommendedPiece[] {
  const map = new Map(items.map((item) => [item.id, item]));
  const groups = items.filter((item) => item.status === 'current' && !['base', 'module'].includes(item.category) && !needsBase(item)).map((item) => [item]);
  for (const base of items.filter((item) => item.category === 'base' && item.status === 'current')) {
    for (const handle of items.filter((item) => needsBase(item) && item.status === 'current')) {
      if (handle.mount?.provides && base.mount?.accepts?.includes(handle.mount.provides)) groups.push([base, handle]);
    }
  }
  const result: RecommendedPiece[] = [];
  for (const group of groups) {
    if (group.some((item) => priceOf(item, region) === undefined)) continue;
    const leaves = group.flatMap((item) => item.item_type === 'bundle' ? item.componentIds.map((id) => map.get(id)) : [item]);
    if (leaves.some((item) => !item || item.status !== 'current')) continue;
    const members = leaves as CatalogItem[];
    const grips = members.filter((item) => item.category === 'grip');
    const bases = members.filter((item) => item.category === 'base');
    if (members.filter(needsBase).length !== bases.length) continue;
    // Bundles declare assembled compatibility; separate pairs require a direct mount match above.
    const sticks = [...members.filter((item) => item.category === 'stick_fixed'), ...grips];
    const otherRoles = members.flatMap((item): WizardPiece[] => ['throttle', 'pedals', 'yoke', 'quadrant'].includes(item.category) ? [item.category as WizardPiece] : []);
    if (new Set(otherRoles).size !== otherRoles.length || sticks.length > 2) continue;
    const assignments: WizardPiece[][] = sticks.length === 0 ? [[]] : sticks.length === 1 ? [['stick'], ['second_stick']] : [['stick', 'second_stick'], ['second_stick', 'stick']];
    for (const assignment of assignments) {
      if (assignment.some((role, index) => {
        const hands = sticks[index].handedness;
        return hands.length > 0 && !hands.includes('ambi') && !hands.includes(role === 'stick' ? 'right' : 'left');
      })) continue;
      const roles = [...assignment, ...otherRoles];
      if (!roles.length || roles.some((role) => !answers.piecesNeeded.includes(role))) continue;
      // Twist is required on the primary stick if yaw cannot be supplied by selected pedals.
      if (answers.needsTwist && assignment.includes('stick') && !hasTwist(sticks[assignment.indexOf('stick')])) continue;
      if (answers.needsTwist && !answers.piecesNeeded.includes('stick') && assignment.includes('second_stick') && !hasTwist(sticks[assignment.indexOf('second_stick')])) continue;
      const scores = group.map((item) => scoreWizardItem(item, answers, region));
      result.push({ items: group, roles, price: group.reduce((sum, item) => sum + priceOf(item, region)!, 0),
        score: scores.reduce((sum, item) => sum + item.score, 0) / scores.length,
        explanations: [...new Set(scores.flatMap((item) => item.explanations)), ...(group.length === 2 ? [`+ Base and ${group[1].category === 'yoke' ? 'yoke handle' : 'grip'} share a direct mount standard`] : []),
          ...(assignment.includes('second_stick') ? ['+ Left-hand or ambidextrous control supplies the second stick'] : [])],
        warnings: [...new Set(scores.flatMap((item) => item.warnings))] });
    }
  }
  return result;
}
function makeLoadout(pieces: RecommendedPiece[], region: Region, complete: boolean, dropped: DroppedPick[] = []): WizardLoadout {
  const items = pieces.flatMap((piece) => piece.items);
  return { pieces, items, complete, dropped, currency: currencies[region], totalPrice: Math.round(pieces.reduce((sum, piece) => sum + piece.price, 0) * 100) / 100,
    totalAxes: items.reduce((sum, item) => sum + item.totalAxes, 0), totalLogicalButtons: items.reduce((sum, item) => sum + item.totalLogicalButtons, 0),
    warnings: [...new Set(pieces.flatMap((piece) => piece.warnings))] };
}
const idsOf = (piece: RecommendedPiece) => piece.items.map((item) => item.id);
const sameIds = (a: string[], b: string[]) => a.length === b.length && a.every((id, index) => id === b[index]);
const isSingleStick = (piece: RecommendedPiece) => piece.roles.length === 1 && ['stick', 'second_stick'].includes(piece.roles[0]);
function overlaps(pieces: RecommendedPiece[], option: RecommendedPiece) {
  return pieces.some((piece) => {
    const used = piece.items.flatMap((item) => [item.id, ...item.componentIds]);
    const shared = option.items.some((item) => [item.id, ...item.componentIds].some((id) => used.includes(id)));
    // Separate left/right assemblies may each purchase a copy of the same base or ambidextrous SKU.
    return shared && !(isSingleStick(piece) && isSingleStick(option) && piece.roles[0] !== option.roles[0]);
  });
}
/** Best complete loadout that contains every seed piece, or undefined when none fits. */
function search(options: RecommendedPiece[], answers: WizardAnswers, seed: RecommendedPiece[]) {
  type State = { pieces: RecommendedPiece[]; roles: WizardPiece[]; price: number; score: number };
  let states: State[] = [{ pieces: seed, roles: seed.flatMap((piece) => piece.roles), price: seed.reduce((sum, piece) => sum + piece.price, 0),
    score: seed.reduce((sum, piece) => sum + piece.score * piece.roles.length, 0) }];
  if (states[0].price > answers.budgetMax) return undefined;
  for (const role of answers.piecesNeeded) {
    const next: State[] = [];
    for (const state of states) {
      if (state.roles.includes(role)) { next.push(state); continue; }
      for (const option of options.filter((option) => option.roles.includes(role))) {
        if (option.roles.some((piece) => state.roles.includes(piece)) || state.price + option.price > answers.budgetMax) continue;
        if (overlaps(state.pieces, option)) continue;
        next.push({ pieces: [...state.pieces, option], roles: [...state.roles, ...option.roles], price: state.price + option.price,
          score: state.score + option.score * option.roles.length });
      }
    }
    // Keep both quality leaders and cheapest prefixes so a costly early choice cannot exhaust the budget.
    const quality = [...next].sort((a, b) => b.score - a.score || a.price - b.price).slice(0, 150);
    const cheap = [...next].sort((a, b) => a.price - b.price || b.score - a.score).slice(0, 150);
    states = [...new Set([...quality, ...cheap])];
    if (!states.length) break;
  }
  const best = states.sort((a, b) => b.score - a.score || a.price - b.price)[0];
  return best && answers.piecesNeeded.length > 0 && answers.piecesNeeded.every((role) => best.roles.includes(role)) ? best : undefined;
}
/** Names the first new constraint a previous pick breaks, checking the broadest cause first. */
function pickMismatch(ids: WizardPick, items: CatalogItem[], answers: WizardAnswers, region: Region): string {
  const offered = (relaxed: WizardAnswers) => candidates(items, relaxed, region).some((option) => sameIds(idsOf(option), ids));
  if (!offered({ ...answers, piecesNeeded: [...PIECES], needsTwist: false })) return `No longer listed with a current ${region} price.`;
  if (!offered({ ...answers, needsTwist: false })) return 'No longer one of your selected controls.';
  return 'Has no twist axis, and without pedals the stick must now provide yaw.';
}
export function recommendLoadout(items: CatalogItem[], input: WizardAnswers, region: Region, { keep = [] }: RecommendOptions = {}): WizardLoadout {
  const answers = normalizeWizardAnswers(input);
  const options = candidates(items, answers, region);
  const map = new Map(items.map((item) => [item.id, item]));
  const dropped: DroppedPick[] = [];
  const drop = (ids: WizardPick, reason: string) => dropped.push({ ids, reason, items: ids.flatMap((id) => map.get(id) ? [map.get(id)!] : []) });
  const kept: RecommendedPiece[] = [];
  for (const ids of keep) {
    const matches = options.filter((option) => sameIds(idsOf(option), ids));
    const option = matches.find((option) => !option.roles.some((role) => kept.some((piece) => piece.roles.includes(role))) && !overlaps(kept, option));
    if (option) kept.push({ ...option, kept: true });
    else drop(ids, matches.length ? 'Overlaps another control already in this setup.' : pickMismatch(ids, items, answers, region));
  }
  // Release the most expensive kept pick until the rest of the setup fits around the ones that remain.
  let best = search(options, answers, kept);
  // When nothing fits at all, the kept picks are not to blame; the caller can retain them for a later change.
  const feasible = !!best || !kept.length || !!search(options, answers, []);
  while (!best && feasible && kept.length) {
    const priciest = kept.reduce((top, piece) => piece.price > top.price ? piece : top);
    kept.splice(kept.indexOf(priciest), 1);
    drop(idsOf(priciest), priciest.price > answers.budgetMax ? 'Over the new budget on its own.' : 'Leaves too little budget for your other controls.');
    best = search(options, answers, kept);
  }
  const loadout = makeLoadout(best?.pieces ?? [], region, !!best, dropped);
  loadout.warnings.push(answers.mountType === 'desk' ? 'Desktop stability and included base plates need checking against manufacturer specifications.' : 'Mount hardware, brackets and cockpit compatibility need checking; mount costs are not included.');
  if (!best) loadout.warnings.unshift('No complete loadout meets these pieces, yaw requirements and regional budget. Increase the budget or revise your controls.');
  return loadout;
}
export function matchCuratedSetups(setups: WizardSetup[], items: CatalogItem[], input: WizardAnswers, region: Region) {
  const answers = normalizeWizardAnswers(input);
  const map = new Map(items.map((item) => [item.id, item]));
  return setups.filter((setup) => setup.data.use_case === answers.useCase && setup.data.budget_tier === budgetTier(answers.budgetMax)).map((setup) => {
    const included = setup.data.items.map((ref) => ({ ...ref, item: map.get(ref.id) }));
    const unknownPrice = included.some(({ item }) => !item || priceOf(item, region) === undefined);
    const totalPrice = unknownPrice ? null : Math.round(included.reduce((sum, { item }) => sum + priceOf(item!, region)!, 0) * 100) / 100;
    const members = included.flatMap(({ item }) => !item ? [] : item.item_type === 'bundle' ? item.componentIds.flatMap((id) => map.get(id) ? [map.get(id)!] : []) : [item]);
    const bases = members.filter((item) => item.category === 'base').length;
    const grips = members.filter((item) => item.category === 'grip').length;
    const warnings: string[] = [];
    if (bases !== grips) warnings.push('This reference includes an unpaired base or grip. Additional compatible hardware is required and is not included in the listed total.');
    if (answers.needsTwist && !members.some((item) => hasTwist(item) && ['grip', 'stick_fixed'].includes(item.category)) && !members.some((item) => item.category === 'pedals')) warnings.push('This reference has no documented twist or pedal yaw control. Plan an additional yaw input.');
    return { ...setup, included, totalPrice, warnings, currency: currencies[region], withinBudget: totalPrice !== null && totalPrice <= answers.budgetMax };
  }).sort((a, b) => Number(b.withinBudget) - Number(a.withinBudget) || Number(b.data.pick) - Number(a.data.pick) || (a.totalPrice ?? Infinity) - (b.totalPrice ?? Infinity));
}
