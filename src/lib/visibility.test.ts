import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { BrandSchema, BundleSchema, ComponentSchema, FamilySchema } from './schema';
import { getCatalogItems, loadCatalog } from './catalog';
import { isListed, productPaths } from './visibility';
import { compatibleParts, resolveUpgradePaths } from './upgrades';

const collections = vi.hoisted(() => ({ values: {} as Record<string, { id: string; data: any }[]> }));
vi.mock('astro:content', () => ({ getCollection: (name: string) => collections.values[name] }));

function readCollection(name: string, schema: { parse: (input: unknown) => any }) {
  const root = path.resolve('src/content', name);
  return fs.readdirSync(root, { recursive: true }).filter((file): file is string => typeof file === 'string' && file.endsWith('.yaml'))
    .map(file => ({ id: file.replaceAll('\\', '/').replace(/\.yaml$/, ''), data: schema.parse(parse(fs.readFileSync(path.join(root, file), 'utf8'))) }));
}

describe('public product visibility', () => {
  it('excludes every hidden YAML item from detail routes and the shared catalog/brand/compare/wizard listing, while retaining raw content', async () => {
    collections.values = {
      components: readCollection('components', ComponentSchema), bundles: readCollection('bundles', BundleSchema),
      brands: readCollection('brands', BrandSchema), mount_standards: [], reviewers: [], families: readCollection('families', FamilySchema),
    };
    const catalog = await loadCatalog();
    const listed = new Set((await getCatalogItems()).map(item => item.id));
    const hidden = collections.values.components.filter(entry => !isListed(entry.data));
    expect(hidden.length).toBe(48);
    expect(collections.values.bundles.filter(entry => !isListed(entry.data)).map(entry => entry.id).sort()).toEqual(['winctrl/efis-combo', 'winctrl/glareshield-3', 'winctrl/pdc-3-combo']);
    for (const collection of ['components', 'bundles'] as const) {
      const routes = new Set(productPaths(collections.values[collection], collection === 'components' ? 'component' : 'bundle').map(route => route.params.slug));
      for (const entry of collections.values[collection]) {
        expect(routes.has(entry.id), entry.id).toBe(isListed(entry.data));
        expect(listed.has(entry.id), entry.id).toBe(isListed(entry.data));
        expect(catalog[collection].some(raw => raw.id === entry.id), entry.id).toBe(true);
      }
    }
    for (const id of ['vkb/sem-side-extension-module', 'vkb/gnx-sem-v', 'vkb/gnx-fsm-ga', 'vkb/stecs-atem', 'vkb/stecs-stem', 'moza/tqa-throttle-module', 'moza/tqb-throttle-module', 'moza/z-axis-twist-module', 'thrustmaster/omni-extension', 'thrustmaster/tca-quadrant-add-on-airbus', 'virpil/prm-hat-module', 'virpil/prm-hes-module', 'virpil/b-jet-ministick-module', 'virpil/cdt-aeromax-throttle-lever-module']) {
      expect(listed.has(id), id).toBe(true);
    }
    expect(catalog.items.some(item => item.id === 'mfg/crosswind-v3-combo')).toBe(true);
  });

  it('supports hidden bundles and preserves a visible bundle containing an accessory', async () => {
    const base = ComponentSchema.parse({ brand: 'test', name: 'Base', category: 'base' });
    const accessory = ComponentSchema.parse({ brand: 'test', name: 'Damper', category: 'module', catalog_kind: 'accessory' });
    const combo = BundleSchema.parse({ brand: 'test', name: 'Combo', category: 'system', components: ['test/base', 'test/damper'] });
    collections.values = {
      brands: [{ id: 'test', data: BrandSchema.parse({ name: 'Test' }) }], reviewers: [], mount_standards: [], families: [],
      components: [{ id: 'test/base', data: base }, { id: 'test/damper', data: accessory }],
      bundles: [{ id: 'test/combo', data: combo }, { id: 'test/hidden', data: { ...combo, catalog_kind: 'panel' } }],
    };
    expect((await getCatalogItems()).map(item => item.id)).toEqual(['test/base', 'test/combo']);
    expect(productPaths(collections.values.bundles, 'bundle').map(route => route.params.slug)).toEqual(['test/combo']);
    expect(resolveUpgradePaths('test/base', [{ to: 'test/damper', note: 'Optional damper' }], new Map([['test/damper', accessory]]), new Map())).toMatchObject([{ id: 'test/damper', name: 'Damper', href: null }]);
    const grip = ComponentSchema.parse({ brand: 'test', name: 'Hidden grip', category: 'grip', catalog_kind: 'accessory', mount: { provides: 'test' } });
    expect(compatibleParts({ ...base, mount: { accepts: ['test'] } }, new Map([['test/grip', grip]]), new Map())?.items).toEqual([]);
  });
});
