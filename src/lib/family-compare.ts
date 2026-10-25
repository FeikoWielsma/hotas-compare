import { MAX_COMPARE_ITEMS } from './compare-constants';
import { handOf } from './catalog-filter';

interface FamilyCompareMember {
  id: string;
  name: string;
  handedness: string[];
  family?: { id: string; label: string; tier: number } | null;
}

export interface FamilyCompareTarget {
  href: string;
  included: number;
  total: number;
}

/** Build the same one-member-per-tier, hand-matched lineup used on family detail pages. */
export function familyCompareLineup<T extends FamilyCompareMember>(members: readonly T[], familyId: string, currentId: string): T[] {
  const familyMembers = members.filter((member) => member.family?.id === familyId);
  const current = familyMembers.find((member) => member.id === currentId);
  if (!current) return [];
  const labels = [...new Map(familyMembers.map((member) => [member.family!.label, member.family!.tier])).entries()]
    .sort((a, b) => a[1] - b[1]).map(([label]) => label);
  return labels.flatMap((label) => {
    const candidates = familyMembers.filter((member) => member.family!.label === label)
      .sort((a, b) => a.family!.tier - b.family!.tier);
    const selected = candidates.find((member) => member.id === current.id)
      ?? candidates.find((member) => handOf(member) === handOf(current))
      ?? candidates[0];
    return selected ? [selected] : [];
  });
}

/** Build the comparison URL for the first family lineup members that fit the compare limit. */
export function familyCompareTarget(memberIds: readonly string[]): FamilyCompareTarget {
  const ids = [...new Set(memberIds)].slice(0, MAX_COMPARE_ITEMS);
  return {
    href: `/compare?${new URLSearchParams({ items: ids.join(',') })}`,
    included: ids.length,
    total: new Set(memberIds).size,
  };
}
