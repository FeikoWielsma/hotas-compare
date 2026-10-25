import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { CatalogItem } from './catalog';
import { readContentCollections } from './fixtures/real-catalog';
import { normalizeWizardAnswers, picksOf, recommendLoadout } from './wizard';
import type { WizardAnswers } from './wizard';
import type { Region } from './schema';

// Editorial regressions for issue #35, run against the real catalog. When prices or data change,
// re-check the picks against the maintainer guidance rather than updating expectations blindly.
const collections = vi.hoisted(() => ({ values: {} as Record<string, unknown[]> }));
vi.mock('astro:content', () => ({ getCollection: (name: string) => collections.values[name] }));

const catalogs = {} as Record<Region, CatalogItem[]>;
beforeAll(async () => {
  collections.values = readContentCollections();
  const { getCatalogItems } = await import('./catalog');
  for (const region of ['US', 'EU'] as const) catalogs[region] = await getCatalogItems(region, new Date('2026-10-25'));
});
const recommend = (answers: Partial<WizardAnswers>, region: Region = 'US') => recommendLoadout(catalogs[region], normalizeWizardAnswers(answers), region);
const ids = (answers: Partial<WizardAnswers>, region: Region = 'US') => recommend(answers, region).items.map((item) => item.id);

const avoided = ['logitech/g-saitek-pro-flight-yoke', 'logitech/g-saitek-pro-flight-throttle-quadrant', 'logitech/g-saitek-pro-flight-rudder-pedals', 'logitech/flight-yoke-system', 'thrustmaster/t-flight-rudder-pedals-tfrp'];
const velocityOne = 'turtle-beach/velocityone-flight-yoke-system';

describe('airliner and GA picks', () => {
  it('recommends the VelocityOne all-in-one when a budget buyer has no pedals', () => {
    for (const useCase of ['airliner', 'ga'] as const) {
      for (const budgetMax of [350, 400]) {
        const result = recommend({ useCase, budgetMax });
        expect(picksOf(result), `${useCase} ${budgetMax}`).toEqual([[velocityOne]]);
        expect(result.pieces[0].roles.sort()).toEqual(['pedals', 'quadrant', 'yoke']);
        expect(result.pieces[0].standIns.sort()).toEqual(['pedals', 'quadrant']);
      }
    }
    // A little more budget adds a dedicated airliner quadrant; the triggers still cover rudder.
    const more = recommend({ useCase: 'airliner', budgetMax: 500 });
    expect(more.pieces.find((piece) => piece.items[0].id === velocityOne)?.standIns).toEqual(['pedals']);
    expect(picksOf(recommend({ useCase: 'airliner', budgetMax: 450 }, 'EU'))).toEqual([[velocityOne]]);
  });
  it('moves to a dedicated yoke, quadrant and pedals once the budget allows', () => {
    const airliner = recommend({ useCase: 'airliner', budgetMax: 750 });
    expect(airliner.pieces.map((piece) => piece.roles)).toEqual([['pedals'], ['yoke'], ['quadrant']]);
    expect(airliner.pieces.every((piece) => piece.standIns.length === 0)).toBe(true);
    expect(airliner.items.find((item) => item.category === 'quadrant')?.id).toBe('winctrl/ursa-minor-32-throttle');
    expect(ids({ useCase: 'ga', budgetMax: 750 })).toContain('honeycomb/bravo-throttle-quadrant-lite');
  });
  it('pairs the Ursa Minor 32 airliner quadrant or a Bravo with a yoke when pedals are already owned', () => {
    expect(ids({ useCase: 'airliner', budgetMax: 400, piecesNeeded: ['yoke', 'quadrant'], hasExistingPedals: true }))
      .toEqual(['honeycomb/alpha-flight-controls-lite', 'winctrl/ursa-minor-32-throttle']);
    expect(ids({ useCase: 'ga', budgetMax: 400, piecesNeeded: ['yoke', 'quadrant'], hasExistingPedals: true }))
      .toEqual(['honeycomb/alpha-flight-controls-lite', 'honeycomb/bravo-throttle-quadrant-lite']);
  });
  it('covers an Airbus sidestick setup with the Ursa Minor Airline stick', () => {
    const entry = recommend({ useCase: 'airliner', budgetMax: 250, piecesNeeded: ['stick', 'quadrant', 'pedals'] });
    expect(entry.items.map((item) => item.id)).toEqual(['winctrl/ursa-minor-airline-joystick-r', 'winctrl/ursa-minor-32-throttle']);
    expect(entry.pieces[0].standIns).toEqual(['pedals']);
    // With room for pedals, the twist stand-in gives way to dedicated pedals.
    const full = recommend({ useCase: 'airliner', budgetMax: 1500, piecesNeeded: ['stick', 'quadrant', 'pedals'] });
    expect(full.items.map((item) => item.id)).toContain('winctrl/ursa-minor-airline-joystick-r');
    expect(full.pieces.find((piece) => piece.roles.includes('pedals'))?.items[0].category).toBe('pedals');
  });
  it('recommends the Foxtrot stick for GA pilots who fly a stick', () => {
    for (const budgetMax of [250, 400, 1500]) {
      expect(ids({ useCase: 'ga', budgetMax, piecesNeeded: ['stick', 'quadrant', 'pedals'] }).some((id) => id.startsWith('honeycomb/foxtrot')), String(budgetMax)).toBe(true);
    }
  });
  it('marks the unreviewed TCA Sky Yoke as tentative when it is picked', () => {
    const result = recommend({ useCase: 'airliner', budgetMax: 250, piecesNeeded: ['yoke', 'quadrant'], hasExistingPedals: true });
    expect(result.items[0].id).toMatch(/^thrustmaster\/tca-sky-yoke/);
    expect(result.warnings.some((warning) => /no published reviews yet/.test(warning))).toBe(true);
    expect(recommend({ useCase: 'airliner', budgetMax: 400 }).warnings.some((warning) => /no published reviews/.test(warning))).toBe(false);
  });
});

describe('helicopter picks', () => {
  it('builds cyclic, collective and pedals by default', () => {
    expect(normalizeWizardAnswers({ useCase: 'heli' }).piecesNeeded).toEqual(['stick', 'collective', 'pedals']);
    for (const budgetMax of [400, 750, 1500]) {
      const result = recommend({ useCase: 'heli', budgetMax });
      expect(result.complete, String(budgetMax)).toBe(true);
      expect(result.pieces.find((piece) => piece.roles.includes('pedals'))?.items[0].category).toBe('pedals');
    }
  });
  it('uses a dedicated collective on a mounted setup with room for it, and a left stick on a desk', () => {
    const mounted = recommend({ useCase: 'heli', budgetMax: 1500, mountType: 'clamp' });
    const collective = mounted.pieces.find((piece) => piece.roles.includes('collective'))!;
    expect(collective.standIns).toEqual([]);
    expect(collective.items[0].id).toMatch(/^virpil\/vpc-rotor-tcs/);
    // Collective bases clamp to a desk or rig, so a desktop setup falls back to a left-hand stick.
    const desk = recommend({ useCase: 'heli', budgetMax: 750 });
    expect(desk.pieces.find((piece) => piece.roles.includes('collective'))?.standIns).toEqual(['collective']);
  });
  it('never offers a collective head as a cyclic stick', () => {
    for (const mountType of ['clamp', 'chair_pit'] as const) {
      const result = recommend({ useCase: 'heli', budgetMax: 5000, mountType });
      const cyclic = result.pieces.find((piece) => piece.roles.includes('stick'))!;
      expect(cyclic.items.some((item) => /collective|rotor/i.test(item.id))).toBe(false);
    }
  });
});

describe('avoided hardware', () => {
  it('picks Logitech yokes, quadrants or pedals, or T.Flight pedals, only when nothing else fits', () => {
    for (const region of ['US', 'EU'] as const) {
      for (const useCase of ['airliner', 'ga', 'heli', 'ww2', 'modern_jet'] as const) {
        for (const budgetMax of [250, 350, 500, 750, 1500, 3000]) {
          for (const mountType of ['desk', 'clamp'] as const) {
            const answers = normalizeWizardAnswers({ useCase, budgetMax, mountType, piecesNeeded: ['heli', 'airliner', 'ga'].includes(useCase) ? undefined : ['stick', 'throttle', 'pedals'] });
            const picked = recommendLoadout(catalogs[region], answers, region).items.map((item) => item.id);
            if (!picked.some((id) => avoided.includes(id))) continue;
            // Allowed only as a last resort: without the avoided hardware, nothing complete fits.
            const without = recommendLoadout(catalogs[region].filter((item) => !avoided.includes(item.id)), answers, region);
            expect(without.complete, `${region} ${useCase} ${budgetMax} ${mountType} picked ${picked}`).toBe(false);
          }
        }
      }
    }
  });
});
