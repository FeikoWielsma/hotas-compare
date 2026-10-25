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

export const PlatformSupportEnum = z.enum(['supported', 'unsupported', 'unknown']);
export const PlatformCompatibilitySchema = z.object({
  pc: PlatformSupportEnum.default('unknown'),
  xbox: PlatformSupportEnum.default('unknown'),
  ps5: PlatformSupportEnum.default('unknown'),
  notes: z.string().optional(),
  sources: z.array(z.url()).default([]),
});
export type PlatformCompatibility = z.infer<typeof PlatformCompatibilitySchema>;

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
const controlDetails = {
  location: z.enum(['grip', 'base', 'handle', 'panel', 'other']).optional(),
  notes: z.string().optional(),
  source: z.url().optional(),
};

export const TriggerControlSchema = z.object({
  ...controlDetails,
  type: z.literal('trigger'),
  count: z.number().int().min(1).default(1).optional(),
  stages: z.number().int().min(1).optional(),
  action: z.enum(['sequential', 'bidirectional', 'flip']).optional(),
  flip: z.boolean().optional(),
  label: z.string().optional(),
});

export const HatControlSchema = z.object({
  ...controlDetails,
  type: z.literal('hat'),
  ways: z.number().int().min(2).max(8).optional(),
  push: z.boolean().optional(),
  count: z.number().int().min(1).default(1),
  label: z.string().optional(),
});

export const MinistickControlSchema = z.object({
  ...controlDetails,
  type: z.literal('analog_ministick'),
  push: z.boolean().optional(),
  count: z.number().int().min(1).default(1),
  label: z.string().optional(),
});

export const ButtonControlSchema = z.object({
  ...controlDetails,
  type: z.literal('button'),
  count: z.number().int().min(1).default(1),
  label: z.string().optional(),
  backlit: z.boolean().optional(),
});

export const LeverControlSchema = z.object({
  ...controlDetails,
  type: z.literal('lever'),
  kind: z.enum(['brake', 'throttle_single', 'throttle_dual', 'flap', 'speedbrake', 'collective', 'other']).default('other'),
  analog: z.boolean().optional(),
  push: z.boolean().optional(),
  /** Electrical contacts actuated by lever travel, not separate push-button bodies. */
  button_contacts: z.number().int().min(1).optional(),
  positions: z.number().int().min(2).optional(),
  momentary: z.boolean().optional(),
  count: z.number().int().min(1).default(1),
  label: z.string().optional(),
});

export const EncoderControlSchema = z.object({
  ...controlDetails,
  type: z.literal('encoder'),
  count: z.number().int().min(1).default(1),
  push: z.boolean().optional(),
  push_stages: z.number().int().min(1).optional(),
  label: z.string().optional(),
});

export const ToggleControlSchema = z.object({
  ...controlDetails,
  type: z.literal('toggle'),
  count: z.number().int().min(1).default(1),
  ways: z.number().int().min(2).max(3).optional(),
  momentary: z.boolean().optional(),
  push: z.boolean().optional(),
  label: z.string().optional(),
});

export const SliderControlSchema = z.object({
  ...controlDetails,
  type: z.literal('slider'),
  count: z.number().int().min(1).default(1),
  analog: z.boolean().optional(),
  positions: z.number().int().min(2).optional(),
  center_detent: z.boolean().optional(),
  label: z.string().optional(),
});

export const DetentControlSchema = z.object({
  ...controlDetails,
  type: z.literal('detent'),
  count: z.number().int().min(1).default(1),
  customizable: z.boolean().optional(),
  label: z.string().optional(),
});

export const RockerControlSchema = z.object({
  ...controlDetails,
  type: z.literal('rocker'),
  count: z.number().int().min(1).default(1),
  analog: z.boolean().optional(),
  push: z.boolean().optional(),
  label: z.string().optional(),
});

export const RotaryControlSchema = z.object({
  ...controlDetails,
  type: z.literal('rotary'),
  mode: z.enum(['analog', 'selector']).optional(),
  positions: z.number().int().min(2).optional(),
  push: z.boolean().optional(),
  count: z.number().int().min(1).default(1),
  label: z.string().optional(),
});

export const ScrollWheelControlSchema = z.object({
  ...controlDetails,
  type: z.literal('scroll_wheel'),
  count: z.number().int().min(1).default(1),
  push: z.boolean().optional(),
  push_stages: z.number().int().min(1).optional(),
  label: z.string().optional(),
});

// Preserve documented switch counts when the manufacturer does not identify the mechanism.
export const SwitchControlSchema = z.object({
  ...controlDetails,
  type: z.literal('switch'),
  count: z.number().int().min(1).default(1),
  positions: z.number().int().min(2).optional(),
  push: z.boolean().optional(),
  momentary: z.boolean().optional(),
  label: z.string().optional(),
});

export const AxisControlSchema = z.object({
  ...controlDetails,
  type: z.literal('axis'),
  count: z.number().int().min(1).default(1),
  kind: z.enum(['rudder', 'toe_brake', 'twist', 'roll', 'pitch', 'other']),
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
  ScrollWheelControlSchema,
  SwitchControlSchema,
  AxisControlSchema,
]);
export type ControlItem = z.infer<typeof ControlItemSchema>;

// Price Schema
export const PriceHistorySchema = z.array(z.object({
  amount: z.number().nonnegative(),
  verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
})).max(10).refine(
  (history) => new Set(history.map(({ amount, verified }) => `${amount}:${verified}`)).size === history.length,
  'Price history must not contain duplicate amount/date pairs',
);

export const PriceSchema = z.object({
  kind: z.enum(['official', 'street']).default('official'),
  region: RegionEnum,
  currency: CurrencyEnum,
  amount: z.number().nonnegative(),
  /** Previous observations, oldest first; at most 10 unique amount/date pairs. */
  history: PriceHistorySchema.optional(),
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
  // Evidence-based commentary can exist before the maintainer assigns scores.
  scores: VerdictScoreSchema.optional(),
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

/** An opinionated next step from this item, e.g. a better base for the same grip. `to` is a component or bundle id. */
export const UpgradePathSchema = z.object({
  to: z.string(),
  note: z.string(),
  source: z.string().url().optional(),
});
export type UpgradePath = z.infer<typeof UpgradePathSchema>;

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

/** Stick gimbal families, as used by reviewers to judge quality; null = not a stick or not documented. */
export const GimbalTypeEnum = z.enum(['ball_and_cup', 'pincer', 'cam_and_spring', 'force_feedback', 'other']);
export type GimbalType = z.infer<typeof GimbalTypeEnum>;

/** Pedal damper support; null = not pedals or not documented. */
export const DamperEnum = z.enum(['built_in', 'optional', 'none']);
export type DamperType = z.infer<typeof DamperEnum>;

// Optional classification keeps non-core hardware available to content and price tooling.
export const CatalogKindEnum = z.enum(['core', 'panel', 'accessory', 'controller_board']);

// Component Collection Schema
export const HardwareSchema = z.object({
  /** Manufacturer's total, when the full individual axis mapping is unavailable. */
  axis_count: z.number().int().nonnegative().optional(),
  gimbal: z.string().nullable().optional(),
  gimbal_type: GimbalTypeEnum.nullable().optional(),
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
  damper: DamperEnum.nullable().optional(),
  damper_addon: z.string().nullable().optional(),
  extension_support: z.boolean().nullable().optional(),
  throw_deg: z.number().nullable().optional(),
}).nullable().optional();

export const MountSchema = z.object({
  provides: z.string().nullable().optional(),
  accepts: z.array(z.string()).default([]).optional(),
}).nullable().optional();

export const PlacementEnum = z.enum(['desk', 'mount_only', 'both']);
export type Placement = z.infer<typeof PlacementEnum>;

export const ConnectivitySchema = z.object({
  usb: z.string().nullable().optional(),
  standalone_usb: z.boolean().nullable().default(null),
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
  catalog_kind: CatalogKindEnum.optional(),
  platform_compatibility: PlatformCompatibilitySchema.optional(),
  status: ProductStatusEnum.default('current'),
  successor: z.string().min(1).optional(),
  /** False when the part is only sold inside a bundle; absent means sold on its own (or not yet checked). */
  sold_standalone: z.boolean().optional(),
  /** Curated catalog preference; does not restrict standalone purchases or wizard upgrades. */
  sold_mainly_in_bundle: z.boolean().optional(),
  release_year: z.number().int().optional(),
  handedness: HandednessEnum.default('n/a'),
  mount: MountSchema,
  placement: PlacementEnum.nullable().optional(),
  controls: z.array(ControlItemSchema).default([]),
  controls_evidence: z.object({
    coverage: z.enum(['partial', 'complete']),
    source: z.url(),
    checked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    notes: z.string().optional(),
  }).optional(),
  hardware: HardwareSchema,
  connectivity: ConnectivitySchema.default({ standalone_usb: null }),
  software: z.string().optional(),
  physical: PhysicalSchema,
  use_case_fit: UseCaseFitSchema.default(defaultUseCaseFit),
  prices: z.array(PriceSchema).default([]),
  verdict: VerdictSchema.nullable().optional(),
  external_reviews: z.array(ExternalReviewSchema).default([]),
  upgrade_paths: z.array(UpgradePathSchema).default([]),
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
  catalog_kind: CatalogKindEnum.optional(),
  platform_compatibility: PlatformCompatibilitySchema.optional(),
  status: ProductStatusEnum.default('current'),
  successor: z.string().min(1).optional(),
  components: z.array(z.string()).min(1),
  prices: z.array(PriceSchema).default([]),
  verdict: VerdictSchema.nullable().optional(),
  external_reviews: z.array(ExternalReviewSchema).default([]),
  upgrade_paths: z.array(UpgradePathSchema).default([]),
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
  /** Our opinionated first choice for this flying style and budget tier; listed before alternatives. */
  pick: z.boolean().default(false),
});
export type Setup = z.infer<typeof SetupSchema>;

// Family Collection Schema
/** Related variants of one product line, ordered along the axis that differentiates them. */
export const FamilySchema = z.object({
  name: z.string(),
  brand: z.string(),
  /** What changes from one member to the next, e.g. "Size" or "Edition". */
  axis: z.string(),
  description: z.string().optional(),
  /**
   * Component or bundle IDs in display order, smallest/cheapest first. Mirrored hand twins share a
   * label and form one tier, so switchers and diff tables show one column per label.
   */
  members: z.array(z.object({
    id: z.string(),
    label: z.string(),
  })).min(2),
});
export type Family = z.infer<typeof FamilySchema>;
