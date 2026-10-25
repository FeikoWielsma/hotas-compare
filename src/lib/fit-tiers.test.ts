import { describe, expect, it } from 'vitest';
import { combineTierLists, findTierLinks, itemCode, parseTierList, serializeTierList, tierListText, type TierList } from './fit-tiers';
import { products } from '../../scripts/content';

const ids = ['vkb/gladiator-nxt-evo', 'virpil/vpc-mongoost-50cm3-base', 'thrustmaster/t-16000m'];
const list = (tiers: [string, 1 | 2 | 3 | 4 | 5][], by?: string): TierList => ({ useCase: 'airliner', group: 'sticks', by, tiers: new Map(tiers) });

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
      .toBe('Sticks for airliner\n5 Excellent: Gladiator, T.16000M\n4 Good: —\n3 Fine: —\n2 Weak: —\n1 Poor: —');
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

  it('rounds an even split up to the higher whole score', () => {
    expect(combineTierLists([list([[ids[0], 2]]), list([[ids[0], 3]])])[0]).toMatchObject({ median: 2.5, proposed: 3 });
  });
});

describe('findTierLinks', () => {
  it('finds links with or without the trailing slash and strips surrounding punctuation', () => {
    const text = 'Mine: https://hotas.razortek.nl/tiers/?uc=heli&g=throttles&r=5abcde. Also <https://hotas.razortek.nl/tiers?uc=ga&g=yokes> and (https://hotas.razortek.nl/compare?x=1)';
    expect(findTierLinks(text)).toEqual(['https://hotas.razortek.nl/tiers/?uc=heli&g=throttles&r=5abcde', 'https://hotas.razortek.nl/tiers?uc=ga&g=yokes']);
  });
});
