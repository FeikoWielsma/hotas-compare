import { describe, expect, it } from 'vitest';
import type { CatalogItem } from './catalog';
import { deriveComponentStats, resolvePrice } from './derive';
import { ComponentSchema } from './schema';
import { readContent } from '../../scripts/content';
import { BUDGET_RANGES, budgetStops, budgetTier, deserializePicks, deserializeWizardState, matchCuratedSetups, nearestBudgetStop, normalizeWizardAnswers, picksOf, recommendLoadout, scoreWizardItem, serializeWizardState } from './wizard';
import type { WizardAnswers, WizardSetup } from './wizard';

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
  it('excludes mount-only hardware like VKB STECS Mini on desk setups while allowing it on mounts', () => {
    const stick = hardware('vkb/gladiator-nxt-evo-space-combat-edition-right', 'stick_fixed', 180, { placement: 'both' });
    const stecsMini = hardware('vkb/stecs-throttle-mini', 'throttle', 219, {
      placement: 'mount_only',
      use_case_fit: { ...ComponentSchema.parse({ brand: 'vkb', name: 'mini', category: 'throttle' }).use_case_fit, modern_jet: 5 },
    });
    const stecsMiniPlus = hardware('vkb/stecs-throttle-mini-plus', 'throttle', 239, {
      placement: 'both',
      use_case_fit: { ...ComponentSchema.parse({ brand: 'vkb', name: 'plus', category: 'throttle' }).use_case_fit, modern_jet: 4 },
    });
    const deskResult = recommendLoadout([stick, stecsMini, stecsMiniPlus], normalizeWizardAnswers({ mountType: 'desk', budgetMax: 500 }), 'EU');
    expect(deskResult.complete).toBe(true);
    expect(deskResult.items.map((item) => item.id)).toEqual([
      'vkb/gladiator-nxt-evo-space-combat-edition-right',
      'vkb/stecs-throttle-mini-plus',
    ]);
    const onlyMiniOnDesk = recommendLoadout([stick, stecsMini], normalizeWizardAnswers({ mountType: 'desk', budgetMax: 500 }), 'EU');
    expect(onlyMiniOnDesk.complete).toBe(false);
    const clampResult = recommendLoadout([stick, stecsMini, stecsMiniPlus], normalizeWizardAnswers({ mountType: 'clamp', budgetMax: 500 }), 'EU');
    expect(clampResult.complete).toBe(true);
    expect(clampResult.items.map((item) => item.id)).toContain('vkb/stecs-throttle-mini');

    // Grips have placement: 'mount_only' standalone, but can sit on a desk when paired with a desk-capable base.
    const deskBase = hardware('desk-base', 'base', 150, { mount: { accepts: ['A'] }, placement: 'both' });
    const mountBase = hardware('mount-base', 'base', 150, { mount: { accepts: ['A'] }, placement: 'mount_only' });
    const grip = hardware('grip', 'grip', 100, { mount: { provides: 'A' }, placement: 'mount_only' });
    expect(recommendLoadout([deskBase, grip], normalizeWizardAnswers({ piecesNeeded: ['stick'], mountType: 'desk' }), 'EU').complete).toBe(true);
    expect(recommendLoadout([mountBase, grip], normalizeWizardAnswers({ piecesNeeded: ['stick'], mountType: 'desk' }), 'EU').complete).toBe(false);
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
  it('warns when a curated setup includes mount-only hardware for a desk user', () => {
    const setups: WizardSetup[] = [{ id: 'mini-ref', data: { title: 'Mini Reference', description: 'Reference', reasoning: 'Reason', use_case: 'modern_jet', budget_tier: 'mid', pick: false, items: [{ item_type: 'component', id: 'vkb/stecs-throttle-mini', role: 'Throttle' }] } }];
    const stecsMini = hardware('vkb/stecs-throttle-mini', 'throttle', 219, { placement: 'mount_only' });
    const deskRef = matchCuratedSetups(setups, [stecsMini], normalizeWizardAnswers({ mountType: 'desk', budgetMax: 500 }), 'EU');
    expect(deskRef[0].warnings.some((warning) => warning.includes('mount-only'))).toBe(true);
    const clampRef = matchCuratedSetups(setups, [stecsMini], normalizeWizardAnswers({ mountType: 'clamp', budgetMax: 500 }), 'EU');
    expect(clampRef[0].warnings.some((warning) => warning.includes('mount-only'))).toBe(false);
  });
});

describe('live editing', () => {
  const fit = (modern_jet: number) => ({ ...ComponentSchema.parse({ brand: 'test', name: 'x', category: 'stick_fixed' }).use_case_fit, modern_jet });
  const catalog = () => [
    hardware('cheap-stick', 'stick_fixed', 80), hardware('great-stick', 'stick_fixed', 400, { use_case_fit: fit(5) }),
    hardware('throttle', 'throttle', 100), hardware('pedals', 'pedals', 150), hardware('plain-stick', 'stick_fixed', 60, { axes: [{ name: 'X' }, { name: 'Y' }] }),
  ];
  it('round-trips pins with the answers and ignores malformed ids', () => {
    const answers = normalizeWizardAnswers({ budgetMax: 600 });
    const query = serializeWizardState(answers, [['vkb/base', 'vkb/grip'], ['throttle']]);
    expect(deserializePicks(new URLSearchParams(query).get('pinned'))).toEqual([['vkb/base', 'vkb/grip'], ['throttle']]);
    expect(deserializeWizardState(query)).toEqual(answers);
    expect(deserializePicks('ok,<script>,a~b~c')).toEqual([['ok'], ['a', 'b']]);
    expect(serializeWizardState(answers)).not.toContain('pinned');
  });
  it('upgrades unpinned picks when the budget rises', () => {
    const answers = normalizeWizardAnswers({ piecesNeeded: ['stick', 'throttle'], budgetMax: 200 });
    const first = recommendLoadout(catalog(), answers, 'EU');
    expect(picksOf(first)).toEqual([['cheap-stick'], ['throttle']]);
    const raised = recommendLoadout(catalog(), { ...answers, budgetMax: 1000 }, 'EU', { prefer: picksOf(first) });
    expect(picksOf(raised)).toEqual([['great-stick'], ['throttle']]);
    expect(raised.dropped).toEqual([]);
    // A pinned stick stays, and the extra budget goes to the open roles only.
    const pinned = recommendLoadout(catalog(), { ...answers, piecesNeeded: ['stick', 'throttle', 'pedals'], budgetMax: 1000 }, 'EU', { pinned: [['cheap-stick']] });
    expect(picksOf(pinned)).toEqual([['cheap-stick'], ['throttle'], ['pedals']]);
    expect(pinned.pieces.map((piece) => !!piece.pinned)).toEqual([true, false, false]);
  });
  it('re-optimises on a budget cut instead of dropping the priciest pin', () => {
    // Good pedals, so dedicated pedals beat the stick's twist standing in for them once they fit.
    const items = [...catalog(), hardware('cheap-pedals', 'pedals', 50, { use_case_fit: fit(5) })];
    const answers = normalizeWizardAnswers({ piecesNeeded: ['stick', 'pedals'], budgetMax: 1000 });
    const pinned = [['great-stick'], ['pedals']];
    expect(picksOf(recommendLoadout(items, answers, 'EU', { pinned }))).toEqual([['great-stick'], ['pedals']]);
    // Both pins (550) exceed 460; the higher-scoring pin survives and the pedals are re-chosen.
    const cut = recommendLoadout(items, { ...answers, budgetMax: 460 }, 'EU', { pinned });
    expect(picksOf(cut)).toEqual([['great-stick'], ['cheap-pedals']]);
    expect(cut.dropped).toMatchObject([{ ids: ['pedals'], reason: 'Does not fit the new budget alongside your other controls.' }]);
    // Unpinned picks simply re-optimise to the best setup under the new budget.
    const low = recommendLoadout(items, { ...answers, budgetMax: 200 }, 'EU', { prefer: [['great-stick'], ['pedals']] });
    expect(low.complete).toBe(true);
    expect(low.totalPrice).toBeLessThanOrEqual(200);
    expect(low.dropped).toEqual([]);
  });
  it('keeps the current pick when an alternative scores exactly the same', () => {
    const items = [hardware('stick-a', 'stick_fixed', 90), hardware('stick-b', 'stick_fixed', 90)];
    const answers = normalizeWizardAnswers({ piecesNeeded: ['stick'], budgetMax: 500 });
    expect(picksOf(recommendLoadout(items, answers, 'EU', { prefer: [['stick-a']] }))).toEqual([['stick-a']]);
    expect(picksOf(recommendLoadout(items, answers, 'EU', { prefer: [['stick-b']] }))).toEqual([['stick-b']]);
  });
  it('flags pins that no longer fit with the constraint they break', () => {
    expect(recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick'], budgetMax: 300 }), 'EU', { pinned: [['great-stick']] }).dropped[0].reason).toBe('Over the new budget on its own.');
    const fewer = recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick'], budgetMax: 1000 }), 'EU', { pinned: [['great-stick'], ['throttle']] });
    expect(fewer.dropped).toMatchObject([{ ids: ['throttle'], reason: 'No longer one of your selected controls.' }]);
    expect(picksOf(fewer)).toEqual([['great-stick']]);
    const twist = recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick'], budgetMax: 1000 }), 'EU', { pinned: [['plain-stick']] });
    expect(twist.dropped[0].reason).toMatch(/twist/);
    expect(recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick'] }), 'EU', { pinned: [['gone']] }).dropped[0].reason).toMatch(/EU price/);

    const stecsMini = hardware('vkb/stecs-throttle-mini', 'throttle', 219, { placement: 'mount_only' });
    const stecsMiniPlus = hardware('vkb/stecs-throttle-mini-plus', 'throttle', 239, { placement: 'both' });
    const deskRecompute = recommendLoadout(
      [...catalog(), stecsMini, stecsMiniPlus],
      normalizeWizardAnswers({ piecesNeeded: ['stick', 'throttle'], mountType: 'desk', budgetMax: 600 }),
      'EU',
      { pinned: [['cheap-stick'], ['vkb/stecs-throttle-mini']] },
    );
    expect(deskRecompute.complete).toBe(true);
    expect(deskRecompute.dropped).toMatchObject([
      { ids: ['vkb/stecs-throttle-mini'], reason: 'Requires a desk mount or cockpit rig and cannot sit loose on a desk.' },
    ]);
    expect(deskRecompute.items.map((item) => item.id)).toContain('cheap-stick');
    expect(deskRecompute.items.map((item) => item.id)).not.toContain('vkb/stecs-throttle-mini');
  });
  it('does not blame pins when no setup fits the budget, and shows the cheapest setup with them over budget', () => {
    const result = recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['stick', 'throttle'], budgetMax: 100 }), 'EU', { pinned: [['cheap-stick'], ['throttle']] });
    expect(result.dropped).toEqual([]);
    expect(picksOf(result)).toEqual([['cheap-stick'], ['throttle']]);
    expect(result.overBudget).toBe(80);
    // Nothing can complete the setup at any price: an honest empty result.
    expect(recommendLoadout(catalog(), normalizeWizardAnswers({ piecesNeeded: ['yoke'] }), 'EU').complete).toBe(false);
  });
});

describe('bundle-only parts', () => {
  it('still recommends a curated bundle-preferred base and grip pair', () => {
    const base = hardware('base', 'base', 100, { mount: { accepts: ['A'] }, soldMainlyInBundle: true });
    const grip = hardware('grip', 'grip', 100, { mount: { provides: 'A' }, soldMainlyInBundle: true });
    const result = recommendLoadout([base, grip], normalizeWizardAnswers({ piecesNeeded: ['stick'], budgetMax: 500 }), 'EU');
    expect(result.complete).toBe(true);
    expect(result.items.map(i => i.id).sort()).toEqual(['base', 'grip']);
  });
  it('never recommends the X52 throttle on its own and offers the X52 HOTAS instead', () => {
    const stick = hardware('logitech/x52-space-flight-stick', 'stick_fixed', 100, { soldStandalone: false });
    const throttle = hardware('logitech/x52-throttle', 'throttle', 100, { soldStandalone: false });
    const hotas = hardware('logitech/x52-hotas-system', 'hotas_bundle', 180, { item_type: 'bundle', componentIds: [stick.id, throttle.id] });
    const otherStick = hardware('other-stick', 'stick_fixed', 60);
    const items = [stick, throttle, hotas, otherStick];
    const throttleOnly = recommendLoadout(items, normalizeWizardAnswers({ piecesNeeded: ['throttle'], budgetMax: 500 }), 'EU');
    expect(throttleOnly.complete).toBe(false);
    const hotasResult = recommendLoadout(items, normalizeWizardAnswers({ piecesNeeded: ['stick', 'throttle'], budgetMax: 500 }), 'EU');
    expect(picksOf(hotasResult)).toEqual([['logitech/x52-hotas-system']]);
    expect(recommendLoadout(items, normalizeWizardAnswers({ piecesNeeded: ['stick', 'throttle'], budgetMax: 500 }), 'EU', { pinned: [['logitech/x52-throttle']] }).dropped[0].reason).toMatch(/Not sold on its own/);
  });
  it('excludes a bundle-only grip from base + grip pairs', () => {
    const base = hardware('base', 'base', 100, { mount: { accepts: ['A'] } });
    const grip = hardware('grip', 'grip', 100, { mount: { provides: 'A' }, soldStandalone: false });
    expect(recommendLoadout([base, grip], normalizeWizardAnswers({ piecesNeeded: ['stick'], budgetMax: 500 }), 'EU').complete).toBe(false);
  });
});

describe('stand-ins and suitability', () => {
  const fit = (overrides: Partial<CatalogItem['use_case_fit']>) => ({ ...ComponentSchema.parse({ brand: 'test', name: 'x', category: 'yoke' }).use_case_fit, ...overrides });
  const allInOne = () => hardware('all-in-one', 'yoke', 330, { use_case_fit: fit({ airliner: 4 }), axes: [{ name: 'Pitch' }, { name: 'Roll' }, { name: 'Left trigger (rudder)' }, { name: 'Quadrant lever 1' }] });
  const dedicated = () => [
    hardware('yoke', 'yoke', 200, { use_case_fit: fit({ airliner: 5 }), axes: [{ name: 'Pitch' }, { name: 'Roll' }] }),
    hardware('quadrant', 'quadrant', 130, { use_case_fit: fit({ airliner: 5 }) }),
    hardware('pedals', 'pedals', 300, { use_case_fit: fit({ airliner: 4 }) }),
  ];
  const airliner = (budgetMax: number, extra: Partial<WizardAnswers> = {}) => normalizeWizardAnswers({ useCase: 'airliner', budgetMax, ...extra });
  it('lets built-in rudder and throttle axes cover pedals and a quadrant on a budget', () => {
    const result = recommendLoadout([allInOne(), ...dedicated()], airliner(400), 'EU');
    expect(picksOf(result)).toEqual([['all-in-one']]);
    expect(result.pieces[0].roles).toEqual(['yoke', 'pedals', 'quadrant']);
    expect(result.pieces[0].standIns).toEqual(['pedals', 'quadrant']);
    expect(result.pieces[0].explanations.some((line) => /stands in for pedals/.test(line))).toBe(true);
  });
  it('prefers dedicated hardware once the budget allows it', () => {
    expect(picksOf(recommendLoadout([allInOne(), ...dedicated()], airliner(700), 'EU')).flat().sort()).toEqual(['pedals', 'quadrant', 'yoke']);
  });
  it('makes a yoke with its own quadrant cover the quadrant role instead of buying a second one', () => {
    const levers = [{ name: 'Yoke', category: 'yoke' as const, controls: [{ type: 'lever' as const, kind: 'other' as const, analog: true, count: 4 }] }];
    const yoke = hardware('lever-yoke', 'yoke', 330, { use_case_fit: fit({ airliner: 4 }), controlSections: levers, axes: [{ name: 'Pitch' }, { name: 'Roll' }, { name: 'Quadrant lever 1' }] });
    const quadrant = hardware('great-quadrant', 'quadrant', 100, { use_case_fit: fit({ airliner: 5 }) });
    const result = recommendLoadout([yoke, quadrant], airliner(1000, { piecesNeeded: ['yoke', 'quadrant'] }), 'EU');
    expect(picksOf(result)).toEqual([['lever-yoke']]);
    expect(result.pieces[0].standIns).toEqual(['quadrant']);
    // A single throttle lever is not a quadrant, so a dedicated one may still join it.
    const single = { ...yoke, controlSections: [{ ...levers[0], controls: [{ type: 'lever' as const, kind: 'throttle_single' as const, analog: true, count: 1 }] }] };
    expect(picksOf(recommendLoadout([single, quadrant], airliner(1000, { piecesNeeded: ['yoke', 'quadrant'] }), 'EU'))).toEqual([['lever-yoke'], ['great-quadrant']]);
  });
  it('matches Airbus and Boeing replicas to a sidestick or yoke airliner setup', () => {
    const airbus = hardware('airbus-quadrant', 'quadrant', 130, { use_case_fit: fit({ airliner: 5 }), airlinerFamily: 'airbus' });
    const boeing = hardware('boeing-quadrant', 'quadrant', 170, { use_case_fit: fit({ airliner: 4 }), airlinerFamily: 'boeing' });
    const quadrants = [airbus, boeing];
    const stick = hardware('stick', 'stick_fixed', 60);
    const yoke = hardware('yoke', 'yoke', 200, { axes: [{ name: 'Pitch' }, { name: 'Roll' }] });
    expect(recommendLoadout([...quadrants, stick], airliner(1000, { piecesNeeded: ['stick', 'quadrant'], hasExistingPedals: true }), 'EU').items.map((item) => item.id)).toContain('airbus-quadrant');
    const boeingSetup = recommendLoadout([...quadrants, yoke], airliner(1000, { piecesNeeded: ['yoke', 'quadrant'], hasExistingPedals: true }), 'EU');
    expect(boeingSetup.items.map((item) => item.id)).toContain('boeing-quadrant');
    expect(boeingSetup.pieces.find((piece) => piece.items[0].id === 'boeing-quadrant')?.explanations).toContain('+ Boeing replica matches your yoke cockpit');
  });
  it('lets one helicopter stick with twist and a throttle axis cover collective and pedals on a budget', () => {
    const stick = hardware('budget-stick', 'stick_fixed', 120, { axes: [{ name: 'X' }, { name: 'Y' }, { name: 'Twist' }, { name: 'Throttle' }] });
    const heli = (budgetMax: number) => normalizeWizardAnswers({ useCase: 'heli', budgetMax });
    const budget = recommendLoadout([stick, hardware('pedals', 'pedals', 200), hardware('throttle', 'throttle', 150)], heli(150), 'EU');
    expect(budget.pieces).toMatchObject([{ roles: ['stick', 'collective', 'pedals'], standIns: ['collective', 'pedals'] }]);
    expect(recommendLoadout([stick, hardware('pedals', 'pedals', 200)], heli(400), 'EU').pieces.find((piece) => piece.roles.includes('pedals'))?.items[0].id).toBe('pedals');
  });
  it('only uses stand-ins for flying styles that accept them', () => {
    // Jets accept a twist rudder in place of pedals, but never yoke levers in place of a throttle quadrant.
    const jet = normalizeWizardAnswers({ useCase: 'modern_jet', piecesNeeded: ['yoke', 'quadrant'], budgetMax: 400 });
    expect(recommendLoadout([allInOne()], jet, 'EU').complete).toBe(false);
  });
  it('keeps a pinned all-in-one and lets it give up a stand-in role to pinned pedals', () => {
    const items = [allInOne(), ...dedicated()];
    const result = recommendLoadout(items, airliner(1000), 'EU', { pinned: [['all-in-one'], ['pedals']] });
    expect(result.dropped).toEqual([]);
    expect(result.pieces.find((piece) => piece.items[0].id === 'all-in-one')?.roles).not.toContain('pedals');
    expect(result.items.map((item) => item.id)).toContain('pedals');
  });
  it('never picks a 1/5 fit, even inside a bundle, and shows the cheapest acceptable setup over budget instead', () => {
    const poor = hardware('poor-pedals', 'pedals', 50, { use_case_fit: fit({ airliner: 1 }) });
    const ok = hardware('ok-pedals', 'pedals', 250, { use_case_fit: fit({ airliner: 3 }) });
    const pack = hardware('pack', 'system', 60, { item_type: 'bundle', componentIds: ['poor-pedals'], use_case_fit: fit({ airliner: 3 }) });
    const answers = airliner(600, { piecesNeeded: ['pedals'] });
    const fits = recommendLoadout([poor, ok], answers, 'EU');
    expect(picksOf(fits)).toEqual([['ok-pedals']]);
    expect(fits.overBudget).toBeUndefined();
    const tight = recommendLoadout([poor, ok, pack], { ...answers, budgetMax: 100 }, 'EU');
    expect(picksOf(tight)).toEqual([['ok-pedals']]);
    expect(tight.overBudget).toBe(150);
    expect(recommendLoadout([poor, ok], answers, 'EU', { pinned: [['poor-pedals']] }).dropped[0].reason).toMatch(/Rated limited/);
  });
  it('makes an unreviewed product win only when it is clearly better', () => {
    const reviewed = hardware('reviewed-yoke', 'yoke', 200, { use_case_fit: fit({ airliner: 4 }) });
    const pending = hardware('pending-yoke', 'yoke', 200, { use_case_fit: fit({ airliner: 4 }), reviewsPending: '2026-10-25' });
    const answers = airliner(400, { piecesNeeded: ['yoke'] });
    expect(picksOf(recommendLoadout([pending, reviewed], answers, 'EU'))).toEqual([['reviewed-yoke']]);
    expect(picksOf(recommendLoadout([{ ...pending, use_case_fit: fit({ airliner: 5 }) }, reviewed], answers, 'EU'))).toEqual([['pending-yoke']]);
  });
  it('marks products awaiting reviews as tentative', () => {
    const result = recommendLoadout([hardware('new-yoke', 'yoke', 200, { reviewsPending: '2026-10-25' })], airliner(400, { piecesNeeded: ['yoke'] }), 'EU');
    expect(result.warnings).toContain('new-yoke has no published reviews yet: treat it as a tentative pick.');
  });
});

describe('helicopter collective', () => {
  const lever = (kind: 'collective' | 'throttle_single') => [{ name: 'Lever', category: 'base' as const, controls: [{ type: 'lever' as const, kind, count: 1, analog: true }] }];
  const heli = (extra: Partial<WizardAnswers> = {}) => normalizeWizardAnswers({ useCase: 'heli', budgetMax: 2000, mountType: 'clamp', ...extra });
  const cyclic = () => hardware('cyclic', 'stick_fixed', 200);
  const pedals = () => hardware('pedals', 'pedals', 200);
  it('treats grips on a collective base as a collective, never as a cyclic', () => {
    const base = hardware('collective-base', 'base', 500, { mount: { accepts: ['rotor'] }, controlSections: lever('collective') });
    const head = hardware('collective-head', 'grip', 200, { mount: { provides: 'rotor' } });
    const result = recommendLoadout([base, head, cyclic(), pedals()], heli(), 'EU');
    expect(result.complete).toBe(true);
    expect(result.pieces.find((piece) => piece.roles.includes('collective'))).toMatchObject({ standIns: [] });
    expect(result.pieces.find((piece) => piece.roles.includes('collective'))?.items.map((item) => item.id)).toEqual(['collective-base', 'collective-head']);
    expect(recommendLoadout([base, head, pedals()], heli(), 'EU').complete).toBe(false);
  });
  it('lets a throttle or a left-hand stick stand in for the collective', () => {
    const throttle = hardware('throttle', 'throttle', 100, { controlSections: lever('throttle_single') });
    const viaThrottle = recommendLoadout([cyclic(), throttle, pedals()], heli(), 'EU');
    expect(viaThrottle.pieces.find((piece) => piece.items[0].id === 'throttle')).toMatchObject({ roles: ['collective'], standIns: ['collective'] });
    const left = hardware('left-stick', 'stick_fixed', 150, { handedness: ['left'] });
    const viaStick = recommendLoadout([cyclic(), left, pedals()], heli(), 'EU');
    expect(viaStick.pieces.find((piece) => piece.items[0].id === 'left-stick')).toMatchObject({ roles: ['collective'], standIns: ['collective'] });
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

describe('combat HOTAS scoring', () => {
  const fit = (modern_jet: number) => ({ ...ComponentSchema.parse({ brand: 'test', name: 'x', category: 'stick_fixed' }).use_case_fit, modern_jet });
  const jet = (budgetMax: number, piecesNeeded: WizardAnswers['piecesNeeded'] = ['stick', 'throttle', 'pedals']) => normalizeWizardAnswers({ useCase: 'modern_jet', budgetMax, piecesNeeded });
  const stick = () => hardware('stick', 'stick_fixed', 100, { use_case_fit: fit(5) });
  const throttle = () => hardware('throttle', 'throttle', 150, { use_case_fit: fit(5), axes: [{ name: 'Throttle Z' }, { name: 'Rudder rocker RZ' }] });
  it('lets stick twist stand in for jet pedals on a budget, and buys pedals once they fit', () => {
    const items = [stick(), throttle(), hardware('pedals', 'pedals', 200, { use_case_fit: fit(5) })];
    expect(recommendLoadout(items, jet(300), 'EU').pieces).toMatchObject([{ roles: ['stick', 'pedals'], standIns: ['pedals'] }, { roles: ['throttle'] }]);
    expect(picksOf(recommendLoadout(items, jet(500), 'EU'))).toEqual([['stick'], ['throttle'], ['pedals']]);
  });
  it('gives the twist yaw bonus to sticks only, not to a throttle Z axis or rudder rocker', () => {
    const answers = jet(500, ['stick', 'throttle']);
    const plain = hardware('plain', 'throttle', 150, { use_case_fit: fit(5), axes: [{ name: 'Throttle' }] });
    expect(scoreWizardItem(throttle(), answers, 'EU').score).toBe(scoreWizardItem(plain, answers, 'EU').score);
  });
  it('buys a bundle instead of the same parts separately when the bundle is cheaper', () => {
    const bundle = hardware('bundle', 'hotas_bundle', 230, { item_type: 'bundle', componentIds: ['stick', 'throttle'] });
    for (const answers of [jet(300), jet(300, ['stick', 'throttle'])]) {
      expect(picksOf(recommendLoadout([stick(), throttle(), bundle], answers, 'EU'))).toEqual([['bundle']]);
    }
  });
  it('warns about 2/5 hardware and, over budget, prefers a setup without it', () => {
    const weak = hardware('weak', 'stick_fixed', 40, { use_case_fit: fit(2) });
    const weakOnly = recommendLoadout([weak], jet(100, ['stick']), 'EU');
    expect(weakOnly.warnings.some((warning) => /rated 2\/5 for Modern jet/.test(warning))).toBe(true);
    const over = recommendLoadout([hardware('weak', 'stick_fixed', 140, { use_case_fit: fit(2) }), stick()], jet(50, ['stick']), 'EU');
    expect(picksOf(over)).toEqual([['stick']]);
    expect(over.overBudget).toBe(50);
  });
});

describe('Virpil Vector yoke parts', () => {
  // Real catalog records; status is forced to current because the parts are still pre-order.
  const real = (id: string) => {
    const data = ComponentSchema.parse(readContent(`src/content/components/${id}.yaml`));
    const prices = data.prices.filter((price) => price.region === 'EU');
    return hardware(id, data.category, 0, { status: 'current', mount: data.mount, placement: data.placement, prices, resolvedPrice: resolvePrice(prices), use_case_fit: data.use_case_fit, handedness: [] });
  };
  const base = real('virpil/vector-flight-yoke-base');
  const vega = real('virpil/constellation-vega-yoke-handle');
  const bjet = real('virpil/b-jet-yoke-handle');

  it.each(['ga', 'airliner'] as const)('pairs the Vector base with a VEGA or B-JET handle for a %s yoke pick', (useCase) => {
    const answers = normalizeWizardAnswers({ useCase, piecesNeeded: ['yoke'], budgetMax: 800, mountType: 'clamp' });
    const result = recommendLoadout([base, vega, bjet], answers, 'EU');
    expect(result.complete).toBe(true);
    expect(result.pieces).toHaveLength(1);
    const ids = result.pieces[0].items.map((item) => item.id);
    expect(ids[0]).toBe('virpil/vector-flight-yoke-base');
    expect(['virpil/constellation-vega-yoke-handle', 'virpil/b-jet-yoke-handle']).toContain(ids[1]);
    const amount = (item: CatalogItem) => item.resolvedPrice.price!.amount;
    expect(result.totalPrice).toBeCloseTo(amount(base) + amount(ids[1] === vega.id ? vega : bjet), 2);
    expect(result.pieces[0].explanations).toContain('+ Base and yoke handle share a direct mount standard');
  });
  it('never recommends a bare handle or bare base, even when only a handle fits the budget or it must stretch', () => {
    const answers = normalizeWizardAnswers({ useCase: 'ga', piecesNeeded: ['yoke'], budgetMax: 400, mountType: 'clamp' });
    const result = recommendLoadout([base, vega, bjet], answers, 'EU');
    // Over budget, the wizard stretches to the cheapest complete yoke rather than a lone part.
    expect(result.pieces).toHaveLength(1);
    expect(result.pieces[0].items.map((item) => item.id)).toEqual(['virpil/vector-flight-yoke-base', 'virpil/b-jet-yoke-handle']);
    expect(result.overBudget).toBeCloseTo(result.totalPrice - 400, 2);
    expect(recommendLoadout([vega, bjet], { ...answers, budgetMax: 5000 }, 'EU').items).toEqual([]);
    expect(recommendLoadout([base], { ...answers, budgetMax: 5000 }, 'EU').items).toEqual([]);
  });
});
