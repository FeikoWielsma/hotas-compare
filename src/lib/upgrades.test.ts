import { describe, expect, it } from 'vitest';
import { BundleSchema, ComponentSchema, type Component, type MountStandard } from './schema';
import { compatibleParts, resolveUpgradePaths } from './upgrades';

const review = (tag: 'recommended' | 'avoid') => [{ reviewer: 'mysh', url: 'https://x.test', summary: 's', tag, date: '2026-10-24' }];
const c = (data: Record<string, unknown>) => ComponentSchema.parse({ brand: 'test', mount: {}, ...data });
const components = new Map<string, Component>([
  ['t/base', c({ name: 'Base', category: 'base', mount: { accepts: ['grip-a'] } })],
  ['t/grip-good', c({ name: 'Zeta Grip', category: 'grip', mount: { provides: 'grip-a' }, external_reviews: review('recommended') })],
  ['t/grip-meh', c({ name: 'Alpha Grip', category: 'grip', mount: { provides: 'grip-a' } })],
  ['t/grip-bridged', c({ name: 'Bridged Grip', category: 'grip', mount: { provides: 'grip-b' }, external_reviews: review('avoid') })],
  ['t/grip-other', c({ name: 'Other Grip', category: 'grip', mount: { provides: 'grip-x' } })],
  ['t/grip-old', c({ name: 'Old Grip', category: 'grip', status: 'discontinued', mount: { provides: 'grip-a' } })],
]);
const standards = new Map<string, MountStandard>([['grip-b', { name: 'B', compatible_with: ['grip-a'] } as MountStandard]]);

describe('compatibleParts', () => {
  it('lists current grips that fit a base, directly or via a standard bridge, recommended first', () => {
    const result = compatibleParts(components.get('t/base')!, components, standards);
    expect(result?.kind).toBe('grips');
    expect(result?.items.map((i) => i.id)).toEqual(['t/grip-good', 't/grip-meh', 't/grip-bridged']);
  });
  it('lists bases for a grip and nothing for items without mount data', () => {
    expect(compatibleParts(components.get('t/grip-meh')!, components, standards)?.items.map((i) => i.id)).toEqual(['t/base']);
    expect(compatibleParts(c({ name: 'Pedals', category: 'pedals' }), components, standards)).toBeNull();
  });
});

describe('resolveUpgradePaths', () => {
  const bundles = new Map([['t/set', BundleSchema.parse({ brand: 'test', name: 'Set', category: 'hotas_bundle', components: ['t/base'] })]]);
  it('links components and bundles and keeps the note', () => {
    const paths = resolveUpgradePaths('t/x', [{ to: 't/grip-good', note: 'Better.' }, { to: 't/set', note: 'Whole set.', source: 'https://v.test' }], components, bundles);
    expect(paths).toEqual([
      { id: 't/grip-good', name: 'Zeta Grip', href: '/components/t/grip-good', reviewTag: 'recommended', note: 'Better.' },
      { id: 't/set', name: 'Set', href: '/bundles/t/set', reviewTag: null, note: 'Whole set.', source: 'https://v.test' },
    ]);
  });
  it('fails clearly on a missing target', () => {
    expect(() => resolveUpgradePaths('t/x', [{ to: 't/nope', note: '' }], components, bundles)).toThrow('missing item "t/nope"');
  });
});
