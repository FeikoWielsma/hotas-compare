import { describe, expect, it } from 'vitest';
import type { CatalogItem } from './catalog';
import { deriveControlsSummary, resolvePrice } from './derive';
import { resolveCatalogRegion } from './catalog';
import { filterCatalog, groupCatalog, groupHandVariants, handVariant, matchScore, rankReasons, type CatalogGroup } from './catalog-filter';

function item(overrides: Partial<CatalogItem> = {}): CatalogItem {
  return {
    id: 'test/stick', slug: 'test/stick', name: 'Test Stick', brand: 'test', brandName: 'Test Flight',
    category: 'stick_fixed', item_type: 'component', status: 'current', verification: 'draft',
    prices: [], region: 'EU', resolvedPrice: resolvePrice([], 'EU'),
    totalAxes: 0, totalLogicalButtons: 0, hasMinistick: false, hasBrakeAxis: false,
    controlsSummary: deriveControlsSummary([]), sensor: null, usesPotentiometers: false, gimbal: null,
    use_case_fit: { modern_jet: 1, space_hosas: 1, space_hotas: 1, heli: 1, ga: 1, airliner: 1, ww2: 1 },
    verdict: null, scores: null, images: [], componentIds: [], formerBrandNames: [], handedness: [],
    mechanics: { forceAdjustable: 'Unknown', cams: 'Unknown', damping: 'Unknown' }, leverCount: 0,
    ...overrides,
  };
}
const price = (amount: number) => resolvePrice([{ region: 'EU', currency: 'EUR', amount, store: 'Test', verified: '2026-10-01', incl_vat: true, kind: 'official', source: 'manual' }], 'EU');

describe('catalog filters', () => {
  it('lists yoke bases under the Yoke filter as well as Base, and finds yoke parts by name', () => {
    const handle = item({ id: 'handle', category: 'yoke', yokePart: 'handle' });
    const yokeBase = item({ id: 'yoke-base', category: 'base', yokePart: 'base' });
    const stickBase = item({ id: 'stick-base', category: 'base' });
    const ids = (filters: Parameters<typeof filterCatalog>[1]) => filterCatalog([handle, yokeBase, stickBase], filters).map(({ id }) => id);
    expect(ids({ categories: ['yoke'] })).toEqual(['handle', 'yoke-base']);
    expect(ids({ categories: ['base'] })).toEqual(['yoke-base', 'stick-base']);
    expect(ids({ search: 'yoke base' })).toEqual(['yoke-base']);
  });
  it('hides curated and strictly bundle-only parts, with independent opt-ins and normal filters', () => {
    const soft = item({ id: 'soft', soldMainlyInBundle: true });
    const strict = item({ id: 'strict', soldStandalone: false });
    const normal = item({ id: 'normal' });
    const old = item({ id: 'old', soldMainlyInBundle: true, status: 'discontinued', successor: 'normal' });
    expect(filterCatalog([soft, strict, normal, old])).toEqual([normal]);
    expect(filterCatalog([soft, strict], { showIndividualParts: true })).toEqual([soft, strict]);
    expect(filterCatalog([old], { showIndividualParts: true })).toEqual([]);
    expect(filterCatalog([old], { showDiscontinued: true })).toEqual([]);
    expect(filterCatalog([old], { showIndividualParts: true, showDiscontinued: true })).toEqual([old]);
    expect(filterCatalog([soft], { showIndividualParts: true, search: 'absent' })).toEqual([]);
    expect(filterCatalog([normal], { categories: ['base'] })).toEqual([]);
  });
  it('hides only discontinued products with successors and allows opting in alongside other filters', () => {
    for (const item_type of ['component', 'bundle'] as const) {
      const old = item({ id: 'old', status: 'discontinued', successor: 'new', item_type });
      const unsupported = item({ id: 'no-successor', status: 'discontinued' });
      const current = item({ id: 'new' });
      expect(filterCatalog([old, unsupported, current])).toEqual([unsupported, current]);
      expect(filterCatalog([old], { showDiscontinued: true })).toEqual([old]);
      expect(filterCatalog([old], { showDiscontinued: true, search: 'nonexistent' })).toEqual([]);
    }
  });
  it('requires confirmed platform support and excludes unknown or unsupported devices', () => {
    const supported = item({ platform_compatibility: { pc: 'supported', xbox: 'supported', ps5: 'unknown', sources: [] } });
    const unsupported = item({ id: 'unsupported', platform_compatibility: { pc: 'supported', xbox: 'unsupported', ps5: 'unknown', sources: [] } });
    expect(filterCatalog([supported, unsupported, item({ id: 'unknown' })], { platform: 'xbox' })).toEqual([supported]);
    expect(filterCatalog([supported, unsupported], { platform: 'ps5' })).toEqual([]);
  });
  it('combines search, category, brand, numeric, feature, handedness, type, price and fit requirements', () => {
    const match = item({ totalAxes: 4, totalLogicalButtons: 24, sensor: 'hall', hasMinistick: true, hasBrakeAxis: true, handedness: ['left'], resolvedPrice: price(150), use_case_fit: { modern_jet: 5, space_hosas: 4, space_hotas: 4, heli: 3, ga: 2, airliner: 2, ww2: 3 } });
    const filters = { search: 'flight hall', categories: ['stick_fixed'], brands: ['test'], minimum: 100, maximum: 200, minimumAxes: 4, minimumInputs: 20, sensors: true, ministick: true, brake: true, handedness: 'left', itemType: 'component', priceAvailability: 'available', fit: 'modern_jet', minimumFit: 4 };
    expect(filterCatalog([match, item(), { ...match, id: 'wrong', handedness: ['right'] }], filters)).toEqual([match]);
    expect(filterCatalog([match], { ...filters, minimumInputs: 25 })).toEqual([]);
    expect(filterCatalog([match], { ...filters, itemType: 'bundle' })).toEqual([]);
    expect(filterCatalog([match], { ...filters, maximum: 149 })).toEqual([]);
  });

  it('excludes undocumented numeric counts for positive minimums without excluding them by default', () => {
    const unknown = item();
    const axesOnly = item({ id: 'axes', totalAxes: 2 });
    const inputsOnly = item({ id: 'inputs', totalLogicalButtons: 12 });
    expect(filterCatalog([unknown])).toEqual([unknown]);
    expect(filterCatalog([unknown], { minimumAxes: 0, minimumInputs: 0 })).toEqual([unknown]);
    expect(filterCatalog([unknown, axesOnly, inputsOnly], { minimumAxes: 1 })).toEqual([axesOnly]);
    expect(filterCatalog([unknown, axesOnly, inputsOnly], { minimumInputs: 1 })).toEqual([inputsOnly]);
    expect(filterCatalog([unknown, axesOnly, inputsOnly], { minimumAxes: 1, minimumInputs: 1 })).toEqual([]);
  });

  it('uses the resolved region for price availability and keeps unavailable prices last in either price sort', () => {
    const unknown = item({ name: 'A unknown' });
    const low = item({ id: 'low', resolvedPrice: price(100) });
    const high = item({ id: 'high', resolvedPrice: price(200) });
    const items = [unknown, high, low];
    expect(filterCatalog(items, { priceAvailability: 'unavailable' })).toEqual([unknown]);
    expect(filterCatalog(items, { priceAvailability: 'available', sort: 'price-low' })).toEqual([low, high]);
    expect(filterCatalog(items, { sort: 'price-high' })).toEqual([high, low, unknown]);
    expect(filterCatalog(items, { sort: 'price-low' })).toEqual([low, high, unknown]);
    expect(items).toEqual([unknown, high, low]);
    expect(filterCatalog([unknown], { maximum: 1000 })).toEqual([]);
    const euItem = item({ prices: [{ region: 'EU', currency: 'EUR', amount: 100, store: 'Test', verified: '2026-10-01', incl_vat: true, kind: 'official', source: 'manual' }], resolvedPrice: price(100) });
    expect(filterCatalog([resolveCatalogRegion(euItem, 'US')], { priceAvailability: 'available' })).toEqual([]);
    expect(filterCatalog([euItem], { priceAvailability: 'available' })).toEqual([euItem]);
  });

  it('matches former brand names, preserves exact handedness and supports combined GA / airliner fit', () => {
    const ambi = item({ formerBrandNames: ['Old Brand'], handedness: ['ambi'], use_case_fit: { modern_jet: 1, space_hosas: 1, space_hotas: 1, heli: 1, ga: 2, airliner: 5, ww2: 1 } });
    expect(filterCatalog([ambi], { search: 'old brand', handedness: 'ambi', fit: 'ga_airliner', minimumFit: 4 })).toEqual([ambi]);
    expect(filterCatalog([ambi], { handedness: 'right' })).toEqual([]);
  });

  it('ranks Recommended by fit first: a recommendation breaks ties, avoid sinks, verdict scores are paused', () => {
    const fits = (n: number) => ({ modern_jet: n, space_hosas: n, space_hotas: n, heli: n, ga: n, airliner: n, ww2: n });
    const strong = item({ id: 'strong', name: 'Strong', use_case_fit: fits(4.5) });
    const recommended = item({ id: 'rec', name: 'Rec', reviewTag: 'recommended', use_case_fit: fits(3.5) });
    const unreviewed = item({ id: 'none', name: 'None', use_case_fit: fits(3.5) });
    const avoided = item({ id: 'avoid', name: 'Avoid', reviewTag: 'avoid', use_case_fit: fits(5) });
    const scored = item({ id: 'scored', name: 'Scored', use_case_fit: fits(3), scores: { build: 5, feel: 5, value: 5, software: 5, qc_support: 5 } });
    const order = filterCatalog([avoided, scored, unreviewed, recommended, strong], { sort: 'featured' }).map((i) => i.id);
    expect(order).toEqual(['strong', 'rec', 'none', 'scored', 'avoid']);
  });

  it('ranks by average fit across the chosen flying styles, or by one style column', () => {
    const fit = (modern_jet: number, ww2: number) => ({ modern_jet, space_hosas: 1, space_hotas: 1, heli: 1, ga: 1, airliner: 1, ww2 });
    const jet = item({ id: 'jet', name: 'Jet', use_case_fit: fit(5, 2) });
    const both = item({ id: 'both', name: 'Both', use_case_fit: fit(4, 4) });
    const warbird = item({ id: 'warbird', name: 'Warbird', use_case_fit: fit(2, 5) });
    const reviewedTwin = item({ id: 'twin', name: 'Twin', use_case_fit: fit(4, 4), reviewTag: 'recommended' });
    const ids = (filters: Parameters<typeof filterCatalog>[1]) => filterCatalog([jet, both, warbird, reviewedTwin], filters).map(({ id }) => id);
    expect(ids({ sort: 'match', fits: ['modern_jet', 'ww2'] })).toEqual(['twin', 'both', 'jet', 'warbird']);
    expect(ids({ sort: 'match', fits: ['ww2'] })).toEqual(['warbird', 'twin', 'both', 'jet']);
    expect(ids({ sort: 'fit:modern_jet', fits: ['modern_jet', 'ww2'] })).toEqual(['jet', 'twin', 'both', 'warbird']);
    expect(matchScore(both, ['modern_jet', 'ww2'])).toBe(4);
    expect(matchScore(both, [])).toBeNull();
  });

  it('filters by gimbal family and leaves undocumented gimbals out of a gimbal filter', () => {
    const pincer = item({ id: 'p', gimbalType: 'pincer' });
    const cam = item({ id: 'c', gimbalType: 'cam_and_spring' });
    const unknown = item({ id: 'u' });
    expect(filterCatalog([pincer, cam, unknown], { gimbalTypes: ['pincer', 'cam_and_spring'] }).map((i) => i.id).sort()).toEqual(['c', 'p']);
    expect(filterCatalog([pincer, cam, unknown], {})).toHaveLength(3);
  });

  it('explains the Recommended rank in plain words', () => {
    const use_case_fit = { modern_jet: 5, space_hosas: 1, space_hotas: 4, heli: 1, ga: 1, airliner: 1, ww2: 1 };
    const reasons = rankReasons(item({ reviewTag: 'recommended', latestReview: { reviewer: 'mysh', reviewerName: 'Mysh', tag: 'recommended', url: 'https://x.test', summary: '', date: '2026-10-24' }, use_case_fit, verification: 'verified' }));
    expect(reasons).toEqual(['Best fit 4.5/5', 'Mysh: recommended', 'Main flight control', 'Specs verified', 'Currently sold', 'First 12 cards spread across flying styles, categories, brands and gimbal types; family variants share one place']);
    expect(rankReasons(item({ reviewTag: 'avoid', latestReview: { reviewer: 'mysh', reviewerName: 'Mysh', tag: 'avoid', url: 'https://x.test', summary: '', date: '2026-10-24' } }))).toContain('Mysh: avoid (ranked lower)');
  });

  it('recognises left/right naming styles and keeps non-hand variants apart', () => {
    expect(handVariant('Constellation Alpha Prime (Left)')).toEqual({ key: 'constellation alpha prime', hand: 'left' });
    expect(handVariant('STECS Space Throttle System - Max (Right-Hand)')).toEqual({ key: 'stecs space throttle system - max', hand: 'right' });
    expect(handVariant("Gunfighter Mk.IV 'Space Combat Edition' - Tabletop - Left Hand")?.key).toBe("gunfighter mk.iv 'space combat edition' - tabletop");
    expect(handVariant('STECS Space Throttle Add-On Grip (STG) Right-Hand')?.hand).toBe('right');
    expect(handVariant('Ursa Minor Fighter Joystick Left')).toEqual({ key: 'ursa minor fighter joystick', hand: 'left' });
    expect(handVariant('VPC CDT-Aeromax [LZ] Flightstick')).toEqual({ key: 'vpc cdt-aeromax [z] flightstick', hand: 'left' });
    expect(handVariant('VPC CDT-Aeromax [R] Flightstick')?.key).not.toBe(handVariant('VPC CDT-Aeromax [RZ] Flightstick')?.key);
    expect(handVariant('Gladiator NXT EVO Base')).toBeNull();
  });

  it('groups mirrored variants of the same brand and category into one entry, right hand first', () => {
    const l = item({ id: 'l', name: 'Grip (Left)', category: 'grip' });
    const r = item({ id: 'r', name: 'Grip (Right)', category: 'grip' });
    const other = item({ id: 'o', name: 'Other (Left)', category: 'grip' });
    const otherBrand = item({ id: 'x', name: 'Grip (Right)', category: 'grip', brand: 'else' });
    const groups = groupHandVariants([l, other, r, otherBrand]);
    expect(groups.map((g) => g.map((i) => i.id))).toEqual([['r', 'l'], ['o'], ['x']]);
  });
});

describe('catalog family grouping', () => {
  it('diversifies a representative first page by cards while keeping hidden parts and avoid out', () => {
    const scores = { build: 5, feel: 5, value: 5, software: 5, qc_support: 5 };
    const best = (style: keyof CatalogItem['use_case_fit']) => ({ modern_jet: 1, space_hosas: 1, space_hotas: 1, heli: 1, ga: 1, airliner: 1, ww2: 1, [style]: 1.2 });
    const fixture = [
      ...Array.from({ length: 10 }, (_, i) => item({ id: `family-${i}`, name: `Family ${i}`, category: 'throttle', brand: 'alpha', reviewTag: 'recommended', family: { id: 'alpha/throttle', name: 'Throttle', axis: 'Size', label: `${i}`, tier: i } })),
      ...Array.from({ length: 8 }, (_, i) => item({ id: `stick-${i}`, name: `Stick ${i}`, brand: 'alpha', reviewTag: 'recommended' })),
      item({ id: 'hotas', name: 'HOTAS', category: 'hotas_bundle', item_type: 'bundle', brand: 'bravo', reviewTag: 'recommended' }),
      item({ id: 'yoke', name: 'Yoke', category: 'yoke', brand: 'charlie', reviewTag: 'recommended', use_case_fit: best('airliner') }),
      item({ id: 'pedals', name: 'Pedals', category: 'pedals', brand: 'delta', reviewTag: 'recommended', use_case_fit: best('heli') }),
      item({ id: 'quadrant', name: 'Quadrant', category: 'quadrant', brand: 'echo', reviewTag: 'recommended', use_case_fit: best('ga') }),
      item({ id: 'module', name: 'Module', category: 'module' }),
      item({ id: 'avoid', name: 'Avoid', category: 'system', item_type: 'bundle', brand: 'unique', reviewTag: 'avoid', scores }),
      item({ id: 'old', status: 'discontinued', successor: 'hotas', scores }),
      item({ id: 'combo-part', soldStandalone: false, scores }),
      item({ id: 'curated-part', soldMainlyInBundle: true, scores }),
    ];
    const cards = (items: CatalogItem[]) => groupCatalog(filterCatalog(items, { sort: 'featured' }), 'featured');
    const result = cards(fixture);
    const firstPage = result.slice(0, 12);
    expect(new Set(firstPage.map((g) => g.lead.category)).size).toBeGreaterThanOrEqual(5);
    expect(new Set(firstPage.slice(0, 6).map((g) => g.lead.brand)).size).toBeGreaterThanOrEqual(4);
    expect(firstPage[0].lead.id).toBe('hotas');
    expect(firstPage.some((g) => g.lead.category === 'module')).toBe(false);
    expect(result.at(-1)?.lead.id).toBe('avoid');
    const ids = result.flatMap((g) => g.options.flatMap((o) => o.variants.map((v) => v.id)));
    expect(ids).not.toContain('old');
    expect(ids).not.toContain('combo-part');
    expect(ids).not.toContain('curated-part');
    // Ten family variants must consume exactly the same diversity budget as one.
    expect(cards(fixture.filter((i) => !i.family || i.id === 'family-0')).map((g) => g.key)).toEqual(result.map((g) => g.key));
    expect(cards([...fixture].reverse()).map((g) => g.key)).toEqual(result.map((g) => g.key));
    expect(groupCatalog(filterCatalog(fixture, { sort: 'name' }), 'name')[0].lead.name).toBe('Avoid');
  });

  it('prefers complete setups at equal fit but lets a clearly better fit lift separate parts', () => {
    const fits = (n: number) => ({ modern_jet: n, space_hosas: n, space_hotas: n, heli: n, ga: n, airliner: n, ww2: n });
    const bundle = item({ id: 'bundle', category: 'hotas_bundle', item_type: 'bundle', use_case_fit: fits(4) });
    const stick = item({ id: 'stick', use_case_fit: fits(4) });
    const part = item({ id: 'part', category: 'grip', use_case_fit: fits(4) });
    const betterPart = item({ id: 'better-part', category: 'base', use_case_fit: fits(5) });
    expect(filterCatalog([part, stick, bundle, betterPart], { sort: 'featured' }).map((i) => i.id)).toEqual(['better-part', 'bundle', 'stick', 'part']);
    expect(rankReasons(bundle)).toContain('Complete setup bundle');
    expect(rankReasons(part)).toContain('Separate part or module (lower setup priority)');
  });

  it('spreads the first cards across flying styles and gimbal types instead of one strong niche', () => {
    const fit = (style: keyof CatalogItem['use_case_fit'], n: number) => ({ modern_jet: 2, space_hosas: 2, space_hotas: 2, heli: 2, ga: 2, airliner: 2, ww2: 2, [style]: n });
    const ffb = Array.from({ length: 5 }, (_, i) => item({ id: `ffb-${i}`, name: `FFB ${i}`, brand: `ffb-${i}`, gimbalType: 'force_feedback', use_case_fit: fit('modern_jet', 5) }));
    const yoke = item({ id: 'yoke', name: 'Yoke', category: 'yoke', brand: 'y', use_case_fit: fit('airliner', 4.5) });
    const space = item({ id: 'space', name: 'Space', brand: 's', gimbalType: 'cam_and_spring', use_case_fit: fit('space_hotas', 4.5) });
    const first = groupCatalog(filterCatalog([...ffb, yoke, space], { sort: 'featured' }), 'featured').slice(0, 4).map((g) => g.lead.id);
    expect(first[0]).toBe('ffb-0');
    expect(first).toContain('yoke');
    expect(first).toContain('space');
  });

  const family = (label: string, tier: number) => ({ id: 'test/stecs', name: 'STECS', axis: 'Size', label, tier });
  const mini = item({ id: 'mini-l', name: 'STECS Mini', handedness: ['left'], family: family('Mini', 0), resolvedPrice: price(300) });
  const miniR = item({ id: 'mini-r', name: 'STECS Mini R', handedness: ['right'], family: family('Mini', 0), resolvedPrice: price(310) });
  const max = item({ id: 'max', name: 'STECS Max', handedness: ['left'], family: family('Max', 1), hasMinistick: true, resolvedPrice: price(500) });
  const stick = item({ id: 'stick', name: 'Stick', resolvedPrice: price(400) });
  const twinL = item({ id: 'grip-l', name: 'Grip (Left)', category: 'grip', resolvedPrice: price(200) });
  const twinR = item({ id: 'grip-r', name: 'Grip (Right)', category: 'grip', resolvedPrice: price(200) });
  const all = [max, stick, mini, twinL, miniR, twinR];
  const shape = (groups: CatalogGroup[]) => groups.map((g) => [g.key, g.lead.id, g.options.map((o) => [o.label, o.variants.map((v) => v.id)])]);

  it('collapses a family into one entry with options in family order and hand twins right first', () => {
    expect(shape(groupCatalog(filterCatalog(all, { sort: 'name' })))).toEqual([
      ['item|grip-r', 'grip-r', [['', ['grip-r', 'grip-l']]]],
      ['family|test/stecs', 'max', [['Mini', ['mini-r', 'mini-l']], ['Max', ['max']]]],
      ['item|stick', 'stick', [['', ['stick']]]],
    ]);
  });

  it('places a family at its best-sorted member and leads with that member', () => {
    const groups = groupCatalog(filterCatalog(all, { sort: 'price-low' }));
    expect(groups.map((g) => g.lead.id)).toEqual(['grip-r', 'mini-l', 'stick']);
    expect(groupCatalog(filterCatalog(all, { sort: 'price-high' }))[0].lead.id).toBe('max');
  });

  it('shows a family when any member matches and lists only matching members', () => {
    expect(shape(groupCatalog(filterCatalog(all, { ministick: true })))).toEqual([['family|test/stecs', 'max', [['Max', ['max']]]]]);
    expect(shape(groupCatalog(filterCatalog(all, { handedness: 'right', maximum: 350 })))).toEqual([['family|test/stecs', 'mini-r', [['Mini', ['mini-r']]]]]);
    expect(groupCatalog(filterCatalog(all, { search: 'nothing' }))).toEqual([]);
  });

  it('keeps a family key stable as filters change the lead', () => {
    const keys = [{}, { sort: 'price-high' }, { handedness: 'right' }].map((filters) => groupCatalog(filterCatalog(all, filters)).find((g) => g.family)?.key);
    expect(keys).toEqual(['family|test/stecs', 'family|test/stecs', 'family|test/stecs']);
  });

  it('does not pair a family member with a same-named twin outside the family', () => {
    const loose = item({ id: 'loose', name: 'STECS Mini Left', handedness: ['left'] });
    const looseR = item({ id: 'loose-r', name: 'STECS Mini Right', handedness: ['right'], family: family('Mini', 0) });
    expect(shape(groupCatalog([loose, looseR]))).toEqual([
      ['item|loose', 'loose', [['', ['loose']]]],
      ['family|test/stecs', 'loose-r', [['Mini', ['loose-r']]]],
    ]);
  });
});
