import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import {
  changeRecordSchema,
  claimSchema,
  sourceSchema,
} from './lib/content/schemas';

const structuredRecords = '**/*.{json,yaml,yml}';

export const collections = {
  claims: defineCollection({
    loader: glob({ pattern: structuredRecords, base: './content/claims' }),
    schema: claimSchema,
  }),
  sources: defineCollection({
    loader: glob({ pattern: structuredRecords, base: './content/sources' }),
    schema: sourceSchema,
  }),
  changes: defineCollection({
    loader: glob({ pattern: structuredRecords, base: './content/changes' }),
    schema: changeRecordSchema,
  }),
};
