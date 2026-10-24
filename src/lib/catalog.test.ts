import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentSchema, BundleSchema, BrandSchema } from './schema';
import { getCatalogItems, loadCatalog, resolveCatalogRegion } from './catalog';

const collections = vi.hoisted(() => ({ values: {} as Record<string, unknown[]> }));
vi.mock('astro:content', () => ({ getCollection: (name: string) => collections.values[name] }));

beforeEach(() => {
  collections.values = {
    brands: [{ id: 'test', data: BrandSchema.parse({ name: 'Test Flight' }) }],
    mount_standards: [],
    reviewers: [],
    components: [
      { id: 'test/base', data: ComponentSchema.parse({ brand: 'test', name: 'Base', category: 'base', hardware: { axes: [{ name: 'x' }, { name: 'y' }], gimbal: 'cam', sensor: 'hall' } }) },
      { id: 'test/grip', data: ComponentSchema.parse({ brand: 'test', name: 'Grip', category: 'grip', controls: [{ type: 'analog_ministick' }, { type: 'lever', kind: 'brake', analog: true }] }) },
    ],
    bundles: [{ id: 'test/combo', data: BundleSchema.parse({ brand: 'test', name: 'Combo', category: 'stick_combo', components: ['test/base', 'test/grip'], prices: [{ region: 'UK', currency: 'GBP', amount: 120, store: 'Test', verified: '2026-10-01' }] }) }],
  };
});

describe('catalog serialization', () => {
  it('distinguishes a documented zero-axis accessory from an unknown axis inventory', async () => {
    collections.values.components = [
      { id: 'test/passive', data: ComponentSchema.parse({ brand: 'test', name: 'Passive accessory', category: 'module', hardware: { axis_count: 0 } }) },
      { id: 'test/unknown', data: ComponentSchema.parse({ brand: 'test', name: 'Unresolved accessory', category: 'module' }) },
    ];
    collections.values.bundles = [];
    const items = await getCatalogItems();
    expect(items.find(i => i.id === 'test/passive')).toMatchObject({ totalAxes: 0, axisCountKnown: true });
    expect(items.find(i => i.id === 'test/unknown')).toMatchObject({ totalAxes: 0, axisCountKnown: false });
  });
  it('preserves sourced platform support without assuming bundles inherit member compatibility', async () => {
    const entry = collections.values.components[0] as { data: ReturnType<typeof ComponentSchema.parse> };
    entry.data.platform_compatibility = { pc: 'supported', xbox: 'unknown', ps5: 'unsupported', sources: ['https://example.com/specifications'], notes: 'Requires a grip.' };
    const items = await getCatalogItems();
    expect(items.find(i => i.id === 'test/base')?.platform_compatibility).toEqual(entry.data.platform_compatibility);
    expect(items.find(i => i.id === 'test/combo')?.platform_compatibility).toBeUndefined();
  });
  it('combines bundle controls and hardware, preserving the SKU price and unknown verdict', async () => {
    const { items, brands, mount_standards } = await loadCatalog('UK', new Date('2026-10-19'));
    expect(brands).toHaveLength(1);
    expect(mount_standards).toEqual([]);
    const combo = items.find((item) => item.id === 'test/combo')!;
    expect(combo).toMatchObject({ item_type: 'bundle', totalAxes: 5, totalLogicalButtons: 0, hasMinistick: true, hasBrakeAxis: true, sensor: 'hall', gimbal: 'cam', brandName: 'Test Flight', verdict: null, scores: null });
    expect(combo.controlSections?.map(s => s.name)).toEqual(['Base', 'Grip']);
    expect(combo.controlSections?.[1].controls[0]).toMatchObject({ type: 'analog_ministick' });
    expect(combo.controlSections?.[1].controls[0]).not.toHaveProperty('push');
    expect(combo.resolvedPrice.price?.amount).toBe(120);
    expect(JSON.parse(JSON.stringify(items))).toEqual(items);
    expect(resolveCatalogRegion(combo, 'EU').resolvedPrice.price).toBeUndefined();
  });

  it('fails clearly on broken bundle references', async () => {
    collections.values.components = [];
    await expect(getCatalogItems()).rejects.toThrow('references missing component');
  });

  it('rejects ambiguous IDs across collections', async () => {
    const entry = collections.values.bundles[0] as { id: string };
    entry.id = 'test/base';
    await expect(getCatalogItems()).rejects.toThrow('must be unique');
  });
});
