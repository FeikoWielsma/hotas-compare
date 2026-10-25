import { describe, expect, it } from 'vitest';
import { products } from '../../scripts/content';
import { baselineFit, fitCap } from './fit-baseline';
import { groupOf, isPlaceholderFit, isUnreviewedFit } from './fit-groups';
import { ComponentSchema, defaultUseCaseFit } from './schema';

const part = (data: Record<string, unknown>) => ComponentSchema.parse({ brand: 'test', mount: {}, ...data });

describe('baselineFit', () => {
  it('scores a yoke for civil flying and not for combat', () => {
    expect(baselineFit(part({ name: 'Yoke', category: 'yoke' })).fit).toMatchObject({ airliner: 5, ga: 4, modern_jet: 1, space_hosas: 1 });
  });

  it('rewards space features on a stick and explains why', () => {
    const { fit, reasons } = baselineFit(part({
      name: 'Space Grip', category: 'grip',
      controls: [{ type: 'hat', count: 3 }, { type: 'analog_ministick' }, { type: 'trigger', stages: 2 }],
      hardware: { axes: [{ name: 'twist' }] },
    }));
    expect(fit.space_hosas).toBe(5);
    expect(fit.airliner).toBeLessThan(fit.space_hosas);
    expect(reasons).toEqual(expect.arrayContaining(['3+ hats', 'analog ministick', 'twist axis']));
  });

  it('treats a collective as a helicopter part', () => {
    const { fit } = baselineFit(part({ name: 'Collective Grip', category: 'grip' }));
    expect(groupOf('grip', 'Collective Grip')).toBe('throttles');
    expect(fit.heli).toBe(5);
    expect(fit.space_hotas).toBeLessThan(3);
  });

  it('marks rudder-only pedals down for taxiing aircraft', () => {
    const withBrakes = baselineFit(part({ name: 'P', category: 'pedals', controls: [{ type: 'axis', kind: 'rudder' }, { type: 'axis', kind: 'toe_brake', count: 2 }] })).fit;
    const rudderOnly = baselineFit(part({ name: 'P', category: 'pedals', controls: [{ type: 'axis', kind: 'rudder' }] })).fit;
    expect(rudderOnly.ga).toBeLessThan(withBrakes.ga);
    expect(rudderOnly.heli).toBe(withBrakes.heli);
  });

  it('ranks an airliner sidestick above a combat grip for airliners', () => {
    const combat = baselineFit(part({ name: 'Combat Grip', category: 'grip', controls: [{ type: 'hat', count: 4 }, { type: 'analog_ministick' }, { type: 'lever', kind: 'brake' }] })).fit;
    const airbus = baselineFit(part({ name: 'Sidestick', category: 'stick_fixed', airliner_family: 'airbus' })).fit;
    expect(airbus.airliner).toBe(5);
    expect(combat.airliner).toBeLessThanOrEqual(3);
  });

  it('keeps gear that reviewers say to avoid low everywhere', () => {
    const { fit, reasons } = baselineFit(part({
      name: 'Budget Stick', category: 'stick_fixed', controls: [{ type: 'hat', count: 4 }, { type: 'analog_ministick' }],
      external_reviews: [
        { reviewer: 'r', url: 'https://x.test', summary: 's', tag: 'recommended', date: '2025-01-01' },
        { reviewer: 'r', url: 'https://x.test', summary: 's', tag: 'avoid', date: '2026-01-01' },
      ],
    }));
    expect(Math.max(...Object.values(fit))).toBe(2);
    expect(reasons).toContain('reviewers say avoid');
  });

  it('judges a base on its gimbal, with force feedback on top for every use case', () => {
    const ffb = baselineFit(part({ name: 'B', category: 'base', hardware: { gimbal_type: 'force_feedback' } })).fit;
    const cam = baselineFit(part({ name: 'B', category: 'base', hardware: { gimbal_type: 'cam_and_spring', force_adjustable: true } })).fit;
    const ball = baselineFit(part({ name: 'B', category: 'base', hardware: { gimbal_type: 'ball_and_cup' } })).fit;
    expect(Object.values(ffb).every((v) => v === 5)).toBe(true);
    expect(ffb.airliner).toBeGreaterThan(cam.airliner);
    expect(cam.airliner).toBeGreaterThan(ball.airliner);
  });

  it('caps budget gear for every use case', () => {
    expect(fitCap(part({ brand: 'thrustmaster', name: 'T.Flight Rudder Pedals (TFRP)', category: 'pedals' })).cap).toBe(1);
    expect(fitCap(part({ brand: 'logitech', name: 'X56 Rhino Stick', category: 'stick_fixed' })).cap).toBe(2);
    expect(fitCap(part({ brand: 'thrustmaster', name: 'T.Flight HOTAS X', category: 'stick_fixed' })).cap).toBe(2);
    expect(fitCap(part({ brand: 'turtle-beach', name: 'VelocityOne Flightstick', category: 'stick_fixed' })).cap).toBe(2);
    expect(fitCap(part({ brand: 'turtle-beach', name: 'VelocityOne Rudder Pedals', category: 'pedals' })).cap).toBe(5);
    const { fit } = baselineFit(part({ brand: 'thrustmaster', name: 'T.Flight Sidestick Airbus', category: 'stick_fixed', airliner_family: 'airbus' }));
    expect(Math.max(...Object.values(fit))).toBe(2);
  });

  it('keeps every catalog score within its hard cap, reviewed or not', () => {
    const over = products()
      .filter((p) => p.collection === 'components')
      .flatMap((p) => {
        const data = ComponentSchema.parse(p.data), { cap } = fitCap(data);
        return Object.entries(data.use_case_fit).filter(([, v]) => v > cap).map(([u, v]) => `${p.id} ${u}: ${v} > ${cap}`);
      });
    expect(over).toEqual([]);
  });

  it('keeps every score on the whole 1–5 scale', () => {
    const { fit } = baselineFit(part({ name: 'WWII Cyclic Airbus Grip', category: 'grip', hardware: { gimbal_type: 'ball_and_cup' } }));
    expect(Object.values(fit).every((v) => Number.isInteger(v) && v >= 1 && v <= 5)).toBe(true);
  });
});

describe('isPlaceholderFit', () => {
  it('recognises the schema default and the copied template, not real scores', () => {
    expect(isPlaceholderFit(defaultUseCaseFit)).toBe(true);
    expect(isPlaceholderFit({ ...defaultUseCaseFit, modern_jet: 4, space_hotas: 4 })).toBe(true);
    expect(isPlaceholderFit({ ...defaultUseCaseFit, modern_jet: 4 })).toBe(false);
    expect(isPlaceholderFit({ ...defaultUseCaseFit, airliner: 5 })).toBe(false);
  });
});

describe('isUnreviewedFit', () => {
  it('treats seeded and baseline values as unreviewed, editorial and community as reviewed', () => {
    const fit = { ...defaultUseCaseFit, airliner: 5 };
    expect(isUnreviewedFit(fit, 'seeded')).toBe(true);
    expect(isUnreviewedFit(fit, 'baseline')).toBe(true);
    expect(isUnreviewedFit(fit, 'community')).toBe(false);
    expect(isUnreviewedFit(fit)).toBe(false);
  });
});

describe('groupOf', () => {
  it('moves nose-wheel tillers out of the stick pool', () => {
    expect(groupOf('stick_fixed', 'NWS Handwheel (Left)')).toBe('modules');
  });
});
