import { describe, expect, it } from 'vitest';
import type { CatalogItem } from './catalog';
import { deriveComponentStats, resolvePrice } from './derive';
import { ComponentSchema } from './schema';
import { budgetTier, deserializeWizardState, matchCuratedSetups, normalizeWizardAnswers, recommendLoadout, serializeWizardState } from './wizard';
import type { WizardSetup } from './wizard';

function hardware(id: string, category: CatalogItem['category'], amount: number, overrides: Partial<CatalogItem> = {}): CatalogItem {
  const component = ComponentSchema.parse({ brand: 'test', name: id, category: 'stick_fixed', controls: [{ type: 'button', count: 4 }], hardware: { axes: [{ name: 'X' }, { name: 'Y' }, { name: 'twist', sensor: 'hall' }] } });
  const { controlsSummary, totalAxes } = deriveComponentStats(component);
  const prices = [{ region: 'EU' as const, currency: 'EUR' as const, amount, verified: '2026-10-01', incl_vat: true, store: 'Test', kind: 'official' as const, source: 'manual' as const }];
  return { id, slug: id, name: id, brand: 'test', brandName: 'Test', category, item_type: 'component', status: 'current', verification: 'verified', prices, region: 'EU', resolvedPrice: resolvePrice(prices), totalAxes, totalLogicalButtons: controlsSummary.totalLogicalButtons, hasMinistick: false, hasBrakeAxis: false, controlsSummary, sensor: 'hall', usesPotentiometers: false, gimbal: null, use_case_fit: component.use_case_fit, verdict: null, scores: null, images: [], componentIds: [], formerBrandNames: [], handedness: ['ambi'], mechanics: { forceAdjustable: 'Unknown', cams: 'Unknown', damping: 'Unknown' }, leverCount: 0, axes: component.hardware?.axes, ...overrides };
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
  it('excludes superseded components and bundles containing them', () => {
    const old = hardware('old', 'stick_fixed', 10, { status: 'discontinued', successor: 'new' });
    const bundle = hardware('bundle', 'stick_combo', 10, { item_type: 'bundle', componentIds: ['old'] });
    const answers = normalizeWizardAnswers({ piecesNeeded: ['stick'], budgetMax: 100 });
    expect(recommendLoadout([old, bundle], answers, 'EU').items).toEqual([]);
    const current = hardware('new', 'stick_fixed', 50);
    expect(recommendLoadout([old, bundle, current], answers, 'EU').items.map(item => item.id)).toEqual(['new']);
  });
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
  it('excludes references to superseded items and bundles with superseded members', () => {
    const old = hardware('old', 'stick_fixed', 10, { status: 'discontinued', successor: 'new' });
    const bundle = hardware('bundle', 'stick_combo', 10, { item_type: 'bundle', componentIds: ['old'] });
    const setups: WizardSetup[] = [old, bundle].map(item => ({ id: item.id, data: {
      title: item.name, description: 'Reference', reasoning: 'Reason', use_case: 'modern_jet', budget_tier: 'mid', pick: false,
      items: [{ item_type: item.item_type, id: item.id, role: 'Primary' }],
    } }));
    expect(matchCuratedSetups(setups, [old, bundle], normalizeWizardAnswers({ budgetMax: 500 }), 'EU')).toEqual([]);
  });
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
