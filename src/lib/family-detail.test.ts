import { describe, expect, it, vi } from 'vitest';
import { products, families, contentFiles, readContent } from '../../scripts/content';
import { loadCatalog } from './catalog';
import { detailFamily, familyDiffRows } from './family-detail';

vi.mock('astro:content', () => ({ getCollection: (name: string) => {
  if (name === 'components' || name === 'bundles') return products().filter(p => p.collection === name);
  if (name === 'families') return families();
  return contentFiles(`src/content/${name.replaceAll('_', '-')}`).map(file => ({ id: file.split(/[\\/]/).pop()!.replace(/\.yaml$/, ''), data: readContent(file) }));
} }));

describe('detail family comparison', () => {
  it('compares STECS Mini through Max using differing controls, placement, desk dimensions and regional prices', async () => {
    const catalog = await loadCatalog();
    const mini = catalog.items.find(item => item.id === 'vkb/stecs-throttle-mini')!;
    const family = detailFamily(mini, catalog.families, catalog.items)!;
    expect(family.lineup.map(member => member.label)).toEqual(['Mini', 'Mini Plus', 'Standard', 'Max']);
    const physical = Object.fromEntries(catalog.components.map(entry => [entry.id, entry.data.physical]));
    const items = family.lineup.map(member => member.item);
    const rows = familyDiffRows(items, 'EU', {}, physical);
    expect(rows.every(row => new Set(row.values).size > 1)).toBe(true);
    expect(rows.find(row => row.label === 'Placement')?.values).toEqual(['Mount required', 'Desk or mount', 'Desk or mount', 'Desk or mount']);
    expect(rows.find(row => row.label === 'Push buttons')?.values[0]).not.toBe(rows.find(row => row.label === 'Push buttons')?.values[3]);
    expect(rows.find(row => row.label === 'Dimensions (mm)')?.values[1]).toBe('Not documented');
    expect(rows.find(row => row.label === 'Price (EU)')?.values[0]).toContain('\u20ac243.00');
    expect(familyDiffRows(items, 'US').find(row => row.label === 'Price (US)')?.values[0]).toContain('$209.00');
    expect(familyDiffRows([mini, mini], 'EU')).toEqual([]);
  });

  it('omits superseded siblings but keeps the current archived product', async () => {
    const catalog = await loadCatalog();
    const mini = catalog.items.find(item => item.id === 'vkb/stecs-throttle-mini')!;
    const max = catalog.items.find(item => item.id === 'vkb/stecs-throttle-max')!;
    const old = { ...mini, status: 'discontinued' as const, successor: max.id };
    const items = catalog.items.map(item => item.id === old.id ? old : item);
    expect(detailFamily(max, catalog.families, items)!.lineup.some(member => member.id === old.id)).toBe(false);
    expect(detailFamily(old, catalog.families, items)!.current.item).toBe(old);
    expect(detailFamily({ ...mini, id: 'not-in-a-family' }, catalog.families, items)).toBeNull();
  });

  it('distinguishes unknown axes and controls from documented zero and resolves mount names', async () => {
    const { items } = await loadCatalog();
    const unknown = { ...items[0], totalAxes: 0, axisCountKnown: false, totalLogicalButtons: 0, controlSections: [], mount: null, placement: null, prices: [] };
    const known = { ...unknown, axisCountKnown: true, mount: { provides: 'test' }, placement: 'mount_only' as const, controlSections: [{ name: 'Empty', category: 'module' as const, controls: [], controls_evidence: { coverage: 'complete' as const, source: 'https://example.com', checked: '2026-10-25' } }] };
    const rows = familyDiffRows([unknown, known], 'EU', { test: 'Test mount' });
    expect(rows.find(row => row.label === 'Axes')?.values).toEqual(['Not documented', '0']);
    expect(rows.find(row => row.label === 'Push buttons')?.values).toEqual(['Not documented', '0']);
    expect(rows.find(row => row.label === 'Placement')?.values).toEqual(['Not documented', 'Mount required']);
    expect(rows.find(row => row.label === 'Mount provides')?.values).toEqual(['Not documented', 'Test mount']);
  });
});
