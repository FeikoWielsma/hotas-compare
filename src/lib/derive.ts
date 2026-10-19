import type {
  Component,
  ControlItem,
  Price,
  Region,
  UseCase,
  MountStandard,
} from './schema';

export interface ControlsSummary {
  totalLogicalButtons: number;
  physicalButtons: number;
  triggerStages: number;
  hatCount: number;
  ministickCount: number;
  hasMinistick: boolean;
  hasBrakeAxis: boolean;
  encoderCount: number;
  toggleCount: number;
  sliderCount: number;
  detentCount: number;
  rockerCount: number;
  estimatedAxesCount: number;
}

export function deriveControlsSummary(controls: ControlItem[] = []): ControlsSummary {
  let physicalButtons = 0;
  let triggerStages = 0;
  let hatCount = 0;
  let ministickCount = 0;
  let hasBrakeAxis = false;
  let encoderCount = 0;
  let toggleCount = 0;
  let sliderCount = 0;
  let detentCount = 0;
  let rockerCount = 0;
  let estimatedAxes = 0;
  let totalLogicalButtons = 0;

  for (const ctrl of controls) {
    switch (ctrl.type) {
      case 'trigger': {
        triggerStages += ctrl.stages;
        totalLogicalButtons += ctrl.stages;
        break;
      }
      case 'hat': {
        const count = ctrl.count || 1;
        hatCount += count;
        // Each hat direction can be a logical button
        totalLogicalButtons += count * ctrl.ways;
        if (ctrl.push) {
          totalLogicalButtons += count;
        }
        break;
      }
      case 'analog_ministick': {
        const count = ctrl.count || 1;
        ministickCount += count;
        estimatedAxes += count * 2; // X and Y
        if (ctrl.push) {
          totalLogicalButtons += count;
        }
        break;
      }
      case 'button': {
        const count = ctrl.count || 1;
        physicalButtons += count;
        totalLogicalButtons += count;
        break;
      }
      case 'lever': {
        const count = ctrl.count || 1;
        if (ctrl.analog) {
          estimatedAxes += count;
          if (ctrl.kind === 'brake') {
            hasBrakeAxis = true;
          }
        } else {
          totalLogicalButtons += count;
        }
        break;
      }
      case 'encoder': {
        const count = ctrl.count || 1;
        encoderCount += count;
        // Encoders typically send 2 logical inputs (CW and CCW) + optional push
        totalLogicalButtons += count * 2;
        if (ctrl.push) {
          totalLogicalButtons += count;
        }
        break;
      }
      case 'toggle': {
        const count = ctrl.count || 1;
        toggleCount += count;
        totalLogicalButtons += count * (ctrl.ways || 2);
        break;
      }
      case 'slider': {
        const count = ctrl.count || 1;
        sliderCount += count;
        estimatedAxes += count;
        break;
      }
      case 'detent': {
        detentCount += ctrl.count || 1;
        break;
      }
      case 'rocker': {
        const count = ctrl.count || 1;
        rockerCount += count;
        totalLogicalButtons += count * 2 + (ctrl.push ? count : 0);
        break;
      }
      case 'rotary': {
        const count = ctrl.count || 1;
        estimatedAxes += count;
        break;
      }
    }
  }

  return {
    totalLogicalButtons,
    physicalButtons,
    triggerStages,
    hatCount,
    ministickCount,
    hasMinistick: ministickCount > 0,
    hasBrakeAxis,
    encoderCount,
    toggleCount,
    sliderCount,
    detentCount,
    rockerCount,
    estimatedAxesCount: estimatedAxes,
  };
}

export interface DerivedComponentStats {
  controlsSummary: ControlsSummary;
  totalAxes: number;
}

export function deriveComponentStats(component: Component): DerivedComponentStats {
  const summary = deriveControlsSummary(component.controls);
  const hardwareAxesCount = component.hardware?.axes?.length ?? 0;
  const totalAxes = Math.max(hardwareAxesCount, summary.estimatedAxesCount);

  return {
    controlsSummary: summary,
    totalAxes,
  };
}

export interface ResolvedPrice {
  price?: Price;
  isStale: boolean;
  daysOld?: number;
  formatted?: string;
}

export function resolvePrice(
  prices: Price[] = [],
  targetRegion: Region = 'EU',
  referenceDate: Date = new Date()
): ResolvedPrice {
  const match = prices.find((p) => p.region === targetRegion);
  if (!match) {
    return { isStale: false };
  }

  const verifiedDate = new Date(match.verified);
  const diffTime = Math.abs(referenceDate.getTime() - verifiedDate.getTime());
  const daysOld = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const isStale = daysOld > 90;

  const symbol = match.currency === 'EUR' ? '€' : match.currency === 'GBP' ? '£' : '$';
  const formatted = `${symbol}${match.amount}${match.incl_vat ? ' (incl. VAT)' : ' (excl. tax)'}`;

  return {
    price: match,
    isStale,
    daysOld,
    formatted,
  };
}

export interface CompatibilityResult {
  compatible: boolean;
  reason: string;
}

export function checkMountCompatibility(
  base: Component,
  grip: Component,
  standardsMap: Map<string, MountStandard> = new Map()
): CompatibilityResult {
  if (base.category !== 'base' && base.category !== 'stick_fixed') {
    return {
      compatible: false,
      reason: `First item "${base.name}" is not a joystick base.`,
    };
  }

  if (grip.category !== 'grip') {
    return {
      compatible: false,
      reason: `Second item "${grip.name}" is not a grip.`,
    };
  }

  const gripProvides = grip.mount?.provides;
  const baseAccepts = base.mount?.accepts ?? [];

  if (!gripProvides) {
    return {
      compatible: false,
      reason: `Grip "${grip.name}" does not specify a mount standard.`,
    };
  }

  if (baseAccepts.includes(gripProvides)) {
    return {
      compatible: true,
      reason: `Direct mechanical and electrical compatibility via "${gripProvides}".`,
    };
  }

  // Check if standard has known interoperability in standardsMap
  const standard = standardsMap.get(gripProvides);
  if (standard) {
    for (const compatibleStd of standard.compatible_with) {
      if (baseAccepts.includes(compatibleStd)) {
        return {
          compatible: true,
          reason: `Compatible via standard bridge (${gripProvides} -> ${compatibleStd}).`,
        };
      }
    }
  }

  return {
    compatible: false,
    reason: `Base accepts [${baseAccepts.join(', ')}] but grip provides "${gripProvides}". Adapter or different mount needed.`,
  };
}

export interface ScoredRecommendation {
  score: number;
  fitScore: number;
  verdictScore: number;
  breakdown: string[];
}

export function scoreItemForUseCase(
  useCaseFit: Component['use_case_fit'],
  verdict: Component['verdict'],
  useCase: UseCase
): ScoredRecommendation {
  const breakdown: string[] = [];
  const fitScore = useCaseFit[useCase] ?? 3;
  breakdown.push(`Use-case fit for ${useCase}: ${fitScore}/5`);

  let verdictScore = 3.5;
  if (verdict?.scores) {
    const s = verdict.scores;
    verdictScore = (s.build + s.feel + s.value + s.software + s.qc_support) / 5;
    breakdown.push(`Editorial verdict average: ${verdictScore.toFixed(1)}/5`);
  } else {
    breakdown.push(`No editorial review yet (baseline: 3.5)`);
  }

  // Overall score out of 100
  const normalized = Math.round(((fitScore * 0.6) + (verdictScore * 0.4)) * 20);

  return {
    score: normalized,
    fitScore,
    verdictScore,
    breakdown,
  };
}
