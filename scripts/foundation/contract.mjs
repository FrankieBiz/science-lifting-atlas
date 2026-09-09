export const REQUIRED_SCRIPTS = Object.freeze([
  'verify',
  'test:e2e',
  'test:a11y',
  'test:visual',
  'test:performance',
  'evidence:status',
]);

export const EXPECTED_PACKAGE_MANAGER = 'pnpm@11.24.0';

export const REQUIRED_VERIFY_STEPS = Object.freeze([
  'pnpm format:check',
  'pnpm lint',
  'pnpm typecheck',
  'pnpm test',
  'pnpm validate:content',
  'pnpm validate:graph',
  'pnpm evidence:status',
  'pnpm build',
  'pnpm verify:foundation',
  'pnpm assets:decision',
]);

export const REQUIRED_PATHS = Object.freeze([
  '.github/pull_request_template.md',
  '.github/workflows/ci.yml',
  '.github/workflows/source-status.yml',
  'docs/adr',
  'docs/editorial-style.md',
  'docs/evidence-methodology.md',
  'docs/licenses/anatomy-assets.md',
  'docs/product',
  'docs/runbooks',
  'content/anatomy-regions',
  'content/muscles',
  'content/muscle-subdivisions',
  'content/bone-landmarks',
  'content/joints',
  'content/joint-actions',
  'content/movement-patterns',
  'content/exercises',
  'content/exercise-variations',
  'content/equipment',
  'content/claims',
  'content/sources',
  'content/assets',
  'content/approval-manifests',
  'content/glossary',
  'content/changes',
  'content-drafts/muscles',
  'content-drafts/exercises',
  'content-drafts/syntheses',
  'research/questions',
  'research/searches',
  'research/screening',
  'research/extractions',
  'research/appraisals',
  'research/syntheses',
  'research/packets',
  'reviews/evidence',
  'reviews/citations',
  'reviews/ux',
  'reviews/releases',
  'public/anatomy/manifests',
  'public/anatomy/models',
  'public/anatomy/posters',
  'public/anatomy/attributions',
  'public/exercise-media',
  'public/fonts',
  'scripts/blender',
  'scripts/content',
  'scripts/evidence',
  'scripts/foundation',
  'scripts/graph',
  'scripts/release',
  'src/components',
  'src/content.config.ts',
  'src/features/anatomy-explorer',
  'src/features/comparison',
  'src/features/evidence',
  'src/features/search',
  'src/layouts',
  'src/lib/content',
  'src/lib/evidence',
  'src/lib/graph',
  'src/lib/seo',
  'src/pages',
  'src/styles',
  'tests/unit',
  'tests/integration',
  'tests/e2e',
  'tests/accessibility',
  'tests/performance',
  'tests/visual',
  'tests/fixtures',
]);

export const REQUIRED_WORKFLOW_SNIPPETS = Object.freeze({
  '.github/workflows/ci.yml': Object.freeze([
    'contents: read',
    'timeout-minutes: 20',
    'uses: actions/checkout@v6',
    'uses: pnpm/setup@v2',
    'version: 11.24.0',
    'runtime: node@24.20.0',
    'install: false',
    'pnpm install --frozen-lockfile',
    'pnpm verify',
    'pnpm exec playwright install --with-deps chromium',
    'pnpm test:e2e',
  ]),
  '.github/workflows/source-status.yml': Object.freeze([
    'SBLA-001 foundation mode only',
    'contents: read',
    'workflow_dispatch:',
    'schedule:',
    'cron:',
    'uses: pnpm/setup@v2',
    'version: 11.24.0',
    'runtime: node@24.20.0',
    'install: false',
    'pnpm install --frozen-lockfile',
    'pnpm evidence:status',
  ]),
});

/**
 * @typedef {object} PackageManifest
 * @property {string} [packageManager]
 * @property {Record<string, string>} [scripts]
 */

/**
 * @typedef {object} FoundationInput
 * @property {PackageManifest} packageJson
 * @property {Set<string>} existingPaths
 * @property {Map<string, string>} [fileContents]
 */

/** @param {unknown} verifyScript */
function hasOrderedVerifySteps(verifyScript) {
  if (typeof verifyScript !== 'string') return false;

  const commands = verifyScript.split('&&').map((command) => command.trim());
  let lastIndex = -1;

  for (const step of REQUIRED_VERIFY_STEPS) {
    const index = commands.indexOf(step);
    if (index <= lastIndex) return false;
    lastIndex = index;
  }

  return true;
}

/** @param {FoundationInput} input */
export function validateFoundation({
  packageJson,
  existingPaths,
  fileContents = new Map(),
}) {
  const issues = [];

  for (const script of REQUIRED_SCRIPTS) {
    if (!packageJson.scripts?.[script]) {
      issues.push(`missing package script: ${script}`);
    }
  }

  if (packageJson.packageManager !== EXPECTED_PACKAGE_MANAGER) {
    issues.push(
      `packageManager must be ${EXPECTED_PACKAGE_MANAGER}; received ${packageJson.packageManager ?? 'missing'}`,
    );
  }

  if (!hasOrderedVerifySteps(packageJson.scripts?.verify)) {
    issues.push(
      'verify script must contain every required step in the canonical order',
    );
  }

  for (const path of REQUIRED_PATHS) {
    if (!existingPaths.has(path)) {
      issues.push(`missing required path: ${path}`);
    }
  }

  for (const [filePath, snippets] of Object.entries(
    REQUIRED_WORKFLOW_SNIPPETS,
  )) {
    const content = fileContents.get(filePath) ?? '';
    for (const snippet of snippets) {
      if (!content.includes(snippet)) {
        issues.push(
          `workflow missing required content: ${filePath} -> ${snippet}`,
        );
      }
    }
  }

  return issues;
}
