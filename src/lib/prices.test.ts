import { describe, expect, it } from 'vitest';
import { PriceSchema } from './schema';
import { displayPrice, priceOfferLabel, regionalPrices, resolvePrice } from './derive';

const price = (overrides = {}) => PriceSchema.parse({ region: 'EU', currency: 'EUR', amount: 100, store: 'store.test', verified: '2026-10-01', ...overrides });

describe('regional offers', () => {
  it('defaults legacy prices to official and validates the kind', () => {
    expect(price().kind).toBe('official');
    expect(() => price({ kind: 'sale' })).toThrow();
  });

  it('chooses the lowest displayed amount regardless of order or kind', () => {
    const official = price({ amount: 90, incl_vat: false });
    const street = price({ amount: 99, kind: 'street' });
    const us = price({ amount: 1, region: 'US', currency: 'USD' });
    expect(resolvePrice([official, us, street]).price).toEqual(displayPrice(street));
    expect(resolvePrice([street, official, us]).price).toEqual(displayPrice(street));
    expect(resolvePrice([price({ amount: 80 }), street]).price?.kind).toBe('official');
    expect(resolvePrice([us], 'UK')).toEqual({ isStale: false });
  });

  it('retains all offers for detail display with their kind, store, and VAT estimate', () => {
    const offers = regionalPrices([price({ amount: 100, incl_vat: false }), price({ amount: 99, kind: 'street' })], 'EU');
    expect(offers.map(priceOfferLabel)).toEqual(['€99.00 street · store.test', '€121.00 official · store.test']);
    expect(offers[1]).toMatchObject({ listedAmount: 100, vatEstimated: true });
  });

  it('uses the selected offer verification date for staleness', () => {
    const result = resolvePrice([price(), price({ amount: 90, verified: '2025-01-01' })], 'EU', new Date('2026-10-01'));
    expect(result.isStale).toBe(true);
    expect(result.formatted).toBe('€90 (incl. VAT)');
  });
});
