import { z } from 'zod';

export const RECORD_KINDS = [
  'claim',
  'source',
  'evidencePacket',
  'review',
  'changeRecord',
] as const;

export const CONTENT_RECORD_KINDS = [
  ...RECORD_KINDS,
  'muscle',
  'exercise',
  'approvalManifest',
] as const;

export type RecordKind = (typeof CONTENT_RECORD_KINDS)[number];

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DOI_PATTERN = /^10\.\d{4,9}\/[a-z0-9._;()/:+-]+$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ISO_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

function isRealIsoDate(value: string) {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function isRealIsoTimestamp(value: string) {
  if (!ISO_TIMESTAMP_PATTERN.test(value)) return false;
  return !Number.isNaN(new Date(value).valueOf());
}

function timestampInstant(value: string) {
  return Date.parse(value);
}

function requireUniqueIds(
  values: string[],
  path: PropertyKey[],
  label: string,
  context: z.RefinementCtx,
) {
  if (new Set(values).size !== values.length) {
    context.addIssue({
      code: 'custom',
      path,
      message: `${label} must be unique`,
    });
  }
}

export const entityIdSchema = z
  .string()
  .min(1, 'ID is required')
  .regex(ID_PATTERN, 'ID must use lowercase kebab case');

export const nonEmptyTextSchema = z
  .string()
  .trim()
  .min(1, 'A non-empty value is required');

export const isoDateSchema = z
  .string()
  .refine(isRealIsoDate, 'Use a real ISO date in YYYY-MM-DD form');

export const isoTimestampSchema = z
  .string()
  .refine(isRealIsoTimestamp, 'Use a real UTC ISO timestamp ending in Z');

export const checksumSchema = z
  .string()
  .regex(/^[a-f0-9]{64}$/, 'Use a lowercase SHA-256 digest');

export const reviewStateSchema = z.enum([
  'draft',
  'in-review',
  'blocked',
  'approved',
]);

export const publicationStateSchema = z.enum([
  'unpublished',
  'scheduled',
  'published',
  'superseded',
  'withdrawn',
]);

export const certaintySchema = z.enum([
  'established-descriptive-fact',
  'high',
  'moderate',
  'low',
  'very-low',
]);

export type Certainty = z.infer<typeof certaintySchema>;

export const reviewMetadataSchema = z
  .object({
    researchedBy: z.literal('claude-research').nullable(),
    auditedBy: z.literal('claude-review').nullable(),
    integratedBy: z.literal('codex').nullable(),
    ownerApprovedAt: isoTimestampSchema.nullable(),
    lastReviewedAt: isoDateSchema.nullable(),
    reviewDueAt: isoDateSchema.nullable(),
  })
  .strict();

export const historyMetadataSchema = z
  .object({
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
  })
  .strict()
  .superRefine((history, context) => {
    if (
      timestampInstant(history.updatedAt) < timestampInstant(history.createdAt)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['updatedAt'],
        message: 'updatedAt must not precede createdAt',
      });
    }
  });

export const relationshipTypeSchema = z.enum([
  'part-of',
  'located-in',
  'attaches-to',
  'crosses-joint',
  'contributes-to-action',
  'lengthened-by',
  'shortened-by',
  'primary-target-of',
  'assists-in',
  'stabilizes-during',
  'variation-of',
  'uses-equipment',
  'substitute-for',
  'contrasts-with',
  'supported-by',
  'qualifies',
  'contradicts',
  'supersedes',
]);

export const relationshipSchema = z
  .object({
    type: relationshipTypeSchema,
    targetId: entityIdSchema,
    claimId: entityIdSchema.nullable(),
    public: z.boolean(),
  })
  .strict();

const commonEntityFields = {
  id: entityIdSchema,
  reviewState: reviewStateSchema,
  publicationState: publicationStateSchema,
  approvalManifestId: entityIdSchema.nullable(),
  contentChecksum: checksumSchema.nullable(),
  review: reviewMetadataSchema,
  history: historyMetadataSchema,
  relationships: z.array(relationshipSchema).default([]),
};

export const contentSectionSchema = z
  .object({
    id: entityIdSchema,
    title: nonEmptyTextSchema,
    claimIds: z.array(entityIdSchema).min(1),
  })
  .strict()
  .superRefine((section, context) => {
    requireUniqueIds(
      section.claimIds,
      ['claimIds'],
      'Section claim IDs',
      context,
    );
  });

type CommonEntityShape = {
  reviewState: z.infer<typeof reviewStateSchema>;
  publicationState: z.infer<typeof publicationStateSchema>;
  approvalManifestId: string | null;
  contentChecksum: string | null;
  review: z.infer<typeof reviewMetadataSchema>;
};

function validateCommonLifecycle(
  entity: CommonEntityShape,
  context: z.RefinementCtx,
) {
  if (entity.publicationState !== 'published') return;

  const required: Array<[boolean, PropertyKey[], string]> = [
    [
      entity.reviewState === 'approved',
      ['reviewState'],
      'A published record must have reviewState approved',
    ],
    [
      entity.review.ownerApprovedAt !== null,
      ['review', 'ownerApprovedAt'],
      'A published record requires ownerApprovedAt',
    ],
    [
      entity.review.lastReviewedAt !== null,
      ['review', 'lastReviewedAt'],
      'A published record requires lastReviewedAt',
    ],
    [
      entity.review.reviewDueAt !== null,
      ['review', 'reviewDueAt'],
      'A published record requires reviewDueAt',
    ],
    [
      entity.approvalManifestId !== null,
      ['approvalManifestId'],
      'A published record requires an approval manifest ID',
    ],
    [
      entity.contentChecksum !== null,
      ['contentChecksum'],
      'A published record requires its approved content checksum',
    ],
  ];

  for (const [valid, path, message] of required) {
    if (!valid) context.addIssue({ code: 'custom', path, message });
  }
}

export const commonEntitySchema = z
  .object(commonEntityFields)
  .strict()
  .superRefine(validateCommonLifecycle);

const sourceLinkSchema = z
  .object({
    sourceId: entityIdSchema,
    locator: nonEmptyTextSchema,
    role: z.enum(['supports', 'qualifies', 'contradicts', 'neutral-context']),
    supportStrength: z.enum(['direct', 'partially-direct', 'indirect']),
  })
  .strict();

export const claimSchema = z
  .object({
    ...commonEntityFields,
    type: z.enum([
      'anatomy',
      'function',
      'exercise-mechanics',
      'acute-response',
      'longitudinal-adaptation',
      'association',
      'practical-synthesis',
      'safety-context',
    ]),
    statement: nonEmptyTextSchema,
    plainLanguage: nonEmptyTextSchema,
    scope: z
      .object({
        population: nonEmptyTextSchema,
        conditions: z.array(nonEmptyTextSchema),
      })
      .strict(),
    qualifiers: z.array(nonEmptyTextSchema),
    evidence: z
      .object({
        certainty: certaintySchema,
        applicability: z.enum(['direct', 'partially-direct', 'indirect']),
        direction: z.enum([
          'favors-a',
          'favors-b',
          'mixed',
          'no-clear-difference',
          'unknown',
          'not-applicable',
        ]),
        magnitude: z.enum([
          'trivial',
          'small',
          'moderate',
          'large',
          'not-estimable',
          'not-applicable',
        ]),
      })
      .strict(),
    sourceLinks: z.array(sourceLinkSchema),
  })
  .strict()
  .superRefine((claim, context) => {
    validateCommonLifecycle(claim, context);
    if (
      claim.publicationState === 'published' &&
      !claim.sourceLinks.some((link) => link.role === 'supports')
    ) {
      context.addIssue({
        code: 'custom',
        path: ['sourceLinks'],
        message: 'A published claim requires at least one supporting source',
      });
    }
  });

const pageIdentityFields = {
  ...commonEntityFields,
  name: nonEmptyTextSchema,
  slug: entityIdSchema,
  aliases: z.array(nonEmptyTextSchema),
  summaryClaimIds: z.array(entityIdSchema).min(1),
  sections: z.array(contentSectionSchema).min(1),
};

function validatePageClaimIds(
  page: {
    summaryClaimIds: string[];
    sections: Array<{ claimIds: string[] }>;
  },
  context: z.RefinementCtx,
) {
  requireUniqueIds(
    page.summaryClaimIds,
    ['summaryClaimIds'],
    'Summary claim IDs',
    context,
  );
  const sectionClaimIds = page.sections.flatMap((section) => section.claimIds);
  requireUniqueIds(
    sectionClaimIds,
    ['sections'],
    'Claim IDs across page sections',
    context,
  );
}

export const muscleSchema = z
  .object({
    ...pageIdentityFields,
    ontology: z
      .object({
        mesh: nonEmptyTextSchema.nullable(),
        uberon: nonEmptyTextSchema.nullable(),
        fma: nonEmptyTextSchema.nullable(),
      })
      .strict(),
  })
  .strict()
  .superRefine((muscle, context) => {
    validateCommonLifecycle(muscle, context);
    validatePageClaimIds(muscle, context);
  });

export const exerciseSchema = z
  .object({
    ...pageIdentityFields,
    equipmentIds: z.array(entityIdSchema),
    movementPatternIds: z.array(entityIdSchema),
    relatedEntityIds: z.array(entityIdSchema),
    projectDefinition: z
      .object({
        editorial: z.literal(true),
        included: z.array(nonEmptyTextSchema).min(1),
        excluded: z.array(nonEmptyTextSchema),
      })
      .strict(),
  })
  .strict()
  .superRefine((exercise, context) => {
    validateCommonLifecycle(exercise, context);
    validatePageClaimIds(exercise, context);
    requireUniqueIds(
      exercise.relatedEntityIds,
      ['relatedEntityIds'],
      'Related entity IDs',
      context,
    );
  });

const manifestEntrySchema = z
  .object({
    id: entityIdSchema,
    checksum: checksumSchema,
  })
  .strict();

export const approvalManifestSchema = z
  .object({
    id: entityIdSchema,
    scopeId: entityIdSchema,
    sourceCommit: z
      .string()
      .regex(/^[a-f0-9]{40}$/, 'Use a full lowercase Git commit hash'),
    entities: z.array(manifestEntrySchema).min(1),
    pages: z.array(manifestEntrySchema),
    requiredReviews: z
      .array(
        z
          .object({
            id: entityIdSchema,
            path: nonEmptyTextSchema,
            checksum: checksumSchema,
          })
          .strict(),
      )
      .min(1),
    ownerIdentity: nonEmptyTextSchema,
    decision: z.enum(['approved', 'rejected']),
    decidedAt: isoTimestampSchema,
    integratedBy: z.literal('codex'),
    deploymentEligible: z.boolean(),
    supersedesManifestId: entityIdSchema.nullable(),
  })
  .strict()
  .superRefine((manifest, context) => {
    requireUniqueIds(
      manifest.entities.map((entry) => entry.id),
      ['entities'],
      'Manifest entity IDs',
      context,
    );
    requireUniqueIds(
      manifest.pages.map((entry) => entry.id),
      ['pages'],
      'Manifest page IDs',
      context,
    );
    if (manifest.deploymentEligible && manifest.decision !== 'approved') {
      context.addIssue({
        code: 'custom',
        path: ['deploymentEligible'],
        message: 'Only an approved manifest can be deployment eligible',
      });
    }
    if (manifest.supersedesManifestId === manifest.id) {
      context.addIssue({
        code: 'custom',
        path: ['supersedesManifestId'],
        message: 'A manifest cannot supersede itself',
      });
    }
  });

const nullableIdentifier = <T extends z.ZodType>(schema: T) =>
  schema.nullable();

export const sourceSchema = z
  .object({
    id: entityIdSchema,
    type: z.enum([
      'randomized-trial',
      'systematic-review',
      'meta-analysis',
      'observational-study',
      'anatomy-reference',
      'book-textbook',
      'ontology-dataset',
      'guideline-position-statement',
      'other',
    ]),
    title: nonEmptyTextSchema,
    authors: z.array(nonEmptyTextSchema),
    year: z.number().int().min(1800).max(2100),
    identifiers: z
      .object({
        doi: nullableIdentifier(
          z
            .string()
            .regex(
              DOI_PATTERN,
              'Store a normalized lowercase bare DOI, without a URL prefix',
            ),
        ),
        pmid: nullableIdentifier(
          z.string().regex(/^\d{1,9}$/, 'PMID must contain digits only'),
        ),
        pmcid: nullableIdentifier(
          z
            .string()
            .regex(/^PMC\d+$/, 'PMCID must use uppercase PMC plus digits'),
        ),
        isbn: nullableIdentifier(nonEmptyTextSchema),
      })
      .strict(),
    urls: z
      .object({
        doi: z.url().nullable(),
        pubmed: z.url().nullable(),
        primary: z.url().nullable(),
      })
      .strict(),
    access: z
      .object({
        level: z.enum([
          'full-text-open',
          'full-text-limited',
          'abstract-only',
          'metadata-only',
        ]),
        license: nonEmptyTextSchema.nullable(),
      })
      .strict(),
    study: z
      .object({
        population: z.string(),
        sampleSize: z.number().int().positive().nullable(),
        durationWeeks: z.number().positive().nullable(),
        intervention: z.string(),
        comparator: z.string(),
        outcomes: z.array(nonEmptyTextSchema),
      })
      .strict(),
    quality: z
      .object({
        riskOfBias: z.enum([
          'low',
          'some-concerns',
          'high',
          'not-assessed',
          'not-applicable',
        ]),
        applicability: z.enum(['direct', 'partially-direct', 'indirect']),
        notes: z.array(nonEmptyTextSchema),
      })
      .strict(),
    publication: z
      .object({
        stage: z.enum([
          'peer-reviewed',
          'preprint',
          'other-non-peer-reviewed',
          'not-applicable',
        ]),
        status: z.enum([
          'current',
          'corrected',
          'expression-of-concern',
          'retracted',
          'superseded',
        ]),
        statusCheckedAt: isoDateSchema.nullable(),
        statusSource: nonEmptyTextSchema.nullable(),
        statusMethod: nonEmptyTextSchema.nullable(),
        nextStatusCheckAt: isoDateSchema.nullable(),
      })
      .strict(),
    funding: z.string().nullable(),
    conflicts: z.string().nullable(),
    projectSummary: nonEmptyTextSchema,
  })
  .strict()
  .superRefine((source, context) => {
    const identifiers = Object.values(source.identifiers);
    if (
      !identifiers.some((value) => value !== null) &&
      source.urls.primary === null
    ) {
      context.addIssue({
        code: 'custom',
        path: ['identifiers'],
        message:
          'At least one stable source identifier or primary repository URL is required',
      });
    }

    if (source.identifiers.doi !== null) {
      const expectedUrl = `https://doi.org/${source.identifiers.doi}`;
      if (source.urls.doi !== expectedUrl) {
        context.addIssue({
          code: 'custom',
          path: ['urls', 'doi'],
          message: `DOI URL must be canonical: ${expectedUrl}`,
        });
      }
    }
  });

export const evidencePacketSchema = z
  .object({
    id: entityIdSchema,
    question: nonEmptyTextSchema,
    searchedAt: isoDateSchema,
    searches: z
      .array(
        z
          .object({
            database: nonEmptyTextSchema,
            query: nonEmptyTextSchema,
            searchedAt: isoDateSchema,
            resultCount: z.number().int().nonnegative(),
          })
          .strict(),
      )
      .min(1),
    includedSourceIds: z.array(entityIdSchema),
    exclusions: z.array(
      z
        .object({
          sourceId: entityIdSchema,
          reason: nonEmptyTextSchema,
        })
        .strict(),
    ),
    synthesis: nonEmptyTextSchema,
    decisionLog: z
      .array(
        z
          .object({
            at: isoTimestampSchema,
            actor: z.enum(['claude-research', 'claude-review', 'codex']),
            decision: nonEmptyTextSchema,
          })
          .strict(),
      )
      .min(1),
    reviewState: reviewStateSchema,
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
  })
  .strict()
  .superRefine((packet, context) => {
    if (
      timestampInstant(packet.updatedAt) < timestampInstant(packet.createdAt)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['updatedAt'],
        message: 'updatedAt must not precede createdAt',
      });
    }

    requireUniqueIds(
      packet.includedSourceIds,
      ['includedSourceIds'],
      'Included source IDs',
      context,
    );
    const includedSourceIds = new Set(packet.includedSourceIds);
    for (const [index, exclusion] of packet.exclusions.entries()) {
      if (includedSourceIds.has(exclusion.sourceId)) {
        context.addIssue({
          code: 'custom',
          path: ['exclusions', index, 'sourceId'],
          message: 'A source cannot be both included and excluded',
        });
      }
    }
  });

const reviewFindingSchema = z
  .object({
    severity: z.enum(['critical', 'important', 'minor']),
    code: entityIdSchema,
    path: nonEmptyTextSchema,
    message: nonEmptyTextSchema,
    resolution: nonEmptyTextSchema.nullable(),
  })
  .strict();

export const reviewRecordSchema = z
  .object({
    id: entityIdSchema,
    targetIds: z.array(entityIdSchema).min(1),
    targetChecksums: z.record(entityIdSchema, checksumSchema),
    reviewerRole: z.literal('claude-review'),
    verdict: z.enum(['pass', 'fail', 'blocked']),
    findings: z.array(reviewFindingSchema),
    reviewedAt: isoTimestampSchema,
  })
  .strict()
  .superRefine((review, context) => {
    if (new Set(review.targetIds).size !== review.targetIds.length) {
      context.addIssue({
        code: 'custom',
        path: ['targetIds'],
        message: 'Review target IDs must be unique',
      });
    }

    for (const targetId of review.targetIds) {
      if (!Object.hasOwn(review.targetChecksums, targetId)) {
        context.addIssue({
          code: 'custom',
          path: ['targetChecksums'],
          message: `Missing immutable checksum for ${targetId}`,
        });
      }
    }
    const targetIds = new Set(review.targetIds);
    for (const checksumTargetId of Object.keys(review.targetChecksums)) {
      if (!targetIds.has(checksumTargetId)) {
        context.addIssue({
          code: 'custom',
          path: ['targetChecksums', checksumTargetId],
          message: `Checksum target ${checksumTargetId} is not present in targetIds`,
        });
      }
    }
    const hasBlockingFinding = review.findings.some(
      (finding) =>
        finding.resolution === null &&
        (finding.severity === 'critical' || finding.severity === 'important'),
    );
    if (review.verdict === 'pass' && hasBlockingFinding) {
      context.addIssue({
        code: 'custom',
        path: ['verdict'],
        message: 'A passing review cannot have unresolved blocking findings',
      });
    }
  });

export const changeRecordSchema = z
  .object({
    ...commonEntityFields,
    affectedIds: z.array(entityIdSchema).min(1),
    reason: nonEmptyTextSchema,
    beforeSummary: nonEmptyTextSchema,
    afterSummary: nonEmptyTextSchema,
    approvalId: entityIdSchema,
    deploymentId: entityIdSchema,
  })
  .strict()
  .superRefine((changeRecord, context) => {
    validateCommonLifecycle(changeRecord, context);
    requireUniqueIds(
      changeRecord.affectedIds,
      ['affectedIds'],
      'Affected IDs',
      context,
    );
  });

export const recordSchemaByKind = {
  claim: claimSchema,
  source: sourceSchema,
  muscle: muscleSchema,
  exercise: exerciseSchema,
  approvalManifest: approvalManifestSchema,
  evidencePacket: evidencePacketSchema,
  review: reviewRecordSchema,
  changeRecord: changeRecordSchema,
} as const;

export type ClaimRecord = z.infer<typeof claimSchema>;
export type SourceRecord = z.infer<typeof sourceSchema>;
export type MuscleRecord = z.infer<typeof muscleSchema>;
export type ExerciseRecord = z.infer<typeof exerciseSchema>;
export type ApprovalManifestRecord = z.infer<typeof approvalManifestSchema>;
export type EvidencePacketRecord = z.infer<typeof evidencePacketSchema>;
export type ReviewRecord = z.infer<typeof reviewRecordSchema>;
export type ChangeRecord = z.infer<typeof changeRecordSchema>;

export type SchemaIssue = {
  code: 'SCHEMA_INVALID';
  path: string;
  message: string;
  remediation: string;
};

function remediationForPath(path: string) {
  if (path === 'id' || path.endsWith('Id')) {
    return 'Use the immutable lowercase kebab-case identifier defined by the authoring contract.';
  }
  if (path.includes('doi')) {
    return 'Store a lowercase bare DOI and use the matching https://doi.org/<doi> URL.';
  }
  if (path.includes('review')) {
    return 'Complete the required independent review metadata before publication.';
  }
  if (path.includes('approval') || path.includes('Checksum')) {
    return 'Record the immutable approval or checksum that covers this exact content.';
  }
  return 'Correct the value at this path to match the evidence-record authoring schema.';
}

export function validateRecord(kind: RecordKind, input: unknown) {
  const result = recordSchemaByKind[kind].safeParse(input);
  if (result.success) return result;

  return {
    success: false as const,
    issues: result.error.issues.map((issue): SchemaIssue => {
      const path = issue.path.map(String).join('.');
      return {
        code: 'SCHEMA_INVALID',
        path,
        message: issue.message,
        remediation: remediationForPath(path),
      };
    }),
  };
}
