import { z } from 'zod';

export const RegionEnum = z.enum(['EU', 'UK', 'US']);
export type Region = z.infer<typeof RegionEnum>;

export const CurrencyEnum = z.enum(['EUR', 'GBP', 'USD']);
export type Currency = z.infer<typeof CurrencyEnum>;

export const ComponentCategoryEnum = z.enum([
  'base',
  'grip',
  'stick_fixed',
  'throttle',
  'quadrant',
  'yoke',
  'pedals',
  'module',
]);
export type ComponentCategory = z.infer<typeof ComponentCategoryEnum>;

export const BundleCategoryEnum = z.enum([
  'hotas_bundle',
  'hosas_bundle',
  'stick_combo',
  'yoke_bundle',
  'system',
]);
export type BundleCategory = z.infer<typeof BundleCategoryEnum>;

export const ProductStatusEnum = z.enum(['current', 'discontinued', 'announced']);
export type ProductStatus = z.infer<typeof ProductStatusEnum>;

export const HandednessEnum = z.enum(['left', 'right', 'ambi', 'n/a']);
export type Handedness = z.infer<typeof HandednessEnum>;

export const VerificationStatusEnum = z.enum(['draft', 'verified']);
export type VerificationStatus = z.infer<typeof VerificationStatusEnum>;

export const ReviewTagEnum = z.enum(['recommended', 'mixed', 'avoid', 'neutral']);
export type ReviewTag = z.infer<typeof ReviewTagEnum>;

export const UseCaseEnum = z.enum([
  'modern_jet',
  'heli',
  'ww2',
  'ga',
  'airliner',
  'space_hotas',
  'space_hosas',
]);
export type UseCase = z.infer<typeof UseCaseEnum>;

export const BudgetTierEnum = z.enum(['budget', 'mid', 'high_end', 'enthusiast']);
export type BudgetTier = z.infer<typeof BudgetTierEnum>;

// Controls Schema
export const TriggerControlSchema = z.object({
  type: z.literal('trigger'),
  stages: z.number().int().min(1).default(1),
  flip: z.boolean().optional(),
  label: z.string().optional(),
});

export const HatControlSchema = z.object({
  type: z.literal('hat'),
  ways: z.number().int().min(2).max(8).default(4),
  push: z.boolean().default(false),
  count: z.number().int().min(1).default(1),
  label: z.string().optional(),
});

export const MinistickControlSchema = z.object({
  type: z.literal('analog_ministick'),
  push: z.boolean().default(true),
  count: z.number().int().min(1).default(1),
  label: z.string().optional(),
});

export const ButtonControlSchema = z.object({
  type: z.literal('button'),
  count: z.number().int().min(1).default(1),
  label: z.string().optional(),
  backlit: z.boolean().optional(),
});

export const LeverControlSchema = z.object({
  type: z.literal('lever'),
  kind: z.enum(['brake', 'throttle_single', 'throttle_dual', 'flap', 'speedbrake', 'other']).default('other'),
  analog: z.boolean().default(true),
  count: z.number().int().min(1).default(1),
  label: z.string().optional(),
});

export const EncoderControlSchema = z.object({
  type: z.literal('encoder'),
  count: z.number().int().min(1).default(1),
  push: z.boolean().optional(),
  label: z.string().optional(),
});

export const ToggleControlSchema = z.object({
  type: z.literal('toggle'),
  count: z.number().int().min(1).default(1),
  ways: z.number().int().min(2).max(3).default(2),
  momentary: z.boolean().optional(),
  label: z.string().optional(),
});

export const SliderControlSchema = z.object({
  type: z.literal('slider'),
  count: z.number().int().min(1).default(1),
  center_detent: z.boolean().optional(),
  label: z.string().optional(),
});

export const DetentControlSchema = z.object({
  type: z.literal('detent'),
  count: z.number().int().min(1).default(1),
  customizable: z.boolean().optional(),
  label: z.string().optional(),
});

export const RockerControlSchema = z.object({
  type: z.literal('rocker'),
  count: z.number().int().min(1).default(1),
  push: z.boolean().optional(),
  label: z.string().optional(),
});

export const RotaryControlSchema = z.object({
  type: z.literal('rotary'),
  count: z.number().int().min(1).default(1),
  label: z.string().optional(),
});

export const ControlItemSchema = z.discriminatedUnion('type', [
  TriggerControlSchema,
  HatControlSchema,
  MinistickControlSchema,
  ButtonControlSchema,
  LeverControlSchema,
  EncoderControlSchema,
  ToggleControlSchema,
  SliderControlSchema,
  DetentControlSchema,
  RockerControlSchema,
  RotaryControlSchema,
]);
export type ControlItem = z.infer<typeof ControlItemSchema>;

// Price Schema
export const PriceSchema = z.object({
  region: RegionEnum,
  currency: CurrencyEnum,
  amount: z.number().nonnegative(),
  incl_vat: z.boolean().default(true),
  store: z.string(),
  url: z.string().url().optional(),
  verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  source: z.enum(['manual', 'feed']).default('manual'),
});
export type Price = z.infer<typeof PriceSchema>;

// Verdict Schema
export const VerdictScoreSchema = z.object({
  build: z.number().min(1).max(5),
  feel: z.number().min(1).max(5),
  value: z.number().min(1).max(5),
  software: z.number().min(1).max(5),
  qc_support: z.number().min(1).max(5),
});

export const VerdictSchema = z.object({
  author: z.string(),
  hands_on: z.boolean().default(false),
  owned_hours: z.number().int().nonnegative().optional(),
  take: z.string(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  great_for: z.array(z.string()).default([]),
  skip_if: z.array(z.string()).default([]),
  scores: VerdictScoreSchema,
});
export type Verdict = z.infer<typeof VerdictSchema>;

// External Review Schema
export const ExternalReviewSchema = z.object({
  reviewer: z.string(),
  url: z.string().url(),
  summary: z.string(),
  tag: ReviewTagEnum,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
});
export type ExternalReview = z.infer<typeof ExternalReviewSchema>;

// Use Case Fit Schema
export const UseCaseFitSchema = z.object({
  modern_jet: z.number().min(1).max(5).default(3),
  heli: z.number().min(1).max(5).default(3),
  ww2: z.number().min(1).max(5).default(3),
  ga: z.number().min(1).max(5).default(3),
  airliner: z.number().min(1).max(5).default(3),
  space_hotas: z.number().min(1).max(5).default(3),
  space_hosas: z.number().min(1).max(5).default(3),
});
export type UseCaseFit = z.infer<typeof UseCaseFitSchema>;

export const defaultUseCaseFit: UseCaseFit = {
  modern_jet: 3,
  heli: 3,
  ww2: 3,
  ga: 3,
  airliner: 3,
  space_hotas: 3,
  space_hosas: 3,
};

// Image Schema
export const ImageSchema = z.object({
  file: z.string(),
  source: z.string(),
  caption: z.string().optional(),
});
export type ProductImage = z.infer<typeof ImageSchema>;

// Brand Collection Schema
export const BrandSchema = z.object({
  name: z.string(),
  former_names: z.array(z.string()).default([]),
  country: z.string().optional(),
  website: z.string().url().optional(),
  landed_cost_notes: z.record(z.string(), z.string()).default({}),
});
export type Brand = z.infer<typeof BrandSchema>;

// Mount Standard Collection Schema
export const MountStandardSchema = z.object({
  name: z.string(),
  description: z.string(),
  physical_type: z.string(),
  compatible_with: z.array(z.string()).default([]),
});
export type MountStandard = z.infer<typeof MountStandardSchema>;

// Reviewer Collection Schema
export const ReviewerSchema = z.object({
  name: z.string(),
  platform: z.string(),
  url: z.string().url(),
  notes: z.string().optional(),
});
export type Reviewer = z.infer<typeof ReviewerSchema>;

// Component Collection Schema
export const HardwareSchema = z.object({
  gimbal: z.string().nullable().optional(),
  sensor: z.string().nullable().optional(),
  axes: z.array(
    z.object({
      name: z.string(),
      resolution_bits: z.number().int().optional(),
      sensor: z.string().optional(),
    })
  ).default([]),
  force_adjustable: z.boolean().nullable().optional(),
  cams_swappable: z.boolean().nullable().optional(),
  damping: z.string().nullable().optional(),
  extension_support: z.boolean().nullable().optional(),
  throw_deg: z.number().nullable().optional(),
}).nullable().optional();

export const MountSchema = z.object({
  provides: z.string().nullable().optional(),
  accepts: z.array(z.string()).default([]).optional(),
}).nullable().optional();

export const ConnectivitySchema = z.object({
  usb: z.string().nullable().optional(),
  standalone_usb: z.boolean().default(true),
});

export const PhysicalSchema = z.object({
  weight_g: z.number().nonnegative().optional(),
  dimensions_mm: z.tuple([z.number(), z.number(), z.number()]).optional(),
  materials: z.array(z.string()).default([]),
}).nullable().optional();

export const ComponentSchema = z.object({
  brand: z.string(),
  name: z.string(),
  category: ComponentCategoryEnum,
  status: ProductStatusEnum.default('current'),
  release_year: z.number().int().optional(),
  handedness: HandednessEnum.default('n/a'),
  mount: MountSchema,
  controls: z.array(ControlItemSchema).default([]),
  hardware: HardwareSchema,
  connectivity: ConnectivitySchema.default({ standalone_usb: true }),
  software: z.string().optional(),
  physical: PhysicalSchema,
  use_case_fit: UseCaseFitSchema.default(defaultUseCaseFit),
  prices: z.array(PriceSchema).default([]),
  verdict: VerdictSchema.nullable().optional(),
  external_reviews: z.array(ExternalReviewSchema).default([]),
  verification: VerificationStatusEnum.default('draft'),
  sources: z.array(z.string()).default([]),
  images: z.array(ImageSchema).default([]),
});
export type Component = z.infer<typeof ComponentSchema>;

// Bundle Collection Schema
export const BundleSchema = z.object({
  brand: z.string(),
  name: z.string(),
  category: BundleCategoryEnum,
  status: ProductStatusEnum.default('current'),
  components: z.array(z.string()).min(1),
  prices: z.array(PriceSchema).default([]),
  verdict: VerdictSchema.nullable().optional(),
  external_reviews: z.array(ExternalReviewSchema).default([]),
  verification: VerificationStatusEnum.default('draft'),
  sources: z.array(z.string()).default([]),
  images: z.array(ImageSchema).default([]),
});
export type Bundle = z.infer<typeof BundleSchema>;

// Setup Collection Schema
export const SetupSchema = z.object({
  title: z.string(),
  use_case: UseCaseEnum,
  budget_tier: BudgetTierEnum,
  description: z.string(),
  reasoning: z.string(),
  items: z.array(
    z.object({
      item_type: z.enum(['component', 'bundle']),
      id: z.string(),
      role: z.string(),
    })
  ),
  notes: z.string().optional(),
});
export type Setup = z.infer<typeof SetupSchema>;
