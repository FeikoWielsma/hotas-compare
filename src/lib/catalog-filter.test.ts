import { describe, expect, it } from 'vitest';
import type { CatalogItem } from './catalog';
import { deriveControlsSummary, resolvePrice } from './derive';
import { resolveCatalogRegion } from './catalog';
import { filterCatalog, groupHandVariants, handVariant, rankReasons } from './catalog-filter';

function item(overrides: Partial<CatalogItem> = {}): CatalogItem {
  return {
    id: 'test/stick', slug: 'test/stick', name: 'Test Stick', brand: 'test', brandName: 'Test Flight',
    category: 'stick_fixed', item_type: 'component', status: 'current', verification: 'draft',
    prices: [], region: 'EU', resolvedPrice: resolvePrice([], 'EU'),
    totalAxes: 0, totalLogicalButtons: 0, hasMinistick: false, hasBrakeAxis: false,
    controlsSummary: deriveControlsSummary([]), sensor: null, gimbal: null,
    use_case_fit: { modern_jet: 1, space_hosas: 1, space_hotas: 1, heli: 1, ga: 1, airliner: 1, ww2: 1 },
    verdict: null, scores: null, images: [], componentIds: [], formerBrandNames: [], handedness: [],
    mechanics: { forceAdjustable: 'Unknown', cams: 'Unknown', damping: 'Unknown' }, leverCount: 0,
    ...overrides,
  };
}
const price = (amount: number) => resolvePrice([{ region: 'EU', currency: 'EUR', amount, store: 'Test', verified: '2026-10-01', incl_vat: true, source: 'manual' }], 'EU');

describe('catalog filters', () => {
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
    const euItem = item({ prices: [{ region: 'EU', currency: 'EUR', amount: 100, store: 'Test', verified: '2026-10-01', incl_vat: true, source: 'manual' }], resolvedPrice: price(100) });
    expect(filterCatalog([resolveCatalogRegion(euItem, 'US')], { priceAvailability: 'available' })).toEqual([]);
    expect(filterCatalog([euItem], { priceAvailability: 'available' })).toEqual([euItem]);
  });

  it('matches former brand names, preserves exact handedness and supports combined GA / airliner fit', () => {
    const ambi = item({ formerBrandNames: ['Old Brand'], handedness: ['ambi'], use_case_fit: { modern_jet: 1, space_hosas: 1, space_hotas: 1, heli: 1, ga: 2, airliner: 5, ww2: 1 } });
    expect(filterCatalog([ambi], { search: 'old brand', handedness: 'ambi', fit: 'ga_airliner', minimumFit: 4 })).toEqual([ambi]);
    expect(filterCatalog([ambi], { handedness: 'right' })).toEqual([]);
  });

  it('ranks Recommended by review consensus: recommended first, avoid below unreviewed, own scores still count', () => {
    const scores = (n: number) => ({ build: n, feel: n, value: n, software: n, qc_support: n });
    const recommended = item({ id: 'rec', name: 'Rec', reviewTag: 'recommended' });
    const unreviewed = item({ id: 'none', name: 'None' });
    const avoided = item({ id: 'avoid', name: 'Avoid', reviewTag: 'avoid' });
    const ownedTop = item({ id: 'owned', name: 'Owned', scores: scores(5) });
    const both = item({ id: 'both', name: 'Both', reviewTag: 'recommended', scores: scores(5) });
    const order = filterCatalog([avoided, unreviewed, recommended, ownedTop, both], { sort: 'featured' }).map((i) => i.id);
    expect(order).toEqual(['both', 'owned', 'rec', 'none', 'avoid']);
  });

  it('filters by gimbal family and leaves undocumented gimbals out of a gimbal filter', () => {
    const pincer = item({ id: 'p', gimbalType: 'pincer' });
    const cam = item({ id: 'c', gimbalType: 'cam_and_spring' });
    const unknown = item({ id: 'u' });
    expect(filterCatalog([pincer, cam, unknown], { gimbalTypes: ['pincer', 'cam_and_spring'] }).map((i) => i.id).sort()).toEqual(['c', 'p']);
    expect(filterCatalog([pincer, cam, unknown], {})).toHaveLength(3);
  });

  it('explains the Recommended rank in plain words', () => {
    const scores = { build: 4, feel: 5, value: 4, software: 4, qc_support: 5 };
    const reasons = rankReasons(item({ reviewTag: 'recommended', latestReview: { reviewer: 'mysh', reviewerName: 'Mysh', tag: 'recommended', url: 'https://x.test', summary: '', date: '2026-10-24' }, scores, verification: 'verified' }));
    expect(reasons).toEqual(['Mysh: recommended', 'Our verdict 4.4/5', 'Specs verified', 'Currently sold']);
    expect(rankReasons(item({ reviewTag: 'avoid', latestReview: { reviewer: 'mysh', reviewerName: 'Mysh', tag: 'avoid', url: 'https://x.test', summary: '', date: '2026-10-24' } }))[0]).toBe('Mysh: avoid (ranked lower)');
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
