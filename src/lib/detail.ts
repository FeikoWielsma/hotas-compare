import type { UseCaseFit, Verdict } from './schema';
import { humanize } from './labels';

export function overallVerdict(verdict: Verdict) {
  if (!verdict.scores) return null;
  const values = Object.values(verdict.scores);
  return `${Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1))} / 5`;
}

/** Schema defaults every fit to 3; an all-3 profile means the product has not been rated. */
export function isDefaultFit(fit: UseCaseFit) {
  return Object.values(fit).every((value) => value === 3);
}

interface SpecInput {
  axes?: string | null; inputs?: string | null; sensor?: string | null; gimbal?: string | null;
  throw?: number | null; weight?: number | null; connection?: string | null; verdict?: string | null;
}

/** Headline specifications for the product hero. Unknown values are omitted, not shown as "Unknown". */
export function keySpecs(s: SpecInput) {
  const shortText = (value?: string | null) => value && value.length <= 40 && !/^not applicable|^none/i.test(value) ? humanize(value) : null;
  return [
    s.verdict && { label: 'Our score', value: s.verdict },
    s.axes && { label: 'Axes', value: s.axes },
    s.inputs && { label: 'Est. button inputs', value: s.inputs, hint: 'Estimated logical inputs, including hat directions and switch positions' },
    shortText(s.sensor) && { label: 'Sensor', value: shortText(s.sensor)! },
    shortText(s.gimbal) && { label: 'Mechanism', value: shortText(s.gimbal)! },
    s.throw != null && { label: 'Throw', value: `${s.throw}°` },
    s.weight != null && { label: 'Weight', value: s.weight >= 1000 ? `${Number((s.weight / 1000).toFixed(2))} kg` : `${s.weight} g` },
    s.connection && { label: 'Connection', value: s.connection },
  ].filter(Boolean) as { label: string; value: string; hint?: string }[];
}
