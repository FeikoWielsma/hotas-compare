/**
 * Baseline use-case fit from recorded specs: each group starts from a typical score per use case,
 * and documented features move it. It fills parts nobody has reviewed yet and flags editorial scores
 * that disagree; community tier lists then correct it. Rules are deliberately few and readable, and
 * are tuned against the maintainer's tier lists: the gimbal (force feedback first) matters most for
 * every kind of flying, controls and layout come second, and specialist gear scores 1 outside its niche.
 * Hard caps (`fitCap`) bind every score, reviewed or not: budget gear stays low however it is ranked.
 */
import { groupOf, toFitScore, type FitGroup } from './fit-groups.ts';
import type { Component, GimbalType, ReviewTag, UseCase, UseCaseFit } from './schema.ts';

type Adjust = Partial<Record<UseCase, number>>;
export interface Features {
  group: FitGroup;
  brand: string;
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
  airlinerFamily: boolean;
  /** Tag of the most recent external review. */
  review: ReviewTag | null;
}

const sum = (c: Component, type: string) => c.controls.filter((x) => x.type === type).reduce((n, x) => n + ('count' in x ? x.count ?? 1 : 1), 0);
const TWIST_AXIS = /twist|(^|[ _-])r?z($|[ _-])|rudder/i;

export function features(c: Component): Features {
  const levers = c.controls.filter((x) => x.type === 'lever');
  const axes = c.controls.filter((x) => x.type === 'axis');
  return {
    group: groupOf(c.category, c.name), brand: c.brand, name: c.name,
    buttons: sum(c, 'button'), hats: sum(c, 'hat'), ministicks: sum(c, 'analog_ministick'), encoders: sum(c, 'encoder'), toggles: sum(c, 'toggle'),
    dualStageTrigger: c.controls.some((x) => x.type === 'trigger' && (x.stages ?? 1) >= 2),
    levers: new Set(levers.map((x) => x.kind)),
    throttleHandles: levers.reduce((n, x) => n + (x.kind === 'throttle_dual' ? 2 : x.kind === 'throttle_single' ? x.count ?? 1 : 0), 0),
    twist: axes.some((x) => x.kind === 'twist') || (c.hardware?.axes ?? []).some((a) => TWIST_AXIS.test(a.name)),
    toeBrakes: axes.some((x) => x.kind === 'toe_brake') ? true : axes.some((x) => x.kind === 'rudder') ? false : null,
    gimbal: c.hardware?.gimbal_type ?? null,
    forceAdjustable: c.hardware?.force_adjustable === true,
    extension: c.hardware?.extension_support === true,
    airlinerFamily: c.airliner_family != null,
    review: c.external_reviews.toSorted((a, b) => b.date.localeCompare(a.date))[0]?.tag ?? null,
  };
}

/** `adjust` adds to the running score; `cap` limits the final score for every use case. */
interface Rule { label: string; when: (f: Features) => boolean; adjust?: Adjust; cap?: number }
const all = (n: number): Adjust => ({ modern_jet: n, heli: n, ww2: n, ga: n, airliner: n, space_hotas: n, space_hosas: n });
const flying = (n: number): Adjust => ({ modern_jet: n, heli: n, ww2: n, ga: n, airliner: n });

/** Typical score per use case before any feature is considered. */
const start: Record<FitGroup, UseCaseFit> = {
  sticks: { modern_jet: 3, heli: 3, ww2: 3, ga: 3.5, airliner: 3, space_hotas: 3, space_hosas: 3 },
  bases: { modern_jet: 3, heli: 3, ww2: 3, ga: 3, airliner: 3, space_hotas: 3, space_hosas: 3 },
  throttles: { modern_jet: 3, heli: 2, ww2: 3, ga: 3, airliner: 3, space_hotas: 3, space_hosas: 2 },
  yokes: { modern_jet: 1, heli: 1, ww2: 2, ga: 4, airliner: 4.5, space_hotas: 1, space_hosas: 1 },
  pedals: { modern_jet: 3.5, heli: 3.5, ww2: 3.5, ga: 4, airliner: 4, space_hotas: 3, space_hosas: 3 },
  modules: { modern_jet: 3, heli: 3, ww2: 3, ga: 3, airliner: 3, space_hotas: 3, space_hosas: 3 },
};

const AIRLINER = /airbus|boeing|airline|side ?stick|\b3x0\b/i;
const WW2 = /ww2|wwii|warbird|kg12/i;
const CIVIL = /aviation/i;
/** Sticks built to work as a space throttle: Omni-Throttle adapters and space joysticks. */
const SPACE_THROTTLE_STICK = /omni-throttle|\bOTA\b|space joystick/i;
const hotasControls = (f: Features) => f.hats >= 3 || (f.hats >= 2 && f.ministicks > 0);
const airlinerStick = (f: Features) => f.airlinerFamily || AIRLINER.test(f.name);

const quality: Rule[] = [
  { label: 'reviewers say avoid', when: (f) => f.review === 'avoid', cap: 2 },
];

/**
 * Maintainer rulings that bind every score, reviewed and tier-list scores included: budget gear with a
 * poor gimbal or build stays low for every use case, however it is ranked.
 */
const hardCaps: Rule[] = [
  { label: 'budget pedals', when: (f) => f.group === 'pedals' && /t\.flight rudder|pro flight rudder/i.test(f.name), cap: 1 },
  { label: 'Logitech / Saitek flight gear', when: (f) => f.brand === 'logitech' && f.group !== 'modules', cap: 2 },
  { label: 'Thrustmaster T.Flight', when: (f) => f.brand === 'thrustmaster' && /t\.flight/i.test(f.name), cap: 2 },
  { label: 'Turtle Beach stick', when: (f) => f.brand === 'turtle-beach' && f.group === 'sticks', cap: 2 },
];

const rules: Record<FitGroup, Rule[]> = {
  sticks: [
    { label: '3+ hats', when: (f) => f.hats >= 3, adjust: { modern_jet: 1, heli: 0.5, space_hotas: 0.5, space_hosas: 0.5 } },
    { label: 'analog ministick', when: (f) => f.ministicks > 0, adjust: { space_hotas: 1, space_hosas: 1 } },
    { label: 'twist axis', when: (f) => f.twist, adjust: { space_hosas: 0.5 } },
    { label: 'two-stage trigger', when: (f) => f.dualStageTrigger, adjust: { modern_jet: 0.5, ww2: 0.5 } },
    { label: 'brake lever (aircraft-style grip)', when: (f) => f.levers.has('brake'), adjust: { ww2: 0.5, space_hotas: -0.5, space_hosas: -0.5 } },
    { label: 'WWII-style grip', when: (f) => WW2.test(f.name), adjust: { ww2: 2, ga: 0.5, modern_jet: -2, space_hotas: -2, space_hosas: -2 } },
    { label: 'cyclic grip', when: (f) => /cyclic/i.test(f.name), adjust: { ...all(-2), heli: 2 } },
    { label: 'space throttle stick', when: (f) => SPACE_THROTTLE_STICK.test(f.name), adjust: { modern_jet: -3, heli: -3, ww2: -3, ga: -2, airliner: -3 } },
    { label: 'airliner sidestick', when: airlinerStick, adjust: { airliner: 2.5, ga: 1.5, modern_jet: -2, heli: -2, ww2: -2, space_hotas: -2, space_hosas: -2 } },
    { label: 'civil aviation stick', when: (f) => CIVIL.test(f.name), adjust: { ga: 0.5, modern_jet: -1, heli: -1, space_hotas: -1, space_hosas: -1 } },
    { label: 'ball-and-cup gimbal', when: (f) => f.gimbal === 'ball_and_cup', adjust: all(-1), cap: 3 },
    { label: 'cam-and-spring gimbal', when: (f) => f.gimbal === 'cam_and_spring', adjust: { modern_jet: 0.5, heli: 0.5, ww2: 0.5 } },
    { label: 'force feedback', when: (f) => f.gimbal === 'force_feedback', adjust: flying(1) },
  ],
  // A base is judged on its gimbal, the same for every use case.
  bases: [
    { label: 'force feedback', when: (f) => f.gimbal === 'force_feedback', adjust: all(2) },
    { label: 'cam-and-spring with adjustable force', when: (f) => f.gimbal === 'cam_and_spring' && f.forceAdjustable, adjust: all(1) },
    { label: 'ball-and-cup gimbal', when: (f) => f.gimbal === 'ball_and_cup', adjust: all(-1) },
  ],
  throttles: [
    { label: 'collective', when: (f) => (f.levers.has('collective') || /collective|rotor tcs/i.test(f.name)) && !/throttle\s*\/\s*collective/i.test(f.name), adjust: { ...all(-3), heli: 3 } },
    { label: 'throttle/collective combo', when: (f) => /throttle\s*\/\s*collective/i.test(f.name), adjust: { heli: 3 } },
    { label: 'space throttle', when: (f) => /space throttle/i.test(f.name), adjust: { ...flying(-3), space_hotas: 2, space_hosas: 3 } },
    { label: 'civil quadrant (no HOTAS controls)', when: (f) => !hotasControls(f) && f.ministicks === 0 && !f.levers.has('collective') && (f.throttleHandles >= 2 || /quadrant|throttle box/i.test(f.name)), adjust: { modern_jet: -2, heli: -1, ww2: -1, space_hotas: -2, space_hosas: -1 } },
    { label: 'multi-lever quadrant', when: (f) => f.throttleHandles >= 3 || f.levers.has('flap') || f.levers.has('speedbrake'), adjust: { ga: 1, airliner: 1 } },
    { label: 'split throttle', when: (f) => f.throttleHandles === 2, adjust: { airliner: 0.5 } },
    { label: 'WWII-style throttle', when: (f) => WW2.test(f.name), adjust: { ww2: 2, modern_jet: -1, space_hotas: -1 } },
    { label: 'HOTAS controls (3+ hats, or hats + ministick)', when: hotasControls, adjust: { modern_jet: 1.5, space_hotas: 1.5 } },
    { label: '15+ buttons, hats and encoders', when: (f) => f.buttons + f.hats + f.encoders >= 15, adjust: { modern_jet: 0.5, space_hotas: 0.5 } },
  ],
  yokes: [
    { label: 'airliner yoke', when: (f) => f.airlinerFamily || AIRLINER.test(f.name), adjust: { airliner: 0.5, ga: -0.5 } },
  ],
  pedals: [
    { label: 'no toe brakes', when: (f) => f.toeBrakes === false, adjust: { ga: -1.5, airliner: -1.5 } },
  ],
  modules: [
    { label: 'throttle, flap or speedbrake levers', when: (f) => f.throttleHandles > 0 || f.levers.has('flap') || f.levers.has('speedbrake'), adjust: { ga: 1, airliner: 1 } },
    { label: 'twist module', when: (f) => f.twist, adjust: { space_hosas: 1 } },
    { label: 'nose-wheel tiller', when: (f) => /tiller|handwheel/i.test(f.name), adjust: { airliner: 2, ga: -1, modern_jet: -2, heli: -2, ww2: -2, space_hotas: -2, space_hosas: -2 } },
  ],
};

export interface FitCap { cap: number; reasons: string[] }

/** The highest score a part may have for any use case under the maintainer's hard caps. */
export function fitCap(c: Component): FitCap {
  const f = features(c);
  const hits = hardCaps.filter((rule) => rule.when(f));
  return { cap: Math.min(5, ...hits.map((rule) => rule.cap!)), reasons: hits.map((rule) => rule.label) };
}

export interface Baseline { fit: UseCaseFit; reasons: string[] }

export function baselineFit(c: Component): Baseline {
  const f = features(c);
  const raw = { ...start[f.group] };
  const reasons: string[] = [];
  let cap = 5;
  for (const rule of [...rules[f.group], ...quality, ...hardCaps]) {
    if (!rule.when(f)) continue;
    reasons.push(rule.label);
    for (const [u, delta] of Object.entries(rule.adjust ?? {}) as [UseCase, number][]) raw[u] += delta;
    if (rule.cap) cap = Math.min(cap, rule.cap);
  }
  const fit = Object.fromEntries(Object.entries(raw).map(([u, v]) => [u, toFitScore(Math.min(v, cap))])) as UseCaseFit;
  return { fit, reasons };
}
