import { describe, expect, it } from 'vitest';
import type { CatalogItem } from './catalog';
import { deriveComponentStats, resolvePrice } from './derive';
import { ComponentSchema } from './schema';
import { BUDGET_RANGES, budgetStops, budgetTier, deserializePicks, deserializeWizardState, matchCuratedSetups, nearestBudgetStop, normalizeWizardAnswers, picksOf, recommendLoadout, serializeWizardState } from './wizard';
import type { WizardSetup } from './wizard';

function hardware(id: string, category: CatalogItem['category'], amount: number, overrides: Partial<CatalogItem> = {}): CatalogItem {
  const component = ComponentSchema.parse({ brand: 'test', name: id, category: 'stick_fixed', controls: [{ type: 'button', count: 4 }], hardware: { axes: [{ name: 'X' }, { name: 'Y' }, { name: 'twist', sensor: 'hall' }] } });
  const { controlsSummary, totalAxes } = deriveComponentStats(component);
  const prices = [{ region: 'EU' as const, currency: 'EUR' as const, amount, verified: '2026-10-01', incl_vat: true, store: 'Test', kind: 'official' as const, source: 'manual' as const }];
  return { id, slug: id, name: id, brand: 'test', brandName: 'Test', category, item_type: 'component', status: 'current', verification: 'verified', prices, region: 'EU', resolvedPrice: resolvePrice(prices), totalAxes, totalLogicalButtons: controlsSummary.totalLogicalButtons, hasMinistick: false, hasBrakeAxis: false, controlsSummary, sensor: 'hall', gimbal: null, use_case_fit: component.use_case_fit, verdict: null, scores: null, images: [], componentIds: [], formerBrandNames: [], handedness: ['ambi'], mechanics: { forceAdjustable: 'Unknown', cams: 'Unknown', damping: 'Unknown' }, leverCount: 0, axes: component.hardware?.axes, ...overrides };
}

describe('wizard state', () => {
  it('round-trips every answer and derives yaw from selected pedals', () => {
    const answers = normalizeWizardAnswers({ useCase: 'space_hosas', targetSim: 'star_citizen', budgetMax: 640, mountType: 'chair_pit' });
    expect(deserializeWizardState(serializeWizardState(answers))).toEqual(answers);
    expect(answers.needsTwist).toBe(true);
    expect(normalizeWizardAnswers({ ...answers, piecesNeeded: [...answers.piecesNeeded, 'pedals'] }).needsTwist).toBe(false);
  });
  it('sanitizes invalid shared values without turning an empty control selection into defaults', () => {
    expect(deserializeWizardState('useCase=bad&piecesNeeded=stick,stick,invalid&budgetMax=Infinity&mountType=bad')).toMatchObject({ useCase: 'modern_jet', piecesNeeded: ['stick'], budgetMax: 750, mountType: 'desk' });
    expect(deserializeWizardState('piecesNeeded=').piecesNeeded).toEqual([]);
  });
  it('preserves existing pedals in shared answers and makes stick twist optional', () => {
    const answers = normalizeWizardAnswers({ piecesNeeded: ['stick'], hasExistingPedals: true });
    expect(answers.needsTwist).toBe(false);
    expect(deserializeWizardState(serializeWizardState(answers))).toEqual(answers);
    const result = recommendLoadout([hardware('stick', 'stick_fixed', 50, { axes: [{ name: 'X' }, { name: 'Y' }] })], answers, 'EU');
    expect(result.complete).toBe(true);
    expect(result.totalPrice).toBe(50);
  });
});

describe('loadout rules', () => {
  it('finds a complete package under the total budget and sums controls', () => {
    const items = [hardware('fancy', 'stick_fixed', 300, { use_case_fit: { ...ComponentSchema.parse({ brand: 'test', name: 'x', category: 'stick_fixed' }).use_case_fit, modern_jet: 5 } }), hardware('stick', 'stick_fixed', 90), hardware('throttle', 'throttle', 70)];
    const result = recommendLoadout(items, normalizeWizardAnswers({ budgetMax: 180 }), 'EU');
    expect(result.complete).toBe(true);
    expect(result.totalPrice).toBe(160);
    expect(result.totalLogicalButtons).toBe(8);
    expect(result.totalAxes).toBe(6);
    expect(result.items.map((item) => item.id)).toEqual(['stick', 'throttle']);
  });
  it('rejects bare bases, incompatible pairs and missing regional prices', () => {
    const base = hardware('base', 'base', 30, { mount: { accepts: ['A'] } });
    const grip = hardware('grip', 'grip', 20, { mount: { provides: 'B' } });
    const answers = normalizeWizardAnswers({ piecesNeeded: ['stick'] });
    expect(recommendLoadout([base, grip], answers, 'EU').complete).toBe(false);
    expect(recommendLoadout([hardware('stick', 'stick_fixed', 20)], answers, 'UK').complete).toBe(false);
    expect(recommendLoadout([base, { ...grip, mount: { provides: 'A' } }], answers, 'EU').totalPrice).toBe(50);
  });
  it('never offers a yoke handle on its own and pairs it with a base that accepts it', () => {
    const handle = hardware('handle', 'yoke', 140, { mount: { provides: 'yoke-qr' } });
    const base = hardware('yoke-base', 'base', 400, { mount: { accepts: ['yoke-qr'] } });
    const complete = hardware('desk-yoke', 'yoke', 250, { mount: { provides: 'desk' } });
    const answers = normalizeWizardAnswers({ piecesNeeded: ['yoke'], budgetMax: 1000 });
    expect(recommendLoadout([handle], answers, 'EU').complete).toBe(false);
    const paired = recommendLoadout([handle, base], answers, 'EU');
    expect(paired.complete).toBe(true);
    expect(paired.items.map((i) => i.id).sort()).toEqual(['handle', 'yoke-base']);
    expect(paired.totalPrice).toBe(540);
    expect(recommendLoadout([complete], answers, 'EU').items.map((i) => i.id)).toEqual(['desk-yoke']);
  });
  it('requires primary twist without pedals and does not claim non-twist yaw', () => {
    const stick = hardware('stick', 'stick_fixed', 50, { axes: [{ name: 'X' }, { name: 'Y' }] });
    expect(recommendLoadout([stick], normalizeWizardAnswers({ piecesNeeded: ['stick'] }), 'EU').complete).toBe(false);
    expect(recommendLoadout([stick, hardware('pedals', 'pedals', 50)], normalizeWizardAnswers({ piecesNeeded: ['stick', 'pedals'] }), 'EU').complete).toBe(true);
  });
  it('pairs right and left sticks, allows two copies of a shared base, and totals each copy', () => {
    const base = hardware('base', 'base', 50, { mount: { accepts: ['A'] }, handedness: [] });
    const right = hardware('right', 'grip', 30, { mount: { provides: 'A' }, handedness: ['right'] });
    const left = hardware('left', 'grip', 30, { mount: { provides: 'A' }, handedness: ['left'] });
    const answers = normalizeWizardAnswers({ useCase: 'space_hosas' });
    expect(recommendLoadout([base, right], answers, 'EU').complete).toBe(false);
    const result = recommendLoadout([base, right, left], answers, 'EU');
    expect(result.complete).toBe(true);
    expect(result.totalPrice).toBe(160);
    expect(result.items.filter((item) => item.id === 'base')).toHaveLength(2);
    const ambi = recommendLoadout([hardware('ambi', 'stick_fixed', 60)], answers, 'EU');
    expect(ambi.totalPrice).toBe(120);
  });
  it('uses a complete bundle SKU once and does not charge its members separately', () => {
    const stick = hardware('stick', 'stick_fixed', 100);
    const throttle = hardware('throttle', 'throttle', 100);
    const bundle = hardware('bundle', 'hotas_bundle', 150, { item_type: 'bundle', componentIds: ['stick', 'throttle'], totalAxes: 6, totalLogicalButtons: 8 });
    const result = recommendLoadout([stick, throttle, bundle], normalizeWizardAnswers({ budgetMax: 150 }), 'EU');
    expect(result.items.map((item) => item.id)).toEqual(['bundle']);
    expect(result.totalPrice).toBe(150);
    expect(result.totalLogicalButtons).toBe(8);
  });
});

describe('curated reference matching', () => {
  it('matches discipline and tier while honestly marking unknown and over-budget totals', () => {
    const setups: WizardSetup[] = [{ id: 'reference', data: { title: 'Reference', description: 'Reference', reasoning: 'Reason', use_case: 'modern_jet', budget_tier: 'mid', pick: false, items: [{ item_type: 'component', id: 'stick', role: 'Primary' }] } }];
    const answers = normalizeWizardAnswers({ budgetMax: 500 });
    expect(budgetTier(500)).toBe('mid');
    expect(matchCuratedSetups(setups, [hardware('stick', 'stick_fixed', 600)], answers, 'EU')[0]).toMatchObject({ totalPrice: 600, withinBudget: false });
    expect(matchCuratedSetups(setups, [], answers, 'EU')[0].totalPrice).toBeNull();
    expect(matchCuratedSetups(setups, [], { ...answers, useCase: 'heli' }, 'EU')).toEqual([]);
  });
  it('flags an incomplete reference instead of suggesting its listed price buys a complete stick', () => {
    const setups: WizardSetup[] = [{ id: 'incomplete', data: { title: 'Incomplete', description: 'Reference', reasoning: 'Reason', use_case: 'space_hosas', budget_tier: 'mid', pick: false, items: [{ item_type: 'component', id: 'base', role: 'Second stick' }] } }];
    const result = matchCuratedSetups(setups, [hardware('base', 'base', 100)], normalizeWizardAnswers({ useCase: 'space_hosas', budgetMax: 500 }), 'EU');
    expect(result[0].warnings.some((warning) => warning.includes('unpaired'))).toBe(true);
  });
});

describe('live editing', () => {
  const fit = (modern_jet: number) => ({ ...ComponentSchema.parse({ brand: 'test', name: 'x', category: 'stick_fixed' }).use_case_fit, modern_jet });
  const catalog = () => [
    hardware('cheap-stick', 'stick_fixed', 80), hardware('great-stick', 'stick_fixed', 400, { use_case_fit: fit(5) }),
    hardware('throttle', 'throttle', 100), hardware('pedals', 'pedals', 150), hardware('plain-stick', 'stick_fixed', 60, { axes: [{ name: 'X' }, { name: 'Y' }] }),
  ];
  it('round-trips picks with the answers and ignores malformed ids', () => {
    const answers = normalizeWizardAnswers({ budgetMax: 600 });
    const query = serializeWizardState(answers, [['vkb/base', 'vkb/grip'], ['throttle']]);
    expect(deserializePicks(new URLSearchParams(query).get('picks'))).toEqual([['vkb/base', 'vkb/grip'], ['throttle']]);
    expect(deserializeWizardState(query)).toEqual(answers);
    expect(deserializePicks('ok,<script>,a~b~c')).toEqual([['ok'], ['a', 'b']]);
    expect(serializeWizardState(answers)).not.toContain('picks');
  });
  it('keeps picks that still fit when the budget rises and fills only the new roles', () => {
    const first = recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick', 'throttle'], budgetMax: 200 }), 'EU');
    expect(picksOf(first)).toEqual([['cheap-stick'], ['throttle']]);
    const next = recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick', 'throttle', 'pedals'], budgetMax: 1000 }), 'EU', { keep: picksOf(first) });
    expect(next.complete).toBe(true);
    expect(picksOf(next)).toEqual([['cheap-stick'], ['throttle'], ['pedals']]);
    expect(next.pieces.map((piece) => !!piece.kept)).toEqual([true, true, false]);
    expect(next.dropped).toEqual([]);
    // Without picks, the same settings pick the higher-rated stick.
    expect(recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick', 'throttle', 'pedals'], budgetMax: 1000 }), 'EU').items[0].id).toBe('great-stick');
  });
  it('flags picks that no longer fit with the constraint they break', () => {
    const keep = [['great-stick'], ['throttle']];
    const cheaper = recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick', 'throttle'], budgetMax: 450 }), 'EU', { keep });
    expect(cheaper.complete).toBe(true);
    expect(picksOf(cheaper)).toEqual([['throttle'], ['cheap-stick']]);
    expect(cheaper.dropped).toMatchObject([{ ids: ['great-stick'], reason: 'Leaves too little budget for your other controls.' }]);
    const overBudget = recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick'], budgetMax: 300 }), 'EU', { keep: [['great-stick']] });
    expect(overBudget.dropped[0].reason).toBe('Over the new budget on its own.');
    const fewer = recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick'], budgetMax: 1000 }), 'EU', { keep });
    expect(fewer.dropped).toMatchObject([{ ids: ['throttle'], reason: 'No longer one of your selected controls.' }]);
    expect(picksOf(fewer)).toEqual([['great-stick']]);
    const twist = recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick'], budgetMax: 1000 }), 'EU', { keep: [['plain-stick']] });
    expect(twist.dropped[0].reason).toMatch(/twist/);
    expect(recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick'] }), 'EU', { keep: [['gone']] }).dropped[0].reason).toMatch(/EU price/);
  });
  it('does not blame picks when no setup fits the settings at all', () => {
    const result = recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick', 'throttle'], budgetMax: 100 }), 'EU', { keep: [['cheap-stick'], ['throttle']] });
    expect(result.complete).toBe(false);
    expect(result.dropped).toEqual([]);
  });
});

describe('budget slider scale', () => {
  it('spans entry level to high end with rounded, increasing, log-spaced stops per currency', () => {
    for (const currency of ['EUR', 'GBP', 'USD'] as const) {
      const stops = budgetStops(currency);
      expect(stops[0]).toBe(BUDGET_RANGES[currency].min);
      expect(stops.at(-1)).toBe(BUDGET_RANGES[currency].max);
      expect(stops.every((stop, index) => index === 0 || stop > stops[index - 1])).toBe(true);
      expect(stops.filter((stop) => stop >= 2000).every((stop) => stop % 100 === 0)).toBe(true);
      // Notches below the mid tier are much finer than near the top.
      expect(stops.filter((stop) => stop <= 350).length).toBeGreaterThan(stops.filter((stop) => stop >= 2500).length);
    }
    const stops = budgetStops('EUR');
    expect(stops[nearestBudgetStop(stops, 750)]).toBe(750);
    expect(nearestBudgetStop(stops, 20000)).toBe(stops.length - 1);
    expect(nearestBudgetStop(stops, 1)).toBe(0);
  });
});
