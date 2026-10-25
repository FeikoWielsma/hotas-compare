import { describe, expect, it } from 'vitest';
import { families as familyFiles, products } from '../../scripts/content';
import { familyIndex, familyOf, validateFamilies, type FamilyEntry, type FamilyItem } from './families';
import { FamilySchema } from './schema';

const item = (id: string, handedness: string[] = [], brand = 'vkb'): FamilyItem => ({ id, brand, handedness });
const stecs: FamilyEntry = {
  id: 'vkb/stecs',
  data: FamilySchema.parse({
    name: 'STECS', brand: 'vkb', axis: 'Size',
    members: [
      { id: 'vkb/mini-l', label: 'Mini' }, { id: 'vkb/mini-r', label: 'Mini' },
      { id: 'vkb/plus-l', label: 'Mini Plus' }, { id: 'vkb/plus-r', label: 'Mini Plus' },
      { id: 'vkb/max', label: 'Max' },
    ],
  }),
};
const items = [
  item('vkb/max', ['ambi']), item('vkb/plus-r', ['right']), item('vkb/mini-r', ['right']),
  item('vkb/plus-l', ['left']), item('vkb/mini-l', ['left']), item('vkb/other'),
];
const ids = (members: { id: string }[]) => members.map((member) => member.id);

describe('familyOf', () => {
  it('returns members in family order regardless of item order, with tiers per label', () => {
    const view = familyOf(items[0], [stecs], items)!;
    expect(ids(view.members)).toEqual(['vkb/mini-l', 'vkb/mini-r', 'vkb/plus-l', 'vkb/plus-r', 'vkb/max']);
    expect(view.tiers.map((tier) => [tier.label, ids(tier.members)])).toEqual([
      ['Mini', ['vkb/mini-l', 'vkb/mini-r']], ['Mini Plus', ['vkb/plus-l', 'vkb/plus-r']], ['Max', ['vkb/max']],
    ]);
    expect(view.members.map((member) => member.tier)).toEqual([0, 0, 1, 1, 2]);
    expect(view).toMatchObject({ id: 'vkb/stecs', name: 'STECS', axis: 'Size' });
  });

  it('excludes the current item from siblings and matches its hand in the lineup', () => {
    const view = familyOf(items[1], [stecs], items)!;
    expect(view.current).toMatchObject({ id: 'vkb/plus-r', label: 'Mini Plus', tier: 1 });
    expect(ids(view.siblings)).toEqual(['vkb/mini-l', 'vkb/mini-r', 'vkb/plus-l', 'vkb/max']);
    expect(ids(view.lineup)).toEqual(['vkb/mini-r', 'vkb/plus-r', 'vkb/max']);
    expect(ids(familyOf(items[3], [stecs], items)!.lineup)).toEqual(['vkb/mini-l', 'vkb/plus-l', 'vkb/max']);
  });

  it('falls back to the first twin when no member shares the current hand', () => {
    expect(ids(familyOf(items[0], [stecs], items)!.lineup)).toEqual(['vkb/mini-l', 'vkb/plus-l', 'vkb/max']);
  });

  it('lists only members present in the supplied items, always keeping the current one', () => {
    const view = familyOf(items[1], [stecs], [items[0], items[4]])!;
    expect(ids(view.members)).toEqual(['vkb/mini-l', 'vkb/plus-r', 'vkb/max']);
    expect(view.tiers.map((tier) => tier.label)).toEqual(['Mini', 'Mini Plus', 'Max']);
  });

  it('excludes hidden members from every public family view without weakening integrity checks', () => {
    const mixed = items.map(entry => entry.id === 'vkb/mini-r' || entry.id === 'vkb/plus-r'
      ? { ...entry, catalog_kind: 'panel' as const } : entry);
    const view = familyOf(mixed[0], [stecs], mixed)!;
    expect(ids(view.members)).toEqual(['vkb/mini-l', 'vkb/plus-l', 'vkb/max']);
    expect(ids(view.siblings)).toEqual(['vkb/mini-l', 'vkb/plus-l']);
    expect(ids(view.lineup)).toEqual(['vkb/mini-l', 'vkb/plus-l', 'vkb/max']);
    expect(view.tiers.flatMap(tier => ids(tier.members))).toEqual(ids(view.members));
    expect(familyOf(mixed[1], [stecs], mixed)).toBeNull();
    expect(familyOf(mixed[1], [stecs], [])).toBeNull();
    expect(validateFamilies([stecs], mixed)).toEqual([]);
    expect(validateFamilies([stecs], mixed.map(entry => entry.id === 'vkb/plus-r' ? { ...entry, brand: 'other' } : entry)))
      .toContain('vkb/stecs: member vkb/plus-r is brand other, not vkb');
  });

  it('returns null for an item outside every family', () => {
    expect(familyOf(items[5], [stecs], items)).toBeNull();
  });

  it('indexes membership with label and tier', () => {
    expect(familyIndex([stecs]).get('vkb/plus-l')).toMatchObject({ label: 'Mini Plus', tier: 1, family: { id: 'vkb/stecs' } });
  });
});

describe('validateFamilies', () => {
  it('accepts a consistent family', () => {
    expect(validateFamilies([stecs], items)).toEqual([]);
  });

  it('reports unknown, cross-brand, duplicated and same-hand members', () => {
    const bad: FamilyEntry = { id: 'vkb/bad', data: { name: 'Bad', brand: 'vkb', axis: 'Size', members: [
      { id: 'vkb/missing', label: 'A' }, { id: 'virpil/x', label: 'A' }, { id: 'vkb/max', label: 'B' },
      { id: 'vkb/mini-r', label: 'C' }, { id: 'vkb/plus-r', label: 'C' },
    ] } };
    const errors = validateFamilies([stecs, bad], [...items, item('virpil/x', [], 'virpil')]);
    expect(errors).toEqual([
      'vkb/bad: unknown member vkb/missing',
      'vkb/bad: member virpil/x is brand virpil, not vkb',
      'vkb/bad: vkb/max is already a member of vkb/stecs',
      'vkb/bad: vkb/mini-r is already a member of vkb/stecs',
      'vkb/bad: vkb/plus-r is already a member of vkb/stecs',
      'vkb/bad: vkb/mini-r and vkb/plus-r share label "C" but not a distinct handedness',
    ]);
  });
});

describe('family content', () => {
  const catalog = products();
  const hands = new Map(catalog.flatMap(({ id, data }) => 'handedness' in data ? [[id, data.handedness] as const] : []));
  const catalogItems = catalog.map(({ id, data }): FamilyItem => ({
    id, brand: data.brand,
    handedness: [...new Set(('components' in data ? data.components.map((ref) => hands.get(ref)) : [data.handedness])
      .filter((hand) => hand != null && hand !== 'n/a'))] as string[],
  }));
  const entries = familyFiles();

  it('references real products of the family brand, once each, with hand twins per label', () => {
    expect(validateFamilies(entries, catalogItems)).toEqual([]);
  });

  it('covers the families named in issue #16', () => {
    expect(entries.map((entry) => entry.id).sort()).toEqual(expect.arrayContaining([
      'vkb/stecs-space-throttle-system', 'vkb/stecs-modern-throttle-system', 'vkb/gnx-thq-combos',
      'vkb/gladiator-nxt-evo', 'virpil/mongoost-50-throttle',
    ]));
  });

  it('orders the STECS Space tiers Mini to Max', () => {
    const stecsSpace = entries.find((entry) => entry.id === 'vkb/stecs-space-throttle-system')!;
    const member = catalogItems.find((entry) => entry.id === 'vkb/stecs-space-throttle-system-standard-r')!;
    expect(familyOf(member, entries, catalogItems)!.lineup.map((entry) => [entry.label, entry.id])).toEqual([
      ['Mini', 'vkb/stecs-space-throttle-system-mini-r'], ['Mini Plus', 'vkb/stecs-space-throttle-system-mini-plus-r'],
      ['Standard', 'vkb/stecs-space-throttle-system-standard-r'], ['Max', 'vkb/stecs-space-throttle-system-max-r'],
    ]);
    expect(stecsSpace.data.members).toHaveLength(8);
  });
});
