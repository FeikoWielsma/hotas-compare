import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentSchema, BundleSchema, BrandSchema } from './schema';
import { getCatalogItems, loadCatalog, resolveCatalogRegion } from './catalog';

const collections = vi.hoisted(() => ({ values: {} as Record<string, unknown[]> }));
vi.mock('astro:content', () => ({ getCollection: (name: string) => collections.values[name] }));

beforeEach(() => {
  collections.values = {
    brands: [{ id: 'test', data: BrandSchema.parse({ name: 'Test Flight' }) }],
    mount_standards: [],
    components: [
      { id: 'test/base', data: ComponentSchema.parse({ brand: 'test', name: 'Base', category: 'base', hardware: { axes: [{ name: 'x' }, { name: 'y' }], gimbal: 'cam', sensor: 'hall' } }) },
      { id: 'test/grip', data: ComponentSchema.parse({ brand: 'test', name: 'Grip', category: 'grip', controls: [{ type: 'analog_ministick' }, { type: 'lever', kind: 'brake' }] }) },
    ],
    bundles: [{ id: 'test/combo', data: BundleSchema.parse({ brand: 'test', name: 'Combo', category: 'stick_combo', components: ['test/base', 'test/grip'], prices: [{ region: 'UK', currency: 'GBP', amount: 120, store: 'Test', verified: '2026-10-01' }] }) }],
  };
});

describe('catalog serialization', () => {
  it('combines bundle controls and hardware, preserving the SKU price and unknown verdict', async () => {
    const { items, brands, mount_standards } = await loadCatalog('UK', new Date('2026-10-19'));
    expect(brands).toHaveLength(1);
    expect(mount_standards).toEqual([]);
    const combo = items.find((item) => item.id === 'test/combo')!;
    expect(combo).toMatchObject({ item_type: 'bundle', totalAxes: 5, totalLogicalButtons: 1, hasMinistick: true, hasBrakeAxis: true, sensor: 'hall', gimbal: 'cam', brandName: 'Test Flight', verdict: null, scores: null });
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
