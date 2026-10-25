/**
 * Baseline use-case fit from recorded specs: each group starts from a typical score per use case,
 * and documented features move it. It fills parts nobody has scored yet and flags hand scores that
 * disagree; community tier lists then correct it. Rules are deliberately few and readable.
 */
import { groupOf, toFitScore, type FitGroup } from './fit-groups.ts';
import type { Component, GimbalType, UseCase, UseCaseFit } from './schema.ts';

type Adjust = Partial<Record<UseCase, number>>;
export interface Features {
  group: FitGroup;
  name: string;
  buttons: number; hats: number; ministicks: number; encoders: number; toggles: number;
  dualStageTrigger: boolean;
  levers: Set<string>;
  /** Separate throttle handles: a dual lever counts as two. */
  throttleHandles: number;
  twist: boolean;
  toeBrakes: boolean | null;
  gimbal: GimbalType | null;
  forceAdjustable: boolean;
  extension: boolean;
  damper: boolean;
}

const sum = (c: Component, type: string) => c.controls.filter((x) => x.type === type).reduce((n, x) => n + ('count' in x ? x.count ?? 1 : 1), 0);
const TWIST_AXIS = /twist|(^|[ _-])r?z($|[ _-])|rudder/i;

export function features(c: Component): Features {
  const levers = c.controls.filter((x) => x.type === 'lever');
  const axes = c.controls.filter((x) => x.type === 'axis');
  const toe = axes.filter((x) => x.kind === 'toe_brake').length;
  return {
    group: groupOf(c.category, c.name), name: c.name,
    buttons: sum(c, 'button'), hats: sum(c, 'hat'), ministicks: sum(c, 'analog_ministick'), encoders: sum(c, 'encoder'), toggles: sum(c, 'toggle'),
    dualStageTrigger: c.controls.some((x) => x.type === 'trigger' && (x.stages ?? 1) >= 2),
    levers: new Set(levers.map((x) => x.kind)),
    throttleHandles: levers.reduce((n, x) => n + (x.kind === 'throttle_dual' ? 2 : x.kind === 'throttle_single' ? x.count ?? 1 : 0), 0),
    twist: axes.some((x) => x.kind === 'twist') || (c.hardware?.axes ?? []).some((a) => TWIST_AXIS.test(a.name)),
    toeBrakes: toe > 0 ? true : axes.some((x) => x.kind === 'rudder') ? false : null,
    gimbal: c.hardware?.gimbal_type ?? null,
    forceAdjustable: c.hardware?.force_adjustable === true,
    extension: c.hardware?.extension_support === true,
    damper: c.hardware?.damper === 'built_in' || c.hardware?.damper === 'optional',
  };
}

interface Rule { label: string; when: (f: Features) => boolean; adjust: Adjust }

/** Typical score per use case before any feature is considered. Order: jet, heli, WWII, GA, airliner, space HOTAS, space HOSAS. */
const start: Record<FitGroup, UseCaseFit> = {
  sticks: { modern_jet: 3, heli: 3, ww2: 3, ga: 2, airliner: 2, space_hotas: 3, space_hosas: 3 },
  bases: { modern_jet: 4, heli: 4, ww2: 4, ga: 3, airliner: 2, space_hotas: 4, space_hosas: 4 },
  throttles: { modern_jet: 3, heli: 3, ww2: 3, ga: 3, airliner: 3, space_hotas: 3, space_hosas: 2 },
  yokes: { modern_jet: 1, heli: 1, ww2: 1, ga: 5, airliner: 5, space_hotas: 1, space_hosas: 1 },
  pedals: { modern_jet: 4, heli: 4, ww2: 4, ga: 4, airliner: 3, space_hotas: 3, space_hosas: 3 },
  modules: { modern_jet: 3, heli: 3, ww2: 3, ga: 3, airliner: 3, space_hotas: 3, space_hosas: 3 },
};

const AIRLINER = /airbus|boeing|airline|sidestick/i;
const WW2 = /ww2|wwii|warbird|kg12/i;
const CIVIL = /aviation/i;
const rules: Record<FitGroup, Rule[]> = {
  sticks: [
    { label: '3+ hats', when: (f) => f.hats >= 3, adjust: { modern_jet: 1, heli: 0.5, space_hotas: 0.5, space_hosas: 0.5 } },
    { label: 'analog ministick', when: (f) => f.ministicks > 0, adjust: { space_hotas: 1, space_hosas: 1 } },
    { label: 'twist axis', when: (f) => f.twist, adjust: { space_hotas: 0.5, space_hosas: 1 } },
    { label: 'two-stage trigger', when: (f) => f.dualStageTrigger, adjust: { modern_jet: 0.5, ww2: 0.5 } },
    { label: 'brake lever (aircraft-style grip)', when: (f) => f.levers.has('brake'), adjust: { ww2: 0.5, space_hotas: -0.5, space_hosas: -0.5 } },
    { label: 'WWII-style grip', when: (f) => WW2.test(f.name), adjust: { ww2: 2, modern_jet: -1, space_hotas: -1, space_hosas: -1 } },
    { label: 'cyclic grip', when: (f) => /cyclic/i.test(f.name), adjust: { heli: 2.5, modern_jet: -2, ww2: -1, space_hotas: -1, space_hosas: -1 } },
    { label: 'airliner sidestick', when: (f) => AIRLINER.test(f.name), adjust: { airliner: 2.5, ga: 1, modern_jet: -0.5, space_hotas: -1.5, space_hosas: -1.5 } },
    { label: 'civil aviation stick', when: (f) => CIVIL.test(f.name), adjust: { ga: 1.5, airliner: 1, modern_jet: -0.5, space_hotas: -1, space_hosas: -1 } },
    { label: 'combat grip (airliner/GA overload)', when: (f) => f.hats >= 3 && !AIRLINER.test(f.name), adjust: { airliner: -1, ga: -0.5 } },
    { label: 'ball-and-cup gimbal', when: (f) => f.gimbal === 'ball_and_cup', adjust: { modern_jet: -1, heli: -1, ww2: -1, ga: -0.5, airliner: -0.5, space_hotas: -0.5, space_hosas: -1 } },
    { label: 'cam-and-spring gimbal', when: (f) => f.gimbal === 'cam_and_spring', adjust: { modern_jet: 0.5, heli: 0.5, ww2: 0.5 } },
    { label: 'force feedback', when: (f) => f.gimbal === 'force_feedback', adjust: { heli: 1, ww2: 1, modern_jet: 0.5 } },
  ],
  bases: [
    { label: 'force feedback', when: (f) => f.gimbal === 'force_feedback', adjust: { heli: 0.5, ww2: 0.5 } },
    { label: 'cam-and-spring with adjustable force', when: (f) => f.gimbal === 'cam_and_spring' && f.forceAdjustable, adjust: { modern_jet: 1, heli: 0.5, ga: 0.5, space_hotas: 0.5, space_hosas: 0.5 } },
    { label: 'extension support', when: (f) => f.extension, adjust: { heli: 0.5, ww2: 0.5 } },
    { label: 'ball-and-cup gimbal', when: (f) => f.gimbal === 'ball_and_cup', adjust: { modern_jet: -0.5, heli: -0.5, ww2: -0.5, space_hosas: -1 } },
    { label: 'pincer gimbal', when: (f) => f.gimbal === 'pincer', adjust: { space_hosas: 1 } },
  ],
  throttles: [
    { label: 'collective', when: (f) => f.levers.has('collective') || /collective|rotor tcs/i.test(f.name), adjust: { heli: 2, modern_jet: -0.5, ga: -0.5, airliner: -1, space_hotas: -1 } },
    { label: 'airliner quadrant', when: (f) => AIRLINER.test(f.name), adjust: { airliner: 2, ga: 1, modern_jet: -1, space_hotas: -1 } },
    { label: 'multi-lever quadrant', when: (f) => f.throttleHandles >= 3 || f.levers.has('flap') || f.levers.has('speedbrake'), adjust: { ga: 1, airliner: 1 } },
    { label: 'split throttle', when: (f) => f.throttleHandles === 2, adjust: { airliner: 0.5 } },
    { label: 'WWII-style throttle', when: (f) => WW2.test(f.name), adjust: { ww2: 2, modern_jet: -1, space_hotas: -1 } },
    { label: 'HOTAS controls (hats + ministick or 3+ hats)', when: (f) => f.hats >= 3 || (f.hats >= 2 && f.ministicks > 0), adjust: { modern_jet: 1, space_hotas: 1 } },
    { label: '15+ buttons, hats and encoders', when: (f) => f.buttons + f.hats + f.encoders >= 15, adjust: { modern_jet: 0.5, space_hotas: 0.5 } },
  ],
  yokes: [
    { label: 'airliner yoke', when: (f) => AIRLINER.test(f.name), adjust: { ga: -0.5 } },
  ],
  pedals: [
    { label: 'no toe brakes', when: (f) => f.toeBrakes === false, adjust: { ga: -1, airliner: -1, ww2: -0.5 } },
    { label: 'adjustable force', when: (f) => f.forceAdjustable, adjust: { heli: 0.5, ww2: 0.5 } },
    { label: 'damper', when: (f) => f.damper, adjust: { heli: 0.5 } },
  ],
  modules: [
    { label: 'throttle, flap or speedbrake levers', when: (f) => f.throttleHandles > 0 || f.levers.has('flap') || f.levers.has('speedbrake'), adjust: { ga: 1, airliner: 1 } },
    { label: 'twist module', when: (f) => f.twist, adjust: { space_hosas: 1 } },
    { label: 'nose-wheel tiller', when: (f) => /tiller|handwheel/i.test(f.name), adjust: { airliner: 2, ga: -1, modern_jet: -2, heli: -2, ww2: -2, space_hotas: -2, space_hosas: -2 } },
  ],
};

export interface Baseline { fit: UseCaseFit; reasons: string[] }

export function baselineFit(c: Component): Baseline {
  const f = features(c);
  const raw = { ...start[f.group] };
  const reasons: string[] = [];
  for (const rule of rules[f.group]) {
    if (!rule.when(f)) continue;
    reasons.push(rule.label);
    for (const [u, delta] of Object.entries(rule.adjust) as [UseCase, number][]) raw[u] += delta;
  }
  const fit = Object.fromEntries(Object.entries(raw).map(([u, v]) => [u, toFitScore(v)])) as UseCaseFit;
  return { fit, reasons };
}
