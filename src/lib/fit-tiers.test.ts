import { describe, expect, it } from 'vitest';
import { buildTierItems, collapseTiers, combineTierLists, expandOrder, expandTiers, findTierLinks, fineScores, itemCode, parseTierList, serializeTierList, tierListText, tierOfFit, type TierList } from './fit-tiers';
import { products } from '../../scripts/content';
import { variantName } from './fit-groups';
import { ComponentSchema } from './schema';

const ids = ['vkb/gladiator-nxt-evo', 'virpil/vpc-mongoost-50cm3-base', 'thrustmaster/t-16000m'];
const list = (tiers: [string, 1 | 2 | 3 | 4 | 5 | 6][], by?: string): TierList => ({ useCase: 'airliner', group: 'sticks', by, tiers: new Map(tiers) });
/** An ordered list: positions follow the order given, per tier. */
const ordered = (tiers: [string, 1 | 2 | 3 | 4 | 5 | 6][], by?: string): TierList => {
  const seen = new Map<number, number>();
  const order = new Map(tiers.map(([id, tier]) => { const p = seen.get(tier) ?? 0; seen.set(tier, p + 1); return [id, p]; }));
  return { ...list(tiers, by), order };
};

describe('itemCode', () => {
  it('gives every catalog component a distinct five-character code', () => {
    const all = products().filter((p) => p.collection === 'components').map((p) => p.id);
    const codes = new Set(all.map(itemCode));
    expect(codes.size).toBe(all.length);
    expect([...codes].every((code) => /^[0-9a-z]{5}$/.test(code))).toBe(true);
  });
});

describe('share links', () => {
  it('round-trips a list through its query string', () => {
    const original = list([[ids[0], 5], [ids[1], 5], [ids[2], 2]], 'Feiko');
    const params = serializeTierList(original);
    expect(params.get('r')).toMatch(/^5[0-9a-z]{10}\.2[0-9a-z]{5}$/);
    const parsed = parseTierList(`https://hotas.razortek.nl/tiers?${params}`, ids)!;
    expect(parsed).toMatchObject({ useCase: 'airliner', group: 'sticks', by: 'Feiko' });
    expect([...parsed.tiers].sort()).toEqual([...original.tiers].sort());
  });

  it('round-trips the S tier and the order within each tier', () => {
    const original = ordered([[ids[2], 6], [ids[1], 4], [ids[0], 4]]);
    const params = serializeTierList(original);
    expect(params.get('o')).toBe('1');
    expect(params.get('r')).toBe(`6${itemCode(ids[2])}.4${itemCode(ids[1])}-${itemCode(ids[0])}`);
    const parsed = parseTierList(params, ids)!;
    expect([...parsed.order!]).toEqual([[ids[2], 0], [ids[1], 0], [ids[0], 1]]);
  });

  it('drops codes for products that are no longer in the catalog', () => {
    const params = serializeTierList(list([[ids[0], 4], ['gone/product', 1]]));
    expect([...parseTierList(params, ids)!.tiers]).toEqual([[ids[0], 4]]);
  });

  it('rejects links without a valid use case or group', () => {
    expect(parseTierList('?uc=space&g=sticks', ids)).toBeNull();
    expect(parseTierList('?uc=heli&g=planes', ids)).toBeNull();
  });

  it('leaves unranked items out and omits empty tiers', () => {
    expect(serializeTierList(list([])).has('r')).toBe(false);
  });
});

describe('tierListText', () => {
  it('writes one line per tier for forum posts', () => {
    const names = new Map([[ids[0], 'Gladiator'], [ids[2], 'T.16000M']]);
    expect(tierListText(list([[ids[0], 5], [ids[2], 5]]), names, 'Sticks for airliner'))
      .toBe('Sticks for airliner\nS Best: —\n5 Excellent: Gladiator, T.16000M\n4 Good: —\n3 Fine: —\n2 Weak: —\n1 Poor: —');
  });

  it('keeps the ranked order of an ordered list', () => {
    const names = new Map([[ids[0], 'Gladiator'], [ids[2], 'T.16000M']]);
    expect(tierListText(ordered([[ids[2], 4], [ids[0], 4]]), names, 'T').split('\n')[3]).toBe('4 Good: T.16000M, Gladiator');
  });
});

describe('combineTierLists', () => {
  it('takes the median per item and lets one author resubmit', () => {
    const verdicts = combineTierLists([
      list([[ids[0], 1]], 'ann'), list([[ids[0], 5]], 'Ann'),
      list([[ids[0], 4]], 'bob'), list([[ids[0], 2], [ids[1], 3]]),
    ]);
    const first = verdicts.find((v) => v.id === ids[0])!;
    expect(first.scores).toEqual([2, 4, 5]);
    expect(first.proposed).toBe(4);
    expect(verdicts.find((v) => v.id === ids[1])).toMatchObject({ median: 3, proposed: 3 });
  });

  it('keeps the median of an even split', () => {
    expect(combineTierLists([list([[ids[0], 2]]), list([[ids[0], 3]])])[0]).toMatchObject({ median: 2.5, proposed: 2.5 });
  });

  it('lets an author replace an unordered list with an ordered one', () => {
    const [verdict] = combineTierLists([list([[ids[0], 4]], 'ann'), ordered([[ids[0], 6]], 'ann')]);
    expect(verdict.scores).toEqual([4.88]);
  });
});

describe('fineScores', () => {
  it('spreads an ordered tier across its band, best first, and rounds back to the tier', () => {
    const scores = fineScores(ordered([[ids[0], 4], [ids[1], 4], [ids[2], 4]]));
    expect([...scores.values()]).toEqual([4.33, 4, 3.67]);
    expect([...scores.values()].every((s) => Math.round(s) === 4)).toBe(true);
  });

  it('puts S above Excellent, both on the 5 band', () => {
    const scores = fineScores(ordered([[ids[0], 6], [ids[1], 5], [ids[2], 1]]));
    expect(scores.get(ids[0])).toBeGreaterThan(scores.get(ids[1])!);
    expect(Math.round(scores.get(ids[0])!)).toBe(5);
    expect(Math.round(scores.get(ids[1])!)).toBe(5);
    expect(Math.round(scores.get(ids[2])!)).toBe(1);
    expect([tierOfFit(scores.get(ids[0])!), tierOfFit(scores.get(ids[1])!), tierOfFit(scores.get(ids[2])!), tierOfFit(5)]).toEqual([6, 5, 1, 5]);
  });

  it('gives an unordered list whole tier scores', () => {
    expect([...fineScores(list([[ids[0], 4], [ids[1], 4]])).values()]).toEqual([4, 4]);
  });
});

describe('findTierLinks', () => {
  it('finds links with or without the trailing slash and strips surrounding punctuation', () => {
    const text = 'Mine: https://hotas.razortek.nl/tiers/?uc=heli&g=throttles&r=5abcde. Also <https://hotas.razortek.nl/tiers?uc=ga&g=yokes> and (https://hotas.razortek.nl/compare?x=1)';
    expect(findTierLinks(text)).toEqual(['https://hotas.razortek.nl/tiers/?uc=heli&g=throttles&r=5abcde', 'https://hotas.razortek.nl/tiers?uc=ga&g=yokes']);
  });
});

describe('tier entries', () => {
  const part = (id: string, data: Record<string, unknown>, familyName?: string) => ({
    id, brandName: 'Brand', image: null, familyName,
    data: ComponentSchema.parse({ brand: 'b', mount: {}, category: 'grip', ...data }),
  });

  it('merges hand and mount twins by name', () => {
    expect(variantName('SCG Standard Add-On Grip for Gunfighter Mk.IV (Left)')).toBe('SCG Standard Add-On Grip');
    expect(variantName('VPC CDT-Aeromax [LZ] Flightstick')).toBe('VPC CDT-Aeromax Flightstick');
    expect(variantName('CDT-AERO-R Grip')).toBe('CDT-AERO Grip');
    expect(variantName('Ursa Minor Airline Joystick Left')).toBe('Ursa Minor Airline Joystick');
  });

  it('ranks a tier line, family or twin set as one entry with a median starting fit', () => {
    const items = buildTierItems([
      part('b/base', { name: 'Orion 2 Throttle Base', category: 'base', tier_line: 'Orion 2 Throttle', use_case_fit: { modern_jet: 3, airliner: 1 } }),
      part('b/grip', { name: 'Orion 2 F-16 Throttle', category: 'throttle', tier_line: 'Orion 2 Throttle', use_case_fit: { modern_jet: 5 } }),
      part('b/l', { name: 'Grip (Left)', use_case_fit: { airliner: 5 } }),
      part('b/r', { name: 'Grip (Right)', use_case_fit: { airliner: 5 } }),
      part('b/mini', { name: 'Throttle Mini', category: 'throttle' }, 'Throttle System'),
      part('b/max', { name: 'Throttle Max', category: 'throttle' }, 'Throttle System'),
    ]);
    expect(items.map((i) => [i.name, i.members])).toEqual([
      ['Orion 2 Throttle', ['b/base', 'b/grip']], ['Grip', ['b/l', 'b/r']], ['Throttle System', ['b/mini', 'b/max']],
    ]);
    expect(items[0].fit.modern_jet).toBe(4);
    expect(items[2].estimated).toBe(true);
  });

  it('links carry every member and read back to one tier per entry', () => {
    const items = buildTierItems([part('b/l', { name: 'Grip (Left)' }), part('b/r', { name: 'Grip (Right)' })]);
    const members = expandTiers(items, new Map([['b/l', 4]]));
    expect([...members]).toEqual([['b/l', 4], ['b/r', 4]]);
    expect([...collapseTiers(items, new Map([['b/r', 2]]))]).toEqual([['b/l', 2]]);
  });

  it('gives every member of an entry the same position and restores entry order from a link', () => {
    const items = buildTierItems([part('b/l', { name: 'Grip (Left)' }), part('b/r', { name: 'Grip (Right)' }), part('b/x', { name: 'Other' })]);
    const entries = new Map<string, 4>([['b/x', 4], ['b/l', 4]]);
    expect([...expandOrder(items, entries)]).toEqual([['b/x', 0], ['b/l', 1], ['b/r', 1]]);
    expect([...collapseTiers(items, expandTiers(items, entries), expandOrder(items, entries)).keys()]).toEqual(['b/x', 'b/l']);
  });
});
