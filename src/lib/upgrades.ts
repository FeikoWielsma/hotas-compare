import { checkMountCompatibility } from './derive';
import type { Bundle, Component, MountStandard, ReviewTag, UpgradePath } from './schema';

export interface LinkedItem { id: string; name: string; href: string; reviewTag: ReviewTag | null }
export interface ResolvedUpgrade extends LinkedItem { note: string; source?: string }

const latestTag = (data: Component | Bundle): ReviewTag | null =>
  [...data.external_reviews].sort((a, b) => b.date.localeCompare(a.date))[0]?.tag ?? null;

/** Resolve curated upgrade targets; a missing target is a content error, like a missing bundle member. */
export function resolveUpgradePaths(
  owner: string, paths: UpgradePath[], components: Map<string, Component>, bundles: Map<string, Bundle>,
): ResolvedUpgrade[] {
  return paths.map((path) => {
    const component = components.get(path.to), bundle = bundles.get(path.to);
    const data = component ?? bundle;
    if (!data) throw new Error(`"${owner}" has an upgrade path to missing item "${path.to}"`);
    return { id: path.to, name: data.name, href: `/${component ? 'components' : 'bundles'}/${path.to}`, reviewTag: latestTag(data), note: path.note, ...(path.source ? { source: path.source } : {}) };
  });
}

const tagOrder: Record<string, number> = { recommended: 0, mixed: 2, neutral: 2, avoid: 3 };

/** Grips that fit a base, or bases that fit a grip, via documented mount standards. Recommended first. */
export function compatibleParts(
  item: Component, components: Map<string, Component>, standards: Map<string, MountStandard>,
): { kind: 'grips' | 'bases'; items: LinkedItem[] } | null {
  const isBase = item.category === 'base' && (item.mount?.accepts?.length ?? 0) > 0;
  const isGrip = item.category === 'grip' && !!item.mount?.provides;
  if (!isBase && !isGrip) return null;
  const items = [...components].filter(([, other]) => other.status !== 'discontinued' && (isBase
    ? other.category === 'grip' && checkMountCompatibility(item, other, standards).compatible
    : other.category === 'base' && checkMountCompatibility(other, item, standards).compatible))
    .map(([id, data]) => ({ id, name: data.name, href: `/components/${id}`, reviewTag: latestTag(data) }))
    .sort((a, b) => (tagOrder[a.reviewTag ?? ''] ?? 1) - (tagOrder[b.reviewTag ?? ''] ?? 1) || a.name.localeCompare(b.name));
  return { kind: isBase ? 'grips' : 'bases', items };
}
