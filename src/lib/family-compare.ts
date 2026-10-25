import { MAX_COMPARE_ITEMS } from './compare-constants';

export interface FamilyCompareTarget {
  href: string;
  included: number;
  total: number;
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
