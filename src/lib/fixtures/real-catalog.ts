import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { BrandSchema, BundleSchema, ComponentSchema, FamilySchema, MountStandardSchema, ReviewerSchema, SetupSchema } from '../schema';

const schemas = {
  brands: ['brands', BrandSchema], mount_standards: ['mount-standards', MountStandardSchema], reviewers: ['reviewers', ReviewerSchema],
  components: ['components', ComponentSchema], bundles: ['bundles', BundleSchema], setups: ['setups', SetupSchema], families: ['families', FamilySchema],
} as const;

/** Content collections parsed straight from the YAML, keyed like Astro's glob loader ids. Use with a mocked `astro:content`. */
export function readContentCollections(): Record<string, { id: string; data: unknown }[]> {
  const root = path.resolve(process.cwd(), 'src/content');
  return Object.fromEntries(Object.entries(schemas).map(([name, [dir, schema]]) => {
    const base = path.join(root, dir);
    const files = fs.readdirSync(base, { recursive: true }).filter((file): file is string => typeof file === 'string' && /\.ya?ml$/.test(file));
    return [name, files.map((file) => ({ id: file.replace(/\\/g, '/').replace(/\.ya?ml$/, ''), data: schema.parse(parse(fs.readFileSync(path.join(base, file), 'utf8'))) }))];
  }));
}
