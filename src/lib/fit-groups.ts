/**
 * Shared pieces for crowd-sourced use-case fit scores: which parts are ranked against each other,
 * and how a retuned score is written back to a component's YAML.
 */
import type { ComponentCategory, FitSource, UseCaseFit } from './schema.ts';

/** Components are only ranked against parts that do the same job. */
export const fitGroups = {
  sticks: ['stick_fixed', 'grip'],
  bases: ['base'],
  throttles: ['throttle', 'quadrant'],
  yokes: ['yoke'],
  pedals: ['pedals'],
  modules: ['module'],
} as const satisfies Record<string, readonly ComponentCategory[]>;
export type FitGroup = keyof typeof fitGroups;
export const fitGroupIds = Object.keys(fitGroups) as FitGroup[];

export const fitGroupLabels: Record<FitGroup, { plural: string; singular: string }> = {
  sticks: { plural: 'Sticks & grips', singular: 'stick' },
  bases: { plural: 'Stick bases', singular: 'stick base' },
  throttles: { plural: 'Throttles & collectives', singular: 'throttle / collective' },
  yokes: { plural: 'Yokes', singular: 'yoke' },
  pedals: { plural: 'Rudder pedals', singular: 'set of pedals' },
  modules: { plural: 'Modules & panels', singular: 'module' },
};

// Grips and bases carry no role field, so throttle/collective and yoke parts (and nose-wheel tillers) are recognised by name.
const THROTTLE_HAND = /throttle|collective|\bTHQ\b|rotor tcs/i;
const YOKE = /yoke/i;
const TILLER = /tiller|handwheel/i;
/** Nose-wheel tillers are catalogued as fixed sticks but steer on the ground; they never fill a stick role. */
export const isTiller = (name: string) => TILLER.test(name);

export function groupOf(category: ComponentCategory, name = ''): FitGroup {
  if (isTiller(name)) return 'modules';
  if (category === 'grip' || category === 'base') {
    if (THROTTLE_HAND.test(name)) return 'throttles';
    if (YOKE.test(name)) return 'yokes';
  }
  return fitGroupIds.find((group) => (fitGroups[group] as readonly string[]).includes(category))!;
}

/**
 * True when a stored fit is a placeholder rather than a judgement: the schema default (all 3s),
 * or the jet-4 / space-HOTAS-4 / rest-3 template that early catalog entries copied.
 */
export function isPlaceholderFit(fit: UseCaseFit): boolean {
  const values = Object.values(fit);
  if (values.every((v) => v === 3)) return true;
  const { modern_jet, space_hotas, ...rest } = fit;
  return modern_jet === 4 && space_hotas === 4 && Object.values(rest).every((v) => v === 3);
}

/** True when nobody has judged this fit yet: a placeholder, or values generated at seeding or from specs. */
export function isUnreviewedFit(fit: UseCaseFit, source?: FitSource): boolean {
  return isPlaceholderFit(fit) || source === 'seeded' || source === 'baseline';
}

/**
 * Name with hand, mount and generation variants removed, so twins such as "SCG Standard Add-On Grip for
 * Gunfighter Mk.IV (Left)" and "(Right)" rank as one entry: "SCG Standard Add-On Grip".
 */
export function variantName(name: string): string {
  return name
    .replace(/\s*\((left|right)[^)]*\)/gi, '')
    .replace(/\s*-\s*(left|right)-hand(ed)?/gi, '')
    .replace(/\s+(left|right)(-hand(ed)?)?\b/gi, '')
    .replace(/\s*\[(l|r|lz|rz)\]/gi, '')
    .replace(/-(l|r)\b/gi, '')
    .replace(/\s+for\s+gunfighter.*$/i, '')
    .replace(/\s+gf\b/gi, '')
    .replace(/\s*\(gen\.?\s*\d\)/gi, '')
    .trim();
}

/** Which parts are ranked together on /tiers: an explicit tier line, then a product family, then hand/mount twins. */
export function tierLineName(part: { name: string; tier_line?: string }, familyName?: string): string {
  return part.tier_line ?? familyName ?? variantName(part.name);
}

/** Stored fit scores are whole numbers from 1 to 5. */
export const toFitScore = (score: number) => Math.min(5, Math.max(1, Math.round(score)));

/**
 * Replace (or add) the `use_case_fit:` block in a component's YAML text, keeping the rest untouched.
 * `source` records where the scores came from; omit it for an editorial score.
 */
export function setFitInYaml(text: string, fit: UseCaseFit, source?: FitSource): string {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/).filter((line) => !/^use_case_fit_source:/.test(line));
  const block = ['use_case_fit:', ...Object.entries(fit).map(([key, value]) => `  ${key}: ${value}`), ...(source ? [`use_case_fit_source: ${source}`] : [])];
  const start = lines.findIndex((line) => /^use_case_fit:/.test(line));
  if (start >= 0) {
    let end = start + 1;
    while (end < lines.length && /^\s+\S/.test(lines[end])) end++;
    lines.splice(start, end - start, ...block);
  } else {
    const before = lines.findIndex((line) => /^(prices|verdict|external_reviews|upgrade_paths|verification|sources|images):/.test(line));
    lines.splice(before >= 0 ? before : lines.at(-1) === '' ? lines.length - 1 : lines.length, 0, ...block);
  }
  return lines.join(eol);
}
