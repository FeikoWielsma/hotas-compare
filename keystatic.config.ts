import { config, fields, collection } from '@keystatic/core';

const platformCompatibilityField = () => fields.object({
  pc: platformSupportField('PC'),
  xbox: platformSupportField('Xbox'),
  ps5: platformSupportField('PS5'),
  notes: fields.text({ label: 'Compatibility notes', multiline: true }),
  sources: fields.array(fields.url({ label: 'Manufacturer URL' }), { label: 'Compatibility sources' }),
}, { label: 'Platform compatibility' });

const UNSET = 'unset';

/**
 * Keystatic selects and checkboxes always serialize a value, so an untouched default would be
 * written into every saved record. These wrappers add a "Not set" choice that is omitted from the
 * YAML, so absent facts stay absent (and stay distinct from an explicit false or default).
 */
function optionalSelect(label: string, options: { label: string; value: string }[], description?: string) {
  const field = fields.select({
    label,
    description,
    options: [{ label: 'Not set', value: UNSET }, ...options],
    defaultValue: UNSET,
  });
  return {
    ...field,
    parse: (value: unknown) => (value === undefined || value === null ? UNSET : field.parse(value as string)),
    serialize: (value: string) => ({ value: value === UNSET ? undefined : value }),
  } as typeof field;
}

function optionalBoolean(label: string, description?: string) {
  const field = fields.select({
    label,
    description,
    options: [
      { label: 'Not set', value: UNSET },
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    defaultValue: UNSET,
  });
  return {
    ...field,
    parse: (value: unknown) => {
      if (value === undefined || value === null) return UNSET;
      if (typeof value !== 'boolean') throw new Error('Must be a boolean');
      return value ? 'yes' : 'no';
    },
    serialize: (value: string) => ({ value: value === UNSET ? undefined : value === 'yes' }),
  } as typeof field;
}

const catalogKindOptions = ['core', 'panel', 'accessory', 'controller_board'].map((value) => ({ label: value, value }));

const priceHistoryField = () => fields.array(
  fields.object({
    amount: fields.number({ label: 'Previous amount' }),
    verified: fields.text({ label: 'Checked (YYYY-MM-DD)' }),
  }),
  {
    label: 'Price history (oldest first, max 10)',
    itemLabel: (props) => `${props.fields.amount.value ?? '?'} on ${props.fields.verified.value}`,
  },
);

const pricesField = () => fields.array(
  fields.object({
    kind: fields.select({
      label: 'Price kind',
      options: [
        { label: 'Official', value: 'official' },
        { label: 'Street', value: 'street' },
      ],
      defaultValue: 'official',
    }),
    region: fields.select({
      label: 'Region',
      options: [
        { label: 'EU', value: 'EU' },
        { label: 'UK', value: 'UK' },
        { label: 'US', value: 'US' },
      ],
      defaultValue: 'EU',
    }),
    currency: fields.select({
      label: 'Currency',
      options: [
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' },
        { label: 'USD', value: 'USD' },
      ],
      defaultValue: 'EUR',
    }),
    amount: fields.number({ label: 'Amount', defaultValue: 0 }),
    history: priceHistoryField(),
    incl_vat: fields.checkbox({ label: 'Includes VAT', defaultValue: true }),
    store: fields.text({ label: 'Store' }),
    url: fields.url({ label: 'Product URL' }),
    verified: fields.text({ label: 'Price Checked (YYYY-MM-DD)' }),
    source: fields.select({
      label: 'Source Type',
      options: [
        { label: 'Manual', value: 'manual' },
        { label: 'Feed', value: 'feed' },
      ],
      defaultValue: 'manual',
    }),
  }),
  { label: 'Prices' },
);

const verdictField = () => fields.object({
  author: fields.text({ label: 'Reviewer' }),
  hands_on: fields.checkbox({ label: 'Hands-on Experience' }),
  take: fields.text({ label: 'Verdict', multiline: true }),
  pros: fields.array(fields.text({ label: 'Pro' }), { label: 'Pros' }),
  cons: fields.array(fields.text({ label: 'Con' }), { label: 'Cons' }),
  great_for: fields.array(fields.text({ label: 'Use Case' }), { label: 'Great For' }),
  skip_if: fields.array(fields.text({ label: 'Caveat' }), { label: 'Skip If' }),
  scores: fields.object({
    build: fields.integer({ label: 'Build (1–5)' }),
    feel: fields.integer({ label: 'Feel (1–5)' }),
    value: fields.integer({ label: 'Value (1–5)' }),
    software: fields.integer({ label: 'Software (1–5)' }),
    qc_support: fields.integer({ label: 'QC & Support (1–5)' }),
  }),
});

const externalReviewsField = () => fields.array(
  fields.object({
    reviewer: fields.text({ label: 'Reviewer' }),
    url: fields.url({ label: 'Review URL' }),
    summary: fields.text({ label: 'Summary', multiline: true }),
    tag: fields.select({
      label: 'Sentiment',
      options: [
        { label: 'Recommended', value: 'recommended' },
        { label: 'Mixed', value: 'mixed' },
        { label: 'Avoid', value: 'avoid' },
        { label: 'Neutral', value: 'neutral' },
      ],
      defaultValue: 'neutral',
    }),
    date: fields.text({ label: 'Review Date (YYYY-MM-DD)' }),
  }),
  { label: 'External Reviews' },
);

const upgradePathsField = () => fields.array(
  fields.object({
    to: fields.text({ label: 'Component or Bundle ID' }),
    note: fields.text({ label: 'Why upgrade', multiline: true }),
    source: fields.url({ label: 'Evidence URL' }),
  }),
  { label: 'Upgrade Paths', itemLabel: (props) => props.fields.to.value },
);

const imagesField = () => fields.array(
  fields.object({
    file: fields.text({ label: 'Image Path' }),
    source: fields.text({ label: 'Image Source URL' }),
    caption: fields.text({ label: 'Caption' }),
  }),
  { label: 'Images' },
);

const successorField = () => fields.text({ label: 'Successor ID (component or bundle that replaces this)' });

function platformSupportField(label: string) {
  return fields.select({ label, defaultValue: 'unknown', options: [
    { label: 'Unknown', value: 'unknown' },
    { label: 'Supported', value: 'supported' },
    { label: 'Not supported', value: 'unsupported' },
  ] });
}


export default config({
  storage:
    process.env.NODE_ENV === 'production'
      ? {
          kind: 'github',
          repo: {
            owner: 'FeikoWielsma',
            name: 'hotas-compare',
          },
        }
      : {
          kind: 'local',
        },
  collections: {
    brands: collection({
      label: 'Brands',
      slugField: 'name',
      path: 'src/content/brands/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Brand Name' } }),
        former_names: fields.array(fields.text({ label: 'Former Name' }), {
          label: 'Former Names',
          itemLabel: (props) => props.value,
        }),
        country: fields.text({ label: 'Country Code (e.g. BY, CN, US)' }),
        website: fields.url({ label: 'Official Website' }),
        landed_cost_notes: fields.object({
          EU: fields.text({ label: 'EU Landed Cost Notes', multiline: true }),
          UK: fields.text({ label: 'UK Landed Cost Notes', multiline: true }),
          US: fields.text({ label: 'US Landed Cost Notes', multiline: true }),
        }),
      },
    }),

    mount_standards: collection({
      label: 'Mount Standards',
      slugField: 'name',
      path: 'src/content/mount-standards/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Standard Name' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        physical_type: fields.text({ label: 'Physical Type (e.g. thread_collar)' }),
        compatible_with: fields.array(fields.text({ label: 'Standard ID' }), {
          label: 'Compatible Standards (Bridged)',
        }),
      },
    }),

    reviewers: collection({
      label: 'Reviewers',
      slugField: 'name',
      path: 'src/content/reviewers/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Reviewer Name / Channel' } }),
        platform: fields.text({ label: 'Platform (e.g. YouTube)' }),
        url: fields.url({ label: 'Channel / Website URL' }),
        notes: fields.text({ label: 'Editorial Notes', multiline: true }),
      },
    }),

    components: collection({
      label: 'Components',
      slugField: 'name',
      path: 'src/content/components/**',
      format: { data: 'yaml' },
      columns: ['brand', 'category'],
      schema: {
        name: fields.slug({ name: { label: 'Product Name' } }),
        brand: fields.text({ label: 'Brand Slug' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Base', value: 'base' },
            { label: 'Grip', value: 'grip' },
            { label: 'Fixed Stick', value: 'stick_fixed' },
            { label: 'Throttle', value: 'throttle' },
            { label: 'Quadrant', value: 'quadrant' },
            { label: 'Yoke', value: 'yoke' },
            { label: 'Pedals', value: 'pedals' },
            { label: 'Module', value: 'module' },
          ],
          defaultValue: 'grip',
        }),
        sold_standalone: optionalBoolean('Sold on its own', 'Set to No only when the part is sold exclusively inside a bundle; leave unset otherwise.'),
        sold_mainly_in_bundle: optionalBoolean('Usually bought in a combo (hidden by default in catalog)'),
        catalog_kind: optionalSelect('Catalog kind (non-core hardware is hidden)', catalogKindOptions),
        platform_compatibility: platformCompatibilityField(),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Current', value: 'current' },
            { label: 'Discontinued', value: 'discontinued' },
            { label: 'Announced', value: 'announced' },
          ],
          defaultValue: 'current',
        }),
        successor: successorField(),
        release_year: fields.integer({ label: 'Release Year' }),
        handedness: fields.select({
          label: 'Handedness',
          options: [
            { label: 'Right', value: 'right' },
            { label: 'Left', value: 'left' },
            { label: 'Ambidextrous', value: 'ambi' },
            { label: 'N/A', value: 'n/a' },
          ],
          defaultValue: 'n/a',
        }),
        mount: fields.object({
          provides: fields.text({ label: 'Provides Mount Standard' }),
          accepts: fields.array(fields.text({ label: 'Accepted Mount Standard' }), {
            label: 'Accepts Mount Standards',
          }),
        }),
        placement: optionalSelect('Placement (leave unset when undocumented)', [
          { label: 'Desk or mount', value: 'both' },
          { label: 'Desk only', value: 'desk' },
          { label: 'Mount required', value: 'mount_only' },
        ]),
        controls: fields.array(
          fields.object({
            type: fields.select({
              label: 'Control Type',
              options: [
                { label: 'Button', value: 'button' },
                { label: 'Hat Switch', value: 'hat' },
                { label: 'Trigger', value: 'trigger' },
                { label: 'Analog Ministick', value: 'analog_ministick' },
                { label: 'Lever', value: 'lever' },
                { label: 'Encoder', value: 'encoder' },
                { label: 'Toggle', value: 'toggle' },
                { label: 'Slider', value: 'slider' },
                { label: 'Detent', value: 'detent' },
                { label: 'Rocker', value: 'rocker' },
                { label: 'Rotary', value: 'rotary' },
                { label: 'Scroll Wheel', value: 'scroll_wheel' },
                { label: 'Switch', value: 'switch' },
                { label: 'Axis', value: 'axis' },
              ],
              defaultValue: 'button',
            }),
            count: fields.integer({ label: 'Count', defaultValue: 1 }),
            label: fields.text({ label: 'Label' }),
            location: fields.text({ label: 'Location (grip, base, handle, panel, other)' }),
            ways: fields.integer({ label: 'Directions / Ways' }),
            stages: fields.integer({ label: 'Trigger Stages' }),
            push: optionalBoolean('Pressable / Pushable'),
            analog: optionalBoolean('Analog'),
            positions: fields.integer({ label: 'Positions' }),
            center_detent: optionalBoolean('Centre detent'),
            kind: fields.text({ label: 'Kind (e.g. brake, twist)' }),
            action: fields.text({ label: 'Action' }),
            mode: fields.text({ label: 'Mode' }),
            momentary: optionalBoolean('Momentary'),
            flip: optionalBoolean('Flip'),
            backlit: optionalBoolean('Backlit'),
            customizable: optionalBoolean('Customizable'),
            push_stages: fields.integer({ label: 'Push Stages' }),
            button_contacts: fields.integer({ label: 'Contacts actuated by each lever' }),
            notes: fields.text({ label: 'Notes', multiline: true }),
            source: fields.url({ label: 'Evidence URL' }),
          }),
          {
            label: 'Physical Controls',
            itemLabel: (props) =>
              props.fields.label.value || `${props.fields.type.value} × ${props.fields.count.value ?? 1}`,
          },
        ),
        controls_evidence: fields.object({
          coverage: fields.select({
            label: 'Inventory Coverage',
            options: [
              { label: 'Partial', value: 'partial' },
              { label: 'Complete', value: 'complete' },
            ],
            defaultValue: 'partial',
          }),
          source: fields.url({ label: 'Evidence Source' }),
          checked: fields.text({ label: 'Last Checked (YYYY-MM-DD)' }),
          notes: fields.text({ label: 'Evidence Notes', multiline: true }),
        }),
        hardware: fields.object({
          axis_count: fields.integer({ label: 'Manufacturer total axes (if documented)' }),
          gimbal: fields.text({ label: 'Gimbal Type' }),
          gimbal_type: optionalSelect('Gimbal family', [
            { label: 'Ball and cup', value: 'ball_and_cup' },
            { label: 'Pincer', value: 'pincer' },
            { label: 'Cam and spring', value: 'cam_and_spring' },
            { label: 'Force feedback', value: 'force_feedback' },
            { label: 'Other', value: 'other' },
          ]),
          sensor: fields.text({ label: 'Sensor Type' }),
          axes: fields.array(
            fields.object({
              name: fields.text({ label: 'Axis Name' }),
              resolution_bits: fields.integer({ label: 'Resolution (bits)' }),
              sensor: fields.text({ label: 'Sensor' }),
            }),
            { label: 'Axes' },
          ),
          force_adjustable: optionalBoolean('Adjustable Force'),
          cams_swappable: optionalBoolean('Swappable Cams'),
          damping: fields.text({ label: 'Damping' }),
          damper: optionalSelect('Pedal damper (pedals only)', [
            { label: 'Built in', value: 'built_in' },
            { label: 'Optional add-on', value: 'optional' },
            { label: 'None', value: 'none' },
          ]),
          damper_addon: fields.text({ label: 'Damper add-on (name or ID)' }),
          extension_support: optionalBoolean('Extension Support'),
          throw_deg: fields.number({ label: 'Throw (degrees)' }),
        }),
        connectivity: fields.object({
          usb: fields.text({ label: 'USB Connector Type' }),
          standalone_usb: fields.checkbox({ label: 'Standalone USB Device', defaultValue: true }),
        }),
        software: fields.text({ label: 'Software Suite' }),
        physical: fields.object({
          weight_g: fields.number({ label: 'Weight (g)' }),
          dimensions_mm: fields.array(fields.number({ label: 'Dimension (mm)' }), {
            label: 'Dimensions (X, Y, Z in mm)',
          }),
          materials: fields.array(fields.text({ label: 'Material' }), { label: 'Materials' }),
        }),
        use_case_fit: fields.object({
          modern_jet: fields.integer({ label: 'Modern Jet (1–5)', defaultValue: 3 }),
          heli: fields.integer({ label: 'Helicopter (1–5)', defaultValue: 3 }),
          ww2: fields.integer({ label: 'WWII (1–5)', defaultValue: 3 }),
          ga: fields.integer({ label: 'General Aviation (1–5)', defaultValue: 3 }),
          airliner: fields.integer({ label: 'Airliner (1–5)', defaultValue: 3 }),
          space_hotas: fields.integer({ label: 'Space HOTAS (1–5)', defaultValue: 3 }),
          space_hosas: fields.integer({ label: 'Space HOSAS (1–5)', defaultValue: 3 }),
        }),
        prices: pricesField(),
        verdict: verdictField(),
        external_reviews: externalReviewsField(),
        upgrade_paths: upgradePathsField(),
        verification: fields.select({
          label: 'Verification Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Verified', value: 'verified' },
          ],
          defaultValue: 'draft',
        }),
        sources: fields.array(fields.text({ label: 'Source URL' }), { label: 'Sources' }),
        images: imagesField(),
      },
    }),

    bundles: collection({
      label: 'Bundles (Real SKUs)',
      slugField: 'name',
      path: 'src/content/bundles/**',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Bundle SKU Name' } }),
        brand: fields.text({ label: 'Brand Slug' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'HOTAS Bundle', value: 'hotas_bundle' },
            { label: 'HOSAS Bundle', value: 'hosas_bundle' },
            { label: 'Stick Combo', value: 'stick_combo' },
            { label: 'Yoke Bundle', value: 'yoke_bundle' },
            { label: 'System', value: 'system' },
          ],
          defaultValue: 'hotas_bundle',
        }),
        catalog_kind: optionalSelect('Catalog kind (non-core hardware is hidden)', catalogKindOptions),
        platform_compatibility: platformCompatibilityField(),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Current', value: 'current' },
            { label: 'Discontinued', value: 'discontinued' },
            { label: 'Announced', value: 'announced' },
          ],
          defaultValue: 'current',
        }),
        successor: successorField(),
        components: fields.array(fields.text({ label: 'Component ID' }), {
          label: 'Included Components',
        }),
        prices: pricesField(),
        verdict: verdictField(),
        external_reviews: externalReviewsField(),
        upgrade_paths: upgradePathsField(),
        verification: fields.select({
          label: 'Verification Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Verified', value: 'verified' },
          ],
          defaultValue: 'draft',
        }),
        sources: fields.array(fields.text({ label: 'Source URL' }), { label: 'Sources' }),
        images: imagesField(),
      },
    }),

    setups: collection({
      label: 'Curated Reference Setups',
      slugField: 'title',
      path: 'src/content/setups/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Setup Title' } }),
        use_case: fields.select({
          label: 'Use Case',
          options: [
            { label: 'Modern Jet', value: 'modern_jet' },
            { label: 'Helicopter', value: 'heli' },
            { label: 'WWII Combat', value: 'ww2' },
            { label: 'General Aviation', value: 'ga' },
            { label: 'Airliner', value: 'airliner' },
            { label: 'Space HOTAS', value: 'space_hotas' },
            { label: 'Space HOSAS', value: 'space_hosas' },
          ],
          defaultValue: 'modern_jet',
        }),
        budget_tier: fields.select({
          label: 'Budget Tier',
          options: [
            { label: 'Budget', value: 'budget' },
            { label: 'Mid-Range', value: 'mid' },
            { label: 'High-End', value: 'high_end' },
            { label: 'Enthusiast', value: 'enthusiast' },
          ],
          defaultValue: 'mid',
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        reasoning: fields.text({ label: 'Editorial Reasoning', multiline: true }),
        items: fields.array(
          fields.object({
            item_type: fields.select({
              label: 'Item Type',
              options: [
                { label: 'Component', value: 'component' },
                { label: 'Bundle', value: 'bundle' },
              ],
              defaultValue: 'component',
            }),
            id: fields.text({ label: 'Component or Bundle ID' }),
            role: fields.text({ label: 'Role in Setup' }),
          }),
          {
            label: 'Setup Items',
          },
        ),
        notes: fields.text({ label: 'Additional Notes', multiline: true }),
        pick: fields.checkbox({ label: 'Our pick for this flying style and budget tier' }),
      },
    }),

    families: collection({
      label: 'Product Families',
      slugField: 'name',
      path: 'src/content/families/**',
      format: { data: 'yaml' },
      columns: ['brand', 'axis'],
      schema: {
        name: fields.slug({ name: { label: 'Family Name' } }),
        brand: fields.text({ label: 'Brand Slug' }),
        axis: fields.text({ label: 'Differentiating Axis (e.g. Size, Edition)' }),
        description: fields.text({ label: 'Description', multiline: true }),
        members: fields.array(
          fields.object({
            id: fields.text({ label: 'Component or Bundle ID' }),
            label: fields.text({ label: 'Label on the axis (hand twins share one)' }),
          }),
          { label: 'Members (smallest or cheapest first)', itemLabel: (props) => props.fields.label.value || props.fields.id.value },
        ),
      },
    }),
  },
});
