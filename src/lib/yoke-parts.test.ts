import { describe, expect, it } from 'vitest';
import { products } from '../../scripts/content';
import { itemCategoryLabel } from './catalog-ui';
import type { Component } from './schema';
import { isYokeHandle, yokePart, yokeStandards } from './yoke-parts';

const components = products().filter((product) => product.collection === 'components') as { id: string; data: Component }[];
const standards = yokeStandards(components.map(({ data }) => data));
const byId = new Map(components.map(({ id, data }) => [id, data]));

describe('yoke handle and base model', () => {
  it('stores every yoke handle as category yoke with a yoke mount and no USB of its own', () => {
    for (const { id, data } of components) {
      if (!/yoke (handle|pro)\b/i.test(data.name) && !(data.category === 'yoke' && data.placement === 'mount_only')) continue;
      expect(isYokeHandle(data), id).toBe(true);
      expect(data.connectivity.standalone_usb, id).not.toBe(true);
    }
    expect(byId.get('virpil/b-jet-yoke-handle')?.mount?.provides).toBe('virpil-yoke');
  });
  it('has a category base for every yoke standard, and only bases accept yoke mounts', () => {
    expect([...standards].sort()).toEqual(['moza-yoke', 'virpil-yoke']);
    for (const standard of standards) {
      const bases = components.filter(({ data }) => data.mount?.accepts?.includes(standard));
      expect(bases.length, standard).toBeGreaterThan(0);
      for (const { id, data } of bases) expect(yokePart(data, standards), id).toBe('base');
    }
    for (const { id, data } of components) {
      if (data.category === 'grip' && data.mount?.provides) expect(standards.has(data.mount.provides), id).toBe(false);
    }
  });
  it('labels yoke halves on cards while complete yokes and stick bases keep their category label', () => {
    const label = (id: string) => {
      const data = byId.get(id)!;
      return itemCategoryLabel({ category: data.category, yokePart: yokePart(data, standards) ?? undefined });
    };
    expect(label('virpil/constellation-vega-yoke-handle')).toBe('Yoke handle');
    expect(label('virpil/b-jet-yoke-handle')).toBe('Yoke handle');
    expect(label('moza/mfy-yoke-handle')).toBe('Yoke handle');
    expect(label('virpil/vector-flight-yoke-base')).toBe('Yoke base');
    expect(label('moza/ay210-yoke-base')).toBe('Yoke base');
    expect(label('honeycomb/alpha-flight-controls-xpc')).toBe('Yoke');
    expect(label('thrustmaster/tca-yoke-boeing')).toBe('Yoke');
  });
});
