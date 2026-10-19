import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  BrandSchema,
  MountStandardSchema,
  ReviewerSchema,
  ComponentSchema,
  BundleSchema,
  SetupSchema,
} from './lib/schema';

export const collections = {
  brands: defineCollection({
    loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/brands' }),
    schema: BrandSchema,
  }),
  mount_standards: defineCollection({
    loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/mount-standards' }),
    schema: MountStandardSchema,
  }),
  reviewers: defineCollection({
    loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/reviewers' }),
    schema: ReviewerSchema,
  }),
  components: defineCollection({
    loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/components' }),
    schema: ComponentSchema,
  }),
  bundles: defineCollection({
    loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/bundles' }),
    schema: BundleSchema,
  }),
  setups: defineCollection({
    loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/setups' }),
    schema: SetupSchema,
  }),
};
