import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import {
  approvalManifestSchema,
  changeRecordSchema,
  claimSchema,
  exerciseSchema,
  muscleSchema,
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
  muscles: defineCollection({
    loader: glob({ pattern: structuredRecords, base: './content/muscles' }),
    schema: muscleSchema,
  }),
  exercises: defineCollection({
    loader: glob({ pattern: structuredRecords, base: './content/exercises' }),
    schema: exerciseSchema,
  }),
  approvalManifests: defineCollection({
    loader: glob({
      pattern: structuredRecords,
      base: './content/approval-manifests',
    }),
    schema: approvalManifestSchema,
  }),
  changes: defineCollection({
    loader: glob({ pattern: structuredRecords, base: './content/changes' }),
    schema: changeRecordSchema,
  }),
};
