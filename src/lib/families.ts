import type { Family } from './schema';

export interface FamilyEntry { id: string; data: Family }

/** The minimum an item needs to take part in a family; CatalogItem satisfies it. */
export interface FamilyItem { id: string; brand?: string; handedness?: readonly string[] }

export interface FamilyMember<T> {
  id: string;
  label: string;
  /** Position of this member's label along the family axis, from 0. */
  tier: number;
  item: T;
}

export interface FamilyTier<T> { label: string; members: FamilyMember<T>[] }

export interface FamilyView<T> {
  id: string;
  name: string;
  brand: string;
  axis: string;
  description?: string;
  /** Every listed member present in the supplied items, in family order, including the current item. */
  members: FamilyMember<T>[];
  /** Members grouped by label, in family order. */
  tiers: FamilyTier<T>[];
  current: FamilyMember<T>;
  /** All members other than the current item, in family order. */
  siblings: FamilyMember<T>[];
  /**
   * One member per tier, in order, for a sibling switcher or diff table: the current item for its
   * own tier, elsewhere the member with the current item's handedness (else the first member).
   */
  lineup: FamilyMember<T>[];
}

/** Family membership per item ID. */
export function familyIndex(families: FamilyEntry[]) {
  const index = new Map<string, { family: FamilyEntry; label: string; tier: number }>();
  for (const family of families) {
    const labels = [...new Set(family.data.members.map((member) => member.label))];
    for (const member of family.data.members) index.set(member.id, { family, label: member.label, tier: labels.indexOf(member.label) });
  }
  return index;
}

const sameHand = (a: FamilyItem, b: FamilyItem) => [...(a.handedness ?? [])].sort().join('/') === [...(b.handedness ?? [])].sort().join('/');

/**
 * The family an item belongs to, with its members resolved against `items`. Members absent from
 * `items` (e.g. filtered out) are left out; the current item is always kept. Null when the item
 * belongs to no family.
 */
export function familyOf<T extends FamilyItem>(item: T, families: FamilyEntry[], items: T[]): FamilyView<T> | null {
  const family = families.find((entry) => entry.data.members.some((member) => member.id === item.id));
  if (!family) return null;
  const byId = new Map(items.map((entry) => [entry.id, entry]));
  byId.set(item.id, item);
  const labels = [...new Set(family.data.members.map((member) => member.label))];
  const members = family.data.members.flatMap(({ id, label }) => {
    const resolved = byId.get(id);
    return resolved ? [{ id, label, tier: labels.indexOf(label), item: resolved }] : [];
  });
  const current = members.find((member) => member.id === item.id)!;
  const tiers = labels.map((label) => ({ label, members: members.filter((member) => member.label === label) })).filter((tier) => tier.members.length);
  const lineup = tiers.map((tier) => tier.label === current.label ? current : tier.members.find((member) => sameHand(member.item, item)) ?? tier.members[0]);
  return {
    id: family.id, name: family.data.name, brand: family.data.brand, axis: family.data.axis,
    ...(family.data.description ? { description: family.data.description } : {}),
    members, tiers, current, siblings: members.filter((member) => member !== current), lineup,
  };
}

/** Integrity problems: unknown or duplicated members, cross-brand members, and hand twins that do not differ by hand. */
export function validateFamilies(families: FamilyEntry[], items: FamilyItem[]): string[] {
  const errors: string[] = [];
  const byId = new Map(items.map((item) => [item.id, item]));
  const owner = new Map<string, string>();
  for (const { id, data } of families) {
    for (const member of data.members) {
      const item = byId.get(member.id);
      if (!item) errors.push(`${id}: unknown member ${member.id}`);
      else if (item.brand != null && item.brand !== data.brand) errors.push(`${id}: member ${member.id} is brand ${item.brand}, not ${data.brand}`);
      const previous = owner.get(member.id);
      if (previous) errors.push(`${id}: ${member.id} is already a member of ${previous}`);
      else owner.set(member.id, id);
    }
    const labels = new Set(data.members.map((member) => member.label));
    if (labels.size < 2) errors.push(`${id}: needs at least two distinct labels`);
    for (const label of labels) {
      const twins = data.members.filter((member) => member.label === label).map((member) => byId.get(member.id)).filter((item) => item != null);
      for (let i = 0; i < twins.length; i++) for (const other of twins.slice(i + 1)) {
        if (sameHand(twins[i], other)) errors.push(`${id}: ${twins[i].id} and ${other.id} share label "${label}" but not a distinct handedness`);
      }
    }
  }
  return errors;
}
