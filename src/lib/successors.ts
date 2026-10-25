import type { Bundle, Component } from './schema';

type Product = Pick<Component | Bundle, 'name' | 'status' | 'successor'>;

/** Successors share the catalog's globally unique component/bundle IDs. */
export function resolveSuccessor(owner: string, product: Product, components: Map<string, Product>, bundles: Map<string, Product>) {
  if (!product.successor) return null;
  const id = product.successor;
  const component = components.get(id);
  const target = component ?? bundles.get(id);
  if (id === owner || !target || target.status !== 'current') {
    throw new Error(`"${owner}" successor "${id}" must resolve to a different current item`);
  }
  return { id, name: target.name, href: `/${component ? 'components' : 'bundles'}/${id}` };
}

export function isSuperseded(product: Pick<Product, 'status' | 'successor'>) {
  return product.status === 'discontinued' && !!product.successor;
}
