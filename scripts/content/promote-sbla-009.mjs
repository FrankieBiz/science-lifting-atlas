import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { format as formatWithPrettier } from 'prettier';

import { validateRecord } from '../../src/lib/content/schemas.ts';
import { canonicalJson } from '../../src/lib/graph/compiler.ts';

/**
 * @typedef {{
 *   id: string,
 *   type: any,
 *   statement: string,
 *   plainLanguage: string,
 *   scope: any,
 *   qualifiers: string[],
 *   evidence: any,
 *   sourceLinks: Array<{sourceId: string}>
 * }} DraftClaim
 */

/**
 * @typedef {{
 *   proposedSourceId: string,
 *   sourceSchemaFields: any,
 *   extraction: {
 *     reportedFacts?: Array<{fact: string}>,
 *     conditionLabels?: Record<string, string>,
 *     designNote?: string,
 *     contrastType?: string,
 *     question?: string[],
 *     researchRoleInference?: string
 *   }
 * }} SourceExtraction
 */

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const mode = process.argv.includes('--write') ? 'write' : 'check';
const claimsPath = path.join(
  repositoryRoot,
  'content-drafts/syntheses/SBLA-009-atomic-claims.json',
);
const extractionsPath = path.join(
  repositoryRoot,
  'research/extractions/SBLA-009-source-extractions.json',
);
const pageInputs = [
  {
    kind: 'muscle',
    id: 'pectoralis-major',
    name: 'Pectoralis major',
    aliases: ['chest muscle', 'pec major'],
    source: 'content-drafts/muscles/pectoralis-major.md',
    ontology: {
      mesh: 'D010369',
      uberon: 'UBERON:0002381',
      fma: 'FMA:9627',
    },
  },
  {
    kind: 'exercise',
    id: 'barbell-flat-bench-press',
    name: 'Barbell flat bench press',
    aliases: ['flat bench press', 'barbell bench press'],
    source: 'content-drafts/exercises/barbell-flat-bench-press.md',
    relatedEntityIds: [
      'pectoralis-major',
      'cable-fly-standing-bilateral-shoulder-height',
    ],
    included: [
      'Project-scoped free-weight barbell press performed supine on a horizontal bench at 0° ± 5°.',
    ],
    excluded: [
      'Smith-machine, machine, dumbbell, incline, decline, floor, partial-range, accommodating-resistance, unilateral, and bodyweight presses.',
    ],
  },
  {
    kind: 'exercise',
    id: 'cable-fly-standing-bilateral-shoulder-height',
    name: 'Bilateral standing cable fly at shoulder height',
    aliases: ['standing cable fly', 'bilateral cable fly'],
    source:
      'content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md',
    relatedEntityIds: ['pectoralis-major', 'barbell-flat-bench-press'],
    included: [
      'Project-scoped bilateral standing cable fly with the handles travelling at shoulder height.',
    ],
    excluded: [
      'Machine, dumbbell, unilateral, low-to-high, high-to-low, seated, and lying fly variations.',
    ],
  },
];

const lifecycle = {
  reviewState: 'approved',
  publicationState: 'unpublished',
  approvalManifestId: null,
  contentChecksum: null,
  review: {
    researchedBy: 'claude-research',
    auditedBy: 'claude-review',
    integratedBy: 'codex',
    ownerApprovedAt: null,
    lastReviewedAt: '2026-09-15',
    reviewDueAt: '2027-09-15',
  },
  history: {
    createdAt: '2026-09-13T00:00:00Z',
    updatedAt: '2026-09-15T22:53:00Z',
  },
  relationships: [],
};

/**
 * @param {import('../../src/lib/content/schemas.ts').RecordKind} kind
 * @param {unknown} record
 * @param {string} relativePath
 */
function assertValid(kind, record, relativePath) {
  const result = validateRecord(kind, record);
  if (result.success) return result.data;
  const details = result.issues
    .map((issue) => `${issue.path}: ${issue.message}`)
    .join('; ');
  throw new Error(`${relativePath} is invalid: ${details}`);
}

/** @param {unknown} record */
async function formattedJson(record) {
  return formatWithPrettier(canonicalJson(record), { parser: 'json' });
}

/** @param {string} markdown @param {Set<string>} knownClaimIds */
function claimIdsInMarkdown(markdown, knownClaimIds) {
  return [
    ...new Set(
      [...markdown.matchAll(/\bclaim-[a-z0-9-]+\b/g)]
        .map((match) => match[0])
        .filter((id) => knownClaimIds.has(id)),
    ),
  ];
}

/** @param {SourceExtraction} extraction */
function sourceRecord(extraction) {
  const fields = extraction.sourceSchemaFields;
  const facts = extraction.extraction.reportedFacts ?? [];
  const conditions = Object.keys(extraction.extraction.conditionLabels ?? {});
  return {
    id: extraction.proposedSourceId,
    ...fields,
    study: {
      population:
        facts[0]?.fact ??
        extraction.extraction.designNote ??
        'Population details are recorded in the accepted extraction.',
      sampleSize: null,
      durationWeeks: null,
      intervention:
        conditions.join('; ') || extraction.extraction.designNote || '',
      comparator: extraction.extraction.contrastType ?? '',
      outcomes: (extraction.extraction.question ?? []).map(
        (question) => `SBLA-009 ${question}`,
      ),
    },
    projectSummary:
      extraction.extraction.researchRoleInference ??
      extraction.extraction.designNote ??
      'Included in the accepted SBLA-009 evidence slice.',
  };
}

/** @param {DraftClaim} claim */
function claimRecord(claim) {
  return {
    id: claim.id,
    type: claim.type,
    statement: claim.statement,
    plainLanguage: claim.plainLanguage,
    scope: claim.scope,
    qualifiers: claim.qualifiers,
    evidence: claim.evidence,
    sourceLinks: claim.sourceLinks,
    ...lifecycle,
  };
}

async function expectedFiles() {
  const claimArtifact = /** @type {{claims: DraftClaim[]}} */ (
    JSON.parse(await readFile(claimsPath, 'utf8'))
  );
  const extractionArtifact = /** @type {{extractions: SourceExtraction[]}} */ (
    JSON.parse(await readFile(extractionsPath, 'utf8'))
  );
  const knownClaimIds = new Set(claimArtifact.claims.map((claim) => claim.id));
  const linkedSourceIds = new Set(
    claimArtifact.claims.flatMap((claim) =>
      claim.sourceLinks.map((link) => link.sourceId),
    ),
  );
  const extractionBySourceId = new Map(
    extractionArtifact.extractions.map((extraction) => [
      extraction.proposedSourceId,
      extraction,
    ]),
  );
  const files = new Map();

  for (const claim of claimArtifact.claims) {
    const record = assertValid(
      'claim',
      claimRecord(claim),
      `content/claims/${claim.id}.json`,
    );
    files.set(`content/claims/${claim.id}.json`, await formattedJson(record));
  }

  for (const sourceId of [...linkedSourceIds].sort()) {
    const extraction = extractionBySourceId.get(sourceId);
    if (!extraction) {
      throw new Error(
        `Approved claim references missing extraction ${sourceId}.`,
      );
    }
    const record = assertValid(
      'source',
      sourceRecord(extraction),
      `content/sources/${sourceId}.json`,
    );
    files.set(`content/sources/${sourceId}.json`, await formattedJson(record));
  }

  for (const pageInput of pageInputs) {
    const markdown = await readFile(
      path.join(repositoryRoot, pageInput.source),
      'utf8',
    );
    const claimIds = claimIdsInMarkdown(markdown, knownClaimIds);
    if (claimIds.length === 0) {
      throw new Error(`${pageInput.source} contains no approved claim IDs.`);
    }
    const common = {
      id: pageInput.id,
      ...lifecycle,
      name: pageInput.name,
      slug: pageInput.id,
      aliases: pageInput.aliases,
      summaryClaimIds: claimIds.slice(0, 2),
      sections: [
        {
          id: 'reviewed-evidence',
          title: 'Reviewed evidence',
          claimIds,
        },
      ],
    };
    const record =
      pageInput.kind === 'muscle'
        ? assertValid(
            'muscle',
            { ...common, ontology: pageInput.ontology },
            `content/muscles/${pageInput.id}.json`,
          )
        : assertValid(
            'exercise',
            {
              ...common,
              equipmentIds: [],
              movementPatternIds: [],
              relatedEntityIds: pageInput.relatedEntityIds,
              projectDefinition: {
                editorial: true,
                included: pageInput.included,
                excluded: pageInput.excluded,
              },
            },
            `content/exercises/${pageInput.id}.json`,
          );
    files.set(
      `content/${pageInput.kind === 'muscle' ? 'muscles' : 'exercises'}/${pageInput.id}.json`,
      await formattedJson(record),
    );
  }

  return files;
}

const files = await expectedFiles();
const mismatches = [];
for (const [relativePath, expected] of files) {
  const absolutePath = path.join(repositoryRoot, relativePath);
  if (mode === 'write') {
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, expected, 'utf8');
    continue;
  }
  let actual = null;
  try {
    actual = await readFile(absolutePath, 'utf8');
  } catch {
    // Report the missing file with the same deterministic mismatch message.
  }
  if (actual !== expected) mismatches.push(relativePath);
}

if (mismatches.length > 0) {
  console.error('SBLA-009 promotion snapshot is stale:');
  for (const relativePath of mismatches) console.error(`- ${relativePath}`);
  console.error('Run pnpm content:slice:promote and review the exact diff.');
  process.exitCode = 1;
} else {
  console.log(
    `SBLA-009 promotion ${mode === 'write' ? 'wrote' : 'verified'} ${files.size} production records.`,
  );
}
