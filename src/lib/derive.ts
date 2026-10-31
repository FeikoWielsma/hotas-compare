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
        triggerStages += (ctrl.stages ?? 0) * (ctrl.count ?? 1);
        totalLogicalButtons += (ctrl.stages ?? 0) * (ctrl.count ?? 1);
        break;
      }
      case 'hat': {
        const count = ctrl.count || 1;
        hatCount += count;
        // Each hat direction can be a logical button
        totalLogicalButtons += count * (ctrl.ways ?? 0);
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
        } else if (ctrl.analog === false) {
          totalLogicalButtons += count;
        }
        totalLogicalButtons += count * (ctrl.button_contacts ?? (ctrl.push ? 1 : 0));
        break;
      }
      case 'scroll_wheel':
      case 'encoder': {
        const count = ctrl.count || 1;
        if (ctrl.type === 'encoder') encoderCount += count;
        // Encoders typically send 2 logical inputs (CW and CCW) + optional push
        totalLogicalButtons += count * 2;
        if (ctrl.push) {
          totalLogicalButtons += count * (ctrl.push_stages ?? 1);
        }
        break;
      }
      case 'toggle': {
        const count = ctrl.count || 1;
        toggleCount += count;
        totalLogicalButtons += count * (ctrl.ways ?? 0);
        if (ctrl.push) totalLogicalButtons += count;
        break;
      }
      case 'slider': {
        const count = ctrl.count || 1;
        sliderCount += count;
        if (ctrl.analog === false) totalLogicalButtons += count * (ctrl.positions ?? 0);
        else if (ctrl.analog === true) estimatedAxes += count;
        break;
      }
      case 'detent': {
        detentCount += ctrl.count || 1;
        break;
      }
      case 'rocker': {
        const count = ctrl.count || 1;
        rockerCount += count;
        if (ctrl.analog) estimatedAxes += count;
        else if (ctrl.analog === false) totalLogicalButtons += count * 2;
        if (ctrl.push) totalLogicalButtons += count;
        break;
      }
      case 'rotary': {
        const count = ctrl.count || 1;
        if (ctrl.mode === 'selector') totalLogicalButtons += count * (ctrl.positions ?? 0);
        else if (ctrl.mode === 'analog') estimatedAxes += count;
        if (ctrl.push) totalLogicalButtons += count;
        break;
      }
      case 'switch': {
        // A generic switch specification establishes physical count, not its binding behavior.
        break;
      }
      case 'axis': {
        estimatedAxes += ctrl.count;
        if (ctrl.kind === 'toe_brake') hasBrakeAxis = true;
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
  const totalAxes = component.hardware?.axis_count ?? Math.max(hardwareAxesCount, summary.estimatedAxesCount);

  return {
    controlsSummary: summary,
    totalAxes,
  };
}

/** Standard VAT rates used to estimate a comparable price when a store lists EU/UK prices ex VAT. EU uses the Dutch rate. */
export const VAT_RATES: Partial<Record<Region, number>> = { EU: 0.21, UK: 0.2 };

/** A price as shown to visitors: ex-VAT EU/UK listings get VAT added so they compare fairly with incl-VAT listings. */
export interface DisplayPrice extends Price {
  vatEstimated: boolean;
  /** The amount the store actually lists, before any VAT estimate. */
  listedAmount: number;
}

export function displayPrice(price: Price): DisplayPrice {
  const rate = VAT_RATES[price.region];
  if (price.incl_vat || rate == null) return { ...price, vatEstimated: false, listedAmount: price.amount };
  return { ...price, amount: Math.round(price.amount * (1 + rate) * 100) / 100, incl_vat: true, vatEstimated: true, listedAmount: price.amount };
}

export function regionalPrices(prices: Price[], region: Region): DisplayPrice[] {
  return prices.filter(price => price.region === region).map(displayPrice).sort((a, b) => a.amount - b.amount);
}

export function priceOfferLabel(price: Price): string {
  const amount = new Intl.NumberFormat('en', { style: 'currency', currency: price.currency }).format(price.amount);
  return price.kind === 'street' ? `${amount} street · ${price.store}` : `${amount} official · ${price.store}`;
}

/** Short tax label for a displayed price. */
export function vatLabel(price: DisplayPrice): string {
  return price.vatEstimated ? 'incl. VAT, est.' : price.incl_vat ? 'incl. VAT' : 'excl. tax';
}

export interface ResolvedPrice {
  price?: DisplayPrice;
  isStale: boolean;
  daysOld?: number;
  formatted?: string;
}

export function resolvePrice(
  prices: Price[] = [],
  targetRegion: Region = 'EU',
  referenceDate: Date = new Date()
): ResolvedPrice {
  const match = regionalPrices(prices, targetRegion)[0];
  if (!match) {
    return { isStale: false };
  }

  const verifiedDate = new Date(match.verified);
  const diffTime = Math.abs(referenceDate.getTime() - verifiedDate.getTime());
  const daysOld = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const isStale = daysOld > 90;

  const symbol = match.currency === 'EUR' ? '€' : match.currency === 'GBP' ? '£' : '$';
  const formatted = `${symbol}${match.amount} (${vatLabel(match)})`;

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
  breakdown: string[];
}

/** Out of 100: each fit point is worth 12, on a floor of 28 that the wizard's bonuses and penalties are tuned against. */
export function scoreItemForUseCase(useCaseFit: Component['use_case_fit'], useCase: UseCase): ScoredRecommendation {
  const fitScore = useCaseFit[useCase] ?? 3;
  return { score: Math.round(28 + fitScore * 12), fitScore, breakdown: [`Use-case fit for ${useCase}: ${fitScore}/5`] };
}
