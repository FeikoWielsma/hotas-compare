import { describe, it, expect } from 'vitest';
import {
  deriveControlsSummary,
  deriveComponentStats,
  resolvePrice,
  displayPrice,
  checkMountCompatibility,
  scoreItemForUseCase,
} from './derive';
import { ComponentSchema, type Component, type MountStandard } from './schema';

describe('deriveControlsSummary', () => {
  it('correctly calculates logical buttons, axes, and feature flags', () => {
    const controls: Component['controls'] = [
      { type: 'trigger', stages: 2 },
      { type: 'hat', ways: 8, push: true, count: 2 },
      { type: 'hat', ways: 4, push: false, count: 1 },
      { type: 'analog_ministick', push: true, count: 1 },
      { type: 'button', count: 4 },
      { type: 'lever', kind: 'brake', analog: true, count: 1 },
      { type: 'encoder', count: 2, push: true },
    ];

    const summary = deriveControlsSummary(controls);

    // Logical buttons calculation:
    // Trigger: 2
    // Hat 1: 2 hats * (8 ways + 1 push) = 18
    // Hat 2: 1 hat * (4 ways) = 4
    // Ministick: 1 push = 1
    // Buttons: 4
    // Brake lever: 0 (analog)
    // Encoders: 2 * (2 directions + 1 push) = 6
    // Total = 2 + 18 + 4 + 1 + 4 + 6 = 35
    expect(summary.totalLogicalButtons).toBe(35);
    expect(summary.physicalButtons).toBe(4);
    expect(summary.triggerStages).toBe(2);
    expect(summary.hatCount).toBe(3);
    expect(summary.ministickCount).toBe(1);
    expect(summary.hasMinistick).toBe(true);
    expect(summary.hasBrakeAxis).toBe(true);
    expect(summary.encoderCount).toBe(2);
    // Estimated axes: 2 (ministick) + 1 (brake lever) = 3
    expect(summary.estimatedAxesCount).toBe(3);
  });
});

describe('deriveComponentStats', () => {
  it('uses a documented axis total without requiring invented individual axis names', () => {
    const component = ComponentSchema.parse({ brand: 'test', name: 'Stick', category: 'stick_fixed', hardware: { axis_count: 8, axes: [{ name: 'Pitch' }, { name: 'Roll' }, { name: 'Twist' }] }, controls: [{ type: 'analog_ministick' }] });
    expect(deriveComponentStats(component).totalAxes).toBe(8);
    expect(component.hardware?.axes).toHaveLength(3);
  });
  it('computes total axes from hardware when greater than controls', () => {
    const comp: Component = {
      brand: 'virpil',
      name: 'WarBRD-D Base',
      category: 'base',
      status: 'current',
      handedness: 'n/a',
      controls: [],
      hardware: {
        axes: [
          { name: 'X', resolution_bits: 16, sensor: 'contactless' },
          { name: 'Y', resolution_bits: 16, sensor: 'contactless' },
        ],
      },
      connectivity: { standalone_usb: true },
      use_case_fit: {
        modern_jet: 5,
        heli: 4,
        ww2: 5,
        ga: 4,
        airliner: 3,
        space_hotas: 4,
        space_hosas: 4,
      },
      prices: [],
      external_reviews: [],
      verification: 'verified',
      sources: [],
      images: [],
    };

    const stats = deriveComponentStats(comp);
    expect(stats.totalAxes).toBe(2);
    expect(stats.controlsSummary.totalLogicalButtons).toBe(0);
  });
});

describe('resolvePrice', () => {
  const refDate = new Date('2026-10-19T12:00:00Z');

  it('resolves price for matching region and detects freshness', () => {
    const prices = [
      {
        region: 'EU' as const,
        currency: 'EUR' as const,
        amount: 289,
        incl_vat: true,
        store: 'virpil-controls.eu',
        verified: '2026-10-01',
        source: 'manual' as const,
      },
      {
        region: 'US' as const,
        currency: 'USD' as const,
        amount: 299,
        incl_vat: false,
        store: 'virpil-controls.us',
        verified: '2026-05-01', // Stale! (> 90 days before Oct 2026)
        source: 'manual' as const,
      },
    ];

    const eu = resolvePrice(prices, 'EU', refDate);
    expect(eu.price?.amount).toBe(289);
    expect(eu.isStale).toBe(false);
    expect(eu.formatted).toContain('€289');

    const us = resolvePrice(prices, 'US', refDate);
    expect(us.price?.amount).toBe(299);
    expect(us.isStale).toBe(true);
    expect(us.formatted).toContain('$299');
  });

  it('returns isStale: false and empty when region is not found', () => {
    const res = resolvePrice([], 'UK', refDate);
    expect(res.price).toBeUndefined();
    expect(res.isStale).toBe(false);
  });
});

describe('checkMountCompatibility', () => {
  const base: Component = {
    brand: 'virpil',
    name: 'VPC MongoosT-50CM3 Base',
    category: 'base',
    status: 'current',
    handedness: 'n/a',
    mount: {
      accepts: ['virpil-grip', 'tm-din5'],
    },
    controls: [],
    connectivity: { standalone_usb: true },
    use_case_fit: {
      modern_jet: 5,
      heli: 5,
      ww2: 4,
      ga: 3,
      airliner: 2,
      space_hotas: 4,
      space_hosas: 4,
    },
    prices: [],
    external_reviews: [],
    verification: 'verified',
    sources: [],
    images: [],
  };

  const gripAlpha: Component = {
    brand: 'virpil',
    name: 'Constellation Alpha Prime',
    category: 'grip',
    status: 'current',
    handedness: 'right',
    mount: {
      provides: 'virpil-grip',
    },
    controls: [],
    connectivity: { standalone_usb: false },
    use_case_fit: {
      modern_jet: 5,
      heli: 4,
      ww2: 4,
      ga: 2,
      airliner: 1,
      space_hotas: 5,
      space_hosas: 5,
    },
    prices: [],
    external_reviews: [],
    verification: 'verified',
    sources: [],
    images: [],
  };

  const gripVkb: Component = {
    brand: 'vkb',
    name: 'Space Combat Grip (SCG)',
    category: 'grip',
    status: 'current',
    handedness: 'right',
    mount: {
      provides: 'vkb-rev-b',
    },
    controls: [],
    connectivity: { standalone_usb: false },
    use_case_fit: {
      modern_jet: 4,
      heli: 3,
      ww2: 3,
      ga: 2,
      airliner: 1,
      space_hotas: 5,
      space_hosas: 5,
    },
    prices: [],
    external_reviews: [],
    verification: 'verified',
    sources: [],
    images: [],
  };

  it('detects compatible grip and base directly', () => {
    const res = checkMountCompatibility(base, gripAlpha);
    expect(res.compatible).toBe(true);
  });

  it('detects incompatible grip and base', () => {
    const res = checkMountCompatibility(base, gripVkb);
    expect(res.compatible).toBe(false);
    expect(res.reason).toContain('Base accepts [virpil-grip, tm-din5]');
  });

  it('detects compatibility through bridge standard', () => {
    const standardsMap = new Map<string, MountStandard>([
      [
        'tm-warthog-grip',
        {
          name: 'TM Warthog Grip Mount',
          description: 'Thrustmaster Warthog connector',
          physical_type: 'thread_collar',
          compatible_with: ['tm-din5'],
        },
      ],
    ]);

    const tmGrip: Component = {
      ...gripAlpha,
      mount: { provides: 'tm-warthog-grip' },
    };

    const res = checkMountCompatibility(base, tmGrip, standardsMap);
    expect(res.compatible).toBe(true);
    expect(res.reason).toContain('Compatible via standard bridge');
  });
});

describe('scoreItemForUseCase', () => {
  it('combines use-case fit and editorial scores correctly', () => {
    const useCaseFit = {
      modern_jet: 5,
      heli: 3,
      ww2: 2,
      ga: 1,
      airliner: 1,
      space_hotas: 5,
      space_hosas: 5,
    };

    const verdict = {
      author: 'feiko',
      hands_on: true,
      take: 'Excellent',
      pros: [],
      cons: [],
      great_for: [],
      skip_if: [],
      scores: {
        build: 5,
        feel: 5,
        value: 4,
        software: 4,
        qc_support: 4, // Average = 4.4
      },
    };

    const rec = scoreItemForUseCase(useCaseFit, verdict, 'space_hosas');
    // fit = 5, verdict avg = 4.4
    // weighted = (5 * 0.6) + (4.4 * 0.4) = 3.0 + 1.76 = 4.76
    // 4.76 * 20 = 95.2 -> round = 95
    expect(rec.score).toBe(95);
    expect(rec.fitScore).toBe(5);
    expect(rec.verdictScore).toBeCloseTo(4.4);
  });
});

describe('displayPrice', () => {
  const base = { currency: 'EUR' as const, store: 'virpil-controls.eu', verified: '2026-10-24', source: 'manual' as const };

  it('adds estimated VAT to ex-VAT EU and UK prices', () => {
    const eu = displayPrice({ ...base, region: 'EU', amount: 199.95, incl_vat: false });
    expect(eu.amount).toBe(241.94);
    expect(eu.incl_vat).toBe(true);
    expect(eu.vatEstimated).toBe(true);
    expect(eu.listedAmount).toBe(199.95);
    const uk = displayPrice({ ...base, region: 'UK', currency: 'GBP', amount: 199.95, incl_vat: false });
    expect(uk.amount).toBe(239.94);
  });

  it('leaves incl-VAT prices and US sales-tax-exclusive prices alone', () => {
    expect(displayPrice({ ...base, region: 'EU', amount: 100, incl_vat: true })).toMatchObject({ amount: 100, vatEstimated: false });
    expect(displayPrice({ ...base, region: 'US', currency: 'USD', amount: 100, incl_vat: false })).toMatchObject({ amount: 100, incl_vat: false, vatEstimated: false });
  });

  it('is what resolvePrice returns, so sorting and cards use the comparable amount', () => {
    const r = resolvePrice([{ ...base, region: 'EU', amount: 100, incl_vat: false }], 'EU', new Date('2026-10-24'));
    expect(r.price?.amount).toBe(121);
    expect(r.formatted).toBe('€121 (incl. VAT, est.)');
  });
});
