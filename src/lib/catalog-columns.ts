import type { CatalogItem } from './catalog';
import type { GimbalType, UseCase } from './schema';
import { contactless, itemCategoryLabel } from './catalog-ui';
import { gimbalLabels } from './glossary';
import { humanize } from './labels';
import { platforms } from './platforms';

/** Flying styles in the order the catalog offers them, with the short labels cards and table headers use. */
export const flyingStyles: { key: UseCase; label: string; short: string }[] = [
  { key: 'modern_jet', label: 'Modern jet', short: 'Jet' },
  { key: 'space_hotas', label: 'Space HOTAS', short: 'HOTAS' },
  { key: 'space_hosas', label: 'Space HOSAS', short: 'HOSAS' },
  { key: 'heli', label: 'Helicopter', short: 'Heli' },
  { key: 'ga', label: 'GA', short: 'GA' },
  { key: 'airliner', label: 'Airliner', short: 'Airliner' },
  { key: 'ww2', label: 'WWII', short: 'WWII' },
];

/** Gimbal quality ladder for the card badge; `other` has no place on it. */
export const gimbalRank: Partial<Record<GimbalType, number>> = { ball_and_cup: 1, pincer: 2, cam_and_spring: 3, force_feedback: 4 };

/** The item's strongest flying styles, best first; ties keep the catalog's style order. */
export function bestFits(item: Pick<CatalogItem, 'use_case_fit'>, count = 2): UseCase[] {
  return flyingStyles.map(({ key }, index) => ({ key, index, value: item.use_case_fit[key] }))
    .sort((a, b) => b.value - a.value || a.index - b.index).slice(0, count).map(({ key }) => key);
}

export function sensorLabel(item: CatalogItem): string | null {
  if (item.usesPotentiometers) return 'Potentiometer';
  if (contactless(item)) return 'Contactless';
  const first = item.sensor?.split(', ')[0];
  return first && !/^none/i.test(first) ? humanize(first) : null;
}

const count = (value: number, known = value > 0) => known ? String(value) : null;
const yesNo = (value: boolean) => value ? 'Yes' : 'No';
const supported = (item: CatalogItem) => platforms.filter(({ key }) => item.platform_compatibility?.[key] === 'supported').map(({ label }) => label).join(' · ') || null;
const onlyLeft = (item: CatalogItem) => item.handedness.length === 1 && item.handedness[0] === 'left';
const hand = (item: CatalogItem) => item.handedness.map((h) => h === 'ambi' ? 'Ambi' : h === 'left' ? 'Left' : 'Right').join(' / ') || null;
const brakes = (item: CatalogItem) => item.pedalBrakes === 'toe_brakes' ? 'Toe brakes' : item.pedalBrakes === 'rudder_only' ? 'Rudder only' : null;
const damper = (item: CatalogItem) => item.damper === 'built_in' ? 'Built-in' : item.damper === 'optional' ? 'Optional' : item.damper === 'none' ? 'None' : null;
const levers = (item: CatalogItem) => item.leverCount > 0 ? `${item.leverCount} ${item.leverCount === 1 ? 'lever' : 'levers'}` : null;
const placement = (item: CatalogItem) => item.placement === 'mount_only' ? 'Mount only' : item.placement === 'desk' ? 'Desk' : item.placement === 'both' ? 'Desk or mount' : null;
export const gimbalLabel = (item: CatalogItem) => item.gimbalType ? gimbalLabels[item.gimbalType] : null;

/** One short line of the specs that matter for this kind of hardware. Gimbal has its own badge, so it is left out. */
export function cardFacts(item: CatalogItem): string {
  const sensor = sensorLabel(item);
  const axes = item.totalAxes > 0 ? `${item.totalAxes} ${item.totalAxes === 1 ? 'axis' : 'axes'}` : null;
  const inputs = item.totalLogicalButtons > 0 ? `${item.totalLogicalButtons} inputs` : null;
  let parts: (string | null | false | undefined)[];
  switch (item.category) {
    case 'pedals': parts = [brakes(item), item.damper === 'built_in' && 'Damper', item.damper === 'optional' && 'Damper optional', item.throwDeg != null && `${item.throwDeg}° throw`, sensor]; break;
    case 'throttle': case 'quadrant': parts = [levers(item), inputs, sensor]; break;
    case 'grip': parts = [inputs, item.hasMinistick && 'Ministick', onlyLeft(item) && 'Left hand']; break;
    case 'base': parts = [sensor, item.placement === 'mount_only' && 'Mount required']; break;
    case 'module': parts = [inputs]; break;
    default: parts = [axes, inputs, item.needsPedals && 'No twist', sensor, onlyLeft(item) && 'Left hand'];
  }
  return parts.filter(Boolean).join(' · ');
}

export interface SpecColumn { label: string; value: (item: CatalogItem) => string | null; gimbal?: true }

const gimbalColumn: SpecColumn = { label: 'Gimbal', value: gimbalLabel, gimbal: true };
const columns = {
  type: { label: 'Type', value: itemCategoryLabel },
  axes: { label: 'Axes', value: (item) => count(item.totalAxes, item.totalAxes > 0 || !!item.axisCountKnown) },
  inputs: { label: 'Inputs', value: (item) => count(item.totalLogicalButtons) },
  ministick: { label: 'Ministick', value: (item) => yesNo(item.hasMinistick) },
  sensors: { label: 'Sensors', value: sensorLabel },
  hand: { label: 'Hand', value: hand },
  platforms: { label: 'Platforms', value: supported },
  levers: { label: 'Levers', value: (item) => count(item.leverCount) },
  brakes: { label: 'Brakes', value: brakes },
  damper: { label: 'Damper', value: damper },
  throw: { label: 'Throw', value: (item) => item.throwDeg != null ? `${item.throwDeg}°` : null },
  placement: { label: 'Placement', value: placement },
} satisfies Record<string, SpecColumn>;

/** Table columns per catalog category tab: the specs people compare within that kind of hardware. */
export const tableColumns: Record<string, SpecColumn[]> = {
  All: [columns.type, gimbalColumn, columns.sensors, columns.platforms],
  'Sticks & Combos': [gimbalColumn, columns.axes, columns.inputs, columns.ministick, columns.sensors, columns.hand],
  Throttles: [columns.levers, columns.axes, columns.inputs, columns.ministick, columns.sensors],
  Bases: [gimbalColumn, columns.sensors, columns.placement, columns.platforms],
  Grips: [columns.inputs, columns.ministick, columns.hand, columns.platforms],
  Pedals: [columns.brakes, columns.damper, columns.throw, columns.sensors, columns.platforms],
  Yokes: [columns.type, columns.axes, columns.inputs, columns.sensors, columns.platforms],
  Quadrants: [columns.levers, columns.axes, columns.sensors, columns.platforms],
  Modules: [columns.inputs, columns.platforms],
};
