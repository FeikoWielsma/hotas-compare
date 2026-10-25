/** Missing classification means core hardware, preserving existing catalog records. */
export function isListed(data: { catalog_kind?: 'core' | 'panel' | 'accessory' | 'controller_board' }): boolean {
  return data.catalog_kind == null || data.catalog_kind === 'core';
}

/** Shared by both detail route generators; hidden YAML remains in the content collections. */
export function productPaths<T extends { id: string; data: Parameters<typeof isListed>[0] }>(entries: T[], prop: 'component' | 'bundle') {
  return entries.filter(({ data }) => isListed(data)).map(entry => ({ params: { slug: entry.id }, props: { [prop]: entry } }));
}
