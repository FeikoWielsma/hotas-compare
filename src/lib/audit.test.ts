import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { BundleSchema, BrandSchema, ComponentSchema } from './schema';
import { auditCatalog, createAuditSummary } from './audit';

const collections = vi.hoisted(() => ({ values: {} as Record<string, unknown[]> }));
vi.mock('astro:content', () => ({ getCollection: (name: string) => collections.values[name] }));

const benchmarkIds = [
  'virpil/constellation-alpha-prime-r', 'virpil/warbrd-d-base', 'virpil/mongoost-50cm3-throttle',
  'vkb/gladiator-nxt-evo-base', 'vkb/scg-space-combat-grip-r', 'vkb/t-rudder-mk5',
  'thrustmaster/t16000m-fcs-stick', 'thrustmaster/twcs-throttle', 'winctrl/orion-2-base',
  'winctrl/f16-ex-viper-grip', 'winctrl/ursa-minor-fighter-joystick-r', 'moza/ab9-force-feedback-base',
  'mfg/crosswind-v3-graphite-pedals', 'honeycomb/alpha-flight-controls-yoke', 'logitech/extreme-3d-pro',
];

describe('catalog audit', () => {
  it('reports accurate numbers for the catalog at a fixed reference date', async () => {
    collections.values = {
      brands: [{ id: 'test', data: BrandSchema.parse({ name: 'Test' }) }], mount_standards: [],
      components: [
        { id: 'test/old', data: ComponentSchema.parse({ brand: 'test', name: 'Old', category: 'base', verification: 'draft', prices: [{ region: 'EU', currency: 'EUR', amount: 5, store: 'Test', verified: '2026-01-01' }] }) },
        { id: 'test/no-price', data: ComponentSchema.parse({ brand: 'test', name: 'No price', category: 'grip', verification: 'verified' }) },
      ],
      bundles: [{ id: 'test/combo', data: BundleSchema.parse({ brand: 'test', name: 'Combo', category: 'stick_combo', components: ['test/old'], verification: 'verified', verdict: { author: 'test', take: 'Fine', scores: { build: 3, feel: 3, value: 3, software: 3, qc_support: 3 } } }) }],
    };
    const summary = await auditCatalog(new Date('2026-10-19T00:00:00Z'));
    expect(summary).toMatchObject({ totalItems: 3, verifiedCount: 2, draftCount: 1, stalePriceCount: 1, missingPriceCount: 2, missingVerdictCount: 2 });
    const sample = createAuditSummary([
      { id: 'old', name: 'Old', item_type: 'component', verification: 'draft', prices: [{ verified: '2026-01-01' }] },
      { id: 'none', name: 'None', item_type: 'bundle', verification: 'verified', prices: [], verdict: {} },
    ], new Date('2026-10-19T00:00:00Z'));
    expect(sample).toMatchObject({ totalItems: 2, verifiedCount: 1, draftCount: 1, stalePriceCount: 1, missingPriceCount: 1, missingVerdictCount: 1 });
  });

  it('keeps all benchmark reference items verified', async () => {
    for (const id of benchmarkIds) {
      const file = path.resolve(process.cwd(), `src/content/components/${id}.yaml`);
      const contents = fs.readFileSync(file, 'utf8');
      expect(contents, id).toMatch(/verification:\s*verified/);
      expect(contents, id).toMatch(/author:\s*feiko/);
      expect(contents, id).toMatch(/hands_on:\s*true/);
    }
  });

  it('has no bundle references to missing components', async () => {
    const content = path.resolve(process.cwd(), 'src/content');
    const componentRoot = path.join(content, 'components');
    const bundleRoot = path.join(content, 'bundles');
    const componentFiles = fs.readdirSync(componentRoot, { recursive: true }).filter((name): name is string => typeof name === 'string' && /\.ya?ml$/.test(name));
    const ids = new Set(componentFiles.map((name) => name.replace(/\\/g, '/').replace(/\.ya?ml$/, '')));
    const bundleFiles = fs.readdirSync(bundleRoot, { recursive: true }).filter((name): name is string => typeof name === 'string' && /\.ya?ml$/.test(name));
    const missing: string[] = [];
    for (const name of bundleFiles) {
      const contents = fs.readFileSync(path.join(bundleRoot, name), 'utf8');
      const refs = [...contents.matchAll(/^\s+-\s+([a-z0-9-]+\/[a-z0-9-]+)/gm)].map((match) => match[1]);
      for (const ref of refs) if (!ids.has(ref)) missing.push(`${name} -> ${ref}`);
    }
    expect(missing).toEqual([]);
  });
});
