import { describe, expect, it } from 'vitest';
import { resolveSuccessor } from './successors';

describe('successor resolution', () => {
  const current = { name: 'New product', status: 'current' as const };
  const old = { name: 'Old product', status: 'discontinued' as const, successor: 'new' };
  it('links to either collection and accepts absent successors', () => {
    expect(resolveSuccessor('old', old, new Map([['new', current]]), new Map())?.href).toBe('/components/new');
    expect(resolveSuccessor('old', old, new Map(), new Map([['new', current]]))?.href).toBe('/bundles/new');
    expect(resolveSuccessor('new', current, new Map(), new Map())).toBeNull();
  });
  it('rejects missing, self-referencing, and non-current targets', () => {
    expect(() => resolveSuccessor('old', old, new Map(), new Map())).toThrow(/current item/);
    expect(() => resolveSuccessor('new', old, new Map([['new', current]]), new Map())).toThrow(/current item/);
    for (const status of ['discontinued', 'announced'] as const) {
      expect(() => resolveSuccessor('old', old, new Map([['new', { ...current, status }]]), new Map())).toThrow(/current item/);
    }
  });
});
