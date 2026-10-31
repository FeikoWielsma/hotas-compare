import { describe, expect, it } from 'vitest';
import type { CatalogItem } from './catalog';
import { deriveControlsSummary, resolvePrice } from './derive';
import { bestFits, cardFacts, tableColumns } from './catalog-columns';
import { catalogCategories } from './catalog-ui';

function item(overrides: Partial<CatalogItem> = {}): CatalogItem {
  return {
    id: 'test/stick', slug: 'test/stick', name: 'Test Stick', brand: 'test', brandName: 'Test Flight',
    category: 'stick_fixed', item_type: 'component', status: 'current', verification: 'draft',
    prices: [], region: 'EU', resolvedPrice: resolvePrice([], 'EU'),
    totalAxes: 0, totalLogicalButtons: 0, hasMinistick: false, hasBrakeAxis: false,
    controlsSummary: deriveControlsSummary([]), sensor: null, usesPotentiometers: false, gimbal: null,
    use_case_fit: { modern_jet: 1, space_hosas: 1, space_hotas: 1, heli: 1, ga: 1, airliner: 1, ww2: 1 },
    images: [], componentIds: [], formerBrandNames: [], handedness: [],
    mechanics: { forceAdjustable: 'Unknown', cams: 'Unknown', damping: 'Unknown' }, leverCount: 0,
    ...overrides,
  };
}

describe('catalog columns', () => {
  it('summarises each kind of hardware with its own specs and leaves unknowns out', () => {
    expect(cardFacts(item({ totalAxes: 3, totalLogicalButtons: 24, sensor: 'hall', handedness: ['left'] }))).toBe('3 axes · 24 inputs · Contactless · Left hand');
    expect(cardFacts(item({ handedness: ['right'], needsPedals: true }))).toBe('No twist');
    expect(cardFacts(item({ category: 'pedals', pedalBrakes: 'toe_brakes', damper: 'built_in', throwDeg: 76, usesPotentiometers: true }))).toBe('Toe brakes · Damper · 76° throw · Potentiometer');
    expect(cardFacts(item({ category: 'pedals', pedalBrakes: 'unknown', damper: 'none' }))).toBe('');
    expect(cardFacts(item({ category: 'throttle', leverCount: 1, sensor: 'potentiometer' }))).toBe('1 lever · Potentiometer');
  });

  it('picks the strongest flying styles, breaking ties in catalog order', () => {
    expect(bestFits(item({ use_case_fit: { modern_jet: 4, space_hosas: 5, space_hotas: 5, heli: 2, ga: 1, airliner: 1, ww2: 4 } }))).toEqual(['space_hotas', 'space_hosas']);
  });

  it('defines table columns for every catalog category tab', () => {
    expect(Object.keys(tableColumns).sort()).toEqual(Object.keys(catalogCategories).sort());
  });
});
