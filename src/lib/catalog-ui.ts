import type { CatalogItem } from './catalog';
import type { Region, UseCase } from './schema';
import { resolvePrice } from './derive';

/** Client-safe regional projection: do not import the content loader into islands. */
export function resolveItemRegion(item: CatalogItem, region: Region): CatalogItem {
  return { ...item, region, resolvedPrice: resolvePrice(item.prices, region) };
}

export const categoryLabels: Record<CatalogItem['category'], string> = {
  base: 'Base', grip: 'Grip', stick_fixed: 'Stick', throttle: 'Throttle', quadrant: 'Quadrant',
  yoke: 'Yoke', pedals: 'Pedals', module: 'Module', hotas_bundle: 'HOTAS Bundle',
  hosas_bundle: 'HOSAS Bundle', stick_combo: 'Stick Combo', yoke_bundle: 'Yoke Bundle', system: 'System',
};
export const useCases: { key: UseCase; label: string }[] = [
  { key: 'modern_jet', label: 'Modern Jet' }, { key: 'space_hosas', label: 'Space HOSAS' },
  { key: 'space_hotas', label: 'Space HOTAS' }, { key: 'heli', label: 'Helicopter' },
  { key: 'ga', label: 'General Aviation' }, { key: 'airliner', label: 'Airliner' }, { key: 'ww2', label: 'WWII' },
];
export function detailHref(item: CatalogItem) {
  return `/${item.item_type === 'component' ? 'components' : 'bundles'}/${item.id}`;
}
/** Public URL for a stored product photo. Bare filenames live under /images/. */
export function productImageSrc(file?: string | null): string | null {
  if (!file) return null;
  return file.startsWith('/') ? file : `/images/${file}`;
}
export function formatAmount(item: CatalogItem) {
  const price = item.resolvedPrice.price;
  return price ? new Intl.NumberFormat('en', { style: 'currency', currency: price.currency }).format(price.amount) : 'Price unavailable';
}
export function overallScore(item: CatalogItem): number | null {
  return item.scores ? Object.values(item.scores).reduce((a, b) => a + b, 0) / Object.values(item.scores).length : null;
}
export function contactless(item: CatalogItem) {
  return /hall|magnet|contactless|mars|m\.a\.r\.s|optical|induct|load.cell/i.test(item.sensor ?? '') && !/potentiometer/i.test(item.sensor ?? '');
}

/**
 * Trim an item to what catalog cards and filters read, so pages that render many cards
 * do not serialize full inventories, verdict text and evidence into island props.
 */
export function cardItem(item: CatalogItem): CatalogItem {
  return {
    ...item,
    controlSections: item.controlSections?.map((section) => ({
      name: section.name, category: section.category,
      controls: section.controls.map(({ type, count }) => ({ type, count })) as typeof section.controls,
      ...(section.controls_evidence ? { controls_evidence: { coverage: section.controls_evidence.coverage } as typeof section.controls_evidence } : {}),
    })),
    verdict: null,
    ...(item.platform_compatibility ? { platform_compatibility: { pc: item.platform_compatibility.pc, xbox: item.platform_compatibility.xbox, ps5: item.platform_compatibility.ps5, sources: [] } } : {}),
    images: item.images.slice(0, 1),
    axes: undefined, mount: undefined,
  };
}
