import type { CatalogItem } from './catalog';
import { contactless, overallScore } from './catalog-ui';

export interface CatalogFilters {
  search?: string;
  categories?: string[];
  brands?: string[];
  minimum?: number;
  maximum?: number;
  ministick?: boolean;
  brake?: boolean;
  sensors?: boolean;
  fit?: string;
  minimumFit?: number;
  handedness?: string;
  minimumAxes?: number;
  minimumInputs?: number;
  itemType?: string;
  priceAvailability?: string;
  sort?: string;
}

/** Filter a regional catalog projection. Unknown counts cannot meet a positive minimum. */
export function filterCatalog(items: CatalogItem[], filters: CatalogFilters = {}): CatalogItem[] {
  const query = (filters.search ?? '').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const meetsMinimum = (count: number, minimum?: number) => minimum == null || minimum <= 0 || (Number.isFinite(count) && count > 0 && count >= minimum);
  return items.filter((item) => {
    const text = [item.name, item.brandName, item.brand, ...item.formerBrandNames, item.category.replaceAll('_', ' '), item.sensor ?? '', item.gimbal ?? '', item.item_type, item.hasMinistick ? 'ministick' : '', item.hasBrakeAxis ? 'brake' : ''].join(' ').toLocaleLowerCase();
    const amount = item.resolvedPrice.price?.amount;
    const fit = filters.fit === 'ga_airliner' ? Math.max(item.use_case_fit.ga, item.use_case_fit.airliner) : item.use_case_fit[filters.fit as keyof CatalogItem['use_case_fit']] ?? 0;
    return query.every((word) => text.includes(word))
      && (!filters.categories?.length || filters.categories.includes(item.category))
      && (!filters.brands?.length || filters.brands.includes(item.brand))
      && (filters.minimum == null || (amount != null && amount >= filters.minimum))
      && (filters.maximum == null || (amount != null && amount <= filters.maximum))
      && (!filters.ministick || item.hasMinistick) && (!filters.brake || item.hasBrakeAxis)
      && (!filters.sensors || contactless(item)) && (!filters.fit || fit >= (filters.minimumFit ?? 4))
      && (!filters.handedness || item.handedness.includes(filters.handedness))
      && meetsMinimum(item.totalAxes, filters.minimumAxes) && meetsMinimum(item.totalLogicalButtons, filters.minimumInputs)
      && (!filters.itemType || item.item_type === filters.itemType)
      && (!filters.priceAvailability || (filters.priceAvailability === 'available' ? amount != null : amount == null));
  }).sort((a, b) => {
    let result = 0;
    if (filters.sort?.startsWith('price')) {
      const ap = a.resolvedPrice.price?.amount, bp = b.resolvedPrice.price?.amount;
      result = ap == null ? bp == null ? 0 : 1 : bp == null ? -1 : filters.sort === 'price-low' ? ap - bp : bp - ap;
    } else if (filters.sort === 'buttons') result = b.totalLogicalButtons - a.totalLogicalButtons;
    else if (filters.sort === 'axes') result = b.totalAxes - a.totalAxes;
    else if (filters.sort === 'score') result = (overallScore(b) ?? -1) - (overallScore(a) ?? -1);
    return result || a.name.localeCompare(b.name);
  });
}
