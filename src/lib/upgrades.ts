import { isListed } from './visibility';
import { checkMountCompatibility } from './derive';
import { isSuperseded, resolveSuccessor } from './successors';
import type { Bundle, Component, MountStandard, ReviewTag, UpgradePath } from './schema';

export interface LinkedItem { id: string; name: string; href: string; reviewTag: ReviewTag | null }
export interface ResolvedUpgrade extends Omit<LinkedItem, 'href'> { href: string | null; note: string; source?: string }

const latestTag = (data: Component | Bundle): ReviewTag | null =>
  [...data.external_reviews].sort((a, b) => b.date.localeCompare(a.date))[0]?.tag ?? null;

/** Resolve curated upgrade targets; a missing target is a content error, like a missing bundle member. */
export function resolveUpgradePaths(
  owner: string, paths: UpgradePath[], components: Map<string, Component>, bundles: Map<string, Bundle>,
): ResolvedUpgrade[] {
  return paths.filter((path) => {
    const target = components.get(path.to) ?? bundles.get(path.to);
    return !target || !isSuperseded(target) || !resolveSuccessor(path.to, target, components, bundles);
  }).map((path) => {
    const component = components.get(path.to), bundle = bundles.get(path.to);
    const data = component ?? bundle;
    if (!data) throw new Error(`"${owner}" has an upgrade path to missing item "${path.to}"`);
    return { id: path.to, name: data.name, href: isListed(data) ? `/${component ? 'components' : 'bundles'}/${path.to}` : null, reviewTag: latestTag(data), note: path.note, ...(path.source ? { source: path.source } : {}) };
  });
}

/** Grips and yoke handles that need a base; a desk-mounted yoke is complete on its own. */
const mountsOnBase = (item: Component) => (item.category === 'grip' || item.category === 'yoke') && !!item.mount?.provides && item.mount.provides !== 'desk';

const tagOrder: Record<string, number> = { recommended: 0, mixed: 2, neutral: 2, avoid: 3 };

/** Grips that fit a base, or bases that fit a grip, via documented mount standards. Recommended first. */
export function compatibleParts(
  item: Component, components: Map<string, Component>, standards: Map<string, MountStandard>,
): { kind: 'grips' | 'handles' | 'bases'; items: LinkedItem[] } | null {
  const isBase = item.category === 'base' && (item.mount?.accepts?.length ?? 0) > 0;
  const isGrip = mountsOnBase(item);
  if (!isBase && !isGrip) return null;
  // checkMountCompatibility only knows sticks, so compare yoke handles' mounts directly.
  const fits = (base: Component, handle: Component) => handle.category === 'grip'
    ? checkMountCompatibility(base, handle, standards).compatible
    : !!handle.mount?.provides && (base.mount?.accepts ?? []).includes(handle.mount.provides);
  const items = [...components].filter(([, other]) => isListed(other) && other.status !== 'discontinued' && (isBase
    ? mountsOnBase(other) && fits(item, other)
    : other.category === 'base' && fits(other, item)))
    .map(([id, data]) => ({ id, name: data.name, href: `/components/${id}`, reviewTag: latestTag(data) }))
    .sort((a, b) => (tagOrder[a.reviewTag ?? ''] ?? 1) - (tagOrder[b.reviewTag ?? ''] ?? 1) || a.name.localeCompare(b.name));
  return { kind: isBase ? (items.every(({ id }) => components.get(id)?.category === 'yoke') && items.length ? 'handles' : 'grips') : 'bases', items };
}
