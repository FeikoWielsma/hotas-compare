import { describe, expect, it } from 'vitest';
import { pickDuel, poolOf, rate, setFitInYaml, toFitScore, type DuelItem, type DuelVote } from './fit-duel';
import { defaultUseCaseFit } from './schema';

const vote = (a: string, b: string, result: DuelVote['result']): DuelVote => ({ t: '2026-10-25', use_case: 'airliner', a, b, result });
const priors = (...ids: string[]) => new Map(ids.map((id) => [id, { mean: 3, sd: 1 }]));

describe('rate', () => {
  it('keeps the prior when there are no votes', () => {
    const r = rate([], priors('x', 'y'));
    expect(r.get('x')).toMatchObject({ score: 3, votes: 0 });
  });

  it('separates consistently preferred items and gains confidence', () => {
    const votes = Array.from({ length: 6 }, () => vote('x', 'y', 'a'));
    const r = rate(votes, priors('x', 'y'));
    expect(r.get('x')!.score).toBeGreaterThan(3.5);
    expect(r.get('y')!.score).toBeLessThan(2.5);
    expect(r.get('x')!.sd).toBeLessThan(1);
    expect(r.get('x')!.votes).toBe(6);
  });

  it('moves both items on absolute votes and ignores skips', () => {
    const r = rate([vote('x', 'y', 'both_good'), vote('x', 'y', 'both_good'), vote('x', 'y', 'skip')], priors('x', 'y'));
    expect(r.get('x')!.score).toBeGreaterThan(3);
    expect(r.get('x')!.score).toBeCloseTo(r.get('y')!.score);
    expect(r.get('x')!.votes).toBe(2);
    const bad = rate([vote('x', 'y', 'both_bad')], priors('x', 'y'));
    expect(bad.get('y')!.score).toBeLessThan(3);
  });

  it('treats ties as pulling scores together', () => {
    const p = new Map([['x', { mean: 5, sd: 1 }], ['y', { mean: 1, sd: 1 }]]);
    const r = rate(Array.from({ length: 5 }, () => vote('x', 'y', 'tie')), p);
    expect(r.get('x')!.score - r.get('y')!.score).toBeLessThan(2);
  });

  it('ignores votes for items that no longer exist', () => {
    expect(rate([vote('x', 'gone', 'a')], priors('x')).get('x')!.votes).toBe(0);
  });
});

describe('toFitScore', () => {
  it('rounds and clamps to the stored 1–5 scale', () => {
    expect([0.2, 2.49, 2.5, 6].map(toFitScore)).toEqual([1, 2, 3, 5]);
  });
});

describe('pickDuel', () => {
  const item = (id: string, pool: DuelItem['pool']): DuelItem => ({ id, pool, fit: defaultUseCaseFit });

  it('only pairs items from the same pool', () => {
    const items = [item('s1', 'sticks'), item('s2', 'sticks'), item('p1', 'pedals')];
    for (let k = 0; k < 20; k++) {
      const duel = pickDuel(items, [], ['airliner'], ['sticks', 'pedals'])!;
      expect([duel.a, duel.b].sort()).toEqual(['s1', 's2']);
    }
  });

  it('returns null when no selected pool has two items', () => {
    expect(pickDuel([item('s1', 'sticks'), item('p1', 'pedals')], [], ['airliner'], ['sticks', 'pedals'])).toBeNull();
  });

  it('prefers pairs that have not been voted yet', () => {
    const items = [item('s1', 'sticks'), item('s2', 'sticks'), item('s3', 'sticks')];
    const votes = [vote('s1', 's2', 'a'), vote('s1', 's2', 'a')];
    const duel = pickDuel(items, votes, ['airliner'], ['sticks'], () => 0.01)!;
    expect([duel.a, duel.b]).toContain('s3');
  });
});

describe('setFitInYaml', () => {
  const fit = { ...defaultUseCaseFit, airliner: 5 };

  it('replaces an existing block in place', () => {
    const text = 'name: X\nuse_case_fit:\n  modern_jet: 1\n  airliner: 2\nprices: []\n';
    expect(setFitInYaml(text, fit)).toBe('name: X\nuse_case_fit:\n  modern_jet: 3\n  heli: 3\n  ww2: 3\n  ga: 3\n  airliner: 5\n  space_hotas: 3\n  space_hosas: 3\nprices: []\n');
  });

  it('adds a block before prices, keeping CRLF line endings', () => {
    const out = setFitInYaml('name: X\r\nprices: []\r\n', fit);
    expect(out.startsWith('name: X\r\nuse_case_fit:\r\n  modern_jet: 3\r\n')).toBe(true);
    expect(out.endsWith('  space_hosas: 3\r\nprices: []\r\n')).toBe(true);
  });

  it('appends at the end when no later field exists', () => {
    expect(setFitInYaml('name: X\n', fit).endsWith('  space_hosas: 3\n')).toBe(true);
  });
});

describe('poolOf', () => {
  it('routes throttle, collective and yoke grips and bases out of the stick pools', () => {
    expect(poolOf('grip', 'STECS Space Throttle Add-On Grip (STG) Left-Hand')).toBe('throttles');
    expect(poolOf('grip', 'VPC Hawk-60 Collective Grip')).toBe('throttles');
    expect(poolOf('base', 'VPC Rotor TCS Plus Base')).toBe('throttles');
    expect(poolOf('base', 'MOZA AY210 Yoke Base')).toBe('yokes');
    expect(poolOf('grip', 'MCG Pro Add-On Grip for Gunfighter Mk.IV')).toBe('sticks');
    expect(poolOf('base', 'Gunfighter Mk.IV Base')).toBe('bases');
    expect(poolOf('quadrant')).toBe('throttles');
  });
});

describe('setFitInYaml source', () => {
  it('records the source after the block and drops it again for editorial scores', () => {
    const withSource = setFitInYaml('name: X\nuse_case_fit: {}\nprices: []\n', defaultUseCaseFit, 'baseline');
    expect(withSource).toContain('  space_hosas: 3\nuse_case_fit_source: baseline\nprices: []');
    expect(setFitInYaml(withSource, defaultUseCaseFit)).not.toContain('use_case_fit_source');
  });
});
