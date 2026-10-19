import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: process.env.NODE_ENV === 'production'
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
      schema: {
        name: fields.text({ label: 'Brand Name' }),
      },
    }),
  },
});
