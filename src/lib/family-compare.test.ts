import { describe, expect, it } from 'vitest';
import { familyCompareTarget } from './family-compare';

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
