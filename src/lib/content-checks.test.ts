import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import sharedProductPages from './fixtures/shared-product-pages.json';
import { derivePedalBrakes } from './catalog';
import { contentFiles, products, readContent, urls } from '../../scripts/content';
import { resolveSuccessor } from './successors';

const catalog = products();
const normalize = (value: string) => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');
const variant = (name: string) => name.toLowerCase().match(/\b(left|right|standard|premium)\b/g)?.sort().join('/') ?? '';
const variantFamily = (name: string) => normalize(name.replace(/\b(left|right|standard|premium)\b/gi, ''));
const productPage = (value: string) => {
  const url = new URL(value);
  return !/^\/(?:[a-z]{2}(?:-[a-z]{2})?\/?)?$/i.test(url.pathname)
    && !/\.(pdf|zip)$/i.test(url.pathname)
    && !/\/(collections|pages|downloads?|static|articles)\//i.test(url.pathname)
    && !/\/products\/(?:flight\.html)?$/.test(url.pathname);
};
const canonical = (value: string) => {
  const url = new URL(value);
  return `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}${url.search}${url.hash}`;
};

describe('content correctness (offline)', () => {
  it('offers every bundle-only part through a current, priced bundle', () => {
    const bundleOnly = catalog.filter((p) => p.collection === 'components' && 'sold_standalone' in p.data && p.data.sold_standalone === false).map((p) => p.id);
    // Regression: the X52 throttle is only sold in the X52 HOTAS and must never be recommended on its own.
    expect(bundleOnly).toContain('logitech/x52-throttle');
    for (const id of bundleOnly) {
      const bundles = catalog.filter((p) => p.collection === 'bundles' && 'components' in p.data && p.data.components.includes(id) && p.data.status === 'current' && p.data.prices.length > 0);
      expect(bundles.map((p) => p.id), id).not.toEqual([]);
    }
  });
  it('resolves every successor to a different current component or bundle', () => {
    const components = new Map(catalog.filter(p => p.collection === 'components').map(p => [p.id, p.data]));
    const bundles = new Map(catalog.filter(p => p.collection === 'bundles').map(p => [p.id, p.data]));
    for (const { id, data } of catalog) expect(() => resolveSuccessor(id, data, components, bundles)).not.toThrow();
  });
  it('has no duplicate names or manufacturer product URLs except explicit variants', () => {
    const errors: string[] = [];
    for (let i = 0; i < catalog.length; i++) {
      const a = catalog[i];
      for (const b of catalog.slice(i + 1)) {
        const sameName = normalize(a.data.name) === normalize(b.data.name);
        const sameSource = a.data.sources.some(url => productPage(url) && b.data.sources.some(other => canonical(url) === canonical(other)) && !sharedProductPages.some(group => canonical(group.url) === canonical(url) && group.ids.includes(a.id) && group.ids.includes(b.id)));
        const explicitVariants = variantFamily(a.data.name) === variantFamily(b.data.name) && variant(a.data.name) !== variant(b.data.name);
        if (sameName || (sameSource && !explicitVariants)) errors.push(`${a.file} / ${b.file}: ${sameName ? 'duplicate name' : 'shared source URL'}`);
      }
    }
    expect(errors).toEqual([]);
  });

  it('uses consistent VAT conventions per store', () => {
    const stores = new Map<string, { vat: boolean; file: string }>();
    const errors: string[] = [];
    for (const { file, data } of catalog) for (const price of data.prices) {
      const key = `${price.store.trim().toLowerCase().replace(/^www\./, '')}/${price.region}`;
      const previous = stores.get(key);
      if (previous && previous.vat !== price.incl_vat) errors.push(`${file}: ${key} incl_vat=${price.incl_vat}, unlike ${previous.file}`);
      else stores.set(key, { vat: price.incl_vat, file });
    }
    expect(errors).toEqual([]);
  });

  it('contains no placeholder URLs in any content collection', () => {
    const errors = contentFiles().flatMap(file => urls(readContent(file)).filter(url => /sample-|example\.com|TODO/i.test(url)).map(url => `${file}: ${url}`));
    expect(errors).toEqual([]);
  });

  it('references existing public images, components, and reviewers', () => {
    const errors: string[] = [];
    const ids = new Set(catalog.filter(p => p.collection === 'components').map(p => p.id));
    const publicDir = resolve('public');
    for (const { file, data } of catalog) {
      for (const image of data.images) {
        const target = resolve(publicDir, image.file.replace(/^\//, ''));
        if (!target.startsWith(publicDir + sep) || !existsSync(target)) errors.push(`${file}: missing public image ${image.file}`);
      }
      if ('components' in data) for (const id of data.components) if (!ids.has(id)) errors.push(`${file}: missing component ${id}`);
      if ('hardware' in data && data.hardware?.damper_addon && !ids.has(data.hardware.damper_addon)) {
        errors.push(`${file}: missing damper_addon component ${data.hardware.damper_addon}`);
      }
      for (const review of data.external_reviews) if (!existsSync(`src/content/reviewers/${review.reviewer}.yaml`)) errors.push(`${file}: missing reviewer ${review.reviewer}`);
    }
    expect(errors).toEqual([]);
  });

  it('documents brake and damper status for every pedal component', () => {
    const errors: string[] = [];
    for (const { file, collection, data } of catalog) {
      if (collection !== 'components' || data.category !== 'pedals' || !('controls' in data)) continue;
      if (!data.hardware?.damper) errors.push(`${file}: missing hardware.damper`);
      if (derivePedalBrakes([data]).status === 'unknown') errors.push(`${file}: unresolved pedal brake status`);
    }
    expect(errors).toEqual([]);
  });
});
