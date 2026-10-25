import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'yaml';
import { BundleSchema, ComponentSchema, FamilySchema } from '../src/lib/schema.ts';

export function contentFiles(dir = 'src/content'): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = join(dir, entry.name);
    return entry.isDirectory() ? contentFiles(file) : /\.ya?ml$/.test(file) ? [file] : [];
  });
}

export function readContent(file: string) {
  return parse(readFileSync(file, 'utf8'));
}

export function products() {
  return (['components', 'bundles'] as const).flatMap(collection => contentFiles(`src/content/${collection}`).map(file => ({
    file,
    collection,
    id: relative(`src/content/${collection}`, file).replaceAll('\\', '/').replace(/\.ya?ml$/, ''),
    data: (collection === 'components' ? ComponentSchema : BundleSchema).parse(readContent(file)),
  })));
}

export function families() {
  return contentFiles('src/content/families').map(file => ({
    file,
    id: relative('src/content/families', file).replaceAll('\\', '/').replace(/\.ya?ml$/, ''),
    data: FamilySchema.parse(readContent(file)),
  }));
}

export function urls(value: unknown): string[] {
  if (typeof value === 'string') return /^https?:\/\//i.test(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(urls);
  if (value && typeof value === 'object') return Object.values(value).flatMap(urls);
  return [];
}
