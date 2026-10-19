import { config, fields, collection } from '@keystatic/core';

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
        name: fields.text({ label: 'Brand Name' }),
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
        name: fields.text({ label: 'Standard Name' }),
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
        name: fields.text({ label: 'Reviewer Name / Channel' }),
        platform: fields.text({ label: 'Platform (e.g. YouTube)' }),
        url: fields.url({ label: 'Channel / Website URL' }),
        notes: fields.text({ label: 'Editorial Notes', multiline: true }),
      },
    }),

    components: collection({
      label: 'Components',
      slugField: 'name',
      path: 'src/content/components/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.text({ label: 'Product Name' }),
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
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Current', value: 'current' },
            { label: 'Discontinued', value: 'discontinued' },
            { label: 'Announced', value: 'announced' },
          ],
          defaultValue: 'current',
        }),
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
        connectivity: fields.object({
          usb: fields.text({ label: 'USB Connector Type' }),
          standalone_usb: fields.checkbox({ label: 'Standalone USB Device', defaultValue: true }),
        }),
        software: fields.text({ label: 'Software Suite' }),
        verification: fields.select({
          label: 'Verification Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Verified', value: 'verified' },
          ],
          defaultValue: 'draft',
        }),
        sources: fields.array(fields.text({ label: 'Source URL' }), { label: 'Sources' }),
      },
    }),

    bundles: collection({
      label: 'Bundles (Real SKUs)',
      slugField: 'name',
      path: 'src/content/bundles/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.text({ label: 'Bundle SKU Name' }),
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
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Current', value: 'current' },
            { label: 'Discontinued', value: 'discontinued' },
            { label: 'Announced', value: 'announced' },
          ],
          defaultValue: 'current',
        }),
        components: fields.array(fields.text({ label: 'Component ID' }), {
          label: 'Included Components',
        }),
        verification: fields.select({
          label: 'Verification Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Verified', value: 'verified' },
          ],
          defaultValue: 'draft',
        }),
        sources: fields.array(fields.text({ label: 'Source URL' }), { label: 'Sources' }),
      },
    }),

    setups: collection({
      label: 'Curated Reference Setups',
      slugField: 'title',
      path: 'src/content/setups/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.text({ label: 'Setup Title' }),
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
        notes: fields.text({ label: 'Additional Notes', multiline: true }),
      },
    }),
  },
});
