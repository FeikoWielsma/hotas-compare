import { describe, expect, it } from 'vitest';
import { familyCompareLineup, familyCompareTarget } from './family-compare';

describe('familyCompareLineup', () => {
  const members = [
    { id: 'mini-r', name: 'Mini', handedness: ['right'], family: { id: 'stick', label: 'Mini', tier: 0 } },
    { id: 'mini-l', name: 'Mini (left)', handedness: ['left'], family: { id: 'stick', label: 'Mini', tier: 0 } },
    { id: 'standard-r', name: 'Standard', handedness: ['right'], family: { id: 'stick', label: 'Standard', tier: 1 } },
    { id: 'standard-l', name: 'Standard (left)', handedness: ['left'], family: { id: 'stick', label: 'Standard', tier: 1 } },
    { id: 'max-r', name: 'Max', handedness: ['right'], family: { id: 'stick', label: 'Max', tier: 2 } },
  ];

  it('uses one hand-matched member per tier, keeping the selected member in its tier', () => {
    expect(familyCompareLineup(members, 'stick', 'standard-l').map(({ id }) => id))
      .toEqual(['mini-l', 'standard-l', 'max-r']);
  });

  it('returns no lineup when the selected item is not in the family', () => {
    expect(familyCompareLineup(members, 'other', 'standard-l')).toEqual([]);
  });
});

describe('familyCompareTarget', () => {
  it('includes the full lineup when it fits the compare tray', () => {
    expect(familyCompareTarget(['mini', 'standard', 'max'])).toEqual({
      href: '/compare?items=mini%2Cstandard%2Cmax', included: 3, total: 3,
    });
  });

  it('takes the first four unique lineup members when the family has more tiers', () => {
    expect(familyCompareTarget(['mini', 'plus', 'standard', 'max', 'extra', 'max'])).toEqual({
      href: '/compare?items=mini%2Cplus%2Cstandard%2Cmax', included: 4, total: 5,
    });
  });
});
