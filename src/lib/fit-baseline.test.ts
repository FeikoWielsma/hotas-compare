import { describe, expect, it } from 'vitest';
import { baselineFit } from './fit-baseline';
import { groupOf, isPlaceholderFit } from './fit-groups';
import { ComponentSchema, defaultUseCaseFit } from './schema';

const part = (data: Record<string, unknown>) => ComponentSchema.parse({ brand: 'test', mount: {}, ...data });

describe('baselineFit', () => {
  it('scores a yoke for civil flying and not for combat', () => {
    expect(baselineFit(part({ name: 'Yoke', category: 'yoke' })).fit).toMatchObject({ airliner: 5, ga: 5, modern_jet: 1, space_hosas: 1 });
  });

  it('rewards space features on a stick and explains why', () => {
    const { fit, reasons } = baselineFit(part({
      name: 'Space Grip', category: 'grip',
      controls: [{ type: 'hat', count: 3 }, { type: 'analog_ministick' }, { type: 'trigger', stages: 2 }],
      hardware: { axes: [{ name: 'twist' }] },
    }));
    expect(fit.space_hosas).toBe(5);
    expect(fit.airliner).toBeLessThanOrEqual(2);
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

describe('groupOf', () => {
  it('moves nose-wheel tillers out of the stick pool', () => {
    expect(groupOf('stick_fixed', 'NWS Handwheel (Left)')).toBe('modules');
  });
});
