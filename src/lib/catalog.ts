import { isListed } from './visibility';
import { resolveSuccessor } from './successors';
import { deriveComponentStats, deriveControlsSummary, resolvePrice } from './derive';
import type { ControlsSummary, ResolvedPrice } from './derive';
import type { Component, Bundle, Region, UseCaseFit, Verdict, ReviewTag, GimbalType, DamperType, ControlItem } from './schema';
import type { ControlSection } from './control-inventory';
import { familyIndex, validateFamilies } from './families';

export type PedalBrakes = 'toe_brakes' | 'rudder_only' | 'unknown';

export interface CatalogItem {
  /** Collection ID, including the brand path; stable across region changes. */
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandName: string;
  category: Component['category'] | Bundle['category'];
  item_type: 'component' | 'bundle';
  status: Component['status'];
  successor?: string;
  platform_compatibility?: Component['platform_compatibility'];
  verification: Component['verification'];
  prices: Component['prices'];
  region: Region;
  resolvedPrice: ResolvedPrice;
  totalAxes: number;
  /** Distinguishes a documented zero from an unresolved axis inventory. */
  axisCountKnown?: boolean;
  totalLogicalButtons: number;
  hasMinistick: boolean;
  hasBrakeAxis: boolean;
  controlsSummary: ControlsSummary;
  controlSections?: ControlSection[];
  sensor: string | null;
  /** At least one member has potentiometers on its primary axes. */
  usesPotentiometers: boolean;
  gimbal: string | null;
  use_case_fit: UseCaseFit;
  verdict: Verdict | null;
  scores: Verdict['scores'] | null;
  /** Tag of the most recent external review (e.g. Mysh's latest roundup), if any. */
  reviewTag?: ReviewTag | null;
  /** The most recent external review, for review chips and rank explanations. */
  latestReview?: { reviewer: string; reviewerName: string; tag: ReviewTag; url: string; summary: string; date: string } | null;
  /** Stick gimbal family of the member that carries the stick gimbal, if documented. */
  gimbalType?: GimbalType | null;
  /** A complete stick with no twist axis: rudder needs pedals. */
  needsPedals?: boolean;
  /** Pedal brake configuration derived from axis controls, for pedal cards. */
  pedalBrakes?: PedalBrakes | null;
  /** Documented toe-brake axis count for pedals. */
  toeBrakeAxes?: number | null;
  /** Structured damper support for pedal cards. */
  damper?: DamperType | null;
  /** Optional damper add-on component in the catalog, when applicable (`href` is null when the add-on is hidden). */
  damperAddon?: { id: string; name: string; href: string | null } | null;
  /** Documented mechanical throw in degrees for pedals. */
  throwDeg?: number | null;
  images: Component['images'];
  componentIds: string[];
  formerBrandNames: string[];
  handedness: string[];
  mechanics: { forceAdjustable: string; cams: string; damping: string };
  leverCount: number;
  /** Evidence used by the wizard; absent values remain unknown. */
  axes?: { name: string; sensor?: string }[];
  mount?: Component['mount'];
  /** Product family membership; resolve siblings with familyOf. */
  family?: { id: string; name: string; label: string; tier: number } | null;
}

const completeStickCategories = new Set(['stick_fixed', 'stick_combo', 'hotas_bundle', 'system']);
const twistAxis = /twist|(^|[ _-])r?z($|[ _-])|rudder/i;
const primaryAxis = /^(?:x|y|pitch|roll|yaw|rudder|throttle|collective|brake|aileron|elevator)(?:\b|[_ -])/i;

/** Detect potentiometers on the main controls, ignoring secondary twist and slider axes. */
export function usesPotentiometerPrimaryAxes(hardware: Component['hardware']): boolean {
  if (!hardware) return false;
  if (hardware.sensor?.toLowerCase() === 'potentiometer') return true;
  return hardware.axes.some((axis) => primaryAxis.test(axis.name.trim()) && axis.sensor?.toLowerCase() === 'potentiometer');
}

/** A complete stick with a documented gimbal and axes but no twist/rudder axis. Never guessed from missing data. */
export function needsPedals(category: string, members: Pick<Component, 'hardware'>[]) {
  return completeStickCategories.has(category)
    && members.some((member) => member.hardware?.gimbal_type != null && member.hardware.axes.length > 0)
    && !members.some((member) => member.hardware?.axes.some((axis) => twistAxis.test(axis.name)));
}

/** Derive pedal brake status from axis controls without guessing from missing data. */
export function derivePedalBrakes(members: Pick<Component, 'controls'>[]): { status: PedalBrakes; toeBrakeAxes: number | null } {
  const axes = members.flatMap((member) => member.controls).filter((c): c is Extract<ControlItem, { type: 'axis' }> => c.type === 'axis');
  const toeBrakeAxes = axes.filter((axis) => axis.kind === 'toe_brake').reduce((sum, axis) => sum + (axis.count ?? 1), 0);
  if (toeBrakeAxes > 0) return { status: 'toe_brakes', toeBrakeAxes };
  if (axes.some((axis) => axis.kind === 'rudder') && !axes.some((axis) => axis.kind === 'other')) return { status: 'rudder_only', toeBrakeAxes: 0 };
  return { status: 'unknown', toeBrakeAxes: null };
}

/** Resolve a serialized item without requiring another content query. */
export function resolveCatalogRegion(item: CatalogItem, region: Region, now = new Date()): CatalogItem {
  return { ...item, region, resolvedPrice: resolvePrice(item.prices, region, now) };
}

export async function loadCatalog(region: Region = 'EU', now = new Date()) {
  const { getCollection } = await import('astro:content');
  const [components, bundles, brands, mount_standards, reviewers, families] = await Promise.all([
    getCollection('components'), getCollection('bundles'),
    getCollection('brands'), getCollection('mount_standards'), getCollection('reviewers'), getCollection('families'),
  ]);
  const familyMembership = familyIndex(families);
  const reviewerNames = new Map(reviewers.map((entry) => [entry.id, entry.data.name.split(' (')[0]]));
  const componentMap = new Map(components.map((entry) => [entry.id, entry.data]));
  const bundleMap = new Map(bundles.map((entry) => [entry.id, entry.data]));
  const successors = new Map([...components, ...bundles].map(({ id, data }) => [id, resolveSuccessor(id, data, componentMap, bundleMap)]));
  const brandMap = new Map(brands.map((entry) => [entry.id, entry.data]));

  function makeItem(id: string, data: Component | Bundle, item_type: CatalogItem['item_type']): CatalogItem {
    const brand = brandMap.get(data.brand);
    if (!brand) throw new Error(`Unknown brand "${data.brand}" on ${id}`);
    const members = 'components' in data ? data.components.map((ref) => {
      const component = componentMap.get(ref);
      if (!component) throw new Error(`Bundle "${id}" references missing component "${ref}"`);
      return component;
    }) : [data];
    const addonId = members.map((member) => member.hardware?.damper_addon).find((ref): ref is string => !!ref) ?? null;
    const addon = addonId ? componentMap.get(addonId) : null;
    if (addonId && !addon) throw new Error(`Item "${id}" references missing damper_addon "${addonId}"`);
    const pedalInfo = data.category === 'pedals' ? derivePedalBrakes(members) : null;
    const stats = members.map(deriveComponentStats);
    const controlsSummary = deriveControlsSummary(members.flatMap((member) => member.controls));
    // Bundle fit is the mean of its members; never invent an editorial verdict.
    const use_case_fit = { ...members[0].use_case_fit };
    for (const key of Object.keys(use_case_fit) as (keyof UseCaseFit)[]) {
      use_case_fit[key] = members.reduce((sum, member) => sum + member.use_case_fit[key], 0) / members.length;
    }
    const hardwareValues = (field: 'sensor' | 'gimbal') => {
      const values = members.flatMap((member) => field === 'sensor'
        ? [member.hardware?.sensor, ...(member.hardware?.axes.map((axis) => axis.sensor) ?? [])]
        : [member.hardware?.gimbal]);
      return [...new Set(values.filter((value): value is string => !!value))].join(', ') || null;
    };
    const mechanical = (field: 'force_adjustable' | 'cams_swappable' | 'damping') => {
      const values = members.filter((member) => member.hardware).map((member) => {
        const raw = member.hardware?.[field];
        if (raw == null && field === 'damping' && member.hardware?.damper) {
          return member.hardware.damper === 'built_in' ? 'built-in damper' : member.hardware.damper === 'optional' ? 'optional damper' : 'none';
        }
        return raw;
      });
      return [...new Set(values.map((value) => value == null ? 'Unknown' : typeof value === 'boolean' ? value ? 'Yes' : 'No' : value.replaceAll('_', ' ')))].join(' / ') || 'Unknown';
    };
    return {
      id, slug: id, name: data.name, brand: data.brand, brandName: brand.name,
      category: data.category, item_type, status: data.status, successor: successors.get(id)?.id, verification: data.verification,
      ...(data.platform_compatibility ? { platform_compatibility: data.platform_compatibility } : {}),
      prices: data.prices, region, resolvedPrice: resolvePrice(data.prices, region, now),
      totalAxes: stats.reduce((sum, stat) => sum + stat.totalAxes, 0),
      axisCountKnown: stats.some((stat) => stat.totalAxes > 0) || members.every((member) => member.hardware?.axis_count != null),
      totalLogicalButtons: controlsSummary.totalLogicalButtons,
      hasMinistick: controlsSummary.hasMinistick, hasBrakeAxis: controlsSummary.hasBrakeAxis,
      controlsSummary, sensor: hardwareValues('sensor'), gimbal: hardwareValues('gimbal'),
      usesPotentiometers: members.some((member) => usesPotentiometerPrimaryAxes(member.hardware)),
      controlSections: members.map(({ name, category, controls, controls_evidence }) => ({ name, category, controls, ...(controls_evidence ? { controls_evidence } : {}) })),
      use_case_fit, verdict: data.verdict ?? null, scores: data.verdict?.scores ?? null,
      ...(() => {
        const review = [...data.external_reviews].sort((a, b) => b.date.localeCompare(a.date))[0];
        return { reviewTag: review?.tag ?? null, latestReview: review ? { ...review, reviewerName: reviewerNames.get(review.reviewer) ?? review.reviewer } : null };
      })(),
      gimbalType: members.map((member) => member.hardware?.gimbal_type).find((type) => type != null) ?? null,
      needsPedals: needsPedals(data.category, members),
      ...(pedalInfo ? {
        pedalBrakes: pedalInfo.status,
        toeBrakeAxes: pedalInfo.toeBrakeAxes,
        damper: members.map((member) => member.hardware?.damper).find((d) => d != null) ?? null,
        damperAddon: addonId && addon ? { id: addonId, name: addon.name, href: isListed(addon) ? `/components/${addonId}` : null } : null,
        throwDeg: members.map((member) => member.hardware?.throw_deg).find((t) => t != null) ?? null,
      } : {}),
      images: data.images, componentIds: 'components' in data ? data.components : [],
      formerBrandNames: brand.former_names,
      handedness: [...new Set(members.map((member) => member.handedness).filter((hand) => hand !== 'n/a'))],
      mechanics: { forceAdjustable: mechanical('force_adjustable'), cams: mechanical('cams_swappable'), damping: mechanical('damping') },
      leverCount: members.flatMap((member) => member.controls).reduce((sum, control) => sum + (control.type === 'lever' ? control.count : 0), 0),
      axes: members.flatMap((member) => member.hardware?.axes ?? []),
      mount: 'components' in data ? null : data.mount ?? null,
      family: (() => {
        const membership = familyMembership.get(id);
        return membership ? { id: membership.family.id, name: membership.family.data.name, label: membership.label, tier: membership.tier } : null;
      })(),
    };
  }
  const allItems = [
    ...components.map(({ id, data }) => makeItem(id, data, 'component')),
    ...bundles.map(({ id, data }) => makeItem(id, data, 'bundle')),
  ].sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  if (new Set(allItems.map((item) => item.id)).size !== allItems.length) {
    throw new Error('Catalog IDs must be unique across components and bundles.');
  }
  // Validate every record, including retained hidden family members.
  const familyErrors = validateFamilies(families, allItems);
  if (familyErrors.length) throw new Error(`Invalid product families:\n${familyErrors.join('\n')}`);
  const listedIds = new Set([...components, ...bundles].filter(({ data }) => isListed(data)).map(({ id }) => id));
  const items = allItems.filter((item) => listedIds.has(item.id));
  return { items, components, bundles, brands, mount_standards, families };
}

export async function getCatalogItems(region: Region = 'EU', now = new Date()) {
  return (await loadCatalog(region, now)).items;
}
