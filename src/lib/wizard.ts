import type { CatalogItem } from './catalog';
import { resolvePrice, scoreItemForUseCase } from './derive';
import type { BudgetTier, Currency, Region, Setup, UseCase } from './schema';
import { humanize } from './labels';
import { isSuperseded } from './successors';

export const PIECES = ['stick', 'second_stick', 'throttle', 'collective', 'pedals', 'yoke', 'quadrant'] as const;
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
  /** Contribution to the setup score: `score` per covered role, minus stand-in penalties. */
  value: number;
  /** Roles covered by a stand-in (e.g. yoke triggers as rudder) rather than dedicated hardware. */
  standIns: WizardPiece[];
  explanations: string[];
  warnings: string[];
  /** Pinned by the user, so live re-optimisation keeps it while it fits. */
  pinned?: boolean;
}
/** Item ids of one recommended piece, as shown to the user (base before handle). */
export type WizardPick = string[];
export interface DroppedPick { ids: WizardPick; items: CatalogItem[]; reason: string }
export interface RecommendOptions {
  /** Picks the user pinned; kept while they fit, otherwise reported in `dropped`. */
  pinned?: WizardPick[];
  /** Picks currently on screen; break ties so an equally good pick is not swapped out. */
  prefer?: WizardPick[];
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
  /** Pinned picks that do not fit these answers, with the constraint each one breaks. */
  dropped: DroppedPick[];
  /** Set when nothing acceptable fits the budget: the cheapest recommended setup, and by how much it exceeds it. */
  overBudget?: number;
}
const currencies: Record<Region, Currency> = { EU: 'EUR', UK: 'GBP', US: 'USD' };
const disciplines: UseCase[] = ['modern_jet', 'space_hosas', 'space_hotas', 'heli', 'ga', 'airliner', 'ww2'];
export function defaultPieces(useCase: UseCase): WizardPiece[] {
  if (useCase === 'space_hosas') return ['stick', 'second_stick'];
  if (useCase === 'ga' || useCase === 'airliner') return ['yoke', 'quadrant', 'pedals'];
  // Cyclic, collective and anti-torque pedals; the engine throttle is set once and rarely needs hardware.
  if (useCase === 'heli') return ['stick', 'collective', 'pedals'];
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
/** Shared state carries only pins; everything else is re-derived from the answers. */
export function serializeWizardState(answers: WizardAnswers, pinned: WizardPick[] = []): string {
  const a = normalizeWizardAnswers(answers);
  const params = new URLSearchParams({ useCase: a.useCase, piecesNeeded: a.piecesNeeded.join(','), budgetMax: String(a.budgetMax), mountType: a.mountType, needsTwist: String(a.needsTwist) });
  if (a.targetSim) params.set('targetSim', a.targetSim);
  if (a.hasExistingPedals) params.set('hasExistingPedals', 'true');
  if (pinned.length) params.set('pinned', serializePicks(pinned));
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
const controlsOf = (item: CatalogItem) => item.controlSections?.flatMap((section) => section.controls) ?? [];
/** Built-in yaw: a twist axis or rudder axes such as the VelocityOne yoke's analog triggers. */
function hasYawAxis(item: CatalogItem) {
  return hasTwist(item) || (item.axes?.some((axis) => /rudder/i.test(axis.name)) ?? false)
    || controlsOf(item).some((control) => control.type === 'axis' && ['rudder', 'twist'].includes(control.kind));
}
/** Built-in throttle: a throttle lever, slider or quadrant levers on a stick or yoke. */
function hasThrottleAxis(item: CatalogItem) {
  return (item.axes?.some((axis) => /throttle|slider|quadrant/i.test(axis.name)) ?? false)
    || controlsOf(item).some((control) => control.type === 'slider' || (control.type === 'lever' && /^throttle/.test(control.kind ?? '')));
}
function isCollective(item: CatalogItem) {
  return controlsOf(item).some((control) => control.type === 'lever' && control.kind === 'collective');
}
/** A yoke with two or more throttle levers carries its own quadrant; buying another would duplicate it. */
function hasIntegratedQuadrant(item: CatalogItem) {
  return item.category === 'yoke' && controlsOf(item)
    .filter((control) => control.type === 'lever' && (control.analog || /^throttle/.test(control.kind ?? '')))
    .reduce((sum, control) => sum + (control.count ?? 1), 0) >= 2;
}
/** Airbus flies a sidestick and Boeing a yoke, so the chosen airliner control implies the cockpit family. */
export function airlinerFamily(answers: Pick<WizardAnswers, 'useCase' | 'piecesNeeded'>): 'airbus' | 'boeing' | undefined {
  if (answers.useCase !== 'airliner') return undefined;
  if (answers.piecesNeeded.includes('yoke')) return 'boeing';
  return answers.piecesNeeded.includes('stick') ? 'airbus' : undefined;
}
const FAMILY_MATCH_BONUS = 5;
const FAMILY_MISMATCH_PENALTY = 15;

/**
 * Where a flying style accepts one control covering another selected piece. Each stand-in costs
 * `penalty` score points, so dedicated hardware wins once the budget allows it. `via` is either a
 * built-in axis on the primary stick or yoke (adds the role) or a role the piece would otherwise fill
 * (replaces it). Styles without an entry only accept dedicated hardware for every piece.
 */
interface StandIn { role: WizardPiece; via: 'yaw_axis' | 'throttle_axis' | 'throttle' | 'second_stick'; penalty: number; note: string }
const lightRudderStandIns: StandIn[] = [
  { role: 'pedals', via: 'yaw_axis', penalty: 15, note: 'Built-in rudder axis (twist or analog triggers) stands in for pedals; dedicated pedals add toe brakes and finer ground handling' },
  { role: 'quadrant', via: 'throttle_axis', penalty: 10, note: 'Built-in throttle levers stand in for a separate quadrant' },
  { role: 'throttle', via: 'throttle_axis', penalty: 10, note: 'Built-in throttle lever stands in for a separate throttle' },
];
// On a tight budget a stick's twist axis is the rudder; pedals are the first upgrade once the budget allows.
const twistRudderStandIn = (penalty: number, note: string): StandIn[] => [{ role: 'pedals', via: 'yaw_axis', penalty, note }];
const combatRudderStandIns = twistRudderStandIn(20, 'Stick twist stands in for rudder pedals on a budget; add pedals later for finer rudder control');
export const STAND_INS: Partial<Record<UseCase, StandIn[]>> = {
  modern_jet: combatRudderStandIns,
  space_hotas: combatRudderStandIns,
  space_hosas: combatRudderStandIns,
  // Taildraggers lean on the rudder for takeoff and landing, so pedals win sooner than for jets.
  ww2: twistRudderStandIn(30, 'Stick twist stands in for rudder pedals on a budget; pedals with toe brakes make taildragger takeoffs and landings much easier'),
  // Rudder is mostly used on takeoff, landing and crosswind, so an integrated axis is a sound budget start.
  airliner: lightRudderStandIns,
  ga: lightRudderStandIns,
  heli: [
    { role: 'collective', via: 'throttle', penalty: 15, note: 'Throttle lever doubles as the collective; a dedicated collective adds a longer, friction-held stroke' },
    { role: 'collective', via: 'second_stick', penalty: 15, note: 'Left-hand stick doubles as the collective; centring spring removal or a dry clutch helps it hold position' },
    // On a tight budget one stick with twist and a throttle axis covers the whole helicopter.
    { role: 'collective', via: 'throttle_axis', penalty: 20, note: 'Stick throttle axis doubles as the collective on a budget; a separate lever gives a longer, steadier stroke' },
    { role: 'pedals', via: 'yaw_axis', penalty: 20, note: 'Twist axis stands in for anti-torque pedals on a budget; pedals free the cyclic hand for precise hovering' },
  ],
};
function roleVariants(roles: WizardPiece[], primary: CatalogItem[], answers: WizardAnswers) {
  let variants: { roles: WizardPiece[]; standIns: StandIn[] }[] = [{ roles, standIns: [] }];
  for (const standIn of STAND_INS[answers.useCase] ?? []) {
    if (!answers.piecesNeeded.includes(standIn.role)) continue;
    variants = variants.flatMap((variant) => {
      if (variant.roles.includes(standIn.role) || variant.standIns.some((used) => used.via === standIn.via)) return [variant];
      const next = { standIns: [...variant.standIns, standIn] };
      if (standIn.via === 'throttle' || standIn.via === 'second_stick') {
        return variant.roles.includes(standIn.via) ? [variant, { ...next, roles: variant.roles.map((role) => role === standIn.via ? standIn.role : role) }] : [variant];
      }
      if (!primary.some(standIn.via === 'yaw_axis' ? hasYawAxis : hasThrottleAxis)) return [variant];
      const covered = { ...next, roles: [...variant.roles, standIn.role] };
      // A yoke's own quadrant always covers the quadrant role rather than sitting next to a second one.
      return standIn.role === 'quadrant' && primary.some(hasIntegratedQuadrant) ? [covered] : [variant, covered];
    });
  }
  return variants;
}
/** A 1/5 fit marks hardware the wizard never recommends for that flying style. */
const LAST_RESORT_FIT = 1;
const isLastResort = (item: CatalogItem, useCase: UseCase) => item.use_case_fit[useCase] <= LAST_RESORT_FIT;
/** A 2/5 fit is a fallback: it scores low enough to lose to anything better and carries a warning when shown. */
const LIMITED_FIT = 2;
/** Unreviewed hardware must be clearly better than a reviewed alternative before it is recommended. */
const REVIEWS_PENDING_PENALTY = 12;
const NO_STICK: CatalogItem['category'][] = ['throttle', 'pedals', 'quadrant', 'module', 'base'];
/** How well one control suits the answers, before its price is weighed against the budget. */
function qualityOf(item: CatalogItem, answers: WizardAnswers) {
  const fit = scoreItemForUseCase(item.use_case_fit, item.verdict, answers.useCase);
  let score = fit.score;
  const explanations = [...fit.breakdown];
  const warnings: string[] = [];
  // Only the stick's twist replaces pedals; a throttle's Z axis or rudder rocker earns no yaw bonus.
  if (hasTwist(item) && answers.needsTwist && !NO_STICK.includes(item.category)) {
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
  if (item.reviewsPending) { score -= REVIEWS_PENDING_PENALTY; explanations.push('- No published reviews yet'); }
  const family = airlinerFamily(answers);
  if (family && item.airlinerFamily) {
    const name = item.airlinerFamily === 'airbus' ? 'Airbus' : 'Boeing';
    if (item.airlinerFamily === family) { score += FAMILY_MATCH_BONUS; explanations.push(`+ ${name} replica matches your ${family === 'airbus' ? 'sidestick' : 'yoke'} cockpit`); }
    else { score -= FAMILY_MISMATCH_PENALTY; explanations.push(`- ${name} replica; your ${family === 'airbus' ? 'sidestick suits an Airbus' : 'yoke suits a Boeing'} cockpit`); }
  }
  if ((answers.useCase === 'ga' || answers.useCase === 'airliner') && item.pedalBrakes === 'rudder_only') {
    score -= 10; explanations.push('- No toe brakes; wheel brakes go on a button');
  }
  if (answers.useCase === 'ww2' && item.category === 'pedals' && item.totalAxes >= 3) {
    score += 6; explanations.push('+ Rudder and toe-brake axes support taildragger ground handling');
  }
  if (item.reviewsPending) warnings.push(`${item.name} has no published reviews yet: treat it as a tentative pick.`);
  if (item.verification !== 'verified') warnings.push('Draft specifications: verify before buying.');
  return { score, explanations, warnings };
}
/**
 * `members` are a bundle's parts. A bundle without its own editorial verdict is judged like its parts bought
 * separately (add-on modules aside), so it wins on price rather than on how its fit is averaged.
 */
export function scoreWizardItem(item: CatalogItem, answers: WizardAnswers, region: Region, members: CatalogItem[] = []) {
  const parts = item.verdict ? [] : members.filter((member) => member.category !== 'module');
  let { score, explanations, warnings } = qualityOf(item, answers);
  if (parts.length) {
    const scored = parts.map((part) => qualityOf(part, answers));
    score = scored.reduce((sum, part) => sum + part.score, 0) / scored.length;
    // Bonus lines read the same for every part; fit and verdict lines name the part they describe.
    explanations = [...new Set(scored.flatMap((part, index) => part.explanations.map((line) => /^[+-] /.test(line) ? line : `${parts[index].name}: ${line}`)))];
    warnings = [...new Set([...warnings, ...scored.flatMap((part) => part.warnings)])];
  }
  const price = priceOf(item, region);
  if (price !== undefined && price <= answers.budgetMax) {
    score += 5 * (1 - price / answers.budgetMax);
    explanations.push('+ Regional price fits within the total budget; package cost checked separately');
  }
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
  // Parts only sold inside a bundle cannot be bought on their own; the bundle is offered instead.
  // On a desk setup, surface-sitting controls marked mount_only cannot sit loose on the desktop.
  const buyable = items.filter((item) => item.status === 'current' && item.soldStandalone !== false && (answers.mountType !== 'desk' || needsBase(item) || item.placement !== 'mount_only'));
  const groups = buyable.filter((item) => !['base', 'module'].includes(item.category) && !needsBase(item)).map((item) => [item]);
  for (const base of buyable.filter((item) => item.category === 'base')) {
    for (const handle of buyable.filter(needsBase)) {
      if (handle.mount?.provides && base.mount?.accepts?.includes(handle.mount.provides)) groups.push([base, handle]);
    }
  }
  const result: RecommendedPiece[] = [];
  for (const group of groups) {
    if (group.some((item) => priceOf(item, region) === undefined)) continue;
    const leaves = group.flatMap((item) => item.item_type === 'bundle' ? item.componentIds.map((id) => map.get(id)) : [item]);
    if (leaves.some((item) => !item || item.status !== 'current')) continue;
    const members = leaves as CatalogItem[];
    const surfaceMembers = members.filter((item) => !needsBase(item) && item.category !== 'module');
    if (
      answers.mountType === 'desk'
      && (group.some((item) => !needsBase(item) && item.placement === 'mount_only')
        || group.some((item) => item.item_type === 'bundle' && item.placement == null && surfaceMembers.some((member) => member.placement === 'mount_only')))
    ) continue;
    const grips = members.filter((item) => item.category === 'grip');
    const bases = members.filter((item) => item.category === 'base');
    if (members.filter(needsBase).length !== bases.length) continue;
    // Bundles declare assembled compatibility; separate pairs require a direct mount match above.
    // A collective lever turns the grips on that base into collective heads rather than sticks.
    const collective = members.some(isCollective);
    const sticks = collective ? [] : [...members.filter((item) => item.category === 'stick_fixed'), ...grips];
    const otherRoles = members.flatMap((item): WizardPiece[] => ['throttle', 'pedals', 'yoke', 'quadrant'].includes(item.category) ? [item.category as WizardPiece] : []);
    if (collective) otherRoles.push('collective');
    const primary = members.filter((item) => ['stick_fixed', 'grip', 'yoke'].includes(item.category) && !collective);
    if (new Set(otherRoles).size !== otherRoles.length || sticks.length > 2) continue;
    const assignments: WizardPiece[][] = sticks.length === 0 ? [[]] : sticks.length === 1 ? [['stick'], ['second_stick']] : [['stick', 'second_stick'], ['second_stick', 'stick']];
    for (const assignment of assignments) {
      if (assignment.some((role, index) => {
        const hands = sticks[index].handedness;
        return hands.length > 0 && !hands.includes('ambi') && !hands.includes(role === 'stick' ? 'right' : 'left');
      })) continue;
      // Twist is required on the primary stick if yaw cannot be supplied by selected pedals.
      if (answers.needsTwist && assignment.includes('stick') && !hasTwist(sticks[assignment.indexOf('stick')])) continue;
      if (answers.needsTwist && !answers.piecesNeeded.includes('stick') && assignment.includes('second_stick') && !hasTwist(sticks[assignment.indexOf('second_stick')])) continue;
      const scores = group.map((item) => scoreWizardItem(item, answers, region, item.item_type === 'bundle' ? item.componentIds.flatMap((id) => map.get(id) ?? []) : []));
      const limitedWarnings = [...new Set([...group, ...members])].filter((item) => item.use_case_fit[answers.useCase] <= LIMITED_FIT)
        .map((item) => `${item.name} is rated ${item.use_case_fit[answers.useCase]}/5 for ${humanize(answers.useCase)}: a last-resort pick when nothing better fits the budget.`);
      const score = scores.reduce((sum, item) => sum + item.score, 0) / scores.length;
      for (const { roles, standIns } of roleVariants([...assignment, ...otherRoles], primary, answers)) {
        if (!roles.length || roles.some((role) => !answers.piecesNeeded.includes(role))) continue;
        result.push({ items: group, roles, price: group.reduce((sum, item) => sum + priceOf(item, region)!, 0), score,
          value: score * roles.length - standIns.reduce((sum, standIn) => sum + standIn.penalty, 0), standIns: standIns.map((standIn) => standIn.role),
          explanations: [...new Set(scores.flatMap((item) => item.explanations)), ...(group.length === 2 ? [`+ Base and ${group[1].category === 'yoke' ? 'yoke handle' : 'grip'} share a direct mount standard`] : []),
            ...(roles.includes('second_stick') ? ['+ Left-hand or ambidextrous control supplies the second stick'] : []),
            ...(collective ? ['+ Dedicated collective with a long, friction-held stroke'] : []),
            ...standIns.map((standIn) => `+ ${standIn.note}`)],
          warnings: [...new Set([...scores.flatMap((item) => item.warnings), ...limitedWarnings])] });
      }
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
/** Best complete loadout that contains every seed piece (or the cheapest one with `cheapest`), or undefined when none fits. */
function search(options: RecommendedPiece[], answers: WizardAnswers, seed: RecommendedPiece[], prefer: WizardPick[] = [], cheapest = false) {
  type State = { pieces: RecommendedPiece[]; roles: WizardPiece[]; price: number; score: number };
  let states: State[] = [{ pieces: seed, roles: seed.flatMap((piece) => piece.roles), price: seed.reduce((sum, piece) => sum + piece.price, 0),
    score: seed.reduce((sum, piece) => sum + piece.value, 0) }];
  if (states[0].price > answers.budgetMax) return undefined;
  // Rank partial setups by their score plus the best possible score for each open role, so a piece covering
  // several roles through stand-ins does not crowd out single-role pieces that leave room for dedicated hardware.
  const bestPerRole = new Map(answers.piecesNeeded.map((role) => [role, Math.max(0, ...options.filter((option) => option.roles.includes(role)).map((option) => option.score))]));
  const potential = (state: State) => state.score + answers.piecesNeeded.reduce((sum, role) => sum + (state.roles.includes(role) ? 0 : bestPerRole.get(role)!), 0);
  for (const role of answers.piecesNeeded) {
    const next: State[] = [];
    for (const state of states) {
      if (state.roles.includes(role)) { next.push(state); continue; }
      for (const option of options.filter((option) => option.roles.includes(role))) {
        if (option.roles.some((piece) => state.roles.includes(piece)) || state.price + option.price > answers.budgetMax) continue;
        if (overlaps(state.pieces, option)) continue;
        next.push({ pieces: [...state.pieces, option], roles: [...state.roles, ...option.roles], price: state.price + option.price,
          score: state.score + option.value });
      }
    }
    // Keep both quality leaders and cheapest prefixes so a costly early choice cannot exhaust the budget.
    const quality = [...next].sort((a, b) => potential(b) - potential(a) || a.price - b.price).slice(0, 150);
    const cheap = [...next].sort((a, b) => a.price - b.price || b.score - a.score).slice(0, 150);
    states = [...new Set([...quality, ...cheap])];
    if (!states.length) break;
  }
  const complete = states.filter((state) => answers.piecesNeeded.length > 0 && answers.piecesNeeded.every((role) => state.roles.includes(role)));
  if (!complete.length) return undefined;
  if (cheapest) return preferBundles(complete.sort((a, b) => a.price - b.price || b.score - a.score)[0], options);
  // Among equally scored setups, keep the one sharing most picks with the current result, then the cheapest.
  const top = Math.max(...complete.map((state) => state.score));
  const shared = (state: State) => state.pieces.filter((piece) => prefer.some((ids) => sameIds(ids, idsOf(piece)))).length;
  return preferBundles(complete.filter((state) => top - state.score < 1e-6).sort((a, b) => shared(b) - shared(a) || a.price - b.price)[0], options);
}
const sameSet = (a: string[], b: string[]) => a.length === b.length && [...a].sort().every((value, index) => value === [...b].sort()[index]);
/**
 * Bundles are scored as a whole and separate parts one by one, so the search can pick the parts of a bundle
 * separately. When the same hardware in the same roles costs less as the bundle, buy the bundle.
 */
function preferBundles<T extends { pieces: RecommendedPiece[]; price: number }>(state: T, options: RecommendedPiece[]): T {
  let pieces = state.pieces;
  for (const bundle of options.filter((option) => option.items.length === 1 && option.items[0].item_type === 'bundle')) {
    const members = bundle.items[0].componentIds;
    const parts = pieces.filter((piece) => !piece.pinned && piece.items.length === 1 && members.includes(piece.items[0].id));
    if (!sameSet(parts.map((piece) => piece.items[0].id), members) || !sameSet(parts.flatMap((piece) => piece.roles), bundle.roles)
      || !sameSet(parts.flatMap((piece) => piece.standIns), bundle.standIns) || bundle.price >= parts.reduce((sum, piece) => sum + piece.price, 0)) continue;
    const at = pieces.indexOf(parts[0]);
    pieces = pieces.flatMap((piece, index) => index === at ? [bundle] : parts.includes(piece) ? [] : [piece]);
  }
  return pieces === state.pieces ? state : { ...state, pieces, price: pieces.reduce((sum, piece) => sum + piece.price, 0) };
}
/** Names the first new constraint a pinned pick breaks, checking the broadest cause first. */
function pickMismatch(ids: WizardPick, items: CatalogItem[], answers: WizardAnswers, region: Region): string {
  const offered = (relaxed: WizardAnswers) => candidates(items, relaxed, region).some((option) => sameIds(idsOf(option), ids));
  const byId = new Map(items.map((item) => [item.id, item]));
  const limited = (id: string): boolean => { const item = byId.get(id); return !!item && (isLastResort(item, answers.useCase) || item.componentIds.some(limited)); };
  if (ids.some(limited)) return 'Rated limited for this flying style, so the wizard does not recommend it.';
  if (!offered({ ...answers, mountType: 'clamp', piecesNeeded: [...PIECES], needsTwist: false })) return `Not sold on its own with a current ${region} price.`;
  if (!offered({ ...answers, mountType: 'clamp', needsTwist: false })) return 'No longer one of your selected controls.';
  if (answers.mountType === 'desk' && !offered({ ...answers, needsTwist: false })) return 'Requires a desk mount or cockpit rig and cannot sit loose on a desk.';
  return 'Has no twist axis, and without pedals the stick must now provide yaw.';
}
/** Over budget, setups up to this multiple of the cheapest acceptable setup's price compete on score. */
const OVER_BUDGET_TOLERANCE = 1.1;
/** Every way to take one role variant per pin without two pins sharing a role or hardware. */
function seeds(groups: RecommendedPiece[][]): RecommendedPiece[][] {
  return groups.reduce<RecommendedPiece[][]>((combos, group) => combos.flatMap((combo) => group
    .filter((option) => !option.roles.some((role) => combo.some((piece) => piece.roles.includes(role))) && !overlaps(combo, option))
    .map((option) => [...combo, option])), [[]]);
}
function subsets<T>(list: T[], size: number): T[][] {
  if (size === 0) return [[]];
  return list.flatMap((head, index) => subsets(list.slice(index + 1), size - 1).map((rest) => [head, ...rest]));
}
/**
 * Re-optimises for the answers on every call. Pinned picks are kept when they fit; when the budget
 * cannot hold all of them, the largest, best-scoring set of pins that still completes the setup wins.
 */
export function recommendLoadout(items: CatalogItem[], input: WizardAnswers, region: Region, { pinned = [], prefer = [] }: RecommendOptions = {}): WizardLoadout {
  const answers = normalizeWizardAnswers(input);
  const map = new Map(items.map((item) => [item.id, item]));
  // Bundles average their members' fit, so check each member: a pack must not slip in rejected pedals.
  const rejected = (item: CatalogItem): boolean => isLastResort(item, answers.useCase) || item.componentIds.some((id) => { const member = map.get(id); return !!member && rejected(member); });
  const limited = (item: CatalogItem): boolean => item.use_case_fit[answers.useCase] <= LIMITED_FIT || item.componentIds.some((id) => { const member = map.get(id); return !!member && limited(member); });
  const options = candidates(items, answers, region).filter((option) => !option.items.some(rejected));
  const dropped: DroppedPick[] = [];
  const drop = (ids: WizardPick, reason: string) => dropped.push({ ids, reason, items: ids.flatMap((id) => map.get(id) ? [map.get(id)!] : []) });
  // A pin fixes the hardware, not its roles: each pin keeps every role variant (e.g. a yoke with or without
  // its triggers standing in for pedals) and the search picks the combination that scores best.
  const pins: RecommendedPiece[][] = [];
  for (const ids of pinned) {
    const matches = options.filter((option) => sameIds(idsOf(option), ids)).map((option) => ({ ...option, pinned: true }));
    if (matches.length && seeds([...pins, matches]).length) pins.push(matches);
    else drop(ids, matches.length ? 'Overlaps another pinned control.' : pickMismatch(ids, items, answers, region));
  }
  const searchPinned = (groups: RecommendedPiece[][]) => {
    let found: ReturnType<typeof search>;
    for (const seed of seeds(groups)) {
      const result = search(options, answers, seed, prefer);
      if (result && (!found || result.score > found.score)) found = result;
    }
    return found;
  };
  let best = searchPinned(pins);
  // When nothing fits at all, the pins are not to blame; they stay pinned for a later change.
  if (!best && pins.length && search(options, answers, [])) {
    for (let size = pins.length - 1; size >= 0 && !best; size--) {
      for (const subset of subsets(pins, size)) {
        const found = searchPinned(subset);
        if (found && (!best || found.score > best.score)) best = found;
      }
    }
    for (const pin of pins.filter((pin) => !best!.pieces.some((piece) => pin.includes(piece)))) {
      drop(idsOf(pin[0]), pin[0].price > answers.budgetMax ? 'Over the new budget on its own.' : 'Does not fit the new budget alongside your other controls.');
    }
  }
  // Rather than an empty result or rejected hardware, show the cheapest recommended setup over budget. A buyer who
  // has to stretch anyway is not steered to last-resort hardware while a setup without it exists, and a clearly
  // better setup costing only a little more than the cheapest one wins.
  let overBudget: number | undefined;
  if (!best) {
    const relaxed = { ...answers, budgetMax: Infinity };
    const cheapestOf = (pool: RecommendedPiece[]) => seeds(pins).map((seed) => search(pool, relaxed, seed, prefer, true)).find(Boolean) ?? search(pool, relaxed, [], prefer, true);
    const sound = options.filter((option) => !option.items.some(limited));
    let pool = sound;
    let cheapest = cheapestOf(sound);
    if (!cheapest) { pool = options; cheapest = cheapestOf(options); }
    if (cheapest) {
      best = search(pool, { ...answers, budgetMax: cheapest.price * OVER_BUDGET_TOLERANCE }, cheapest.pieces.filter((piece) => piece.pinned), prefer) ?? cheapest;
      overBudget = Math.round((best.price - answers.budgetMax) * 100) / 100;
    }
  }
  const loadout = makeLoadout(best?.pieces ?? [], region, !!best, dropped);
  if (overBudget !== undefined) loadout.overBudget = overBudget;
  loadout.warnings.push(answers.mountType === 'desk' ? 'Desktop stability and included base plates need checking against manufacturer specifications.' : 'Mount hardware, brackets and cockpit compatibility need checking; mount costs are not included.');
  if (!best) loadout.warnings.unshift('No complete loadout meets these pieces, yaw requirements and regional budget. Increase the budget or revise your controls.');
  return loadout;
}
export function matchCuratedSetups(setups: WizardSetup[], items: CatalogItem[], input: WizardAnswers, region: Region) {
  const answers = normalizeWizardAnswers(input);
  const map = new Map(items.map((item) => [item.id, item]));
  return setups.filter((setup) => setup.data.use_case === answers.useCase && setup.data.budget_tier === budgetTier(answers.budgetMax))
    .filter((setup) => setup.data.items.every((ref) => {
      const item = map.get(ref.id);
      return !item || (!isSuperseded(item) && item.componentIds.every((id) => {
        const member = map.get(id);
        return !member || !isSuperseded(member);
      }));
    })).map((setup) => {
    const included = setup.data.items.map((ref) => ({ ...ref, item: map.get(ref.id) }));
    const unknownPrice = included.some(({ item }) => !item || priceOf(item, region) === undefined);
    const totalPrice = unknownPrice ? null : Math.round(included.reduce((sum, { item }) => sum + priceOf(item!, region)!, 0) * 100) / 100;
    const members = included.flatMap(({ item }) => !item ? [] : item.item_type === 'bundle' ? item.componentIds.flatMap((id) => map.get(id) ? [map.get(id)!] : []) : [item]);
    const bases = members.filter((item) => item.category === 'base').length;
    const grips = members.filter((item) => item.category === 'grip').length;
    const surfaceMembers = members.filter((item) => !needsBase(item) && item.category !== 'module');
    const warnings: string[] = [];
    if (bases !== grips) warnings.push('This reference includes an unpaired base or grip. Additional compatible hardware is required and is not included in the listed total.');
    if (
      answers.mountType === 'desk'
      && (included.some(({ item }) => item && !needsBase(item) && item.placement === 'mount_only')
        || included.some(({ item }) => item?.item_type === 'bundle' && item.placement == null && surfaceMembers.some((member) => member.placement === 'mount_only')))
    ) {
      warnings.push('This reference includes mount-only hardware that cannot sit loose on a desk.');
    }
    if (answers.needsTwist && !members.some((item) => hasTwist(item) && ['grip', 'stick_fixed'].includes(item.category)) && !members.some((item) => item.category === 'pedals')) warnings.push('This reference has no documented twist or pedal yaw control. Plan an additional yaw input.');
    return { ...setup, included, totalPrice, warnings, currency: currencies[region], withinBudget: totalPrice !== null && totalPrice <= answers.budgetMax };
  }).sort((a, b) => Number(b.withinBudget) - Number(a.withinBudget) || Number(b.data.pick) - Number(a.data.pick) || (a.totalPrice ?? Infinity) - (b.totalPrice ?? Infinity));
}
