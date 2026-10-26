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
      for (const budgetMax of useCase === 'airliner' ? [350, 400, 450, 500] : [350, 400, 450]) {
        const result = recommend({ useCase, budgetMax });
        expect(picksOf(result), `${useCase} ${budgetMax}`).toEqual([[velocityOne]]);
        expect(result.pieces[0].roles.sort()).toEqual(['pedals', 'quadrant', 'yoke']);
        expect(result.pieces[0].standIns.sort()).toEqual(['pedals', 'quadrant']);
      }
    }
    expect(picksOf(recommend({ useCase: 'airliner', budgetMax: 450 }, 'EU'))).toEqual([[velocityOne]]);
  });
  it('shows the VelocityOne slightly over budget when nothing acceptable fits a tight airliner or GA budget', () => {
    for (const useCase of ['airliner', 'ga'] as const) {
      const result = recommend({ useCase, budgetMax: 300 });
      expect(picksOf(result), useCase).toEqual([[velocityOne]]);
      expect(result.overBudget).toBeCloseTo(29.99);
    }
    expect(recommend({ useCase: 'airliner', budgetMax: 400 }).overBudget).toBeUndefined();
  });
  it('never pairs a yoke that has its own quadrant with a second quadrant', () => {
    for (const region of ['US', 'EU'] as const) {
      for (const budgetMax of [400, 500, 600, 750, 1000, 1500]) {
        for (const useCase of ['airliner', 'ga'] as const) {
          const result = recommend({ useCase, budgetMax }, region);
          const yoke = result.pieces.find((piece) => piece.roles.includes('yoke'));
          if (yoke?.items.some((item) => item.id === velocityOne || item.id === 'thrustmaster/tca-yoke-boeing')) {
            expect(yoke.roles, `${region} ${useCase} ${budgetMax}`).toContain('quadrant');
          }
        }
      }
    }
  });
  // Re-checked against the maintainer's ordered tier lists (#71 airliner yokes, #76 GA throttles).
  it('moves a Boeing (yoke) airliner to a dedicated yoke, Boeing-style quadrant and pedals once the budget allows', () => {
    const mid = recommend({ useCase: 'airliner', budgetMax: 750 });
    expect(mid.pieces.map((piece) => piece.roles)).toEqual([['pedals'], ['yoke'], ['quadrant']]);
    expect(mid.pieces.every((piece) => piece.standIns.length === 0)).toBe(true);
    expect(mid.items.map((item) => item.id)).toEqual(['winctrl/orion-32-rudder-pedals', 'honeycomb/alpha-flight-controls-lite', 'honeycomb/bravo-throttle-quadrant-lite']);
    // Maintainer: the Bravo's reverser, spoiler, flap and autopilot features make it the Boeing quadrant.
    expect(ids({ useCase: 'airliner', budgetMax: 1000 })).toEqual(['winctrl/orion-32-rudder-pedals', 'honeycomb/alpha-flight-controls-xpc', 'honeycomb/bravo-throttle-quadrant']);
    // The S-tier MOZA yoke once it fits.
    expect(ids({ useCase: 'airliner', budgetMax: 1500 })).toEqual(['winctrl/orion-32-rudder-pedals', 'moza/ay90-yoke-base', 'moza/mfy-yoke-pro', 'honeycomb/bravo-throttle-quadrant']);
    // GA ranks the Sierra prop/mixture module in S tier.
    expect(ids({ useCase: 'ga', budgetMax: 750 })).toContain('honeycomb/sierra-tpm-module');
  });
  it('never offers the generic VKB GNX THQ as an airliner quadrant while a Bravo or replica fits', () => {
    for (const region of ['US', 'EU'] as const) {
      for (const budgetMax of [300, 400, 500, 600, 750, 1000]) {
        for (const extra of [{}, { piecesNeeded: ['yoke', 'quadrant'] as WizardAnswers['piecesNeeded'], hasExistingPedals: true }]) {
          expect(ids({ useCase: 'airliner', budgetMax, ...extra }, region).filter((id) => id.startsWith('vkb/gnx-thq')), `${region} ${budgetMax}`).toEqual([]);
        }
      }
    }
    expect(ids({ useCase: 'airliner', budgetMax: 400, piecesNeeded: ['yoke', 'quadrant'], hasExistingPedals: true }))
      .toEqual(['honeycomb/alpha-flight-controls-lite', 'honeycomb/bravo-throttle-quadrant-lite']);
  });
  it('keeps Airbus replicas out of a Boeing yoke setup and vice versa', () => {
    for (const budgetMax of [400, 750, 1500, 3000]) {
      const boeing = recommend({ useCase: 'airliner', budgetMax, piecesNeeded: ['yoke', 'quadrant'], hasExistingPedals: true });
      expect(boeing.items.some((item) => item.airlinerFamily === 'airbus'), `boeing ${budgetMax}`).toBe(false);
      const airbus = recommend({ useCase: 'airliner', budgetMax, piecesNeeded: ['stick', 'quadrant'], hasExistingPedals: true });
      expect(airbus.items.map((item) => item.id), `airbus ${budgetMax}`).toEqual(['winctrl/ursa-minor-airline-joystick-r', 'winctrl/ursa-minor-32-throttle']);
    }
    expect(ids({ useCase: 'airliner', budgetMax: 500, piecesNeeded: ['yoke', 'quadrant'], hasExistingPedals: true }))
      .toEqual(['honeycomb/alpha-flight-controls-lite', 'honeycomb/bravo-throttle-quadrant']);
    expect(ids({ useCase: 'ga', budgetMax: 400, piecesNeeded: ['yoke', 'quadrant'], hasExistingPedals: true }))
      .toEqual(['honeycomb/alpha-flight-controls-lite', 'honeycomb/bravo-throttle-quadrant-lite']);
  });
  it('covers an Airbus sidestick setup with the Ursa Minor Airline stick', () => {
    const entry = recommend({ useCase: 'airliner', budgetMax: 250, piecesNeeded: ['stick', 'quadrant', 'pedals'] });
    expect(entry.items.map((item) => item.id)).toEqual(['winctrl/ursa-minor-airline-joystick-r', 'winctrl/ursa-minor-32-throttle']);
    expect(entry.pieces[0].standIns).toEqual(['pedals']);
    // With room for pedals, the twist stand-in gives way to dedicated pedals.
    const full = recommend({ useCase: 'airliner', budgetMax: 1500, piecesNeeded: ['stick', 'quadrant', 'pedals'] });
    expect(full.items.map((item) => item.id)).toEqual(['winctrl/ursa-minor-airline-joystick-r', 'winctrl/orion-32-rudder-pedals', 'winctrl/ursa-minor-32-throttle']);
  });
  // The GA sticks tier list (#74) ranks the Ursa Minor Airline stick Excellent and the Foxtrot only Fine.
  it('recommends the Ursa Minor Airline stick for GA pilots who fly a stick', () => {
    for (const budgetMax of [250, 400, 750, 1500]) {
      expect(ids({ useCase: 'ga', budgetMax, piecesNeeded: ['stick', 'quadrant', 'pedals'] }), String(budgetMax)).toContain('winctrl/ursa-minor-airline-joystick-r');
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
  it('lets one stick with twist and a throttle axis cover a very low budget', () => {
    for (const region of ['US', 'EU'] as const) {
      const result = recommend({ useCase: 'heli', budgetMax: 120 }, region);
      expect(result.pieces, region).toHaveLength(1);
      expect(result.pieces[0].standIns.sort()).toEqual(['collective', 'pedals']);
    }
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
  it('never picks Logitech yokes, quadrants or pedals, or T.Flight pedals (alone or in a pack)', () => {
    const avoidedOrPack = (item: CatalogItem) => avoided.includes(item.id) || item.componentIds.some((id) => avoided.includes(id));
    for (const region of ['US', 'EU'] as const) {
      for (const useCase of ['airliner', 'ga', 'heli', 'ww2', 'modern_jet'] as const) {
        for (const budgetMax of [150, 250, 300, 350, 500, 750, 1500, 3000]) {
          for (const mountType of ['desk', 'clamp'] as const) {
            for (const hasExistingPedals of [false, true]) {
              const fixedWing: WizardAnswers['piecesNeeded'] | undefined = hasExistingPedals ? ['yoke', 'quadrant'] : undefined;
              const combat: WizardAnswers['piecesNeeded'] = hasExistingPedals ? ['stick', 'throttle'] : ['stick', 'throttle', 'pedals'];
              const piecesNeeded = useCase === 'heli' ? undefined : useCase === 'airliner' || useCase === 'ga' ? fixedWing : combat;
              const result = recommendLoadout(catalogs[region], normalizeWizardAnswers({ useCase, budgetMax, mountType, hasExistingPedals, piecesNeeded }), region);
              const context = `${region} ${useCase} ${budgetMax} ${mountType} ${hasExistingPedals}`;
              expect(result.items.filter(avoidedOrPack).map((item) => item.id), context).toEqual([]);
              if (useCase === 'airliner' || useCase === 'ga') expect(result.complete, context).toBe(true);
            }
          }
        }
      }
    }
  });
});

// Issue #47: maintainer guidance for budget jet, space and combat HOTAS setups.
describe('combat HOTAS picks', () => {
  const combatHotas = 'winctrl/ursa-minor-combat-hotas';
  const logitechOrT16000m = (id: string) => id.startsWith('logitech/') || id.startsWith('thrustmaster/t16000m');
  // Pending the maintainer's ordered Modern Jet and Space HOTAS re-rank: re-check these picks then, don't update blindly.
  it.skip('recommends the Ursa Minor Combat HOTAS for budget jets, its twist standing in for pedals', () => {
    for (const region of ['US', 'EU'] as const) {
      for (const budgetMax of [250, 300]) {
        expect(picksOf(recommend({ budgetMax }, region)), `${region} ${budgetMax}`).toEqual([[combatHotas]]);
        const withPedals = recommend({ budgetMax, piecesNeeded: ['stick', 'throttle', 'pedals'] }, region);
        expect(picksOf(withPedals), `${region} ${budgetMax} pedals`).toEqual([[combatHotas]]);
        expect(withPedals.pieces[0].standIns).toEqual(['pedals']);
      }
    }
    for (const region of ['US', 'EU'] as const) expect(picksOf(recommend({ useCase: 'space_hotas', budgetMax: 250 }, region)), region).toEqual([[combatHotas]]);
  });
  it('shows the Combat HOTAS over a $150 budget rather than X52 or T.16000M hardware', () => {
    const result = recommend({ budgetMax: 150 });
    expect(picksOf(result)).toEqual([[combatHotas]]);
    expect(result.overBudget).toBeCloseTo(88.83);
  });
  it('adds dedicated pedals as the first upgrade once the budget allows', () => {
    expect(ids({ budgetMax: 500, piecesNeeded: ['stick', 'throttle', 'pedals'] })).toEqual([combatHotas, 'vkb/t-rudder-mk5']);
  });
  it('moves up to better sticks and throttles at mid budgets', () => {
    // Maintainer guidance: a STECS throttle beats the Combat HOTAS once it fits, with the Ursa Minor Fighter stick.
    expect(ids({ budgetMax: 350 })).toEqual(['winctrl/ursa-minor-fighter-joystick-r', 'vkb/stecs-throttle-mini-plus']);
    for (const region of ['US', 'EU'] as const) {
      for (const budgetMax of [750]) expect(ids({ budgetMax }, region)[0], `${region} ${budgetMax}`).toBe('virpil/cdt-aeromax-r-flightstick');
    }
  });
  it('only falls back to T.16000M hardware, with a warning, when nothing better fits', () => {
    for (const [region, budgetMax] of [['EU', 150], ['US', 200]] as const) {
      const result = recommend({ budgetMax }, region);
      expect(picksOf(result), region).toEqual([['thrustmaster/t16000m-fcs-hotas']]);
      expect(result.warnings.some((warning) => /rated 2\/5 for Modern jet/.test(warning))).toBe(true);
    }
    for (const region of ['US', 'EU'] as const) {
      for (const useCase of ['modern_jet', 'space_hotas', 'ww2'] as const) {
        for (const budgetMax of [250, 300, 350, 450, 500, 750, 1500]) {
          for (const piecesNeeded of [undefined, ['stick', 'throttle', 'pedals'] as WizardAnswers['piecesNeeded']]) {
            expect(ids({ useCase, budgetMax, piecesNeeded }, region).filter(logitechOrT16000m), `${region} ${useCase} ${budgetMax}`).toEqual([]);
          }
        }
      }
    }
  });
});
