import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentSchema, BundleSchema, BrandSchema, FamilySchema } from './schema';
import { derivePedalBrakes, getCatalogItems, loadCatalog, resolveCatalogRegion } from './catalog';

const collections = vi.hoisted(() => ({ values: {} as Record<string, unknown[]> }));
vi.mock('astro:content', () => ({ getCollection: (name: string) => collections.values[name] }));

beforeEach(() => {
  collections.values = {
    brands: [{ id: 'test', data: BrandSchema.parse({ name: 'Test Flight' }) }],
    mount_standards: [],
    reviewers: [], families: [],
    components: [
      { id: 'test/base', data: ComponentSchema.parse({ brand: 'test', name: 'Base', category: 'base', placement: 'both', hardware: { axes: [{ name: 'x' }, { name: 'y' }], gimbal: 'cam', sensor: 'hall' } }) },
      { id: 'test/grip', data: ComponentSchema.parse({ brand: 'test', name: 'Grip', category: 'grip', placement: 'mount_only', controls: [{ type: 'analog_ministick' }, { type: 'lever', kind: 'brake', analog: true }] }) },
    ],
    bundles: [{ id: 'test/combo', data: BundleSchema.parse({ brand: 'test', name: 'Combo', category: 'stick_combo', components: ['test/base', 'test/grip'], prices: [{ region: 'UK', currency: 'GBP', amount: 120, store: 'Test', verified: '2026-10-01' }] }) }],
  };
});

describe('catalog serialization', () => {
  it('flags potentiometers from the declared sensor or primary axes, but ignores secondary axes', async () => {
    collections.values.components = [
      { id: 'test/declared-pot', data: ComponentSchema.parse({ brand: 'test', name: 'Declared pot', category: 'stick_fixed', hardware: { sensor: 'potentiometer' } }) },
      { id: 'test/axis-pot', data: ComponentSchema.parse({ brand: 'test', name: 'Axis pot', category: 'stick_fixed', hardware: { sensor: 'hall', axes: [{ name: 'Pitch', sensor: 'potentiometer' }, { name: 'Roll', sensor: 'hall' }] } }) },
      { id: 'test/secondary-pot', data: ComponentSchema.parse({ brand: 'test', name: 'Secondary pot', category: 'stick_fixed', hardware: { sensor: 'hall', axes: [{ name: 'X', sensor: 'hall' }, { name: 'Y', sensor: 'hall' }, { name: 'Twist_Z', sensor: 'potentiometer' }] } }) },
    ];
    collections.values.bundles = [{ id: 'test/pot-combo', data: BundleSchema.parse({ brand: 'test', name: 'Pot combo', category: 'hotas_bundle', components: ['test/declared-pot'] }) }];
    const items = await getCatalogItems();
    expect(items.find(item => item.id === 'test/declared-pot')?.usesPotentiometers).toBe(true);
    expect(items.find(item => item.id === 'test/axis-pot')?.usesPotentiometers).toBe(true);
    expect(items.find(item => item.id === 'test/secondary-pot')?.usesPotentiometers).toBe(false);
    expect(items.find(item => item.id === 'test/pot-combo')?.usesPotentiometers).toBe(true);
  });

  it('preserves successor IDs and rejects unresolved or non-current successors during loading', async () => {
    collections.values.components.push({ id: 'test/old', data: ComponentSchema.parse({
      brand: 'test', name: 'Old', category: 'stick_fixed', status: 'discontinued', successor: 'test/combo',
    }) });
    expect((await getCatalogItems()).find(item => item.id === 'test/old')?.successor).toBe('test/combo');
    collections.values.bundles = [];
    await expect(loadCatalog()).rejects.toThrow(/successor.*current item/);
  });
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
    expect(combo).toMatchObject({ item_type: 'bundle', totalAxes: 5, totalLogicalButtons: 0, hasMinistick: true, hasBrakeAxis: true, sensor: 'hall', gimbal: 'cam', brandName: 'Test Flight', verdict: null, scores: null, placement: 'both' });
    expect(combo.controlSections?.map(s => s.name)).toEqual(['Base', 'Grip']);
    expect(combo.controlSections?.[1].controls[0]).toMatchObject({ type: 'analog_ministick' });
    expect(combo.controlSections?.[1].controls[0]).not.toHaveProperty('push');
    expect(combo.resolvedPrice.price?.amount).toBe(120);
    expect(JSON.parse(JSON.stringify(items))).toEqual(items);
    expect(resolveCatalogRegion(combo, 'EU').resolvedPrice.price).toBeUndefined();
  });

  it('derives pedal brake status, damper status, and optional damper add-on links without affecting non-pedals', async () => {
    collections.values.components = [
      ...collections.values.components,
      { id: 'test/damper-kit', data: ComponentSchema.parse({ brand: 'test', name: 'Hydraulic Damper Kit', category: 'module', catalog_kind: 'accessory' }) },
      { id: 'test/pedals-toe', data: ComponentSchema.parse({ brand: 'test', name: 'Toe Pedals', category: 'pedals', controls: [{ type: 'axis', kind: 'rudder', count: 1 }, { type: 'axis', kind: 'toe_brake', count: 2 }], hardware: { damper: 'optional', damper_addon: 'test/damper-kit', throw_deg: 38 } }) },
      { id: 'test/pedals-rudder', data: ComponentSchema.parse({ brand: 'test', name: 'Rudder Only Pedals', category: 'pedals', controls: [{ type: 'axis', kind: 'rudder', count: 1 }], hardware: { damper: 'built_in' } }) },
    ];
    const items = await getCatalogItems();
    expect(items.find(i => i.id === 'test/pedals-toe')).toMatchObject({
      pedalBrakes: 'toe_brakes',
      toeBrakeAxes: 2,
      damper: 'optional',
      damperAddon: { id: 'test/damper-kit', name: 'Hydraulic Damper Kit', href: null },
      throwDeg: 38,
    });
    expect(items.find(i => i.id === 'test/pedals-rudder')).toMatchObject({
      pedalBrakes: 'rudder_only',
      toeBrakeAxes: 0,
      damper: 'built_in',
      damperAddon: null,
      throwDeg: null,
    });
    expect(items.find(i => i.id === 'test/base')).not.toHaveProperty('pedalBrakes');
    expect(derivePedalBrakes([{ controls: [] }])).toEqual({ status: 'unknown', toeBrakeAxes: null });
  });

  it('fails clearly on broken damper_addon references', async () => {
    collections.values.components = [
      { id: 'test/pedals', data: ComponentSchema.parse({ brand: 'test', name: 'Pedals', category: 'pedals', hardware: { damper: 'optional', damper_addon: 'test/missing-damper' } }) },
    ];
    collections.values.bundles = [];
    await expect(getCatalogItems()).rejects.toThrow('references missing damper_addon');
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

  it('records family membership on serialized items and rejects unknown members', async () => {
    collections.values.families = [{ id: 'test/line', data: FamilySchema.parse({ name: 'Line', brand: 'test', axis: 'Size', members: [{ id: 'test/base', label: 'Small' }, { id: 'test/combo', label: 'Large' }] }) }];
    const items = await getCatalogItems();
    expect(items.find((item) => item.id === 'test/combo')?.family).toEqual({ id: 'test/line', name: 'Line', axis: 'Size', label: 'Large', tier: 1 });
    expect(items.find((item) => item.id === 'test/grip')?.family).toBeNull();
    (collections.values.families[0] as { data: { members: { id: string }[] } }).data.members[0].id = 'test/missing';
    await expect(getCatalogItems()).rejects.toThrow('unknown member test/missing');
  });
});
