import { describe, expect, it } from 'vitest';
import type { z } from 'zod';
import keystaticConfig from '../../keystatic.config';
import {
  BrandSchema,
  BundleSchema,
  ComponentSchema,
  FamilySchema,
  MountStandardSchema,
  ReviewerSchema,
  SetupSchema,
} from './schema';

/**
 * Keystatic rejects keys it does not know and rewrites the whole entry on save, so a schema field
 * with no widget is silently dropped the next time anyone edits that product in the CMS. These
 * tests keep keystatic.config.ts in step with the content schemas.
 */

const collectionSchemas: Record<string, z.ZodType> = {
  components: ComponentSchema,
  bundles: BundleSchema,
  brands: BrandSchema,
  families: FamilySchema,
  setups: SetupSchema,
  mount_standards: MountStandardSchema,
  reviewers: ReviewerSchema,
};

/** Schema paths intentionally without a Keystatic widget. Each needs a reason; keys are `collection:path`. */
const schemaOnly: Record<string, string> = {};

/** Keystatic paths with no matching schema path. Each needs a reason; keys are `collection:path`. */
const keystaticOnly: Record<string, string> = {
  'brands:landed_cost_notes.EU': 'Schema is a free-form region record; the CMS offers one box per supported region.',
  'brands:landed_cost_notes.UK': 'Schema is a free-form region record; the CMS offers one box per supported region.',
  'brands:landed_cost_notes.US': 'Schema is a free-form region record; the CMS offers one box per supported region.',
  'components:physical.dimensions_mm[]': 'Schema is a fixed three-number tuple; the CMS edits it as a list of numbers.',
};

interface SchemaNode {
  /** True when an absent value is valid and no default fills it in. */
  omittable: boolean;
  /** True for leaves (including records and tuples) that Keystatic edits with a single widget. */
  leaf: boolean;
}

type ZodDef = { type: string; innerType?: z.ZodType; element?: z.ZodType; options?: z.ZodType[]; shape?: Record<string, z.ZodType>; in?: z.ZodType };
const defOf = (schema: z.ZodType) => (schema as unknown as { _zod: { def: ZodDef } })._zod.def;

/** Flattens a zod schema into `path -> node`, merging the branches of unions (the control types). */
function schemaPaths(schema: z.ZodType, prefix = '', omittable = false, out = new Map<string, SchemaNode>()) {
  const def = defOf(schema);
  switch (def.type) {
    case 'optional':
      return schemaPaths(def.innerType!, prefix, true, out);
    case 'nullable':
    case 'readonly':
    case 'nonoptional':
      return schemaPaths(def.innerType!, prefix, omittable, out);
    case 'default':
    case 'prefault':
      return schemaPaths(def.innerType!, prefix, false, out);
    case 'pipe':
      return schemaPaths(def.in!, prefix, omittable, out);
    case 'union':
      for (const option of def.options!) schemaPaths(option, prefix, omittable, out);
      return out;
    case 'array':
      if (isContainer(def.element!) && !out.has(`${prefix}[]`)) out.set(`${prefix}[]`, { omittable: true, leaf: false });
      return schemaPaths(def.element!, `${prefix}[]`, false, out);
    case 'object':
      for (const [key, child] of Object.entries(def.shape!)) {
        const path = prefix ? `${prefix}.${key}` : key;
        const before = out.get(path);
        schemaPaths(child, path, false, out);
        if (!isContainer(child)) {
          // A leaf is only free to be absent when no branch requires it.
          const node = out.get(path)!;
          const own = leafOmittable(child);
          node.omittable = before ? before.omittable && own : own;
        } else if (!out.has(path)) {
          out.set(path, { omittable: true, leaf: false });
        }
      }
      return out;
    default:
      if (prefix) out.set(prefix, { omittable, leaf: true });
      return out;
  }
}

function isContainer(schema: z.ZodType): boolean {
  const def = defOf(schema);
  if (['optional', 'nullable', 'readonly', 'nonoptional', 'default', 'prefault'].includes(def.type)) return isContainer(def.innerType!);
  if (def.type === 'pipe') return isContainer(def.in!);
  if (def.type === 'union') return def.options!.some(isContainer);
  return def.type === 'object' || def.type === 'array';
}

function leafOmittable(schema: z.ZodType): boolean {
  const def = defOf(schema);
  if (def.type === 'default' || def.type === 'prefault') return false;
  if (def.type === 'optional') return true;
  if (def.type === 'nullable' || def.type === 'readonly' || def.type === 'nonoptional') return leafOmittable(def.innerType!);
  if (def.type === 'pipe') return leafOmittable(def.in!);
  return false;
}

type KeystaticField = {
  kind: string;
  fields?: Record<string, KeystaticField>;
  element?: KeystaticField;
  defaultValue?: () => unknown;
  serialize?: (value: unknown) => { value: unknown };
};

function keystaticPaths(field: KeystaticField, prefix = '', out = new Map<string, KeystaticField>()) {
  if (field.kind === 'object') {
    for (const [key, child] of Object.entries(field.fields!)) {
      const path = prefix ? `${prefix}.${key}` : key;
      out.set(path, child);
      keystaticPaths(child, path, out);
    }
  } else if (field.kind === 'array') {
    const path = `${prefix}[]`;
    out.set(path, field.element!);
    keystaticPaths(field.element!, path, out);
  }
  return out;
}

const collections = keystaticConfig.collections as unknown as Record<string, { schema: Record<string, KeystaticField> }>;
const cmsPaths = (name: string) => keystaticPaths({ kind: 'object', fields: collections[name].schema });

describe('Keystatic config matches the content schemas', () => {
  it('covers every collection that has a content schema', () => {
    expect(Object.keys(collections).sort()).toEqual(Object.keys(collectionSchemas).sort());
  });

  for (const [name, schema] of Object.entries(collectionSchemas)) {
    describe(name, () => {
      const zod = schemaPaths(schema);
      const cms = cmsPaths(name);

      it('has a widget for every schema field (or an explained omission)', () => {
        const missing = [...zod.keys()].filter((path) => !cms.has(path) && !(`${name}:${path}` in schemaOnly));
        expect(missing, `Add these to keystatic.config.ts or schemaOnly with a reason`).toEqual([]);
      });

      it('has no widget the schema would discard (or an explained extra)', () => {
        const extra = [...cms.keys()].filter((path) => !zod.has(path) && !(`${name}:${path}` in keystaticOnly));
        expect(extra, `Remove these from keystatic.config.ts or keystaticOnly with a reason`).toEqual([]);
      });

      it('does not write a value for an optional field the editor left unset', () => {
        const writesDefault = [...zod]
          .filter(([path, node]) => node.leaf && node.omittable && cms.get(path)?.kind === 'form')
          .filter(([path]) => {
            const field = cms.get(path)!;
            return field.serialize!(field.defaultValue!()).value !== undefined;
          })
          .map(([path]) => path);
        expect(writesDefault, 'These optional fields would be written on every save; wrap them in optionalSelect/optionalBoolean').toEqual([]);
      });
    });
  }

  it('documents only allowlist entries that still apply', () => {
    for (const [allowlist, label] of [[schemaOnly, 'schemaOnly'], [keystaticOnly, 'keystaticOnly']] as const) {
      for (const [key, reason] of Object.entries(allowlist)) {
        const [name, path] = key.split(':');
        const present = label === 'schemaOnly' ? schemaPaths(collectionSchemas[name]).has(path) && !cmsPaths(name).has(path)
          : cmsPaths(name).has(path) && !schemaPaths(collectionSchemas[name]).has(path);
        expect(present, `${label} entry ${key} is stale`).toBe(true);
        expect(reason.length, `${label} entry ${key} needs a reason`).toBeGreaterThan(10);
      }
    }
  });

  it('round-trips explicit false and null-free values through the optional widgets', () => {
    const schema = collections.components.schema;
    const soldStandalone = schema.sold_standalone as Required<KeystaticField> & { parse: (value: unknown) => string };
    expect(soldStandalone.serialize(soldStandalone.parse(undefined))).toEqual({ value: undefined });
    expect(soldStandalone.serialize(soldStandalone.parse(false))).toEqual({ value: false });
    expect(soldStandalone.serialize(soldStandalone.parse(true))).toEqual({ value: true });
    const placement = schema.placement as Required<KeystaticField> & { parse: (value: unknown) => string };
    expect(placement.serialize(placement.parse(undefined))).toEqual({ value: undefined });
    expect(placement.serialize(placement.parse('desk'))).toEqual({ value: 'desk' });
  });
});
