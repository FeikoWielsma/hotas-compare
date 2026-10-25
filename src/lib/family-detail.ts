import type { CatalogItem } from './catalog';
import { familyOf, type FamilyEntry } from './families';
import { isSuperseded } from './successors';
import { controlTypes, inventoryCount, inventoryComplete } from './control-inventory';
import { resolvePrice } from './derive';
import { placementLabels } from './labels';
import type { Region, Component } from './schema';

export type DeskSpecs = Record<string, Component['physical']>;

export function detailFamily(item: CatalogItem, families: FamilyEntry[], items: CatalogItem[]) {
  return familyOf(item, families, items.filter(member => !isSuperseded(member)));
}

export function familyDiffRows(items: CatalogItem[], region: Region, mountNames: Record<string, string> = {}, physical: DeskSpecs = {}) {
  const row = (label: string, value: (item: CatalogItem) => string) => ({ label, values: items.map(value) });
  return [
    row('Axes', item => item.totalAxes || item.axisCountKnown ? String(item.totalAxes) : 'Not documented'),
    row('Est. button inputs', item => item.totalLogicalButtons || inventoryComplete(item.controlSections ?? []) ? `${item.totalLogicalButtons}${inventoryComplete(item.controlSections ?? []) ? '' : '+'}` : 'Not documented'),
    ...controlTypes.map(({ type, label }) => row(label, item => inventoryCount(item.controlSections ?? [], type))),
    row('Placement', item => item.placement ? placementLabels[item.placement] : 'Not documented'),
    row('Mount provides', item => item.mount?.provides ? mountNames[item.mount.provides] ?? item.mount.provides : 'Not documented'),
    row('Mount accepts', item => item.mount?.accepts?.length ? item.mount.accepts.map(id => mountNames[id] ?? id).sort().join(', ') : 'Not documented'),
    row('Dimensions (mm)', item => physical[item.id]?.dimensions_mm?.join(' \u00d7 ') ?? 'Not documented'),
    row('Weight (desk stability)', item => physical[item.id]?.weight_g != null ? `${physical[item.id]!.weight_g} g` : 'Not documented'),
    row(`Price (${region})`, item => {
      const { price, isStale } = resolvePrice(item.prices, region);
      return price ? `${new Intl.NumberFormat('en', { style: 'currency', currency: price.currency }).format(price.amount)} \u00b7 ${price.vatEstimated ? 'incl. VAT (est.)' : price.incl_vat ? 'incl. VAT' : 'excl. sales tax'}${isStale ? ' \u00b7 over 90 days old' : ''}` : 'Price unavailable';
    }),
  ].filter(row => new Set(row.values).size > 1);
}
