import { describe, expect, it, vi } from 'vitest';
import { contentFiles, readContent } from '../../scripts/content';
import { BrandSchema, ComponentSchema } from './schema';
import { getCatalogItems } from './catalog';
import { contactless } from './catalog-ui';
import { overallVerdict } from './detail';

vi.mock('astro:content', () => ({
  getCollection: (name: string) => name === 'components'
    ? contentFiles('src/content/components/honeycomb').map(file => ({
      id: `honeycomb/${file.split(/[\\/]/).at(-1)!.replace('.yaml', '')}`,
      data: ComponentSchema.parse(readContent(file)),
    }))
    : name === 'brands' ? [{ id: 'honeycomb', data: BrandSchema.parse({ name: 'Honeycomb' }) }] : [],
}));

// An enum alone would still accept the original incorrect contactless_magnetic value.
describe('Honeycomb sensor provenance and catalog projection', () => {
  it('keeps original Alpha/Bravo out of the contactless filter and preserves proven Hall variants', async () => {
    const items = await getCatalogItems();
    for (const slug of ['alpha-flight-controls-yoke', 'bravo-throttle-quadrant']) {
      const item = items.find(item => item.id === `honeycomb/${slug}`)!;
      expect(item.sensor).toBe('potentiometer');
      expect(contactless(item)).toBe(false);
      expect(item.verdict?.cons.join(' ')).toMatch(/Potentiometer wear/);
    }
    for (const slug of ['alpha-flight-controls-xpc', 'charlie-rudder-pedals']) {
      const item = items.find(item => item.id === `honeycomb/${slug}`)!;
      expect(item.sensor).toBe('hall_effect');
      expect(contactless(item)).toBe(true);
      const record = readContent(`src/content/components/honeycomb/${slug}.yaml`);
      expect(record.sources).toContain(`https://flyhoneycomb.com/products/${slug}`);
    }
    for (const slug of ['alpha-flight-controls-lite', 'bravo-throttle-quadrant-lite']) {
      const item = items.find(item => item.id === `honeycomb/${slug}`)!;
      expect(item.sensor).toBe('potentiometer');
      expect(contactless(item)).toBe(false);
    }
  });

  it('publishes Bravo commentary without inventing scores or hands-on experience', async () => {
    const bravo = (await getCatalogItems()).find(item => item.id === 'honeycomb/bravo-throttle-quadrant')!;
    expect(bravo.verdict).toMatchObject({ hands_on: false });
    expect(bravo.scores).toBeNull();
    expect(overallVerdict(bravo.verdict!)).toBeNull();
    expect(ComponentSchema.safeParse({ brand: 'test', name: 'Invalid partial rating', category: 'quadrant',
      verdict: { author: 'test', take: 'Test', scores: { build: 4 } },
    }).success).toBe(false);
  });
});
